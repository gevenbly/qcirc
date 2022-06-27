/*
functions for drawing to canvas
*/

function drawTensors() {
 
  
  if (!canvasBasedNames) {
    // updateTensorTags();
    updateTextBoxTags();
  }
  // console.log(allTextBoxTags)
  
  // drawCircle(ctxT, a2rX(selectBox[4]),a2rY(selectBox[5]), circRad, circThick);
  
  
  ctxT.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  ctxH.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  ctxT.setLineDash([]);
  
  
  for (var i = 0; i < textBoxes.length; i++) {
    var currFill = leftColorTypes[textBoxes[i].color];
    var currFillDark = leftColorTypes[textBoxes[i].color + numColors];
    var currFillLight = leftColorTypes[textBoxes[i].color + 2*numColors];
    
    // draw the main shape
    var opac = 0.1;
    drawTextBox(i,ctxT,currFill,currFillDark,opac,currFillLight);
    if (currBoxSelected.indexOf(i) >= 0) {
      drawTextBoxHandles(i,ctxT);
    }
    if (objUnderMouse[1]==i) {
      drawTextBoxIcons(i,ctxT);
    }
  }
  
  var isOverObject = (objUnderMouse[0] === "tensor" || 
                      objUnderMouse[0] === "rename" || 
                      objUnderMouse[0] === "anchor" || 
                      objUnderMouse[0] === "handle");
  
  for (var j=0; j<3; j++) {
    if (stateOfMouse == "duplicating" || contextIsUp || stateOfMouse == "connecting") {
      // tensorIcons[j].setAttribute("display", "none");
      tensorIcons[j].style.visibility = 'hidden';
    } else {
      if (isOverObject) {
        // tensorIcons[j].setAttribute("display", "block");
        tensorIcons[j].style.visibility = 'visible';
      } else {
        // tensorIcons[j].setAttribute("display", "none");
        tensorIcons[j].style.visibility = 'hidden';
      }
    }
  }
  if (objUnderMouse[0] === "box" || objUnderMouse[0] === "boxrename") {
    tensorIcons[1].setAttribute("display", "block");
  }
  
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
    
    if ((stateOfMouse == "duplicating" || contextIsUp) && currSelected.indexOf(i)>=0) {
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
    if (isDup) {
      if (!canvasBasedNames) {
        allNameTags[i].style.display = "none";
      }
    } else {
      drawTensorName(i,ctxT);
      
      if (isOverCurrTensor)  {
        drawTensorIcons(i,ctxT);
      }
    }
  }
  
  // draw indices
  drawIndices() ;
  if (stateOfMouse == "connecting") {
    
    // var ind = currGrabbed[1];
    // var jnd = currGrabbed[2];
    // var xtemp = a2rX(tensors[ind].bbox[4] + tensors[ind].xanchors[jnd]);
    // var ytemp = a2rY(tensors[ind].bbox[5] + tensors[ind].yanchors[jnd]);
    
    // ctxT.lineCap = "butt";
    // ctxT.strokeStyle = indexConfigs[0].color;
    // ctxT.lineWidth = indexConfigs[0].weight;
    // var tempStyle = indexConfigs[0].style;
    // if (tempStyle == "Solid") {
    //   ctxT.setLineDash([]);
    // } else if (tempStyle == "Dash") {
    //   ctxT.setLineDash([20,5]);
    // } else if (tempStyle == "Dot") {
    //   ctxT.setLineDash([5,5]);
    // } else if (tempStyle == "DashDot") {
    //   ctxT.setLineDash([15, 3, 3, 3]);
    // }
    
    // ctxT.lineWidth = 2;
    // ctxT.strokeStyle = '#c4c4c4';
    // ctxT.beginPath();
    // ctxT.moveTo(xtemp, ytemp);
    // ctxT.lineTo(mousePos[0], mousePos[1]);
    // ctxT.stroke();
    
    // drawIndexHandles(0.5*(mousePos[0]+xtemp), 
    //                  0.5*(mousePos[1]+ytemp), 
    //                  mousePos[0]-xtemp, 
    //                  mousePos[1]-ytemp);
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

function drawTextBox(i,ctx,theFillColor,theOutlineColor,opac,theSelectColor) {
  // set path
  var x0 = roundHP(a2rX(textBoxes[i].bbox[0]));
  var y0 = roundHP(a2rY(textBoxes[i].bbox[1]));
  var width = Math.round(a2rX(textBoxes[i].bbox[2]) - a2rX(textBoxes[i].bbox[0]));
  var height = Math.round(a2rY(textBoxes[i].bbox[3]) - a2rY(textBoxes[i].bbox[1]));
  // roundRect(ctx, x0, y0, width, height, rectCornerRad);

  ctx.fillStyle = theFillColor;
  ctx.globalAlpha = opac;
  ctx.strokeStyle = theOutlineColor;
  ctx.lineWidth = 1;
  // ctx.fill();
  // ctx.stroke();
  ctx.fillRect(x0, y0, width, height);
  ctx.globalAlpha = 1.0;
  ctx.strokeRect(x0, y0, width, height);
  
  if (stateOfMouse=="boxrenaming" && currGrabbed[1]==i) {
    theSizingBox.innerText = "B" + i + ":" + theNamebox.value;
    var tagHeight = theSizingBox.offsetHeight;
    var tagWidth = theSizingBox.offsetWidth;
  } else {
    theSizingBox.innerText = "B" + i + ":" + textBoxes[i].name;
    var tagHeight = theSizingBox.offsetHeight;
    var tagWidth = theSizingBox.offsetWidth;
    // console.log(theSizingBox)
  }
  
  var cornerRad = 10
  ctx.beginPath();
  ctx.moveTo(x0, y0+tagHeight);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x0+tagWidth, y0);
  ctx.lineTo(x0+tagWidth, y0+tagHeight-cornerRad);
  ctx.quadraticCurveTo(x0+tagWidth, y0+tagHeight, x0+tagWidth-cornerRad, y0+tagHeight);
  ctx.closePath();
  if (objUnderMouse[0]=='box' && objUnderMouse[1]==i) {
    ctx.fillStyle = theSelectColor;
  } else {
    ctx.fillStyle = theFillColor;
  }
  ctx.globalAlpha = 1;
  ctx.fill();
  
  if (stateOfMouse=="boxrenaming" && currGrabbed[1]==i) {
    allTextBoxTags[i].style.display = 'none';
  } else {
    if (canvasBasedNames) {
      ctx.textBaseline = "top";
      ctx.font = "12px Verdana";
      ctx.textAlign = "left";
      ctx.fillStyle = "black";
      ctx.fillText("B" + i + ":" + textBoxes[i].name, roundHP(x0)+4, roundHP(y0)+5);
      if (i < allTextBoxTags.length) {
        allTextBoxTags[i].style.display = 'none';
      }
    } else {
      allTextBoxTags[i].style.left = Math.round(x0 + leftMenuWidth)+'px';
      allTextBoxTags[i].style.top = Math.round(y0 + topMenuHeight)+'px';
    }
  }
  
  
  // if (objUnderMouse[0]=='box' && objUnderMouse[1]==i) {
  //   textBoxes[i].tag.style.backgroundColor = theSelectColor;
  // } else {
  //   textBoxes[i].tag.style.backgroundColor = theFillColor;
  // }
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
    if (!(stateOfMouse == "renaming" && currGrabbed[1] == i)) {
      ctx.textBaseline = "middle";
      ctx.font = "12px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      if (tensors[i].conj) {
        ctx.fillText("T" + i + ":" + tensors[i].name + "*", Math.round(xmid), Math.round(ymid)); 
      } else {
        ctx.fillText("T" + i + ":" + tensors[i].name, Math.round(xmid), Math.round(ymid)); 
      }
    }
  } else {
    if (stateOfMouse == "renaming" && currGrabbed[1] == i) {
      allNameTags[i].style.display = "none";
    } else {
      var temptop = Math.round(ymid - allNameTags[i].offsetHeight/2 + topMenuHeight)+'px';
      if (allNameTags[i].style.top != temptop) {
        allNameTags[i].style.top = temptop;
      }
      var templeft = Math.round(xmid - allNameTags[i].offsetWidth/2 + leftMenuWidth)+'px';
      if (allNameTags[i].style.left != templeft) {
        allNameTags[i].style.left = templeft;
      }
    }
  }
}


