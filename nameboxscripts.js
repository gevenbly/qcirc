// naming box parameters
var isNameboxActive = false;
var xcoordNamebox = 0;
var ycoordNamebox = 0;
var widthNamebox = 400;
var fontsizeNamebox = 12;

// initialize the naming box
var theNamebox = document.getElementById('nameBox');
theNamebox.style.width = widthNamebox + 'px';
theNamebox.style.fontSize = fontsizeNamebox + 'px';
theNamebox.addEventListener('focusout', (evt) => {
  doNameboxOut(evt);
});
theNamebox.addEventListener('focusin', (evt) => {
  doNameboxIn(evt);
});


function checkValidName(inputtxt) { 
  var validLetters = /^[_0-9a-zA-Z]+$/;
  if (validLetters.test(inputtxt)) { 
    var validStarts = /^[_a-zA-Z]+$/;
    if (validStarts.test(inputtxt.charAt(0))) {
      return true;
    } 
  }
  return false;
}

function updateNameboxPos() {
  if (stateOfMouse == 'renaming') {
    // re-position the name box
    if (isNameboxActive) {
      var yfin = a2rY(ycoordNamebox);
      var xfin = a2rX(xcoordNamebox);
      theNamebox.style.top = Math.round(yfin - theNamebox.offsetHeight/2 + topMenuHeight) + "px";
      theNamebox.style.left = Math.round(xfin - widthNamebox/2 + leftMenuWidth) + "px";
    }
  } else if (stateOfMouse == 'boxrenaming') {
    var yfin = a2rY(ycoordNamebox);
    var xfin = a2rX(xcoordNamebox);
    theNamebox.style.top = Math.round(yfin + topMenuHeight) + 4 + "px";
    theNamebox.style.left = Math.round(xfin + leftMenuWidth) + 4 + "px";
  }
}

function doNameboxIn(evt) {
  if (stateOfMouse == 'renaming') {
    theNamebox.style.textAlign = "center";
    xcoordNamebox = Math.round(tensors[currGrabbed[1]].bbox[4]);
    ycoordNamebox = Math.round(tensors[currGrabbed[1]].bbox[5]);
    updateNameboxPos();
    theNamebox.value = tensors[currGrabbed[1]].name;
    theNamebox.focus();
    isNameboxActive = true;
    theNamebox.style.zIndex = 200;
    theNamebox.select();
    if (!canvasBasedNames) {
      allNameTags[currGrabbed[1]].style.display = "none";
    }
  } else if (stateOfMouse == 'boxrenaming') {
    theNamebox.style.textAlign = "left";
    xcoordNamebox = Math.round(textBoxes[currGrabbed[1]].bbox[0]);
    ycoordNamebox = Math.round(textBoxes[currGrabbed[1]].bbox[1]);
    updateNameboxPos();
    theNamebox.value = textBoxes[currGrabbed[1]].name;
    theNamebox.focus();
    isNameboxActive = true;
    theNamebox.style.zIndex = 200;
    theNamebox.select();
  }
}

function doNameboxOut(evt) {
  if (stateOfMouse == 'renaming') {
    if (checkValidName(theNamebox.value)) {
      tensors[currGrabbed[1]].name = theNamebox.value;
    }
    theNamebox.value = '';
    theNamebox.style.zIndex = -200;
    isNameboxActive = false;
    xcoordNamebox = 0;
    ycoordNamebox = 0;
    if (!canvasBasedNames) {
      allNameTags[currGrabbed[1]].style.display = "block";
      allNameTags[currGrabbed[1]].innerHTML = "T" + currGrabbed[1] + ":" + tensors[currGrabbed[1]].name;
    }

    objUnderMouse[0] = "none";
    objUnderMouse[1] = 0;
    freeMouseState();
    updateCursorStyle();
    drawTensors();
    theNamebox.blur();
    
  } else if (stateOfMouse == 'boxrenaming') {
    if (checkValidName(theNamebox.value)) {
      textBoxes[currGrabbed[1]].name = theNamebox.value;
    }
    theNamebox.value = '';
    theNamebox.style.zIndex = -200;
    isNameboxActive = false;
    xcoordNamebox = 0;
    ycoordNamebox = 0;

    objUnderMouse[0] = "none";
    objUnderMouse[1] = 0;
    freeMouseState();
    updateCursorStyle();
    drawTensors();
    theNamebox.blur();
  }
}

