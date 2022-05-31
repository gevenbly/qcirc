/*
functions for drawing to canvas
*/

function drawTensors() {
  
  if (!canvasBasedNames) {
    updateTensorTags();
  }
  
  // drawCircle(ctxT, a2rX(selectBox[4]),a2rY(selectBox[5]), circRad, circThick);
  
  
  ctxT.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  ctxH.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  ctxT.setLineDash([]);
  
  
  var isOverObject = (objUnderMouse[0] === "tensor" || 
                      objUnderMouse[0] === "rename" || 
                      objUnderMouse[0] === "anchor" || 
                      objUnderMouse[0] === "handle");
  
  for (var i = 0; i < tensors.length; i++) {
    var currFill = leftColorTypes[tensors[i].color];
    var currFillDark = leftColorTypes[tensors[i].color + numColors];
    var currFillLight = leftColorTypes[tensors[i].color + 2*numColors];
    
    var isOverCurrTensor = ((i == objUnderMouse[1]) && isOverObject);
    if (isOverCurrTensor) {
      var tempColor = currFillLight;
    } else {
      var tempColor = currFill;
    }
    
    if (stateOfMouse == "duplicating" && currSelected.indexOf(i)>=0) {
      var opac = 0.5;
      var isDup = true;
    } else {
      var opac = 0.8;
      var isDup = false;
    }
    
    
    // draw the main shape
    if (tensors[i].type == 0) {
      drawTensorRectangle(i,ctxT,tempColor,currFillDark,opac);
    } else if (tensors[i].type == 1) {
      drawTensorEllipse(i,ctxT,tempColor,currFillDark,opac);
    } else if (tensors[i].type == 2) {
      drawTensorDome(i,ctxT,tempColor,currFillDark,opac);
    } else if (tensors[i].type == 3) {
      drawTensorTrap(i,ctxT,tempColor,currFillDark,opac);
    }
    if (!isDup) {
      drawTensorName(i,ctxT);
      if (isOverCurrTensor) {drawTensorIcons(i,ctxT)};
    }
  }
  
  // draw indices
  drawIndices() ;
  if (stateOfMouse == "connecting") {
    
    var ind = currGrabbed[1];
    var jnd = currGrabbed[2];
    var xtemp = a2rX(tensors[ind].bbox[4] + tensors[ind].xanchors[jnd]);
    var ytemp = a2rY(tensors[ind].bbox[5] + tensors[ind].yanchors[jnd]);
    
    ctxT.lineWidth = 3;
    ctxT.strokeStyle = '#848484';
    ctxT.beginPath();
    ctxT.moveTo(xtemp, ytemp);
    ctxT.lineTo(mousePos[0], mousePos[1]);
    ctxT.closePath();
    ctxT.stroke();
    
    drawIndexHandles(0.5*(mousePos[0]+xtemp), 
                     0.5*(mousePos[1]+ytemp), 
                     mousePos[0]-xtemp, 
                     mousePos[1]-ytemp);
  }
  
  for (var i = 0; i < tensors.length; i++) {
    drawAnchors(i,ctxT);
    drawTensorHandles(i,ctxT);
  }

  if (stateOfMouse == "selecting") {
    var x0 = roundHP(a2rX(selectBox[0]));
    var y0 = roundHP(a2rY(selectBox[1]));
    var x1 = roundHP(a2rX(selectBox[2]));
    var y1 = roundHP(a2rY(selectBox[3]));

    ctxT.globalAlpha = 0.2;
    ctxT.fillStyle = "#cccccc";
    ctxT.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctxT.strokeStyle = "#c4c4c4";
    ctxT.globalAlpha = 1;
    ctxT.setLineDash([4, 4]);
    ctxT.lineWidth = 1;
    ctxT.beginPath();
    ctxT.rect(x0, y0, x1 - x0, y1 - y0);
    ctxT.stroke();
  }
}

