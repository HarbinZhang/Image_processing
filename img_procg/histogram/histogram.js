

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

	google.charts.load('current', {'packages':['corechart', 'bar']});

	var X = greyImage.getData();

	// X = [];
	// for(var i = 1; i < 17; i++){
	// 	var temp = [];
	// 	for(var j = 1; j < 17; j++){
	// 		temp.push(j);
	// 	}
	// 	X.push(temp);
	// }	


	var N = X.length;
	var M = X[0].length;

	var NM = N * M - 1;

	var minX = matrix_min(X);
	var maxX = matrix_max(X);

	X = X.map(row => row.map(ceil => (ceil - minX) / (maxX - minX)));

	X = X.map(row => row.map(ceil => Math.round(ceil * NM) + 1));
	// console.log(X);
	// return;



	// t = t.map(function(item, index){return [item, index];})
	var X_lin = linearize(X);
	PX = hist(X_lin);
	var PX_show = PX.map(function(item, index){return [index, item];} );
	PX_show.unshift(['x','value']);

	google.charts.setOnLoadCallback(drawPX);
	// google.charts.setOnLoadCallback(drawChart(PX_show, 'Histogram of original image', 'chart_div'));

	// console.log(PX);

	var FX = cumsum(PX);
	FX.unshift(0);



	// console.log(FX);

	var Y = new Array(X_lin.length);
	for(var i = 0; i < Y.length; i++){
		Y[i] = FX[X_lin[i]];
	}
	// console.log(Y);

	var FX_show = FX.map(function(item, index){return [index, item];} );
	FX_show.unshift(['fx','value']);
	google.charts.setOnLoadCallback(drawFX);

	var PY = hist(Y);
	var FY = cumsum(PY);
	FY.unshift(0);

	var FY_show = FY.map(function(item, index){return [index, item];} );
	FY_show.unshift(['fy','value']);
	google.charts.setOnLoadCallback(drawFY);

	var PY_show = PY.map(function(item, index){return [index, item];} );
	PY_show.unshift(['py','value']);
	google.charts.setOnLoadCallback(drawPY);
	// console.log(FY);

	function drawPX() {
		// Create the data table.
       var data = google.visualization.arrayToDataTable(
       		PX_show
       	);
		// Set chart options
		var options = {
		        chart: {
		          title: 'Histogram of original image'
		        }	
		    };

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.charts.Bar(document.getElementById('div_PX_histogram'));
		chart.draw(data, options);
	}

	function drawFX() {
		// Create the data table.
       var data = google.visualization.arrayToDataTable(
       		FX_show
       	);
		// Set chart options
		var options = {
		        chart: {
		          title: 'Cumulative (CDF) of original image'
		        }	
		    };

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.charts.Bar(document.getElementById('div_FX_histogram'));
		chart.draw(data, options);
	}	

	function drawPY() {
		// Create the data table.
       var data = google.visualization.arrayToDataTable(
       		PY_show
       	);
		// Set chart options
		var options = {
		        chart: {
		          title: 'Histogram of transformed image'
		        }	
		    };

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.charts.Bar(document.getElementById('div_PY_histogram'));
		chart.draw(data, options);
	}	

	function drawFY() {
		// Create the data table.
       var data = google.visualization.arrayToDataTable(
       		FY_show
       	);
		// Set chart options
		var options = {
		        chart: {
		          title: 'Cumulative (CDF) of transformed image'
		        }	
		    };

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.charts.Bar(document.getElementById('div_FY_histogram'));
		chart.draw(data, options);
	}		

	
	// console.log(Y);
	Y = reshape(Y, M, N);
	Y = matrix_clamp(Y);
	console.log(Y);
	// console.log(X);
	// return;



    // draw the pixels
    var currImageData = ctxs[1].getImageData(
      0, 0, N, M
    );
    
    for (var k = 0; k < N; k++) {
      for (var l = 0; l < M; l++) {
        var idxInPixels = 4*(N*k + l);
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
