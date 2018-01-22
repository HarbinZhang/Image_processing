var context, canvas;  
var loader;
var select;  
var table_bar;
var canvas_origin;

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
        var x = parseInt($('#x_axis').val());
        var y = parseInt($('#y_axis').val());
        $('#x_axis_val').html(x);
        // var I = loader.result;
        // I.render(canvas);
    });


    $('#y_axis').bind('input', function(e) {
        var x = parseInt($('#x_axis').val());
        var y = parseInt($('#y_axis').val());
        $('#y_axis_val').html(y);
        // var I = loader.result;
        // I.render(canvas);
    });

    var I = loader.result;
    I.render(canvas);
    // CannyJS.canny = function(canvas, ht, lt, sigmma, kernelSize)
    var imageData = CannyJS.canny(canvas);
    imageData.drawOn(canvas);

}         
