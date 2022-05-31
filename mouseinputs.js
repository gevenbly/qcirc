// functions that resolve mouse button events and mouse movement

function onMouseClick(evt) {
  
}

function onMouseDown(evt) {
  if (contextIsUp) {
    return;
  }
  if (isProjectBoxActive) {
    closeNamingBox();
    return;
  }
  
  if (evt.button == 0) { // left mouse 
    if (stateOfMouse == "connecting") {
      if (objUnderMouse[0] == "anchor") {
        var i0 = objUnderMouse[1];
        var j0 = objUnderMouse[2];
        
        if (tensors[i0].connects[j0]==0) {//create closed index
          var i0 = currGrabbed[1];
          var j0 = currGrabbed[2];
          var i1 = objUnderMouse[1];
          var j1 = objUnderMouse[2];
          if (!(i0==i1 && j0==j1)) {
            createIndex(evt,i0,j0,i1,j1);
            if (autoInds) {
              var x0 = tensors[i0].xanchors[j0] + tensors[i0].bbox[4];
              var y0 = tensors[i0].yanchors[j0] + tensors[i0].bbox[5];

              tensors[i1].xanchors[j1] = x0 - tensors[i1].bbox[4];
              tensors[i1].yanchors[j1] = y0 - tensors[i1].bbox[5];

              snapAnchorInside(i1,j1);
            }
          }
        }
      } else if (objUnderMouse[0] == "none") {//create open index
        var i0 = currGrabbed[1];
        var j0 = currGrabbed[2];
        createFreeIndex(evt,i0,j0);
      } 
      freeMouseState();
      updateCursorStyle();
      return;
    }
    
    isLeftDown = true;
    if (objUnderMouse[0] == "none") {
      if (leftSelectedType == 1) { // selection box
        var pos = getAbsMousePos(canvasBase, evt);
        stateOfMouse = "selecting";
        coordGrabbed[0] = Math.round(pos.x);
        coordGrabbed[1] = Math.round(pos.y)
        selectBox = [Math.round(pos.x), Math.round(pos.y), 
                     Math.round(pos.x), Math.round(pos.y),
                     Math.round(pos.x), Math.round(pos.y)];
        currSelected = [];
        updateCursorStyle();
        
      } else if (leftSelectedType > 1) { // create tensor
        var pos = getAbsMousePos(canvasBase, evt);
        createTensor(pos.x, pos.y);
        stateOfMouse = "creating";
        if (gridSnap) {
          coordGrabbed[0] = snapX(pos.x);
          coordGrabbed[1] = snapY(pos.y);
        } else {
          coordGrabbed[0] = pos.x;
          coordGrabbed[1] = pos.y;
        }
        currSelected = [];
        updateCursorStyle();
      } else if (leftSelectedType == 0) { // free coursor
        freeMouseState();
        currSelected = [];
      }
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
      coordGrabbed = [Math.round(pos.x - tensors[ind].bbox[4]), 
                      Math.round(pos.y - tensors[ind].bbox[5])];
      if (!currSelected.includes(ind)) {
        currSelected = [ind];
      }
      updateCursorStyle();
      updateSelectionBox();
      
    } else if (objUnderMouse[0] == "anchor") {
      var pos = getAbsMousePos(canvasBase, evt);
      stateOfMouse = "startanchor";
      coordGrabbed[0] = pos.x;
      coordGrabbed[1] = pos.y;
      currGrabbed[0] = "anchor"; 
      currGrabbed[1] = objUnderMouse[1];
      currGrabbed[2] = objUnderMouse[2];
      currSelected = [];
      
    } else if (objUnderMouse[0] == "openind") {
      var pos = getAbsMousePos(canvasBase, evt);
      stateOfMouse = "connecting";
      var jnd = objUnderMouse[1];
      if (indices[jnd].connects[0] < 0) {
        var tempI = indices[jnd].connects[2];
        var tempJ = indices[jnd].connects[3];
      } else {
        var tempI = indices[jnd].connects[0];
        var tempJ = indices[jnd].connects[1];
      }
      currGrabbed[0] = "anchor"; 
      currGrabbed[1] = tempI;
      currGrabbed[2] = tempJ;
      deleteIndex(jnd);
      currSelected = [];
      return;
      
    } else if (objUnderMouse[0] == "handle") {
      var pos = getAbsMousePos(canvasBase, evt);
      stateOfMouse = "resizing";
      currGrabbed[0] = "handle"; 
      currGrabbed[1] = objUnderMouse[1];
      currGrabbed[2] = objUnderMouse[2];
      
    } else if (objUnderMouse[0] == "rename") {
      if (objUnderMouse[2] == 0) {// minus anchor
        deleteAnchor(objUnderMouse[1]);
      } else if (objUnderMouse[2] == 1) {// rename
        stateOfMouse = "renaming";
        currGrabbed[0] = objUnderMouse[0];
        currGrabbed[1] = objUnderMouse[1];
      } else if (objUnderMouse[2] == 2) {// plus anchor
        createAnchor(objUnderMouse[1]); 
      }
    } else {
      freeMouseState();
      updateCursorStyle();
    }
  } else if (evt.button == 2) { // right mouse 
    if (objUnderMouse[0] == 'tensor' ||
        objUnderMouse[0] == 'anchor' ||
        objUnderMouse[0] == 'handle' ||
        objUnderMouse[0] == 'handle') {
      
      isRightDown = true;
      stateOfMouse = "predup";
      var ind = objUnderMouse[1];
      var pos = getAbsMousePos(canvasBase, evt);
      coordGrabbed = [Math.round(pos.x - tensors[ind].bbox[4]), 
                      Math.round(pos.y - tensors[ind].bbox[5])];
      currGrabbed[1] = objUnderMouse[1];
      currGrabbed[2] = objUnderMouse[2];
      if (currSelected.indexOf(ind)<0) {
        currSelected=[ind];
      }
      updateCursorStyle();
      
    } else if (objUnderMouse[0] == 'none') {
      freeMouseState();
      isRightDown = true;
      stateOfMouse = "scrolling";
      var pos = getMousePos(canvasBase, evt);
      coordGrabbed = [pos.x, pos.y];
      updateCursorStyle();
    }
  }
}

