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

  boundViewWindow();
  drawMinimap();
  drawGrid();
}

