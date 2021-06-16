function updateForm(form, candidates_sheet, types) {
  candidates = [];

  var data = candidates_sheet.getDataRange().getValues();
  if (data != "")
    data.forEach(function(candidate) {
      var id = candidate[0];
      var [name, _, _, link, bio, _, _, gender] = searchDatabase(id);
      candidates.push([name, gender, link, bio]);
    });
  
  // form.deleteAllResponses();
  modifyForm(form, types);
}

/* the following are only for testing */

function updateFormsTester() {
  createDatabases();
  updateForms();
}