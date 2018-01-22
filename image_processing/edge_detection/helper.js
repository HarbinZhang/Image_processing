


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

