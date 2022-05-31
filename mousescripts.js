/*
functions that determine the elements and position that
the mouse is over.
*/
    
function checkUnderMouse(evt) {
  if (stateOfMouse != "renaming") {
    var pos = getMousePos(canvasBase, evt);
    if (checkMinimapMouse(pos)) {
      return;
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
      } else if (checkTensorMouse(pos,ind)) {
        return;
      }
    }
    // mouse is over nothing special
    objUnderMouse[0] = "none";
    objUnderMouse[1] = 0;
    return;
  }
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
    x0 = selectBox[0];
    x1 = selectBox[2];
    y0 = selectBox[1];
    y1 = selectBox[3];

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
    updateSelectionBox();
  }

  isLeftDown = false;
  isRightDown = false;
  stateOfMouse = "free";
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

function checkOpenMouse(pos,ind) {
  var num_anchors = tensors[ind].xanchors.length;
  var xmid = tensors[ind].bbox[4];
  var ymid = tensors[ind].bbox[5];
  
  for (var j = 0; j < num_anchors; j++) {
    var jnd = tensors[ind].connects[j];
    if (openIndices.indexOf(Math.abs(jnd)) >= 0) {
      var xc = a2rX(indices[Math.abs(jnd)].end[0] + xmid);
      var yc = a2rY(indices[Math.abs(jnd)].end[1] + ymid);
      if (
        Math.abs(xc - pos.x) < (openIndexRadius) &&
        Math.abs(yc - pos.y) < (openIndexRadius)
      ) {
        objUnderMouse[0] = "openind";
        objUnderMouse[1] = Math.abs(jnd);
        objUnderMouse[2] = 0;
        updateCursorStyle();
        return true;
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

function checkRenameMouse(pos,ind) {
  for (var j=0; j<numTensorIcons; j++) {
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

function isInCircle(pos, x0, y0, circRad) {
  return ((pos.x-x0)**2 + (pos.y-y0)**2 < circRad**2) 
}
