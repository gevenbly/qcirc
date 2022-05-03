/*
functions for drawing to canvas
*/

function drawGrid() {
  ctxG.clearRect(0, 0, viewWidth, viewHeight);
  ctxG.fillStyle = "#202020";
  ctxG.fillRect(0, 0, viewWidth, viewHeight);
  
  if (gridOn) {
    ctxG.lineWidth = 1;
    ctxG.strokeStyle = "#2b3c3d";
      // "#293e40";
    // "#202d2e";
    ctxG.setLineDash([2, 2]);

    const numLinesWidth = Math.floor(spaceWidth / gridSpaceX); 
    for (var i=0; i<numLinesWidth; i++) {
      var xloc = (i+1) * gridSpaceX;
      if (xloc > windowX0 && xloc < (windowX0 + windowWidth)) {
        var xrel = roundHP(a2rX(xloc));
        ctxG.beginPath();      
        ctxG.moveTo(xrel, 0);    
        ctxG.lineTo(xrel, canvasBackground.height);  
        ctxG.stroke();       
      }
    }

    const numLinesHeight = Math.floor(spaceHeight / gridSpaceY);
    for (var i=0; i<numLinesHeight; i++) {
      var yloc = (i+1) * gridSpaceY;
      if (yloc > windowY0 && yloc < (windowY0 + windowHeight)) {
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
    var mX = roundHP(viewWidth - (miniPad + miniWidth));
    var mY = roundHP(miniPad);

    // draw map box
    ctxB.fillStyle = "#b5b5b5";
    ctxB.fillRect(mX, mY, miniWidth, miniHeight);

    var wX0 = roundHP(miniWidth * (windowX0 / spaceWidth) + mX);
    var wX1 = roundHP(miniWidth * ((windowX0 + windowWidth) / spaceWidth) + mX);
    var wY0 = roundHP(miniHeight * (windowY0 / spaceHeight) + mY);
    var wY1 = roundHP(miniHeight * ((windowY0 + windowHeight) / spaceHeight) + mY);

    // draw map tensors
    for (var i = 0; i < tensor_xcoords.length; i++) {
      var xc = makeAllInRange(allRound(a2mXall(tensor_xcoords[i])), mX, mX + miniWidth);
      var yc = makeAllInRange(allRound(a2mYall(tensor_ycoords[i])), mY, mY + miniHeight);

      ctxB.fillStyle = "#545454";
      ctxB.beginPath()
      ctxB.moveTo(xc[0], yc[0])
      ctxB.lineTo(xc[1], yc[1])
      ctxB.lineTo(xc[2], yc[2])
      ctxB.lineTo(xc[3], yc[3])
      ctxB.closePath()
      ctxB.fill();
    }
  }
  
  // draw map window
  ctxB.beginPath();
  ctxB.moveTo(wX0, wY0);
  ctxB.lineTo(wX1, wY0);
  ctxB.lineTo(wX1, wY1);
  ctxB.lineTo(wX0, wY1);
  ctxB.closePath();
  ctxB.strokeStyle = 'red';
  ctxB.lineWidth = 1;
  ctxB.stroke();
}

function drawTensors() {
  ctxT.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  for (var i = 0; i < tensor_xcoords.length; i++) {
   
    // set path
    var x0 = roundHP(a2rX(tensor_bbox[i][0]));
    var y0 = roundHP(a2rY(tensor_bbox[i][1]));
    var width = Math.round(a2rX(tensor_bbox[i][2]) - a2rX(tensor_bbox[i][0]));
    var height = Math.round(a2rY(tensor_bbox[i][3]) - a2rY(tensor_bbox[i][1]));
    roundRect(ctxT, x0, y0, width, height, rectCornerRad);
    
    // fill
    if (currSelected.includes(i)) {
      // console.log('#008f94')
      // var theFillColor = lightenColor('#008f94',10);
      if (objUnderMouse[0] === "tensor" && i == objUnderMouse[1]) {
        var theFillColor = lightenColor('#008f94',10);
      } else {
        var theFillColor = '#008f94';
      }
      // console.log(lightenColor('#008f94',-100))
    } else {
      if (objUnderMouse[0] === "tensor" && i == objUnderMouse[1]) {
        // var theFillColor = '#008f94';
        var theFillColor = lightenColor('#008f94',10);
      } else {
        var theFillColor = '#008f94';
      }
    }
    var grd = ctxT.createLinearGradient(x0, y0, x0+2*width, y0+2*height);
    grd.addColorStop(0, theFillColor);
    grd.addColorStop(1, "white");
    ctxT.fillStyle = grd;
    ctxT.globalAlpha = 0.8;
    ctxT.fill();
    ctxT.globalAlpha = 1.0;
    
    // outline
    ctxT.strokeStyle = rectBorderCol;
    ctxT.lineWidth = rectBorderWidth;
    ctxT.stroke();
    
    // write tensor name
    var xmid = Math.round(a2rX(tensor_bbox[i][4]));
    var ymid = Math.round(a2rY(tensor_bbox[i][5]));
    // var xmid = roundHP(a2rX(tensor_bbox[i][4]));
    // var ymid = roundHP(a2rY(tensor_bbox[i][5]));
    
    if ((stateOfMouse == "renaming") && (currGrabbed[1] == i)) {
      // don't write the name
    } else { 
      ctxT.font = "16px Verdana";
      // ctxT.font = "16px Portico";
      ctxT.textAlign = 'center';
      ctxT.fillStyle = "black";

      // outline txt
      // ctxT.strokeStyle = 'black';
      // ctxT.miterLimit = 2;
      // ctxT.lineJoin = 'circle';
      // ctxT.lineWidth = 4;
      // ctxT.strokeText("T" + i, xmid, ymid+7);
      // ctxT.lineWidth = 1;
      // ctxT.fillText("T" + i, xmid, ymid+7);

      var useNameShadow = false;
      if (useNameShadow) {
        ctxT.shadowColor = "rgba(0,0,0,0)";
        ctxT.shadowBlur = 3;
        ctxT.shadowOffsetX = 3;
        ctxT.shadowOffsetY = 3;
      }
      ctxT.fillText("T" + i + ':' + tensor_names[i], xmid, ymid+7);
      ctxT.shadowColor = "rgba(0,0,0,0)";
    }
    
    // draw renaming icon
    if (currSelected.includes(i)) {
      if ((objUnderMouse[0] == "rename") && (objUnderMouse[1] == i)) {
        ctxT.drawImage(renameIconH, Math.round(xmid-renameIcon.width/2), Math.round(ymid+renameIcon.height/2));
      } else {
        ctxT.drawImage(renameIcon, Math.round(xmid-renameIcon.width/2), Math.round(ymid+renameIcon.height/2));
      }
    }
   
    // draw handles
    if (currSelected.includes(i)) {
      ctxT.lineWidth = 1;
      ctxT.fillStyle = '#909090';
      ctxT.strokeStyle = "#505050";
      var xc = allRound(a2rXall(tensor_xcoords[i]));
      var yc = allRound(a2rYall(tensor_ycoords[i]));
      for (var j=0; j<xc.length; j++) {
        drawCircle(ctxT, xc[j], yc[j], circRad, circThick); 
      }
    }
  }
}

function drawCircle(context, cX, cY, radius, thick) {
  context.beginPath();
  context.arc(cX, cY, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.lineWidth = thick;
  context.strokeStyle = '#003300';
  context.stroke();
}

function drawDebugBox(debugStrings) {
  const boxHeight = 20 + debugStrings.length * 30;
  const boxWidth = 300;

  ctxB.fillStyle = "black";
  ctxB.fillRect(10, 10, boxWidth, boxHeight);
  ctxB.fillStyle = "red";
  ctxB.font = "20px Arial";
  ctxB.textAlign = 'left';
  for (var i = 0; i < debugStrings.length; i++) {
    ctxB.fillText(debugStrings[i], 10, 40 + 30 * i);
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'undefined') {
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


