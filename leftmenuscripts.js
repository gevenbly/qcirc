function doLeftSelect(selected) {
  leftSelectedType = selected;
  updateLeftSelect();
}

function clearLeftShading() {
  for (var i=0; i<allLeftIcons.length; i++) {
    allLeftIcons[i].style.backgroundColor = 'transparent'; 
    allLeftIcons[i].style.borderStyle = "none";
  }
}

function updateLeftSelect() {
  clearLeftShading();
  allLeftIcons[leftSelectedType].style.backgroundColor = greyHover;
  allLeftIcons[leftSelectedType].style.border = "1px solid #000000";
}

function doLeftHover(hovered) { 
  clearLeftShading(); 
  updateLeftSelect();
  allLeftIcons[hovered].style.backgroundColor = greyHover;
}

function doLeftBack() {
  bringTensorBack();
}

function doLeftFront() {
  bringTensorFront();
}

function doLeftForward() {
  bringTensorFoward();
}

function doLeftBehind() {
  bringTensorBehind();
}

