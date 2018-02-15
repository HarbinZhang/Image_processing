

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

	$('#T_selector').bind('input',function(e){
      var x = parseInt($('#T_selector').val());
      $('#T_val').html(Math.pow(2,x));
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

	// dims[0] = 8;
	// dims[1] = 8;
	// X = ones(4,4);

	var X = greyImage.getData();
	var M = dims[0];

	var Md = $('#T_selector').val();
	Md = Math.pow(2,Md);
	// var Md = 16;

	// FFT.init(dims[0]);

	// var FXre = new Array(dims[0] * dims[1]);
	// var FXim = new Array(dims[0] * dims[1]);

	// FXre.fill(0.0);
	// FXim.fill(0.0);

	// var FX_idx = 0;
	// for( var y = 0; y < X.length; y++ ){
	// 	FX_idx = y * M;
	// 	for(var x = 0; x < X[0].length; x++){
	// 		FXre[FX_idx++] = X[y][x];
	// 	}
	// }

	// console.log(FXre);

	var FX = fft2d(X, M);
	var FXre = FX.re;
	var FXim = FX.im;

	console.log(FXim);

	// FFT.fft2d(FXre, FXim);

	// console.log(FXre);

	// var what = fft2d(ones(5,5), 5);
	// // console.log(what.re);
	// var what = ifft2d(what.re,what.im, 8);
	// console.log(what);
	// return;




	// console.log("FXre:", FXre);
	// console.log("FXim:", FXim);
	// console.log("FXre:", FXre.map(x => x*M/Md));
	// console.log("FXim:", FXim.map(x => x*M/Md));

	var MM = [];

	if(Md % 2 == 0){
		for(var i = 0; i < Md/2; i++){MM.push(i);}
			MM.push(-1);
		for(var i = M+1-Md/2; i < M; i++){MM.push(i);}

	}else{
		for(var i = 0; i < (Md+1)/2; i++){MM.push(i);}
		for(var i = M+1-(Md+1)/2; i < M; i++){MM.push(i);}
	}

	console.log(MM);

	FYre = [];
	FYim = [];
	for(var i = 0; i < Md; i ++){
		var base = MM[i] * M;
		for(var j = 0; j < Md; j ++){
			if(MM[i] == -1 || MM[j] == -1){
				FYre.push(0);
				FYim.push(0);
				continue;
			}
			FYre.push(FXre[base + MM[j]]*M/Md);
			FYim.push(FXim[base + MM[j]]*M/Md);
		}
	}


	// return;


	var DownSampled = ifft2d(FYre, FYim, Md);
	DownSampled = clamp(DownSampled);



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