function drawTensorTrap(i,ctx,theFillColor,theOutlineColor,opac) {
  var rot = tensors[i].rot;
  var x0 = a2rX(tensors[i].bbox[0]);
  var y0 = a2rY(tensors[i].bbox[1]);
  var xf = a2rX(tensors[i].bbox[2]);
  var yf = a2rY(tensors[i].bbox[3]);
  var xmid = a2rX(tensors[i].bbox[4]);
  var ymid = a2rY(tensors[i].bbox[5]);
  var slope = tensors[i].slope;
  if (rot == 0 || rot == 2) {
    var halfwidth = (xmid-x0);
  } else {
    var halfwidth = (ymid-y0);
  }
  
  ctx.beginPath();
  if (rot==0) {
    ctx.moveTo(x0, yf);
    ctx.lineTo(x0 + slope*halfwidth, y0);
    ctx.lineTo(xf - slope*halfwidth, y0);
    ctx.lineTo(xf, yf);
    ctx.lineTo(x0, yf);
  } else if (rot==1) {
    ctx.moveTo(x0, y0);
    ctx.lineTo(xf, y0 + slope*halfwidth);
    ctx.lineTo(xf, yf - slope*halfwidth);
    ctx.lineTo(x0, yf);
    ctx.lineTo(x0, y0);
  } else if (rot==2) {
    ctx.moveTo(xf, y0);
    ctx.lineTo(xf - slope*halfwidth, yf);
    ctx.lineTo(x0 + slope*halfwidth, yf);
    ctx.lineTo(x0, y0);
    ctx.lineTo(xf, y0);
  } else if (rot==3) {
    ctx.moveTo(xf, yf);
    ctx.lineTo(x0, yf - slope*halfwidth);
    ctx.lineTo(x0, y0 + slope*halfwidth);
    ctx.lineTo(xf, y0);
    ctx.lineTo(xf, yf);
  }
  ctx.closePath();

  var grd = ctx.createLinearGradient(x0, y0, x0 + 2 * (xf - x0), y0 + 2 * (yf - y0));
  grd.addColorStop(0, theFillColor);
  grd.addColorStop(1, "white");
  ctx.fillStyle = grd;
  ctx.globalAlpha = opac;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // outline
  ctx.strokeStyle = theOutlineColor;
  ctx.lineWidth = rectBorderWidth;
  ctx.stroke();
}

function drawTensorDome(i,ctx,theFillColor,theOutlineColor,opac) {
  var rot = tensors[i].rot;
  var x0 = a2rX(tensors[i].bbox[0]);
  var y0 = a2rY(tensors[i].bbox[1]);
  var xf = a2rX(tensors[i].bbox[2]);
  var yf = a2rY(tensors[i].bbox[3]);
  var xmid = a2rX(tensors[i].bbox[4]);
  var ymid = a2rY(tensors[i].bbox[5]);
  
  ctx.beginPath();
  if (rot==0) {
    ctx.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI, 0);
    ctx.lineTo(xf,yf);
    ctx.lineTo(x0,yf);
    ctx.lineTo(x0,ymid);
  } else if (rot==1) {
    ctx.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 3*Math.PI/2, Math.PI/2);
    ctx.lineTo(x0,yf);
    ctx.lineTo(x0,y0);
    ctx.lineTo(xmid,y0);
  } else if (rot==2) {
    ctx.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 0, Math.PI);
    ctx.lineTo(x0,y0);
    ctx.lineTo(xf,y0);
    ctx.lineTo(xf,ymid);
  } else if (rot==3) {
    ctx.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI/2, 3*Math.PI/2);
    ctx.lineTo(xf,y0);
    ctx.lineTo(xf,yf);
    ctx.lineTo(xmid,yf);
  }
  ctx.closePath();

  var grd = ctx.createLinearGradient(x0, y0, x0 + 2 * (xf - x0), y0 + 2 * (yf - y0));
  grd.addColorStop(0, theFillColor);
  grd.addColorStop(1, "white");
  ctx.fillStyle = grd;
  ctx.globalAlpha = opac;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // outline
  ctx.strokeStyle = theOutlineColor;
  ctx.lineWidth = rectBorderWidth;
  ctx.stroke();
}

