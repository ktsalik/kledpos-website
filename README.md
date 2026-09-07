# KledPOS static website

The site is plain HTML and CSS, with local fonts and inline SVG icons. A small vanilla JavaScript file submits the contact form without leaving the page. `contact.php` is the only server-side script; the form also works with JavaScript disabled. Source changes are maintained in Git; no ZIP packaging or build step is needed.

## Development

Requires PHP 8.1 or newer with cURL. Copy `.env.example` to `.env.local` if the local file does not already exist, and fill in `RESEND_API_KEY`. Keep the local file out of Git; it is already ignored.

```sh
php -S 127.0.0.1:3002 contact.php
```

Open http://127.0.0.1:3002. Pass `contact.php` as the router as shown: it serves the website assets and blocks requests to environment files, repository files, and other development files. Restart an existing development server with this command if it was started without the router.

For your local Apache site at http://localhost/kledpos-website/, `.env.local` contains `APP_ENV=development`. The handler honors this local setting on Apache and PHP-FPM, so no separate development server is needed. Keep the included `.htaccess` file in place to block access to local secrets and Git metadata.

The PHP development server also automatically selects development mode. It reads `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL` from `.env.local`; server environment values take precedence. Both development and production default to **KledPOS <noreply@kledpos.com> → contact@kledpos.com**, using the verified domain.

Both environments require a Resend API key with permission to send from the verified `kledpos.com` domain.

For development on another PHP server, set `APP_ENV=development` in `.env.local` or the server environment and prevent HTTP access to `.env.local`. Environment selection never trusts a browser-supplied Host header.

## Production

Deploy from the Git repository to a PHP-enabled host, publishing only:

- `index.html`
- `favicon.svg`
- `assets/`
- `contact.php`

The site supports installation in a subdirectory. Do not expose environment files, the Git directory, tests, or old generated folders. The existing Sites metadata is retained for reference; Sites/Cloudflare Workers cannot execute PHP.

Configure these **server environment variables** in your hosting control panel or PHP-FPM pool:

| Variable | Production value |
| --- | --- |
| `APP_ENV` | `production` (also the default outside PHP's built-in development server) |
| `RESEND_API_KEY` | A Resend API key allowed to send from the production domain |
| `RESEND_FROM_EMAIL` | `KledPOS <noreply@kledpos.com>` (default); verify `kledpos.com` in the Resend account |
| `RESEND_TO_EMAIL` | `contact@kledpos.com` (default in both environments) |

An explicit server setting of `APP_ENV=production` overrides the local file and does not load `.env.local`. Without an explicit setting, a local `APP_ENV=development` opts into development mode; never deploy `.env.local`. Production defaults to `KledPOS <noreply@kledpos.com>` and rejects the Resend development domain. Missing API keys, invalid senders, missing cURL, and invalid environment settings return an error without sending. Never put API keys in committed source, HTML, or JavaScript.

Resend is the only transport; PHP `mail()` is never used and `CONTACT_TRANSPORT` is no longer supported. A form success requires a successful Resend API response with a message ID. The ID is recorded in the PHP error log for checking delivery in Resend. Provider acceptance is distinct from eventual inbox delivery; inspect the message's delivery status for bounces or delays. HTTP/cURL error codes are logged on failures without submitted personal details or credentials.

Only the phone field is required, matching the original form. The handler validates field types, lengths, optional email addresses, and the hidden spam field. Failed submissions return an error and the JavaScript keeps the entered details available for retry.

## Edit and verify

Edit `index.html`, `assets/style.css`, or `assets/contact.js` directly. Fonts are served locally from `assets/fonts/`.

```sh
php -l contact.php
node --check assets/contact.js
python3 tests/test-contact.py
```

Node is optional and used only for the JavaScript syntax check. The automated contact checks mock Resend and never send email. They cover development file loading, environment precedence, production sender requirements, payloads, validation, network errors, rejected requests, and malformed success responses.

