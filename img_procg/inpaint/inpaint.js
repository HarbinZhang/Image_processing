

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

	// var sigma = parseInt($('#sigma_selector').val());
	// var lambda = parseInt($('#lambda_selector').val());
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
	var sigma = 20;
	var lambda = 0.01;
	var IMAX = 5;
	var f = 1;


	// X=(X-min(min(X)))/(max(max(X))-min(min(X)));
	var maxX = matrix_max(X);
	var minX = matrix_min(X);

	X = X.map(row => row.map(ceil => (ceil - minX)/ (maxX - minX) ));
	var N = dims[0];

	var f1 = 1 - f;
	var Q = randn(N,N,1);
	for(var i = 0; i < Q.length; i++){
		for(var j = 0; j < Q[0].length; j++){
			if(Q[i][j] < f1){Q[i][j] = 0;}
			else {Q[i][j] = 1;}
		}
	}
	var Y = matrix_dot_product(X, Q);

	// console.log(matrix_sum(Y));
	// return;
	var WK = zeros(N, N);

	var G=[0.47046721,1.14111692,0.650365, -0.19093442,-0.12083221,0.0498175];
	var normG = norm(G);
	G = G.map(x => x/normG);
	var L = G.length;

	H = [];
	for(var i = G.length - 1; i >= 0; i--){
		H.push(Math.pow(-1, i+1) * G[i]);
	}


	var ZLL3 = zeros(N/8, N/8);
	var ZLH3 = zeros(N/8, N/8);
	var ZHL3 = zeros(N/8, N/8);
	var ZHH3 = zeros(N/8, N/8);

	var ZLL2 = zeros(N/4, N/4);
	var ZLH2 = zeros(N/4, N/4);
	var ZHL2 = zeros(N/4, N/4);
	var ZHH2 = zeros(N/4, N/4);

	var ZLL1 = zeros(N/2, N/2);
	var ZLH1 = zeros(N/2, N/2);
	var ZHL1 = zeros(N/2, N/2);
	var ZHH1 = zeros(N/2, N/2);



