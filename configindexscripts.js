// initialization
var infoBox = document.getElementById("infoBox");
var infoGrabber = document.getElementById("infoGrabber");
var numUniqueInds = 3; // number of configured inds
var isInfoBoxActive = false; // keep track if window is open
var tempIndDim = 0; // temp storage for number box
var theOpenSelector = ""; // temp storage for open index box
var mousePosInfo = {x: 0, y: 0}; // storage used when box dragging
var indLeftNameBox = document.getElementById("indLeftNameBox");
var mainIndPreview = document.getElementById("previewsvg");
var currIndTypeSelected = 0;

// listeners
// window.addEventListener('keydown', onKeyDown);

// var indNamerContents = ["chi","beta",'m','D','d'] // stroage for index names
var indColorList = ["AntiqueWhite", "Aquamarine", "CornflowerBlue", "Coral", "Gold", "FireBrick", "LimeGreen"]
var indStyleSet = {
  Solid: "none",
  Dot: "2,2",
  Dash: "4,2",
  DashDot: "4,2,2,2"
}
  
// set up unicode for greek letters
var greekLetterNames = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'kappa', 'lambda', 'mu', 'nu', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];
var greekLetterCodes = ["&#x03B1", "&#x03B2", "&#x03B3", "&#x03B4", "&#x03B5", "&#x03B6", "&#x03B7", "&#x03B8", "&#x03BA", "&#x03BB", "&#x03BC", "&#x03BD", "&#x03C0", "&#x03C1", "&#x03C3", "&#x03C4", "&#x03C5", "&#x03C6", "&#x03C7", "&#x03C8", "&#x03C9"];

// configure initial index settings
var indexConfigs = [];
tempIndex = {
  plainName: "chi",
  codeName: "&#x03C7",
  dim: 2,
  color: "AntiqueWhite",
  weight: 2,
  style: "Solid"
};
indexConfigs.push(tempIndex);
tempIndex = {
  plainName: "beta",
  codeName: "&#x03B2",
  dim: 4,
  color: "Gold",
  weight: 2,
  style: "Dash"
};
indexConfigs.push(tempIndex);
tempIndex = {
  plainName: "zeta",
  codeName: "&#x03B6",
  dim: 10,
  color: "CornflowerBlue",
  weight: 1,
  style: "Dot"
};
indexConfigs.push(tempIndex);
tempIndex = {
  plainName: "m",
  codeName: "m",
  dim: 2,
  color: "Coral",
  weight: 3,
  style: "DashDot"
};
indexConfigs.push(tempIndex);
tempIndex = {
  plainName: "d",
  codeName: "d",
  dim: 2,
  color: "Aquamarine",
  weight: 4,
  style: "Solid"
};
indexConfigs.push(tempIndex);

// Initialize main window index preview
function doIndTypeSelect(val) {
  indLeftNameBox.innerHTML = indexConfigs[val].codeName;
  mainIndPreview.setAttribute("stroke", indexConfigs[val].color);
  mainIndPreview.setAttribute("stroke-width", indexConfigs[val].weight.toString());
  mainIndPreview.setAttribute("stroke-dasharray", indStyleSet[indexConfigs[val].style]);
}
doIndTypeSelect(currIndTypeSelected);

function doIndTypeSelectMinus() {
  if (currIndTypeSelected==0) {
    currIndTypeSelected = numUniqueInds-1;
  } else {
    currIndTypeSelected -= 1;
  }
  doIndTypeSelect(currIndTypeSelected);
}

function doIndTypeSelectPlus() {
  if (currIndTypeSelected==(numUniqueInds-1)) {
    currIndTypeSelected = 0;
  } else {
    currIndTypeSelected += 1;
  }
  doIndTypeSelect(currIndTypeSelected);
}