function drawIndices() {
  if (stateOfMouse == "connecting") {
    var tempInd = Math.abs(tensors[currGrabbed[1]].connects[currGrabbed[2]]);
  } else {
    var tempInd = 0;
  }
  if (objUnderMouse[0] == "openind") {
    var tempOver = objUnderMouse[1];
    tensorIcons[4].style.visibility = 'visible';
    tensorIcons[3].style.visibility = 'visible';
  } else {
    var tempOver = -1;
    tensorIcons[4].style.visibility = 'hidden';
    tensorIcons[3].style.visibility = 'hidden';
  }
  if (objUnderMouse[0] == "indexhandle") {
    var tempIndHandle = objUnderMouse[1];
    tensorIcons[5].style.visibility = 'visible';
    tensorIcons[6].style.visibility = 'visible';
    tensorIcons[7].style.visibility = 'visible';
  } else {
    var tempIndHandle = -1;
    tensorIcons[5].style.visibility = 'hidden';
    tensorIcons[6].style.visibility = 'hidden';
    tensorIcons[7].style.visibility = 'hidden';
  }
 
  for (var ind = 1; ind < indices.length; ind++) { 
    var wasOpen = false;
    if (indices[ind].connects[0]<0 || indices[ind].connects[2]<0) { //open index
      var i0 = Math.max(indices[ind].connects[0], indices[ind].connects[2]);
      var j0 = Math.max(indices[ind].connects[1], indices[ind].connects[3]);
      var x0 = Math.round(a2rX(tensors[i0].bbox[4] + tensors[i0].xanchors[j0]));
      var y0 = Math.round(a2rY(tensors[i0].bbox[5] + tensors[i0].yanchors[j0]));
      var x1 = Math.round(a2rX(tensors[i0].bbox[4] + indices[ind].end[0]));
      var y1 = Math.round(a2rY(tensors[i0].bbox[5] + indices[ind].end[1]));
      wasOpen = true;
      
    } else { //closed index
      var i0 = indices[ind].connects[0];
      var j0 = indices[ind].connects[1];
      var i1 = indices[ind].connects[2];
      var j1 = indices[ind].connects[3];
      var x0 = Math.round(a2rX(tensors[i0].bbox[4] + tensors[i0].xanchors[j0]));
      var y0 = Math.round(a2rY(tensors[i0].bbox[5] + tensors[i0].yanchors[j0]));
      var x1 = Math.round(a2rX(tensors[i1].bbox[4] + tensors[i1].xanchors[j1]));
      var y1 = Math.round(a2rY(tensors[i1].bbox[5] + tensors[i1].yanchors[j1]));
    }

    // draw index
    ctxT.lineCap = "butt";
    ctxT.strokeStyle = indexConfigs[indices[ind].type].color;
    ctxT.lineWidth = indexConfigs[indices[ind].type].weight;
    var tempStyle = indexConfigs[indices[ind].type].style;
    if (tempStyle == "Solid") {
      ctxT.setLineDash([]);
    } else if (tempStyle == "Dash") {
      ctxT.setLineDash([6,3]);
    } else if (tempStyle == "Dot") {
      ctxT.setLineDash([3,3]);
    } else if (tempStyle == "DashDot") {
      ctxT.setLineDash([6, 3, 3, 3]);
    }
    
    ctxT.beginPath();
    ctxT.moveTo(x0, y0);
    ctxT.lineTo(x1, y1);
    ctxT.stroke();
    ctxT.setLineDash([]);
    
    if (wasOpen && (ind != tempInd)) {//draw endpoint
      var tempLab = indices[ind].label;
      ctxT.fillStyle = allAnchorColors[tempLab % (allAnchorColors.length)];      
      ctxT.beginPath();
      ctxT.arc(x1, y1, openIndexRadius, 0, 2 * Math.PI, false);
      ctxT.fill();
      ctxT.strokeStyle = 'black';
      ctxT.lineWidth = 1;
      
      if (ind == tempOver) {
        var xposL = x1 + openIconPos.x[0] - fieldIconWidth/2 + leftMenuWidth;
        var yposL = y1 + openIconPos.y[0] - fieldIconHeight/2 + topMenuHeight;
        var xposR = x1 + openIconPos.x[1] - fieldIconWidth/2 + leftMenuWidth;
        var yposR = y1 + openIconPos.y[1] - fieldIconHeight/2 + topMenuHeight;

        tensorIcons[4].style.left = xposL + 'px';
        tensorIcons[4].style.top = yposL + 'px';
        tensorIcons[3].style.left = xposR + 'px';
        tensorIcons[3].style.top = yposR + 'px';

        tensorIcons[3].setAttribute("stroke", "#a4a4a4");
        tensorIcons[4].setAttribute("stroke", "#a4a4a4");
        if (objUnderMouse[2] == 0) {// end anchor
          ctxT.strokeStyle = 'white';
        } else if (objUnderMouse[2] == 1) {// minus anchor
          tensorIcons[3].setAttribute("stroke", "white");  
        } else if (objUnderMouse[2] == 2) {// plus icon
          tensorIcons[4].setAttribute("stroke", "white");
        } 
      }
      ctxT.stroke();
          
      // draw index numbers
      if (numericalInds) {
        ctxT.textAlign = "center";
        ctxT.fillStyle = "black";
        ctxT.textBaseline = "middle";
        if ((tempLab+isOneBased)<10) {
          ctxT.font = "bold 10px Verdana";
          ctxT.fillText(tempLab+isOneBased, x1, y1);
        } else {
          ctxT.font = "bold 8px Verdana";
          ctxT.fillText(tempLab+isOneBased, x1, y1);
        }
      }
    }
    
    // draw index handles
    if (indices[ind].curved) {
      
    } else { // index is straight
      // var xc = a2rX(indices[ind].center[0]);
      // var yc = a2rY(indices[ind].center[1]);
      var xc = 0.5*(x1+x0);
      var yc = 0.5*(y1+y0);
      if (tensors[i0].connects[j0] < 0) {
        drawIndexHandles(ind, xc, yc, x1-x0, y1-y0);
      } else {
        drawIndexHandles(ind, xc, yc, x0-x1, y0-y1);
      }
    }
    
    if (ind == tempIndHandle) {
      for (var kic=0; kic<indexIconPos.x.length; kic++) {
        var xpos = xc + indexIconPos.x[kic] - fieldIconWidth/2 + leftMenuWidth;
        var ypos = yc + indexIconPos.y[kic] - fieldIconHeight/2 + topMenuHeight;
        tensorIcons[kic+5].style.left = xpos + 'px';
        tensorIcons[kic+5].style.top = ypos + 'px';
        if ((objUnderMouse[2]-1) == kic) {
          tensorIcons[kic+5].setAttribute("stroke", "white");
        } else {
          tensorIcons[kic+5].setAttribute("stroke", "#a4a4a4");
        }
      }
    }

    // tensorIcons[3].setAttribute("stroke", "#c4c4c4");
    // tensorIcons[4].setAttribute("stroke", "#c4c4c4");
    // if (objUnderMouse[2] == 0) {// end anchor
    //   ctxT.strokeStyle = 'white';
    // } else if (objUnderMouse[2] == 1) {// minus anchor
    //   tensorIcons[3].setAttribute("stroke", "white");  
    // } else if (objUnderMouse[2] == 2) {// plus icon
    //   tensorIcons[4].setAttribute("stroke", "white");
    // } 
  }
}

