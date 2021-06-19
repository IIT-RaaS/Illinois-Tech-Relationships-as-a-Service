var database = []; // user database contains [male data, female data, nonbinary/other data]
                   // each of male/female/nonbinary data contains {hawk id: [name, interests, types, link, bio, personal email, discord], ...}

var serviced = {}; // already serviced users (with forms) contains {hawk id: [form id, candidates spreadsheet id], ...}
var unserviced = {}; // users to be serviced (without forms) contains {hawk id: database index, ...}

function createUserDatabase() {
  var sheet = SpreadsheetApp.openById(responses_id); // id of responses sheet obtained using getSpreadsheetIdHelper()
  var data = sheet.getDataRange().getValues();

  prepareUserDatabase();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var id = row[1];   // hawk email to confirm
    var name = row[2];      // name of user
    var email = row[3];     // personal email
    var gender = row[4];    // gender of user
    var interests = row[5]; // gender(s) user is interested in being in a relationship with
    var types = row[6].split(", "); // type(s) of relationships user is interested in as a list
    var link = row[7];      // link to social media/photos
    var bio = row[8];       // bio
    var discord = row[9];   // discord

    addToUserDatabase(id, name, gender, interests, types, link, bio, email, discord);
  }
}

function createDatabases() {
  var sheet1 = SpreadsheetApp.openById(responses_id); // id of responses sheet obtained using getSpreadsheetIdHelper()
  var sheet2 = SpreadsheetApp.openById(serviced_id); // id of serviced users sheet obtained using getSpreadsheetIdHelper()
  var data1 = sheet1.getDataRange().getValues();
  var data2 = sheet2.getDataRange().getValues();

  prepareUserDatabase();

  var is_serviced = true;
  var num_serviced = 0;

  // gets name of last user that was serviced
  var last_serviced = "";
  
  if (data2 == "")
    is_serviced = false;
  else
    last_serviced = data2[data2.length-1][0];
  
  console.log("Serviced? "+is_serviced);
  console.log("Last serviced: "+last_serviced);

  for (var i = 1; i < data1.length; i++) {
    var row = data1[i];
    var id = row[1];   // hawk email to confirm
    var name = row[2];      // name of user
    var email = row[3];     // personal email
    var gender = row[4];    // gender of user
    var interests = row[5]; // gender(s) user is interested in being in a relationship with
    var types = row[6].split(", "); // type(s) of relationships user is interested in as a list
    var link = row[7];      // link to social media/photos
    var bio = row[8];       // bio
    var discord = row[9];   // discord

    // console.log(id);
    // console.log(name);
    // console.log(email);
    // console.log(gender);
    // console.log(interests);
    // console.log(types);
    // console.log(link);
    // console.log(bio);
    // console.log(discord);

    if (is_serviced) {
      if (id == last_serviced)
        is_serviced = false;

      if (data2[num_serviced].length == 1)
        continue;

      serviced[id] = [data2[num_serviced][1], data2[num_serviced][2], data2[num_serviced++][3]];
      // console.log("Added "+id+" with value "+data2[num_serviced-1][1]+"to serviced");
      
      addToUserDatabase(id, name, gender, interests, types, link, bio, email, discord);
    } else {
      // if user hasn't been serviced before, add them to serviced spreadsheet
      sheet2.appendRow([id]);
      // console.log("Added "+ id+" to serviced spreadsheet");

      /*
      // send error email message and skip if not a valid hawk account
      if (!id.endsWith("iit.edu")) {
        sendConfirmErrorEmail(email);
        continue;
      }
      */

      var index = addToUserDatabase(id, name, gender, interests, types, link, bio, email, discord);
      
      unserviced[id] = index;
      // console.log("Added "+id+" with gender index "+index+" to unserviced");
    }
  }

  printDatabase();
  printServiced();
  printUnserviced();
}

function prepareUserDatabase() {
  database[0] = {};
  database[1] = {};
  database[2] = {};
}

function addToUserDatabase(id, name, gender, interests, types, link, bio, email, discord) {
  var index = 0;
  if (gender == "Female")
    index = 1;
  else if (gender == "Nonbinary/Other")
    index = 2;
  
  // console.log("Gender: "+gender);
  // console.log("Gender index: "+index);
  
  database[index][id] = [name, interests, types, link, bio, email, discord];
  return index;
}

function searchDatabase(id) {
  if (id in database[0])
    return database[0][id].concat("Male");
  if (id in database[1])
    return database[1][id].concat("Female");
  if (id in database[2])
    return database[2][id].concat("Nonbinary/Other");
  
  return [];
}

/* the following are only for testing */

function printDatabase() {
  var string = "User Database:\n\nMales";
  for (var id in database[0])
    string += "\nName: "+database[0][id][0]+"\n"
        +"Interests: "+database[0][id][1]+"\n"
        +"Types: "+database[0][id][2]+"\n"
        +"Link: "+database[0][id][3]+"\n"
        +"Bio: "+database[0][id][4]+"\n"
        +"Personal Email: "+database[0][id][5]+"\n"
        +"Discord: "+database[0][id][6]+"\n"
        +"Hawk Email: "+id+"\n";

  string += "\nFemales";
  for (var id in database[1])
    string += "\nName: "+database[1][id][0]+"\n"
        +"Interests: "+database[1][id][1]+"\n"
        +"Types: "+database[1][id][2]+"\n"
        +"Link: "+database[1][id][3]+"\n"
        +"Bio: "+database[1][id][4]+"\n"
        +"Personal Email: "+database[1][id][5]+"\n"
        +"Discord: "+database[1][id][6]+"\n"
        +"Hawk Email: "+id+"\n";

  string += "\nNonbinary/Other";
  for (var id in database[2])
    string += "\nName: "+database[2][id][0]+"\n"
        +"Interests: "+database[2][id][1]+"\n"
        +"Types: "+database[2][id][2]+"\n"
        +"Link: "+database[2][id][3]+"\n"
        +"Bio: "+database[2][id][4]+"\n"
        +"Personal Email: "+database[2][id][5]+"\n"
        +"Discord: "+database[2][id][6]+"\n"
        +"Hawk Email: "+id;
  
  console.log(string);
}

function printServiced() {
  var string = "Serviced\n";
  for (var confirm in serviced)
    string += confirm+": "+serviced[confirm]+"\n";
  
  console.log(string);
}

function printUnserviced() {
  var string = "Unserviced\n";
  for (var confirm in unserviced)
    string += confirm+": "+unserviced[confirm]+"\n";
  
  console.log(string);
}