var theSizingBox = createSizingTextBox();

function createSizingTextBox() {
  var tempDiv = document.createElement("div");
  tempDiv.setAttribute("id", "sizingbox");
  tempDiv.setAttribute("class", "boxtag");
  tempDiv.setAttribute("style", "display: block;");
  var tempNode = document.createTextNode("testname");
  tempDiv.appendChild(tempNode);
  document.getElementById("canvasWindow").appendChild(tempDiv);
  return document.getElementById("sizingbox");
}

function createTextBox(x0, y0) {
  // initialise a text box
  
  var x0r = Math.round(x0);
  var y0r = Math.round(y0); 
  
  textBoxes.push({
    bbox: [x0r, y0r, x0r, y0r, x0r, y0r],
    name: "",
    color: leftColorSelected,
    plaintext: "",
    codetext: "",
    width: 10,
  })
}

function createTextBoxTag() {
  if (allTextBoxTags.length < textBoxes.length) {
    var ind = allTextBoxTags.length;
    var tempDiv = document.createElement("div");
    tempDiv.setAttribute("id", "boxtag"+ind);
    tempDiv.setAttribute("class", "boxtag");
    tempDiv.setAttribute("style", "display: block;");
    // tempDiv.setAttribute("style", "background-color: " + leftColorTypes[leftColorSelected]);
    var tempNode = document.createTextNode("B"+ind+":");
    tempDiv.appendChild(tempNode);
    document.getElementById("canvasWindow").appendChild(tempDiv);
    allTextBoxTags.push(document.getElementById("boxtag"+ind));
  }
}

function updateTextBoxTags() {
  while (allTextBoxTags.length < tensors.length) {
    createTextBoxTag() 
  };
  for (var ind=0; ind<allTextBoxTags.length; ind++) {
    if (ind < tensors.length) {
      allTextBoxTags[ind].style.display = "block";
      allTextBoxTags[ind].innerHTML = "B" + ind + ":" + textBoxes[ind].name;
    } else {
      allTextBoxTags[ind].style.display = "none";
    }
  }
}

function updateTextBox(ind, xfix, yfix, xnew, ynew) {
  // called when creating tensors 
  if (gridSnap) {
    xnew = snapX(xnew);
    ynew = snapY(ynew);
  }
  var xmin = Math.min(xnew, xfix);
  var xmax = Math.max(xnew, xfix);
  var ymin = Math.min(ynew, yfix);
  var ymax = Math.max(ynew, yfix);
  textBoxes[ind].bbox = [xmin, ymin, xmax, ymax, (xmin+xmax)/2, (ymin+ymax)/2];
}


function resizeTextBox(ind, subind, xfix, yfix, xnew, ynew) {
  
  var num_boxes = textBoxes.length;
  if (gridSnap) {
    xnew = snapX(xnew);
    ynew = snapY(ynew);
  }
  
  if ((subind % 2) == 0) {// corner resize
    var xmin = Math.min(xnew, xfix);
    var xmax = Math.max(xnew, xfix);
    var ymin = Math.min(ynew, yfix);
    var ymax = Math.max(ynew, yfix);
    var xmid = (xmin + xmax) / 2;
    var ymid = (ymin + ymax) / 2;
    
    var ratioxtemp = Math.max((xmax - xmin), 0.0001) / Math.max(textBoxes[ind].bbox[2] - textBoxes[ind].bbox[0], 0.0001);
    var ratioytemp = Math.max((ymax - ymin), 0.0001) / Math.max(textBoxes[ind].bbox[3] - textBoxes[ind].bbox[1], 0.0001);
    textBoxes[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];
    
  } else if ((subind % 2) == 1) {// side resize
    if ((((subind - 1) / 2) % 2) != 0) {// y-resize
      var xmin = Math.min(xnew, xfix);
      var xmax = Math.max(xnew, xfix);
      var ymin = textBoxes[ind].bbox[1];
      var ymax = textBoxes[ind].bbox[3];
      var xmid = (xmin + xmax) / 2;
      var ymid = (ymin + ymax) / 2;
     
      var ratioxtemp = Math.max((xmax - xmin), 0.0001) / Math.max(textBoxes[ind].bbox[2] - textBoxes[ind].bbox[0], 0.0001);
      textBoxes[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];
      
    } else {// x-resize
      var xmin = textBoxes[ind].bbox[0];
      var xmax = textBoxes[ind].bbox[2];
      var ymin = Math.min(ynew, yfix);
      var ymax = Math.max(ynew, yfix);
      var xmid = (xmin + xmax) / 2;
      var ymid = (ymin + ymax) / 2;
      
      var ratioytemp = Math.max((ymax - ymin), 0.0001) / Math.max(textBoxes[ind].bbox[3] - textBoxes[ind].bbox[1], 0.0001);
      textBoxes[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];
    }
  }
}

function updateBoxPosCenter(xpos, ypos) {
  var xc_new = xpos - coordGrabbed[0];
  var yc_new = ypos - coordGrabbed[1];

  var ind = currGrabbed[1];
  var xdiff = xc_new - textBoxes[ind].bbox[0];
  var ydiff = yc_new - textBoxes[ind].bbox[1];
  if (gridSnap) {
    xdiff = snapX(xdiff);
    ydiff = snapY(ydiff);
  }
 
  for (var i=0; i<currBoxSelected.length; i++) {
    var ind = currBoxSelected[i];
    textBoxes[ind].bbox = addVector(textBoxes[ind].bbox, [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
  }
  for (var i=0; i<currSelected.length; i++) {
    var ind = currSelected[i];
    tensors[ind].bbox = addVector(tensors[ind].bbox, [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
  }
}

function deleteLastBox() {
  var ind = textBoxes.length-1;
  deleteMiddleBox(ind);
}

function deleteMiddleBox(ind) {
  // textBoxes[ind].tag.remove();
  if (ind == textBoxes.length-1) {
    textBoxes.pop(); 
  } else {
    textBoxes.splice(ind,1); 
  }
}
