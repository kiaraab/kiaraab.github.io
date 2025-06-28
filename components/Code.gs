/**
 * Utility functions for handling contact form submissions.
 */

/**
 * Handles the logic for storing the form submission and sending emails.
 * @param {string} name Name of the user
 * @param {string} email Email address of the user
 * @param {string} message Message from the user
 * @param {Date} [timestamp=new Date()] Timestamp for the submission
 */
function handleSubmission(name, email, message, timestamp) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([timestamp || new Date(), name, email, message]);

  var adminEmail = "raabkiara2@gmail.com"; // <-- change to your email

  var subject = "Thank you for contacting Kiara Raab!";
  var body = "Hi " + name + ",\n\nThank you for reaching out! I have received your message:\n\n\"" + message + "\"\n\nI'll get back to you as soon as I can.\n\nBest,\nKiara Raab";

  MailApp.sendEmail(email, subject, body);

  var adminBody = "New contact form submission:\n\nName: " + name + "\nEmail: " + email + "\nMessage:\n" + message;
  MailApp.sendEmail(adminEmail, "New Contact Form Submission", adminBody);
}

/**
 * Web app entry point for POST requests from the website form.
 * @param {Object} e The event object
 * @returns {ContentService.TextOutput}
 */
function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  handleSubmission(params.name, params.email, params.message, new Date());

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Triggered when a Google Form linked to this spreadsheet is submitted.
 * The trigger must be installed manually via setupTrigger().
 * @param {GoogleAppsScript.Events.FormsOnFormSubmit} e Event object
 */
function onFormSubmit(e) {
  var values = e.namedValues || {};
  var name = (values.name || values.Name || [])[0] || e.values[1];
  var email = (values.email || values.Email || [])[0] || e.values[2];
  var message = (values.message || values.Message || [])[0] || e.values[3];
  handleSubmission(name, email, message, new Date());
}

/**
 * Helper to install the onFormSubmit trigger. Run once manually.
 */
function setupTrigger() {
  ScriptApp.newTrigger("onFormSubmit")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();
}

/**
 * Responds to HTTP OPTIONS requests (preflight requests)
 * @param {Object} e - The event object from the OPTIONS request
 * @returns {Object} - An empty JSON object
 */
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
