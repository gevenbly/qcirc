// functions that resolve mouse button events and mouse movement

function onMouseClick(evt) {
 
}

function onMouseEnter(evt) {
  if (stateOfMouse == "renaming" || stateOfMouse == "boxrenaming") {
    return;
  } else {
    freeMouseState();
    updateCursorStyle();
    updateTensorTags();
    drawTensors();
  }
}

function onMouseOut(evt) {
  if (stateOfMouse == "renaming" || stateOfMouse == "boxrenaming") {
    return;
  } else {
    freeMouseState();
    updateCursorStyle();
    drawTensors();
  }
}

function onMouseMove(evt) {
  // code for debugging
  if (showDebug) {
    var pos = getAbsMousePos(canvasBase, evt);
    var debugStrings = [];
    debugStrings.push(
      "held (" + Math.floor(pos.x) + "," + Math.floor(pos.y) + ")"
    );
    debugStrings.push("mouse: " + isLeftDown);
    debugStrings.push("over (" + objUnderMouse[0] + "," + objUnderMouse[1] + "," + objUnderMouse[2] + ")");
    debugStrings.push("state: " + stateOfMouse);
    debugStrings.push("coord grabbed: (" + Math.round(coordGrabbed[0]) + "," + Math.round(coordGrabbed[1]) + ")");
    debugStrings.push("selected: " + currSelected);
    debugStrings.push("handle: " + handleType);
    debugStrings.push("curr grabbed: (" + currGrabbed[0] + "," + currGrabbed[1] + "," + currGrabbed[2] + ")");
    debugStrings.push("select coords: (" + Math.round(selectBox[0]) + ","  + Math.round(selectBox[1]) + "," + Math.round(selectBox[2]) + "," + Math.round(selectBox[3]) + ")");
    debugStrings.push("num indices: (" + (indices.length-1) + ")");
    debugStrings.push("open indices: (" + openIndices + ")");
    if (indices.length>1) {
      debugStrings.push("index center: (" + indices[1].center + ")");
    }
    drawDebugBox(debugStrings);
    // console.log('indices[0]')
  }
  
  if (contextIsUp) {
    return;
  }
  
  if (stateOfMouse === "free") {
    // var emptyInit = (objUnderMouse[0] == "none");
    checkUnderMouse(evt);
    updateCursorStyle();
    // var emptyFin = (objUnderMouse[0] == "none");
    // if (emptyInit != emptyFin) {
    //   updateCursorStyle();
    // } else {
    //   return;
    // }
    
  } else if (stateOfMouse === "anchoring") {
    var pos = getAbsMousePos(canvasBase, evt);
    var i = currGrabbed[1];
    var j = currGrabbed[2];
    tensors[i].xanchors[j] = pos.x - tensors[i].bbox[4];
    tensors[i].yanchors[j] = pos.y - tensors[i].bbox[5];
    snapAnchorInside(i,j);
    // var jnd = Math.abs(tensors[i].connects[j]);
    // if (jnd != 0) {
    //   updateIndexCenter(jnd);
    // }
    
  } else if (stateOfMouse === "selecting") {
    var pos = getAbsMousePos(canvasBase, evt);
    var x0 = Math.min(coordGrabbed[0], Math.round(pos.x));
    var y0 = Math.min(coordGrabbed[1], Math.round(pos.y));
    var x1 = Math.max(coordGrabbed[0], Math.round(pos.x));
    var y1 = Math.max(coordGrabbed[1], Math.round(pos.y));
    selectBox = [x0, y0, x1, y1, 0.5*(x0+x1), 0.5*(y0+y1)];
    
  } else if (stateOfMouse === "creating") {
    var ind = tensors.length - 1;
    var pos = getAbsMousePos(canvasBase, evt);
    updateTensor(ind, 0, coordGrabbed[0], coordGrabbed[1], pos.x, pos.y);
    
  } else if (stateOfMouse === "boxing") {
    var ind = textBoxes.length - 1;
    var pos = getAbsMousePos(canvasBase, evt);
    updateTextBox(ind, coordGrabbed[0], coordGrabbed[1], pos.x, pos.y);
    
  } else if (stateOfMouse === "resizing") {
    var pos = getAbsMousePos(canvasBase, evt);
    resizeTensor(currGrabbed[1], currGrabbed[2], coordGrabbed[0], coordGrabbed[1], pos.x, pos.y);
    
  } else if (stateOfMouse === "boxresizing") {
    var pos = getAbsMousePos(canvasBase, evt);
    resizeTextBox(currGrabbed[1], currGrabbed[2], coordGrabbed[0], coordGrabbed[1], pos.x, pos.y);
    
  } else if (stateOfMouse === "shifting") {
    var pos = getAbsMousePos(canvasBase, evt);
    updatePosCenter(pos.x, pos.y);
    updateSelectionBox();
    
  } else if (stateOfMouse === "boxshifting") {
    var pos = getAbsMousePos(canvasBase, evt);
    updateBoxPosCenter(pos.x, pos.y);
    updateSelectionBox();
    
  } else if (stateOfMouse === "minishift") {
    var pos = getMousePos(canvasBase, evt);
    updateMinimap(pos.x, pos.y);
    
  } else if (stateOfMouse === "scrolling") {
    var pos = getMousePos(canvasBase, evt);
    var xdiff = 5 * (pos.x - coordGrabbed[0]) / windowPos.zoom;
    var ydiff = 5 * (pos.y - coordGrabbed[1]) / windowPos.zoom;
    
    windowPos.x = makeInRange(windowPos.x + xdiff, 0, spaceWidth - windowWidth);
    windowPos.y = makeInRange(windowPos.y + ydiff, 0, spaceHeight - windowHeight);
    
    coordGrabbed = [pos.x, pos.y];
    drawGrid();
  } else if (stateOfMouse === "renaming") {
    return;
  } else if (stateOfMouse === "startanchor") {
    var tolDist = 5;
    var pos = getMousePos(canvasBase, evt);
    var tempdist = (pos.x - a2rX(coordGrabbed[0]))**2 + (pos.y - a2rY(coordGrabbed[1]))**2;
    if (tempdist > tolDist**2) {
      stateOfMouse = "anchoring";
      updateCursorStyle();
    }
  } else if (stateOfMouse === "connecting") {
    checkUnderMouse(evt);
    var pos = getAbsMousePos(canvasBase, evt); 
    
    // position needed for drawing function
    if (gridSnap && objUnderMouse[0] == "none") {
      mousePos[0] = a2rX(snapX(pos.x));
      mousePos[1] = a2rY(snapY(pos.y));
    } else {
      mousePos[0] = a2rX(pos.x); 
      mousePos[1] = a2rY(pos.y);
    }
    
    var i0 = currGrabbed[1];
    var j0 = currGrabbed[2];
    if (autoInds) {
      tensors[i0].xanchors[j0] = pos.x - tensors[i0].bbox[4];
      tensors[i0].yanchors[j0] = pos.y - tensors[i0].bbox[5];
      snapAnchorInside(i0,j0);
    }
    var tempInd = Math.abs(tensors[i0].connects[j0]);
    indices[tempInd].end = [pos.x-tensors[i0].bbox[4], pos.y-tensors[i0].bbox[5]];
    // updateIndexCenter(tempInd);
    
  } else if (stateOfMouse == "predup") {
    
    var tolDist = 10;
    var pos = getAbsMousePos(canvasBase, evt);
    var ind = currGrabbed[1];
    var tempdist = (a2rX(pos.x- tensors[ind].bbox[4]) - a2rX(coordGrabbed[0]))**2 + (a2rY(pos.y- tensors[ind].bbox[5]) - a2rY(coordGrabbed[1]))**2;
    if (tempdist > tolDist**2) {
      stateOfMouse = "duplicating";
      updateCursorStyle();
      mapSelectNewOld = copySelection();
      var grabTemp = mapSelectNewOld.indexOf(currGrabbed[1]);
      currGrabbed[1] = grabTemp;
      objUnderMouse[1] = grabTemp;
      updatePosCenter(pos.x, pos.y);
      updateSelectionBox();
    }
  } else if (stateOfMouse == "duplicating") {
    var pos = getAbsMousePos(canvasBase, evt);
    updatePosCenter(pos.x, pos.y);
    updateSelectionBox();
  }
  
  // update canvases
  drawMinimap();
  drawTensors();
  updateNameboxPos();
}

function applyZoom(evt) {
  if (contextIsUp) {
    return;
  }
  if (isProjectBoxActive) {
    return;
  }
  if (isNameboxActive) {
    return;
  }
  
  var xc = windowPos.x + windowWidth/2;
  var yc = windowPos.y + windowHeight/2;
  
  windowPos.zoom = windowPos.zoom + (event.deltaY * -0.005);
  if (windowPos.zoom < 1) {
    windowPos.zoom = 1;
  } else if (windowPos.zoom > 5) {
    windowPos.zoom = 5;
  }

  windowWidth = viewWidth / windowPos.zoom;
  windowHeight = viewHeight / windowPos.zoom;
  
  windowPos.x = xc - windowWidth/2;
  windowPos.y = yc - windowHeight/2;
  if ((windowPos.x + windowWidth) > spaceWidth) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if ((windowPos.y + windowHeight) > spaceHeight) {
    windowPos.y = spaceHeight - windowHeight;
  }
  if (windowPos.x < 0) {
    windowPos.x = 0;
  }
  if (windowPos.y < 0) {
    windowPos.y = 0;
  }
  
  drawMinimap();
  drawGrid(); 
  drawTensors();
}