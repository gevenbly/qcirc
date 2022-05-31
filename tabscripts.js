var numProjectsOpen = 1;
var currProjectOpen = 0;
var totalProjectsOpen = 1;
var maxProjectsOpen = 5;
var isProjectBoxActive = false;
var projectNamerBox = document.getElementById("projectNamerBox");
var projectNameText = document.getElementById("projectNameText");
var projectClicked = 0;
projectNameGrabber.addEventListener("mousedown", startProjectDrag);
projectNameGrabber.addEventListener("mouseup", stopProjectDrag); 
const mousePosProj = {x: 0, y: 0};
projectNamerBox.addEventListener('focusout', (evt) => {closeNamingBox();});
var projectOKBar = document.getElementById("projectOKBar");
projectOKBar.addEventListener("mousedown", updateNamingBox, true);

var projectNamerBox = document.getElementById("projectNamerBox");
const allProjectTabs = [document.getElementById("tabbox0"),
                        document.getElementById("tabbox1"),
                        document.getElementById("tabbox2"),
                        document.getElementById("tabbox3"),
                        document.getElementById("tabbox4")];   

const allProjectTabText = [document.getElementById("tabbox0p"),
                          document.getElementById("tabbox1p"),
                          document.getElementById("tabbox2p"),
                          document.getElementById("tabbox3p"),
                          document.getElementById("tabbox4p")];   

allProjectTabs[currProjectOpen].style.backgroundColor = "#474747";

allProjectNames = [];
allProjectNames.push("project1");
for (var j=0; j<allProjectTabs.length; j++) {
  allProjectTabText[j].innerHTML = allProjectNames[j] + ".qc";
}

function doSwitchTab(selected) {
  saveWorkspace(currProjectOpen);
  currProjectOpen = selected;
  loadWorkspace(currProjectOpen);
  updateTabSelect();
}

function doHoverTab(hovered) { 
  updateTabSelect();
  allProjectTabs[hovered].style.backgroundColor = '#474747';
  allProjectTabs[hovered].style.border = "1px solid black";
}

function clearTabShading() {
  for (var i=0; i<allProjectTabs.length; i++) {
    allProjectTabs[i].style.backgroundColor = 'black';
    allProjectTabs[i].style.border = "0px solid black";
  }
}

function updateTabSelect() {
  clearTabShading();
  allProjectTabs[currProjectOpen].style.backgroundColor = '#474747';
}


function initializeWorkspace() {
  numProjectsOpen = tensorString.length;
  windowPosString.push(JSON.stringify({x: 0, y: 0, zoom: 2}));
  tensorString.push(JSON.stringify([]));
  indexString.push(JSON.stringify([0]));
  
  allProjectNames.push("project" + (totalProjectsOpen+1));
  totalProjectsOpen += 1;
  
  doSwitchTab(numProjectsOpen);
  currProjectOpen = numProjectsOpen;
  numProjectsOpen += 1;
  
  allProjectTabs[currProjectOpen].style.display = "block";
  allProjectTabText[currProjectOpen].innerHTML = allProjectNames[currProjectOpen];
  updateTabSelect();
}

function loadWorkspace(val) {
  stateOfMouse = "free";
  currSelected = [];
  windowPos = JSON.parse(windowPosString[val]);
  tensors = JSON.parse(tensorString[val]);
  indices = JSON.parse(indexString[val]);
  
  windowWidth = viewWidth / windowPos.zoom;
  windowHeight = viewHeight / windowPos.zoom;
  if ((windowPos.x + windowWidth) > spaceWidth) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if ((windowPos.y + windowHeight) > spaceHeight) {
    windowPos.y = spaceHeight - windowHeight;
  }
  
  findOpenIndices();
  drawGrid();
  drawMinimap();
  drawTensors();
}
  
function saveWorkspace(val) {
  windowPosString[val] = JSON.stringify(windowPos);
  tensorString[val] = JSON.stringify(tensors);
  indexString[val] = JSON.stringify(indices);
}

function closeWorkspace(val) {
  if (currProjectOpen==val) {
    
  } else {
    windowPosString.splice(val,1);
    tensorString.splice(val,1);
    indexString.splice(val,1);
    allProjectNames.splice(val,1);
    
    allProjectTabs[numProjectsOpen-1].style.display = "none";
    for (var j=val; j<numProjectsOpen; j++) {
      allProjectTabText[j].innerHTML = allProjectNames[j]+".qc";
    }
    
    if (currProjectOpen > val) {
      currProjectOpen -= 1;
    }
    numProjectsOpen -= 1;
  }
  
  findOpenIndices();
  drawGrid();
  drawMinimap();
  drawTensors();
}

function doCloseTab(val) {
  closeWorkspace(val);
}

function openNamingBox(val) {
  projectNamerBox.style.display = "block";
  projectNameText.value = allProjectNames[val];
  projectNameText.focus();
  projectNameText.select();
  isProjectBoxActive = true;
  projectClicked = val;
}

function closeNamingBox() {
  projectNamerBox.style.display = "none";
  projectNameText.focus();
  projectNameText.blur();
  isProjectBoxActive = false;
}

function updateNamingBox() {
  var tempName = projectNameText.value;
  if (checkValidName(tempName)) {
    allProjectNames[projectClicked] = tempName;
    allProjectTabText[currProjectOpen].innerHTML = allProjectNames[currProjectOpen]+".qc";
  }
  closeNamingBox();
}

function startProjectDrag(evt) {
  var tempBbox = projectNamerBox.getBoundingClientRect();
  mousePosProj.x = evt.clientX - tempBbox.x;
  mousePosProj.y = evt.clientY - tempBbox.y;
  window.addEventListener("mousemove", doProjectDrag);
}

function doProjectDrag(evt) {
  projectNamerBox.style.left = evt.clientX - mousePosProj.x + "px";
  projectNamerBox.style.top = evt.clientY - mousePosProj.y + "px";
}

function stopProjectDrag(evt) {
  window.removeEventListener("mousemove", doProjectDrag);
}




