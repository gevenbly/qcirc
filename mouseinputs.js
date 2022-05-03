/*
functions that resolve mouse button events and mouse movement
*/



function onMouseClick(evt) {
  // var xtemp = hexToHSL("#008F94");
  // console.log(xtemp)
  // var ytemp = HSLToHex(xtemp.h,xtemp.s,xtemp.l);
  // console.log(ytemp)
  // var pos = getMousePos(canvasBase, evt);
  // ctxT.drawImage(renameIcon, pos.x, pos.y);
}

function applyZoom(evt) {
  windowZoom = windowZoom + (event.deltaY * -0.005);
  if (windowZoom < 1) {
    windowZoom = 1;
  } else if (windowZoom > 5) {
    windowZoom = 5;
  }

  windowWidth = viewWidth / windowZoom;
  windowHeight = viewHeight / windowZoom;
  if ((windowX0 + windowWidth) > spaceWidth) {
    windowX0 = spaceWidth - windowWidth;
  }
  if ((windowY0 + windowHeight) > spaceHeight) {
    windowY0 = spaceHeight - windowHeight;
  }
  
  drawMinimap();
  drawGrid(); 
  drawTensors();
}

function onMouseDown(evt) {
  if (evt.button == 0) { // left mouse 
    isLeftDown = true;
    if (objUnderMouse[0] == "none") {
      var pos = getAbsMousePos(canvasBase, evt);
      createTensor(pos.x, pos.y, pos.x, pos.y);
      stateOfMouse = "creating";
      currSelected = [];
      updateCursorStyle()
      
    } else if (objUnderMouse[0] == "minimap") {
      stateOfMouse = "minishift";
      
      var pos = getMousePos(canvasBase, evt);
      updateMinimap(pos.x, pos.y);
      
    } else if (objUnderMouse[0] == "tensor") {
      stateOfMouse = "shifting";
      
      var pos = getAbsMousePos(canvasBase, evt);
      var ind = objUnderMouse[1];
      currGrabbed[0] = "tensor"; 
      currGrabbed[1] = ind; 
      coordGrabbed = [Math.round(pos.x - tensor_bbox[ind][4]), 
                      Math.round(pos.y - tensor_bbox[ind][5])];
      currSelected = [ind];
      
      updateCursorStyle()
    } else if (objUnderMouse[0] == "handle") {
      stateOfMouse = "resizing";
      currGrabbed[0] = "handle"; 
      currGrabbed[1] = objUnderMouse[1];
      currGrabbed[2] = objUnderMouse[2];
      
    } else if (objUnderMouse[0] == "rename") {
      stateOfMouse = "renaming";
      currGrabbed[0] = objUnderMouse[0];
      currGrabbed[1] = objUnderMouse[1];
      
    } else {
      freeMouseState();
      updateCursorStyle();
    }
  } else if (evt.button == 2) { // right mouse 
    freeMouseState();
    isRightDown = true;
    stateOfMouse = "scrolling";
    var pos = getMousePos(canvasBase, evt);
    coordGrabbed = [pos.x, pos.y];
    updateCursorStyle();
  }
}

function onMouseUp(evt) {
  if (evt.button == 0) { // left mouse 
    if (stateOfMouse == "creating") {
      var num_tensors = tensor_types.length;
      var xc = tensor_xcoords[num_tensors-1];
      var yc = tensor_ycoords[num_tensors-1];
      var xspan = Math.max(...xc) - Math.min(...xc);
      var yspan = Math.max(...yc) - Math.min(...yc);
      if (xspan < minWidth || yspan < minHeight) {
        deleteLastTensor()
      } else {
        currSelected = [num_tensors-1];
      }
    } else if (stateOfMouse == "renaming") {
      doNameboxIn(evt);
      updateNameboxPos();
      drawTensors();
      drawMinimap();
      updateCursorStyle();
      isLeftDown = false;
      return;
    }
    isLeftDown = false;
  } else if (evt.button == 2) { // right mouse 
    isRightDown = false;
  }
  
  stateOfMouse = "free";
  updateCursorStyle();
  drawTensors();
}

function onMouseEnter(evt) {
  if (stateOfMouse != "renaming") {
    freeMouseState();
    updateCursorStyle();
  }
}

function onMouseOut(evt) {
  if (stateOfMouse != "renaming") {
    freeMouseState();
    updateCursorStyle();
  }
}

function onMouseMove(evt) {
  if (stateOfMouse === "free") {
    var emptyInit = (objUnderMouse[0] == "none");
    checkUnderMouse(evt);
    var emptyFin = (objUnderMouse[0] == "none");
    if (emptyInit != emptyFin) {
      updateCursorStyle();
    }
    
  } else if (stateOfMouse === "creating") {
    var pos = getAbsMousePos(canvasBase, evt);
    updateTensor(pos.x, pos.y);
    
  } else if (stateOfMouse === "resizing") {
    if (gridSnap) {
      var pos = getSnapAbsMousePos(canvasBase, evt);
    } else {
      var pos = getAbsMousePos(canvasBase, evt);
    }
    resizeTensor(pos.x, pos.y, currGrabbed[1], currGrabbed[2]);
    
  } else if (stateOfMouse === "shifting") {
    var pos = getAbsMousePos(canvasBase, evt);
    updatePosCenter(pos.x, pos.y);
    
  } else if (stateOfMouse === "minishift") {
    var pos = getMousePos(canvasBase, evt);
    updateMinimap(pos.x, pos.y);
    
  } else if (stateOfMouse === "scrolling") {
    var pos = getMousePos(canvasBase, evt);
    var xdiff = 5 * (pos.x - coordGrabbed[0]) / windowZoom;
    var ydiff = 5 * (pos.y - coordGrabbed[1]) / windowZoom;
    
    windowX0 = makeInRange(windowX0 + xdiff, 0, spaceWidth - windowWidth);
    windowY0 = makeInRange(windowY0 + ydiff, 0, spaceHeight - windowHeight);
    
    coordGrabbed = [pos.x, pos.y];
    drawGrid();
  } else if (stateOfMouse === "renaming") {
   // console.log('miso') 
  }
  
  // update canvases
  drawMinimap();
  drawTensors();
  updateNameboxPos();
  
  // code for debugging
  if (showDebug) {
    var pos = getMousePos(canvasBase, evt);
    var debugStrings = [];
    debugStrings.push(
      "held (" + Math.floor(pos.x) + "," + Math.floor(pos.y) + ")"
    );
    debugStrings.push("mouse: " + isLeftDown);
    debugStrings.push("over (" + objUnderMouse[0] + "," + objUnderMouse[1] + "," + objUnderMouse[2] + ")");
    debugStrings.push("state: " + stateOfMouse);
    debugStrings.push("coord grabbed: (" + coordGrabbed[0] + "," + coordGrabbed[1] + ")");
    debugStrings.push("selected: " + currSelected);
    debugStrings.push("handle: " + handleType);
    debugStrings.push("curr grabbed: (" + currGrabbed[0] + "," + currGrabbed[1] + "," + currGrabbed[2] + ")");
    drawDebugBox(debugStrings);
  }
}