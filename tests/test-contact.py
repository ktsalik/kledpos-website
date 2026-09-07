"""Run with python3 tests/test-contact.py. Resend is mocked; no real emails sent."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as directory:
    temp = Path(directory)
    handler = temp / 'contact.php'
    handler.write_text((ROOT / 'contact.php').read_text().replace('declare(strict_types=1);', 'declare(strict_types=1); namespace ContactTest; use Throwable;'))
    (temp / '.env.local').write_text('RESEND_API_KEY="re_local_test"\nRESEND_TO_EMAIL=test@example.com\n')
    capture = temp / 'request.json'
    runner = temp / 'run.php'
    runner.write_text('''<?php
namespace ContactTest;
// Namespaced cURL fakes capture requests without accessing the network.
foreach (['CURLOPT_POST', 'CURLOPT_HTTPHEADER', 'CURLOPT_POSTFIELDS', 'CURLOPT_RETURNTRANSFER',
          'CURLOPT_CONNECTTIMEOUT', 'CURLOPT_TIMEOUT', 'CURLINFO_RESPONSE_CODE'] as $i => $name) if (!defined($name)) define($name, $i + 1);
function curl_init($url) { if ($url !== 'https://api.resend.com/emails') throw new Exception('Wrong URL'); return true; }
function curl_setopt_array($curl, $options) { file_put_contents(getenv('TEST_CAPTURE'), json_encode(['payload' => $options[CURLOPT_POSTFIELDS], 'headers' => $options[CURLOPT_HTTPHEADER]])); return true; }
function curl_exec($curl) { return getenv('TEST_NETWORK') ? false : (getenv('TEST_RESPONSE') ?: '{"id":"49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"}'); }
function curl_getinfo($curl, $option) { return (int) (getenv('TEST_CODE') ?: 200); }
function curl_errno($curl) { return getenv('TEST_NETWORK') ? 28 : 0; }
function curl_close($curl) {}
$_SERVER['REQUEST_METHOD'] = getenv('TEST_METHOD') ?: 'POST';
$_SERVER['HTTP_ACCEPT'] = getenv('TEST_ACCEPT') ?: 'application/json';
$_SERVER['CONTENT_LENGTH'] = getenv('TEST_LENGTH') ?: '100';
$_POST = json_decode(getenv('TEST_PAYLOAD'), true);
register_shutdown_function(function () { fwrite(STDERR, 'STATUS:' . http_response_code()); });
require getenv('TEST_HANDLER');
''')
    count = 0
    def check(payload, expected, **overrides):
        global count
        capture.unlink(missing_ok=True)
        env = {k: v for k, v in os.environ.items() if not k.startswith(('RESEND_', 'APP_ENV', 'TEST_'))}
        env.update(TEST_PAYLOAD=json.dumps(payload), TEST_HANDLER=str(handler), TEST_CAPTURE=str(capture),
                   APP_ENV='development', RESEND_API_KEY='re_fake', RESEND_TO_EMAIL='test@example.com')
        env.update(overrides)
        env = {k: v for k, v in env.items() if v is not None}
        result = subprocess.run(['php', '-n', str(runner)], env=env, text=True, capture_output=True)
        assert result.returncode == 0, result.stdout + result.stderr
        assert f'STATUS:{expected}' in result.stderr, result.stdout + result.stderr
        assert 're_fake' not in result.stdout + result.stderr
        if overrides.get('TEST_ACCEPT') != 'text/html': assert json.loads(result.stdout)['message']
        count += 1
        request = json.loads(capture.read_text()) if capture.exists() else None
        if expected in (400, 405, 413, 503): assert request is None
        return result.stdout, request
    check({}, 405, TEST_METHOD='GET')
    check({}, 400)
    check({'phone': ['123']}, 400)
    check({'phone': '123', 'email': 'bad'}, 400)
    check({'phone': '123', 'email': 'me@example.com\r\nBcc: other@example.com'}, 400)
    check({'phone': '123', 'message': 'α' * 2001}, 400)
    check({'phone': '123'}, 413, TEST_LENGTH='17000')
    check({'website': 'spam'}, 400)
    _, request = check({'phone': '6912345678', 'name': 'Δοκιμή', 'email': 'customer@example.com', 'message': '<test> & ελληνικά'}, 200,
                       RESEND_FROM_EMAIL='KledPOS <production@example.com>')
    payload = json.loads(request['payload'])
    assert payload['from'] == 'KledPOS <production@example.com>'
    assert payload['reply_to'] == 'customer@example.com'
    assert 'Δοκιμή' in payload['text'] and '<test> & ελληνικά' in payload['text']
    assert 'Authorization: Bearer re_fake' in request['headers']
    _, request = check({'phone': '123'}, 200, RESEND_API_KEY=None, RESEND_TO_EMAIL=None)
    assert 'Authorization: Bearer re_local_test' in request['headers']
    assert json.loads(request['payload'])['to'] == ['test@example.com']
    _, request = check({'phone': '123'}, 200, APP_ENV='production', RESEND_FROM_EMAIL='KledPOS <contact@example.com>')
    assert json.loads(request['payload'])['from'] == 'KledPOS <contact@example.com>'
    assert 'reply_to' not in json.loads(request['payload'])
    check({'phone': '123'}, 503, RESEND_API_KEY='')
    check({'phone': '123'}, 503, APP_ENV='production', RESEND_API_KEY=None, RESEND_FROM_EMAIL='contact@example.com')
    check({'phone': '123'}, 200, APP_ENV='production')
    check({'phone': '123'}, 200, APP_ENV=None)
    (temp / '.env.local').write_text('APP_ENV=development\nRESEND_API_KEY=re_local_test\nRESEND_TO_EMAIL=test@example.com\n')
    _, request = check({'phone': '123'}, 200, APP_ENV=None, RESEND_API_KEY=None)
    assert json.loads(request['payload'])['from'] == 'KledPOS <noreply@kledpos.com>'
    check({'phone': '123'}, 503, APP_ENV='production', RESEND_API_KEY=None, RESEND_FROM_EMAIL='contact@example.com')
    check({'phone': '123'}, 503, APP_ENV='typo')
    check({'phone': '123'}, 503, APP_ENV='production', RESEND_FROM_EMAIL='onboarding@resend.dev')
    check({'phone': '123'}, 503, RESEND_TO_EMAIL='invalid')
    _, request = check({'phone': '123'}, 200, APP_ENV='production', RESEND_TO_EMAIL='')
    assert json.loads(request['payload'])['from'] == 'KledPOS <noreply@kledpos.com>'
    assert json.loads(request['payload'])['to'] == ['contact@kledpos.com']
    _, request = check({'phone': '123'}, 200, RESEND_TO_EMAIL='')
    assert json.loads(request['payload'])['from'] == 'KledPOS <noreply@kledpos.com>'
    assert json.loads(request['payload'])['to'] == ['contact@kledpos.com']
    check({'phone': '123'}, 502, TEST_CODE='403', TEST_RESPONSE='{"message":"restricted sender"}')
    restricted = json.dumps({'name': 'validation_error', 'message': 'You can only send testing emails to your own email address (owner@example.com).'})
    output, _ = check({'phone': '123'}, 502, TEST_CODE='403', TEST_RESPONSE=restricted)
    assert 'onboarding@resend.dev' in json.loads(output)['message']
    assert 'owner@example.com' not in output
    output, _ = check({'phone': '123'}, 502, APP_ENV='production', TEST_CODE='403', TEST_RESPONSE=restricted)
    assert 'onboarding@resend.dev' not in json.loads(output)['message']
    check({'phone': '123'}, 502, TEST_CODE='401')
    check({'phone': '123'}, 502, TEST_CODE='429')
    check({'phone': '123'}, 502, TEST_CODE='500')
    check({'phone': '123'}, 502, TEST_RESPONSE='not json')
    check({'phone': '123'}, 502, TEST_RESPONSE='{}')
    check({'phone': '123'}, 502, TEST_RESPONSE='{"id":123}')
    check({'phone': '123'}, 502, TEST_NETWORK='1')
    html, _ = check({}, 400, TEST_ACCEPT='text/html')
    assert 'index.html#contact' in html and '<!doctype html>' in html
print(f'{count} checks passed: development/production configuration, Resend payloads, and failure handling. No emails sent.')
