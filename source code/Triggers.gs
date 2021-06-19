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
  var form = e.source;
  var len = form.getResponses().length;

  // apps script has a max of 20 triggers per script => each user has form with trigger so max 20 users
  // bypass by creating multiple copies of code and changing which script executes main
  // based on number of responses
  if (len < 20) {// CHANGE ME
    form.setCustomClosedFormMessage("This form is currently processing a submission from another user. "
      +"This process should take up to a minute. Please refresh your page.\n\nIf this form remains locked "
      +"for an extended period of time, reach out to us on Instagram at @iit.relationships or email us at "
      +"iitrelationships@gmail.com, and we will assist you in diagnosing the error.");
    form.setAcceptingResponses(false);
    main();
    form.setAcceptingResponses(true);
  } else if (len >= 381) { // INCLUDE THIS ONLY IN 20th SCRIPT COPY
    form.setCustomClosedFormMessage("We received more submissions than expected (over 350). As a result, "
        +"this form is currently closed.\nPlease contact @iit.relationships or iitrelationships@gmail.com "
        +"and request an increase in the max user limit.");
    form.setAcceptingResponses(false);
  }
}

function onFormSubmit(e) {
  var form = e.source;
  // block access to form until it is updated
  form.setCustomClosedFormMessage("This form is currently processing your submission, checking for matches, and updating accordingly."
      +"This process should take up to 30 seconds. Please refresh your page.\n\nIf this form remains locked after 30 seconds, reach "
      +"out to us on Instragram at @iit.relationships or email us at iitrelationships@gmail.com, and we will assist you in diagnosing "
      +"the error.");
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