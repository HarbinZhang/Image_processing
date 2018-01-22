function boxcar_avg(src, x, y){
    if(x === 1 && y === 1){return src;}
    var w = src.w;
    var h = src.h;

    var res = new RGBAImage(w, h);

    for(var i = 0; i < w; i++){
        for(var j = 0; j < h; j++){
            res.setPixel(i, j, getAvg(i, j, src, x, y));
        }
    }

    return res;
};

function getAvg(i, j, src, x, y){
    var w = src.w;
    var h = src.h;

    // if(i < x/2 || i >= w - x/2 || j < y/2 || j >= h - y/2){
    //     return src.getPixel(i, j);
    // }

    // get sum of all neighbors.
    var temp = new Color(0,0,0,255);
    for(var ii = Math.ceil(i - x/2); ii <= Math.floor(i + x/2); ii++){
        for(var jj = Math.ceil(j - y/2); jj <= Math.floor(j + y/2); jj++){
            // temp = temp.addc(src.getPixel(ii, jj));
            temp = temp.addc(src.getPixel(getPos(ii, i, w), getPos(jj, j, h)));
        }
    }

    temp = temp.divc(x*y).round();
    return temp;
}

var getPos = function(ii, i, w){
    return (ii < 0 || ii >= w) ? (2*i - ii) : ii;
}

var ImageLoader = function(mw){
    this.maxEdge = mw || 400;
    this.result = undefined;

    // load an image with the specified canvas object
    this.loadImage = function( imgsrc, cvs ){
        // create an Image object
        img = new Image();
        img.src = imgsrc;

        var inImg = RGBAImage.fromImage(img, cvs);
        this.result = inImg.resize_longedge(this.maxEdge);
        this.result.render(cvs);
        $(document).trigger('imageloaded');
    };
};

