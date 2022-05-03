/*
functions for creation / manipulation of tensors
*/

function createTensor(x0, y0, xf, yf) {
  /* called once when first creating tensor */
  if (selectedType == 0) { 
    // create rectangle
    
    if (gridSnap) {
      x0 = snapX(x0);
      xf = snapX(xf);
      y0 = snapY(y0);
      yf = snapY(yf);
    }
    tensor_xcoords.push([x0, xf, xf, x0]);
    tensor_ycoords.push([y0, y0, yf, yf]);
    tensor_types.push(0)
    tensor_order.push(0)
    tensor_names.push("")
    
    var xmin = Math.min(x0, xf);
    var xmax = Math.max(x0, xf);
    var ymin = Math.min(y0, yf);
    var ymax = Math.max(y0, yf);
    var xcent = (xmin + xmax) / 2;
    var ycent = (ymin + ymax) / 2;
    tensor_bbox.push([xmin, ymin, xmax, ymax, xcent, ycent])
  }
}

function updateTensor(xf, yf) {
  /* called at intermediate steps when creating tensor */
  if (selectedType == 0) { 
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
    return;
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
    return;
  }
}

function updateBoundBox(ind) {
  var xmin = Math.min(...tensor_xcoords[ind]);
  var xmax = Math.max(...tensor_xcoords[ind]);
  var ymin = Math.min(...tensor_ycoords[ind]);
  var ymax = Math.max(...tensor_ycoords[ind]);
  var xcent = (xmin + xmax) / 2;
  var ycent = (ymin + ymax) / 2;
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
    
    tensor_bbox[ind] = addVector(tensor_bbox[ind], [xdiff, ydiff, xdiff, ydiff, xdiff, ydiff]);
    tensor_xcoords[ind] = addVector(tensor_xcoords[ind], [xdiff, xdiff, xdiff, xdiff]);
    tensor_ycoords[ind] = addVector(tensor_ycoords[ind], [ydiff, ydiff, ydiff, ydiff]);
    
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
  }
}

function deleteLastTensor() {
  tensor_xcoords.pop();
  tensor_ycoords.pop();
  tensor_bbox.pop(); 
  tensor_types.pop();
  tensor_order.pop();
  tensor_names.pop();
}