

var codeText = document.getElementById("codeText");

var mainBoxData = {
  commenttext: "<b>Comments for main </b> <br> ",
  commentjax: "",
  codetext: "# Code input/output for main \n\r",
  codeprism: ""
}

commentBox.innerText = mainBoxData.commenttext;
commentBoxStatic.innerHTML = mainBoxData.commenttext;
codeText.appendChild(document.createTextNode(mainBoxData.codetext));


function updateTextBoxes() {
  commentBox.style.display = "none";
  commentBoxStatic.style.display = "block";
  for (var k=textBoxes.length; k>=0; k--) {
    var whichBoxActive = (k-1);
    if (whichBoxActive>=0) {
      commentBox.innerText = textBoxes[whichBoxActive].commenttext;
    } else {
      commentBox.innerText = mainBoxData.commenttext;
    }
    commentBoxStatic.innerHTML = commentBox.innerText;
    if (whichBoxActive>=0) {
      textBoxes[whichBoxActive].commenttext = commentBoxStatic.innerHTML;
      MathJax.typeset();
      textBoxes[whichBoxActive].commentjax = commentBoxStatic.innerHTML;
    } else {
      mainBoxData.commenttext = commentBoxStatic.innerHTML;
      MathJax.typeset();
      mainBoxData.commentjax = commentBoxStatic.innerHTML;
    }
    commentBox.style.display = "none";
    commentBoxStatic.style.display = "block";
  }
  // commentBoxStatic.innerHTML = mainBoxData.commenttext;
  // MathJax.typeset();
  codeText.innerHTML = mainBoxData.codetext;
  Prism.highlightAll();
}

function doRightEditClick() {
  if (whichBoxActive>=0) {
    commentBox.innerText = textBoxes[whichBoxActive].commenttext;
  } else {
    commentBox.innerText = mainBoxData.commenttext;
  }
  
  commentBox.style.display = "block";
  commentBoxStatic.style.display = "none";
  // commentBox.focus();
  // if (whichBoxActive>=0) {
  //   commentBox.innerText = textBoxes[whichBoxActive].commenttext;
  // } else {
  //   commentBox.innerText = mainBoxData.commenttext;
  // }
  setTimeout(function() {commentBox.focus();}, 0);
}

// comment window stuff
commentBox.addEventListener("paste", function(e) {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});

commentBox.addEventListener('focusin', function(e) {
  if (whichBoxActive>=0) {
    commentBox.innerText = textBoxes[whichBoxActive].commenttext;
  } else {
    commentBox.innerText = mainBoxData.commenttext;
  }
});

commentBox.addEventListener('focusout', function(e) {
  commentBoxStatic.innerHTML = commentBox.innerText;
  if (whichBoxActive>=0) {
    textBoxes[whichBoxActive].commenttext = commentBoxStatic.innerHTML;
    MathJax.typeset();
    textBoxes[whichBoxActive].commentjax = commentBoxStatic.innerHTML;
  } else {
    mainBoxData.commenttext = commentBoxStatic.innerHTML;
    MathJax.typeset();
    mainBoxData.commentjax = commentBoxStatic.innerHTML;
  }
  commentBox.style.display = "none";
  commentBoxStatic.style.display = "block";
});

// commentBox.addEventListener('focusout', function(e) {
//   commentBox.innerHTML = commentBox.innerText;
//   if (whichBoxActive>=0) {
//     textBoxes[whichBoxActive].commenttext = commentBox.innerHTML;
//     MathJax.typeset();
//     textBoxes[whichBoxActive].commentjax = commentBox.innerHTML;
//   } else {
//     mainBoxData.commenttext = commentBox.innerHTML;
//     MathJax.typeset();
//     mainBoxData.commentjax = commentBox.innerHTML;
//   }
//   commentBox.style.display = "none";
//   commentBoxStatic.style.display = "block";
// });

// code window stuff
codeText.addEventListener("paste", function(e) {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
  Prism.highlightAll();
});

