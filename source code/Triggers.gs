function createSignUpTrigger() {
  var form = FormApp.openById(form_id);  // id obtained using getSignUpFormIdHelper()
  createFormTrigger(form, "onSignUp");
}

function createFormTrigger(form, func) {
  ScriptApp.newTrigger(func)
      .forForm(form)
      .onFormSubmit()
      .create();
}

function onSignUp(e) {
  var len = e.source.getResponses().length;
  // apps script has a max of 20 triggers per script => each user has form with trigger so max 20 users
  // bypass by creating multiple copies of code and changing which script executes main
  // based on number of responses
  if (len < 3) // CHANGE ME
    main();
}

function onFormSubmit(e) {
  var form = e.source;
  // block access to form until it is updated
  form.setCustomClosedFormMessage("This form is currently processing a submission, checking for matches, and updating accordingly.\n\n"
      +"This process should take up to 30 seconds. Please refresh your page.");
  form.setAcceptingResponses(false);

  var formatted;
  var candidates; // candidates spreadsheet not to be confused with candidates dict in sign ups

  var file = DriveApp.getFileById(form.getId());
  var folder = file.getParents().next();
  var [_, formatted, candidates] = getFilesInFolder(folder);
  
  performOperations(form, e.response, formatted, candidates, folder.getName());
  form.setAcceptingResponses(true);
}

function performOperations(form, response, formatted, candidates, id) {
  createUserDatabase();

  formatResponse(response, formatted, candidates);
  processFormatted(formatted, id);
  SpreadsheetApp.flush();

  var [_, _, types, _, _, _, _, _] = searchDatabase(id);
  updateForm(form, candidates, types);
}