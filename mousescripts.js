/*
functions that determine the elements and position that
the mouse is over.
*/
    
function checkUnderMouse(evt) {
  var pos = getMousePos(canvasBase, evt);
  if (showMini) {
    if (checkMinimapMouse(pos)) {
      return;
    }
  }
  
  if (stateOfMouse == "renaming") {
    return;
  }
 
  if (stateOfMouse == "connecting") {
    for (var ind=tensors.length - 1; ind >= 0; ind--) {
      if (checkAnchorsMouse(pos,ind)) {return};
    }
    
    // mouse is over nothing special
    objUnderMouse[0] = "none";
    objUnderMouse[1] = 0;
    return;
  }
  
 
  for (var ind=textBoxes.length - 1; ind >= 0; ind--) {
    theSizingBox.innerText = "B" + ind + ":" + textBoxes[ind].name;
    if (checkBoxMouse(pos,ind)) {
      return;
    } else if (checkBoxHandlesMouse(pos,ind)) {
      return;
    } else if (checkBoxRenameMouse(pos,ind)) {
      return;
    }
  }

  for (var ind=tensors.length - 1; ind >= 0; ind--) {
    if (checkHandlesMouse(pos,ind)) {
      return;
    } else if (checkAnchorsMouse(pos,ind)) {
      return;
    } else if (checkOpenMouse(pos,ind)) {
      return;
    } else if (checkRenameMouse(pos,ind)) {
      return;
    }
  }

  if (checkIndexMouse(pos)) {
    return;
  }

  for (var ind=tensors.length - 1; ind >= 0; ind--) {
    if (checkTensorMouse(pos,ind)) {
      return;
    }
  }
  // mouse is over nothing special
  objUnderMouse[0] = "none";
  objUnderMouse[1] = 0;
  return;
  
}

function freeMouseState() {
  if (stateOfMouse == "creating") {
    var ind = tensors.length-1;
    var xspan = tensors[ind].bbox[2] - tensors[ind].bbox[0];
    var yspan = tensors[ind].bbox[3] - tensors[ind].bbox[1];
    if (xspan < minWidth || yspan < minHeight) {
      deleteLastTensor();
    }
  } else if (stateOfMouse == "selecting") {
    var x0 = selectBox[0];
    var x1 = selectBox[2];
    var y0 = selectBox[1];
    var y1 = selectBox[3];

    currSelected = [];
    for (var i = 0; i < tensors.length; i++) {
      var isInBox =
        tensors[i].bbox[0] > x0 &&
        tensors[i].bbox[2] < x1 &&
        tensors[i].bbox[1] > y0 &&
        tensors[i].bbox[3] < y1;
      if (isInBox) {
        currSelected.push(i);
      }
    }
    
    currBoxSelected = [];
    for (var i = 0; i < textBoxes.length; i++) {
      var isInBox =
        textBoxes[i].bbox[0] > x0 &&
        textBoxes[i].bbox[2] < x1 &&
        textBoxes[i].bbox[1] > y0 &&
        textBoxes[i].bbox[3] < y1;
      if (isInBox) {
        currBoxSelected.push(i);
      }
    }
  } else if(stateOfMouse == "boxing") {
    var ind = textBoxes.length - 1;
    var xspan = textBoxes[ind].bbox[2] - textBoxes[ind].bbox[0];
    var yspan = textBoxes[ind].bbox[3] - textBoxes[ind].bbox[1];
    if (xspan < 2*minWidth || yspan < 2*minHeight) {
      deleteLastBox();
      currBoxSelected = [];
    } else {
      leftSelectedType = 1;
      currBoxSelected = [ind];
      rightHighlight = ind;
      currSelected = [];
      updateLeftSelect();
      currGrabbed[0] = "box"; 
      currGrabbed[1] = ind;
      currGrabbed[2] = 0;
      selectTextBox(ind, false);
    }
  }
  if (textBoxes.length==0) {
    collectionComment[0].style.backgroundColor = '#222';
  }

  isLeftDown = false;
  isRightDown = false;
  stateOfMouse = "free";
  // currGrabbed[0] = 'none';
  updateCursorStyle();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getAbsMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: r2aX(evt.clientX - rect.left),
    y: r2aY(evt.clientY - rect.top)
  };
}

function getSnapAbsMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(r2aX(evt.clientX - rect.left) / gridSpaceX) * gridSpaceX,
    y: Math.round(r2aY(evt.clientY - rect.top) / gridSpaceY) * gridSpaceY
  };
}

function getRelMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: a2rX(evt.clientX - rect.left),
    y: a2rY(evt.clientY - rect.top)
  };
}

function checkMinimapMouse(pos) {
  var mX0 = viewWidth - (miniPadX + miniWidth);
  var mY0 = miniPadY;
  
  ctxT.beginPath();
  ctxT.rect(mX0, mY0, miniWidth, miniHeight);
  ctxT.closePath();
  if (ctxT.isPointInPath(pos.x, pos.y)) {
    objUnderMouse[0] = "minimap";
    objUnderMouse[1] = 0;
    return true;
  } else {
    return false;
  }
}

