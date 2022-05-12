/*
functions for creation / manipulation of tensors
*/

function createTensor(x0, y0, xf, yf) {
  /* called once when first creating tensor */
  if (leftSelectedType <= 3) { 
    // create rectangle
    
    if (gridSnap) {
      x0 = snapX(x0);
      xf = snapX(xf);
      y0 = snapY(y0);
      yf = snapY(yf);
    }
    var xmin = Math.min(x0, xf);
    var xmax = Math.max(x0, xf);
    var ymin = Math.min(y0, yf);
    var ymax = Math.max(y0, yf);
    var xcent = (xmin + xmax) / 2;
    var ycent = (ymin + ymax) / 2;
    
    tensor_xcoords.push([x0, xf, xf, x0]);
    tensor_ycoords.push([y0, y0, yf, yf]);
    tensor_types.push(leftSelectedType-2);
    tensor_order.push(0);
    tensor_names.push("");
    
    tensor_xanchors.push(createXAnchors(0.25*Math.abs(xf - x0)));
    tensor_yanchors.push(createYAnchors(0.25*Math.abs(yf - y0)));
    tensor_bbox.push([xmin, ymin, xmax, ymax, xcent, ycent]);
  } 
}

function createXAnchors(anchorLocRadius) {
  var temp_xanchors = [];
  var dtheta = Math.PI / (numAnchorsCreated+1);
  for (var i=0; i<numAnchorsCreated; i++) {
    temp_xanchors.push(-anchorLocRadius * Math.cos((i+1)*dtheta));
  }
  return temp_xanchors
}

function createYAnchors(anchorLocRadius) {
  var temp_yanchors = [];
  var dtheta = Math.PI / (numAnchorsCreated+1);
  for (var i=0; i<numAnchorsCreated; i++) {
    temp_yanchors.push(-anchorLocRadius * Math.sin((i+1)*dtheta));
  }
  return temp_yanchors
}

function updateTensor(xf, yf) {
  /* called at intermediate steps when creating tensor */
  if (leftSelectedType <= 3) { 
    // resize rectangle
    var num_tensors = tensor_types.length;
    var x0 = tensor_xcoords[num_tensors-1][0]
    var y0 = tensor_ycoords[num_tensors-1][0]
    
    if (gridSnap) {
      xf = snapX(xf);
      yf = snapY(yf);
    }
    tensor_xcoords[num_tensors-1] = [x0, xf, xf, x0];
    tensor_ycoords[num_tensors-1] = [y0, y0, yf, yf];
    updateBoundBox(num_tensors-1);
    
    tensor_xanchors[num_tensors-1] = (createXAnchors(0.25*Math.abs(xf - x0)));
    tensor_yanchors[num_tensors-1] = (createYAnchors(0.25*Math.abs(yf - y0)));
  }
}

function resizeTensor(xf, yf, ind, subind) {
  if (tensor_types[ind] == 0) { 
    // resize rectangle
    var op_ind = ((subind + 2) % 4);
    var x0 = tensor_xcoords[ind][op_ind];
    var y0 = tensor_ycoords[ind][op_ind];
    if (subind==0) {
      tensor_xcoords[ind] = [xf, x0, x0, xf];
      tensor_ycoords[ind] = [yf, yf, y0, y0];
    } else if (subind == 1) {
      tensor_xcoords[ind] = [x0, xf, xf, x0];
      tensor_ycoords[ind] = [yf, yf, y0, y0];
    } else if (subind == 2) {
      tensor_xcoords[ind] = [x0, xf, xf, x0];
      tensor_ycoords[ind] = [y0, y0, yf, yf];
    } else if (subind == 3) {
      tensor_xcoords[ind] = [xf, x0, x0, xf];
      tensor_ycoords[ind] = [y0, y0, yf, yf];
    }
    updateBoundBox(ind);
    
  } else if (tensor_types[ind] == 1) { 
    // resize ellipse
    var x0 = coordGrabbed[0];
    var y0 = coordGrabbed[1];
    if ((subind==0) || (subind==2)) {
      tensor_xcoords[ind] = [x0, (x0+xf)/2, xf, (x0+xf)/2];
    } else if ((subind==1) || (subind==3)) {
      tensor_ycoords[ind] = [(y0+yf)/2, y0, (y0+yf)/2, yf];
    }
    updateBoundBox(ind);
  }
}

