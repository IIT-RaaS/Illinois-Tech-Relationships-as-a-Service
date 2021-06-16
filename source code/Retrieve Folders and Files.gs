var folder_id = "1H7_BqNI_zu2GbXfnNcKOunmP2etuyjl8";
var form_id = "1uGBXbmh5H1XFMf7GwqvG2PS5SfhJOBGrYk7qU8RB2cA";
var responses_id = "1CqrQW3KBCAJPln5a37iSzlJQ-khpBClg2maJJ4jwuds";
var serviced_id = "14gJ4Ix2MSbhrfdC51MB1Rqvk-x01MNJCR_ST_CzcTDM";

function getFilesInFolder(folder) {
  var form;
  var formatted;
  var candidates; // candidates spreadsheet not to be confused with candidates dict in sign ups

  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();

    if (file.getName().includes("Matching Form"))
      form = FormApp.openById(file.getId());
    else if (file.getName().includes("Responses"))
      formatted = SpreadsheetApp.open(file);
    else if (file.getName().includes("Candidates"))
      candidates = SpreadsheetApp.open(file);
  }

  return [form, formatted, candidates];
}

/* the following are only for testing */

function runIdHelpers() {
  getFolderIdHelper();
  getSignUpFormIdHelper();
  getSpreadsheetIdHelper();
}

// print id of matching forms folder
function getFolderIdHelper() {
  var folders = DriveApp.getFoldersByName("Matching Forms");
  console.log("folder_id: "+folders.next().getId());
}

// print id of sign-up form
function getSignUpFormIdHelper() {
  var folders = DriveApp.getFoldersByName("Sign-Up Form");
  var folder = folders.next();
  var form = folder.getFilesByName("Illinois Tech Relationships as a Service (RaaS) Sign-Up Form");
  console.log("form_id: "+form.next().getId());
}

// print ids of responses sheet for sign-up form and serviced users sheet
function getSpreadsheetIdHelper() {
  var folders = DriveApp.getFoldersByName("Sign-Up Form");
  var folder = folders.next();
  var sheet1 = folder.getFilesByName("Illinois Tech Relationships as a Service (RaaS) Sign-Up Form (Responses)");
  console.log("responses_id: "+sheet1.next().getId());

  var sheet2 = folder.getFilesByName("Serviced Users");
  console.log("serviced_id: "+sheet2.next().getId());
}