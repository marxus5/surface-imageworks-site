# SURFACE IMAGEWORKS

Static single-page site (HTML, CSS, vanilla JS). No build step.

```
index.html
favicon.svg
robots.txt
sitemap.xml
vercel.json
assets/
  css/styles.css
  js/main.js
  img/            (put real photography here)
```

## Run locally
- VS Code: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".
- Or from a terminal in this folder: `npx serve`

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: Add New > Project > import the repo. Framework preset: Other. Leave build command and output directory empty.
3. Add your domain under Project > Settings > Domains.

Or from a terminal: `npx vercel` (preview) then `npx vercel --prod`.

## Site details
- The public domain is `surfaceimageworks.com`; canonical, social, structured-data, robots, and sitemap URLs use it.
- Quote requests open the visitor's email app and are addressed to `contact@surfaceimageworks.com`.
- The material artwork is generated for illustration. Replace it with approved production imagery when available; the material definitions are in `assets/js/main.js`.
- Production specifications are agreed per project and can be added to the section in `index.html` when confirmed.
- Update `sitemap.xml` if you add pages.
