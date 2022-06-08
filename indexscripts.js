function updateIndexConnects() {
  // Update index.connects using tensor.connects
  var numTensors = tensors.length;
  for (var i=0; i<numTensors; i++) {
    var numAnchors = tensors[i].connects.length;
    for (var j=0; j<numAnchors; j++) {
      var tempLab = tensors[i].connects[j];
      if (Math.abs(tempLab)>0) {
        if (tempLab<0) {
          indices[Math.abs(tempLab)].connects[0] = i;
          indices[Math.abs(tempLab)].connects[1] = j;
        } else if (tempLab>0) {
          indices[Math.abs(tempLab)].connects[2] = i;
          indices[Math.abs(tempLab)].connects[3] = j;
        }
      }
    }
  } 
}

function findOpenIndices() {
  openIndices = [];
  numIndices = indices.length;
  for (var j=1; j<numIndices; j++) {
    if (indices[j].connects[0] < 0 || indices[j].connects[2] < 0) {
      openIndices.push(j);
    }
  }
}

function createIndex(evt,i0,j0,i1,j1) {
  var currIndex = indices.length;
  var numOpen = openIndices.length;
  tensors[i0].connects[j0] = -currIndex; //origin
  tensors[i1].connects[j1] = currIndex; //destination
  tempIndex = {
    connects: [i0,j0,i1,j1],
    name: "",
    dim: 2,
    reversed: false,
    end: [0,0],
    center: [0,0],
    label: numOpen,
    curved: false
    }
  indices.push(tempIndex);
}

function incrementIndexLabel(j0) {
  var i0 = Math.max(indices[j0].connects[0], indices[j0].connects[2]);
  var tempgrp = makeLocalGroups(i0);
  var tempAllOpen = [];
  for (var jnd=0; jnd<tempgrp.olabs.length; jnd++) {
    tempAllOpen.push(indices[tempgrp.olabs[jnd]].label);
  }
  var startLabel = indices[j0].label;
  var tempPos = tempAllOpen.indexOf(startLabel+1);
  if (tempPos>=0) {
    indices[tempgrp.olabs[tempPos]].label = startLabel;
    indices[j0].label = startLabel+1;
  } else {
    indices[j0].label = startLabel+1;
  }
}

function decrementIndexLabel(j0) {
  var i0 = Math.max(indices[j0].connects[0], indices[j0].connects[2]);
  var tempgrp = makeLocalGroups(i0);
  var tempAllOpen = [];
  for (var jnd=0; jnd<tempgrp.olabs.length; jnd++) {
    tempAllOpen.push(indices[tempgrp.olabs[jnd]].label);
  }
  var startLabel = indices[j0].label;
  var tempPos = tempAllOpen.indexOf(startLabel-1);
  if (tempPos>=0) {
    indices[tempgrp.olabs[tempPos]].label = startLabel;
    indices[j0].label = startLabel-1;
  } else {
    if (startLabel>0) {
      indices[j0].label = startLabel-1;
    }
  }
}

function createFreeIndex(evt,i0,j0) {
  var pos = getAbsMousePos(canvasBase,evt); 
  var currIndex = indices.length;
  var numOpen = openIndices.length;
  var tempgrp = makeLocalGroups(i0);
  
  var tempAllOpen = [];
  for (var jnd=0; jnd<tempgrp.olabs.length; jnd++) {
    tempAllOpen.push(indices[tempgrp.olabs[jnd]].label);
  }
  for (var jnd=0; jnd<(tempgrp.olabs.length+1); jnd++) {
    if (tempAllOpen.indexOf(jnd) < 0) {
      var openLab = jnd;
      break;
    }
  }
  // var openLab = tempgrp.olabs.length;
  
  tensors[i0].connects[j0] = -currIndex; //origin
  var x0 = pos.x;
  var y0 = pos.y;
  if (gridSnap) {
    x0 = snapX(x0);
    y0 = snapY(y0);
  } 
  tempIndex = {
    connects: [i0,j0,-1,-1],
    name: "",
    dim: 2,
    reversed: false,
    end: [x0-tensors[i0].bbox[4], y0-tensors[i0].bbox[5]],
    center: [0,0],
    label: openLab,
    curved: false
    }
  indices.push(tempIndex);
  openIndices.push(currIndex);
}

