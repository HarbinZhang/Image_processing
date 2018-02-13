

var dims = [-1, -1];
var cc = 9e-3;

var canvases;
var ctxs;
var Y;
var H;
var M1;

var start;

var greyImage;

window.onload = function(){
	init();
}

var init = function() {
	canvases = [], ctxs = [];

	$('#Md_selector').bind('input',function(e){
      var x = parseInt($('#Md_selector').val());
      $('#Md_val').html(x);
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
		for( var i = 0; i < 2; i++){
			canvases[i] = $s('#canvas' + i);
			canvases[i].width = dims[0];
			canvases[i].height = dims[1];
			ctxs[i] = canvases[i].getContext('2d');
		}

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

	// var Md = $('#Md_selector').val();




	var N = dims[0];
	var theta = Math.PI/6;

	if(N % 2 == 0){
		for(var i = 0; i < X.length; i++){
			X[i].push(0);
		}
		var temp = new Array(X[0].length);
		X.push(temp);
	}


	var SN = Math.round(Math.sqrt(2) * N);
	X = zeroPad(X, SN, SN);
	Y = zeros(SN, SN);


	var A = [[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]];

	var I = [];
	for(var i = 0; i < N; i++){
		for(var j = 0; j < N; j++){
			I.push([i,j]);
		}
	}

	var IS = (N+1) / 2;
	var JS = Math.round(IS * Math.sqrt(2));
	var II = I.map(row => row.map(ceil => ceil - IS));

	var J = matrix_multi()

	console.log(II);
	return;




    // draw the pixels
    var currImageData = ctxs[1].getImageData(
      0, 0, dims[0], dims[1]
    );
    
    var rate = Md / dims[0];
    for (var k = 0; k < dims[1]; k++) {
      for (var l = 0; l < dims[0]; l++) {
        var idxInPixels = 4*(dims[0]*k + l);
        currImageData.data[idxInPixels+3] = 255; // full alpha
        // RGB are the same -> gray
        for (var c = 0; c < 3; c++) { // lol c++
          currImageData.data[idxInPixels+c] = DownSampled[Math.floor(k*rate) * Md + Math.floor(l*rate)];
          // currImageData.data[idxInPixels+c] = what.re[k*M + l];
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
