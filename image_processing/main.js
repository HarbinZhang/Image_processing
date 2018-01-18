var context, canvas;  
var loader;
var select; 
var origin_file; 
var table_bar;

window.onload = function() {  

    loader = new ImageLoader();  
    canvas = document.getElementById('cvs');  
    context = canvas.getContext('2d');  
    select = document.getElementById('filter_select');
    table_bar = document.getElementById('table_bar');

    table_bar.style.display = 'none';

    var transformImage = function( func ) {
        var I = loader.result;
        I = func (I);
        I.render(canvas);
    };


    document.getElementById('select_ensure').onclick = function(){
        console.log(select.value);
        var I = loader.result;
        table_bar.style.display = 'none';
        switch(select.value){
            case 'gray':{I = filters.grayscale(I); break;}
            case 'invert':{I = filters.invert(I); break;}
            case 'brightness': {table_bar.style.display = 'block';break;}
        }

        I.render(canvas);
    }

    $('#filter_btn').click(function() {
        var temp = algorithms.createfilter(
                    {
                        name: $('#spatial_filter_select').val(),
                        size: parseFloat($('#filter_size').val()),
                        sigma: parseFloat($('#filter_sigma').val())
                    }
            );

        console.log(temp);
        transformImage(function(I) {
            return filters.spatialfilter(I, temp);
            // return filters.spatialfilter(I, algorithms.createfilter(
            //         {
            //             name: $('#filter_select').val(),
            //             size: parseFloat($('#filter_size').val()),
            //             sigma: parseFloat($('#filter_sigma').val())
            //         }
            // ));
        });
    });


    $('#brightness_bar').bind('input', function(e) {
        var beta = parseInt($('#brightness_bar').val());
        $('#brightnessval').html(beta);
        var I = loader.result;
        if( $('#brightnesscontrast').is(':checked') ){
            var alpha = parseInt($('#contrast_bar').val());
            I = filters.brightnesscontrast(I, alpha, beta);
        }else {
            I = filters.brightness(I, beta);
        }
        I.render(canvas);
    });

    $('#contrast_bar').bind('input', function(e) {
        var alpha = parseInt($('#contrast_bar').val());
        $('#contrastval').html(alpha);
        var I = loader.result;
        if( $('#brightnesscontrast').is(':checked') ){
            var beta = parseInt($('#brightness_bar').val());
            I = filters.brightnesscontrast(I, alpha, beta);
        }else{
            I = filters.contrast(I, alpha);
        }
        I.render(canvas);
    });


    $('#reset').click( function(){
        handleFileSelect(origin_file, loader, canvas);  
    });

    document.getElementById('files').addEventListener('change',   
    function( e ){  
        origin_file = e;
        handleFileSelect(e, loader, canvas);  
    },   
    false);  
}         
