/*
functions related to menu selections
*/

function changeSelectedType() {
  selectedType = selectedTypeElement.value;
}

function updateSelectionBox() {
  if (currSelected.length==0) {
    selectBox = [0, 0, 0, 0, 0, 0];
    clearColorBorder();
    allLeftCols[leftColorSelected].style.border = "1px solid black";
    return
  } else {
    var tempColor = tensors[currSelected[0]].color;
    var isMonotone = true;
    var xmax = tensors[currSelected[0]].bbox[2];
    var xmin = tensors[currSelected[0]].bbox[0];
    var ymax = tensors[currSelected[0]].bbox[3];
    var ymin = tensors[currSelected[0]].bbox[1];
    for (var i=1; i<currSelected.length; i++) {
      var ind = currSelected[i];
      xmin = Math.min(tensors[ind].bbox[0],xmin);
      xmax = Math.max(tensors[ind].bbox[2],xmax);
      ymin = Math.min(tensors[ind].bbox[1],ymin);
      ymax = Math.max(tensors[ind].bbox[3],ymax);
      if (tensors[ind].color != tempColor) {
        isMonotone = false;
      }
    }
    var xmid = 0.5*(xmin + xmax);
    var ymid = 0.5*(ymin + ymax);
    selectBox = [xmin, ymin, xmax, ymax, xmid, ymid];
    clearColorBorder();
    if (isMonotone) {allLeftCols[tempColor].style.border = "1px solid black"};
    return
  }
}
