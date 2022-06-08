// functions for creation / manipulation of tensors

function createTensor(x0, y0) {
  // called once when first creating tensor 
  var tempSlope = 0;
  if (leftSelectedType-2 == 3) {
    tempSlope = trapSlope;
  }
  var x0r = Math.round(x0);
  var y0r = Math.round(y0);
  tensors.push({
    type: leftSelectedType-2,
    bbox: [x0r, y0r, x0r, y0r, x0r, y0r],
    name: "",
    color: leftColorSelected,
    rot: 0,
    slope: tempSlope,
    xanchors: new Array(numAnchorsCreated).fill(0),
    yanchors: new Array(numAnchorsCreated).fill(0),
    connects: new Array(numAnchorsCreated).fill(0)
  })
  if (!canvasBasedNames) {
    createTensorTag();
  }
}

function createTensorTag() {
  if (allNameTags.length < tensors.length) {
    var ind = allNameTags.length;
    var tempDiv = document.createElement("div");
    tempDiv.setAttribute("id", "nametag"+ind);
    tempDiv.setAttribute("class", "nametag");
    tempDiv.setAttribute("style", "display: block;");
    var tempNode = document.createTextNode("T"+ind+":");
    tempDiv.appendChild(tempNode);
    document.getElementById("canvasWindow").appendChild(tempDiv);
    allNameTags.push(document.getElementById("nametag"+ind));
  }
}

function updateTensorTags() {
  while (allNameTags.length < tensors.length) {
    createTensorTag() 
  };
  for (var ind=0; ind<allNameTags.length; ind++) {
    if (ind < tensors.length) {
      allNameTags[ind].style.display = "block";
      allNameTags[ind].innerHTML = "T" + ind + ":" + tensors[ind].name;
    } else {
      allNameTags[ind].style.display = "none";
    }
  }
}

function createXAnchors(anchorLocRadius) {
  var temp_xanchors = [];
  var dtheta = 2*Math.PI / (7.3);
  for (var i=0; i<numAnchorsCreated; i++) {
    temp_xanchors.push(Math.round(-anchorLocRadius * Math.cos((i+1)*dtheta)));
  }
  return temp_xanchors
}

function createYAnchors(anchorLocRadius) {
  var temp_yanchors = [];
  var dtheta = 2*Math.PI / (7.3);
  for (var i=0; i<numAnchorsCreated; i++) {
    temp_yanchors.push(Math.round(-anchorLocRadius * Math.sin((i+1)*dtheta)));
  }
  return temp_yanchors
}

function updateTensor(ind, subind, xfix, yfix, xnew, ynew) {
  // called when creating tensors 
  if (gridSnap) {
    xnew = snapX(xnew);
    ynew = snapY(ynew);
  }
  var slope = tensors[ind].slope;
  var xmin = Math.min(xnew, xfix);
  var xmax = Math.max(xnew, xfix);
  var ymin = Math.min(ynew, yfix);
  var ymax = Math.max(ynew, yfix);
  tensors[ind].bbox = [xmin, ymin, xmax, ymax, (xmin+xmax)/2, (ymin+ymax)/2];
  tensors[ind].xanchors = (createXAnchors((1-slope)*0.4*Math.abs(xmax - xmin)));
  tensors[ind].yanchors = (createYAnchors(0.4*Math.abs(ymax - ymin)));
}

