# SURFACE IMAGEWORKS

Single-page site (HTML, CSS, vanilla JS) with a Vercel serverless contact endpoint.

```
index.html
favicon.svg
robots.txt
sitemap.xml
vercel.json
api/contact.js
assets/
  css/styles.css
  js/main.js
  img/            (put real photography here)
```

## Run locally
- VS Code: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".
- Or from a terminal in this folder: `npx serve`
- To test the contact form and serverless endpoint locally, use `npx vercel dev` after linking the project and configuring the environment variables below.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: Add New > Project > import the repo. Framework preset: Other. Leave build command and output directory empty.
3. Add your domain under Project > Settings > Domains.

Or from a terminal: `npx vercel` (preview) then `npx vercel --prod`.

## Site details
- The public domain is `surfaceimageworks.com`; canonical, social, structured-data, robots, and sitemap URLs use it.
- Quote requests are sent by the Vercel function in `api/contact.js` through Gmail SMTP to `surfaceimageworks@gmail.com`. Sample images (JPG, PNG, GIF, or WebP up to 3 MB) are attached to the email.
- To enable email sending:
  1. In the Google Account for `surfaceimageworks@gmail.com`, enable 2-Step Verification and create an App Password. Google may not offer App Passwords for every account configuration.
  2. In Vercel, open the project's **Settings > Environment Variables** and add `GMAIL_USER` (`surfaceimageworks@gmail.com`), `GMAIL_APP_PASSWORD` (the generated App Password), and `CONTACT_TO` (`surfaceimageworks@gmail.com`). Keep the App Password private; never commit it or put it in browser code.
  3. Redeploy after adding the variables. Submit a test request from the deployed site and check the Gmail inbox and spam folder.
- Quote submissions need a deployed Vercel site or `vercel dev`; they cannot send from a static Live Server preview. Gmail sending limits apply.
- The material artwork is generated for illustration. Replace it with approved production imagery when available; the material definitions are in `assets/js/main.js`.
- Production specifications are agreed per project and can be added to the section in `index.html` when confirmed.
- Update `sitemap.xml` if you add pages.
