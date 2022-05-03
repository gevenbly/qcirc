/*
miscellaneous functions 
*/

function resizeCanvas() {
  mainWindow.style.maxWidth = (spaceWidth + leftMenuWidth + rightMenuWidth) + "px";
  mainWindow.style.maxHeight = (spaceHeight + topMenuHeight) + "px";
  
  viewWidth = mainWindow.clientWidth - (leftMenuWidth + rightMenuWidth);
  viewHeight = mainWindow.clientHeight - topMenuHeight;
  windowWidth = viewWidth / windowZoom;
  windowHeight = viewHeight / windowZoom;
  
  if (windowX0 > (spaceWidth - windowWidth)) {
    windowX0 = spaceWidth - windowWidth;
  }
  if (windowY0 > (spaceHeight - windowHeight)) {
    windowY0 = spaceHeight - windowHeight;
  }
  
  canvasBase.width = viewWidth;
  canvasBase.height = viewHeight;
  ctxB.clearRect(0, 0, viewWidth, viewHeight);

  canvasMoving.width = viewWidth;
  canvasMoving.height = viewHeight;
  ctxM.clearRect(0, 0, viewWidth, viewHeight);

  canvasTensors.width = viewWidth;
  canvasTensors.height = viewHeight;
  ctxT.clearRect(0, 0, viewWidth, viewHeight);
  
  canvasBackground.width = viewWidth;
  canvasBackground.height = viewHeight;
  ctxG.clearRect(0, 0, viewWidth, viewHeight);
  ctxG.fillStyle = "#808080";
  ctxG.fillRect(0, 0, viewWidth, viewHeight);
  
  // rightMenuIcon.style.top = Math.round(viewHeight/2 + topMenuHeight) + "px";
  
  drawGrid();
  drawTensors();
  drawMinimap();
}

function addVector(a,b){
    return a.map((e,i) => e + b[i]);
}

function allRound(a){
    return a.map((e) => Math.round(e));
}

function a2rXall(xcoords) {
  return xcoords.map((e) => a2rX(e))
}

function a2rYall(ycoords) {
  return ycoords.map((e) => a2rY(e))
}

function a2rX(xa) {
  return windowZoom*(xa - windowX0);
}

function a2rY(ya) {
  return windowZoom*(ya - windowY0);
}

function r2aX(xr) {
  return windowX0 + (xr / windowZoom)
}

function r2aY(yr) {
  return windowY0 + (yr / windowZoom)
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
    } 
    
    if (objUnderMouse[0] == "rename") {
      canvasMoving.style.cursor = "pointer";
    }
    
  } else if (stateOfMouse == 'shifting') {
    canvasMoving.style.cursor = "move";
  } else if (stateOfMouse == 'creating') {
    canvasMoving.style.cursor = "pointer";
  } else if (stateOfMouse == 'scrolling') {
    canvasMoving.style.cursor = "grabbing";
  } else if (stateOfMouse == 'renaming') {
    canvasMoving.style.cursor = "text";
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
  return miniWidth*(xa / spaceWidth) + (viewWidth - (miniPad + miniWidth));
}

function a2mY(ya) {
  return miniHeight*(ya / spaceHeight) + miniPad;
}

function a2mXall(xcoords) {
  return xcoords.map((e) => a2mX(e))
}

function a2mYall(ycoords) {
  return ycoords.map((e) => a2mY(e))
}

function snapX(x0) {
  return Math.round(x0 / gridSpaceX) * gridSpaceX;
}

function snapY(y0) {
  return Math.round(y0 / gridSpaceY) * gridSpaceY;
}



