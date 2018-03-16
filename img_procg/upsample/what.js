var FFT = require('./fft.js');
var ndarray = FFT.ndarray;
var ndfft = FFT.ndfft;

var zeros = require("zeros")
var ops = require("ndarray-ops")




module.exports = function{
	var x = ops.random(zeros([256, 256]))
	  , y = ops.random(zeros([256, 256]))

	console.log(x);
	console.log(x.data[0]);
	// ndfft(1, x, y);

	//Forward transform x/y
	ndfft(1, x, y)
	console.log(x);
	console.log(x.data[0]);

	//Invert transform
	ndfft(-1, x, y)
	console.log(x);

	console.log(x.data[0]);
}


// console.log(x[0,0]);