function resizeTensor(ind, subind, xfix, yfix, xnew, ynew) {
  // called when resizing tensors 
  
  var num_tensors = tensors.length;
  if (gridSnap) {
    xnew = snapX(xnew);
    ynew = snapY(ynew);
  }
  var rot = tensors[ind].rot;
  var slope = tensors[ind].slope;

  if ((subind % 2) == 0) {// corner resize
    var xmin = Math.min(xnew, xfix);
    var xmax = Math.max(xnew, xfix);
    var ymin = Math.min(ynew, yfix);
    var ymax = Math.max(ynew, yfix);
    var xmid = (xmin + xmax) / 2;
    var ymid = (ymin + ymax) / 2;
    
    var ratioxtemp = Math.max((xmax - xmin), 0.0001) / Math.max(tensors[ind].bbox[2] - tensors[ind].bbox[0], 0.0001);
    var ratioytemp = Math.max((ymax - ymin), 0.0001) / Math.max(tensors[ind].bbox[3] - tensors[ind].bbox[1], 0.0001);
    tensors[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];

    for (var j=0; j<tensors[ind].xanchors.length; j++) {
      tensors[ind].xanchors[j] *= ratioxtemp;
      tensors[ind].yanchors[j] *= ratioytemp;
    }
    for (var j=0; j<tensors[ind].connects.length; j++) {
      var indLab = Math.abs(tensors[ind].connects[j]);
      if (openIndices.indexOf(indLab) >= 0) {//index is open
        indices[indLab].end[0] *= ratioxtemp;
        indices[indLab].end[1] *= ratioytemp;
      }
    } 
    
  } else if ((subind % 2) == 1) {// side resize
    if (((((subind - 1) / 2) + rot) % 2) != 0) {// y-resize
      var xmin = Math.min(xnew, xfix);
      var xmax = Math.max(xnew, xfix);
      var ymin = tensors[ind].bbox[1];
      var ymax = tensors[ind].bbox[3];
      var xmid = (xmin + xmax) / 2;
      var ymid = (ymin + ymax) / 2;
      
      var ratioxtemp = Math.max((xmax - xmin), 0.0001) / Math.max(tensors[ind].bbox[2] - tensors[ind].bbox[0], 0.0001);
      tensors[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];

      for (var j=0; j<tensors[ind].xanchors.length; j++) {
        tensors[ind].xanchors[j] *= ratioxtemp;
      }
      for (var j=0; j<tensors[ind].connects.length; j++) {
        var indLab = Math.abs(tensors[ind].connects[j]);
        if (openIndices.indexOf(indLab) >= 0) {//index is open
          indices[indLab].end[0] *= ratioxtemp;
        }
      }
      
    } else {// x-resize
      var xmin = tensors[ind].bbox[0];
      var xmax = tensors[ind].bbox[2];
      var ymin = Math.min(ynew, yfix);
      var ymax = Math.max(ynew, yfix);
      var xmid = (xmin + xmax) / 2;
      var ymid = (ymin + ymax) / 2;
      
      var ratioytemp = Math.max((ymax - ymin), 0.0001) / Math.max(tensors[ind].bbox[3] - tensors[ind].bbox[1], 0.0001);
      tensors[ind].bbox = [xmin, ymin, xmax, ymax, xmid, ymid];

      for (var j=0; j<tensors[ind].xanchors.length; j++) {
        tensors[ind].yanchors[j] *= ratioytemp;
      }
      for (var j=0; j<tensors[ind].connects.length; j++) {
        var indLab = Math.abs(tensors[ind].connects[j]);
        if (openIndices.indexOf(indLab) >= 0) {//index is open
          indices[indLab].end[1] *= ratioytemp;
        }
      }
    }
  }
  
  // H-flip 
  var rot = tensors[ind].rot;
  var subind = currGrabbed[2];
  var subtemp = ((subind + 2*rot) % 8);
  if (subtemp == 0 || subtemp == 1 || subtemp == 2) {//grabbed the top
    if (ynew > yfix) {
      transHorzSingle(ind);
    }
  } else if (subtemp == 4 || subtemp == 5 || subtemp == 6) {//grabbed the bottom
    if (ynew < yfix) {
      transHorzSingle(ind);
    }
  }
  
  // Vflip
  var rot = tensors[ind].rot;
  var subind = currGrabbed[2];
  var subtemp = ((subind + 2*rot) % 8);
  if (subtemp == 2 || subtemp == 3 || subtemp == 4) {//grabbed the right
    if (xnew < xfix) {
      transVertSingle(ind);
    }
  } else if (subtemp == 6 || subtemp == 7 || subtemp == 0) {//grabbed the left
    if (xnew > xfix) {
      transVertSingle(ind);
    }
  }
}