function drawTensorRectangle(i,ctx,theFillColor,theOutlineColor,opac) {
  // set path
  var x0 = a2rX(tensors[i].bbox[0]);
  var y0 = a2rY(tensors[i].bbox[1]);
  var width = a2rX(tensors[i].bbox[2]) - a2rX(tensors[i].bbox[0]);
  var height = a2rY(tensors[i].bbox[3]) - a2rY(tensors[i].bbox[1]);
  roundRect(ctx, x0, y0, width, height, rectCornerRad);

  var grd = ctx.createLinearGradient(x0, y0, x0 + 2 * width, y0 + 2 * height);
  grd.addColorStop(0, theFillColor);
  grd.addColorStop(1, "white");
  ctx.fillStyle = grd;
  ctx.globalAlpha = opac;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // outline
  ctx.strokeStyle = theOutlineColor;
  ctx.lineWidth = rectBorderWidth;
  ctx.stroke();
}

function drawTensorEllipse(i,ctx,theFillColor,theOutlineColor,opac) {
  // set path
  var x0 = roundHP(a2rX(tensors[i].bbox[0]));
  var y0 = roundHP(a2rY(tensors[i].bbox[1]));
  var xf = roundHP(a2rX(tensors[i].bbox[2]));
  var yf = roundHP(a2rY(tensors[i].bbox[3]));
  var xmid = Math.round(a2rX(tensors[i].bbox[4]));
  var ymid = Math.round(a2rY(tensors[i].bbox[5]));

  ctx.beginPath();
  ctx.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 0, 2 * Math.PI);

  var grd = ctx.createLinearGradient(x0, y0, x0 + 2 * (xf - x0), y0 + 2 * (yf - y0));
  grd.addColorStop(0, theFillColor);
  grd.addColorStop(1, "white");
  ctx.fillStyle = grd;
  ctx.globalAlpha = opac;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // outline
  ctx.strokeStyle = theOutlineColor;
  ctx.lineWidth = rectBorderWidth;
  ctx.stroke();
}

function drawTensorName(i,ctx) {
  
  var xmid = a2rX(tensors[i].bbox[4]);
  var ymid = a2rY(tensors[i].bbox[5]);
  
  if (canvasBasedNames) {
    ctx.font = "12px Verdana";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("T" + i + ":" + tensors[i].name, roundHP(xmid), roundHP(ymid) + 5); 
  } else {
    if (stateOfMouse == "renaming" && currGrabbed[1] == i) {
      allNameTags[i].style.display = "none";
    } else {
      allNameTags[i].style.left = Math.round(xmid - allNameTags[i].offsetWidth/2 + leftMenuWidth)+'px';
      allNameTags[i].style.top = Math.round(ymid - allNameTags[i].offsetHeight/2 + topMenuHeight)+'px';
    }
  }
}