function deleteIndex(ind) {
  indices.splice(ind,1);
  for (var i=0; i<tensors.length; i++) {
    for (var j=0; j<tensors[i].connects.length; j++) {
      if (Math.abs(tensors[i].connects[j])==ind) {
        tensors[i].connects[j] = 0;
      } else if (Math.abs(tensors[i].connects[j]) > ind) {
        if (tensors[i].connects[j]>0) {
          tensors[i].connects[j] -= 1; // shift indices down 
        } else if (tensors[i].connects[j]<0) {
          tensors[i].connects[j] += 1; // shift indices up
        }
      }
    }
  }
  var loctemp = openIndices.indexOf(ind);
  if (loctemp >= 0) {
    openIndices.splice(loctemp,1);
  }
  for (var j=0; j<openIndices.length; j++) {
    if (openIndices[j] >= ind) {
      openIndices[j] -= 1;
    } 
  }
}

function deleteIndicesFromTensor(ind) {
  var templab = [];
  var tempdouble = [];
  for (var j=0; j<tensors[ind].connects.length; j++) {
    if (tensors[ind].connects[j] != 0) {
      var tempval = Math.abs(tensors[ind].connects[j])
      if (templab.indexOf(tempval) >= 0) {
        tempdouble.push(tempval);
      } else {
        templab.push(tempval);
      }
    }
  }
  var numToDelete = templab.length;
  for (var j=0; j<numToDelete; j++) {
    var jnd = Math.max(...templab);
    var loc0 = templab.indexOf(jnd);
    var loc1 = tempdouble.indexOf(jnd);
    if (loc1 >= 0) {//self contraction
      deleteIndex(jnd)
      templab.splice(loc0,1);
      tempdouble.splice(loc1,1)
    } else {
      openLoc = openIndices.indexOf(jnd);
      if (openIndices.indexOf(jnd) >= 0) {//open
        deleteIndex(jnd)
      } else {//closed
        if (indices[jnd].connects[0] == ind) {
          var xmid0 = tensors[ind].bbox[4];
          var xmid1 = tensors[indices[jnd].connects[2]].bbox[4];
          var ymid0 = tensors[ind].bbox[5];
          var ymid1 = tensors[indices[jnd].connects[2]].bbox[5];
          indices[jnd].end[0] = tensors[ind].xanchors[indices[jnd].connects[1]] + (xmid0-xmid1);
          indices[jnd].end[1] = tensors[ind].yanchors[indices[jnd].connects[1]] + (ymid0-ymid1);
          indices[jnd].label = indices[jnd].connects[1];
          indices[jnd].connects[0] = -1;
          indices[jnd].connects[1] = -1;
          
        } else if (indices[jnd].connects[2] == ind) {
          var xmid0 = tensors[ind].bbox[4];
          var xmid1 = tensors[indices[jnd].connects[0]].bbox[4];
          var ymid0 = tensors[ind].bbox[5];
          var ymid1 = tensors[indices[jnd].connects[0]].bbox[5];
          indices[jnd].end[0] = tensors[ind].xanchors[indices[jnd].connects[3]] + (xmid0-xmid1);
          indices[jnd].end[1] = tensors[ind].yanchors[indices[jnd].connects[3]] + (ymid0-ymid1);
          indices[jnd].label = indices[jnd].connects[3];
          indices[jnd].connects[2] = -1;
          indices[jnd].connects[3] = -1;
        }
        openIndices.push(jnd);
      }
      templab.splice(loc0,1);
    }
  }
}





