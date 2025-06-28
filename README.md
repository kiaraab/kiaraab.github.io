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

## Google Apps Script

`components/Code.gs` handles saving contact form submissions to a spreadsheet
and sending confirmation emails. The script installs an `onFormSubmit`
trigger when the spreadsheet is opened. If the trigger is missing, run
`setupTrigger()` from the Apps Script editor.
