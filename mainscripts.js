/*
Declaration of global variables, listeners and initialization scripts
*/

// var allTheData = "";

var isDrawIndNames = true;
var isDrawTensorNums = true;

var isHomeMenuOpen = true;
var mainWindow = document.getElementById("mainWindow");

var indHandleRad = 8; //radius of index arrows 

var isOneBased = 0;
var canvasBasedNames = false;

// view window
const leftMenuWidth = 80;
const topMenuSingle = 34;
const topMenuHeight = 2*topMenuSingle;


var viewWidth = mainWindow.clientWidth - (leftMenuWidth + rightMenuWidth); 
var viewHeight = mainWindow.clientHeight - (topMenuHeight); 
var windowPos = {x: 100, y: 100, zoom: 2};
var windowWidth = viewWidth / windowPos.zoom;
var windowHeight = viewHeight / windowPos.zoom;
const spaceWidth = 4000;
const spaceHeight = 2000;

mainWindow.style.maxWidth = (spaceWidth + leftMenuWidth + rightMenuWidth) + "px";
mainWindow.style.maxHeight = (spaceHeight + topMenuHeight) + "px";

// min tensor dimensions
const minWidth = 10;
const minHeight = 10;

// variables describing network
var tensors = [];
var indices = [0];  // 0th index is null by convention
var textBoxes = [];
var openIndices = [];

// workspace initialization
windowPosString = [JSON.stringify(windowPos)];
tensorString = [JSON.stringify(tensors)];
indexString = [JSON.stringify(indices)];
textBoxesString = [JSON.stringify(textBoxes)];

// canvases
var canvasBase = document.getElementById("canvasHandles");
var canvasBase = document.getElementById("canvasBase");
var canvasMoving = document.getElementById("canvasMoving");
var canvasTensors = document.getElementById("canvasTensors");
var canvasBackground = document.getElementById("canvasBackground");
var ctxB = canvasBase.getContext("2d");
var ctxM = canvasMoving.getContext("2d");
var ctxT = canvasTensors.getContext("2d");//,{alpha: false}
var ctxG = canvasBackground.getContext("2d");
var ctxH = canvasHandles.getContext("2d");

// styling
const circRad = 5; // radius of resizing handles
const rectCornerRad = 8; // rounded corner radius of rectangles
const rectBorderCol = '#969696';
const rectBorderWidth = 2;
const greyHover = '#303030'
const trapSlope = 0.25;

// input config
const mainScrollSpeed = 50;

// minimap
const miniScale = 20;
const miniWidth = spaceWidth / miniScale;
const miniHeight = spaceHeight / miniScale;
var miniPadX = 15;
var miniPadY = viewHeight - miniHeight - 15;

// grid
const gridSpaceX = 20;
const gridSpaceY = 20;

// toggles
var gridOnElm = document.getElementById("showGrid");
var gridOn = gridOnElm.checked;
gridOnElm.addEventListener('click', (event) => {
  gridOn = gridOnElm.checked;
  drawGrid();
});    
var snapGridElm = document.getElementById("snapGrid");
var gridSnap = snapGridElm.checked;
snapGridElm.addEventListener('click', (event) => {
  gridSnap = snapGridElm.checked;
});    
var showDebugElm = document.getElementById("showDebug");
var showDebug = showDebugElm.checked;
showDebugElm.addEventListener('click', (event) => {
  showDebug = showDebugElm.checked;
  if (!showDebug) {
    ctxM.clearRect(0, 0, canvasTensors.width, canvasTensors.height);
  }
});    
var showMiniElm = document.getElementById("showMini");
var showMini = showMiniElm.checked;
showMiniElm.addEventListener('click', (event) => {
  showMini = showMiniElm.checked;
  ctxB.clearRect(0, 0, viewWidth, viewHeight);
  drawMinimap();
});    
var showCodeElm = document.getElementById("showCode");
var showCode = showCodeElm.checked;
if (showCode) {
  rightGuiIsOpen = true;
  rightMenuWidth = rightMenuWidthOpen;
  rightMenu.style.width = rightMenuWidth + "px";
  codeBox.style.display = "block";
  rightGuiResizer.style.display = "block";
}
showCodeElm.addEventListener('click', (event) => {
  showCode = showCodeElm.checked;
  rightGuiIsOpen = !showCode;
  toggleRightGui();
});    
var autoIndsElm = document.getElementById("autoInds");
var autoInds = autoIndsElm.checked;
autoIndsElm.addEventListener('click', (event) => {
  autoInds = autoIndsElm.checked;
});  
var numericalIndsElm = document.getElementById("numericalInds");
var numericalInds = numericalIndsElm.checked;
numericalIndsElm.addEventListener('click', (event) => {
  numericalInds = numericalIndsElm.checked;
  drawTensors();
});  
var showIndNamesElm = document.getElementById("showIndNames");
var showIndNames = showIndNamesElm.checked;
showIndNamesElm.addEventListener('click', (event) => {
  showIndNames = showIndNamesElm.checked;
  drawTensors();
});  

