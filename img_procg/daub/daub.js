

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

	var sigma = $('#sigma_selector').val();
	var lambda = $('#lambda_selector').val();
	X = greyImage.getData();

	// X = [];
	// for(var i = 1; i < 257; i++){
	// 	var temp = [];
	// 	for(var j = 1; j < 257; j++){
	// 		temp.push(j);
	// 	}
	// 	X.push(temp);
	// }

	var N = dims[0];
	var Y = X + randn(N, N, sigma);

	var T = lambda;


	var G=[0.47046721,1.14111692,0.650365, -0.19093442,-0.12083221,0.0498175];

	var normG = norm(G);
	G = G.map(x => x/normG);
	var L = G.length;

	H = [];
	for(var i = G.length - 1; i >= 0; i--){
		H.push(Math.pow(-1, i+1) * G[i]);
	}


	var XXLL0 = prePadding(X, X[0].length - L + 1, X[0].length);
 


	var XLL1 = matrix_add(matrix_add(subColumnScale(XXLL0, L-1, XXLL0[0].length-1, 2, G[0]),
				subColumnScale(XXLL0, L-2, XXLL0[0].length-2, 2, G[1])),
				subColumnScale(XXLL0, L-3, XXLL0[0].length-3, 2, G[2]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL0, L-4, XXLL0[0].length-4, 2, G[3]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL0, L-5, XXLL0[0].length-5, 2, G[4]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL0, L-6, XXLL0[0].length-6, 2, G[5]));



	var XHH1 = matrix_add(matrix_add(subColumnScale(XXLL0, L-1, XXLL0[0].length-1, 2, H[0]),
				subColumnScale(XXLL0, L-2, XXLL0[0].length-2, 2, H[1])),
				subColumnScale(XXLL0, L-3, XXLL0[0].length-3, 2, H[2]));
	XHH1 = matrix_add(XHH1, subColumnScale(XXLL0, L-4, XXLL0[0].length-4, 2, H[3]));
	XHH1 = matrix_add(XHH1, subColumnScale(XXLL0, L-5, XXLL0[0].length-5, 2, H[4]));
	XHH1 = matrix_add(XHH1, subColumnScale(XXLL0, L-6, XXLL0[0].length-6, 2, H[5]));


	XLL1 = transpose(XLL1);
	XHH1 = transpose(XHH1);


	var XXLL1 = prePadding(XLL1, XLL1[0].length-L+1, XLL1[0].length);
	var XXHH1 = prePadding(XHH1, XHH1[0].length-L+1, XHH1[0].length);


	XLL1 = matrix_add(matrix_add(subColumnScale(XXLL1, L-1, XXLL1[0].length-1, 2, G[0]),
				subColumnScale(XXLL1, L-2, XXLL1[0].length-2, 2, G[1])),
				subColumnScale(XXLL1, L-3, XXLL1[0].length-3, 2, G[2]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL1, L-4, XXLL1[0].length-4, 2, G[3]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL1, L-5, XXLL1[0].length-5, 2, G[4]));
	XLL1 = matrix_add(XLL1, subColumnScale(XXLL1, L-6, XXLL1[0].length-6, 2, G[5]));


	// may be problem
	XHH1 = matrix_add(matrix_add(subColumnScale(XXHH1, L-1, XXHH1[0].length-1, 2, H[0]),
				subColumnScale(XXHH1, L-2, XXHH1[0].length-2, 2, H[1])),
				subColumnScale(XXHH1, L-3, XXHH1[0].length-3, 2, H[2]));

	XHH1 = matrix_add(XHH1, subColumnScale(XXHH1, L-4, XXHH1[0].length-4, 2, H[3]));
	XHH1 = matrix_add(XHH1, subColumnScale(XXHH1, L-5, XXHH1[0].length-5, 2, H[4]));
	XHH1 = matrix_add(XHH1, subColumnScale(XXHH1, L-6, XXHH1[0].length-6, 2, H[5]));




	var XHL1 = matrix_add(matrix_add(subColumnScale(XXLL1, L-1, XXLL1[0].length-1, 2, H[0]),
				subColumnScale(XXLL1, L-2, XXLL1[0].length-2, 2, H[1])),
				subColumnScale(XXLL1, L-3, XXLL1[0].length-3, 2, H[2]));

	XHL1 = matrix_add(XHL1, subColumnScale(XXLL1, L-4, XXLL1[0].length-4, 2, H[3]));
	XHL1 = matrix_add(XHL1, subColumnScale(XXLL1, L-5, XXLL1[0].length-5, 2, H[4]));
	XHL1 = matrix_add(XHL1, subColumnScale(XXLL1, L-6, XXLL1[0].length-6, 2, H[5]));


	var XLH1 = matrix_add(matrix_add(subColumnScale(XXHH1, L-1, XXHH1[0].length-1, 2, G[0]),
				subColumnScale(XXHH1, L-2, XXHH1[0].length-2, 2, G[1])),
				subColumnScale(XXHH1, L-3, XXHH1[0].length-3, 2, G[2]));
	XLH1 = matrix_add(XLH1, subColumnScale(XXHH1, L-4, XXHH1[0].length-4, 2, G[3]));
	XLH1 = matrix_add(XLH1, subColumnScale(XXHH1, L-5, XXHH1[0].length-5, 2, G[4]));
	XLH1 = matrix_add(XLH1, subColumnScale(XXHH1, L-6, XXHH1[0].length-6, 2, G[5]));


	XLL1 = transpose(XLL1);
	XHH1 = transpose(XHH1);
	XHL1 = transpose(XHL1);
	XLH1 = transpose(XLH1);


	// console.log(matrix_sum(XHH1));
	// return;
	// 2nd Stage db3 Daubechies Wavelet Transform:
	XXLL1 = prePadding(XLL1, XLL1[0].length-L+1, XLL1[0].length);

	var XLL2 = matrix_add(matrix_add(subColumnScale(XXLL1, L-1, XXLL1[0].length-1, 2, G[0]),
				subColumnScale(XXLL1, L-2, XXLL1[0].length-2, 2, G[1])),
				subColumnScale(XXLL1, L-3, XXLL1[0].length-3, 2, G[2]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL1, L-4, XXLL1[0].length-4, 2, G[3]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL1, L-5, XXLL1[0].length-5, 2, G[4]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL1, L-6, XXLL1[0].length-6, 2, G[5]));


	var XHH2 = matrix_add(matrix_add(subColumnScale(XXLL1, L-1, XXLL1[0].length-1, 2, H[0]),
				subColumnScale(XXLL1, L-2, XXLL1[0].length-2, 2, H[1])),
				subColumnScale(XXLL1, L-3, XXLL1[0].length-3, 2, H[2]));

	XHH2 = matrix_add(XHH2, subColumnScale(XXLL1, L-4, XXLL1[0].length-4, 2, H[3]));
	XHH2 = matrix_add(XHH2, subColumnScale(XXLL1, L-5, XXLL1[0].length-5, 2, H[4]));
	XHH2 = matrix_add(XHH2, subColumnScale(XXLL1, L-6, XXLL1[0].length-6, 2, H[5]));


	XLL2 = transpose(XLL2);
	XHH2 = transpose(XHH2);


	var XXLL2 = prePadding(XLL2, XLL2[0].length - L + 1, XLL2[0].length);
	var XXHH2 = prePadding(XHH2, XHH2[0].length-L+1, XHH2[0].length);

	XLL2 = matrix_add(matrix_add(subColumnScale(XXLL2, L-1, XXLL2[0].length-1, 2, G[0]),
				subColumnScale(XXLL2, L-2, XXLL2[0].length-2, 2, G[1])),
				subColumnScale(XXLL2, L-3, XXLL2[0].length-3, 2, G[2]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL2, L-4, XXLL2[0].length-4, 2, G[3]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL2, L-5, XXLL2[0].length-5, 2, G[4]));
	XLL2 = matrix_add(XLL2, subColumnScale(XXLL2, L-6, XXLL2[0].length-6, 2, G[5]));


	XHH2 = matrix_add(matrix_add(subColumnScale(XXHH2, L-1, XXHH2[0].length-1, 2, H[0]),
				subColumnScale(XXHH2, L-2, XXHH2[0].length-2, 2, H[1])),
				subColumnScale(XXHH2, L-3, XXHH2[0].length-3, 2, H[2]));
	XHH2 = matrix_add(XHH2, subColumnScale(XXHH2, L-4, XXHH2[0].length-4, 2, H[3]));
	XHH2 = matrix_add(XHH2, subColumnScale(XXHH2, L-5, XXHH2[0].length-5, 2, H[4]));
	XHH2 = matrix_add(XHH2, subColumnScale(XXHH2, L-6, XXHH2[0].length-6, 2, H[5]));


	var XHL2 = matrix_add(matrix_add(subColumnScale(XXLL2, L-1, XXLL2[0].length-1, 2, H[0]),
				subColumnScale(XXLL2, L-2, XXLL2[0].length-2, 2, H[1])),
				subColumnScale(XXLL2, L-3, XXLL2[0].length-3, 2, H[2]));
	XHL2 = matrix_add(XHL2, subColumnScale(XXLL2, L-4, XXLL2[0].length-4, 2, H[3]));
	XHL2 = matrix_add(XHL2, subColumnScale(XXLL2, L-5, XXLL2[0].length-5, 2, H[4]));
	XHL2 = matrix_add(XHL2, subColumnScale(XXLL2, L-6, XXLL2[0].length-6, 2, H[5]));


	var XLH2 = matrix_add(matrix_add(subColumnScale(XXHH2, L-1, XXHH2[0].length-1, 2, G[0]),
				subColumnScale(XXHH2, L-2, XXHH2[0].length-2, 2, G[1])),
				subColumnScale(XXHH2, L-3, XXHH2[0].length-3, 2, G[2]));
	XLH2 = matrix_add(XLH2, subColumnScale(XXHH2, L-4, XXHH2[0].length-4, 2, G[3]));
	XLH2 = matrix_add(XLH2, subColumnScale(XXHH2, L-5, XXHH2[0].length-5, 2, G[4]));
	XLH2 = matrix_add(XLH2, subColumnScale(XXHH2, L-6, XXHH2[0].length-6, 2, G[5]));


	XLL2 = transpose(XLL2);
	XHH2 = transpose(XHH2);
	XHL2 = transpose(XHL2);
	XLH2 = transpose(XLH2);


	// console.log(matrix_sum(XHL2));
	// return;

	// 3rd Stage db3 Daubechies Wavelet Transform:
	XXLL2 = prePadding(XLL2, XLL2[0].length - L + 1, XLL2[0].length);

	var XLL3 = matrix_add(matrix_add(subColumnScale(XXLL2, L-1, XXLL2[0].length-1, 2, G[0]),
				subColumnScale(XXLL2, L-2, XXLL2[0].length-2, 2, G[1])),
				subColumnScale(XXLL2, L-3, XXLL2[0].length-3, 2, G[2]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL2, L-4, XXLL2[0].length-4, 2, G[3]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL2, L-5, XXLL2[0].length-5, 2, G[4]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL2, L-6, XXLL2[0].length-6, 2, G[5]));


	var XHH3 = matrix_add(matrix_add(subColumnScale(XXLL2, L-1, XXLL2[0].length-1, 2, H[0]),
				subColumnScale(XXLL2, L-2, XXLL2[0].length-2, 2, H[1])),
				subColumnScale(XXLL2, L-3, XXLL2[0].length-3, 2, H[2]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXLL2, L-4, XXLL2[0].length-4, 2, H[3]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXLL2, L-5, XXLL2[0].length-5, 2, H[4]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXLL2, L-6, XXLL2[0].length-6, 2, H[5]));


	XLL3 = transpose(XLL3);
	XHH3 = transpose(XHH3);

	// console.log(matrix_sum(XLL3));
	// return;

	var XXLL3 = prePadding(XLL3, XLL3[0].length-L+1, XLL3[0].length);
	var XXHH3 = prePadding(XHH3, XHH3[0].length-L+1, XHH3[0].length);


	XLL3 = matrix_add(matrix_add(subColumnScale(XXLL3, L-1, XXLL3[0].length-1, 2, G[0]),
				subColumnScale(XXLL3, L-2, XXLL3[0].length-2, 2, G[1])),
				subColumnScale(XXLL3, L-3, XXLL3[0].length-3, 2, G[2]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL3, L-4, XXLL3[0].length-4, 2, G[3]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL3, L-5, XXLL3[0].length-5, 2, G[4]));
	XLL3 = matrix_add(XLL3, subColumnScale(XXLL3, L-6, XXLL3[0].length-6, 2, G[5]));


	XHH3 = matrix_add(matrix_add(subColumnScale(XXHH3, L-1, XXHH3[0].length-1, 2, H[0]),
				subColumnScale(XXHH3, L-2, XXHH3[0].length-2, 2, H[1])),
				subColumnScale(XXHH3, L-3, XXHH3[0].length-3, 2, H[2]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXHH3, L-4, XXHH3[0].length-4, 2, H[3]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXHH3, L-5, XXHH3[0].length-5, 2, H[4]));
	XHH3 = matrix_add(XHH3, subColumnScale(XXHH3, L-6, XXHH3[0].length-6, 2, H[5]));

	// console.log(matrix_sum(XHH1));
	// return;

 	var XHL3 = matrix_add(matrix_add(subColumnScale(XXLL3, L-1, XXLL3[0].length-1, 2, H[0]),
				subColumnScale(XXLL3, L-2, XXLL3[0].length-2, 2, H[1])),
				subColumnScale(XXLL3, L-3, XXLL3[0].length-3, 2, H[2]));
	XHL3 = matrix_add(XHL3, subColumnScale(XXLL3, L-4, XXLL3[0].length-4, 2, H[3]));
	XHL3 = matrix_add(XHL3, subColumnScale(XXLL3, L-5, XXLL3[0].length-5, 2, H[4]));
	XHL3 = matrix_add(XHL3, subColumnScale(XXLL3, L-6, XXLL3[0].length-6, 2, H[5]));


	var XLH3 = matrix_add(matrix_add(subColumnScale(XXHH3, L-1, XXHH3[0].length-1, 2, G[0]),
				subColumnScale(XXHH3, L-2, XXHH3[0].length-2, 2, G[1])),
				subColumnScale(XXHH3, L-3, XXHH3[0].length-3, 2, G[2]));
	XLH3 = matrix_add(XLH3, subColumnScale(XXHH3, L-4, XXHH3[0].length-4, 2, G[3]));
	XLH3 = matrix_add(XLH3, subColumnScale(XXHH3, L-5, XXHH3[0].length-5, 2, G[4]));
	XLH3 = matrix_add(XLH3, subColumnScale(XXHH3, L-6, XXHH3[0].length-6, 2, G[5]));


	XLL3 = transpose(XLL3);
	XHH3 = transpose(XHH3);
	XHL3 = transpose(XHL3);
	XLH3 = transpose(XLH3);

	// console.log(matrix_sum(XHL3));
	// return;	

