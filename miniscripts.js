/*
functions for manipulating the minimap
*/

function updateMinimap(posx, posy) {
  var mX = viewWidth - (miniPadX + miniWidth);
  var mY = miniPadY;
  var miniWindWidth  = miniWidth * (windowWidth / spaceWidth);
  var miniWindHeight  = miniHeight * (windowHeight / spaceHeight);

  windowPos.x = (posx - mX - (miniWindWidth / 2)) * (spaceWidth / miniWidth);
  windowPos.y = (posy - mY - (miniWindHeight / 2)) * (spaceHeight / miniHeight);

  if (windowPos.x < 0) {
    windowPos.x = 0;
  }
  if (windowPos.x > (spaceWidth - windowWidth)) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if (windowPos.y < 0) {
    windowPos.y = 0;
  }
  if (windowPos.y > (spaceHeight - windowHeight)) {
    windowPos.y = spaceHeight - windowHeight;
  }
  drawMinimap();
  drawGrid();
}