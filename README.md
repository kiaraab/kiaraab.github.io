## Serving the Site

Any static web server can host these files. During development you can run a quick server with Python:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000` in your browser.


## Project Structure

- `index.html` - Main landing page introducing Kiara
- `resume.html` - Detailed résumé with a PDF download link
- `assets/` - Stylesheets, images, JavaScript, and other resources

Open `index.html` to explore the site in your browser.

## HTML Components

The header and footer are shared across all pages. Each page includes
`<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`
placeholders. `assets/js/components.js` loads the markup from
`components/header.html` and `components/footer.html` so changes only need to be
made once.

## Google Apps Script

`components/Code.gs` handles saving contact form submissions to a spreadsheet
and sending confirmation emails. The script ensures the `onFormSubmit`
trigger exists whenever the spreadsheet opens or a web submission occurs.
If the trigger is missing, run `setupTrigger()` from the Apps Script editor.
