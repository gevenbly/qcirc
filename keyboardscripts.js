/*
functions that resolve keyboard events 
*/

function onKeyDown(evt) {
  var pos = getAbsMousePos(canvasBase, evt);

//   console.log(commentBox.innerText);

//   var doc = new DOMParser().parseFromString(
//       commentBox.innerText,
//       "text/html"
//     );
//     var text = doc.body.textContent;
    // console.log(text);
  
//   let nextText = text
//       // carriage returns, tabs, and newlines at the beginning
//       .replace(/^[\r\t\n]+/, "")

//       // carriage returns, tabs, and newlines at the end
//       .replace(/[\r\t\n]+$/, "")

//       // condense sequential carriage returns and newlines anywhere
//       .replace(/([\r\n]\s?){2,}/g, "\n\n")

//       // sequential spaces including unicode nbsp
//       .replace(/[\u00A0 ]+/g, " ")

//       // replace bullet-like characters with actual bullet
//       .replace(/[\u2219|\u00B7]/g, "\u2022")

//       // standalone newlines between words should be spaces
//       .replace(/([^\n])\n(?=\w)/g, "$1 ");
//   console.log(nextText);
  // console.log(document.activeElement=="codeText")
  // console.log(document.activeElement)

  if (document.activeElement==document.getElementById("codeText")) {
    if(event.keyCode == 40 || event.keyCode == 39) {
      var locTemp = Cursor.getCurrentCursorPosition(codeText);
      var locMax = codeText.innerText.length;
      if (locMax - locTemp < 2) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
    return;
  }

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

  // console.log(Cursor.getCurrentCursorPosition(codeText))
  // console.log(codeText.innerText)
  // console.log(codeText.innerText.length - Cursor.getCurrentCursorPosition(codeText))

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

  if (event.keyCode == 9) {
    //tab key
    evt.preventDefault();
    evt.stopPropagation();
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
    // 'c' append to code
    // var xtemp = Prism.highlight(codeTextNew, Prism.languages.python);
    // codeText.appendChild(document.createTextNode(codeTextNew));
    // Prism.highlightAll();
    // codeText += xtemp
    // Prism.highlight(codeText, Prism.languages.python);
    // var Prism = require('prismjs');
    // codeText.innerHTML = Prism.highlight(codeTextNew, Prism.languages.python);
    // codeText.innerHTML = codeTextNew;
    // document.getElementById("codeWindow").innerHTML = "# The code environment\n";
    // location.reload();
  }

  if (event.keyCode == 37) {
    // left arrow
    windowPos.x -= mainScrollSpeed;
    if (windowPos.x < 0) {
      windowPos.x = 0;
    }

    // const ke = new KeyboardEvent('keydown', {
    //   bubbles: true, cancelable: true, keyCode: 13
    // });
    // document.body.dispatchEvent(ke);
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
  } else if (event.keyCode == 82) {
    // r key
    // theNamebox.focus(evt);
  } else if (event.keyCode == 70) {
    // f key
    console.log(tensors);
    console.log(indices);
    console.log(openIndices);
    // console.log(tensorGroups);
  } else if (event.keyCode == 71) {
    // g key
    // copySelection();
    // makeTensorGroups();
    reassignAllGroupIndices();
  } else if (event.keyCode == 72) {
    // h key
    roundAllCoords();
    var x = JSON.stringify(tensors);
    console.log(x);
    var y = JSON.stringify(indices);
    console.log(y);
    // var y = JSON.parse(x);
    // console.log(y);
  } else if (event.keyCode == 74) {
    // j
    snapAllAnchors();
  } else if (event.keyCode == 78) {
    // n
    doSwitchTab(currProjectOpen + 1);
    currProjectOpen = numProjectsOpen;
    numProjectsOpen += 1;
    allProjectTabs[currProjectOpen].style.display = "block";
    updateTabSelect();
    // allProjectTabs[0].style.backgroundColor = "black";
    // allProjectTabs[currProjectOpen].style.backgroundColor = "#474747";
  } else if (event.keyCode == 66) {
    // b
    var clipData = bufferSelection();

    download(clipData, allProjectNames[currProjectOpen], "qc");

    //       console.log(clipData)

    //       unpackBufferSelection(clipData);
    //       shiftSelectBoxWindow();
    // } else if (event.keyCode == 77) {//m
    //   doFileOpen();
  } else if (event.keyCode == 83) {
    localStorage["data"] = JSON.stringify(tensors);
  } else if (event.keyCode == 76) {
    //l
    console.log(tensors);
    tensors = JSON.parse(localStorage["data"]);
  } else if (event.keyCode == 220) {
    // \

    var doc = new DOMParser().parseFromString(
      commentBox.innerText,
      "text/html"
    );
    var text = doc.body.textContent;
    console.log(text);

    let nextText = text
      // carriage returns, tabs, and newlines at the beginning
      .replace(/^[\r\t\n]+/, "")

      // carriage returns, tabs, and newlines at the end
      .replace(/[\r\t\n]+$/, "")

      // condense sequential carriage returns and newlines anywhere
      .replace(/([\r\n]\s?){2,}/g, "\n\n")

      // sequential spaces including unicode nbsp
      .replace(/[\u00A0 ]+/g, " ")

      // replace bullet-like characters with actual bullet
      .replace(/[\u2219|\u00B7]/g, "\u2022")

      // standalone newlines between words should be spaces
      .replace(/([^\n])\n(?=\w)/g, "$1 ");

    // console.log(nextText, JSON.stringify(nextText))
    document.execCommand("insertText", false, nextText);
    // var infoWindow=window.open('');
    // infoWindow.document.write("<div id='hello'>hey<div>");
  } else if (event.keyCode == 191) {
    canvasBasedNames = !canvasBasedNames;
    for (var jnd = 0; jnd < allNameTags.length; jnd++) {
      allNameTags[jnd].remove();
    }
    allNameTags = [];
  }

  // console.log(event.keyCode)
  drawMinimap();
  drawGrid();
  drawTensors();

  console.log(event.keyCode);
}

function onKeyUp(evt) {}
