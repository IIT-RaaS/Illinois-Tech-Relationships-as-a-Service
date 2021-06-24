candidates = []; // temporary list of potential candidates for a user contains [[name, gender, instagram, bio], ...]
candidate_ids = []; // temporary list of hawk ids for candidates contains [[hawk id, name], ...]

function main() {
  console.log("Creating databases");
  createDatabases();

  console.log("Servicing new users");
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
  for (var id in unserviced) {
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

    console.log("User: "+name);
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

  console.log("Adding male candidates");
  if (interests.indexOf("Male") != -1)
    addCandidatesHelper(database[0], "Male", id, gender, types);
  
  console.log("Adding female candidates");
  if (interests.indexOf("Female") != -1)
    addCandidatesHelper(database[1], "Female", id, gender, types);
  
  console.log("Adding other candidates");
  if (interests.indexOf("Nonbinary/Other") != -1)
    addCandidatesHelper(database[2], "Nonbinary/Other", id, gender, types);
  
  // printCandidates();
  // printCandidateIds();
}

function addCandidatesHelper(users, other_gender, this_id, this_gender, this_types) {
  for (var other_id in users) {
    var other = users[other_id];
    var other_name = other[0];
    var other_interests = other[1];
    var other_types = other[2];
    var other_link = other[3];
    var other_bio = other[4];

    console.log("Checking "+other_name+" with id "+other_id);
    
    if (other_id == this_id)
      continue;
    
    if (other_interests.indexOf(this_gender) != -1)  // if looking for each other's genders
      this_types.every(function(this_type) {
        if (other_types.indexOf(this_type) != -1) {
          console.log("Adding "+other_name+", "+other_gender+", "+other_link+", "+other_bio);
          candidates.push([other_name, other_gender, other_link, other_bio]);
          candidate_ids.push([other_id, other_name]);
          return false; // if matching relationship type, add to candidates and exit
        }

        return true;  // otherwise, check next relationship type
      });
  }
}

function createSpreadsheets(folder, id, name, types) {
  console.log("Creating spreadsheets");;
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
  console.log("Appending candidates to "+candidates.getName());
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
  console.log("Ids list: "+ids_only);

  for (var id in serviced)
    if (ids_only.indexOf(id) != -1) {
      var form = FormApp.openById(serviced[id][0]);
      var candidates = SpreadsheetApp.openById(serviced[id][2]);

      console.log("Adding candidate to "+candidates.getName());
      candidates.appendRow(candidate);
      // duplicates may occur on user sign-up info update
      candidates.getDataRange().removeDuplicates();

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

  console.log("Adding info to serviced index "+index);
  sheet.getActiveSheet().getRange(index, 2).setValue(form.getId());
  sheet.getActiveSheet().getRange(index, 3).setValue(formatted.getId());
  sheet.getActiveSheet().getRange(index, 4).setValue(candidates.getId());
}

/* the following are only for testing */

function printCandidates() {
  var string = "Candidates";
  candidates.forEach(function (candidate) {
    string += "\nName: "+candidate[0]+"\n"
        +"Gender: "+candidate[1]+"\n"
        +"Link: "+candidate[2]+"\n"
        +"Bio: "+candidate[3]+"\n";
  });
  
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
