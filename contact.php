<?php
// PHP 8.1+ with cURL. Resend is the only email transport.
declare(strict_types=1);

// Also acts as the local development router: never serve secrets or repository files.
if (PHP_SAPI === 'cli-server') {
    $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
    if ($path !== '/contact.php') {
        if ($path === '/' || $path === '/index.html' || $path === '/favicon.svg'
            || (preg_match('~^/assets/[a-zA-Z0-9_./-]+\.(css|js|woff2|svg|png|jpg|webp)$~', $path)
                && !str_contains($path, '..') && is_file(__DIR__ . $path))) {
            return false;
        }
        http_response_code(404);
        exit('Not found');
    }
}

// Never select development mode from the request Host header.
$serverEnvironment = getenv('APP_ENV');
$localConfig = [];
// An explicit server mode takes priority; production never reads local secrets.
if (($serverEnvironment === false || $serverEnvironment === '' || $serverEnvironment === 'development')
    && is_file(__DIR__ . '/.env.local')) {
    foreach (file(__DIR__ . '/.env.local', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (preg_match('/^\s*(APP_ENV|RESEND_API_KEY|RESEND_FROM_EMAIL|RESEND_TO_EMAIL)\s*=\s*(.*?)\s*$/', $line, $match)) {
            $value = $match[2];
            if (strlen($value) >= 2 && (($value[0] === '"' && str_ends_with($value, '"'))
                || ($value[0] === "'" && str_ends_with($value, "'")))) {
                $value = substr($value, 1, -1);
            }
            $localConfig[$match[1]] = $value;
        }
    }
}
$environment = $serverEnvironment ?: ($localConfig['APP_ENV'] ?? (PHP_SAPI === 'cli-server' ? 'development' : 'production'));
$isDevelopment = $environment === 'development';
if (!$isDevelopment) $localConfig = [];

function configValue(string $name): string
{
    global $localConfig;
    $value = getenv($name);
    return trim($value !== false ? $value : ($localConfig[$name] ?? ''));
}
$key = configValue('RESEND_API_KEY');
$to = configValue('RESEND_TO_EMAIL') ?: 'contact@kledpos.com';
$from = configValue('RESEND_FROM_EMAIL') ?: 'KledPOS <noreply@kledpos.com>';
$success = 'Το μήνυμά σας στάλθηκε. Θα επικοινωνήσουμε σύντομα μαζί σας.';

function respond(int $status, string $message): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=UTF-8');
        $safe = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        echo '<!doctype html><html lang="el"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KledPOS | Επικοινωνία</title><link rel="icon" href="favicon.svg?v=kledpos-1" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css"><main class="contact-section"><div class="contact-copy"><h2>Επικοινωνία</h2><p role="status">' . $safe . '</p><p><a class="button" href="index.html#contact">Επιστροφή στη φόρμα</a></p></div></main></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Χρησιμοποιήστε τη φόρμα επικοινωνίας για αποστολή.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    respond(413, 'Το μήνυμα είναι πολύ μεγάλο.');
}

$fields = [];
foreach (['name' => 100, 'business' => 140, 'email' => 254, 'phone' => 30, 'message' => 2000, 'website' => 200] as $field => $limit) {
    $value = $_POST[$field] ?? '';
    if (!is_string($value) || preg_match('//u', $value) !== 1) {
        respond(400, 'Τα στοιχεία της φόρμας δεν είναι έγκυρα.');
    }
    $value = trim($value);
    if (preg_match_all('/./us', $value) > $limit || str_contains($value, "\0")) {
        respond(400, 'Ελέγξτε το μήκος των πεδίων της φόρμας.');
    }
    $fields[$field] = $value;
}
if ($fields['website'] !== '') respond(400, 'Τα στοιχεία της φόρμας δεν είναι έγκυρα.');
if ($fields['phone'] === '') respond(400, 'Συμπληρώστε το τηλέφωνό σας.');
if ($fields['email'] !== '' && !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    respond(400, 'Συμπληρώστε ένα έγκυρο email.');
}
if (!in_array($environment, ['development', 'production'], true) || !$key || !function_exists('curl_init')) {
    error_log('KledPOS contact: missing API key/cURL or invalid APP_ENV.');
    respond(503, 'Η αποστολή email δεν είναι προσωρινά διαθέσιμη.');
}
$senderAddress = preg_match('/<([^<>]+)>$/', $from, $senderMatch) ? $senderMatch[1] : $from;
if (preg_match('/[\r\n]/', $from . $to . $key) || !filter_var($to, FILTER_VALIDATE_EMAIL)
    || !filter_var($senderAddress, FILTER_VALIDATE_EMAIL)
    || (!$isDevelopment && str_ends_with(strtolower($senderAddress), '@resend.dev'))) {
    error_log('KledPOS contact: invalid recipient or production sender configuration.');
    respond(503, 'Η αποστολή email δεν είναι προσωρινά διαθέσιμη.');
}

$lines = ['Νέο αίτημα επικοινωνίας KledPOS'];
foreach (['name' => 'Ονοματεπώνυμο', 'business' => 'Επιχείρηση', 'email' => 'Email', 'phone' => 'Τηλέφωνο', 'message' => 'Μήνυμα'] as $field => $label) {
    if ($fields[$field] !== '') $lines[] = $label . ': ' . $fields[$field];
}
$body = implode("\n\n", $lines);
$subject = 'Νέο αίτημα επικοινωνίας KledPOS';
try {
    $payload = ['from' => $from, 'to' => [$to], 'subject' => $subject, 'text' => $body];
    if ($fields['email'] !== '') $payload['reply_to'] = $fields['email'];
    $curl = curl_init('https://api.resend.com/emails');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 20,
    ]);
    $result = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $networkError = curl_errno($curl);
    curl_close($curl);
    $response = is_string($result) ? json_decode($result, true) : null;
    $id = is_array($response) ? ($response['id'] ?? null) : null;
    if ($code < 200 || $code >= 300 || !is_string($id) || !preg_match('/^[a-f0-9-]{36}$/i', $id)) {
        // Log only status/error codes, never credentials, submitted details, or raw provider responses.
        error_log('KledPOS contact: Resend rejected or failed; HTTP=' . $code . '; curl=' . $networkError);
        if ($isDevelopment && $code === 403 && is_array($response)
            && is_string($response['message'] ?? null)
            && str_contains(strtolower($response['message']), 'only send testing emails to your own email address')) {
            respond(502, 'Το Resend επιτρέπει αποστολή από onboarding@resend.dev μόνο στο email του λογαριασμού σας. Για αποστολή στο ' . $to . ' χρειάζεται αποστολέας από επαληθευμένο domain.');
        }
        respond(502, 'Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.');
    }
    error_log('KledPOS contact: Resend accepted email; id=' . $id);
} catch (Throwable $error) {
    error_log('KledPOS contact: Resend request failed.');
    respond(502, 'Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.');
}
respond(200, $success);
