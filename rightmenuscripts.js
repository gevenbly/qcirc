// html elements and listeners
const rightMenu = document.getElementById("rightGui");
const rightGuiResizer = document.getElementById("rightGuiResizer");
rightGuiResizer.addEventListener("mousedown", mouseDownRight);

// consts and variables
const rightMenuWidthClosed = 5;
const rightMenuWidthMin = 150;
let rightGuiIsOpen = false;
let rightMenuWidthOpen = 400;
let rightMenuWidth = rightMenuWidthClosed;
let rightGrabX = 0;

// functions
function toggleRightGui() {
  if (rightGuiIsOpen) {
    // close right menu
    rightGuiIsOpen = false;
    rightMenuWidth = rightMenuWidthClosed;

    rightMenu.style.width = rightMenuWidth + "px";
    codeBox.style.display = "none";
    rightGuiResizer.style.display = "none";

    resizeCanvas();
  } else {
    // open right menu
    rightGuiIsOpen = true;
    rightMenuWidth = rightMenuWidthOpen;

    rightMenu.style.width = rightMenuWidth + "px";
    codeBox.style.display = "block";
    rightGuiResizer.style.display = "block";

    resizeCanvas();
  }
}

function mouseDownRight(evt) {
  rightGrabX = evt.clientX;
  document.addEventListener("mousemove", mouseMoveRight);
  document.addEventListener("mouseup", mouseUpRight);
};

function mouseMoveRight(evt) {
  const dx = evt.clientX - rightGrabX;
  rightGrabX = evt.clientX;
  
  rightMenuWidthOpen -= dx;
  rightMenuWidth = rightMenuWidthOpen;
  rightMenu.style.width = rightMenuWidth + "px";
  resizeCanvas();
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