for( var I = 0; I < IMAX; I ++)
	{


		var ZZLL3 = postPadding(ZLL3, 0, 3);
		var ZZLH3 = postPadding(ZLH3, 0, 3);
		var ZZHL3 = postPadding(ZHL3, 0, 3);
		var ZZHH3 = postPadding(ZHH3, 0, 3);
		var K = ZLL3.length * 2;


		var A2 = ISTStage1(ZZLL3, G, K);
		A2 = transpose(A2);
		var AA2 = postPadding(A2, 0, 3);
		A2 = ISTStage1(AA2, G, K);

		var B2 = ISTStage1(ZZHL3, G, K);
		B2 = transpose(B2);
		var BB2 = postPadding(B2, 0, 3);
		B2 = ISTStage1(BB2, H, K);

		var C2 = ISTStage1(ZZLH3, H, K);
		C2 = transpose(C2);
		var CC2 = postPadding(C2, 0, 3);
		C2 = ISTStage1(CC2, G, K);

		var D2 = ISTStage1(ZZHH3, H, K);
		D2 = transpose(D2);
		var DD2 = postPadding(D2, 0, 3);
		D2 = ISTStage1(DD2, H, K);

		var WLL2 = matrix_add(matrix_add(A2, B2), matrix_add(C2, D2));
		WLL2 = transpose(WLL2);


		// console.log(matrix_sum(WLL2));
		// return;


		// 2nd Stage Reconstruction: Use Computed ZLL2 and Given X??2:
		var ZZLL2 = postPadding(WLL2, 0, 3);
		var ZZLH2 = postPadding(ZLH2, 0, 3);
		var ZZHL2 = postPadding(ZHL2, 0, 3);
		var ZZHH2 = postPadding(ZHH2, 0, 3);

		K = 2 * WLL2.length;

		var A1 = ISTStage1(ZZLL2, G, K);
		A1 = transpose(A1);
		var AA1 = postPadding(A1, 0, 3);
		A1 = ISTStage1(AA1, G, K);

		var B1 = ISTStage1(ZZHL2, G, K);
		B1 = transpose(B1);
		var BB1 = postPadding(B1, 0, 3);
		B1 = ISTStage1(BB1, H, K);

		var C1 = ISTStage1(ZZLH2, H, K);
		C1 = transpose(C1);
		var CC1 = postPadding(C1, 0, 3);
		C1 = ISTStage1(CC1, G, K);

		var D1 = ISTStage1(ZZHH2, H, K);
		D1 = transpose(D1);
		var DD1 = postPadding(D1, 0, 3);
		D1 = ISTStage1(DD1, H, K);


		var WLL1 = matrix_add(matrix_add(A1, B1), matrix_add(C1, D1));
		WLL1 = transpose(WLL1);


		// console.log(matrix_sum(1));
		// return;

		// 1st Stage Reconstruction: Use Computed ZLL1 and Given X??1:

		var ZZLL1 = postPadding(WLL1, 0, 3);
		var ZZLH1 = postPadding(ZLH1, 0, 3);
		var ZZHL1 = postPadding(ZHL1, 0, 3);
		var ZZHH1 = postPadding(ZHH1, 0, 3);


		K = 2 * WLL1.length;
		var A0 = ISTStage1(ZZLL1, G, K);
		A0 = transpose(A0);
		var AA0 = postPadding(A0, 0, 3);
		A0 = ISTStage1(AA0, G, K);

		var B0 = ISTStage1(ZZHL1, G, K);
		B0 = transpose(B0);
		var BB0 = postPadding(B0, 0, 3);
		B0 = ISTStage1(BB0, H, K);

		var C0 = ISTStage1(ZZLH1, H, K);
		C0 = transpose(C0);
		var CC0 = postPadding(C0, 0, 3);
		C0 = ISTStage1(CC0, G, K);

		var D0 = ISTStage1(ZZHH1, H, K);
		D0 = transpose(D0);
		var DD0 = postPadding(D0, 0, 3);
		D0 = ISTStage1(DD0, H, K);

		var WLL0 = matrix_add(matrix_add(A0, B0), matrix_add(C0, D0));
		var W = transpose(WLL0);



		// console.log(matrix_sum(WLL0));
		// return;

		var YWK = zeros(dims[0],dims[1]);
		for(var i = 0; i < dims[0]; i++){
			for( var j = 0;j < dims[1]; j++){
				if(Q[i][j] == 1){
					YWK[i][j] = Y[i][j] - W[i][j]; 
				}else{
					YWK[i][j] = Y[i][j];
				}
			}
		}

		// console.log(matrix_sum(YWK));
		// return;

		var XXLL0 = prePadding(YWK, YWK[0].length-L+1, YWK[0].length);

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

		// console.log(matrix_sum(XHL1));
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


		ZLH1 = matrix_add(ZLH1, XLH1);
		ZHL1 = matrix_add(ZHL1, XHL1);
		ZHH1 = matrix_add(ZHH1, XHH1);

		ZLH2 = matrix_add(ZLH2, XLH2);
		ZHL2 = matrix_add(ZHL2, XHL2);
		ZHH2 = matrix_add(ZHH2, XHH2);

		ZLH3 = matrix_add(ZLH3, XLH3);
		ZHL3 = matrix_add(ZHL3, XHL3);
		ZHH3 = matrix_add(ZHH3, XHH3);

		ZLL3 = matrix_add(ZLL3, XLL3);


		ZLH1 = shrinkByT(ZLH1, lambda);
		ZHL1 = shrinkByT(ZHL1, lambda);
		ZLH2 = shrinkByT(ZLH2, lambda);
		ZHL2 = shrinkByT(ZHL2, lambda);
		ZLH3 = shrinkByT(ZLH3, lambda);
		ZHL3 = shrinkByT(ZHL3, lambda);

		ZHH1 = shrinkByT(ZHH1, lambda);
		ZHH2 = shrinkByT(ZHH2, lambda);
		ZHH3 = shrinkByT(ZHH3, lambda);
		ZLL3 = shrinkByT(ZLL3, lambda);
	}




	var ZZLL3 = postPadding(ZLL3, 0, 3);
	var ZZLH3 = postPadding(ZLH3, 0, 3);
	var ZZHL3 = postPadding(ZHL3, 0, 3);
	var ZZHH3 = postPadding(ZHH3, 0, 3);
	var K = ZLL3.length * 2;


	var A2 = ISTStage1(ZZLL3, G, K);
	A2 = transpose(A2);
	var AA2 = postPadding(A2, 0, 3);
	A2 = ISTStage1(AA2, G, K);

	var B2 = ISTStage1(ZZHL3, G, K);
	B2 = transpose(B2);
	var BB2 = postPadding(B2, 0, 3);
	B2 = ISTStage1(BB2, H, K);

	var C2 = ISTStage1(ZZLH3, H, K);
	C2 = transpose(C2);
	var CC2 = postPadding(C2, 0, 3);
	C2 = ISTStage1(CC2, G, K);

	var D2 = ISTStage1(ZZHH3, H, K);
	D2 = transpose(D2);
	var DD2 = postPadding(D2, 0, 3);
	D2 = ISTStage1(DD2, H, K);

	var WLL2 = matrix_add(matrix_add(A2, B2), matrix_add(C2, D2));
	WLL2 = transpose(WLL2);


	// console.log(matrix_sum(WLL2));
	// return;


	// 2nd Stage Reconstruction: Use Computed ZLL2 and Given X??2:
	var ZZLL2 = postPadding(WLL2, 0, 3);
	var ZZLH2 = postPadding(ZLH2, 0, 3);
	var ZZHL2 = postPadding(ZHL2, 0, 3);
	var ZZHH2 = postPadding(ZHH2, 0, 3);

	K = 2 * WLL2.length;

	var A1 = ISTStage1(ZZLL2, G, K);
	A1 = transpose(A1);
	var AA1 = postPadding(A1, 0, 3);
	A1 = ISTStage1(AA1, G, K);

	var B1 = ISTStage1(ZZHL2, G, K);
	B1 = transpose(B1);
	var BB1 = postPadding(B1, 0, 3);
	B1 = ISTStage1(BB1, H, K);

	var C1 = ISTStage1(ZZLH2, H, K);
	C1 = transpose(C1);
	var CC1 = postPadding(C1, 0, 3);
	C1 = ISTStage1(CC1, G, K);

	var D1 = ISTStage1(ZZHH2, H, K);
	D1 = transpose(D1);
	var DD1 = postPadding(D1, 0, 3);
	D1 = ISTStage1(DD1, H, K);


	var WLL1 = matrix_add(matrix_add(A1, B1), matrix_add(C1, D1));
	WLL1 = transpose(WLL1);


	// console.log(matrix_sum(1));
	// return;

	// 1st Stage Reconstruction: Use Computed ZLL1 and Given X??1:

	var ZZLL1 = postPadding(WLL1, 0, 3);
	var ZZLH1 = postPadding(ZLH1, 0, 3);
	var ZZHL1 = postPadding(ZHL1, 0, 3);
	var ZZHH1 = postPadding(ZHH1, 0, 3);


	K = 2 * WLL1.length;
	var A0 = ISTStage1(ZZLL1, G, K);
	A0 = transpose(A0);
	var AA0 = postPadding(A0, 0, 3);
	A0 = ISTStage1(AA0, G, K);

	var B0 = ISTStage1(ZZHL1, G, K);
	B0 = transpose(B0);
	var BB0 = postPadding(B0, 0, 3);
	B0 = ISTStage1(BB0, H, K);

	var C0 = ISTStage1(ZZLH1, H, K);
	C0 = transpose(C0);
	var CC0 = postPadding(C0, 0, 3);
	C0 = ISTStage1(CC0, G, K);

	var D0 = ISTStage1(ZZHH1, H, K);
	D0 = transpose(D0);
	var DD0 = postPadding(D0, 0, 3);
	D0 = ISTStage1(DD0, H, K);

	var WLL0 = matrix_add(matrix_add(A0, B0), matrix_add(C0, D0));
	var W = transpose(WLL0);


	W = W.map(row => row.map(ceil => Math.round(ceil * 255)));

	// console.log(matrix_max(W));
	// console.log(matrix_sum(W));
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
          currImageData.data[idxInPixels+c] = Math.round(W[k][l]);
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


function ISTStage1(A, G, K){
	var res = zeros(A.length, K);
	var M = A[0].length;

	for(var i = 0; i < A.length; i++){
		for(var j = 0; j < A[0].length-3; j++){
			res[i][j*2] = G[0]*A[i][j] + G[2]*A[i][j+1] + G[4]*A[i][j+2];
			res[i][j*2+1] = G[1]*A[i][j+1] + G[3]*A[i][j+2] + G[5]*A[i][j+3];
		}
	}
	return res;
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