// Wavelet Transform:{XLL3,XLH?,XHL?,XHH?,?=1,2,3}.
// Display 2-D db3 Daubechies wavelet transform:

	var XX = [];
	for(var i = 0; i < XLL3.length; i++){
		XX.push(XLL3[i].concat(XLH3[i]));
	}

	for(var i = 0; i < XHL3.length; i++){
		XX.push(XHL3[i].concat(XHH3[i]));
	}


	for(var i = 0; i < XX.length; i++){
		XX[i] = XX[i].concat(XLH2[i]);
	}

	for(var i = 0; i < XHL2.length; i++){
		XX.push(XHL2[i].concat(XHH2[i]));
	}

 	// console.log(matrix_sum(XX));
 	// return;	


	for(var i = 0; i < XX.length; i++){
		XX[i] = XX[i].concat(XLH1[i]);
	}

	for(var i = 0; i < XHL1.length; i++){
		XX.push(XHL1[i].concat(XHH1[i]));
	}



 	// console.log(matrix_sum(XX));
 	// return;

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
          currImageData.data[idxInPixels+c] = XX[k][l];
        }
      }
    }
    ctxs[1].putImageData(currImageData, 0, 0);
 
    var duration = +new Date() - start;
    console.log('It took '+duration+'ms to compute the 2-D db3 wavelet wavelet.');












	XLH1 = shrinkByT(XLH1, T);
	XHL1 = shrinkByT(XHL1, T);
	XHH1 = shrinkByT(XHH1, T);
	XLH2 = shrinkByT(XLH2, T);
	XHL2 = shrinkByT(XHL2, T);
	XHH2 = shrinkByT(XHH2, T);
	XLH3 = shrinkByT(XLH3, T);
	XHL3 = shrinkByT(XHL3, T);
	XHH3 = shrinkByT(XHH3, T);

	// console.log(matrix_sum(XHH1));
 	// return;	

	// 3rd Stage Reconstruction:
	var ZZLL3 = postPadding(XLL3, 0, 3);
	var ZZLH3 = postPadding(XLH3, 0, 3);
	var ZZHL3 = postPadding(XHL3, 0, 3);
	var ZZHH3 = postPadding(XHH3, 0, 3);

	var K = 2 * XLL3.length;

	
	var A2 = reconstruct(K, G, G, ZZLL3);
	// console.log(matrix_sum(A2));
	// return;
	var B2 = reconstruct(K, G, H, ZZHL3);
	var C2 = reconstruct(K, H, G, ZZLH3);
	var D2 = reconstruct(K, H, H, ZZHH3);

	var ZLL2 = matrix_add(A2, B2);
	ZLL2 = matrix_add(ZLL2, C2);
	ZLL2 = matrix_add(ZLL2, D2);

	ZLL2 = transpose(ZLL2);


	var ZZLL2 = postPadding(ZLL2, 0, 3);
	var ZZLH2 = postPadding(XLH2, 0, 3);
	var ZZHL2 = postPadding(XHL2, 0, 3);
	var ZZHH2 = postPadding(XHH2, 0, 3);

	K = 2 * ZLL2.length;

	var A1 = reconstruct(K, G, G, ZZLL2);
	var B1 = reconstruct(K, G, H, ZZHL2);
	var C1 = reconstruct(K, H, G, ZZLH2);
	var D1 = reconstruct(K, H, H, ZZHH2);


	var ZLL1 = matrix_add(matrix_add(A1, B1),matrix_add(C1, D1));
	ZLL1 = transpose(ZLL1);

	var ZZLL1 = postPadding(ZLL1, 0, 3);
	var ZZLH1 = postPadding(XLH1, 0, 3);
	var ZZHL1 = postPadding(XHL1, 0, 3);
	var ZZHH1 = postPadding(XHH1, 0, 3);

	K = 2 * ZLL1.length;

	var A0 = reconstruct(K, G, G, ZZLL1);
	var B0 = reconstruct(K, G, H, ZZHL1);
	var C0 = reconstruct(K, H, G, ZZLH1);
	var D0 = reconstruct(K, H, H, ZZHH1);

	var ZLL0 = matrix_add(matrix_add(A0, B0), matrix_add(C0, D0));
	ZLL0 = transpose(ZLL0);



	// console.log(matrix_sum(ZLL0));
 // 	return;	

	// // draw the pixels
	var currImageData = ctxs[2].getImageData(
	  0, 0, dims[0], dims[1]
	);

	// // console.log(greyImage);

	for (var k = 0; k < dims[1]; k++) {
	  for (var l = 0; l < dims[0]; l++) {
	    var idx = (dims[0]*k + l);
	    currImageData.data[idx*4+3] = 255; // full alpha
	    for (var c = 0; c < 3; c++) { 
	      currImageData.data[4*idx+c] = ZLL0[k][l];
	    }
	  }
	}
	ctxs[2].putImageData(currImageData, 0, 0);



	var duration = +new Date() - start;
	console.log('It took '+duration+'ms to reconstruct the image.');	


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