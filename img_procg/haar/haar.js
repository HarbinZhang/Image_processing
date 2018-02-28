

var dims = [-1, -1];
var cc = 9e-3;

var canvases;
var ctxs;
var X;
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



    $('#sigma_selector').bind('input',function(e){
      var x = parseInt($('#sigma_selector').val());
      $('#sigma_val').html(x);
      start = +new Date();
      transformAction();
      // reconstructAction();
    });


    $('#lambda_selector').bind('input',function(e){
      var x = parseInt($('#lambda_selector').val());
      $('#lambda_val').html(x);
      start = +new Date();
      transformAction();
      // reconstructAction();
    });


    loadImage('clown.png');



}


var loadImage = function(loc){
	start = +new Date();

	var img = new Image();
	img.addEventListener('load', function(){
		dims[0] = img.width;
		dims[1] = img.height;
		for( var i = 0; i < 3; i++){
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

	var sigma = parseInt($('#sigma_selector').val());
	var lambda = parseInt($('#lambda_selector').val());
	X = greyImage.getData();

	// X = [];
	// for(var i = 1; i < 257; i++){
	// 	var temp = [];
	// 	for(var j = 1; j < 257; j++){
	// 		temp.push(j);
	// 	}
	// 	X.push(temp);
	// }
	// console.log(sigma,lambda);
	// var sigma = 20;
	// var lambda = 20;

	var N = dims[0];

	var Y = matrix_add(X, randn(N, N, sigma));

	var T = lambda;

	var ZLL0 = Y;

	// 1st stage decomposition
	var ZLL1 = ZLL(ZLL0);
	var ZLH1 = ZLH(ZLL0);
	var ZHL1 = ZHL(ZLL0);
	var ZHH1 = ZHH(ZLL0);

	// 2nd stage decomposition
	var ZLL2 = ZLL(ZLL1);
	var ZLH2 = ZLH(ZLL1);
	var ZHL2 = ZHL(ZLL1);
	var ZHH2 = ZHH(ZLL1);


	// 3rd stage decomposition
	var ZLL3 = ZLL(ZLL2);
	var ZLH3 = ZLH(ZLL2);
	var ZHL3 = ZHL(ZLL2);
	var ZHH3 = ZHH(ZLL2);



	// 4th stage decomposition
	var ZLL4 = ZLL(ZLL3);
	var ZLH4 = ZLH(ZLL3);
	var ZHL4 = ZHL(ZLL3);
	var ZHH4 = ZHH(ZLL3);

	var ZZ = matrix_append_vertical(
		matrix_append_horizontal(ZLL4, ZLH4), matrix_append_horizontal(ZHL4, ZHH4));

	ZZ = matrix_append_vertical(
		matrix_append_horizontal(ZZ, ZLH3), matrix_append_horizontal(ZHL3, ZHH3));

	ZZ = matrix_append_vertical(
		matrix_append_horizontal(ZZ, ZLH2), matrix_append_horizontal(ZHL2, ZHH2));

	ZZ = matrix_append_vertical(
		matrix_append_horizontal(ZZ, ZLH1), matrix_append_horizontal(ZHL1, ZHH1));




    // draw the pixels
    var currImageData = ctxs[1].getImageData(
      0, 0, dims[0], dims[1]
    );
    
    for (var k = 0; k < dims[1]; k++) {
      for (var l = 0; l < dims[0]; l++) {
        var idxInPixels = 4*(dims[0]*k + l);
        currImageData.data[idxInPixels+3] = 255; // full alpha
        // RGB are the same -> gray
        for (var c = 0; c < 3; c++) { // lol c++
          currImageData.data[idxInPixels+c] = ZZ[k][l];
        }
      }
    }
    ctxs[1].putImageData(currImageData, 0, 0);
 
    var duration = +new Date() - start;
    console.log('It took '+duration+'ms to compute the 2-D db3 wavelet wavelet.');


    ZLH1 = shrinkByT(ZLH1, T);
    ZHL1 = shrinkByT(ZHL1, T);
    ZHH1 = shrinkByT(ZHH1, T);
    ZLH2 = shrinkByT(ZLH2, T);
    ZHL2 = shrinkByT(ZHL2, T);
    ZHH2 = shrinkByT(ZHH2, T);
    ZLH3 = shrinkByT(ZLH3, T);
    ZHL3 = shrinkByT(ZHL3, T);
    ZHH3 = shrinkByT(ZHH3, T);        


    var WLL2 = inverseHaarHelper(ZLL3, ZLH3, ZHL3, ZHH3);
    var WLL1 = inverseHaarHelper(WLL2, ZLH2, ZHL2, ZHH2);
    var W = inverseHaarHelper(WLL1, ZLH1, ZHL1, ZHH1);


	// console.log(matrix_sum(W));
	// // console.log(ZLH1);
	// return;

    // draw the pixels
    var currImageData = ctxs[2].getImageData(
      0, 0, dims[0], dims[1]
    );
    
    for (var k = 0; k < dims[1]; k++) {
      for (var l = 0; l < dims[0]; l++) {
        var idxInPixels = 4*(dims[0]*k + l);
        currImageData.data[idxInPixels+3] = 255; // full alpha
        // RGB are the same -> gray
        for (var c = 0; c < 3; c++) { // lol c++
          currImageData.data[idxInPixels+c] = W[k][l];
        }
      }
    }
    ctxs[2].putImageData(currImageData, 0, 0);
 
    var duration = +new Date() - start;
    console.log('It took '+duration+'ms to compute the 2-D db3 wavelet wavelet.');


    return;
}






function $s(id) {
	if (id.charAt(0) !== '#') return false;
	return document.getElementById(id.substring(1));
}



function prePadding(X, start, end){
	var res = [];
	for(var i = 0; i < X.length; i++){
		res.push(X[i].slice(start, end).concat(X[i]));
	}
	return res;
}

function postPadding(X, start, end){
	var res = [];
	for(var i = 0; i < X.length; i++){
		res.push(X[i].concat(X[i].slice(start, end)));
	}
	return res;
}


function subColumnScale(X, start, end, step, scale){
	var res = [];
	for(var i = 0; i < X.length; i++){
		var temp = [];
		for(var j = start; j < end; j += step){
			temp.push(X[i][j] * scale);
		}
		res.push(temp);
	}
	return res;	
}


function subColumn(X, start, end, step){
	var res = [];
	for(var i = 0; i < X.length; i++){
		var temp = [];
		for(var j = start; j < end; j += step){
			temp.push(X[i][j]);
		}
		res.push(temp);
	}
	return res;
}

function shrinkByT(X, T){
	for(var i = 0; i < X.length; i++){
		for(var j = 0; j < X[0].length; j++){
			if(Math.abs(X[i][j]) <= T){X[i][j] = 0;}
			if(X[i][j] > T){X[i][j] -= T;}
			if(X[i][j] < -T){X[i][j] += T;}
		}
	}
	return X;
}

function reconstruct(K, G, H, ZZ){
	var A = new Array(ZZ.length);
	for(var i = 0; i < A.length; i++){
		// A[i] = new Array(ZZ[0].length-3);
		A[i] = new Array(K);
		A[i].fill(0);
	}

	for(var i = 0; i < ZZ.length; i++){
		for(var j = 0; j*2 < K; j++){
			A[i][j*2] = G[0]*ZZ[i][j] + G[2]*ZZ[i][j+1] + G[4]*ZZ[i][j+2];
		}
		for(var j = 0; j*2+1 < K; j++){
			A[i][j*2+1] = G[1]*ZZ[i][j+1] + G[3]*ZZ[i][j+2] + G[5]*ZZ[i][j+3];
		}
	}


	A = transpose(A);
	AA = postPadding(A, 0, 3);

	// console.log(matrix_sum(AA));
	for(var i = 0; i < AA.length; i++){
		for(var j = 0; j*2 < K; j++){
			A[i][j*2] = H[0]*AA[i][j] + H[2]*AA[i][j+1] + H[4]*AA[i][j+2];
		}
		for(var j = 0; j*2+1 < K; j++){
			A[i][j*2+1] = H[1]*AA[i][j+1] + H[3]*AA[i][j+2] + H[5]*AA[i][j+3];
		}
	}

	// console.log(A)

	return A;
}

function ZLL(X){
	var N = X.length;
	var M = X[0].length;

	var res = new Array(N/2);
	for(var i = 0; i < N/2; i++){
		res[i] = new Array(M/2);
	}

	for(var i = 0; i < res.length; i++){
		for(var j = 0;j < res[i].length; j++){
			res[i][j] = X[2*i][2*j] + X[2*i+1][2*j] + X[2*i][2*j+1] + X[2*i+1][2*j+1];
			res[i][j] /= 2;
		}
	}

	return res;
}

function ZLH(X){
	var N = X.length;
	var M = X[0].length;

	var res = new Array(N/2);
	for(var i = 0; i < N/2; i++){
		res[i] = new Array(M/2);
	}

	for(var i = 0; i < res.length; i++){
		for(var j = 0;j < res[i].length; j++){
			res[i][j] = -X[2*i][2*j] - X[2*i+1][2*j] + X[2*i][2*j+1] + X[2*i+1][2*j+1];
			res[i][j] /= 2;
		}
	}

	return res;
}

function ZHL(X){
	var N = X.length;
	var M = X[0].length;

	var res = new Array(N/2);
	for(var i = 0; i < N/2; i++){
		res[i] = new Array(M/2);
	}

	for(var i = 0; i < res.length; i++){
		for(var j = 0;j < res[i].length; j++){
			res[i][j] = -X[2*i][2*j] + X[2*i+1][2*j] - X[2*i][2*j+1] + X[2*i+1][2*j+1];
			res[i][j] /= 2;
		}
	}

	return res;
}

function ZHH(X){
	var N = X.length;
	var M = X[0].length;

	var res = new Array(N/2);
	for(var i = 0; i < N/2; i++){
		res[i] = new Array(M/2);
	}

	for(var i = 0; i < res.length; i++){
		for(var j = 0;j < res[i].length; j++){
			res[i][j] = X[2*i][2*j] - X[2*i+1][2*j] - X[2*i][2*j+1] + X[2*i+1][2*j+1];
			res[i][j] /= 2;
		}
	}

	return res;
}

function inverseHaarHelper(ZLL, ZLH, ZHL, ZHH){
	res = new Array(ZLL.length * 2);
	for(var i = 0; i < res.length; i++){
		res[i] = new Array(ZLL[0].length * 2);
	}

	for(var i = 0; i < ZLL.length; i++){
		for(var j = 0; j < ZLH[0].length; j++){
			res[2*i+1][2*j+1] = (ZLL[i][j] + ZLH[i][j] + ZHL[i][j] + ZHH[i][j]) / 2;
			res[2*i+1][2*j] = (ZLL[i][j] - ZLH[i][j] + ZHL[i][j] - ZHH[i][j]) / 2;
			res[2*i][2*j+1] = (ZLL[i][j] + ZLH[i][j] - ZHL[i][j] - ZHH[i][j]) / 2;
			res[2*i][2*j] = (ZLL[i][j] - ZLH[i][j] - ZHL[i][j] + ZHH[i][j]) / 2;
		}
	}

	return res;
}