function initializeInfoBox() {
  for (var j=0; j<5; j++) {
    var tempNameBox = document.getElementById("indNamerBox"+j);
    tempNameBox.innerHTML = indexConfigs[j].codeName;
    
    var tempNumBox = document.getElementById("indNumberBox"+j);
    tempNumBox.value = indexConfigs[j].dim;
    
    var tempColBox = document.getElementById("selectorContent"+j+"A") 
    var tempColPar = tempColBox.parentElement.children[0]; 
    tempColPar.style.backgroundColor = indexConfigs[j].color;
    
    var tempWeightBox = document.getElementById("selectorContent"+j+"B") 
    var tempWeightPar = tempWeightBox.parentElement.children[0]; 
    tempWeightPar.innerText = indexConfigs[j].weight + 'px';
    
    var tempStyleBox = document.getElementById("selectorContent"+j+"C") 
    var tempStylePar = tempStyleBox.parentElement.children[0]; 
    tempStylePar.innerText = indexConfigs[j].style;
  }
  
  updateIndConfigBox();
  updateAllPreviewIcons();
}

function updateAllPreviewIcons() {
  for (var j=0; j<5; j++) {
    var tempicon = document.getElementById("previewicon"+j);
    tempicon.setAttribute("stroke", indexConfigs[j].color);
    tempicon.setAttribute("stroke-width", indexConfigs[j].weight.toString());
    tempicon.setAttribute("stroke-dasharray", indStyleSet[indexConfigs[j].style]);
  }
}

// open, close and drag info box
function openInfoBox() {
  infoBox = document.getElementById("infoBox");
  infoGrabber = document.getElementById("infoGrabber")
  infoGrabber.addEventListener("mousedown", startInfoDrag);
  infoGrabber.addEventListener("mouseup", stopInfoDrag); 
  initializeInfoBox();
  infoBox.style.display = "block";
  window.addEventListener("click", listForOutsideClicks(event));
}

function listForOutsideClicks(event) {
  if (!event.target.matches('.selectorCustomized')) {
    var tempSelectors = document.getElementsByClassName("selectorContent");
    for (var j=0; j<tempSelectors.length; j++) {
      tempSelectors[j].style.display = 'none';
    }
  }
}

function closeInfoBox() {
  infoGrabber.removeEventListener("mousedown", startInfoDrag);
  infoGrabber.removeEventListener("mouseup", stopInfoDrag); 
  infoBox.style.display = "none";
  isInfoBoxActive = false;
  window.removeEventListener("click", listForOutsideClicks(event));
  doIndTypeSelect(currIndTypeSelected)
  // console.log(indexConfigs)
}

function startInfoDrag(evt) {
  var tempBbox = infoBox.getBoundingClientRect();
  mousePosInfo.x = evt.clientX - tempBbox.x;
  mousePosInfo.y = evt.clientY - tempBbox.y;
  window.addEventListener("mousemove", doInfoDrag);
}

function doInfoDrag(evt) {
  infoBox.style.left = evt.clientX - mousePosInfo.x + "px";
  infoBox.style.top = evt.clientY - mousePosInfo.y + "px";
}

function stopInfoDrag(evt) {
  window.removeEventListener("mousemove", doInfoDrag);
}

// defocus text input box on press enter
// function onKeyDown(evt) {
//   if (isInfoBoxActive) {
//     if (event.keyCode == 13) {// enter
//       if (document.activeElement.className == "indNamerBox") {
//         // prevent creating newline
//         evt.preventDefault();
//         evt.stopPropagation();
//         document.activeElement.blur();
//       } else if (document.activeElement.className == "indNumberBox") {
//         document.activeElement.blur();
//       }
//     }
//   }
// }

// accept only int input to dim box
function storePreviousNumberBox() {
  tempIndDim = document.activeElement.value;
}

function checkNumberBox(val) {
  var tempBox = document.getElementById("indNumberBox"+val);
  if (!(/^\d+$/.test(tempBox.value))) {
    tempBox.value = tempIndDim;
  }
}

// check valid index names, render as greek letters if applicable
function retrieveIndName(val) {
  document.getElementById("indNamerBox"+val).innerText = indexConfigs[val].plainName;
}

function renderIndName(val) {
  var tempBox = document.getElementById("indNamerBox"+val);
  if (checkIndexName(tempBox.innerText)) {
    indexConfigs[val].plainName = tempBox.innerText;
    tempBox.innerHTML = tempBox.innerText;
    for (var j=0; j<greekLetterNames.length; j++) {
      if (tempBox.innerText==greekLetterNames[j]) {
        tempBox.innerHTML = greekLetterCodes[j];
        break;
      }
    }
    // indexConfigs[val].plainName = tempBox.innerText;
    indexConfigs[val].codeName = tempBox.innerHTML;
  } else {
    tempBox.innerHTML = indexConfigs[val].plainName;
  }
  // console.log()
}

