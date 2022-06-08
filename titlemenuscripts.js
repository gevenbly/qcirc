var isLoadExample = false;

function toggleTitle(typ) {
  if (isHomeMenuOpen) {
    isHomeMenuOpen = false;
    
    document.getElementById('sublistWindow').style.display = "block";
    document.getElementById('rightGui').style.display = "block";
    document.getElementById('leftGui').style.display = "block";
    document.getElementById('canvasWindow').style.display = "block";
    document.getElementById('titleWindow').style.display = "none";
    document.getElementById('rightGuiResizer').style.display = "block";
  }
  
  if (typ == 1) {isLoadExample = true};
  
  if (isLoadExample) {
    var tensorString = '[{"type":0,"bbox":[120,220,220,260,170,240],"name":"ham","color":0,"rot":0,"slope":0,"xanchors":[-42,7,41,-43,4,39],"yanchors":[20,20,20,-20,-20,-20],"connects":[-4,-5,-6,-1,-2,-3]},{"type":3,"bbox":[200,160,260,200,230,180],"name":"u","color":2,"rot":0,"slope":0.25,"xanchors":[-21,20,-22,23],"yanchors":[20,20,-20,-20],"connects":[3,7,-10,-11]},{"type":3,"bbox":[120,160,180,200,150,180],"name":"u","color":2,"rot":0,"slope":0.25,"xanchors":[-23,24,-16,22],"yanchors":[20,20,-20,-20],"connects":[1,2,8,-9]},{"type":2,"bbox":[160,100,220,140,190,120],"name":"w","color":4,"rot":0,"slope":0,"xanchors":[-18,18,0],"yanchors":[20,20,-20],"connects":[9,10,-22]},{"type":2,"bbox":[80,100,140,140,110,120],"name":"w","color":4,"rot":0,"slope":0,"xanchors":[-17,24,-1],"yanchors":[20,20,-20],"connects":[-16,-8,-21]},{"type":2,"bbox":[240,100,300,140,270,120],"name":"w","color":4,"rot":0,"slope":0,"xanchors":[-17,23,-1],"yanchors":[20,20,-20],"connects":[11,17,-23]},{"type":3,"bbox":[200,280,260,320,230,300],"name":"u","color":2,"rot":2,"slope":0.25,"xanchors":[-19,20,-10,22],"yanchors":[-20,-20,20,20],"connects":[6,-7,14,-15]},{"type":3,"bbox":[120,280,180,320,150,300],"name":"u","color":2,"rot":2,"slope":0.25,"xanchors":[-22,27,-22,23],"yanchors":[-20,-20,20,20],"connects":[4,5,-12,-13]},{"type":2,"bbox":[160,340,220,380,190,360],"name":"w","color":4,"rot":2,"slope":0,"xanchors":[-17,30,1],"yanchors":[-20,-20,20],"connects":[13,-14,-19]},{"type":2,"bbox":[80,340,140,380,110,360],"name":"w","color":4,"rot":2,"slope":0,"xanchors":[-17,18,0],"yanchors":[-20,-20,20],"connects":[16,12,-18]},{"type":2,"bbox":[240,340,300,380,270,360],"name":"w","color":4,"rot":2,"slope":0,"xanchors":[-18,23,1],"yanchors":[-20,-20,20],"connects":[15,-17,-20]}]';
    var indexString = '[0,{"connects":[0,3,2,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[0,4,2,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[0,5,1,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[0,0,7,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[0,1,7,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[0,2,6,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[6,1,1,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[4,1,2,2],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[2,3,3,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[1,2,3,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[1,3,5,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[7,2,9,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[7,3,8,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[8,1,6,2],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[6,3,10,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[4,0,9,0],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[10,1,5,1],"name":"","dim":2,"reversed":false,"end":[0,0],"label":0},{"connects":[9,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[0,62],"label":0},{"connects":[8,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[3,62],"label":1},{"connects":[10,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[2,62],"label":2},{"connects":[4,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[-1,-58],"label":3},{"connects":[3,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[0,-58],"label":4},{"connects":[5,2,-1,-1],"name":"","dim":2,"reversed":false,"end":[-1,-60],"label":5}]';
    tensors = JSON.parse(tensorString);
    indices = JSON.parse(indexString);
    findOpenIndices();
    
    drawTensors();
    drawMinimap();
  }
}

