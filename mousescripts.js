/*
auxillary functions relating to mouse action and positioning
*/

function checkUnderMouse(evt) {
  if (stateOfMouse != "renaming") {
    var pos = getMousePos(canvasBase, evt);

    // check if over minimap
    var mX0 = viewWidth - (miniPad + miniWidth);
    var mY0 = miniPad;
    var mX1 = mX0 + miniWidth;
    var mY1 = mY0 + miniHeight;
    if (checkInTensor(pos, [mX0, mX1, mX1, mX0], [mY0, mY0, mY1, mY1], 0)) {
      objUnderMouse[0] = "minimap";
      objUnderMouse[1] = 0;
      return;
    }

    // check if over handles
    for (var i = 0; i < currSelected.length; i++) {
      var xc = a2rXall(tensor_xcoords[currSelected[i]]);
      var yc = a2rYall(tensor_ycoords[currSelected[i]]);

      if (tensor_types[currSelected[i]] == 0) {
        for (var j = 0; j < xc.length; j++) {
          if (
            Math.sqrt((xc[j] - pos.x) ** 2 + (yc[j] - pos.y) ** 2) < circRad
          ) {
            objUnderMouse[0] = "handle";
            objUnderMouse[1] = currSelected[i];
            objUnderMouse[2] = j;

            // find handles
            var ymin = Math.min(...yc);
            var ymax = Math.max(...yc);
            if (Math.abs(yc[j] - ymin) < Math.abs(yc[j] - ymax)) {
              var stemp1 = "n";
            } else {
              var stemp1 = "s";
            }
            var xmin = Math.min(...xc);
            var xmax = Math.max(...xc);
            if (Math.abs(xc[j] - xmin) < Math.abs(xc[j] - xmax)) {
              var stemp2 = "w";
            } else {
              var stemp2 = "e";
            }
            handleType = stemp1 + stemp2 + "-resize";
            updateCursorStyle();

            return;
          }
        }
      } else if (tensor_types[currSelected[i]] == 1) {
        var ymin = Math.min(...yc);
        var ymax = Math.max(...yc);
        var xmin = Math.min(...xc);
        var xmax = Math.max(...xc);
        var xmid = (xmin + xmax) / 2;
        var ymid = (ymin + ymax) / 2;

        if (Math.sqrt((xmin - pos.x) ** 2 + (ymid - pos.y) ** 2) < circRad) {
          objUnderMouse[0] = "handle";
          objUnderMouse[1] = currSelected[i];
          objUnderMouse[2] = 0;
          handleType = "w-resize";
          coordGrabbed[0] = Math.max(...tensor_xcoords[currSelected[i]]);
          updateCursorStyle();
          return;
        } else if (
          Math.sqrt((xmid - pos.x) ** 2 + (ymin - pos.y) ** 2) < circRad
        ) {
          objUnderMouse[0] = "handle";
          objUnderMouse[1] = currSelected[i];
          objUnderMouse[2] = 1;
          handleType = "n-resize";
          coordGrabbed[1] = Math.max(...tensor_ycoords[currSelected[i]]);
          updateCursorStyle();
          return;
        } else if (
          Math.sqrt((xmax - pos.x) ** 2 + (ymid - pos.y) ** 2) < circRad
        ) {
          objUnderMouse[0] = "handle";
          objUnderMouse[1] = currSelected[i];
          objUnderMouse[2] = 2;
          handleType = "e-resize";
          coordGrabbed[0] = Math.min(...tensor_xcoords[currSelected[i]]);
          updateCursorStyle();
          return;
        } else if (
          Math.sqrt((xmid - pos.x) ** 2 + (ymax - pos.y) ** 2) < circRad
        ) {
          objUnderMouse[0] = "handle";
          objUnderMouse[1] = currSelected[i];
          objUnderMouse[2] = 3;
          handleType = "s-resize";
          coordGrabbed[1] = Math.min(...tensor_ycoords[currSelected[i]]);
          updateCursorStyle();
          return;
        }
      }
    }

    // check if over anchors
    for (var i = tensor_order.length - 1; i >= 0; i--) {
      var num_anchors = tensor_xanchors[i].length;
      var xmid = tensor_bbox[i][4];
      var ymid = tensor_bbox[i][5];

      for (var j = 0; j < num_anchors; j++) {
        var xc = a2rX(tensor_xanchors[i][j] + xmid);
        var yc = a2rY(tensor_yanchors[i][j] + ymid);

        if (
          2 * Math.abs(xc - pos.x) < anchorWidth &&
          2 * Math.abs(yc - pos.y) < anchorHeight
        ) {
          // if (((xc - pos.x)**2 + (yc - pos.y)**2) < anchorLocRadius**2) {
          objUnderMouse[0] = "anchor";
          objUnderMouse[1] = i;
          objUnderMouse[2] = j;
          updateCursorStyle();
          return;
        }
      }
    }

    // check if over rename icon
    for (var i = 0; i < currSelected.length; i++) {
      var xmid = Math.round(a2rX(tensor_bbox[currSelected[i]][4]));
      var ymid = Math.round(a2rY(tensor_bbox[currSelected[i]][5]));

      var x0 = Math.round(xmid - renameIcon.width / 2);
      var y0 = Math.round(ymid + renameIcon.height / 2);
      var x1 = Math.round(xmid + renameIcon.width / 2);
      var y1 = Math.round(ymid + (3 * renameIcon.height) / 2);

      if (isInRange(pos.x, x0, x1) && isInRange(pos.y, y0, y1)) {
        objUnderMouse[0] = "rename";
        objUnderMouse[1] = currSelected[i];
        updateCursorStyle();
        return;
      }
    }

    // check if over tensors
    for (var i = tensor_order.length - 1; i >= 0; i--) {
      if (
        checkInTensor(
          pos,
          tensor_xcoords[i],
          tensor_ycoords[i],
          tensor_types[i],
          true
        )
      ) {
        objUnderMouse[0] = "tensor";
        objUnderMouse[1] = i;
        updateCursorStyle();
        return;
      }
    }

    // mouse is over nothing special
    objUnderMouse[0] = "none";
    objUnderMouse[1] = 0;
    return;
  }
}

