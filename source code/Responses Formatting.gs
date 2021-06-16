function createFormatted(formatted) {
  // if matched exists, sheets and headers were already created, so return
  var matched = formatted.getSheetByName("Matched");
  if (matched != null)
    return;

  formatted.getActiveSheet().setName("Unmatched");
  
  matched = formatted.insertSheet();
  matched.setName("Matched");

  var rejected = formatted.insertSheet();
  rejected.setName("Rejected");

  var unmatched = formatted.getSheetByName("Unmatched");
  createHeaders(unmatched, matched, rejected);
}

function createHeaders(unmatched, matched, rejected) {
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

    if (r.includes(null))
      continue;
    
    console.log("%s with headers %s and responses %s", id_name, headers, r);
    
    addRow(id_name, headers, r, unmatched);
    rm.push(i+1);
  }

  // we only remove at the end so it's easy to access candidate name by index before
  removeCandidates(rm, candidates);
}

function addRow(id_name, headers, r, unmatched) {
  unmatched.appendRow(id_name);

  for (var i = 0; i < r.length; i++) {
    var index = 6;
    if (headers[i].includes("Friendships without Benefits"))
      index = 3;
    else if (headers[i].includes("Friendships with Benefits"))
      index = 4;
    else if (headers[i].includes("Relationships without Sex"))
      index = 5;
    
    unmatched.getRange(unmatched.getLastRow(), index).setValue(r[i]);
  }
}

function removeCandidates(rm, candidates) {
  rm.reverse().forEach(function(index) {
    candidates.deleteRow(index);
  });
}