function drawIndices() {
  for (var ind = 1; ind < indices.length; ind++) {
    var wasOpen = false;
    if (indices[ind].connects[0]<0 || indices[ind].connects[2]<0) { //open index
      var i0 = Math.max(indices[ind].connects[0], indices[ind].connects[2]);
      var j0 = Math.max(indices[ind].connects[1], indices[ind].connects[3]);
      var x0 = a2rX(tensors[i0].bbox[4] + tensors[i0].xanchors[j0]);
      var y0 = a2rY(tensors[i0].bbox[5] + tensors[i0].yanchors[j0]);
      var x1 = a2rX(tensors[i0].bbox[4] + indices[ind].end[0]);
      var y1 = a2rY(tensors[i0].bbox[5] + indices[ind].end[1]);
      wasOpen = true;
      
      
    } else { //closed index
      var i0 = indices[ind].connects[0];
      var j0 = indices[ind].connects[1];
      var i1 = indices[ind].connects[2];
      var j1 = indices[ind].connects[3];
      var x0 = a2rX(tensors[i0].bbox[4] + tensors[i0].xanchors[j0]);
      var y0 = a2rY(tensors[i0].bbox[5] + tensors[i0].yanchors[j0]);
      var x1 = a2rX(tensors[i1].bbox[4] + tensors[i1].xanchors[j1]);
      var y1 = a2rY(tensors[i1].bbox[5] + tensors[i1].yanchors[j1]);
    }

    // draw index
    ctxT.lineWidth = 2;
    ctxT.strokeStyle = '#848484';
    ctxT.beginPath();
    ctxT.moveTo(x0, y0);
    ctxT.lineTo(x1, y1);
    ctxT.closePath();
    ctxT.stroke();
    
    if (wasOpen) {//draw endpoint
      var tempLab = indices[ind].label;
      ctxT.fillStyle = allAnchorColors[tempLab % (allAnchorColors.length)];      
      ctxT.beginPath();
      ctxT.arc(x1, y1, openIndexRadius, 0, 2 * Math.PI, false);
      ctxT.fill();
      ctxT.lineWidth = 1;
      if (objUnderMouse[0] == "openind" && objUnderMouse[1] == ind) {
        ctxT.strokeStyle = "white";
      } else {
        ctxT.strokeStyle = rectBorderCol;
      }
      ctxT.stroke();
      
      if (numericalInds) {
        ctxT.textAlign = "center";
        ctxT.fillStyle = "black";
        if ((tempLab+isOneBased)<10) {
          ctxT.font = "bold 10px Verdana";
          ctxT.fillText(tempLab+isOneBased, x1, y1+4);
        } else {
          ctxT.font = "bold 8px Verdana";
          ctxT.fillText(tempLab+isOneBased, x1, y1+2);
        }
      }
    }
    
    // draw index handles
    if (indices[ind].curved) {
      
    } else { // index is straight
      drawIndexHandles(0.5*(x1+x0), 0.5*(y1+y0), x1-x0, y1-y0);
    }
  }
}

function drawIndexHandles(xc, yc, dx, dy) {
 
  if (Math.abs(dx) < 1e-5 && Math.abs(dy) < 1e-5) {
    dx += 1e-5;
    dy += 1e-5;
  };
  var cn = Math.sqrt(dx*dx + dy*dy);
  var indRad = 5;
  var tempRot = Math.atan2(dx, dy);
  ctxT.beginPath();
  ctxT.fillStyle = '#848484';
  ctxT.ellipse(xc-indRad*dx/cn, yc-indRad*dy/cn, indRad, 2*indRad, -tempRot+Math.PI, Math.PI, 2*Math.PI)
  ctxT.closePath();
  ctxT.fill();
  
//   ctxT.beginPath();
//   ctxT.fillStyle = '#848484';
//   ctxT.moveTo(xc+indRad*(-dx+dy), yc+indRad*(-dy-dx));
//   ctxT.lineTo(xc+indRad*dy, yc-indRad*dx);
//   ctxT.lineTo(xc-indRad*dy, yc+indRad*dx);
//   ctxT.lineTo(xc+indRad*(-dx-dy), yc+indRad*(-dy+dx));
//   ctxT.closePath();
//   ctxT.fill();

//   ctxT.beginPath();
//   ctxT.fillStyle = '#848484';
//   ctxT.arc(xc, yc, indRad*cn, 0, 2 * Math.PI, false);
//   ctxT.closePath();
//   ctxT.fill();
}

