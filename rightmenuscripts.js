function toggleRightGui() {
  if (rightGuiIsOpen) {
    rightGuiIsOpen = false;
    rightMenuWidth = rightMenuWidthClosed;
    rightMenu.style.width = rightMenuWidth+'px';
    // codeBox.style.width = (rightMenuWidth-10)+'px';
    // codeContainer.style.width = (rightMenuWidth-10)+'px';
    // codeContainer.style.width = (rightMenuWidth-10)+'px';
    // rightMenuIcon.style.visibility = 'visible';
    // rightMenuIconB.style.visibility = 'hidden';
    codeBox.style.display = "none";
    rightGuiHandle.style.display = "none";
    // codeContainer.style.display = "none";
    
    // codeBox.style.display = "none";
    resizeCanvas();
  } else {
    rightGuiIsOpen = true;
    rightMenuWidth = rightMenuWidthOpen;
    rightMenu.style.width = rightMenuWidth+'px';
    // rightMenuIcon.style.visibility = 'hidden';
    // rightMenuIconB.style.visibility = 'visible';
    // 
    
    codeBox.style.display = "block";
    rightGuiHandle.style.display = "block";
    // codeContainer.style.display = "block";
    // codeContainer.style.width = (rightMenuWidth-10)+'px';
    // codeContainer.style.display = "block";
    // codeContainer.style.height = viewHeight+'px';
    // codeBox.style.height = viewHeight+'px';
    resizeCanvas();
  }
}

function toggleTitle() {
  if (isHomeMenuOpen) {
    isHomeMenuOpen = false;
    
    document.getElementById('sublistWindow').style.display = "block";
    document.getElementById('rightGui').style.display = "block";
    document.getElementById('leftGui').style.display = "block";
    document.getElementById('canvasWindow').style.display = "block";
    document.getElementById('titleWindow').style.display = "none";
  }
}

// Query the element
var rightGuiHandle = document.getElementById('rightGuiResizer');

// The current position of mouse
let x = 0;
let y = 0;

// The dimension of the element
let w = 0;
let h = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;

    // Calculate the dimension of element
    const styles = window.getComputedStyle(rightGuiHandle);
    w = parseInt(styles.width, 10);
    h = parseInt(styles.height, 10);

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Adjust the dimension of element
    // rightGuiHandle.style.width = `${w + dx}px`;
    // rightGuiHandle.style.height = `${h + dy}px`;
   x = e.clientX;
  y = e.clientY;
    rightMenuWidthOpen -= dx;
  rightMenuWidth = rightMenuWidthOpen;
    rightMenu.style.width = rightMenuWidth+'px';
    // codeBox.style.width = (rightMenuWidth-10)+'px';
  
    // codeContainer.style.width = (rightMenuWidth-10)+'px';
  // codeBox.style.width = (rightMenuWidth-10)+'px';
  // codeBox.style.w = (rightMenuWidth-10)+'px';
  
  resizeCanvas() 
    
};

const mouseUpHandler = function () {
  if (rightMenuWidth < rightMenuWidthMin) {
    rightMenuWidth = rightMenuWidthMin;
    rightMenuWidthOpen = rightMenuWidthMin;
    showCodeElm.checked = false;
    toggleRightGui();
  }
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

rightGuiHandle.addEventListener('mousedown', mouseDownHandler);
