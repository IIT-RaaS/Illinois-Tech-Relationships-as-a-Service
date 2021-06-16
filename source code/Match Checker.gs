function processFormatted(formatted, this_id) {
  rm = [];

  var data = formatted.getSheetByName("Unmatched").getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var other_id = row[0];

    var other_formatted = getSheetFromId(other_id);
    if (checkMatch(this_id, row, formatted, other_formatted))
      rm.push(i+1);
  }

  // we only remove from this spreadsheet at the end so loop continues properly before
  removeUnmatched(rm, formatted);
}

function getSheetFromId(id) {
  var forms_folder = DriveApp.getFolderById(folder_id); // id obtained using getFolderIdHelper()
  var user_folder = forms_folder.getFoldersByName(id).next();
  var file = user_folder.searchFiles("title contains 'Responses'").next();
  
  return SpreadsheetApp.open(file);
}

function checkMatch(id, this_row, this_formatted, other_formatted) {
  var data = other_formatted.getSheetByName("Unmatched").getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var other_row = data[i];
    if (other_row[0] != id)
      continue;
    
    // console.log("Process match for "+this_row[0]+" and "+other_row[0]);
    processMatch(this_row, other_row, i+1, this_formatted, other_formatted);
    return true;
  }

  return false;
}

function processMatch(this_row, other_row, other_index, this_formatted, other_formatted) {
  var available_types = ["Friendships without Benefits", "Hookups or Friendships with Benefits",
      "Serious Relationships without Sex", "Serious Relationships with Sex"];
  var types = [];

  var match = false;
  console.log("This row: " + this_row);
  console.log("Other row: " + other_row);
  for (var i = 2; i < 6; i++)
    if (this_row[i] == "Like" && other_row[i] == "Like") {
      types.push(available_types[i-2]);
      match = true;
    }
  
  console.log("Match? " + match);
  console.log("Criteria: " + types)
  
  if (match) {
    var types_string = types.join(", ");
    this_row.push(types_string);
    other_row.push(types_string);

    this_formatted.getSheetByName("Matched").appendRow(this_row);
    other_formatted.getSheetByName("Matched").appendRow(other_row);

    emailMatch(this_row[0], other_row[0], types_string);
  } else {
    this_formatted.getSheetByName("Rejected").appendRow(this_row);
    other_formatted.getSheetByName("Rejected").appendRow(other_row);
  }

  other_formatted.getSheetByName("Unmatched").deleteRow(other_index);
  return match;
}

function removeUnmatched(rm, formatted) {
  var unmatched = formatted.getSheetByName("Unmatched");

  rm.reverse().forEach(function(index) {
    unmatched.deleteRow(index);
  });
}

function emailMatch(this_id, other_id, types) {
  var [_, _, _, _, _, this_email, this_discord, _] = searchDatabase(this_id);
  var [_, _, _, _, _, other_email, other_discord, _] = searchDatabase(other_id);

  sendMatchEmail(this_email, types, other_discord);
  sendMatchEmail(other_email, types, this_discord);
}