codeText.addEventListener('keydown', function(e) {
  if(event.keyCode == 40 || event.keyCode == 39) {
    // prevent move cursor out of bounds
    var locTemp = Cursor.getPositionStart(codeText);
    var locMax = codeText.innerText.length;
    if (locMax - locTemp < 2) {
      e.preventDefault();
      e.stopPropagation();
    }
  } else if (e.shiftKey && e.keyCode == 9) {
    // implement shift-tab decrement on all selected lines
    e.preventDefault();
    e.stopPropagation();
    
    var caretPos0 = Cursor.getPositionStart(codeText);
    var caretPos1 = Cursor.getPositionEnd(codeText);
    if (caretPos1 < caretPos0) {
      // fix glitch with selection including start of field
      var caretTemp = caretPos1;
      caretPos1 = caretPos0;
      caretPos0 = caretTemp;
    }
    Prism.highlightAll();
    if (caretPos0==caretPos1) {
      Cursor.setPosition(caretPos0, codeText);
    } else {
      Cursor.setRange(caretPos0, caretPos1, codeText);
    }
    
    var tempText = codeText.innerText;
    var tempRegExp = /\r|\n/g;
    var array1 = [...tempText.matchAll(tempRegExp)];

    var locOfNewlines = [-1];
    for (var j=0; j<array1.length; j++) {
      locOfNewlines.push(array1[j].index);
    }

    var caretPos0 = Cursor.getPositionStart(codeText);
    var caretPos1 = Cursor.getPositionEnd(codeText);
    if (caretPos1 < caretPos0) {
      // fix glitch with selection including start of field
      var caretTemp = caretPos1;
      caretPos1 = caretPos0;
      caretPos0 = caretTemp;
    }

    const isSmallNumber = (element) => caretPos1 <= element;
    const isLargeNumber = (element) => element >= caretPos0;

    var L0 = locOfNewlines.findIndex(isLargeNumber);
    var L1 = locOfNewlines.findIndex(isSmallNumber);
    
    var numShifted = 0;
    for (var codeLines=L1; codeLines>=L0; codeLines--) {
      var newLoc = 1+locOfNewlines[codeLines-1];
      Cursor.setPosition(newLoc, codeText)
      
      var doc = codeText.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var node = sel.anchorNode;
      var offset = sel.anchorOffset;
      
      if (node.nodeType === Node.TEXT_NODE) {
        for (var k=0; k<2; k++) {
          var theNextChar = node.textContent.charCodeAt(offset);
          if (theNextChar == 32 || theNextChar == 160) {
            numShifted += 1;
            node.textContent = (node.textContent.substring(0,offset) + 
                                node.textContent.substring(offset+1));
          }
        }
      }
    }
    sel.removeAllRanges();
    Cursor.setRange(caretPos0 - 2, caretPos1 - numShifted, codeText)
    
  } else if (event.keyCode == 9) {
    // implement tab increment on all selected lines
    e.preventDefault();
    e.stopPropagation();
    
    var tempText = codeText.innerText;
    var tempRegExp = /\r|\n/g;
    var array1 = [...tempText.matchAll(tempRegExp)];

    var locOfNewlines = [-1];
    for (var j=0; j<array1.length; j++) {
      locOfNewlines.push(array1[j].index);
    }

    var caretPos0 = Cursor.getPositionStart(codeText);
    var caretPos1 = Cursor.getPositionEnd(codeText);
    if (caretPos1 < caretPos0) {
      // fix glitch with selection including start of field
      var caretTemp = caretPos1;
      caretPos1 = caretPos0;
      caretPos0 = caretTemp;
    }

    const isSmallNumber = (element) => caretPos1 <= element;
    const isLargeNumber = (element) => element >= caretPos0;

    var L0 = locOfNewlines.findIndex(isLargeNumber);
    var L1 = locOfNewlines.findIndex(isSmallNumber);

    for (var codeLines=L1; codeLines>=L0; codeLines--) {
      
      Cursor.setPosition(1+locOfNewlines[codeLines-1], codeText)

      var doc = codeText.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var range = sel.getRangeAt(0);
      var tabNode = document.createTextNode("\u00a0\u00a0");
      range.insertNode(tabNode);
    }
    range.collapse(true);
    sel.removeAllRanges();
    Cursor.setRange(caretPos0+2, caretPos1+2*(L1-L0+1), codeText)
  } 
});

