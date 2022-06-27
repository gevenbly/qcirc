

var isLoadExample = 0;

function toggleTitle() {
  if (isHomeMenuOpen) {
    isHomeMenuOpen = false;
    document.getElementById('sublistWindow').style.display = "block";
    document.getElementById('rightGui').style.display = "block";
    document.getElementById('leftGui').style.display = "block";
    document.getElementById('canvasWindow').style.display = "block";
    document.getElementById('titleWindow').style.display = "none";
    document.getElementById('rightGuiResizer').style.display = "block";
  }
  resizeCanvas();
}

function openExampleMenu() {
  document.getElementById('titleOptionsContainer2').style.visibility = "visible";
}

function openExampleProject(val) {
  toggleTitle();
  if (val==1) {
    var allTheData = "{\"tensors\":[{\"type\":1,\"bbox\":[154,153,252,216,203,184.5],\"name\":\"\",\"color\":3,\"rot\":0,\"slope\":0,\"xanchors\":[-13,-10,49,38],\"yanchors\":[30,-31,0,7],\"connects\":[1,-6,-2,0],\"conj\":false},{\"type\":3,\"bbox\":[281,170,407,244,344,207],\"name\":\"\",\"color\":1,\"rot\":0,\"slope\":0.25,\"xanchors\":[-52,0,32,-63],\"yanchors\":[-14,-37,-16,37],\"connects\":[2,-5,0,3],\"conj\":false},{\"type\":0,\"bbox\":[182,259,278,316,230,287.5],\"name\":\"\",\"color\":4,\"rot\":0,\"slope\":0,\"xanchors\":[-48,48,33,34],\"yanchors\":[-28,-28,-12,29],\"connects\":[-1,-3,0,-4],\"conj\":false}],\"indices\":[0,{\"connects\":[2,0,0,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-52,-121],\"center\":[186,237],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[0,2,1,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[115,1],\"center\":[272,188.75],\"label\":0,\"curved\":false,\"type\":1},{\"connects\":[2,1,1,3],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[151,-72],\"center\":[279.5,251.75],\"label\":0,\"curved\":false,\"type\":2},{\"connects\":[2,3,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[34,68],\"center\":[264,336],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[1,1,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[0,-67],\"center\":[344,155],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[0,1,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-14,-63],\"center\":[191,137.5],\"label\":2,\"curved\":false,\"type\":0}],\"textBoxes\":[{\"bbox\":[121.5,134,410.5,338.5,266,236.25],\"name\":\"\",\"color\":0,\"commenttext\":\"<b>Comments for textbox B0</b> <br>\\n\\\\( \\\\alpha = 1 \\\\)\",\"commentjax\":\"\",\"codetext\":\"# Code input/output for B0 \\nalpha = 1;\\n\\n\",\"codeprism\":\"\",\"width\":10},{\"bbox\":[138,389,265.5,438.5,201.75,413.75],\"name\":\"\",\"color\":3,\"commenttext\":\"<b>Comments for textbox B1</b> <br>\\n\\\\( \\\\beta=2\\\\)\",\"commentjax\":\"\",\"codetext\":\"# Code input/output for B1 \\nbeta = 2;\\n\\n\",\"codeprism\":\"\",\"width\":10}],\"mainBoxData\":{\"commenttext\":\"<b>Comments for main </b> <br> \",\"commentjax\":\"\",\"codetext\":\"# Code input/output for main \\n\\n\",\"codeprism\":\"\"},\"indexConfigs\":[{\"plainName\":\"chi\",\"codeName\":\"&#x03C7\",\"dim\":2,\"color\":\"AntiqueWhite\",\"weight\":2,\"style\":\"Solid\"},{\"plainName\":\"beta\",\"codeName\":\"&#x03B2\",\"dim\":4,\"color\":\"Gold\",\"weight\":2,\"style\":\"Dash\"},{\"plainName\":\"zeta\",\"codeName\":\"&#x03B6\",\"dim\":10,\"color\":\"CornflowerBlue\",\"weight\":1,\"style\":\"Dot\"},{\"plainName\":\"m\",\"codeName\":\"m\",\"dim\":2,\"color\":\"Coral\",\"weight\":3,\"style\":\"DashDot\"},{\"plainName\":\"d\",\"codeName\":\"d\",\"dim\":2,\"color\":\"Aquamarine\",\"weight\":4,\"style\":\"Solid\"}],\"numUniqueInds\":3,\"windowPos\":{\"x\":40.25,\"y\":225.25,\"zoom\":2}}"
  } else if (val==0) {
    var allTheData = "{\"tensors\":[{\"type\":2,\"bbox\":[287,528,367,568,327,548],\"name\":\"A\",\"color\":0,\"rot\":0,\"slope\":0,\"xanchors\":[-20,22,-3],\"yanchors\":[20,20,-20],\"connects\":[1,2,-5],\"conj\":false},{\"type\":2,\"bbox\":[489,525,569,565,529,545],\"name\":\"C\",\"color\":2,\"rot\":0,\"slope\":0,\"xanchors\":[-19,30,1],\"yanchors\":[20,20,-20],\"connects\":[3,6,-4],\"conj\":false},{\"type\":2,\"bbox\":[391,420,471,460,431,440],\"name\":\"B\",\"color\":3,\"rot\":0,\"slope\":0,\"xanchors\":[-39,1,38],\"yanchors\":[20,20,20],\"connects\":[15,7,16],\"conj\":false},{\"type\":2,\"bbox\":[375.5,175,455.5,215,415.5,195],\"name\":\"A\",\"color\":0,\"rot\":0,\"slope\":0,\"xanchors\":[-20,22,13],\"yanchors\":[20,20,-19],\"connects\":[8,9,-12],\"conj\":false},{\"type\":2,\"bbox\":[495.5,175,575.5,215,535.5,195],\"name\":\"C\",\"color\":2,\"rot\":0,\"slope\":0,\"xanchors\":[-19,31,-12],\"yanchors\":[20,20,-19],\"connects\":[10,13,-11],\"conj\":false},{\"type\":2,\"bbox\":[435.5,95,515.5,135,475.5,115],\"name\":\"B\",\"color\":3,\"rot\":0,\"slope\":0,\"xanchors\":[-40,1,40],\"yanchors\":[20,20,20],\"connects\":[12,14,11],\"conj\":false},{\"type\":2,\"bbox\":[779,217,859,257,819,237],\"name\":\"A\",\"color\":0,\"rot\":0,\"slope\":0,\"xanchors\":[-18,14,13],\"yanchors\":[20,20,-19],\"connects\":[17,18,-21],\"conj\":false},{\"type\":2,\"bbox\":[899,217,979,257,939,237],\"name\":\"C\",\"color\":2,\"rot\":0,\"slope\":0,\"xanchors\":[-26,-13,14],\"yanchors\":[20,-19,20],\"connects\":[19,-22,20],\"conj\":false},{\"type\":2,\"bbox\":[839,137,919,177,879,157],\"name\":\"B\",\"color\":3,\"rot\":0,\"slope\":0,\"xanchors\":[-40,-3,40],\"yanchors\":[20,20,20],\"connects\":[21,23,22],\"conj\":false},{\"type\":2,\"bbox\":[780,423,860,463,820,443],\"name\":\"A\",\"color\":0,\"rot\":2,\"slope\":0,\"xanchors\":[-16,17,13],\"yanchors\":[-20,-20,19],\"connects\":[-24,-25,28],\"conj\":true},{\"type\":2,\"bbox\":[900,423,980,463,940,443],\"name\":\"C\",\"color\":2,\"rot\":2,\"slope\":0,\"xanchors\":[-24,-13,9],\"yanchors\":[-20,19,-20],\"connects\":[-26,29,-27],\"conj\":true},{\"type\":2,\"bbox\":[840,503,920,543,880,523],\"name\":\"B\",\"color\":3,\"rot\":2,\"slope\":0,\"xanchors\":[-40,-4,40],\"yanchors\":[-20,-20,-20],\"connects\":[-28,-30,-29],\"conj\":true},{\"type\":0,\"bbox\":[789,297,968,359,878.5,328],\"name\":\"H\",\"color\":1,\"rot\":0,\"slope\":0,\"xanchors\":[-75,-42,-3,38,70,-78,-46,-3,34,74],\"yanchors\":[31,31,31,30,31,-31,-31,-31,-31,-31],\"connects\":[24,25,30,-31,27,-17,-18,-23,-19,-20],\"conj\":false},{\"type\":0,\"bbox\":[171.8571428571429,173.62422360248448,322.8571428571429,210.62422360248448,247.3571428571429,192.12422360248448],\"name\":\"psi\",\"color\":4,\"rot\":0,\"slope\":0,\"xanchors\":[-67,-33,1,36,64],\"yanchors\":[19,19,19,19,19],\"connects\":[32,33,34,35,36],\"conj\":false}],\"indices\":[0,{\"connects\":[-1,-1,0,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-20,81],\"center\":[307,598.5],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,0,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[22,80],\"center\":[349,598],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,1,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-19,81],\"center\":[510,595.5],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[1,2,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[2,-68],\"center\":[530.5,501],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[0,2,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-3,-71],\"center\":[324,502.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[-1,-1,1,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[30,80],\"center\":[559,595],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,2,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[1,94],\"center\":[432,497],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,3,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-20,81],\"center\":[395.5,245.5],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,3,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[22,80],\"center\":[437.5,245],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,4,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-19,81],\"center\":[516.5,245.5],\"label\":3,\"curved\":false,\"type\":0},{\"connects\":[4,2,5,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-17,-54],\"center\":[519.5,155.5],\"label\":4,\"curved\":false,\"type\":1},{\"connects\":[3,2,5,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[40,-70],\"center\":[432,155.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[-1,-1,4,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[31,82],\"center\":[566.5,246],\"label\":4,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,5,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[1,160],\"center\":[476.5,205],\"label\":2,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,2,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-39,90],\"center\":[392,495],\"label\":0,\"curved\":false,\"type\":1},{\"connects\":[-1,-1,2,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[38,89],\"center\":[469,494.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[12,5,6,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-18,68],\"center\":[800.75,277],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[12,6,6,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[14,75],\"center\":[832.75,277],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[12,8,7,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-26,67],\"center\":[912.75,277],\"label\":3,\"curved\":false,\"type\":0},{\"connects\":[12,9,7,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[14,67],\"center\":[952.75,277],\"label\":4,\"curved\":false,\"type\":0},{\"connects\":[6,2,8,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[40,-70],\"center\":[835.5,197.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[7,1,8,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-32,-69],\"center\":[922.5,197.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[12,7,8,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-3,147],\"center\":[875.75,237],\"label\":2,\"curved\":false,\"type\":0},{\"connects\":[9,0,12,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-16,-76],\"center\":[803.75,391],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[9,1,12,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[17,-75],\"center\":[836.75,391],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[10,0,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-24,-78],\"center\":[916,394],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[10,2,12,4],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[9,-78],\"center\":[948.75,391],\"label\":4,\"curved\":false,\"type\":0},{\"connects\":[11,0,9,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[40,-70],\"center\":[836.5,482.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[11,2,10,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-32,-69],\"center\":[923.5,482.5],\"label\":2,\"curved\":false,\"type\":1},{\"connects\":[11,1,12,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-4,-155],\"center\":[875.75,431],\"label\":2,\"curved\":false,\"type\":0},{\"connects\":[12,3,-1,-1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[38,30],\"center\":[916.5,358],\"label\":0,\"curved\":false,\"type\":1},{\"connects\":[-1,-1,13,0],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-66.57575757575782,89.96969696969688],\"center\":[180.56926406926397,246.6090720873329],\"label\":0,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,13,1],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[-32.63636363636385,86.09090909090901],\"center\":[214.53896103896096,244.66967814793895],\"label\":1,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,13,2],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[1.3030303030301411,88.03030303030295],\"center\":[248.50865800865796,245.63937511763595],\"label\":2,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,13,3],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[36.212121212121076,88.03030303030295],\"center\":[283.4632034632034,245.63937511763595],\"label\":3,\"curved\":false,\"type\":0},{\"connects\":[-1,-1,13,4],\"name\":\"\",\"dim\":2,\"reversed\":false,\"end\":[64.33333333333326,88.03030303030295],\"center\":[311.5238095238095,245.63937511763595],\"label\":4,\"curved\":false,\"type\":0}],\"textBoxes\":[{\"bbox\":[150.50000000000003,58,599.5,318,375,188],\"name\":\"Wavefunction\",\"color\":0,\"commenttext\":\"State \\\\( \\\\psi \\\\) is obtained be contracting the tree tensor network.\",\"commentjax\":\"\",\"codetext\":\"# Build the wavefuntion 'psi'\\n# from the tensor network\\n\\npsi = ncon([A,B,C],[[-0,-1,1],\\n  [1,-2,2],[-3,-4,2]);\\n\\n\\n\\n\\n\",\"codeprism\":\"\",\"width\":10},{\"bbox\":[255,386,599,662,427,524],\"name\":\"Initialize\",\"color\":1,\"commenttext\":\"Initialize tensors A, B and C as isometries (according to the division between their incoming/outoging indices).\",\"commentjax\":\"\",\"codetext\":\"# Initialization of tensors \\ndef InitializePsi(d, chi):\\n  A = np.random.rand(d**2,chi)\\n  A = (LA.svd(A, full_matrices=False)[0]).reshape(d,d,chi);\\n  \\n  B = random.rand(d*chi**2, 1)\\n  B = B.reshape(chi, d, chi) / LA.norm(B);\\n  \\n  C = np.random.rand(d**2,chi)\\n  C = (LA.svd(C, full_matrices=False)[0]).reshape(d,d,chi);\\n\\n\\n\",\"codeprism\":\"\",\"width\":10},{\"bbox\":[702.5,108,1068.5,597,885.5,352.5],\"name\":\"Optimize\",\"color\":2,\"commenttext\":\"<b>Comments for textbox B2</b> <br>\",\"commentjax\":\"\",\"codetext\":\"# Code input/output for B2 \\n\\ndef Optimize(A, B, C, which=0):\\n  \\n\\n\",\"codeprism\":\"\",\"width\":10}],\"mainBoxData\":{\"commenttext\":\"<b>Tutorial: Main Window</b> <br><span> In this window you can give an overview of your project.</span><ul><li>The text can be <em>styled</em> using HTML tags.</li><li>You can include <a href=\\\"https://www.tensors.net/\\\" target=\\\"_blank\\\">links</a> to other webpages.</li><li>You can include images and figures: </li><div><img src=\\\"https://static.wixstatic.com/media/d91e93_b79424be18bf4c5ba1732b6daa3fff50~mv2.png/v1/fill/w_90,h_84,al_c,q_95,enc_auto/d91e93_b79424be18bf4c5ba1732b6daa3fff50~mv2.png\\\" alt=\\\"\\\" style=\\\"width:90px;height:84px;object-fit:cover;object-position:50% 50%\\\"></div><li>You can include equations using MathJax markup: </li><div style=\\\"width:0; float:left;\\\"> \\\\[x = {-b \\\\pm \\\\sqrt{b^2-4ac} \\\\over 2a}.\\\\]</div></ul><br><br><br><b>Tutorial Project: </b> we will demonstrate how a tree tensor network defining a quantum state \\\\( \\\\left| \\\\psi \\\\right\\\\rangle \\\\) can be optimised for the ground state of a hamiltonian \\\\( H \\\\) on a lattice of \\\\( N=5 \\\\) sites. In order to achieve this we shall minimize the energy \\\\( E = \\\\left\\\\langle \\\\psi \\\\right|H\\\\left| \\\\psi \\\\right\\\\rangle \\\\) using the strategy outlined in&nbsp;<a href=\\\"https://journals.aps.org/prb/abstract/10.1103/PhysRevB.79.144108/\\\" target=\\\"_blank\\\">algorithms for entanglement renormalization</a> based on the singular value decomposition.<br><br><br><br><br><br>\",\"commentjax\":\"\",\"codetext\":\"# define parameters\\nnum_iters = 1000\\nd = 2\\nchi = 3\\n\\n# initialize tensors\\nA, B, C = Initialize(d, chi)\\n\\n# do variational updates\\nfor k in range(num_iters):\\n  A = Optimize(A, B, C, H, which=1)\\n  B = Optimize(A, B, C, H, which=2)\\n  C = Optimize(A, B, C, H, which=3)\\n\\n\\n\\n\",\"codeprism\":\"\"},\"indexConfigs\":[{\"plainName\":\"d\",\"codeName\":\"d\",\"dim\":2,\"color\":\"AntiqueWhite\",\"weight\":2,\"style\":\"Solid\"},{\"plainName\":\"chi\",\"codeName\":\"χ\",\"dim\":4,\"color\":\"Gold\",\"weight\":2,\"style\":\"Dash\"},{\"plainName\":\"zeta\",\"codeName\":\"&#x03B6\",\"dim\":10,\"color\":\"CornflowerBlue\",\"weight\":1,\"style\":\"Dot\"},{\"plainName\":\"m\",\"codeName\":\"m\",\"dim\":2,\"color\":\"Coral\",\"weight\":3,\"style\":\"DashDot\"},{\"plainName\":\"d\",\"codeName\":\"d\",\"dim\":2,\"color\":\"Aquamarine\",\"weight\":4,\"style\":\"Solid\"}],\"numUniqueInds\":2,\"windowPos\":{\"x\":357.5,\"y\":0,\"zoom\":1}}"
  } else if (val==2) {
    var allTheData = "";
  }
  
  doLoadTheData(allTheData);
  
  windowWidth = viewWidth / windowPos.zoom;
  windowHeight = viewHeight / windowPos.zoom;
  if ((windowPos.x + windowWidth) > spaceWidth) {
    windowPos.x = spaceWidth - windowWidth;
  }
  if ((windowPos.y + windowHeight) > spaceHeight) {
    windowPos.y = spaceHeight - windowHeight;
  }
  
  commentBox.addEventListener('focusin', function(e) {
  if (whichBoxActive>=0) {
    commentBox.innerText = textBoxes[whichBoxActive].commenttext;
  } else {
    commentBox.innerText = mainBoxData.commenttext;
  }
});

commentBox.addEventListener('focusout', function(e) {
  commentBoxStatic.innerHTML = commentBox.innerText;
  if (whichBoxActive>=0) {
    textBoxes[whichBoxActive].commenttext = commentBoxStatic.innerHTML;
    MathJax.typeset();
    textBoxes[whichBoxActive].commentjax = commentBoxStatic.innerHTML;
  } else {
    mainBoxData.commenttext = commentBoxStatic.innerHTML;
    MathJax.typeset();
    mainBoxData.commentjax = commentBoxStatic.innerHTML;
  }
  commentBox.style.display = "none";
  commentBoxStatic.style.display = "block";
});

  whichBoxActive = -1;
  doRightUnselect();
  updateCommentBoxTitles();
  updateTensorTags();
  updateTextBoxTags();
  updateTextBoxes();
  findOpenIndices();
  resizeCanvas();
  drawGrid();
  drawMinimap();
  drawTensors();
}

function doLoadTheData(allTheData) {
  if (allTheData.length > 0) {
    var clipData = JSON.parse(allTheData);
    tensors = clipData.tensors;
    indices = clipData.indices;
    textBoxes = clipData.textBoxes;
    mainBoxData = clipData.mainBoxData;
    indexConfigs = clipData.indexConfigs;
    numUniqueInds = clipData.numUniqueInds;
    windowPos = clipData.windowPos;
  }
}


