

function transHorzFlip() {
  var numSelected = currSelected.length;
  for (var i=0; i<numSelected; i++) {
    transHorzSingle(currSelected[i])
  }
  if (numSelected > 1) {
    for (var i=0; i<numSelected; i++) {
      var ind = currSelected[i];
      var halfheight = tensors[ind].bbox[3] - tensors[ind].bbox[5];
      tensors[ind].bbox[5] = -tensors[ind].bbox[5] + 2*selectBox[5];
      tensors[ind].bbox[3] = tensors[ind].bbox[5] + halfheight;
      tensors[ind].bbox[1] = tensors[ind].bbox[5] - halfheight;
    }
  }
  updateSelectionBox();
  drawMinimap();
  drawTensors();
}

function transVertFlip() {
  var numSelected = currSelected.length;
  for (var i=0; i<numSelected; i++) {
    transVertSingle(currSelected[i]);
  }
  if (numSelected > 1) {
    for (var i=0; i<numSelected; i++) {
      var ind = currSelected[i];
      var halfwidth = tensors[ind].bbox[2] - tensors[ind].bbox[4];
      tensors[ind].bbox[4] = -tensors[ind].bbox[4] + 2*selectBox[4];
      tensors[ind].bbox[2] = tensors[ind].bbox[4] + halfwidth;
      tensors[ind].bbox[0] = tensors[ind].bbox[4] - halfwidth;
    }
  }
  updateSelectionBox();
  drawMinimap();
  drawTensors();
}

function transHorzSingle(ind) {
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    tensors[ind].yanchors[j] = -tensors[ind].yanchors[j];
  }
  var rot = tensors[ind].rot;
  if (rot == 0) {
    tensors[ind].rot = 2;
  } else if (rot == 2) {
    tensors[ind].rot = 0;
  } 
  currGrabbed[2] = (10 - currGrabbed[2]) % 8;
  for (var j=0; j<tensors[ind].connects.length; j++) {
    var indLab = Math.abs(tensors[ind].connects[j]);
    if (openIndices.indexOf(indLab) >= 0) {//index is open
      indices[indLab].end[1] = -indices[indLab].end[1];
    }
  }
}

function transVertSingle(ind) {
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    tensors[ind].xanchors[j] = -tensors[ind].xanchors[j];
  }
  var rot = tensors[ind].rot;
  if (rot == 1) {
    tensors[ind].rot = 3;
  } else if (rot == 3) {
    tensors[ind].rot = 1;
  } 
  currGrabbed[2] = (10 - currGrabbed[2]) % 8;
  for (var j=0; j<tensors[ind].connects.length; j++) {
    var indLab = Math.abs(tensors[ind].connects[j]);
    if (openIndices.indexOf(indLab) >= 0) {//index is open
      indices[indLab].end[0] = -indices[indLab].end[0];
    }
  } 
}

function transClock() {
  var numSelected = currSelected.length;
  for (var i=0; i<numSelected; i++) {
    transClockSingle(currSelected[i]);
  }
  if (numSelected > 1) {
    for (var i=0; i<numSelected; i++) {
      var ind = currSelected[i];
      var x0 = tensors[ind].bbox[4] - selectBox[4];
      var y0 = tensors[ind].bbox[5] - selectBox[5];
      var xdiff = -y0 - x0;
      var ydiff = x0 - y0;
      
      tensors[ind].bbox[0] += xdiff;
      tensors[ind].bbox[2] += xdiff;
      tensors[ind].bbox[4] += xdiff;
      tensors[ind].bbox[1] += ydiff;
      tensors[ind].bbox[3] += ydiff;
      tensors[ind].bbox[5] += ydiff;
    }
  }
  updateSelectionBox();
  drawMinimap();
  drawTensors();
}

function transAnti() {
  for (var i=0; i<currSelected.length; i++) {
    transAntiSingle(currSelected[i])
  }
  var numSelected = currSelected.length;
  if (numSelected > 1) {
    for (var i=0; i<numSelected; i++) {
      var ind = currSelected[i];
      var x0 = tensors[ind].bbox[4] - selectBox[4];
      var y0 = tensors[ind].bbox[5] - selectBox[5];
      var xdiff = y0 - x0;
      var ydiff = -x0 - y0;
      
      tensors[ind].bbox[0] += xdiff;
      tensors[ind].bbox[2] += xdiff;
      tensors[ind].bbox[4] += xdiff;
      tensors[ind].bbox[1] += ydiff;
      tensors[ind].bbox[3] += ydiff;
      tensors[ind].bbox[5] += ydiff;
    }
  }
  updateSelectionBox();
  drawMinimap();
  drawTensors();
}

function transClockSingle(ind) {
  var xtemp = [];
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    xtemp.push(-tensors[ind].yanchors[j]);
  }
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    tensors[ind].yanchors[j] = (tensors[ind].xanchors[j]);
  }
  tensors[ind].xanchors = xtemp;

  var xmid = tensors[ind].bbox[4]
  var ymid = tensors[ind].bbox[5]
  var w = tensors[ind].bbox[2] - tensors[ind].bbox[0];
  var h = tensors[ind].bbox[3] - tensors[ind].bbox[1];

  tensors[ind].bbox[0] = xmid - h/2;
  tensors[ind].bbox[1] = ymid - w/2;
  tensors[ind].bbox[2] = xmid + h/2;
  tensors[ind].bbox[3] = ymid + w/2;

  if (tensors[ind].type==2 || tensors[ind].type==3) {
    tensors[ind].rot += 1;
    if (tensors[ind].rot == 4) {
      tensors[ind].rot = 0;
    }
  }

  for (var j=0; j<tensors[ind].connects.length; j++) {
    var indLab = Math.abs(tensors[ind].connects[j]);
    if (openIndices.indexOf(indLab) >= 0) {//index is open
      var xtemp = indices[indLab].end[0];
      indices[indLab].end[0] = -indices[indLab].end[1];
      indices[indLab].end[1] = xtemp;
    }
  } 

}

function transAntiSingle(ind) {
  var xtemp = [];
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    xtemp.push(tensors[ind].yanchors[j]);
  }
  for (var j=0; j<tensors[ind].xanchors.length; j++) {
    tensors[ind].yanchors[j] = (-tensors[ind].xanchors[j]);
  }
  tensors[ind].xanchors = xtemp;

  var xmid = tensors[ind].bbox[4]
  var ymid = tensors[ind].bbox[5]
  var w = tensors[ind].bbox[2] - tensors[ind].bbox[0];
  var h = tensors[ind].bbox[3] - tensors[ind].bbox[1];

  tensors[ind].bbox[0] = xmid - h/2;
  tensors[ind].bbox[1] = ymid - w/2;
  tensors[ind].bbox[2] = xmid + h/2;
  tensors[ind].bbox[3] = ymid + w/2;

  if (tensors[ind].type==2 || tensors[ind].type==3) {
    tensors[ind].rot -= 1;
    if (tensors[ind].rot < 0) {
      tensors[ind].rot = 3;
    }
  }

  for (var j=0; j<tensors[ind].connects.length; j++) {
    var indLab = Math.abs(tensors[ind].connects[j]);
    if (openIndices.indexOf(indLab) >= 0) {//index is open
      var xtemp = indices[indLab].end[0];
      indices[indLab].end[0] = indices[indLab].end[1];
      indices[indLab].end[1] = -xtemp;
    }
  } 
}