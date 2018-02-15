

var dims = [-1, -1];
var cc = 9e-3;

var canvases;
var ctxs;
var Y;
var H;
var M1;

var start;

var greyImage;

var SN = Math.round(Math.sqrt(2) * 256);

window.onload = function(){
	init();
}

var init = function() {
	canvases = [], ctxs = [];

	$('#theta_selector').bind('input',function(e){
      var x = parseInt($('#theta_selector').val());
      $('#theta_val').html(x);
      start = +new Date();
      transformAction();
    });

    loadImage('clown.png');
}


var loadImage = function(loc){
	start = +new Date();

	var img = new Image();
	img.addEventListener('load', function(){
		dims[0] = img.width;
		dims[1] = img.height;


		canvases[0] = $s('#canvas' + 0);
		canvases[0].width = dims[0];
		canvases[0].height = dims[1];
		ctxs[0] = canvases[0].getContext('2d');


		canvases[1] = $s('#canvas' + 1);
		canvases[1].width = SN;
		canvases[1].height = SN;
		ctxs[1] = canvases[1].getContext('2d');


		ctxs[0].drawImage(img, 0, 0, img.width, img.height);

		var imageData = ctxs[0].getImageData(0, 0, dims[0], dims[1]);


		greyImage = new GreyImage(img.width, img.height, imageData.data);

		console.log(greyImage);

		var h_es = [];
		for(var i = 0; i < imageData.data.length; i+=4){
			h_es.push(imageData.data[i]);
		}

		h = function(n, m){
			if(arguments.length === 0) return h_es;

			var idx = n * dims[0] + m;
			return h_es[idx];
		};

		// enableButtons();

		var duration = +new Date() - start; // unary add
		console.log('It took ' + duration + 'ms to draw the image.');
		transformAction();
	});
	img.crossOrigin = "anonymous";
	img.src = loc;
}

function transformAction() {

	var X = greyImage.getData();

	var theta = $('#theta_selector').val();

	theta = Math.PI * theta / 180;

	var N = dims[0];

	if(N % 2 == 0){
		for(var i = 0; i < X.length; i++){
			X[i].push(0);
		}
		var temp = new Array(X[0].length);
		X.push(temp);
	}


	
	X = zeroPad(X, SN, SN);
	Y = zeros(SN, SN);


	var A = [[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]];

	// console.log(Math.cos(theta));

	// return ;

	var I = [];
	for(var i = 0; i < N; i++){
		for(var j = 0; j < N; j++){
			I.push([i,j]);
		}
	}

	var IS = (N+1) / 2;
	var JS = Math.round(IS * Math.sqrt(2));
	var II = I.map(row => row.map(ceil => ceil - IS));

	var J = matrix_multi(II, A);
	J = J.map(row => row.map(ceil => Math.round(ceil) + JS));

	// Y(SN*(J(:,1)-1)+J(:,2))=X(SN*(I(:,1)-1)+I(:,2))

	for(var i = 0; i < I.length; i++){
		var idx_X = SN*(I[i][0]) + I[i][1];
		var idx_Y = SN*(J[i][0]-1) + J[i][1];

		try{
			var row = idx_Y/SN;
			row = Math.min(row, 361);
			row = Math.max(row, 0);
			Y[Math.floor(row)][idx_Y%SN] = X[Math.floor(idx_X/SN)][idx_X%SN];
		}catch(e){
			console.log(Math.floor(SN));
			console.log(e);
		}
		
	}

	// console.log(Y);




    // draw the pixels
    var currImageData = ctxs[1].getImageData(
      0, 0, SN, SN
    );
    
    for (var k = 0; k < SN; k++) {
      for (var l = 0; l < SN; l++) {
        var idxInPixels = 4*(SN*k + l);
        currImageData.data[idxInPixels+3] = 255; // full alpha
        // RGB are the same -> gray
        for (var c = 0; c < 3; c++) { // lol c++
          currImageData.data[idxInPixels+c] = Y[k][l];
        }
      }
    }
    ctxs[1].putImageData(currImageData, 0, 0);
 
 
    var duration = +new Date() - start;
    console.log('It took '+duration+'ms.');

    return;
}




function $s(id) {
	if (id.charAt(0) !== '#') return false;
	return document.getElementById(id.substring(1));
}