function drawIndexHandles(ind, xc, yc, dx, dy) {
  if ((dx*dx + dy*dy)/windowPos.zoom >= 100) {
    if (Math.abs(dx) < 1e-5 && Math.abs(dy) < 1e-5) {
      dx += 1e-5;
      dy += 1e-5;
    };
    
    var cn = Math.sqrt(dx*dx + dy*dy);
    var tempRot = Math.atan2(dx, dy);
    
    // if ((objUnderMouse[0] == "indexhandle") && (objUnderMouse[1] == ind)) {
    //   indHandleRad *= 1.5;
    // }
    
    if (showIndNames) {
      var tempRad = indHandleRad;
    } else {
      var tempRad = 0.5*indHandleRad;
    }
     
    ctxT.beginPath();
    ctxT.fillStyle = indexConfigs[indices[ind].type].color;
    ctxT.ellipse(xc-tempRad*dx/cn, yc-tempRad*dy/cn, tempRad, 2*tempRad, -tempRot+Math.PI, Math.PI, 2*Math.PI)
    ctxT.closePath();
    ctxT.fill();
    
    if ((objUnderMouse[0] == "indexhandle") && (objUnderMouse[1] == ind)) {
      ctxT.strokeStyle = "white";
      ctxT.stroke();
    }
    
    if (showIndNames) {
      ctxT.fillStyle = "black";
      ctxT.font = "bold 11px Verdana";
      ctxT.textBaseline = "middle";
      ctxT.textAlign = "center";
      
      var tempName = indexConfigs[indices[ind].type].codeName;
      if ((tempName.charAt(0) == '&') && (tempName.charAt(1) == '#')) {
        // interpret unicode name
        var tempSym = tempName.slice(3);
        ctxT.fillText(String.fromCharCode(parseInt(tempSym, 16)), xc, yc);
      } else {
        // print alphanumeric name
        ctxT.fillText(tempName, xc, yc);
      } 
    }
  }
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
    var xd = Math.round(tensors[i].xanchors[j] * windowPos.zoom + xmid);
    var yd = Math.round(tensors[i].yanchors[j] * windowPos.zoom + ymid);
    roundRect(ctx, xd - anchorWidth/2, yd - anchorHeight/2,
              anchorWidth, anchorHeight, anchorRoundness);
    ctx.fill();
    ctx.stroke()
    
    if (numericalInds) {
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.textBaseline = "middle";
      if ((j+isOneBased) < 10) {
        ctx.font = "bold 10px Verdana";
        ctx.fillText(j+isOneBased, xd, yd);
      } else {
        ctx.font = "bold 8px Verdana";
        ctx.fillText(j+isOneBased, xd, yd);
      }
    }
  }
}

