

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
	loadImage('tire.png');
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


    loadImage('tire.png');



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
		reconstructAction();
	});
	img.crossOrigin = "anonymous";
	img.src = loc;
}

function transformAction() {

	var sigma = $('#sigma_selector').val();
	X = greyImage.getData();


	var L = Math.round(sigma * 5);

	if(L % 2 == 0){L++;}

	var L1 = (L + 1) / 2;

	var G = new Array(L);
	for(var i = 0; i < L; i++){
		G[i] = new Array(L);
	}

	for(var n = 0; n < L; n++){
		for (var m = 0; m < L; m++){
			G[n][m] = Math.exp(-((n-L1+1)*(n-L1+1)+(m-L1+1)*(m-L1+1))/(2*sigma*sigma))/Math.sqrt(2*Math.PI*sigma*sigma);
		}
	}



	var Gsum = matrix_sum(G);


	G = G.map(function(row){
		return row.map(function(cell){
			return cell/Gsum;
		})
	});



	// var tt = ones(4,4);
	// var yy = ones(3,3);
	// console.log(conv2(yy,tt));
	// console.log(conv2_same(yy,tt));

	// return;

	// Y = conv2_same(X, G);
	Y = matrix_minus(matrix_add(X, X),conv2_same(X, G));


	console.log(Y);






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
          currImageData.data[idxInPixels+c] = Y[k][l];
        }
      }
    }
    ctxs[1].putImageData(currImageData, 0, 0);
 
    // enableButtons();
 
    var duration = +new Date() - start;
    console.log('It took '+duration+'ms to compute the FT.');

    return;

}


function reconstructAction() {
	var FFT_len = 512;


	H = [[0,-1,0], [-1,5,-1],[0,-1,0]];

	var Z = conv2(H, X);





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
	      currImageData.data[4*idx+c] = Z[k][l];
	    }
	  }
	}
	ctxs[2].putImageData(currImageData, 0, 0);

	// enableButtons();

	var duration = +new Date() - start;
	console.log('It took '+duration+'ms to reconstruct the image.');	
}




function $s(id) {
	if (id.charAt(0) !== '#') return false;
	return document.getElementById(id.substring(1));
}
