# BRIX — Men's Accessories Storefront

A responsive storefront concept built with plain HTML, CSS and JavaScript.

## Run locally

Open `index.html` in a browser, or use VS Code Live Server. Product detail pages use URLs such as `product.html?id=bracelet-01`.

## Included

- Mobile-first homepage with separate shelves for 4 bracelets, 4 watches and 3 chains.
- A separate detail view for every product (shared `product.html` template with a unique product ID).
- English product names, concise Arabic product descriptions and styling notes, and EGP prices.
- Product prices: bracelets EGP 450–600, watches EGP 1,250–1,800, chains EGP 400–500.
- No Add to Bag button on the product cards; the add action appears on each product detail page.
- Shopping bag persists between pages using localStorage.
- Responsive mobile, tablet and desktop layouts; scroll reveals and subtle image transitions.

## Before taking real orders

1. Add the BRIX WhatsApp number in `js/catalog.js` under `whatsappNumber` (international format without `+`, e.g. `201xxxxxxxxx`).
2. Confirm product names, prices, availability and descriptions against the actual products.
3. Image sources are the Pinterest CDN links supplied in the conversation. Pinterest returned HTTP 403 to the automated preview/download environment, so images remain linked externally instead of being copied into local assets. For a production site, save approved original image files in a local `assets/` folder and update the URLs in `js/catalog.js`.
4. Confirm that each image is assigned to the right category before publishing. Current category grouping follows the requested final totals (4 bracelets, 4 watches, 3 chains); the image host prevented independent visual verification here.

## Scope

Frontend-only prototype. It does not include a database, stock management, payment processing, admin dashboard or customer accounts. Brand/trademark clearance should be checked before commercial use.