function drawTextBoxIcons(i,ctx) {
  
  var xmid = Math.round(a2rX(textBoxes[i].bbox[0]));
  var ymid = Math.round(a2rY(textBoxes[i].bbox[1]));
  tensorIcons[1].style.left = xmid + leftMenuWidth + theSizingBox.offsetWidth + 'px';
  tensorIcons[1].style.top = ymid + topMenuHeight + theSizingBox.offsetHeight/2  + 'px';
  
  if ((objUnderMouse[0] == "boxrename" || objUnderMouse[0] == "box") && objUnderMouse[1] == i) {
    if (objUnderMouse[0] == "boxrename" && objUnderMouse[1] == i) {
      tensorIcons[1].setAttribute("stroke", "white");
    } else {
      tensorIcons[1].setAttribute("stroke", "#a4a4a4");
    }      
  }
}

function drawTensorIcons(i,ctx) {
  for (var j=0; j<iconPos.x.length; j++) {
    var xmid = Math.round(a2rX(tensors[i].bbox[4]));
    var ymid = Math.round(a2rY(tensors[i].bbox[5]));
    var xpos = xmid + iconPos.x[j] - fieldIconWidth/2 + leftMenuWidth;
    var ypos = ymid + iconPos.y[j] - fieldIconHeight/2 + topMenuHeight;
    tensorIcons[j].style.left = xpos+'px';
    tensorIcons[j].style.top = ypos+'px';
    
    if (objUnderMouse[0] == "rename" && objUnderMouse[1] == i && objUnderMouse[2] == j) {
      tensorIcons[j].setAttribute("stroke", "white");
    } else {
      tensorIcons[j].setAttribute("stroke", "#a4a4a4");
    }
  }
}

