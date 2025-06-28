/**
 * Responds to HTTP POST requests
 * @param {Object} e - The event object from the POST request
 * @returns {Object} - A JSON object with a success message
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = JSON.parse(e.postData.contents);

  // Append data to sheet
  sheet.appendRow([new Date(), params.name, params.email, params.message]);

  // Send confirmation emails
  var userEmail = params.email;
  var userName = params.name;
  var userMsg = params.message;
  var adminEmail = "raabkiara2@gmail.com"; // <-- change to your email

  var subject = "Thank you for contacting Kiara Raab!";
  var body = "Hi " + userName + ",\n\nThank you for reaching out! I have received your message:\n\n\"" + userMsg + "\"\n\nI'll get back to you as soon as I can.\n\nBest,\nKiara Raab";

  // Email to user
  MailApp.sendEmail(userEmail, subject, body);

  // Email to admin
  var adminBody = "New contact form submission:\n\nName: " + userName + "\nEmail: " + userEmail + "\nMessage:\n" + userMsg;
  MailApp.sendEmail(adminEmail, "New Contact Form Submission", adminBody);

  return ContentService
    .createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
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
