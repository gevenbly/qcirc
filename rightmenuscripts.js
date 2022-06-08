// html elements and listeners
const rightMenu = document.getElementById("rightGui");
const rightGuiResizer = document.getElementById("rightGuiResizer");
const rightGuiExpander = document.getElementById("rightGuiExpander");
const rightCommentBox = document.getElementById("commentBox");
const rightCommentTitle = document.getElementById("containCommentTitle");
const rightGuiMidResizer = document.getElementById("rightGuiMidResizer");
const rightCodeBox = document.getElementById("codeBox");
const rightButtonContainer = document.getElementById("rightButtonContainer");

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
let rightCommentHeight = 200;
rightCommentBox.style.setProperty('height', rightCommentHeight + "px");


// console.log(rightCommentTitle)
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
  selectTextBox(val);
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
    rightCommentTitle.style.width = rightMenuWidth -100 + "px";

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
    rightCommentBox.style.setProperty('height', rightCommentHeight + "px");
    rightCommentBox.blur();
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



