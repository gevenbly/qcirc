/*
functions that resolve keyboard events 
*/

function onKeyDown(evt) {
  var pos = getAbsMousePos(canvasBase, evt);
  
  if (isInfoBoxActive) {
    if (event.keyCode == 13) {// enter
      if (document.activeElement.className == "indNamerBox") {
        // prevent creating newline
        evt.preventDefault();
        evt.stopPropagation();
        document.activeElement.blur();
      } else if (document.activeElement.className == "indNumberBox") {
        document.activeElement.blur();
      }
    }
    return;
  }
  
  // commentBox

  if (document.activeElement==document.getElementById("codeText")) {
    // prevent scrolling out of codebox
    if(event.keyCode == 40 || event.keyCode == 39) {
      var locTemp = Cursor.getPositionStart(codeText);
      var locMax = codeText.innerText.length;
      if (locMax - locTemp < 2) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
    return;
  }

  if (isProjectBoxActive) {
    if (event.keyCode == 27) {
      //esc
      closeNamingBox();
    } else if (event.keyCode == 13) {
      //enter
      updateNamingBox();
      closeNamingBox();
    }
    return;
  }

  if (contextIsUp) {
    return;
  }

  if (isNameboxActive) {
    if (event.keyCode == 13 || event.keyCode == 27) {
      // enter or escape
      doNameboxOut(evt);
    }
    drawTensors();
    return;
  }

  if (isHomeMenuOpen) {
    return;
  }

  

  if (event.keyCode == 46) {
    // delete tensor
    if (currSelected.length > 0) {
      currSelected = new Uint32Array(currSelected);
      currSelected.sort().reverse();
      for (var i = 0; i < currSelected.length; i++) {
        deleteMiddleTensor(currSelected[i]);
      }
      currSelected = [];
    }
    if (currBoxSelected.length > 0) {
      currBoxSelected = new Uint32Array(currBoxSelected);
      currBoxSelected.sort().reverse();
      for (var i = 0; i < currBoxSelected.length; i++) {
        deleteMiddleBox(currBoxSelected[i]);
      }
      currSelected = [];
    }
  } else if (event.keyCode == 67) {
    // conjugation 'c'
    for (var j=0; j<currSelected.length; j++){
      tensors[currSelected[j]].conj = !tensors[currSelected[j]].conj;
    }
    updateTensorTags();
  }
  
  if (event.keyCode == 192) {// `
    mainBoxData.commentjax = "";
    mainBoxData.codeprism = "";
    for (var j=0; j<textBoxes.length; j++) {
      textBoxes[j].commentjax = "";
      textBoxes[j].codeprism = "";
    }
    var clipData = {tensors: tensors, 
                    indices: indices,
                    textBoxes: textBoxes,
                    mainBoxData: mainBoxData,
                    indexConfigs: indexConfigs,
                    numUniqueInds: numUniqueInds,
                    windowPos: windowPos
                   };
    allTheData = JSON.stringify(clipData);
    console.log(JSON.stringify(allTheData)); 
  }
  
  if (event.keyCode == 33) {// pageup
    stateOfMouse = "free";
    currSelected = [];
    currBoxSelected = [];
    
    var clipData = JSON.parse(allTheData);
    tensors = clipData.tensors;
    indices = clipData.indices;
    textBoxes = clipData.textBoxes;
    mainBoxData = clipData.mainBoxData;
    indexConfigs = clipData.indexConfigs;
    numUniqueInds = clipData.numUniqueInds;
    windowPos = clipData.windowPos;

    windowWidth = viewWidth / windowPos.zoom;
    windowHeight = viewHeight / windowPos.zoom;
    if ((windowPos.x + windowWidth) > spaceWidth) {
      windowPos.x = spaceWidth - windowWidth;
    }
    if ((windowPos.y + windowHeight) > spaceHeight) {
      windowPos.y = spaceHeight - windowHeight;
    }
    
    for (var j=1; j<14; j++) {
      if (j <= textBoxes.length) {
        collectionComment[j].style.display = 'inline-block';
      } else {
        collectionComment[j].style.display = 'none';
      }
    }
    

    updateTensorTags();
    updateTextBoxTags();
    findOpenIndices();
    drawGrid();
    drawMinimap();
    drawTensors();
  }
  
  if (event.keyCode == 37) {
    // left arrow
    windowPos.x -= mainScrollSpeed;
    if (windowPos.x < 0) {
      windowPos.x = 0;
    }
  } else if (event.keyCode == 39) {
    // right arrow
    windowPos.x += mainScrollSpeed;
    if (windowPos.x > spaceWidth - windowWidth) {
      windowPos.x = spaceWidth - windowWidth;
    }
  } else if (event.keyCode == 38) {
    // up arrow
    windowPos.y -= mainScrollSpeed;
    if (windowPos.y < 0) {
      windowPos.y = 0;
    }
  } else if (event.keyCode == 40) {
    // down arrow
    windowPos.y += mainScrollSpeed;
    if (windowPos.y > spaceHeight - windowHeight) {
      windowPos.y = spaceHeight - windowHeight;
    }
  } else if (event.keyCode == 80) {
    // p key
    console.log(tensors);
    console.log(indices);
    console.log(openIndices);
  } else if (event.keyCode == 191) {//?
    canvasBasedNames = !canvasBasedNames;
    if (canvasBasedNames) { 
      for (var jnd = 0; jnd < allNameTags.length; jnd++) {
        allNameTags[jnd].remove();
      }
      allNameTags = [];
    } else {
      updateTensorTags();
    }
  }

  drawMinimap();
  drawGrid();
  drawTensors();
  console.log(event.keyCode);
  
//   if (event.keyCode == 9) {//tab key
//     // prevent tab from switching window focus
//     evt.preventDefault();
//     evt.stopPropagation();
    
//     // insert two space in correct place
//     var doc = codeText.ownerDocument.defaultView;
//     var sel = doc.getSelection();
//     var range = sel.getRangeAt(0);
//     var tabNode = document.createTextNode("\u00a0\u00a0");
//     range.insertNode(tabNode);

//     range.setStartAfter(tabNode);
//     range.setEndAfter(tabNode); 
//     sel.removeAllRanges();
//     sel.addRange(range);
    
//     console.log(document.activeElement)
//   }
  
  
}

function onKeyUp(evt) {
//   if(event.keyCode == 13) {// enter
//     var cloc = Cursor.getCurrentCursorPosition(codeText);
//     Prism.highlightAll();
//     Cursor.setCurrentCursorPosition(cloc, codeText);
//   }
  
//   if(event.keyCode == 8) {// backspace
//     var cloc = Cursor.getCurrentCursorPosition(codeText);
//     Prism.highlightAll();
//     Cursor.setCurrentCursorPosition(cloc, codeText);
//   }
}
