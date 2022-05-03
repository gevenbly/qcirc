function toggleRightGui() {
  if (rightGuiIsOpen) {
    rightGuiIsOpen = false;
    rightMenuWidth = 20;
    rightMenu.style.width = rightMenuWidth+'px';
    resizeCanvas();
  } else {
    rightGuiIsOpen = true;
    rightMenuWidth = 100;
    rightMenu.style.width = rightMenuWidth+'px';
    resizeCanvas();
  }
}