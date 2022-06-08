rightCommentBox.addEventListener("paste", function(e) {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});

rightCommentBox.addEventListener('focusin', function(e) {
  rightCommentBox.innerText = rightCommentBox.innerHTML;
});

rightCommentBox.addEventListener('focusout', function(e) {
  rightCommentBox.innerHTML = rightCommentBox.innerText;
  MathJax.typeset();
});

codeText.addEventListener("paste", function(e) {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
  Prism.highlightAll();
});

window.addEventListener('keyup', onKeyUp);

function onKeyUp(evt) {
  if(event.keyCode == 13) {// enter
    var cloc = Cursor.getCurrentCursorPosition(codeText);
    Prism.highlightAll();
    Cursor.setCurrentCursorPosition(cloc, codeText);
  }
  
  if(event.keyCode == 8) {// backspace
    var cloc = Cursor.getCurrentCursorPosition(codeText);
    Prism.highlightAll();
    Cursor.setCurrentCursorPosition(cloc, codeText);
  }
  
  if (event.keyCode == 9) {//tab key
    // prevent tab from switching window focus
    evt.preventDefault();
    evt.stopPropagation();
    
    // insert two space in correct place
    var doc = codeText.ownerDocument.defaultView;
    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);
    var tabNode = document.createTextNode("\u00a0\u00a0");
    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode); 
    sel.removeAllRanges();
    sel.addRange(range);
  }
}