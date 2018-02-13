

function zeroPad(X, M, N){
    var M0 = X.length;
    var N0 = X[0].length;

    for(var y = 0; y < M0; y++){
        for(var x = N0; x < N; x++){
            X[y].push(0);
        }
    }

    var temp = new Array(M);
    temp.fill(0);
    for(var y = M0; y < M; y++){
        X.push(temp);
    }

    return X;
}



function clamp(X){
    var max = X[0];
    for(var i = 0; i < X.length; i++){
        max = Math.max(max, X[i]);
    }
    var rate = 255/max;
    return X.map(x => Math.round(x * rate));
}


function complexNum(re,im){
    this.re = re;
    this.im = im;
}

function fft2d(X, len){
    var FFT_len = 1;
    while(FFT_len < X.length){FFT_len = FFT_len*2;}

    FFT.init(FFT_len);

    var FYre = new Array(FFT_len*FFT_len);
    var FYim = new Array(FFT_len*FFT_len);

    FYre.fill(0);
    FYim.fill(0);


    var FY_idx = 0;
    var FX_idx = 0;
    for(var y=0; y<len; y++) {
        FY_idx = y * FFT_len;
        for(var x=0; x<len; x++) {
            FYre[FY_idx++] = X[y][x];
        }
    }

    FFT.fft2d(FYre, FYim);

    return new complexNum(FYre, FYim);
}


function ifft2d(FXre, FXim, len){
    if(FXre.length != FXim.length || FXre[0].length != FXim[0].length){return null;}
    var FFT_len = 1;
    while(FFT_len < len){FFT_len = FFT_len*2;}


    FFT.init(FFT_len);

    var FYre = new Array(FFT_len*FFT_len);
    var FYim = new Array(FFT_len*FFT_len);

    FYre.fill(0);
    FYim.fill(0);

    console.log("FXre:", FXre);
    console.log("FXim:", FXim);

    var FY_idx = 0;
    var FX_idx = 0;
    for(var y=0; y<len; y++) {
        FY_idx = y * FFT_len;
        for(var x=0; x<len; x++) {
            FYre[FY_idx] = FXre[FX_idx];
            FYim[FY_idx++] = FXim[FX_idx++];
        }
    }


    FFT.ifft2d(FYre, FYim);

    console.log("FYre:", FYre);
    console.log("FYim:", FYim);


    var res = []
    for (var k = 0; k < len; k++) {
        for (var l = 0; l < len; l++) {
            res.push(FYre[FFT_len*k + l]);
        }
    }

    return res;
}

function matrix_multi(M, N){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    if(N == null || N.length == 0 || N[0].length == 0){return null;}    
    if(M[0].length != N.length){return null;}

    var res = [];
    for( var y = 0; y < M.length; y++){
        var row = [];
        for(var x = 0; x < N[0].length; x++){
            
            var temp = 0;
            for(var j = 0; j < M[0].length; j++){
                temp += M[y][j]*N[j][x];
            }
            row.push(temp);

        }
        res.push(row);
    }    

    return res;
}

function matrix_minus(M, N){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    if(N == null || N.length == 0 || N[0].length == 0){return null;}    

    var res = [];
    for(var i = 0; i < M[0].length; i++){
        var temp = [];
        for(var j = 0; j < M.length; j++){
            temp.push(M[i][j] - N[i][j]);
        }
        res.push(temp);
    }
    return res;    
}


function matrix_add(M, N){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    if(N == null || N.length == 0 || N[0].length == 0){return null;}    

    var res = [];
    for(var i = 0; i < M[0].length; i++){
        var temp = [];
        for(var j = 0; j < M.length; j++){
            temp.push(M[i][j] + N[i][j]);
        }
        res.push(temp);
    }
    return res;
}

function matrix_sum(M){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    var res = 0;
    for(var i = 0; i < M[0].length; i++){
        for(var j = 0; j < M.length; j++){
            res += M[i][j];
        }
    }
    return res;    
}



function transpose(M){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    var res = [];
    for(var i = 0; i < M[0].length; i++){
        var temp = [];
        for(var j = 0; j < M.length; j++){
            temp.push(M[j][i]);
        }
        res.push(temp);
    }
    return res;
}

function min(M){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    var res = M[0][0];
    for(var i = 0; i < M.length; i++){
        for(var j = 0; j < M[0].length; j++){
            // if(res > M[i][j])
            res = Math.min(res, M[i][j]);
        }
    }
    return res;
}

function max(M){
    if(M == null || M.length == 0 || M[0].length == 0){return null;}
    var res = M[0][0];
    for(var i = 0; i < M.length; i++){
        for(var j = 0; j < M[0].length; j++){
            // if(res > M[i][j])
            res = Math.max(res, M[i][j]);
        }
    }
    return res;
}




function ones(N, M){
    var res = [];
    for(var i = 0; i < N; i++){
        var temp = [];
        for(var j = 0; j < M; j++){
            temp.push(1);
        }
        res.push(temp);
    }

    return res;

}


