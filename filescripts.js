
// function readFileIntoMemory (file, callback) {
//   var reader = new FileReader();
//   reader.onload = function () {
//     callback({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       content: this.result
//     });
//   };
//   reader.readAsText(file);
// }

// document.getElementById('loadTheFile').addEventListener('change', function()

// // Usage example
// readFileIntoMemory(file, function(fileInfo) {
//   console.info("Read file " + fileInfo.name + " of size " + fileInfo.size);
//   // You can use fileInfo.content, which is a Uint8Array, here
// });

// onchange="read(this)"

// var theLoadData = "";
// document.getElementById('loadTheFile').addEventListener('change',readFile(file))
// function readSingleFile(e) {
//   var file = e.target.files[0];
//   if (!file) {
//     return;
//   }
//   var reader = new FileReader();
//   reader.onload = function(e) {
//     theLoadData = e.target.result;
//     // displayContents(contents);
//   };
//   reader.readAsText(file);
// }

// function readFile(file) {
//   return new Promise((resolve, reject) => {
//     let fr = new FileReader();
//     fr.onload = x=> resolve(fr.result);
//     fr.readAsText(file);
// })}

// function displayContents(contents) {
//   var element = document.getElementById('file-content');
//   element.textContent = contents;
// }


// for loading from file

// document.getElementById('loadTheFile').addEventListener('change', function() {
//   var file = new FileReader();
//   file.onload = () => {
//     theLoadData = file.result;
//   }
//   theLoadData = file.readAsText(this.files[0]);
// });

function download(data, filename) {
  console.log('hello')
  console.log(data)
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(data);
  hiddenElement.target = '_blank';
  hiddenElement.download = filename;
  hiddenElement.click();
}


// // for saving to file
// function download(data, filename, type) {
//   console.log(data)
//   // var file = new Blob([data], {type: type});
//   var file = new Blob([data], {type : 'application/json'});
//   if (window.navigator.msSaveOrOpenBlob) // IE10+
//     window.navigator.msSaveOrOpenBlob(file, filename);
//   else { // Others
//     console.log('hello')
//     var a = document.createElement("a"),
//         url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function() {
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);  
//     }, 0); 
//   }
// }

function doFileNew() {
  if (numProjectsOpen<maxProjectsOpen) {
    initializeWorkspace();
  }
}

function doFileOpen() {
  // initializeWorkspace();
  unpackBufferSelection(theLoadData);
  shiftSelectBoxWindow();
  drawMinimap();
  drawTensors();
  toggleTitle(2);
}
  
function doFileSave() {
  console.log("Save")
}
function doFileSaveAs() {
  var clipData = {tensors: JSON.stringify(tensors), 
                  indices: JSON.stringify(indices)};
  download(JSON.stringify(clipData), allProjectNames[currProjectOpen], "qc"); 
}



