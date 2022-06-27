// html elements and listeners
const rightMenu = document.getElementById("rightGui");
const rightGuiResizer = document.getElementById("rightGuiResizer");
const rightGuiExpander = document.getElementById("rightGuiExpander");
const rightCommentTitle = document.getElementById("containCommentTitle");
const rightGuiMidResizer = document.getElementById("rightGuiMidResizer");
const rightCodeBox = document.getElementById("codeBox");
const rightButtonContainer = document.getElementById("rightButtonContainer");
const collectionComment = document.getElementsByClassName("commentTitle");

const commentBox = document.getElementById("commentBox");
const commentBoxStatic = document.getElementById("commentBoxStatic");
const commentBoxEdit = document.getElementById("commentBoxEdit");
collectionComment[0].style.backgroundColor = '#222';
collectionComment[0].style.border = '1px white solid';

rightGuiResizer.addEventListener("mousedown", mouseDownRight);
rightGuiExpander.addEventListener("mousedown", mouseDownRightExpand);
rightGuiMidResizer.addEventListener("mousedown", mouseDownRightMid);

// consts and variables
const rightMenuWidthClosed = 5;
const rightMenuWidthMin = 150;
const rightMenuWidthMax = 150;
let rightGuiIsOpen = false;
let rightMenuWidthOpen = 400;
let rightMenuWidth = rightMenuWidthClosed;
let rightGrabX = 0;
let rightGrabY = 0;
let rightCommentHeight = 400;
var whichBoxActive = -1;

// adjust window to correct height
commentBox.style.setProperty('height', rightCommentHeight + "px");
commentBoxStatic.style.setProperty('height', rightCommentHeight + "px");

function showRightEdit() {
  commentBoxEdit.style.display = 'block';
}

function hideRightEdit() {
  commentBoxEdit.style.display = 'none';
}

function updateCommentBoxTitles() {
  var numTextBoxes = textBoxes.length;
  for (var j=1; j<collectionComment.length; j++) {
    if (j<=numTextBoxes) {
      collectionComment[j].style.display = 'inline-block';
    } else {
      collectionComment[j].style.display = 'none';
    }
  }
}

// functions
function doRightSelect(val) {
  if (whichBoxActive != val) {
    selectTextBox(val);
  }
}

function doRightUnselect() {
  for (var j=0; j<=textBoxes.length; j++) {
    if (j==(whichBoxActive+1)) {
      collectionComment[j].style.border = '1px white solid';
      if (j==0) {
        collectionComment[j].style.backgroundColor = '#222';
      } else {
        collectionComment[j].style.backgroundColor = leftColorTypes[textBoxes[j-1].color + 15];
      }
    } else {
      collectionComment[j].style.border = '1px black solid';
      if (j==0) {
        collectionComment[j].style.backgroundColor = '#222';
      } else {
        collectionComment[j].style.backgroundColor = leftColorTypes[textBoxes[j-1].color + 15];
      }
    }
  }
}

function doRightHover(val) {
  if (val>=0) {
    // snapWindowTo(textBoxes[val].bbox[4], textBoxes[val].bbox[5]);
    drawMinimap();
    drawGrid(); 
    drawTensors();
  }
  doRightUnselect();
  if (val>=0) {
    collectionComment[val+1].style.backgroundColor = leftColorTypes[textBoxes[val].color + 5];
  } else {
    collectionComment[val+1].style.backgroundColor = '#333';
  }
}

function toggleRightGui() {
  if (rightGuiIsOpen) {
    // close right menu
    rightGuiIsOpen = false;
    rightMenuWidth = rightMenuWidthClosed;

    rightMenu.style.width = rightMenuWidth + "px";
    codeBox.style.display = "none";
    rightGuiResizer.style.display = "none";
    rightGuiExpander.style.display = "block";
    rightCommentTitle.style.display = "none";

    resizeCanvas();
  } else {
    // open right menu
    rightGuiIsOpen = true;
    rightMenuWidth = rightMenuWidthOpen;

    rightMenu.style.width = rightMenuWidth + "px";
    codeBox.style.display = "block";
    rightGuiResizer.style.display = "block";
    rightGuiResizer.style.left = leftMenuWidth + viewWidth + "px";
    rightGuiExpander.style.display = "none";
    rightCommentTitle.style.display = "block";
    rightCommentTitle.style.width = rightMenuWidth -13 + "px";

    resizeCanvas();
  }
}

function mouseDownRight(evt) {
  rightGrabX = evt.clientX;
  document.addEventListener("mousemove", mouseMoveRight);
  document.addEventListener("mouseup", mouseUpRight);
};

function mouseDownRightMid(evt) {
  rightGrabY = evt.clientY;
  document.addEventListener("mousemove", mouseMoveRightMid);
  document.addEventListener("mouseup", mouseUpRightMid);
};

function mouseMoveRight(evt) {
  const dx = evt.clientX - rightGrabX;
  if ((rightMenuWidthOpen-dx >= 10) && (rightMenu.getBoundingClientRect().left+dx >= 80)) {
    rightGrabX = evt.clientX;
    rightMenuWidthOpen -= dx;
    rightMenuWidth = rightMenuWidthOpen;
    rightMenu.style.width = rightMenuWidth + "px";
    resizeCanvas();
  }
};

function mouseMoveRightMid(evt) {
  const dy = evt.clientY - rightGrabY;
  rightGrabY = evt.clientY;
  
  var oldHeight = parseInt(rightCodeBox.style.height);
  if ((rightCommentHeight + dy >= 0) && (oldHeight - dy >= 0)) {
    rightCommentHeight += dy;
    rightCodeBox.style.setProperty('height', oldHeight - dy + "px");
    commentBox.style.setProperty('height', rightCommentHeight + "px");
    commentBox.blur();
    commentBoxStatic.style.setProperty('height', rightCommentHeight + "px");
    commentBoxStatic.blur();
    document.getSelection().removeAllRanges()
  }
};

function mouseUpRight() {
  if (rightMenuWidth < rightMenuWidthMin) {
    rightMenuWidth = rightMenuWidthMin;
    rightMenuWidthOpen = rightMenuWidthMin;
    showCodeElm.checked = false;
    toggleRightGui();
  }
  document.removeEventListener("mousemove", mouseMoveRight);
  document.removeEventListener("mouseup", mouseUpRight);
};

function mouseUpRightMid() {
  document.removeEventListener("mousemove", mouseMoveRightMid);
  document.removeEventListener("mouseup", mouseUpRightMid);
};

function mouseDownRightExpand() {
  showCodeElm.checked = true;
  toggleRightGui();
}