function freeMouseState() {
  if (stateOfMouse == "creating") {
    var num_tensors = tensor_types.length;
    var xc = tensor_xcoords[num_tensors - 1];
    var yc = tensor_ycoords[num_tensors - 1];
    var xspan = Math.max(...xc) - Math.min(...xc);
    var yspan = Math.max(...yc) - Math.min(...yc);
    if (xspan < minWidth || yspan < minHeight) {
      deleteLastTensor();
    }
  } else if (stateOfMouse == "selecting") {
    x0 = Math.min(selectBoxCoords[0], selectBoxCoords[2]);
    x1 = Math.max(selectBoxCoords[0], selectBoxCoords[2]);
    y0 = Math.min(selectBoxCoords[1], selectBoxCoords[3]);
    y1 = Math.max(selectBoxCoords[1], selectBoxCoords[3]);

    for (var i = 0; i < tensor_types.length; i++) {
      var isInBox =
        tensor_bbox[i][0] > x0 &&
        tensor_bbox[i][2] < x1 &&
        tensor_bbox[i][1] > y0 &&
        tensor_bbox[i][3] < y1;
      if (isInBox) {
        currSelected.push(i);
      }
    }
  }

  isLeftDown = false;
  isRightDown = false;
  stateOfMouse = "free";
  updateCursorStyle();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getAbsMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: r2aX(evt.clientX - rect.left),
    y: r2aY(evt.clientY - rect.top)
  };
}

function getSnapAbsMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(r2aX(evt.clientX - rect.left) / gridSpaceX) * gridSpaceX,
    y: Math.round(r2aY(evt.clientY - rect.top) / gridSpaceY) * gridSpaceY
  };
}

function getRelMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: a2rX(evt.clientX - rect.left),
    y: a2rY(evt.clientY - rect.top)
  };
}
