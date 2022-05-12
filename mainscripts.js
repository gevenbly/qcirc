/*
Declaration of global variables, listeners and initialization scripts
*/

var isHomeMenuOpen = true;


var mainWindow = document.getElementById("mainWindow");
// mainWindow.style.visibility = 'hidden';

// naming box parameters
var theNamebox = document.getElementById('nameBox');
theNamebox.style.width = widthNamebox + 'px';
theNamebox.style.fontSize = fontsizeNamebox + 'px';
theNamebox.addEventListener('focusout', (evt) => {
  doNameboxOut(evt);
});
theNamebox.addEventListener('focusin', (evt) => {
  doNameboxIn(evt);
});
var renameIcon = document.getElementById("renameicon");
var renameIconH = document.getElementById("renameiconH");
var isNameboxActive = false;
var xcoordNamebox = 0;
var ycoordNamebox = 0;
var widthNamebox = 100;
var fontsizeNamebox = 16;

// view window
const topMenuHeight = 68;
const leftMenuWidth = 100;

// left hand side menu          
var leftSelectedType = 0;
var selectedType = 0; // remove
var allLeftIcons = [document.getElementById("movingicon"), 
                    document.getElementById("selecticon"), 
                    document.getElementById("rectangleicon"), 
                    document.getElementById("ellipseicon"), 
                    document.getElementById("hillicon"), 
                    document.getElementById("trapezoidicon"),
                    document.getElementById("forwardicon"),
                    document.getElementById("behindicon"),
                    document.getElementById("fronticon"),
                    document.getElementById("backicon")];   

// right hand side menu 
var rightMenu = document.getElementById("rightGui");
// var rightMenuIcon = document.getElementById("openrighticon");
// var rightMenuIconB = document.getElementById("closerighticon");
var rightMenuWidthOpen = 400;
var rightMenuWidthClosed = 5;
var rightMenuWidthMin = 150;
var rightGuiIsOpen = false;
if (rightGuiIsOpen) {
  var rightMenuWidth = rightMenuWidthOpen;
  // rightMenuIcon.style.visibility = 'hidden';
  // rightMenuIconB.style.visibility = 'visible';
} else {
  var rightMenuWidth = rightMenuWidthClosed;
  // rightMenuIcon.style.visibility = 'visible';
  // rightMenuIconB.style.visibility = 'hidden';
}

var codeTextNew = "x=0\n";
codeTextNew += 'if x>1:\n '
codeTextNew += '  nui=2\n'
var codeText = document.getElementById("codeText");
var codeBox = document.getElementById("codeBox");
// var codeContainer = document.getElementById("codeContainer");
// codeWindow.setAttribute('style', 'white-space: pre;')n
// document.getElementById("codeWindow").innerHTML = "# The code environment\n";
codeText.appendChild(document.createTextNode(codeTextNew));

// console.log(document.getElementById("codeWindow").innerHTML)


var viewWidth = mainWindow.clientWidth - (leftMenuWidth + rightMenuWidth); 
var viewHeight = mainWindow.clientHeight - (topMenuHeight); 
var windowX0 = 0;
var windowY0 = 0;
var windowZoom = 2;
var windowWidth = viewWidth / windowZoom;
var windowHeight = viewHeight / windowZoom;
const spaceWidth = 2000;
const spaceHeight = 1000;

mainWindow.style.maxWidth = (spaceWidth + leftMenuWidth + rightMenuWidth) + "px";
mainWindow.style.maxHeight = (spaceHeight + topMenuHeight) + "px";

// min tensor dimensions
const minWidth = 10;
const minHeight = 10;

// variables describing network
var tensor_xcoords = [];
var tensor_ycoords = [];
var tensor_bbox = []; // [xmin, ymin, xmax, ymax, xcent, ycent]
var tensor_types = []; // 0:rect, 1:circ
var tensor_order = [];
var tensor_names = [];
var tensor_xanchors = [];
var tensor_yanchors = [];

// canvases
var canvasBase = document.getElementById("canvasHandles");
var canvasBase = document.getElementById("canvasBase");
var canvasMoving = document.getElementById("canvasMoving");
var canvasTensors = document.getElementById("canvasTensors");
var canvasBackground = document.getElementById("canvasBackground");
var ctxB = canvasBase.getContext("2d");
var ctxM = canvasMoving.getContext("2d");
var ctxT = canvasTensors.getContext("2d");
var ctxG = canvasBackground.getContext("2d");
var ctxH = canvasHandles.getContext("2d");

// styling
const circThick = 1; // line thickness of handles
const circRad = 5; // radius of handles
const rectCornerRad = 8; // rounded corner radius of rectangles
const rectBorderCol = '#969696';
const rectBorderWidth = 2;
const greyHover = '#303030'

// input config
const mainScrollSpeed = 50;

// minimap
const miniPad = 15;
const miniScale = 20;
const miniWidth = spaceWidth / miniScale;
const miniHeight = spaceHeight / miniScale;

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
showCodeElm.addEventListener('click', (event) => {
  showCode = showCodeElm.checked;
  rightGuiIsOpen = !showCode;
  toggleRightGui();
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
var handleType = 'none' // N,NE,E,SE,S,SW,W,NW
var selectBoxCoords = [0, 0, 0, 0];

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

// anchors
const anchorWidth = 10;
const anchorHeight = 10;
var numAnchorsCreated = 7;
var allAnchorColors = ['red','orange','yellow','green','blue','indigo','violet'];

// initialization
resizeCanvas();
drawGrid(); 
updateLeftSelect();

if (isHomeMenuOpen) {
  document.getElementById('sublistWindow').style.display = "none";
  document.getElementById('rightGui').style.display = "none";
  document.getElementById('leftGui').style.display = "none";
  document.getElementById('canvasWindow').style.display = "none";
}

