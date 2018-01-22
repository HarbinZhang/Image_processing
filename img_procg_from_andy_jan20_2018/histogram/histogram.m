%This reads in a grayscale image and performs histogram equalization on it.
clear;X=imread('clown.jpg');X=double(X);[N,M]=size(X);NM=N*M-1;
X=(X-min(min(X)))/(max(max(X))-min(min(X)));X=round(X*NM)+1;%Makes program simpler.
figure,imagesc(X),axis off,colormap(gray),title('Original image')
PX=hist(X(:),0.5+[0:NM]);figure,plot(PX),title('Histogram of original image')
FX=[0 cumsum(PX)];Y=FX(X(:));%Compute CDF from histogram and equalize.
figure,plot(FX),title('Cumulative (CDF) of original image')
PY=hist(Y,0.5+[0:NM]);%Histogram of equalized image.
FY=[0 cumsum(PY)];%Compute CDF from histogram of equalized image.
figure,plot(FY),title('Cumulative (CDF) of transformed image')
figure,plot(PY),title('Histogram of transformed image')
figure,imagesc(reshape(Y,N,M)),colormap(gray),axis off,title('Transformed image')

