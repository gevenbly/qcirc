/*
functions that resolve keyboard events 
*/

function onKeyDown(evt) {
  var pos = getAbsMousePos(canvasBase, evt);
  
  if (isProjectBoxActive) {
    if (event.keyCode == 27) {//esc
      closeNamingBox();
    } else if (event.keyCode == 13) {//enter
      updateNamingBox();
      closeNamingBox();
    }
    return;
  }
  
  if (contextIsUp) {
    return;
  }
  
  if (isNameboxActive) {
    if ((event.keyCode == 13) || (event.keyCode == 27)) { // enter or escape
       doNameboxOut(evt);
    }
    return;
  }
  
  if (isHomeMenuOpen) {
    return;
  }
  
  
  
    if(event.keyCode == 46) { // delete tensor
      if (currSelected.length > 0) {
        currSelected = new Uint32Array(currSelected);
        currSelected.sort().reverse();
        for (var i=0; i<currSelected.length; i++) {
          deleteMiddleTensor(currSelected[i]);
        }
        currSelected = [];
      }
    } else if(event.keyCode == 67) { // 'c' append to code
      // var xtemp = Prism.highlight(codeTextNew, Prism.languages.python);
      codeText.appendChild(document.createTextNode(codeTextNew));
      Prism.highlightAll();
      // codeText += xtemp
      // Prism.highlight(codeText, Prism.languages.python);
      // var Prism = require('prismjs');
      // codeText.innerHTML = Prism.highlight(codeTextNew, Prism.languages.python);
      // codeText.innerHTML = codeTextNew;
      // document.getElementById("codeWindow").innerHTML = "# The code environment\n";
      // location.reload();
    }
    
    if(event.keyCode == 37) { // left arrow
      windowPos.x -= mainScrollSpeed;
      if (windowPos.x < 0) {
        windowPos.x = 0;
      }
    } else if(event.keyCode == 39) { // right arrow
      windowPos.x += mainScrollSpeed;
      if (windowPos.x > (spaceWidth - windowWidth)) {
        windowPos.x = spaceWidth - windowWidth;
      }
    } else if(event.keyCode == 38) { // up arrow
      windowPos.y -= mainScrollSpeed;
      if (windowPos.y < 0) {
        windowPos.y = 0;
      }
    } else if(event.keyCode == 40) { // down arrow
      windowPos.y += mainScrollSpeed;
      if (windowPos.y > (spaceHeight - windowHeight)) {
        windowPos.y = spaceHeight - windowHeight;
      }
    } else if(event.keyCode == 82) { // r key
      // theNamebox.focus(evt);
    } else if(event.keyCode == 70) { // f key
      console.log(tensors);
      console.log(indices);
      console.log(openIndices);
      // console.log(tensorGroups);
    } else if(event.keyCode == 71) { // g key
      // copySelection();
      // makeTensorGroups();
      reassignAllGroupIndices();
    } else if (event.keyCode == 72) { // h key
      roundAllCoords();
      var x = JSON.stringify(tensors);
      console.log(x);
      var y = JSON.stringify(indices);
      console.log(y);
      // var y = JSON.parse(x);
      // console.log(y);
    } else if (event.keyCode == 74) { // j
      snapAllAnchors();
    } else if (event.keyCode == 78) { // n
      doSwitchTab(currProjectOpen+1);
      currProjectOpen = numProjectsOpen;
      numProjectsOpen += 1;
      allProjectTabs[currProjectOpen].style.display = "block";
      updateTabSelect();
      // allProjectTabs[0].style.backgroundColor = "black";
      // allProjectTabs[currProjectOpen].style.backgroundColor = "#474747";
    } else if (event.keyCode == 66) { // b
      var clipData = bufferSelection();
      
      download(clipData, allProjectNames[currProjectOpen], "qc") 
      
//       console.log(clipData)
      
//       unpackBufferSelection(clipData);
//       shiftSelectBoxWindow();
    // } else if (event.keyCode == 77) {//m
    //   doFileOpen();
    } else if (event.keyCode == 83) {
      localStorage["data"] = JSON.stringify(tensors);
    } else if (event.keyCode == 76) {//l
      console.log(tensors)
      tensors = JSON.parse(localStorage["data"]);
      
    } else if (event.keyCode == 81) {
      var infoWindow=window.open('');
      infoWindow.document.write("<div id='hello'>hey<div>");
    } else if (event.keyCode == 191) {
      canvasBasedNames = !canvasBasedNames;
      for (var jnd=0; jnd<allNameTags.length; jnd++){
        allNameTags[jnd].remove();
      }
      allNameTags = [];
    }
  
    // console.log(event.keyCode)
    drawMinimap();
    drawGrid();
    drawTensors(); 
  
  console.log(event.keyCode)
}


function onKeyUp(evt) {
 
}

      
      

