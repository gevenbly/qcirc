/*
functions for dropdowns on main navigation window
*/

mainWindow.onclick = function(event) {
  if (!event.target.matches('.clickdropbtn')) {
    closeTheDrops();
  }
}

function doDropOvers(str_name) {
  if (menuIsOpen) {
    closeTheDrops();
    document.getElementById(str_name).classList.toggle("show");
    menuIsOpen = true;
  }
}

function doDropClicks(str_name) {
  var isExpanded = document.getElementById(str_name).classList.contains("show");
  closeTheDrops();
  if (!isExpanded) {
    document.getElementById(str_name).classList.toggle("show");
    menuIsOpen = true;
  }
}

function closeTheDrops() {
  menuIsOpen = false;
  var dropdowns = document.getElementsByClassName("clickdown-content");
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}