function zeros(N,M){
    var res = [];
    for(var i = 0; i < N; i++){
        var temp = [];
        for(var j = 0; j < M; j++){
            temp.push(0);
        }
        res.push(temp);
    }

    return res;    
}


function randn(N, M, sigma){
    var res = [];
    for(var i = 0; i < N; i++){
        var temp = [];
        for(var j = 0; j < M; j++){
            temp.push(sigma*Math.random());
        }
        res.push(temp);
    }

    return res;
}

function new_2D_Array(size){

    var result = [];
    var temp = [];
    for(var i = 0; i < size; i++){
    	for(var j = 0; j < size; j++){
    		temp.push(0);
    	}
    	result.push(temp);
    	temp = [];
    }

    return result;
}


function conv2_same(image, filter){
    var temp = conv2(filter, image);
    var res = new Array(image.length);
    for(var i = 0; i < res.length; i++){
        res[i] = new Array(image[0].length);
    }

    var startRow = Math.ceil((temp.length-image.length)/2);
    var startColumn = Math.ceil((temp[0].length-image[0].length)/2);

    console.log(startColumn);

    for(var i = 0; i < res.length; i++){
        for(var j = 0; j < res[0].length; j++){
            res[i][j] = temp[i+startRow][j+startColumn];         
        }
    }
    return res;
}


function conv2(filter, image){
    var result = new Array(image.length + filter.length - 1);
    console.log(Math.floor(filter.length/2));
    // var result = new Array(image.length - filter.length + 1);
    for(var i = 0; i < result.length; i++){
    	result[i] = new Array(image[0].length + filter[0].length - 1);
    }



    var visited = new Array(filter.length);
    for(var i = 0; i < visited.length; i++){
        visited[i] = new Array(filter.length);
    }

    for(var k = 0; k < visited.length; k++){visited[k].fill(false);}
    for(var y = 0; y < result.length; y++){
        for(var x = 0; x < result[0].length; x++){  
            var temp = 0;
            var cnt = 0;
            for(var j = 0; j < filter.length; j++){
                for(var i = 0; i < filter[0].length; i++){
                    if(checkValid(image, filter, x, y, i, j)){
                        temp += image[y-j][x-i] * filter[j][i];
                        cnt++;
                    }
                }
            }

            // for(var k = 0; k < visited.length; k++){visited[k].fill(false);}



            // image, filter, visited, target_pos, relative_pos, base.
            // var temp = conv2_helper(image, filter, visited, i, j, 0, 0, Math.floor(filter.length/2));
            // temp = Math.floor(temp*2/(filter.length*filter[0].length));
            // temp = Math.floor(temp * 2/ cnt);
            result[y][x] = temp;
        }
    }

    // var temp = conv2_helper(image, filter, visited, 0, 0, 0, 0, Math.floor(filter.length/2));
    // temp = Math.floor(temp*3/(filter.length*filter[0].length));
    // result[0][0] = temp;

    // console.log(visited);

    // for (var i = 0; i < image.length; i++) {
    //     var imageRow = image[i];
    //     for (var j = 0; j <= imageRow.length; j++) {

    //         var sum = 0;
    //         for (var w = 0; w < filter.length; w++) {
    //             if(image.length - i < filter.length) break;

    //             var filterRow = filter[w];
    //             for (var z = 0; z < filter.length; z++) {
    //                 if(imageRow.length - j < filterRow.length) break;
    //                 sum += image[w + i][z + j] * filter[w][z];
    //             }
    //         }

    //         if(i < result.length && j < result[0].length)
    //             result[i][j] = sum;
    //     }   
    // }
    return result;
}

var checkValid = function(image, filter, x, y, i, j){
    // not valid for image[y-j][x-i]
    if(y-j < 0 || y-j >=image.length || x-i < 0 || x-i >= image[0].length){return false;}
    return true;
}

function conv2_helper(image, filter, visited, y, x, j, i, base){
    // not in filter range
    if(y + j < 0 || y + j >= visited.length || x + i < 0 || x + i >= visited[0].length){return 0;}
    // not in image range
    // if(y - j < 0 || )
    // if(base+i < 0 || base+i >= visited.length || base+j < 0 || base+j >= visited[0].length){return 0;}
    // if(x+i < 0 || x+i >= image.length || y+j < 0 || y+j >= image[0].length){return 0;}
    if(visited[base+i][base+j]){return 0;}

    visited[base+i][base+j] = true;
    var res = image[x+i][y+j] * filter[base-i][base-j];

    res = res + conv2_helper(image, filter, visited, x, y, i-1, j-1, base) + 
            conv2_helper(image, filter, visited, x, y, i-1, j+1, base) + 
            conv2_helper(image, filter, visited, x, y, i+1, j+1, base) + 
            conv2_helper(image, filter, visited, x, y, i+1, j-1, base) +

            conv2_helper(image, filter, visited, x, y, i, j+1, base) + 
            conv2_helper(image, filter, visited, x, y, i, j-1, base) + 
            conv2_helper(image, filter, visited, x, y, i+1, j, base) +
            conv2_helper(image, filter, visited, x, y, i-1, j, base);


    return res;
}
