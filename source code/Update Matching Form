function runUpdateUser() {
  updateUser("example@hawk.iit.edu"); // CHANGE ME
}

function updateUser(id) {
  // create databases
  createDatabases();

  // fix serviced database
  delete serviced[id];

  console.log("Deleted id from serviced");
  printServiced();
  
  // fix unserviced database
  var index = 2;
  if (id in database[0])
    index = 0;
  else if (id in database[1])
    index = 1;
  unserviced[id] = index;

  console.log("Database index for %s: %s", id, index);

  // get user submitted potential matches
  var user_folder = DriveApp.getFolderById(folder_id).getFoldersByName(id).next();
  var [_, formatted, _] = getFilesInFolder(user_folder);
  
  var skip = [];
  var sheets = ["Unmatched", "Matched", "Rejected"];
  sheets.forEach(function(sheet_name) {
    var sheet = formatted.getSheetByName(sheet_name);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++)
      skip.push(data[i][0]);
  });

  console.log("Likes/dislikes already submitted for "+skip);

  // remove user data
  user_folder.setTrashed(true);

  // remove submitted potential matches from database
  for (var i = 0; i < 3; i++) {
    skip.forEach(function(id) {
      if (id in database[i])
        delete database[i][id];
    });
  }

  console.log("Removed all of "+skip+" from database");
  printDatabase();

  // service users
  serviceUsers();
}