function checkBoxHandlesMouse(pos,ind) {
  if (!currBoxSelected.includes(ind)) {
    return false;
  }
  var x0 = a2rX(textBoxes[ind].bbox[0]);
  var y0 = a2rY(textBoxes[ind].bbox[1]);
  var xf = a2rX(textBoxes[ind].bbox[2]);
  var yf = a2rY(textBoxes[ind].bbox[3]);
  var xmid = 0.5*(x0 + xf);
  var ymid = 0.5*(y0 + yf);

  var handleLocsX = [x0, xmid, xf, xf, xf, xmid, x0, x0,
                     x0, xmid, xf, xf, xf, xmid, x0, x0];
  var handleLocsY = [y0, y0, y0, ymid, yf, yf, yf, ymid,
                    y0, y0, y0, ymid, yf, yf, yf, ymid];
  var handleList = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w',
                   'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  
  for (var j=0; j<8; j++) {
    if (isInCircle(pos, handleLocsX[j], handleLocsY[j], circRad)) {
      objUnderMouse[0] = "boxhandle";
      objUnderMouse[1] = ind;
      objUnderMouse[2] = j;
      handleType = handleList[j] + "-resize";
      coordGrabbed[0] = r2aX(handleLocsX[j+4]);
      coordGrabbed[1] = r2aY(handleLocsY[j+4]);
      updateCursorStyle();
      return true;
    }
  }
  
  return false;
}

function checkHandlesMouse(pos,ind) {
  if (!currSelected.includes(ind)) {
    return false;
  }
  var x0 = a2rX(tensors[ind].bbox[0]);
  var y0 = a2rY(tensors[ind].bbox[1]);
  var xf = a2rX(tensors[ind].bbox[2]);
  var yf = a2rY(tensors[ind].bbox[3]);
  var xmid = 0.5*(x0 + xf);
  var ymid = 0.5*(y0 + yf);
  var rot = tensors[ind].rot;

  var handleLocsX = [x0, xmid, xf, xf, xf, xmid, x0, x0,
                     x0, xmid, xf, xf, xf, xmid, x0, x0];
  var handleLocsY = [y0, y0, y0, ymid, yf, yf, yf, ymid,
                    y0, y0, y0, ymid, yf, yf, yf, ymid];
  var handleList = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w',
                   'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  
  for (var j=0; j<8; j++) {
    if (isInCircle(pos, handleLocsX[j+2*rot], handleLocsY[j+2*rot], circRad)) {
      objUnderMouse[0] = "handle";
      objUnderMouse[1] = ind;
      objUnderMouse[2] = j;
      handleType = handleList[j+2*rot] + "-resize";
      coordGrabbed[0] = r2aX(handleLocsX[j+2*rot+4]);
      coordGrabbed[1] = r2aY(handleLocsY[j+2*rot+4]);
      updateCursorStyle();
      return true;
    }
  }
  
  return false;
}

function checkBoxMouse(pos,ind) {
  var x0 = a2rX(textBoxes[ind].bbox[0]);
  var y0 = a2rY(textBoxes[ind].bbox[1]);
  var tzoom = windowPos.zoom;
  var width = theSizingBox.offsetWidth;
  var height = theSizingBox.offsetHeight;
  
  ctxT.beginPath();
  ctxT.moveTo(x0, y0);
  ctxT.lineTo(x0+width, y0);
  ctxT.lineTo(x0+width, y0+height);
  ctxT.lineTo(x0, y0+height);
  ctxT.closePath();
  
  var isIn = ctxT.isPointInPath(pos.x, pos.y);
  if (isIn) {
    objUnderMouse[0] = "box";
    objUnderMouse[1] = ind;
    objUnderMouse[2] = 0;
    coordGrabbed[0] = r2aX(pos.x - x0);
    coordGrabbed[1] = r2aY(pos.y - y0);
    updateCursorStyle();
    return isIn;
  } else {
    return isIn;
  }
}

