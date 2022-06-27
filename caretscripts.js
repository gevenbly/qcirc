class Cursor {
  static getPositionStart(parentElement) {
    var selection = window.getSelection(),
      charCount = -1,
      node;

    if (selection.anchorNode) {
      if (Cursor._isChildOf(selection.anchorNode, parentElement)) {
        node = selection.anchorNode;
        charCount = selection.anchorOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }
    return charCount;
  }
  
  static getPositionEnd(parentElement) {
    var selection = window.getSelection(),
      charCount = -1,
      node;

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode;
        charCount = selection.focusOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }
    return charCount;
  }

  static setPosition(chars, element) {
    if (chars >= 0) {
      var selection = window.getSelection();
      let range = Cursor.createRangeSpan(element, { count: 0 }, { count: chars });
      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  static setRange(chars0, chars1, element) {
    if (chars0 >= 0) {
      var selection = window.getSelection();
      var range = Cursor.createRangeSpan(element, { count: chars0 }, { count: chars1 });
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  static createRangeSpan(node, chars0, chars1, range) {
    if (!range) {
      range = document.createRange();
      range.selectNode(node);
      // range.setStart(node, 0);
    }
    if (chars1.count === 0) {
      range.setEnd(node, chars1.count);
    } else if (node && chars1.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars1.count) {
          chars1.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars1.count);
          chars1.count = 0;
        }
        if (chars0.count > 0) {
          if (node.textContent.length < chars0.count) {
            chars0.count -= node.textContent.length;
          } else {
            range.setStart(node, chars0.count);
            chars0.count = 0;
          }
        }
      } else {
        for (var lp = 0; lp < node.childNodes.length; lp++) {
          range = Cursor.createRangeSpan(node.childNodes[lp], chars0, chars1, range);

          if (chars1.count === 0) {
            break;
          }
        }
      }
    }
    return range;
  }

  static _isChildOf(node, parentElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
}
