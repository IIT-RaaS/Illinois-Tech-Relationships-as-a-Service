function createFormatted(formatted) {
  // if matched exists, sheets and headers were already created, so return
  var matched = formatted.getSheetByName("Matched");
  if (matched != null)
    return;

  console.log("Creating sheets unmatched, matched, and rejected");
  formatted.getActiveSheet().setName("Unmatched");
  
  matched = formatted.insertSheet();
  matched.setName("Matched");

  var rejected = formatted.insertSheet();
  rejected.setName("Rejected");

  var unmatched = formatted.getSheetByName("Unmatched");
  createHeaders(unmatched, matched, rejected);
}

function createHeaders(unmatched, matched, rejected) {
  console.log("Creating sheet headers");

  unmatched.setFrozenRows(1);
  var values = [["ID", "Name", "Fw/oB", "FwB", "Dw/oS", "DwS"]];
  var range = unmatched.getRange("A1:F1");
  range.setValues(values);

  matched.setFrozenRows(1);
  values = [["ID", "Name", "Fw/oB", "FwB", "Dw/oS", "DwS", "Criteria"]];
  range = matched.getRange("A1:G1");
  range.setValues(values);

  rejected.setFrozenRows(1);
  values = [["ID", "Name", "Fw/oB", "FwB", "Dw/oS", "DwS"]];
  range = rejected.getRange("A1:F1");
  range.setValues(values);
}

function formatResponse(response, formatted, candidates) {
  var data = candidates.getDataRange().getValues();
  var unmatched = formatted.getSheetByName("Unmatched");
  var rm = [];

  var items = response.getItemResponses();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    
    var id_name = data[i];
    var headers = item.getItem().asGridItem().getRows();
    var r = item.getResponse();

    if (r.indexOf(null) != -1)
      continue;
    
    console.log("%s with headers %s and responses %s", id_name, headers, r);
    
    addRow(id_name, headers, r, unmatched);
    rm.push(i+1);
  }

  // we only remove at the end so it's easy to access candidate name by index before
  removeCandidates(rm, candidates);
}

function addRow(id_name, headers, r, unmatched) {
  console.log("Adding row");
  unmatched.appendRow(id_name);

  for (var i = 0; i < r.length; i++) {
    var index = 6;
    if (headers[i].indexOf("Friendships without Benefits") != -1)
      index = 3;
    else if (headers[i].indexOf("Friendships with Benefits") != -1)
      index = 4;
    else if (headers[i].indexOf("Relationships without Sex") != -1)
      index = 5;
    
    unmatched.getRange(unmatched.getLastRow(), index).setValue(r[i]);
  }
  console.log("Added row");
}

function removeCandidates(rm, candidates) {
  console.log("Removing candidates in indices "+rm);
  rm.reverse().forEach(function(index) {
    candidates.deleteRow(index);
  });
}