function onMouseUp(evt) {
  if (contextIsUp) {
    return;
  }
  if (stateOfMouse == "connecting") {
    return;
  }
  
  if (evt.button == 0) { // left mouse 
    isLeftDown = false;
    
    if (stateOfMouse == "creating") {
      var ind = tensors.length - 1;
      var xspan = tensors[ind].bbox[2] - tensors[ind].bbox[0];
      var yspan = tensors[ind].bbox[3] - tensors[ind].bbox[1];
      if (xspan < minWidth || yspan < minHeight) {
        deleteLastTensor()
      } else {
        currSelected = [ind];
        updateSelectionBox();
      }
      leftSelectedType = 1;
      updateLeftSelect();
      
    } else if (stateOfMouse == "renaming") {
      doNameboxIn(evt);
      updateNameboxPos();
      drawTensors();
      drawMinimap();
      updateCursorStyle();
      isLeftDown = false;
      return;
    } else if (stateOfMouse == "selecting") {
      freeMouseState();
    } else if (stateOfMouse == "startanchor") {
      
      var i0 = currGrabbed[1];
      var j0 = currGrabbed[2];
      if (tensors[i0].connects[j0] == 0) {// index is free
        stateOfMouse = "connecting";
        return
        
      } else {
        var tempInd = Math.abs(tensors[i0].connects[j0]);
        if (openIndices.indexOf(tempInd) >= 0) {// is open 
          deleteIndex(tempInd);
          currGrabbed[0] = "anchor"; 
          currGrabbed[1] = objUnderMouse[1];
          currGrabbed[2] = objUnderMouse[2];
          stateOfMouse = "connecting";
          return;
          
        } else {// is closed: unlock other end
          if (indices[tempInd].connects[0] == i0) {
            var i1 = indices[tempInd].connects[2];
            var j1 = indices[tempInd].connects[3];
          } else if (indices[tempInd].connects[2] == i0) {
            var i1 = indices[tempInd].connects[0];
            var j1 = indices[tempInd].connects[1];
          }
          deleteIndex(tempInd);
          currGrabbed[0] = "anchor"; 
          currGrabbed[1] = i1;
          currGrabbed[2] = j1;
          stateOfMouse = "connecting";
          return;
        }
      }
    }
    
  } else if (evt.button == 2) { // right mouse 
    if (stateOfMouse == "duplicating") {
      var pos = getAbsMousePos(canvasBase, evt);
      mousePos = [pos.x, pos.y];
      showContextMenu(evt);
    }
    isRightDown = false;
    stateOfMouse = "free";
    updateCursorStyle();
    return;
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
  if (contextIsUp) {
    return;
  }
  
  if (stateOfMouse === "free") {
    var emptyInit = (objUnderMouse[0] == "none");
    checkUnderMouse(evt);
    var emptyFin = (objUnderMouse[0] == "none");
    if (emptyInit != emptyFin) {
      updateCursorStyle();
    }
  } else if (stateOfMouse === "anchoring") {
    var pos = getAbsMousePos(canvasBase, evt);
    var i = currGrabbed[1];
    var j = currGrabbed[2];
    
    tensors[i].xanchors[j] = pos.x - tensors[i].bbox[4];
    tensors[i].yanchors[j] = pos.y - tensors[i].bbox[5];
    snapAnchorInside(i,j);
    
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
    
  } else if (stateOfMouse === "resizing") {
    var pos = getAbsMousePos(canvasBase, evt);
    resizeTensor(currGrabbed[1], currGrabbed[2], coordGrabbed[0], coordGrabbed[1], pos.x, pos.y);
    
  } else if (stateOfMouse === "shifting") {
    var pos = getAbsMousePos(canvasBase, evt);
    updatePosCenter(pos.x, pos.y);
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
   // console.log('miso') 
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
    
    var i = currGrabbed[1];
    var j = currGrabbed[2];
    if (autoInds) {
      tensors[i].xanchors[j] = pos.x - tensors[i].bbox[4];
      tensors[i].yanchors[j] = pos.y - tensors[i].bbox[5];
      snapAnchorInside(i,j);
    }
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
    drawDebugBox(debugStrings);
  }
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
  
  
  windowPos.zoom = windowPos.zoom + (event.deltaY * -0.005);
  if (windowPos.zoom < 1) {
    windowPos.zoom = 1;
  } else if (windowPos.zoom > 5) {
    windowPos.zoom = 5;
  }

  windowWidth = viewWidth / windowPos.zoom;
  windowHeight = viewHeight / windowPos.zoom;
  if ((windowPos.x + windowWidth) > spaceWidth) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if ((windowPos.y + windowHeight) > spaceHeight) {
    windowPos.y = spaceHeight - windowHeight;
  }
  
  drawMinimap();
  drawGrid(); 
  drawTensors();
}