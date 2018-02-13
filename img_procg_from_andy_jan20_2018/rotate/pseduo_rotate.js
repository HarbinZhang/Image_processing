
var N = dims[0];
var theta = Math.PI/6;

if(N % 2 == 0){
	for(var i = 0; i < X.length; i++){
		X[i].push(0);
	}
	var temp = new Array(X[0].length);
	X.push(temp);
}

console.log(X);

var SN = Math.round(Math.sqrt(2) * N);