function drawTextBoxHandles(i,ctx) {
  ctx.lineWidth = 1;
  ctx.fillStyle = "#eee";
  ctx.strokeStyle = "#eee";
  
  var x0 = roundHP(a2rX(textBoxes[i].bbox[0]));
  var y0 = roundHP(a2rY(textBoxes[i].bbox[1]));
  var xf = roundHP(a2rX(textBoxes[i].bbox[2]));
  var yf = roundHP(a2rY(textBoxes[i].bbox[3]));
  var xmid = 0.5*(x0 + xf);
  var ymid = 0.5*(y0 + yf);
  var handleLocsX = [x0, xmid, xf, xf, xf, xmid, x0, x0,
                     x0, xmid, xf, xf, xf, xmid, x0, x0];
  var handleLocsY = [y0, y0, y0, ymid, yf, yf, yf, ymid,
                     y0, y0, y0, ymid, yf, yf, yf, ymid];

  for (var j=0; j<8; j++) {
    ctx.beginPath();
    ctx.arc(handleLocsX[j], handleLocsY[j], circRad, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.rect(x0, y0, xf-x0, yf-y0);
  ctx.stroke();
}

function drawTensorHandles(i,ctx) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#eee";
  ctx.fillStyle = "#eee";
  
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
      ctx.beginPath();
      ctx.arc(handleLocsX[j+2*rot], handleLocsY[j+2*rot], circRad, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(x0, y0, xf-x0, yf-y0);
    ctx.stroke();
  }
}

function drawCircle(context, cX, cY, radius, ) {
  context.beginPath();
  context.arc(cX, cY, radius, 0, 2 * Math.PI, false);
  context.fill();
  // context.lineWidth = thick;
  // context.strokeStyle = "#003300";
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
  ctxM.clearRect(0, 0, canvasTensors.width, canvasTensors.height);

  ctxM.fillStyle = "black";
  ctxM.fillRect(10, 10, boxWidth, boxHeight);
  ctxM.fillStyle = "red";
  ctxM.font = "20px Verdana";
  ctxM.textAlign = "left";
  for (var i = 0; i < debugStrings.length; i++) {
    ctxM.fillText(debugStrings[i], 10, 40 + 30 * i);
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
    
    for (var i = 0; i < textBoxes.length; i++) {
      var x0 = roundHP(a2mX(textBoxes[i].bbox[0]));
      var y0 = roundHP(a2mY(textBoxes[i].bbox[1]));
      var width = Math.round(a2mX(textBoxes[i].bbox[2]) - a2mX(textBoxes[i].bbox[0]));
      var height = Math.round(a2mY(textBoxes[i].bbox[3]) - a2mY(textBoxes[i].bbox[1]));
      
      ctxB.fillStyle = "#545454";
      ctxB.strokeStyle = "#545454";
      ctxB.globalAlpha = 0.2;
      // ctxB.strokeStyle = theOutlineColor;
      ctxB.lineWidth = 1;
      // ctx.fill();
      // ctx.stroke();
      ctxB.fillRect(x0, y0, width, height);
      ctxB.globalAlpha = 1.0;
      ctxB.strokeRect(x0, y0, width, height);
    }
    // roundRect(ctx, x0, y0, width, height, rectCornerRad);
    
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
