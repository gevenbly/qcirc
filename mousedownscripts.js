function onMouseDown(evt) {
  if (contextIsUp) {
    return;
  }
  if (isProjectBoxActive) {
    closeNamingBox();
    return;
  }
  if (isNameboxActive) {
    doNameboxOut(evt);
    return;
  }
  
  checkUnderMouse(evt);
  if (evt.button == 0) { // left mouse 
    if (stateOfMouse == "boxing") {
      var ind = textBoxes.length - 1;
      var xspan = textBoxes[ind].bbox[2] - textBoxes[ind].bbox[0];
      var yspan = textBoxes[ind].bbox[3] - textBoxes[ind].bbox[1];
      if (xspan < 2*minWidth || yspan < 2*minHeight) {
        deleteLastBox();
        currBoxSelected = [];
        rightHighlight = -1;
        selectTextBox(false);
        return;
      }
      leftSelectedType = 1;
      currBoxSelected = [ind];
      rightHighlight = ind;
      selectTextBox(false);
      currSelected = [];
      updateLeftSelect();
      currGrabbed[0] = "box"; 
      currGrabbed[1] = ind;
      currGrabbed[2] = 0;
      selectTextBox(false);
      stateOfMouse = "free";
      updateCursorStyle();
      freeMouseState();
      return
    }
    
    if (stateOfMouse == "connecting") {
      if (objUnderMouse[0] == "anchor") {
        var i1 = objUnderMouse[1];
        var j1 = objUnderMouse[2];
        
        if (tensors[i1].connects[j1]==0) {//clicked-on anchor is free
          var i0 = currGrabbed[1];
          var j0 = currGrabbed[2];
          var tempInd = Math.abs(tensors[i0].connects[j0]);
          if (indices[tempInd].connects[0] < 0) {
            indices[tempInd].connects[0] = i1;
            indices[tempInd].connects[1] = j1;
            tensors[i1].connects[j1] = -tempInd;
          } else {
            indices[tempInd].connects[2] = i1;
            indices[tempInd].connects[3] = j1;
            tensors[i1].connects[j1] = tempInd;
          }
          var loctemp = openIndices.indexOf(tempInd);
          openIndices.splice(loctemp,1);
          
          if (autoInds) {
            var x0 = tensors[i0].xanchors[j0] + tensors[i0].bbox[4];
            var y0 = tensors[i0].yanchors[j0] + tensors[i0].bbox[5];

            tensors[i1].xanchors[j1] = x0 - tensors[i1].bbox[4];
            tensors[i1].yanchors[j1] = y0 - tensors[i1].bbox[5];

            snapAnchorInside(i1,j1);
          }
        } else {
          var i0 = currGrabbed[1];
          var j0 = currGrabbed[2];
          var tempInd = Math.abs(tensors[i0].connects[j0]);
          var loctemp = openIndices.indexOf(tempInd);
          openIndices.splice(loctemp,1);
          deleteIndex(tempInd);
        }
      } else if (objUnderMouse[0] == "none") {//create open index
        var i0 = currGrabbed[1];
        var j0 = currGrabbed[2];
        var tempInd = Math.abs(tensors[i0].connects[j0]);
        var pos = getAbsMousePos(canvasBase, evt);
        var tempEndX = pos.x-tensors[i0].bbox[4];
        var tempEndY = pos.y-tensors[i0].bbox[5];
        indices[tempInd].end = [tempEndX, tempEndY];
        var dx = Math.abs(tempEndX - tensors[i0].xanchors[j0]);
        var dy = Math.abs(tempEndY - tensors[i0].yanchors[j0]);
        console.log((dx*dx + dy*dy)/windowPos.zoom)
        if ((dx*dx + dy*dy) < 100) {
          deleteIndex(tempInd);
        }
      }
      
      freeMouseState();
      updateCursorStyle();
      checkUnderMouse(evt);
      drawTensors();
      return;
    }
    
    // inputs when the mouse is free
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
        
      } else if (leftSelectedType == 0) { // text box
        var pos = getAbsMousePos(canvasBase, evt);
        createTextBox(pos.x, pos.y);
        stateOfMouse = "boxing";
        if (gridSnap) {
          coordGrabbed[0] = snapX(pos.x);
          coordGrabbed[1] = snapY(pos.y);
        } else {
          coordGrabbed[0] = pos.x;
          coordGrabbed[1] = pos.y;
        }
        currSelected = [];
        currBoxSelected = [];
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
      
    } else if (objUnderMouse[0] == "box") {
      stateOfMouse = "boxshifting";
      
      var pos = getAbsMousePos(canvasBase, evt);
      var ind = objUnderMouse[1];
      currGrabbed[0] = "box"; 
      currGrabbed[1] = ind; 
      coordGrabbed = [Math.round(pos.x - textBoxes[ind].bbox[0]), 
                      Math.round(pos.y - textBoxes[ind].bbox[1])];
      if (!currBoxSelected.includes(ind)) {
        currBoxSelected = [ind];
        // whichBoxActive = ind;
        selectTextBox(ind, false);
      }
      updateCursorStyle();
      updateSelectionBox();
    
    } else if (objUnderMouse[0] == "indexhandle") {
      if (objUnderMouse[2] == 0) {// clicked on index
        
      } else if (objUnderMouse[2] == 1) {// left cycle
        var kic = objUnderMouse[1];
        if (indices[kic].type==0) {
          indices[kic].type = numUniqueInds-1;
        } else {
          indices[kic].type -= 1;
        }
       
      } else if (objUnderMouse[2] == 2) {// right cycle
        var kic = objUnderMouse[1];
        if (indices[kic].type==numUniqueInds-1) {
          indices[kic].type = 0;
        } else {
          indices[kic].type += 1;
        }
        
      } else if (objUnderMouse[2] == 3) {// reverse
        reverseIndexArrow(objUnderMouse[1]);
      }
      drawTensors();
      return;
      
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
      var jnd = objUnderMouse[1];
      var knd = objUnderMouse[2];
      if (knd==0) {// grab the free end
        var pos = getAbsMousePos(canvasBase, evt);
        stateOfMouse = "connecting";
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
        currSelected = [];
        objUnderMouse[1] = -1;
     
        // position needed for drawing function
        if (gridSnap) {
          mousePos[0] = a2rX(snapX(pos.x));
          mousePos[1] = a2rY(snapY(pos.y));
        } else {
          mousePos[0] = a2rX(pos.x); 
          mousePos[1] = a2rY(pos.y);
        }
        checkUnderMouse(evt);
        drawTensors();
        return;
        
      } else if (knd==1) {//increment index label
        incrementIndexLabel(jnd);
      } else if (knd==2) {//decrement index label
        decrementIndexLabel(jnd);
      }
      drawTensors();
      return;
      
    } else if (objUnderMouse[0] == "boxhandle") {
      var pos = getAbsMousePos(canvasBase, evt);
      stateOfMouse = "boxresizing";
      currGrabbed[0] = "boxhandle"; 
      currGrabbed[1] = objUnderMouse[1];
      currGrabbed[2] = objUnderMouse[2];
      
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
    } else if (objUnderMouse[0] == "boxrename") {
      if (objUnderMouse[2] == 0) {// rename
        stateOfMouse = "boxrenaming";
        currGrabbed[0] = objUnderMouse[0];
        currGrabbed[1] = objUnderMouse[1];
      } else if (objUnderMouse[2] == 1) {// show code
        
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
