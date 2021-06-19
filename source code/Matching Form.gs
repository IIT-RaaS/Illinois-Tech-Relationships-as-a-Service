function generateForm(id, name, types) { 
  var title = "Illinois Tech RaaS Matching Form for " + name;
  var description = "The link to this form has been uniquely generated to match your interests "
      +"as specified in the sign-up form. PLEASE DO NOT SHARE THE LINK TO THIS FORM WITH ANYONE\n\n"
      +"Check back regularly! This form will show a maximum of five potential candidates who are "
      +"interested in relationships with matching criteria. It will be updated with additional "
      +"potential candidates as you fill it out and as more people sign up."
  var form = FormApp.create(title)  
      .setTitle(title)
      .setDescription(description)
      .setConfirmationMessage("Your likes and dislikes have been submitted and are being processed. "
          +"Start another submission to view more candidates.\n\nPlease note that it may take a few seconds "
          +"to finish processing your submission, and you will not have access to the form during that time.");
  form.setRequireLogin(false);

  var forms_folder = DriveApp.getFolderById(folder_id); // id obtained using getFolderIdHelper()
  var user_folder = forms_folder.createFolder(id);
  DriveApp.getFileById(form.getId()).moveTo(user_folder);
  
  modifyForm(form, types);
  createFormTrigger(form, "onFormSubmit");
  
  return [user_folder, form];
}

function modifyForm(form, types) {
  // clear form
  var items = form.getItems();
  while (items.length > 0)
    form.deleteItem(items.pop());

  var title = "To protect your anonymity, fake \"sign-ups\" have been included by the developers. THE "
      +"INFORMATION YOU SEE IN THE BIOGRAPHIES IS NOT NECESSARILY ACCURATE, but will be for anyone "
      +"you match with. Read more about this below."
  var description = "To ensure that those who sign up for this service remain anonymous to other users, "
      +"we have included dummy information for people who have directly stated that they do not intend "
      +"to make use of this service and consented to our creating fake accounts with their information. "
      +"This includes a fake biography for each of those people. However, you can only match with people "
      +"who have signed up for the service, and any biography you read for them is one they have written "
      +"themselves. Therefore, your seeing a biography in this form does not necessarily mean it "
      +"represents the views of the person named. This provides users the freedom to express their true "
      +"beliefs in biographies without fear of being condemned by their fellow peers."
  form.addSectionHeaderItem()
      .setTitle(title)
      .setHelpText(description);
  
  // checks if there are no candidates
  if (candidates.length == 0) {
    addNoCandidatesBlock(form);
    return form.getId();
  }
  
  var i = 0;
  candidates.some(function(info) {
    if (i == 5) // this is to ensure we only show a max of 5 candidates at a time
      return true;

    title = info[0];
    description = "Gender: "+info[1]+"\n\n"
        +"Link to Social Media/Photos: "+info[2]+"\n\n"
        +"Biography: "+info[3];
    form.addPageBreakItem()
        .setTitle(title)
        .setHelpText(description);
    
    title = "\"Like\" or \"Dislike\" "+info[0]+" for each of the following relationship types";
    description = "A \"like\" indicates that you would engage in this type of relationship with "+info[0]+", "
        +"whereas a \"dislike\" indicates you would not.";
    form.addGridItem()
        .setTitle(title)
        .setHelpText(description)
        .setRows(types)
        .setColumns(["Like", "Dislike"]);
        // .setRequired(true);
    
    /*  deprecated
    title = "I am submitting my likes and dislikes for "+name;
    description = "If you select \"Yes\", your likes/dislikes will be submitted for a potential match. "
        +"You will not be able to change your answer choices, and "+name+" will no longer appear on this "
        +"form. If you select \"No\", your likes/dislikes will not be submitted nor will they be saved, and "
        +name+" will continue to appear on this form until you select \"Yes\"."
    form.addMultipleChoiceItem()
        .setTitle(title)
        .setHelpText(description)
        .setChoiceValues(["Yes", "No"])
        .setRequired(true);
    */
    
    i++;
    return false;
  });

  // for (var i = 0; i < pages.length-1; i++)
  //   pages[i].setGoToPage(pages[i+1]);
  // pages[pages.length-1].setGoToPage(FormApp.PageNavigationType.SUBMIT);
  
  return form;
}

function addNoCandidatesBlock(form) {
  title = "You have no potential matches at this time. Please check this form again later.";
  description = "You will also be notified via the email you specified during sign-up when potential matches appear.";
  form.addSectionHeaderItem()
      .setTitle(title)
      .setHelpText(description);
}

/* the following are only for testing */

function generateFormTester() {
  // TODO: implement user, confirm, types, candidates
  console.log(generateForm(user, confirm, types, candidates));
}

function modifyFormTester() {
  // TODO: implement types, candidates
  var id = "1d83HZWjTzdBGQf8dHZhAqHRabpOEt-L7HW-rL1IBYFk";
  modifyForm(id, types, candidates);
}