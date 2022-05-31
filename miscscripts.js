/*
miscellaneous functions 
*/

function roundAllCoords() {
  var numTensors = tensors.length;
  for (var i=0; i<numTensors; i++) {
    // bbox
    for (var k=0; k<4; k++) {
      tensors[i].bbox[k] = Math.round(tensors[i].bbox[k]);
    }
    tensors[i].bbox[4] = 0.5*(tensors[i].bbox[0] + tensors[i].bbox[2]);
    tensors[i].bbox[5] = 0.5*(tensors[i].bbox[1] + tensors[i].bbox[3]);
    // anchors
    var numIndices = tensors[i].connects.length;
    for (var k=0; k<numIndices; k++) {
      tensors[i].xanchors[k] = Math.round(tensors[i].xanchors[k]);
      tensors[i].yanchors[k] = Math.round(tensors[i].yanchors[k]);
    }
  }
  var numIndices = indices.length;
  for (var i=1; i<numIndices; i++) {
    indices[i].end[0] = Math.round(indices[i].end[0]);
    indices[i].end[1] = Math.round(indices[i].end[1]);
  }
}

function resizeCanvas() {
  mainWindow.style.maxWidth = (spaceWidth + leftMenuWidth + rightMenuWidth) + "px";
  mainWindow.style.maxHeight = (spaceHeight + topMenuHeight) + "px";
  
  viewWidth = mainWindow.clientWidth - (leftMenuWidth + rightMenuWidth);
  viewHeight = mainWindow.clientHeight - topMenuHeight;
  windowWidth = viewWidth / windowPos.zoom;
  windowHeight = viewHeight / windowPos.zoom;
  
  if (windowPos.x > (spaceWidth - windowWidth)) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if (windowPos.y > (spaceHeight - windowHeight)) {
    windowPos.y = spaceHeight - windowHeight;
  }
  
  canvasBase.width = viewWidth;
  canvasBase.height = viewHeight;
  ctxB.clearRect(0, 0, viewWidth, viewHeight);

  canvasMoving.width = viewWidth;
  canvasMoving.height = viewHeight;
  ctxM = canvasMoving.getContext('2d')
  ctxM.clearRect(0, 0, viewWidth, viewHeight);

  canvasTensors.width = viewWidth;
  canvasTensors.height = viewHeight;
  ctxT = canvasTensors.getContext('2d')
  ctxT.clearRect(0, 0, viewWidth, viewHeight);
  
  canvasHandles.width = viewWidth;
  canvasHandles.height = viewHeight;
  ctxH.clearRect(0, 0, viewWidth, viewHeight);
  
  canvasBackground.width = viewWidth;
  canvasBackground.height = viewHeight;
  ctxG.clearRect(0, 0, viewWidth, viewHeight);
  ctxG.fillStyle = "#808080";
  ctxG.fillRect(0, 0, viewWidth, viewHeight);
  
  rightMenu.style.height = viewHeight+'px';
  codeBox.style.height = (viewHeight-33)+'px';
  codeBox.style.width = (rightMenuWidth-67)+'px';
  rightGuiResizer.style.height = viewHeight+'px';
  
  miniPadY = viewHeight - miniHeight - 15;
  
  drawGrid();
  drawTensors();
  drawMinimap();
}

function addVector(a,b){
    return a.map((e,i) => e + b[i]);
}

function addIntToVec(a,b){
    return a.map((e,i) => e + b);
}

function allRound(a){
    return a.map((e) => Math.round(e));
}

function a2rX(xa) {
  return windowPos.zoom*(xa - windowPos.x);
}

function a2rY(ya) {
  return windowPos.zoom*(ya - windowPos.y);
}

function r2aX(xr) {
  return windowPos.x + (xr / windowPos.zoom)
}

function r2aY(yr) {
  return windowPos.y + (yr / windowPos.zoom)
}

function makeInRange(x,xmin,xmax) {
  if (x < xmin) {
    return xmin;
  } else if (x > xmax) {
    return xmax;
  } else {
    return x;
  }
}

function isInRange(x,xmin,xmax) {
  if (x >= xmin && x <= xmax) {
    return true;
  } else {
    return false;
  }
}

function makeAllInRange(xvec,xmin,xmax) {
  return xvec.map((e) =>  makeInRange(e,xmin,xmax));
}

function updateCursorStyle() {
  if (stateOfMouse == 'free') {
    if (objUnderMouse[0] == "none") {
      canvasMoving.style.cursor = "default";
    } else if (objUnderMouse[0] == "tensor") {
      canvasMoving.style.cursor = "move";
    } else if (objUnderMouse[0] == "handle") {
      canvasMoving.style.cursor = handleType;
    } else if (objUnderMouse[0] == "rename") {
      canvasMoving.style.cursor = "pointer";
    } else if (objUnderMouse[0] == "anchor") {
      canvasMoving.style.cursor = "default";
    }
    
  } else if (stateOfMouse == 'shifting') {
    canvasMoving.style.cursor = "move";
  } else if (stateOfMouse == 'creating') {
    canvasMoving.style.cursor = "pointer";
  } else if (stateOfMouse == 'scrolling') {
    canvasMoving.style.cursor = "grabbing";
  } else if (stateOfMouse == 'renaming') {
    canvasMoving.style.cursor = "text";
  } else if (stateOfMouse == 'selecting') {
    canvasMoving.style.cursor = "pointer";
  } else if (stateOfMouse == 'anchoring') {
    canvasMoving.style.cursor = "grabbing";
  } else if (stateOfMouse == 'duplicating') {
    canvasMoving.style.cursor = "move";
  } else {
    canvasMoving.style.cursor = "default";
  }
}

function roundHP(x) {
  var xc = Math.ceil(x) - 0.5;
  var xf = Math.floor(x) + 0.5;
  if (Math.abs(xc - x) < Math.abs(xf - x)) {
    return xc;
  } else {
    return xf;
  }
}

function a2mX(xa) {
  return miniWidth*(xa / spaceWidth) + (viewWidth - (miniPadX + miniWidth));
}

function a2mY(ya) {
  return miniHeight*(ya / spaceHeight) + miniPadY;
}

function snapX(x0) {
  return Math.round(x0 / gridSpaceX) * gridSpaceX;
}

function snapY(y0) {
  return Math.round(y0 / gridSpaceY) * gridSpaceY;
}



