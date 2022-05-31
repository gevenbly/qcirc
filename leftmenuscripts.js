const leftColorTypes = ["#21a0a0","#3454d1","#b4adea","#c33c54","#f0943e"];
var leftColorSelected = 0;
var leftSelectedType = 1;
var numColors = leftColorTypes.length;

const allLeftCols = []; 
for (var j=0; j<5; j++) {
  allLeftCols.push(document.getElementById("colicon"+j));
}

// html elements and listeners
const allLeftIcons = [document.getElementById("selecticon"),
                      document.getElementById("movingicon"),
                      document.getElementById("rectangleicon"), 
                      document.getElementById("ellipseicon"), 
                      document.getElementById("hillicon"), 
                      document.getElementById("trapezoidicon"),
                      document.getElementById("forwardicon"),
                      document.getElementById("behindicon"),
                      document.getElementById("fronticon"),
                      document.getElementById("backicon"),
                      document.getElementById("hflipicon"),
                      document.getElementById("vflipicon"),
                      document.getElementById("clockicon"),
                      document.getElementById("antiicon"),
                      document.getElementById("snapicon"),
                      document.getElementById("openicon"),
                      document.getElementById("copyicon"),
                      document.getElementById("pasteicon")];   

// create darker and lighter tone palette
for (var j=0; j<numColors; j++) {
  leftColorTypes.push(lightenColor(leftColorTypes[j], -5))
}
for (var j=0; j<numColors; j++) {
  leftColorTypes.push(lightenColor(leftColorTypes[j], +5))
}
allLeftCols[leftColorSelected].style.border = "1px solid black";

// functions
function doLeftColor(selected) {
  leftColorSelected = selected;
  clearColorBorder();
  for (var j=0; j<currSelected.length; j++) {
    tensors[currSelected[j]].color = leftColorSelected;
  }
  doLeftSelectedBorder();
  drawTensors();
}

function doLeftSelectedBorder() {
  if (currSelected.length == 0) {
    // allLeftCols[leftColorSelected].style.border = "2px solid black";
    allLeftCols[leftColorSelected].style.border = "1px solid black";
  } else if (currSelected.length == 1) {
    var tempcolor = tensors[currSelected[0]].color;
    // allLeftCols[currSelected[0]].style.border = "2px solid black";
    allLeftCols[tempcolor].style.border = "1px solid black";
  } else {
    if (checkIfMonotone()) {
      // allLeftCols[currSelected[0]].style.border = "2px solid black";
      var tempcolor = tensors[currSelected[0]].color;
      allLeftCols[tempcolor].style.border = "1px solid black";
    }
  }
}

function clearColorBorder() {
  for (var i=0; i<numColors; i++) {
    allLeftCols[i].style.border = "0px solid #000000";
  }
}

function clearNonSelectedBorder() {
  for (var i=0; i<numColors; i++) {
    allLeftCols[i].style.border = "0px solid #000000";
  }
  doLeftSelectedBorder();
}

function doHoverColor(hovered) { 
  clearColorBorder(); 
  doLeftSelectedBorder();
  allLeftCols[hovered].style.border = "1px solid gold";
}

function checkIfMonotone() {
  if (currSelected.length==0) {
    return true;
  } else {
    var tempColor = tensors[currSelected[0]].color;
    var isMonotone = true;
    for (var i=1; i<currSelected.length; i++) {
      if (tensors[currSelected[i]].color != tempColor) {
        isMonotone = false;
      }
    }
    return isMonotone;
  }
}

function doLeftSelect(selected) {
  leftSelectedType = selected;
  updateLeftSelect();
}

function clearLeftShading() {
  for (var i=2; i<allLeftIcons.length; i++) {
    allLeftIcons[i].style.backgroundColor = 'transparent'; 
    allLeftIcons[i].style.borderStyle = "none";
  }
}

function updateLeftSelect() {
  clearLeftShading();
  if (leftSelectedType > 1) {
    allLeftIcons[leftSelectedType].style.backgroundColor = greyHover;
    allLeftIcons[leftSelectedType].style.border = "1px solid #000000";
  }
}

function doLeftHover(hovered) { 
  clearLeftShading(); 
  updateLeftSelect();
  allLeftIcons[hovered].style.backgroundColor = greyHover;
}



function doLeftBack() {
  bringTensorBack();
}

function doLeftFront() {
  bringTensorFront();
}

function doLeftForward() {
  bringTensorFoward();
}

function doLeftBehind() {
  bringTensorBehind();
}

function doLeftHorz() {
  transHorzFlip();
}

function doLeftVert() {
  transVertFlip();
}

function doLeftClock() {
  transClock();
}

function doLeftAnti() {
  transAnti();
}

function doLeftSnap() {
  snapAllAnchors();
  drawTensors();
}

function doLeftOpen() {
  reassignGroupIndices();
  drawTensors();
}

function doLeftCopy() {
  navigator.clipboard.writeText(bufferSelection());
}

async function doLeftPaste(input) {
  const clipData = await navigator.clipboard.readText();
  unpackBufferSelection(clipData);
  shiftSelectBoxWindow();
  drawMinimap();
  drawTensors();
}

