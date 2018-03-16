// var chai = require('chai');
var FFTW = require('./src/main');

var scaleTransform = function(trans, size) {
    var i = 0,
        bSi = 1.0 / size,
        x = trans;
    while(i < x.length) {
        x[i] *= bSi; i++;
    }
    return x;
};

function getMiscRealBuffer(size) {
    var result = new Float32Array(size);
    for (var i = 0; i < result.length; i++)
        result[i] = (i % 2) / 4.0;
    return result;
}


var non2PowSize = 1536;  // 1.5 times test buffer size
var buffer = getMiscRealBuffer(non2PowSize);
var fftr = new FFTW.RFFT(non2PowSize);
var transform = fftr.forward(buffer);
var transScaled = scaleTransform(transform, non2PowSize);
var backAgain = fftr.inverse(transScaled);

// for(var i = 0; i < non2PowSize; i++) {
//     chai.expect(buffer[i]).to.be.closeTo(backAgain[i], 0.0000005);
// }
// console.log(backAgain);
// console.log(buffer);
fftr.dispose();
