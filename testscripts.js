//   if (event.keyCode == 192) {// `
//     mainBoxData.commentjax = "";
//     mainBoxData.codeprism = "";
//     for (var j=0; j<textBoxes.length; j++) {
//       textBoxes[j].commentjax = "";
//       textBoxes[j].codeprism = "";
//     }
//     var clipData = {tensors: JSON.stringify(tensors), 
//                     indices: JSON.stringify(indices),
//                     textBoxes: JSON.stringify(textBoxes),
//                     mainBoxData: JSON.stringify(mainBoxData),
//                     indexConfigs: JSON.stringify(indexConfigs),
//                     numUniqueInds: JSON.stringify(numUniqueInds),
//                     windowPos: JSON.stringify(windowPos)
//                    };
//     allTheData = JSON.stringify(clipData);
//     console.log(JSON.stringify(allTheData)); 
//   }
  
//   if (event.keyCode == 173) {// F1
//     stateOfMouse = "free";
//     currSelected = [];
//     currBoxSelected = [];
    
//     var clipData = JSON.parse(allTheData);
//     tensors = JSON.parse(clipData.tensors);
//     indices = JSON.parse(clipData.indices);
//     textBoxes = JSON.parse(clipData.textBoxes);
//     mainBoxData = JSON.parse(clipData.mainBoxData);
//     indexConfigs = JSON.parse(clipData.indexConfigs);
//     numUniqueInds = JSON.parse(clipData.numUniqueInds);
//     windowPos = JSON.parse(clipData.windowPos);

//     windowWidth = viewWidth / windowPos.zoom;
//     windowHeight = viewHeight / windowPos.zoom;
//     if ((windowPos.x + windowWidth) > spaceWidth) {
//       windowPos.x = spaceWidth - windowWidth;
//     }
//     if ((windowPos.y + windowHeight) > spaceHeight) {
//       windowPos.y = spaceHeight - windowHeight;
//     }

//     updateTensorTags();
//     updateTextBoxTags();
//     findOpenIndices();
//     drawGrid();
//     drawMinimap();
//     drawTensors();
//   }