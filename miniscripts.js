/*
functions for manipulating the minimap
*/

function updateMinimap(posx, posy) {
  var mX = viewWidth - (miniPad + miniWidth);
  var mY = miniPad;
  var miniWindWidth  = miniWidth * (windowWidth / spaceWidth);
  var miniWindHeight  = miniHeight * (windowHeight / spaceHeight);

  windowX0 = (posx - mX - (miniWindWidth / 2)) * (spaceWidth / miniWidth);
  windowY0 = (posy - mY - (miniWindHeight / 2)) * (spaceHeight / miniHeight);

  if (windowX0 < 0) {
    windowX0 = 0;
  }
  if (windowX0 > (spaceWidth - windowWidth)) {
    windowX0 = spaceWidth - windowWidth;
  }
  if (windowY0 < 0) {
    windowY0 = 0;
  }
  if (windowY0 > (spaceHeight - windowHeight)) {
    windowY0 = spaceHeight - windowHeight;
  }
  drawMinimap();
  drawGrid();
}