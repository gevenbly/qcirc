/*
functions that resolve keyboard events 
*/

function onKeyDown(evt) {
  var pos = getAbsMousePos(canvasBase, evt);
  if (isNameboxActive) {
    if ((event.keyCode == 13) || (event.keyCode == 27)) { // enter or escape
       doNameboxOut(evt);
    }
  } else {
    if(event.keyCode == 37) { // left arrow
      windowX0 -= mainScrollSpeed;
      if (windowX0 < 0) {
        windowX0 = 0;
      }
    } else if(event.keyCode == 39) { // right arrow
      windowX0 += mainScrollSpeed;
      if (windowX0 > (spaceWidth - windowWidth)) {
        windowX0 = spaceWidth - windowWidth;
      }
    } else if(event.keyCode == 38) { // up arrow
      windowY0 -= mainScrollSpeed;
      if (windowY0 < 0) {
        windowY0 = 0;
      }
    } else if(event.keyCode == 40) { // down arrow
      windowY0 += mainScrollSpeed;
      if (windowY0 > (spaceHeight - windowHeight)) {
        windowY0 = spaceHeight - windowHeight;
      }
    } else if(event.keyCode == 82) { // r key
      // theNamebox.focus(evt);
    }
    // console.log(event.keyCode)
    drawMinimap();
    drawGrid();
    drawTensors(); 
  }
  console.log(event.keyCode)
}


function onKeyUp(evt) {
 
}

