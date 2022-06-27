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
      
    } else if (stateOfMouse == "boxing") {
      var ind = textBoxes.length - 1;
      var xspan = textBoxes[ind].bbox[2] - textBoxes[ind].bbox[0];
      var yspan = textBoxes[ind].bbox[3] - textBoxes[ind].bbox[1];
      if (xspan < 2*minWidth || yspan < 2*minHeight) {
        deleteLastBox();
        currBoxSelected = [];
        // rightHighlight = -1;
        selectTextBox(-1, false);
      } else {
        // rightHighlight = ind;
        currBoxSelected = [ind];
        currGrabbed[0] = "box"; 
        currGrabbed[1] = ind;
        currGrabbed[2] = 0;
        selectTextBox(ind, false);
      }
      leftSelectedType = 1;
      currSelected = [];
      updateLeftSelect();
      
    } else if (stateOfMouse == "boxrenaming") {
      doNameboxIn(evt);
      updateNameboxPos();
      drawTensors();
      drawMinimap();
      updateCursorStyle();
      isLeftDown = false;
      return;
      
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
      var pos = getAbsMousePos(canvasBase, evt);
      if (gridSnap && objUnderMouse[0] == "none") {
        mousePos[0] = a2rX(snapX(pos.x));
        mousePos[1] = a2rY(snapY(pos.y));
      } else {
        mousePos[0] = a2rX(pos.x); 
        mousePos[1] = a2rY(pos.y);
      }
      
      if (tensors[i0].connects[j0] == 0) {// index is free
        stateOfMouse = "connecting";
        // var i0 = currGrabbed[1];
        // var j0 = currGrabbed[2];
        createFreeIndex(evt,i0,j0);
        // tempInd = tensors[]
        // openIndices.push(indices.length-1);
        drawTensors();
        return
        
      } else {
        var tempInd = Math.abs(tensors[i0].connects[j0]);
        if (openIndices.indexOf(tempInd) >= 0) {// is open 
          stateOfMouse = "connecting";
          
          drawTensors();
          return;
          
        } else {// is closed: unlock other end
          if (indices[tempInd].connects[0] == i0) {
            var i1 = indices[tempInd].connects[2];
            var j1 = indices[tempInd].connects[3];
            var ic = indices[tempInd].connects[0];
            var jc = indices[tempInd].connects[1];
            
            var xend = tensors[ic].bbox[4] + tensors[ic].xanchors[jc];
            var yend = tensors[ic].bbox[5] + tensors[ic].yanchors[jc];
            indices[tempInd].end = [xend - tensors[i1].bbox[4], yend - tensors[i1].bbox[5]];
            
            tensors[ic].connects[jc] = 0;
            indices[tempInd].connects[0] = -1;
            indices[tempInd].connects[1] = -1;
                
          } else if (indices[tempInd].connects[2] == i0) {
            var i1 = indices[tempInd].connects[0];
            var j1 = indices[tempInd].connects[1];
            var ic = indices[tempInd].connects[2];
            var jc = indices[tempInd].connects[3];
            
            var xend = tensors[ic].bbox[4] + tensors[ic].xanchors[jc];
            var yend = tensors[ic].bbox[5] + tensors[ic].yanchors[jc];
            indices[tempInd].end = [xend - tensors[i1].bbox[4], yend - tensors[i1].bbox[5]];
            
            tensors[ic].connects[jc] = 0;
            indices[tempInd].connects[2] = -1;
            indices[tempInd].connects[3] = -1;
          }
          console.log(indices[1]);
          openIndices.push(tempInd);
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
  doNameboxOut(evt);
  updateTensorTags();
  drawTensors();
}