function checkOpenMouse(pos,ind) {
  if ((stateOfMouse == "connecting") && (currGrabbed[1] == ind)) {
    var jcon = currGrabbed[2]; 
  } else {
    var jcon = -1;
  }
  
  var num_anchors = tensors[ind].xanchors.length;
  var xmid = tensors[ind].bbox[4];
  var ymid = tensors[ind].bbox[5];
  var tzoom = windowPos.zoom;
  
  for (var j = 0; j < num_anchors; j++) {
    var jnd = tensors[ind].connects[j];
    if ((openIndices.indexOf(Math.abs(jnd)) >= 0) && (j!=jcon)) {
      var xc = a2rX(indices[Math.abs(jnd)].end[0] + xmid);
      var yc = a2rY(indices[Math.abs(jnd)].end[1] + ymid);
     
      if (isInCircle(pos, xc, yc, openIndexRadius)) {
        objUnderMouse[0] = "openind";
        objUnderMouse[1] = Math.abs(jnd);
        objUnderMouse[2] = 0;
        updateCursorStyle();
        return true;
      } else if (Math.abs(xc - pos.x - openIconPos.x[0]) < (fieldIconWidth/2) &&
                 Math.abs(yc - pos.y - openIconPos.y[0]) < (fieldIconHeight/2)) {
        objUnderMouse[0] = "openind";
        objUnderMouse[1] = Math.abs(jnd);
        objUnderMouse[2] = 1;
        updateCursorStyle();
        return true;
      } else if (Math.abs(xc - pos.x - openIconPos.x[1]) < (fieldIconWidth/2) &&
                 Math.abs(yc - pos.y - openIconPos.y[1]) < (fieldIconHeight/2)) {
        objUnderMouse[0] = "openind";
        objUnderMouse[1] = Math.abs(jnd);
        objUnderMouse[2] = 2;
        updateCursorStyle();
        return true;
      }
    }
  }
  return false;
}

function checkIndexMouse(pos) {
  if (stateOfMouse == "connecting") {
    return false;
  }
  var indHandleRad = 8;
  indHandleRad *= 1.5;
  for (var jnd = 1; jnd < indices.length; jnd++) {
    updateIndexCenter(jnd);
    var xc = a2rX(indices[jnd].center[0]);
    var yc = a2rY(indices[jnd].center[1]);
    if (isInCircle(pos, xc, yc, indHandleRad)) {
      objUnderMouse[0] = "indexhandle";
      objUnderMouse[1] = jnd;
      objUnderMouse[2] = 0;
      return true;
    } else {
      for (var k=0; k<indexIconPos.x.length; k++) {
        // console.log(Math.abs(xc - pos.x + indexIconPos.x[k]))
        // console.log(Math.abs(yc - pos.y + indexIconPos.y[k]))
        if (Math.abs(xc - pos.x + indexIconPos.x[k]) < (fieldIconWidth/2) &&
            Math.abs(yc - pos.y + indexIconPos.y[k]) < (fieldIconHeight/2)) {
          objUnderMouse[0] = "indexhandle";
          objUnderMouse[1] = jnd;
          objUnderMouse[2] = k+1;
          updateCursorStyle();
          return true;
        }
      }
    }
  }
  return false;
}

function checkAnchorsMouse(pos,ind) {
  var num_anchors = tensors[ind].xanchors.length;
  var xmid = tensors[ind].bbox[4];
  var ymid = tensors[ind].bbox[5];

  for (var j = 0; j < num_anchors; j++) {
    var xc = a2rX(tensors[ind].xanchors[j] + xmid);
    var yc = a2rY(tensors[ind].yanchors[j] + ymid);

    if (
      2 * Math.abs(xc - pos.x) < (anchorTolerance*anchorWidth) &&
      2 * Math.abs(yc - pos.y) < (anchorTolerance*anchorHeight)
    ) {
      objUnderMouse[0] = "anchor";
      objUnderMouse[1] = ind;
      objUnderMouse[2] = j;
      updateCursorStyle();
      return true;
    }
  }
  return false;
}

function checkBoxRenameMouse(pos,ind) {
  var xmid = a2rX(textBoxes[ind].bbox[0]) + theSizingBox.offsetWidth;
  var ymid = a2rY(textBoxes[ind].bbox[1]) + theSizingBox.offsetHeight/2;

  if (isInRange(pos.x, xmid, xmid+fieldIconWidth) && isInRange(pos.y, ymid, ymid+fieldIconWidth)) {
    objUnderMouse[0] = "boxrename";
    objUnderMouse[1] = ind;
    objUnderMouse[2] = 0;
    updateCursorStyle();
    return true;
  }
  return false;
}

function checkRenameMouse(pos,ind) {
  for (var j=0; j<iconPos.x.length; j++) {
    var xmid = a2rX(tensors[ind].bbox[4]) + iconPos.x[j];
    var ymid = a2rY(tensors[ind].bbox[5]) + iconPos.y[j];
    
    var x0 = Math.round(xmid - fieldIconWidth / 2);
    var y0 = Math.round(ymid - fieldIconHeight / 2);
    var x1 = Math.round(xmid + fieldIconWidth / 2);
    var y1 = Math.round(ymid + fieldIconHeight / 2);
    
    if (isInRange(pos.x, x0, x1) && isInRange(pos.y, y0, y1)) {
      objUnderMouse[0] = "rename";
      objUnderMouse[1] = ind;
      objUnderMouse[2] = j;
      updateCursorStyle();
      return true;
    }
  }
  return false;
}

function checkTensorMouse(pos,ind) {
  if (checkInTensor(pos, ind, true)) {
    objUnderMouse[0] = "tensor";
    objUnderMouse[1] = ind;
    updateCursorStyle();
    return true;
  }
  return false;
}


