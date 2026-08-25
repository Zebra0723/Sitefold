# Sitefold

The website for Sitefold, an independent web design studio and part of DailyOS.

Hand-written static HTML, CSS and JavaScript. No framework, no build step,
no dependencies — the repository is the site.

## Running it locally

    python3 -m http.server 8000

Then open http://localhost:8000

## Deploying (Vercel)

Import the repository at vercel.com/new with:

| Setting          | Value                    |
| ---------------- | ------------------------ |
| Framework Preset | Other                    |
| Root Directory   | `./`                     |
| Build Command    | leave blank              |
| Output Directory | leave blank              |
| Install Command  | leave blank              |

`vercel.json` handles clean URLs, asset caching and security headers.
Pushes to `main` deploy to production; every other branch gets a preview URL.

## Where to edit things

| What                | Where                                                |
| ------------------- | ---------------------------------------------------- |
| Prices              | `data-gbp="…"` attributes in the HTML                 |
| Currency rates      | `RATES` at the top of `assets/js/currency.js`         |
| Reviews             | `SF.reviews` at the top of `assets/js/reviews.js`     |
| Enquiry address     | `ENQUIRY_EMAIL` at the top of `assets/js/contact.js`  |
| Colours and type    | the custom properties in `assets/css/base.css`        |
