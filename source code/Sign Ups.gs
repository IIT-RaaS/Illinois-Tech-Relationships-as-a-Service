candidates = []; // temporary list of potential candidates for a user contains [[name, gender, instagram, bio], ...]
candidate_ids = []; // temporary list of hawk ids for candidates contains [[hawk id, name], ...]

function main() {
  // console.log("Creating databases");
  createDatabases();

  // console.log("Servicing new users");
  serviceUsers();
  SpreadsheetApp.flush();

  // console.log("Formatting responses");
  // updateFormatted();
  // SpreadsheetApp.flush();

  // console.log("Checking for matches");
  // checkMatches();
  // SpreadsheetApp.flush();

  // console.log("Updating all forms");
  // updateForms();
}

function serviceUsers() {
  for (id in unserviced) {
    var id_back = id;
    var index = unserviced[id];
    var user = database[index][id];
    var name = user[0];
    var interests = user[1];
    var types = user[2];
    var email = user[5];

    var gender = "Male";
    if (index == 1) gender = "Female";
    if (index == 2) gender = "Nonbinary/Other";

    // console.log("User: " + name);
    addCandidates(id, interests, gender, types);
    var [folder, form] = generateForm(id, name, types); // returns [user folder id, form id]

    // for some reason, the following function changes the value of id, not sure why
    // this may be a bug in apps script
    // that's why I made a backup id_back for use in updateServiceIds
    var [formatted, candidates] = createSpreadsheets(folder, id, name, types);
    updateServicedIds(id_back, form, formatted, candidates);

    sendWelcomeEmail(email, form);
  }
}

function addCandidates(id, interests, gender, types) {
  candidates = [];
  candidate_ids = [];

  if (interests.includes("Male"))
    addCandidatesHelper(database[0], "Male", id, gender, types);
  
  if (interests.includes("Female"))
    addCandidatesHelper(database[1], "Female", id, gender, types);
  
  if (interests.includes("Nonbinary/Other"))
    addCandidatesHelper(database[2], "Nonbinary/Other", id, gender, types);
  
  // printCandidates();
  // printCandidateIds();
}

function addCandidatesHelper(users, other_gender, this_id, this_gender, this_types) {
  for (other_id in users) {
    var other = users[other_id];
    var other_name = other[0];
    var other_interests = other[1];
    var other_types = other[2];
    var other_link = other[3];
    var other_bio = other[4];
    
    if (other_id == this_id)
      continue;
    
    if (other_interests.includes(this_gender))  // if looking for each other's genders
      this_types.every(function(this_type) {
        if (other_types.includes(this_type)) {
          candidates.push([other_name, other_gender, other_link, other_bio]);
          candidate_ids.push([other_id, other_name]);
          return false; // if matching relationship type, add to candidates and exit
        }

        return true;  // otherwise, check next relationship type
      });
  }
}

function createSpreadsheets(folder, id, name, types) {
  var formatted = SpreadsheetApp.create(name+"'s Responses");
  var candidates = SpreadsheetApp.create(name+"'s Candidates");
  DriveApp.getFileById(formatted.getId()).moveTo(folder);
  DriveApp.getFileById(candidates.getId()).moveTo(folder);

  updateCandidatesSpreadsheets(formatted, candidates, [id, name], types);
  return [formatted, candidates];
}

function updateCandidatesSpreadsheets(formatted, candidates, candidate, types) {
  updateNewUserCandidates(formatted, candidates, types);
  updateExistingUserCandidates(candidate);
}

function updateNewUserCandidates(formatted, candidates, types) {
  candidate_ids.forEach(function(id) {
    candidates.appendRow(id);
  });

  createFormatted(formatted);
}

function updateExistingUserCandidates(candidate) {
  // candidate_ids contains [hawk id, name] but we want list of only hawk ids
  var ids_only = [];
  candidate_ids.forEach(function(id) {
    ids_only.push(id[0]);
  });

  for (id in serviced)
    if (ids_only.includes(id)) {
      var form = FormApp.openById(serviced[id][0]);
      var candidates = SpreadsheetApp.openById(serviced[id][2]);
      candidates.appendRow(candidate);

      var [_, _, types, _, _, email, _, _] = searchDatabase(id);
      updateForm(form, candidates, types);
      sendNewCandidatesEmail(email, form);
    }
}

function updateServicedIds(id, form, formatted, candidates) {
  var sheet = SpreadsheetApp.openById(serviced_id); // id obtained using getSpreadsheetIdHelper()
  var data = sheet.getDataRange().getValues();

  var index = 0;
  for (var i = 0; i < data.length; i++)
    if (data[i][0] == id) {
      index = i+1;
      break;
    }

  sheet.getActiveSheet().getRange(index, 2).setValue(form.getId());
  sheet.getActiveSheet().getRange(index, 3).setValue(formatted.getId());
  sheet.getActiveSheet().getRange(index, 4).setValue(candidates.getId());
}

/* the following are only for testing */

function printCandidates() {
  var string = "Candidates";
  for (candidate of candidates)
    string += "\nName: "+candidate[0]+"\n"
        +"Gender: "+candidate[1]+"\n"
        +"Link: "+candidate[2]+"\n"
        +"Bio: "+candidate[3]+"\n";
  
  console.log(string);
}

function printCandidateIds() {
  var string = "Candidate Ids";
  candidate_ids.forEach(function([id, name]) {
    string += "\nName: "+name+"\n"
        +"Hawk Email: "+id+"\n"
  });

  console.log(string);
}