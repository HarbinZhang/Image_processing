

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
	loadImage('clown.png');
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

	var H = [[1,2,1],[0,0,0],[-1,-2,-1]];

	// X=(X-min(min(X)))/(max(max(X))-min(min(X)));
	var minX = min(X);
	var maxX = max(X);

	// Y = X.map(x => (x - minX)/(maxX - minX));

	Y = X.map(function(row){
		return row.map(function(cell){
			return (cell - minX)/(maxX - minX);
		})
	})

	// var T = 1.3;
	var T = $('#T_selector').val();



	var Y1 = conv2(H, Y);
	var Y2 = conv2(transpose(H), Y);
	// var Y3 = Math.sqrt(Y1.map(x => x*x) + Y2.map(x => x*x));

	var Y3 = [];
	for( var i = 0; i < Y1.length; i++){
		var temp = [];
		for( var j = 0; j < Y1[0].length;j++){
			var t = Y1[i][j]*Y1[i][j] + Y2[i][j]*Y2[i][j];
			if(t < T){temp.push(0);}
			else{temp.push(255);}
		}
		Y3.push(temp);
	}

	console.log(Y3);



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
          currImageData.data[idxInPixels+c] = Y3[k][l];
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
