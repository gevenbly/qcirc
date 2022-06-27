const fieldIconWidth = 16;
const fieldIconHeight = 16;

// ancMinusCanvasIcon = document.getElementById('ancMinusCanvasIcon');
// ancMinusCanvasIcon.setAttribute("stroke", "blue");
// renameCanvasIcon = document.getElementById('renameCanvasIcon');
// renameCanvasIcon.setAttribute("stroke", "blue");
// ancPlusCanvasIcon = document.getElementById('ancPlusCanvasIcon');
// ancPlusCanvasIcon.setAttribute("stroke", "blue");
var tensorIcons = [document.getElementById('ancMinusCanvasIcon'),
                   document.getElementById('renameCanvasIcon'),
                   document.getElementById('ancPlusCanvasIcon'),
                   document.getElementById('plusCanvasIcon'),
                   document.getElementById('minusCanvasIcon'),
                   document.getElementById('leftCanvasIcon'),
                   document.getElementById('rightCanvasIcon'),
                   document.getElementById('reverseCanvasIcon')];


// var svgElementsEnd = [document.getElementById('minussvg'),
//                       document.getElementById('plussvg')];
// var endIcons = [];
// for (var j=0; j<4; j++) {
//   var jnd = j % 2;
//   svgElementsEnd[jnd].setAttribute("width", fieldIconWidth + "px");
//   svgElementsEnd[jnd].setAttribute("height", fieldIconHeight + "px");
//   svgElementsEnd[jnd].setAttribute("display", "none");
//   if (j>=2) {
//     svgElementsEnd[jnd].setAttribute("stroke", "white");
//   } else {
//     svgElementsEnd[jnd].setAttribute("stroke", "#c4c4c4");
//   }
//   svgElementsEnd[jnd].setAttribute("stroke-width", "2px");
  
//   var xml = new XMLSerializer().serializeToString(svgElementsEnd[jnd]);
//   var image64 = 'data:image/svg+xml;base64,' + btoa(xml);
//   endIcons.push(new Image());
//   endIcons[j].src= image64;
// }
// const iconPosEnd = {x: [-fieldIconWidth+3,fieldIconWidth-3],
//                     y: [0,0]};

// var svgElementsInd = [document.getElementById('plussvg'),
//                       document.getElementById('minussvg'),
//                       document.getElementById('plussvg'),
//                       document.getElementById('minussvg')]
// var indexIcons = [];
// for (var j=0; j<6; j++) {
//   var jnd = j % 3;
//   svgElementsInd[jnd].setAttribute("width", fieldIconWidth + "px");
//   svgElementsInd[jnd].setAttribute("height", fieldIconHeight + "px");
//   svgElementsInd[jnd].setAttribute("display", "none");
//   if (j>2) {
//     svgElementsInd[jnd].setAttribute("stroke", "white");
//   } else {
//     svgElementsInd[jnd].setAttribute("stroke", "#c4c4c4");
//   }
  
//   var xml = new XMLSerializer().serializeToString(svgElementsInd[jnd]);
//   var image64 = 'data:image/svg+xml;base64,' + btoa(xml);
//   indexIcons.push(new Image());
//   indexIcons[j].src= image64;
// }
// const iconPosIndex = {x: [-fieldIconWidth,fieldIconWidth,0,0],
//                       y: [0,0,-fieldIconHeight,fieldIconHeight]};

// var svgElements = [document.getElementById('anchorplussvg'),
//                    document.getElementById('renamesvg'),
//                    document.getElementById('anchorminussvg')];

// numTensorIcons = 3;
const spacingForIcons = fieldIconWidth+4;
const iconPos = {x: [-spacingForIcons,0,spacingForIcons],
                y: [20,20,20]};
const openIconPos = {x: [-fieldIconWidth,fieldIconWidth],
                y: [0,0]};
const indexIconPos = {x: [-fieldIconWidth-2, fieldIconWidth+2, 0],
                y: [0, 0, -fieldIconHeight-2]};










