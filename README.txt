VYRON CLIENT WEBSITE
====================
Static site – no build step. Upload the whole folder to your host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel...) so index.html is in the web root.

Folder
  index.html        page markup
  css/style.css     all styling and animations
  js/config.js      EDIT THIS: links, reviews, profile pictures
  js/main.js        page logic (FAQ, carousel, animations)
  js/background.js  WebGL purple background shader
  assets/           logo, favicon, profile pictures (assets/pfp/1.jpg ... 7.jpg)

What to edit
  js/config.js  ->  LINKS (download, paid, discord) and REVIEWS (names + text)
  Swap profile pictures by replacing the files in assets/pfp/ (keep the same names, square images).
  Plan lists, FAQ and "Why Vyron" text live in index.html and js/main.js.