// drop menu
var menuIsOpen = false; // keep track of drop menu state
                                      
// state of mouse
var isLeftDown = false;
var isRightDown = false;
var objUnderMouse = ["none", 0, 0]; // [type, index, subindex]
const stateChoices = ['free', 'creating', 'shifting', 'scrolling', 'minishift', 'resizing', 'selecting']
var stateOfMouse = stateChoices[0];
var coordGrabbed = [0, 0];
var currGrabbed = ['none', 0, 0] // [type, index, subindex]
var currSelected = []; // list of selected tensor indexes
var currBoxSelected = []; // list of selected tensor indexes
var handleType = 'none' // N,NE,E,SE,S,SW,W,NW
var mousePos = [0,0];
var selectBox = [0,0,0,0,0,0];
var mapSelectNewOld = []; // used when duplicating selection

// key listeners
var isKeyDown = false;
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
canvasMoving.onwheel = applyZoom;

// mouse listeners
canvasMoving.addEventListener("click", onMouseClick);
canvasMoving.addEventListener("mousemove", onMouseMove);
canvasMoving.addEventListener("mousedown", onMouseDown);
canvasMoving.addEventListener("mouseup", onMouseUp);
canvasMoving.addEventListener("mouseenter", onMouseEnter);
canvasMoving.addEventListener("mouseout", onMouseOut);
canvasMoving.addEventListener('contextmenu', event => event.preventDefault());
window.addEventListener("resize", resizeCanvas, false);

// name tags for tensors
allNameTags = [];
allTextBoxTags = [];
// allNameTags.push(document.getElementById("nametag0"));

// allNameTags[0].insertAdjacentHTML("afterend","<div class='nametag' id='nametag1' style='display: block;'>T1:</div>");
// allNameTags.push(document.getElementById("nametag1"));
// console.log(allNameTags[1]);

// var tempDiv = document.createElement("div");
// tempDiv.setAttribute("id", "nametag1");
// tempDiv.setAttribute("class", "nametag");
// tempDiv.setAttribute("style", "display: none;");
// var tempNode = document.createTextNode("T1:");
// tempDiv.appendChild(tempNode);
// document.getElementById("canvasWindow").appendChild(tempDiv);
// allNameTags.push(document.getElementById("nametag1"));
// console.log(allNameTags[0])
// console.log(allNameTags[1])


// anchors
const anchorWidth = 11;
const anchorHeight = 11;
const openIndexRadius = 6;
var anchorTolerance = 2; // tolerance on closeness when selecting
var numAnchorsCreated = 4;
var allAnchorColors = ['red','darkorange','gold','seagreen','royalblue','rebeccapurple','violet'];
for (var j=0; j<7; j++) {
  allAnchorColors[j] = colourNameToHex(allAnchorColors[j]);
  allAnchorColors.push(lightenColor(allAnchorColors[j],-18));
}

// initialization

drawGrid(); 
updateLeftSelect();
resizeCanvas();
// setTimeout(resizeCanvas(), 100);
// setTimeout(resizeCanvas, 100);

if (isHomeMenuOpen) {
  document.getElementById('sublistWindow').style.display = "none";
  document.getElementById('rightGui').style.display = "none";
  document.getElementById('leftGui').style.display = "none";
  document.getElementById('canvasWindow').style.display = "none";
  document.getElementById('rightGuiResizer').style.display = "none";
}

// MathJax.typeset();
// mainBoxData.commentjax = commentBox.innerHTML;







