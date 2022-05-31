
var contextIsUp = false;
var contextMenu = document.getElementById("cpmenu").style;
document.addEventListener('contextmenu', event => event.preventDefault());

function showContextMenu(evt) {
  contextMenu.left = evt.clientX + "px";
  contextMenu.top = evt.clientY + "px";
  contextMenu.visibility = "visible";
  contextMenu.opacity = "1";  
  contextIsUp = true;
  
  document.addEventListener('click', function(evt) {
    contextMenu.opacity = "0";
    setTimeout(function() {
      contextMenu.visibility = "hidden";
      contextIsUp = false;
    }, 10);
  }, false);
}

function doContextCancel() {
  var numSelected = currSelected.length;
  for (var j=0; j<numSelected; j++) {
    deleteLastTensor();
  }
  drawTensors();
}

function doContextMove() {
  var numSelected = currSelected.length;
  var numTensors = tensors.length;
  for (var j=0; j<numSelected; j++) {
    deleteLastTensor();
  }
  var grabTemp = mapSelectNewOld[currGrabbed[1]];
  currGrabbed[1] = grabTemp;
  objUnderMouse[1] = grabTemp;
  currSelected = mapSelectNewOld.splice(numTensors-numSelected,numSelected);
  updatePosCenter(mousePos[0], mousePos[1]);
  updateSelectionBox();
  drawTensors();
}

function doContextCopy() {
  drawTensors();
}





// var contextMenu = document.getElementById("cpmenu").style;
// if (document.addEventListener) {
//   document.addEventListener('contextmenu', function(evt) {
//     contextMenu.left = evt.clientX + "px";
//     contextMenu.top = evt.clientY + "px";
//     contextMenu.visibility = "visible";
//     contextMenu.opacity = "1";  
//   }, false);
//   document.addEventListener('click', function(evt) {
//     contextMenu.opacity = "0";
//     setTimeout(function() {
//       contextMenu.visibility = "hidden";
//     }, 500);
//   }, false);
// } else {
//   document.attachEvent('oncontextmenu', function(evt) {
//     contextMenu.left = evt.clientX + "px";
//     contextMenu.top = evt.clientY + "px";
//     contextMenu.visibility = "visible";
//     contextMenu.opacity = "1";
//   });
//   document.attachEvent('onclick', function(evt) {
//     contextMenu.opacity = "0";
//     setTimeout(function() {
//       contextMenu.visibility = "hidden";
//     }, 500);
//   });
// }

