/*
functions related to menu selections
*/

function changeSelectedType() {
  selectedType = selectedTypeElement.value;
}

function updateSelectionBox() {
  if (currSelected.length==0 && currBoxSelected.length==0) {
    selectBox = [0, 0, 0, 0, 0, 0];
    clearColorBorder();
    allLeftCols[leftColorSelected].style.border = "1px solid black";
    return
  } else {
    var xmax = 0;
    var xmin = spaceWidth;
    var ymax = 0;
    var ymin = spaceHeight;
    if (currSelected.length>0) {
      var tempColor = tensors[currSelected[0]].color;
      var isMonotone = true;
      for (var i=0; i<currSelected.length; i++) {
        var ind = currSelected[i];
        xmin = Math.min(tensors[ind].bbox[0],xmin);
        xmax = Math.max(tensors[ind].bbox[2],xmax);
        ymin = Math.min(tensors[ind].bbox[1],ymin);
        ymax = Math.max(tensors[ind].bbox[3],ymax);
        if (tensors[ind].color != tempColor) {
          isMonotone = false;
        }
      }
      clearColorBorder();
      if (isMonotone) {allLeftCols[tempColor].style.border = "1px solid black"};
    }
    if (currBoxSelected.length>0) {
      for (var i=0; i<currBoxSelected.length; i++) {
        var ind = currBoxSelected[i];
        xmin = Math.min(textBoxes[ind].bbox[0],xmin);
        xmax = Math.max(textBoxes[ind].bbox[2],xmax);
        ymin = Math.min(textBoxes[ind].bbox[1],ymin);
        ymax = Math.max(textBoxes[ind].bbox[3],ymax);
      }
    }
    var xmid = 0.5*(xmin + xmax);
    var ymid = 0.5*(ymin + ymax);
    selectBox = [xmin, ymin, xmax, ymax, xmid, ymid];
  }
}
