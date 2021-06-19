var base_id = "1IoMpt_dicySoyL4lMFItWDwy5wyEoYgG";
var folder_id = "180ek8vN0Em5yvnoX3zTGA3bY7j4nrDDi";
var form_id = "1H-6Ww4FSvCEAVqZ_mkTqK7RWv7adSM8LUG5FptS25I0";
var responses_id = "14EPCbXZl7MQBzLFNR7KEtSem98-K6HsboDQ5jumxT-s";
var serviced_id = "1LfRNLIuc0DQeMcL8GD47cONaCSnj94UWFcvogL05PTM";

function getFilesInFolder(folder) {
  var form;
  var formatted;
  var candidates; // candidates spreadsheet not to be confused with candidates dict in sign ups

  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();

    if (file.getName().indexOf("Matching Form") != -1)
      form = FormApp.openById(file.getId());
    else if (file.getName().indexOf("Responses") != -1)
      formatted = SpreadsheetApp.open(file);
    else if (file.getName().indexOf("Candidates") != -1)
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

function getBaseIdHelper() {
  // TODO: implement var folder = ... depending on your directory structure
  var base = folder.getFoldersByName("IIT RaaS");
  console.log(base.next().getId());
}

// print id of matching forms folder
function getFolderIdHelper() {
  var folders = DriveApp.getFolderById(base_id).getFoldersByName("Matching Forms");
  console.log("folder_id: "+folders.next().getId());
}

// print id of sign-up form
function getSignUpFormIdHelper() {
  var folders = DriveApp.getFolderById(base_id).getFoldersByName("Sign-Up Form");
  var folder = folders.next();
  var form = folder.getFilesByName("Illinois Tech Relationships as a Service (RaaS) Sign-Up Form");
  console.log("form_id: "+form.next().getId());
}

// print ids of responses sheet for sign-up form and serviced users sheet
function getSpreadsheetIdHelper() {
  var folders = DriveApp.getFolderById(base_id).getFoldersByName("Sign-Up Form");
  var folder = folders.next();
  var sheet1 = folder.getFilesByName("Illinois Tech Relationships as a Service (RaaS) Sign-Up Form (Responses)");
  console.log("responses_id: "+sheet1.next().getId());

  var sheet2 = folder.getFilesByName("Serviced Users");
  console.log("serviced_id: "+sheet2.next().getId());
}