codeText.addEventListener('focusout', function(e) {
  Prism.highlightAll();
  if (whichBoxActive>=0) {
    textBoxes[whichBoxActive].codetext = codeText.innerText;
    textBoxes[whichBoxActive].codeprism = codeText.innerHTML;
  } else {
    mainBoxData.codetext = codeText.innerText;
    mainBoxData.codeprism = codeText.innerHTML;
  }
});

codeText.addEventListener('keyup', function(e) {
  if(event.keyCode == 13 || event.keyCode == 8) {// enter or backspace
    var cloc0 = Cursor.getPositionStart(codeText);
    var cloc1 = Cursor.getPositionEnd(codeText);
    Prism.highlightAll();
    if (cloc0 == cloc1) {
      Cursor.setPosition(cloc0, codeText);
    } else {
      Cursor.setRange(cloc0, cloc1, codeText);
    }
  }
});

// update windows on selecting a new tab
function selectTextBox(val, snapCenter=true) {
  // save data
  Prism.highlightAll();
  if (whichBoxActive>=0) {
    textBoxes[whichBoxActive].codetext = codeText.innerText;
    textBoxes[whichBoxActive].codeprism = codeText.innerHTML;
  } else {
    mainBoxData.codetext = codeText.innerText;
    mainBoxData.codeprism = codeText.innerHTML;
  }
  commentBox.blur();  
  commentBoxStatic.blur();  
  
  // update tab shading
  for (var j=0; j<(textBoxes.length+1); j++) {
    collectionComment[j].style.border = '1px black solid';
    if (j==0) {
      collectionComment[j].style.backgroundColor = '#222';
    } else {
      collectionComment[j].style.backgroundColor = leftColorTypes[textBoxes[j-1].color + 15];
    }
  }
  // update windows
  whichBoxActive = val;
  if (whichBoxActive>=0) {// case: text box was selected
    // snap window to textbox
    if (snapCenter) {
      snapWindowTo(textBoxes[whichBoxActive].bbox[4], textBoxes[whichBoxActive].bbox[5]); 
    }
    // update tab shading
    collectionComment[whichBoxActive+1].style.backgroundColor = leftColorTypes[textBoxes[val].color + 15];
    collectionComment[whichBoxActive+1].style.border = '1px white solid';
    currBoxSelected = [whichBoxActive];
    // update commment window
    if (textBoxes[whichBoxActive].commentjax.length > 0) {
      commentBoxStatic.innerHTML = textBoxes[whichBoxActive].commentjax;
    } else {
      commentBoxStatic.innerHTML = textBoxes[whichBoxActive].commenttext;
    }
    // update code window
    if (textBoxes[whichBoxActive].codeprism.length > 0) {
      codeText.innerHTML = textBoxes[whichBoxActive].codeprism;
    } else {
      codeText.innerHTML = textBoxes[whichBoxActive].codetext;
      Prism.highlightAll();
    }
    
  } else {// case: main window was selected
    // update tab shading
    collectionComment[whichBoxActive+1].style.backgroundColor = '#222';
    collectionComment[whichBoxActive+1].style.border = '1px white solid';
    currBoxSelected = [];
    // update commment window
    if (mainBoxData.commentjax.length > 0) {
      commentBoxStatic.innerHTML = mainBoxData.commentjax;
    } else {
      commentBoxStatic.innerHTML = mainBoxData.commenttext;
    }
    // update code window
    if (mainBoxData.codeprism.length > 0) {
      codeText.innerHTML = mainBoxData.codeprism;
    } else {
      codeText.innerHTML = mainBoxData.codetext;
      Prism.highlightAll();
    }
  }
  
  drawMinimap();
  drawGrid(); 
  drawTensors();
}


