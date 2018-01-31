function GreyImage(w, h, data){
	this.type = 'GreyImage';
	this.w = w;
	this.h = h;
	this.data = [];

	// for(var i = 0; i < data.length; i+=4){
	// 	var color = Math.round((data[i]*30 + data[i+1]*59 + data[i+2]*11) / 100);
	// 	this.data.push(color);
	// }

	var temp = [];
	for(var j = 0; j < h; j++){
		for(var i = 0; i < w; i++){
			var idx = (j * w + i) * 4;
			var color = Math.round((data[idx]*30 + data[idx+1]*59 + data[idx+2]*11) / 100);
			temp.push(color);
		}
		this.data.push(temp);
		temp = [];
	}
}


GreyImage.prototype.getPos = function(x, y){
	return this.data[y][x];
}


GreyImage.prototype.setPos = function(x, y, c){
	// var idx = this.w * y + x;
	// this.data[idx] = c;
	this.data[y][x] = c;
}

GreyImage.prototype.getData = function(){
	return this.data;
}