function updateBoundBox(ind) {
  var xmin = Math.min(...tensor_xcoords[ind]);
  var xmax = Math.max(...tensor_xcoords[ind]);
  var ymin = Math.min(...tensor_ycoords[ind]);
  var ymax = Math.max(...tensor_ycoords[ind]);
  var xcent = (xmin + xmax) / 2;
  var ycent = (ymin + ymax) / 2;
  
  var ratioxtemp = (xmax - xmin) / Math.max(tensor_bbox[ind][2] - tensor_bbox[ind][0], 0.0001);
  var ratioytemp = (ymax - ymin) / Math.max(tensor_bbox[ind][3] - tensor_bbox[ind][1], 0.0001);
  var numAnchors = tensor_xanchors[ind].length;
  for (var j=0; j<numAnchors; j++) {
    tensor_xanchors[ind][j] *= ratioxtemp;
    tensor_yanchors[ind][j] *= ratioytemp;
  }
  tensor_bbox[ind] = [xmin, ymin, xmax, ymax, xcent, ycent];
  return;
}

function updatePosCenter(xpos, ypos) {
  if (selectedType == 0) { 
    // reposition rectangle
    var xc_new = xpos - coordGrabbed[0];
    var yc_new = ypos - coordGrabbed[1];
    
    var ind = currGrabbed[1];
    var xdiff = xc_new - tensor_bbox[ind][4];
    var ydiff = yc_new - tensor_bbox[ind][5];
    if (gridSnap) {
      xdiff = snapX(xdiff);
      ydiff = snapY(ydiff);
    }
    
    for (var i=0; i<currSelected.length; i++) {
      var ind = currSelected[i];
      tensor_bbox[ind] = addVector(tensor_bbox[ind], [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
      tensor_xcoords[ind] = addVector(tensor_xcoords[ind], [xdiff, xdiff, xdiff, xdiff]);
      tensor_ycoords[ind] = addVector(tensor_ycoords[ind], [ydiff, ydiff, ydiff, ydiff]);
    }
    return;
  }
}

function checkInTensor(pos, xcoords, ycoords, type, isRel=false) {
  if (type == 0) {
    ctxT.beginPath();
    ctxT.moveTo(xcoords[0], ycoords[0]);
    ctxT.lineTo(xcoords[1], ycoords[1]);
    ctxT.lineTo(xcoords[2], ycoords[2]);
    ctxT.lineTo(xcoords[3], ycoords[3]);
    ctxT.closePath();
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
  } else if (type == 1) {
    var x0 = Math.min(...xcoords);
    var xf = Math.max(...xcoords);
    var y0 = Math.min(...ycoords);
    var yf = Math.max(...ycoords);
  
    ctxT.beginPath();
    ctxT.ellipse((xf+x0)/2, (yf+y0)/2, (xf-x0)/2, (yf-y0)/2, 0, 0, 2 * Math.PI);
    ctxT.closePath();
    if (isRel) {
      return ctxT.isPointInPath(r2aX(pos.x), r2aY(pos.y));
    } else {
      return ctxT.isPointInPath(pos.x, pos.y);
    }
  }
}

function deleteLastTensor() {
  tensor_xcoords.pop();
  tensor_ycoords.pop();
  tensor_bbox.pop(); 
  tensor_types.pop();
  tensor_order.pop();
  tensor_names.pop();
  tensor_xanchors.pop();
  tensor_yanchors.pop();
}

function deleteMiddleTensor(ind) {
  tensor_xcoords.splice(ind,1);
  tensor_ycoords.splice(ind,1);
  tensor_bbox.splice(ind,1); 
  tensor_types.splice(ind,1);
  tensor_order.splice(ind,1);
  tensor_names.splice(ind,1);
  tensor_xanchors.splice(ind,1);
  tensor_yanchors.splice(ind,1);
}

function bringTensorBack() {
  var xctemp = [];
  var yctemp = [];
  var bbtemp = [];
  var typetemp = [];
  var ordertemp = [];
  var namestemp = [];
  var xanchortemp = [];
  var yanchortemp = [];
  var numSelected = currSelected.length;
  
  for (var i=numSelected-1; i>=0; i--) {
    var ind = currSelected[i];
    xctemp.unshift(tensor_xcoords.splice(ind,1)[0]);
    yctemp.unshift(tensor_ycoords.splice(ind,1)[0]);
    bbtemp.unshift(tensor_bbox.splice(ind,1)[0]);
    typetemp.unshift(tensor_types.splice(ind,1)[0]);
    ordertemp.unshift(tensor_order.splice(ind,1)[0]);
    namestemp.unshift(tensor_names.splice(ind,1)[0]);
    xanchortemp.unshift(tensor_xanchors.splice(ind,1)[0]);
    yanchortemp.unshift(tensor_yanchors.splice(ind,1)[0]);
  }
  tensor_xcoords = [...xctemp, ...tensor_xcoords];
  tensor_ycoords = [...yctemp, ...tensor_ycoords];
  tensor_bbox = [...bbtemp, ...tensor_bbox];
  tensor_types = [...typetemp, ...tensor_types];
  tensor_order = [...ordertemp, ...tensor_order];
  tensor_names = [...namestemp, ...tensor_names];
  tensor_xanchors = [...xanchortemp, ...tensor_xanchors];
  tensor_yanchors = [...yanchortemp, ...tensor_yanchors];
  
  currSelected = [...Array(numSelected).keys()];
  drawTensors();
}

function bringTensorFront() {
  var xctemp = [];
  var yctemp = [];
  var bbtemp = [];
  var typetemp = [];
  var ordertemp = [];
  var namestemp = [];
  var xanchortemp = [];
  var yanchortemp = [];
  var numSelected = currSelected.length;
  var numTensors = tensor_types.length;
  
  for (var i=numSelected-1; i>=0; i--) {
    var ind = currSelected[i];
    xctemp.unshift(tensor_xcoords.splice(ind,1)[0]);
    yctemp.unshift(tensor_ycoords.splice(ind,1)[0]);
    bbtemp.unshift(tensor_bbox.splice(ind,1)[0]);
    typetemp.unshift(tensor_types.splice(ind,1)[0]);
    ordertemp.unshift(tensor_order.splice(ind,1)[0]);
    namestemp.unshift(tensor_names.splice(ind,1)[0]);
    xanchortemp.unshift(tensor_xanchors.splice(ind,1)[0]);
    yanchortemp.unshift(tensor_yanchors.splice(ind,1)[0]);
  }
  tensor_xcoords = [...tensor_xcoords, ...xctemp];
  tensor_ycoords = [...tensor_ycoords, ...yctemp];
  tensor_bbox = [...tensor_bbox, ...bbtemp];
  tensor_types = [...tensor_types, ...typetemp];
  tensor_order = [...tensor_order, ...ordertemp];
  tensor_names = [...tensor_names, ...namestemp];
  tensor_xanchors = [...tensor_xanchors, ...xanchortemp];
  tensor_yanchors = [...tensor_yanchors, ...yanchortemp];
  
  currSelected = addIntToVec([...Array(numSelected).keys()], numTensors-numSelected);
  drawTensors();
}

function bringTensorFoward() {
  var numSelected = currSelected.length;
  var numTensors = tensor_types.length;
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
  var numTensors = tensor_types.length;
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
  var xctemp = tensor_xcoords[i];
  var yctemp = tensor_ycoords[i];
  var bbtemp = tensor_bbox[i];
  var typetemp = tensor_types[i];
  var ordertemp = tensor_order[i];
  var namestemp = tensor_names[i];
  var xanchortemp = tensor_xanchors[i];
  var yanchortemp = tensor_yanchors[i];
  
  tensor_xcoords[i] = tensor_xcoords[j];
  tensor_ycoords[i] = tensor_ycoords[j];
  tensor_bbox[i] = tensor_bbox[j];
  tensor_types[i] = tensor_types[j];
  tensor_order[i] = tensor_order[j];
  tensor_names[i] = tensor_names[j];
  tensor_xanchors[i] = tensor_xanchors[j];
  tensor_yanchors[i] = tensor_yanchors[j];
  
  tensor_xcoords[j] = xctemp;
  tensor_ycoords[j] = yctemp;
  tensor_bbox[j] = bbtemp;
  tensor_types[j] = typetemp;
  tensor_order[j] = ordertemp;
  tensor_names[j] = namestemp;
  tensor_xanchors[j] = xanchortemp;
  tensor_yanchors[j] = yanchortemp;
}