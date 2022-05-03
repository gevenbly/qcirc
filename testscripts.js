function focusText() {
  document.getElementById('text_cnv').focus();
}

function  addTextCnv(ctx, text, x, y) {

  // adds the text in canvas (sets text color, font type and size)
  ctx.fillStyle = '#0001be';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(text, x, y);
}

// get a reference to the canvas element, and its context

// sets maximum line width, line height, and x /y coords for tex
// var x_pos = 200;
// var y_pos = 200;

// register onkeyup event for #text_cnv text field to add the text in canvas as it is typed
// document.getElementById('text_cnv').onkeyup = function() {
//   addTextCnv(ctxT, this.value, x_pos, y_pos);
// }

/*
form.addEventListener('focusout', (event) => {
  event.target.style.background = '';
});

const form = document.getElementById('form');

form.addEventListener('focusin', (event) => {
  event.target.style.background = 'pink';
});

form.addEventListener('focusout', (event) => {
  event.target.style.background = '';
});
*/

function clear(){
    document.getElementById("textarea").value="";
}