function updatePosCenter(xpos, ypos) {
  var xc_new = xpos - coordGrabbed[0];
  var yc_new = ypos - coordGrabbed[1];

  var ind = currGrabbed[1];
  var xdiff = xc_new - tensors[ind].bbox[4];
  var ydiff = yc_new - tensors[ind].bbox[5];
  if (gridSnap) {
    xdiff = snapX(xdiff);
    ydiff = snapY(ydiff);
  }
 
  for (var i=0; i<currSelected.length; i++) {
    var ind = currSelected[i];
    tensors[ind].bbox = addVector(tensors[ind].bbox, [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
  }
  for (var i=0; i<currBoxSelected.length; i++) {
    var ind = currBoxSelected[i];
    textBoxes[ind].bbox = addVector(textBoxes[ind].bbox, [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
  }
}

function checkInTensor(pos, ind, isRel=false) {
  var x0 = tensors[ind].bbox[0];
  var y0 = tensors[ind].bbox[1];
  var xf = tensors[ind].bbox[2];
  var yf = tensors[ind].bbox[3];
  var type = tensors[ind].type;
  
  if (type == 0) { //rectangle
    ctxT.beginPath();
    ctxT.moveTo(x0, y0);
    ctxT.lineTo(xf, y0);
    ctxT.lineTo(xf, yf);
    ctxT.lineTo(x0, yf);
    ctxT.closePath();
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
    
  } else if (type == 1) {//ellipse
    ctxT.beginPath();
    ctxT.ellipse((xf+x0)/2, (yf+y0)/2, (xf-x0)/2, (yf-y0)/2, 0, 0, 2 * Math.PI);
    ctxT.closePath();
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
    
  } else if (type == 2) {//dome
    var rot = tensors[ind].rot;
    var xmid = (x0 + xf) / 2;
    var ymid = (y0 + yf) / 2;
    
    ctxT.beginPath();
    if (rot==0) {
      ctxT.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI, 0);
      ctxT.lineTo(xf,yf);
      ctxT.lineTo(x0,yf);
      ctxT.lineTo(x0,ymid);
    } else if (rot==1) {
      ctxT.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 3*Math.PI/2, Math.PI/2);
      ctxT.lineTo(x0,yf);
      ctxT.lineTo(x0,y0);
      ctxT.lineTo(xmid,y0);
    } else if (rot==2) {
      ctxT.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, 0, Math.PI);
      ctxT.lineTo(x0,y0);
      ctxT.lineTo(xf,y0);
      ctxT.lineTo(xf,ymid);
    } else if (rot==3) {
      ctxT.ellipse(xmid, ymid, (xf - x0) / 2, (yf - y0) / 2, 0, Math.PI/2, 3*Math.PI/2);
      ctxT.lineTo(xf,y0);
      ctxT.lineTo(xf,yf);
      ctxT.lineTo(xmid,yf);
    }
    ctxT.closePath();
    
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
    
  } else if (type == 3) {//trap
    var rot = tensors[ind].rot;
    var slope = tensors[ind].slope;
    var xmid = (x0 + xf) / 2;
    var ymid = (y0 + yf) / 2;
    if (rot == 0 || rot == 2) {
      var halfwidth = (xmid-x0);
    } else {
      var halfwidth = (ymid-y0);
    }
    
    ctxT.beginPath();
    if (rot==0) {
      ctxT.moveTo(x0, yf);
      ctxT.lineTo(x0 + slope*halfwidth, y0);
      ctxT.lineTo(xf - slope*halfwidth, y0);
      ctxT.lineTo(xf, yf);
      ctxT.lineTo(x0, yf);
    } else if (rot==1) {
      ctxT.moveTo(x0, y0);
      ctxT.lineTo(xf, y0 + slope*halfwidth);
      ctxT.lineTo(xf, yf - slope*halfwidth);
      ctxT.lineTo(x0, yf);
      ctxT.lineTo(x0, y0);
    } else if (rot==2) {
      ctxT.moveTo(xf, y0);
      ctxT.lineTo(xf - slope*halfwidth, yf);
      ctxT.lineTo(x0 + slope*halfwidth, yf);
      ctxT.lineTo(x0, y0);
      ctxT.lineTo(xf, y0);
    } else if (rot==3) {
      ctxT.moveTo(xf, yf);
      ctxT.lineTo(x0, yf - slope*halfwidth);
      ctxT.lineTo(x0, y0 + slope*halfwidth);
      ctxT.lineTo(xf, y0);
      ctxT.lineTo(xf, yf);
    }
    ctxT.closePath();
    
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
  }
}

function deleteLastTensor() {
  var ind = tensors.length-1;
  deleteMiddleTensor(ind);
}

function deleteMiddleTensor(ind) {
  deleteIndicesFromTensor(ind);
  if (ind == tensors.length-1) {
    tensors.pop(); 
  } else {
    tensors.splice(ind,1); 
  }
  for (var j=1; j<indices.length; j++) {
    if (indices[j].connects[0]>ind) {
      indices[j].connects[0] -= 1;
    }
    if (indices[j].connects[2]>ind) {
      indices[j].connects[2] -= 1;
    }
  }
}

function bringTensorBack() {
  var tensortemp = [];
  var numSelected = currSelected.length;
  
  for (var i=numSelected-1; i>=0; i--) {
    var ind = currSelected[i];
    tensortemp.unshift(tensors.splice(ind,1)[0]);
  }
  tensors = [...tensortemp, ...tensors];
  updateIndexConnects();
  currSelected = [...Array(numSelected).keys()];
  drawTensors();
}

function bringTensorFront() {
  var tensortemp = [];
  var numSelected = currSelected.length;
  var numTensors = tensors.length;
  
  for (var i=numSelected-1; i>=0; i--) {
    var ind = currSelected[i];
    tensortemp.unshift(tensors.splice(ind,1)[0]);
  }
  tensors = [...tensors, ...tensortemp];
  updateIndexConnects();
  
  currSelected = addIntToVec([...Array(numSelected).keys()], numTensors-numSelected);
  drawTensors();
}

function bringTensorFoward() {
  var numSelected = currSelected.length;
  var numTensors = tensors.length;
  currSelected = new Uint32Array(currSelected);
  currSelected.sort();
  var wasShifted = currSelected[numSelected-1] < (numTensors-1);
  
  for (var i=numSelected-1; i>=0; i--) {
    var ind = currSelected[i];
    if (wasShifted || (currSelected[i+1]-ind)>1) {
      swapTwoTensors(ind,ind+1);
      wasShifted = true;
      currSelected[i] += 1;
    } else {
      wasShifted = false;
    }
  }
  drawTensors();
}

function bringTensorBehind() {
  var numSelected = currSelected.length;
  var numTensors = tensors.length;
  currSelected = new Uint32Array(currSelected);
  currSelected.sort();
  var wasShifted = currSelected[0] > 0;
  
  for (var i=0; i<numSelected; i++) {
    var ind = currSelected[i];
    if (wasShifted || (ind-currSelected[i-1])>1) {
      swapTwoTensors(ind,ind-1);
      wasShifted = true;
      currSelected[i] -= 1;
    } else {
      wasShifted = false;
    }
  }
  drawTensors();
}

function swapTwoTensors(i,j) {
  var tensortemp = tensors[i];
  tensors[i] = tensors[j];
  tensors[j] = tensortemp;
  updateIndexConnects();
}

function copySelection() {
  var numSelected = currSelected.length;
  var numTensors = tensors.length;
  var mapNewOld = new Array(numTensors).fill(-1);
  var newCurrSelected = [];
  for (var j=0; j<numSelected; j++) {
    var ind = currSelected[j];
    mapNewOld.push(ind);
    newCurrSelected.push(numTensors+j);
    var tempTensor = JSON.parse(JSON.stringify(tensors[ind]));
    var numAnchors = tempTensor.connects.length;
    tempTensor.connects = new Array(numAnchors).fill(0);
    tensors.push(tempTensor);
    if (!canvasBasedNames) {
      createTensorTag();
    }
  }
  
  var numIndices = indices.length;
  var mapIndicesNewOld = new Array(numIndices).fill(-1);
  var numNewIndices = 0;
  for (var j=1; j<numIndices; j++) {
    var includeIndex = false;
    var ind0 = indices[j].connects[0];
    var ind1 = indices[j].connects[2];
    if (ind0>=0 && ind1>=0) {//closed index
      if (currSelected.indexOf(ind0)>=0 && 
          currSelected.indexOf(ind1)>=0) {
        includeIndex = true;
      }
    } else if (ind0>=0 && ind1<0) {
      if (currSelected.indexOf(ind0)>=0) {
        includeIndex = true;
      }
    } else if (ind0<0 && ind1>=0) {
      if (currSelected.indexOf(ind1)>=0) {
        includeIndex = true;
      }
    }
    if (includeIndex) {
      mapIndicesNewOld.push(j);
      numNewIndices += 1;
      var tempIndex = JSON.parse(JSON.stringify(indices[j]));
      indices.push(tempIndex);
    }
  }
  
  for (var j=numIndices; j<(numIndices+numNewIndices); j++) {
    var i0 = indices[j].connects[0];
    if (i0>=0) {
      var i0p = mapNewOld.indexOf(i0);
      indices[j].connects[0] = i0p;
      var j0 = indices[j].connects[1];
      tensors[i0p].connects[j0] = -j;
    } else {
      openIndices.push(j);
    }
    var i1 = indices[j].connects[2];
    if (i1>=0) {
      var i1p = mapNewOld.indexOf(i1);
      indices[j].connects[2] = i1p;
      var j1 = indices[j].connects[3];
      tensors[i1p].connects[j1] = j;
    } else {
      openIndices.push(j);
    }
  }
  
  currSelected = newCurrSelected;
  drawTensors();
  return mapNewOld;
}

function makeTensorGroups() {
  // find groups of connected tensors (to selected or to all)
  var numTensors = tensors.length;
  var listOfGrouped = [];
  var tensorGroups = [];
  
  if (numTensors==0) {
    return;
  }
  var numSelected = currSelected.length;
  
  if (numSelected==0) {// loop over all tensors 
    for (var i=0; i<numTensors; i++) {// loop over all potential groups
      // find starting tensor
      var startTensor = -1;
      for (var i=0; i<numTensors; i++) {
        if (listOfGrouped.indexOf(i)<0) {
          var startTensor = i;
          listOfGrouped.push(startTensor);
          break;
        }
      }
      if (startTensor<0) {
        return tensorGroups;
      }

      tensorGroups.push(makeLocalGroups(startTensor));
      var numGroups = tensorGroups.length;
      listOfGrouped = listOfGrouped.concat(tensorGroups[numGroups-1].tlabs);
    }
    
  } else {// loop over selected tensors 
    for (var i=0; i<numSelected; i++) {// loop over all potential groups
      // find starting tensor
      var startTensor = -1;
      for (var i=0; i<numSelected; i++) {
        if (listOfGrouped.indexOf(currSelected[i])<0) {
          var startTensor = currSelected[i];
          listOfGrouped.push(startTensor);
          break;
        }
      }
      if (startTensor<0) {
        return tensorGroups;
      }

      tensorGroups.push(makeLocalGroups(startTensor));
      var numGroups = tensorGroups.length;
      listOfGrouped = listOfGrouped.concat(tensorGroups[numGroups-1].tlabs);
    }
  }
  return tensorGroups;
}

function makeLocalGroups(ind) {
  // find all tensors and indices connected to tensors[ind]
  var numTensors = tensors.length;
  var tempGroup = {
    tlabs: [ind],
    ilabs: [],
    olabs: []
  };

  for (var j=0; j<numTensors; j++) {// loop over all tensors within group
    var ind = tempGroup.tlabs[j]
    var numLocIndices = tensors[ind].connects.length;
    for (var k=0; k<numLocIndices; k++) { // loop over indices within tensor
      // add indices to group
      var jnd = Math.abs(tensors[ind].connects[k]);
      if (jnd>0 && tempGroup.ilabs.indexOf(jnd)<0) {
        tempGroup.ilabs.push(jnd);
        if (indices[jnd].connects[0]<0 || 
            indices[jnd].connects[2]<0) {
          tempGroup.olabs.push(jnd);
        }
      }
    }
      
    var numGroupIndices = tempGroup.ilabs.length;
    for (var k=0; k<numGroupIndices; k++) { // indices within group
      // add tensors to group
      var jnd = tempGroup.ilabs[k];
      var i0 = indices[jnd].connects[0];
      var i1 = indices[jnd].connects[2];

      if (i0>=0 && tempGroup.tlabs.indexOf(i0) < 0) {
        tempGroup.tlabs.push(i0);
        // listOfGrouped.push(i0);
      } else if (i1>=0 && tempGroup.tlabs.indexOf(i1) < 0) {
        tempGroup.tlabs.push(i1);
        // listOfGrouped.push(i1);
      }
    }

    var numGroupTensors = tempGroup.tlabs.length;
    if (j >= (numGroupTensors-1)) {
      return tempGroup;
    }
  } 
}

function reassignLocalGroupIndices(tempGroup) {
  // sequentialize open indices on a group 
  var tempOpen = tempGroup.olabs.slice();
  tempOpen.sort(function(a, b){return a - b});
  var numOpen = tempOpen.length;
  var openLabs = [];

  for (var j=0; j<numOpen; j++) {
    openLabs.push(indices[tempOpen[j]].label);
  }
  
  var openCounter = 0;
  for (var j=0; j<numOpen; j++) {
    var tempmin = Math.min(...openLabs);
    var temploc = openLabs.indexOf(tempmin);
    
    indices[tempOpen[temploc]].label = openCounter;
    openCounter++;
    openLabs.splice(temploc,1);
    tempOpen.splice(temploc,1);
  }
}

function reassignGroupIndices() {
  // sequentialize open indices on a set of groups 
  var tensorGroups = makeTensorGroups();
  var numGroups = tensorGroups.length;
  for (var j=0; j<numGroups; j++) {
    reassignLocalGroupIndices(tensorGroups[j]);
  }
}

function bufferSelection() {
  // copy all selected tensors
  tensorsBuffer = [];
  var mapNewOld = [];
  var numSelected = currSelected.length;
  for (var j=0; j<numSelected; j++) {
    var ind = currSelected[j];
    mapNewOld.push(ind);
    // copy tensor and empty anchors
    var tempTensor = JSON.parse(JSON.stringify(tensors[ind]));
    var numAnchors = tempTensor.connects.length;
    tempTensor.connects = new Array(numAnchors).fill(0);
    // add to buffer
    tensorsBuffer.push(tempTensor);
  }
  
  // copy all selected indices
  indicesBuffer = [0];
  var numIndices = indices.length;
  var mapIndicesNewOld = [];
  var numNewIndices = 1;
  for (var j=1; j<numIndices; j++) {
    var includeIndex = false;
    var ind0 = indices[j].connects[0];
    var ind1 = indices[j].connects[2];
    if (ind0>=0 && ind1>=0) {//closed index
      if (currSelected.indexOf(ind0)>=0 && 
          currSelected.indexOf(ind1)>=0) {
        includeIndex = true;
      }
    } else if (ind0>=0 && ind1<0) {
      if (currSelected.indexOf(ind0)>=0) {
        includeIndex = true;
      }
    } else if (ind0<0 && ind1>=0) {
      if (currSelected.indexOf(ind1)>=0) {
        includeIndex = true;
      }
    }
    if (includeIndex) {
      mapIndicesNewOld.push(j);
      numNewIndices += 1;
      var tempIndex = JSON.parse(JSON.stringify(indices[j]));
      indicesBuffer.push(tempIndex);
    }
  }
  
  // connect indices and tensors
  for (var j=1; j<numNewIndices; j++) {
    var i0 = indicesBuffer[j].connects[0];
    if (i0>=0) {
      var i0p = mapNewOld.indexOf(i0);
      indicesBuffer[j].connects[0] = i0p;
      var j0 = indicesBuffer[j].connects[1];
      tensorsBuffer[i0p].connects[j0] = -j;
    }
    var i1 = indicesBuffer[j].connects[2];
    if (i1>=0) {
      var i1p = mapNewOld.indexOf(i1);
      indicesBuffer[j].connects[2] = i1p;
      var j1 = indicesBuffer[j].connects[3];
      tensorsBuffer[i1p].connects[j1] = j;
    }
  }
  
  var clipData = {tensors: JSON.stringify(tensorsBuffer), 
                  indices: JSON.stringify(indicesBuffer)}
  return JSON.stringify(clipData);
}

function unpackBufferSelection(clipData) {
  var clipKeyValue = JSON.parse(clipData);
  var tensorsBuffer = JSON.parse(clipKeyValue.tensors);
  var indicesBuffer = JSON.parse(clipKeyValue.indices);
  
  var numNewTensors = tensorsBuffer.length;
  var numNewIndices = indicesBuffer.length - 1;
  var numTensors = tensors.length;
  var numIndices = indices.length;
  
  // unpack indices and update
  for (var j=0; j<numNewIndices; j++) {
    indices.push(indicesBuffer[j+1]);
    var jnd = numIndices+j;
    var i0 = indices[jnd].connects[0];
    var j0 = indices[jnd].connects[1];
    if (i0>=0) {
      tensorsBuffer[i0].connects[j0] = -jnd;
      indices[jnd].connects[0] += numTensors;
    }
    var i1 = indices[jnd].connects[2];
    var j1 = indices[jnd].connects[3];
    if (i1>=0) {
      tensorsBuffer[i1].connects[j1] = jnd;
      indices[jnd].connects[2] += numTensors;
    }
  }
  
  // unpack tensors
  currSelected = [];
  for (var i=0; i<numNewTensors; i++) {
    tensors.push(tensorsBuffer[i]);
    currSelected.push(numTensors+i);
    if (!canvasBasedNames) {
      createTensorTag();
    }
  }
  
  findOpenIndices();
}

function shiftSelectBoxWindow(x0=100, y0=100) {
  var numSelected = currSelected.length;
  if (numSelected>0) {
    updateSelectionBox();
    var dx = windowPos.x - selectBox[0] + (x0 / windowPos.zoom);
    var dy = windowPos.y - selectBox[1] + (y0 / windowPos.zoom);
    for (var i=0; i<numSelected; i++) {
      var ind = currSelected[i];
      tensors[ind].bbox = addVector(tensors[ind].bbox, [dx, dy, dx, dy, dx, dy]);
    }
  }
}

