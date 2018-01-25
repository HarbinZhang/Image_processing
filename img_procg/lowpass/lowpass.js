var context, canvas;  
var loader;
var select;  
var table_bar;

window.onload = function() {  

    loader = new ImageLoader();  
    canvas = document.getElementById('cvs');  
    context = canvas.getContext('2d');  
    select = document.getElementById('filter_select');
    table_bar = document.getElementById('table_bar');


    var transformImage = function( func ) {
        var I = loader.result;
        console.log(I);
        I = func (I);
        I.render(canvas);
    };


    loader.loadImage("../pic/view_1.jpg", canvas);
    console.log(loader.result);


    $('#x_axis').bind('input', function(e) {
    	var start = new Date;
        var x = parseFloat($('#x_axis').val());
        $('#x_axis_val').html(x);
        var I = loader.result;
        I = lowpass(I, x);
        I.render(canvas);
        var end = new Date;
        console.log("Finished in " + (end - start) / 1000 + " seconds.");
    });


    var lowpass = function(src, omega){

        var imageData = context.getImageData(0, 0, src.w, src.h);
        var out = [];
        Fourier.transform(imageData.data, out);
        console.log(out);
    }


    var I = loader.result;
    I = lowpass(I, 3.14);

}         