function drawAnchors(i,ctx) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  var numAnchors = tensors[i].xanchors.length;
  var xmid = a2rX(tensors[i].bbox[4]);
  var ymid = a2rY(tensors[i].bbox[5]);
  var anchorRoundness = 3;

  for (var j = 0; j < numAnchors; j++) {
    var colTemp = allAnchorColors[j];
    if (objUnderMouse[0] == "anchor" && objUnderMouse[1] == i && objUnderMouse[2] == j) {
      // colTemp = lightenColor(colTemp, 10);
      ctx.strokeStyle = "white";
    } else {
      ctx.strokeStyle = "black";
    }
    if (j>=7) {anchorRoundness = 6}
    
    ctx.fillStyle = colTemp;
    var xd = tensors[i].xanchors[j] * windowPos.zoom + xmid;
    var yd = tensors[i].yanchors[j] * windowPos.zoom + ymid;
    roundRect(ctx, xd - anchorWidth/2, yd - anchorHeight/2,
              anchorWidth, anchorHeight, anchorRoundness);
    ctx.fill();
    ctx.stroke()
    
    if (numericalInds) {
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      if ((j+isOneBased) < 10) {
        ctx.font = "bold 10px Verdana";
        ctx.fillText(j+isOneBased, xd, yd+anchorHeight/2-2);
      } else {
        ctx.font = "bold 8px Verdana";
        ctx.fillText(j+isOneBased, xd, yd+anchorHeight/2-3);
      }
    }
  }
}

function drawTensorIcons(i,ctx) {
  // if (currSelected.includes(i)) {
    for (var j=0; j<numTensorIcons; j++) {
      var xmid = Math.round(a2rX(tensors[i].bbox[4]));
      var ymid = Math.round(a2rY(tensors[i].bbox[5]));
      
      if (objUnderMouse[0] == "rename" && objUnderMouse[1] == i && objUnderMouse[2] == j) {
        ctx.drawImage(
          tensorIcons[j+3],
          Math.round(xmid + iconPos.x[j] - fieldIconWidth / 2),
          Math.round(ymid + iconPos.y[j] - fieldIconHeight / 2)
        );
      } else {
        ctx.drawImage(
          tensorIcons[j],
          Math.round(xmid + iconPos.x[j] - fieldIconWidth / 2),
          Math.round(ymid + iconPos.y[j] - fieldIconHeight / 2)
        );
      }
    }
  // }
}

function drawTensorHandles(i,ctx) {
  
  ctx.lineWidth = 1;
  ctx.fillStyle = "#dddddd";
  ctx.strokeStyle = "#505050";
  if (currSelected.includes(i)) {
    var x0 = roundHP(a2rX(tensors[i].bbox[0]));
    var y0 = roundHP(a2rY(tensors[i].bbox[1]));
    var xf = roundHP(a2rX(tensors[i].bbox[2]));
    var yf = roundHP(a2rY(tensors[i].bbox[3]));
    var xmid = 0.5*(x0 + xf);
    var ymid = 0.5*(y0 + yf);
    var rot = tensors[i].rot;
    
    var handleLocsX = [x0, xmid, xf, xf, xf, xmid, x0, x0,
                       x0, xmid, xf, xf, xf, xmid, x0, x0];
    var handleLocsY = [y0, y0, y0, ymid, yf, yf, yf, ymid,
                       y0, y0, y0, ymid, yf, yf, yf, ymid];
    
    for (var j=0; j<8; j++) {
      drawCircle(ctx, handleLocsX[j+2*rot], handleLocsY[j+2*rot], circRad, circThick);
    }
    
    ctx.strokeStyle = "#c4c4c4";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(x0, y0, xf-x0, yf-y0);
    ctx.stroke();
  }
}