function checkIndexName(inputtxt) { 
  var validLetters = /^[_0-9a-zA-Z]+$/;
  if (validLetters.test(inputtxt)) { 
    var validStarts = /^[_a-zA-Z]+$/;
    if (validStarts.test(inputtxt.charAt(0))) {
      return true;
    } 
  }
  return false;
}

// close selectors if click outside window
// window.addEventListener("click", function() {
//     if (!event.target.matches('.selectorCustomized')) {
//     var tempSelectors = document.getElementsByClassName("selectorContent");
//     for (var j=0; j<tempSelectors.length; j++) {
//       tempSelectors[j].style.display = 'none';
//     }
//   }
// });

// handle selector inputs
function clickedOnSelector(name) {
  if ((typeof theOpenSelector) == 'object') {
    theOpenSelector.style.display = 'none';
  }
  theOpenSelector = document.getElementById(name);
  theOpenSelector.style.width = theOpenSelector.parentElement.children[0].style.width;
  document.getElementById(name).style.display = 'block';
}

function closeSelector(name) {
  document.getElementById(name).style.display = 'none';
}

function selectOption(box, type, val) {
  var tempBox = theOpenSelector.parentElement.children[0]; 
  tempBox.style.backgroundColor = theOpenSelector.children[val].style.backgroundColor;
  indexConfigs[box].color = theOpenSelector.children[val].style.backgroundColor;
  theOpenSelector.style.display = 'none';
  theOpenSelector = "";
  updatePreviewIcon(box, type, val);
}

function selectOptionB(box, type, val) {
  var tempBox = theOpenSelector.parentElement.children[0]; 
  tempBox.innerText = theOpenSelector.children[val].innerText;
  indexConfigs[box].weight = parseInt(theOpenSelector.children[val].innerText);
  theOpenSelector.style.display = 'none';
  theOpenSelector = "";
  
  updatePreviewIcon(box, type, val);
}

function selectOptionC(box, type, val) {
  var tempBox = theOpenSelector.parentElement.children[0]; 
  tempBox.innerText = theOpenSelector.children[val].innerText;
  indexConfigs[box].style = theOpenSelector.children[val].innerText;
  theOpenSelector.style.display = 'none';
  theOpenSelector = "";
  updatePreviewIcon(box, type, val);
}

function updatePreviewIcon(box, type, val) {
  var tempicon = document.getElementById("previewicon"+box);
  if (type==1) {
    tempicon.setAttribute("stroke-width", (val+1).toString());
  } else if (type==0) {
    tempicon.setAttribute("stroke", indColorList[val]);
    // tempicon.setAttribute("stroke", "blue");
  } else if (type==2) {
    if (val==0) {
      tempicon.setAttribute("stroke-dasharray", "none");
    } else if (val==1) {
      tempicon.setAttribute("stroke-dasharray", "2,2");
    } else if (val==2) {
      tempicon.setAttribute("stroke-dasharray", "4,2");
    } else if (val==3) {
      tempicon.setAttribute("stroke-dasharray", "4,2,2,2");
    }
  }
}

// add/remove new index types
function addIndType() {
  if (numUniqueInds<5) {
    numUniqueInds += 1;
    updateIndConfigBox()
  }
}

function removeIndType() {
  if (numUniqueInds>1) {
    numUniqueInds -= 1;
    updateIndConfigBox()
    for (var j=1; j<indices.length; j++) {
      if (indices[j].type >= numUniqueInds) {
        indices[j].type -= 1;
      }
    }
  }
}

function updateIndConfigBox() {
  for (var j=0; j<5; j++) {
    var containerCollection = document.getElementsByClassName("indexConfigContainer");
    if (j<numUniqueInds) {
      containerCollection[j].style.display = 'block';
    } else {
      containerCollection[j].style.display = 'none';
    }
  }
}

