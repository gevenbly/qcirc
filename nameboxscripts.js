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
  // reposition the name box
  if (isNameboxActive) {
    // do not allow name box to go out of bounds
    var yfin = a2rY(ycoordNamebox) - 3;
    if (yfin < fontsizeNamebox/2) {
      yfin = fontsizeNamebox/2 + 1;
    } else if ((yfin + fontsizeNamebox/2) > viewHeight) {
      yfin = viewHeight - fontsizeNamebox/2 - 1;
    }
    var xfin = a2rX(xcoordNamebox) - 2;
    if (xfin < widthNamebox/2) {
      xfin = widthNamebox/2 + 1;
    } else if ((xfin + widthNamebox/2) > viewWidth) {
      xfin = viewWidth - widthNamebox/2 - 8;
    }
    theNamebox.style.top = Math.round(yfin - fontsizeNamebox/2 + topMenuHeight) + "px";
    theNamebox.style.left = Math.round(xfin - widthNamebox/2 + leftMenuWidth) + "px";
  }
}

function doNameboxIn(evt) {
  xcoordNamebox = Math.round(tensor_bbox[currGrabbed[1]][4]);
  ycoordNamebox = Math.round(tensor_bbox[currGrabbed[1]][5]);
  updateNameboxPos();
  theNamebox.value = tensor_names[currGrabbed[1]];
  theNamebox.focus();
  isNameboxActive = true;
  theNamebox.style.zIndex = 200;
}

function doNameboxOut(evt) {
  if (checkValidName(theNamebox.value)) {
    tensor_names[currGrabbed[1]] = theNamebox.value;
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
  // mainWindow.focus();
  // console.log(stateOfMouse)
  // console.log(objUnderMouse)
}