function drawCircle(context, cX, cY, radius, thick) {
  context.beginPath();
  context.arc(cX, cY, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.lineWidth = thick;
  context.strokeStyle = "#003300";
  context.stroke();
}

function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawDebugBox(debugStrings) {
  const boxHeight = 20 + debugStrings.length * 30;
  const boxWidth = 300;

  ctxB.fillStyle = "black";
  ctxB.fillRect(10, 10, boxWidth, boxHeight);
  ctxB.fillStyle = "red";
  ctxB.font = "20px Arial";
  ctxB.textAlign = "left";
  for (var i = 0; i < debugStrings.length; i++) {
    ctxB.fillText(debugStrings[i], 10, 40 + 30 * i);
  }
}

function drawGrid() {
  ctxG.clearRect(0, 0, viewWidth, viewHeight);
  ctxG.fillStyle = "#202020";
  ctxG.fillRect(0, 0, viewWidth, viewHeight);

  if (gridOn) {
    ctxG.lineWidth = 1;
    ctxG.strokeStyle = "#2b3c3d";
    ctxG.setLineDash([2, 2]);

    const numLinesWidth = Math.floor(spaceWidth / gridSpaceX);
    for (var i = 0; i < numLinesWidth; i++) {
      var xloc = (i + 1) * gridSpaceX;
      if (xloc > windowPos.x && xloc < windowPos.x + windowWidth) {
        var xrel = roundHP(a2rX(xloc));
        ctxG.beginPath();
        ctxG.moveTo(xrel, 0);
        ctxG.lineTo(xrel, canvasBackground.height);
        ctxG.stroke();
      }
    }

    const numLinesHeight = Math.floor(spaceHeight / gridSpaceY);
    for (var i = 0; i < numLinesHeight; i++) {
      var yloc = (i + 1) * gridSpaceY;
      if (yloc > windowPos.y && yloc < windowPos.y + windowHeight) {
        var yrel = roundHP(a2rY(yloc));
        ctxG.beginPath();
        ctxG.moveTo(0, yrel);
        ctxG.lineTo(canvasBackground.width, yrel);
        ctxG.stroke();
      }
    }
  }
}

function drawMinimap() {
  if (showMini) {
    ctxB.clearRect(0, 0, viewWidth, viewHeight);
    var mX = Math.round(viewWidth - (miniPadX + miniWidth));
    var mY = Math.round(miniPadY);

    // draw map box
    ctxB.fillStyle = "#b5b5b5";
    ctxB.strokeStyle = "#202020";
    ctxB.beginPath();
    ctxB.lineWidth = 1;
    ctxB.rect(mX, mY, miniWidth, miniHeight);
    ctxB.fill();
    ctxB.stroke();

    var wX0 = roundHP(miniWidth * (windowPos.x / spaceWidth) + mX);
    var wX1 = roundHP(miniWidth * ((windowPos.x + windowWidth) / spaceWidth) + mX);
    var wY0 = roundHP(miniHeight * (windowPos.y / spaceHeight) + mY);
    var wY1 = roundHP(
      miniHeight * ((windowPos.y + windowHeight) / spaceHeight) + mY
    );

    // draw map tensors
    for (var i = 0; i < tensors.length; i++) {
      if (tensors[i].type == 0) {
        var x0 = a2mX(tensors[i].bbox[0]);
        var xf = a2mX(tensors[i].bbox[2]);
        var y0 = a2mY(tensors[i].bbox[1]);
        var yf = a2mY(tensors[i].bbox[3]);

        ctxB.fillStyle = "#545454";
        ctxB.beginPath();
        ctxB.moveTo(x0, y0);
        ctxB.lineTo(xf, y0);
        ctxB.lineTo(xf, yf);
        ctxB.lineTo(x0, yf);
        ctxB.closePath();
        ctxB.fill();
        
      } else if (tensors[i].type == 1) {
        var x0 = a2mX(tensors[i].bbox[0]);
        var xf = a2mX(tensors[i].bbox[2]);
        var y0 = a2mY(tensors[i].bbox[1]);
        var yf = a2mY(tensors[i].bbox[3]);
        var xmid = (x0 + xf) / 2;
        var ymid = (y0 + yf) / 2;

        ctxB.fillStyle = "#545454";
        ctxB.beginPath();
        ctxB.ellipse(xmid,ymid,(xf-x0)/2,(yf-y0)/2,0,0,2*Math.PI);
        ctxB.closePath();
        ctxB.fill();
        
      } else if (tensors[i].type == 2) {
        var rot = tensors[i].rot;
        var x0 = a2mX(tensors[i].bbox[0]);
        var y0 = a2mY(tensors[i].bbox[1]);
        var xf = a2mX(tensors[i].bbox[2]);
        var yf = a2mY(tensors[i].bbox[3]);
        var xmid = a2mX(tensors[i].bbox[4]);
        var ymid = a2mY(tensors[i].bbox[5]);

        ctxB.beginPath();
        if (rot==0) {
          ctxB.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI, 0);
          ctxB.lineTo(xf,yf);
          ctxB.lineTo(x0,yf);
          ctxB.lineTo(x0,ymid);
        } else if (rot==1) {
          ctxB.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 3*Math.PI/2, Math.PI/2);
          ctxB.lineTo(x0,yf);
          ctxB.lineTo(x0,y0);
          ctxB.lineTo(xmid,y0);
        } else if (rot==2) {
          ctxB.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 0, Math.PI);
          ctxB.lineTo(x0,y0);
          ctxB.lineTo(xf,y0);
          ctxB.lineTo(xf,ymid);
        } else if (rot==3) {
          ctxB.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI/2, 3*Math.PI/2);
          ctxB.lineTo(xf,y0);
          ctxB.lineTo(xf,yf);
          ctxB.lineTo(xmid,yf);
        }
        ctxB.closePath();
        ctxB.fillStyle = "#545454";
        ctxB.fill();
        
      } else if (tensors[i].type == 3) {// trap
        var rot = tensors[i].rot;
        var x0 = a2mX(tensors[i].bbox[0]);
        var y0 = a2mY(tensors[i].bbox[1]);
        var xf = a2mX(tensors[i].bbox[2]);
        var yf = a2mY(tensors[i].bbox[3]);
        var xmid = a2mX(tensors[i].bbox[4]);
        var ymid = a2mY(tensors[i].bbox[5]);
        var slope = tensors[i].slope;
        if (rot == 0 || rot == 2) {
          var halfwidth = (xmid-x0);
        } else {
          var halfwidth = (ymid-y0);
        }

        ctxB.beginPath();
        if (rot==0) {
          ctxB.moveTo(x0, yf);
          ctxB.lineTo(x0 + slope*halfwidth, y0);
          ctxB.lineTo(xf - slope*halfwidth, y0);
          ctxB.lineTo(xf, yf);
          ctxB.lineTo(x0, yf);
        } else if (rot==1) {
          ctxB.moveTo(x0, y0);
          ctxB.lineTo(xf, y0 + slope*halfwidth);
          ctxB.lineTo(xf, yf - slope*halfwidth);
          ctxB.lineTo(x0, yf);
          ctxB.lineTo(x0, y0);
        } else if (rot==2) {
          ctxB.moveTo(xf, y0);
          ctxB.lineTo(xf - slope*halfwidth, yf);
          ctxB.lineTo(x0 + slope*halfwidth, yf);
          ctxB.lineTo(x0, y0);
          ctxB.lineTo(xf, y0);
        } else if (rot==3) {
          ctxB.moveTo(xf, yf);
          ctxB.lineTo(x0, yf - slope*halfwidth);
          ctxB.lineTo(x0, y0 + slope*halfwidth);
          ctxB.lineTo(xf, y0);
          ctxB.lineTo(xf, yf);
        }
        ctxB.closePath();
        ctxB.fillStyle = "#545454";
        ctxB.fill();
      }
    } 
    // get rid excess from outside of borders
    ctxB.globalCompositeOperation = "destination-out";
    ctxB.fillRect(0, 0, mX, viewHeight);
    ctxB.fillRect(mX + miniWidth, 0, miniPadX, viewHeight);
    ctxB.fillRect(0, 0, viewWidth, mY);
    ctxB.fillRect(0, mY + miniHeight, viewWidth, viewHeight);
    ctxB.globalCompositeOperation = "source-over";
  }

  // draw map window
  ctxB.beginPath();
  ctxB.moveTo(wX0, wY0);
  ctxB.lineTo(wX1, wY0);
  ctxB.lineTo(wX1, wY1);
  ctxB.lineTo(wX0, wY1);
  ctxB.closePath();
  ctxB.strokeStyle = "red";
  ctxB.lineWidth = 1;
  ctxB.stroke();
}
