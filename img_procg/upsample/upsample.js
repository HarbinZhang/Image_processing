

var dims = [-1, -1];
var cc = 9e-3;

var canvases;
var ctxs;
var Y;
var H;
var M1;

var start;

var greyImage;

var Mu = 256;

window.onload = function(){
	init();
}

var init = function() {
	canvases = [], ctxs = [];

	$('#T_selector').bind('input',function(e){
      var x = parseInt($('#T_selector').val());
      $('#T_val').html(x);
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
		// for( var i = 0; i < 2; i++){
		// 	canvases[i] = $s('#canvas' + i);
		// 	canvases[i].width = dims[0];
		// 	canvases[i].height = dims[1];
		// 	ctxs[i] = canvases[i].getContext('2d');
		// }

		canvases[0] = $s('#canvas' + 0);
		canvases[0].width = dims[0];
		canvases[0].height = dims[1];
		ctxs[0] = canvases[0].getContext('2d');		

		canvases[1] = $s('#canvas' + 1);
		canvases[1].width = 256;
		canvases[1].height = 256;
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
	var M = dims[0];
	Mu = $('#T_selector').val();
	Mu = 256*Math.pow(2,Mu-1);

	// FFT.init(dims[0]);

	// var FXre = new Array(dims[0] * dims[1]);
	// var FXim = new Array(dims[0] * dims[1]);

	// FXre.fill(0.0);
	// FXim.fill(0.0);

	// var FX_idx = 0;
	// for( var y = 0; y < X.length; y++ ){
	// 	for(var x = 0; x < X[0].length; x++){
	// 		FXre[FX_idx++] = X[y][x];
	// 	}
	// }
	// console.log(FXre);

	// console.log(what.re);

	var FX = fft2d(X, M);
	var FXre = FX.re;
	var FXim = FX.im;


	// FFT.fft2d(FXre, FXim);



	var MU = [];
	var MM = [];

	var FYre = new Array(Mu*Mu);
	var FYim = new Array(Mu*Mu);
	FYre.fill(0);
	FYim.fill(0);

	// for(var i = 0; i < Mu; i++){
	// 	FYre[i] = new Array(Mu);
	// 	FYim[i] = new Array(Mu);
	// }

	// console.log(FYre);


	if(Mu % 2 == 0){
		for(var i = 0; i < (Mu+1)/2; i++){MU.push(i);}
		for(var i = Mu+1-M/2; i < Mu; i++){MU.push(i);}
		for(var i = 0; i < (Mu+1)/2; i++){MM.push(i);}
		for(var i = M/2+1; i < M; i++){MM.push(i);}			

		for(var i = 0; i < M; i ++){
			var baseY = MU[i] * M;
			var baseX = MM[i] * M;
			for(var j = 0; j < M; j ++){
				FYre[baseY + MU[j]] = FXre[baseX + j]*Mu/M;
				FYim[baseY + MU[j]] = FXim[baseX + j]*Mu/M;
			}
		}


	}else{


		for(var i = 0; i < M/2; i++){MU.push(i);}
		for(var i = Mu+1-(M+1)/2; i < Mu; i++){MU.push(i);}


		for(var i = 0; i < M; i ++){
			var baseY = MU[i] * M;
			var baseX = i * M;
			for(var j = 0; j < M; j ++){
				FYre[baseY + MU[j]] = FXre[baseX + j]*Mu/M;
				FYim[baseY + MU[j]] = FXim[baseX + j]*Mu/M;
			}
		}

	}





	var UpSampled = ifft2d(FYre, FYim, Mu);
	UpSampled = clamp(UpSampled);
	console.log(UpSampled);

	// FFT.ifft2d(what.re, what.im);




    canvases[1].width = Mu;
    canvases[1].height = Mu;
    ctxs[1] = canvases[1].getContext('2d');
    
    // draw the pixels
    var currImageData = ctxs[1].getImageData(
      0, 0, Mu, Mu
    );

    // var rate = dims[0] / Mu;
    for (var k = 0; k < Mu; k++) {
      for (var l = 0; l < Mu; l++) {
        var idxInPixels = 4*(dims[0]*k + l);
        currImageData.data[idxInPixels+3] = 255; // full alpha
        // RGB are the same -> gray
        for (var c = 0; c < 3; c++) { // lol c++
          // currImageData.data[idxInPixels+c] = UpSampled[Math.round(k*rate) * Mu + Math.round(l*rate)];
          currImageData.data[idxInPixels+c] = UpSampled[k*dims[1] + l];
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
