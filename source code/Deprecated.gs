/* originally in Databases */

function getServicedUsers() {
  var sheet = SpreadsheetApp.openById("14gJ4Ix2MSbhrfdC51MB1Rqvk-x01MNJCR_ST_CzcTDM"); // id obtained using getSpreadsheetIdHelper()
  var data = sheet.getDataRange().getValues();

  data.forEach(function(user) {
    serviced.push(user[0]);
    forms.push(user[1]);
  });
}

/* originally in Responses Formatting */

function clearRaw(raw, form) {
  if (raw.getLastRow() == 1) // nothing to clear
    return;
  
  form.deleteAllResponses();

  var sheet = raw.getActiveSheet();
  for (var i = raw.getLastRow(); i >= 2; i--)
    sheet.deleteRow(i);
}

/*
function updateFormatted() {
  var forms_folder = DriveApp.getFolderById("1H7_BqNI_zu2GbXfnNcKOunmP2etuyjl8"); // id obtained using getFolderIdHelper()

  var user_folders = forms_folder.getFolders();
  while (user_folders.hasNext()) {
    var folder = user_folders.next();

    var raw;
    var formatted;
    var candidates; // candidates spreadsheet not to be confused with candidates dict in sign ups
    // var form;

    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();

      if (file.getName().includes("Raw"))
        raw = SpreadsheetApp.open(file);
      else if (file.getName().includes("Formatted"))
        formatted = SpreadsheetApp.open(file);
      else if (file.getName().includes("Candidates"))
        candidates = SpreadsheetApp.open(file);
      // else if (file.getName().includes("Matching Form"))
      //   form = FormApp.openById(file.getId());
    }
    
    formatResponses(raw, formatted, candidates);
    // clearRaw(raw, form);
  }
}

function formatResponses(raw, formatted, candidates) {
  createSheets(formatted);
  copyRepsonses(raw, formatted, candidates);
}
*/

/*
function copyRepsonses(raw, formatted, candidates) {
  var data = raw.getDataRange().getValues();

  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    processRow(row, headers, formatted, candidates);
  }
}

function processRow(row, headers, formatted, candidates) {
  for (var i = 0; i < row.length; i++) {
    var element = row[i];

    if (element == "Yes") {
      var name = headers[i].substring(42); // removes "I am submitting my likes and dislikes for " leaving the candidate's name
      processElement(name, row, i-1, headers, formatted, candidates);
    }
  }
}

function processElement(name, row, i, headers, formatted, candidates) {
  var unmatched = formatted.getSheetByName("Unmatched");

  // copy name and id
  var data = candidates.getDataRange().getValues();
  var id = getIdFromName(name, data, headers, i, candidates);
  unmatched.appendRow([id, name]);

  // copy likes/dislikes
  while (headers[i].includes(name)) {
    var index = 6;
    if (headers[i].includes("Friendships without Benefits"))
      index = 3;
    else if (headers[i].includes("Friendships with Benefits"))
      index = 4;
    else if (headers[i].includes("Relationships without Sex"))
      index = 5;
    
    unmatched.getRange(unmatched.getLastRow(), index).setValue(row[i]);
    i--;
  }
}

*/

/* this implementation is inefficient if two candidates have the same name, but more efficient if not
 we expect two candidates having the same name to be rare */
function getIdFromName(name, data, row, i, candidates) {
  var ids = [];

  var index = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == name) {
      ids.push(data[i][0]);
      index = i+1;
    }
  }

  // no two people with the same name
  if (ids.length == 1) {
    candidates.deleteRow(index);
    return ids[0];
  }
  
  /* WARNING: UNTESTED CODE */ // TODO: test
  // check for number of previous people with same name
  var prev = 0;
  while (i >= 0) {
    while (row[i].includes(name) && !row[i].includes("sumbit")) { i--; } // move past all instances of this person
    prev++;
    while (i >= 0 && !row[i].includes(name)) { i--; } // move past anyone with a different name
  }

  // get id of name with same position in candidates list
  var id = ids[0];
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == name)
      if (prev > 1) prev--;
      else {
        id = data[i][0];
        index = i+1;
        break;
      }
  }

  candidates.deleteRow(index);
  return id;
  /* END UNTESTED CODE */
}

/* originally in Match Checker */

function checkMatches() {
  var formatted_files = DriveApp.searchFiles("title contains 'Responses'");

  while (formatted_files.hasNext()) {
    var formatted_file = formatted_files.next();
    if (formatted_file.getName().includes("Template"))
      continue;
    
    var folder = formatted_file.getParents().next();
    processFormatted(SpreadsheetApp.open(formatted_file), folder.getName());
  }
}

/* originally in Form Update */

function updateForms() {
  var forms_folder = DriveApp.getFolderById("1H7_BqNI_zu2GbXfnNcKOunmP2etuyjl8"); // id obtained using getFolderIdHelper()

  var user_folders = forms_folder.getFolders();
  while (user_folders.hasNext()) {
    var folder = user_folders.next();
    var [_, _, types, _, _, _, _, _] = searchDatabase(folder.getName());

    var form;
    var candidates;

    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();

      if (file.getName().includes("Matching Form"))
        form = FormApp.openById(file.getId());
      else if (file.getName().includes("Candidates"))
        candidates = SpreadsheetApp.open(file);
    }
    
    updateForm(form, candidates, types);
  }
}