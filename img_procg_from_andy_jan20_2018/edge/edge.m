%This reads in a grayscale image and performs Sobel edge detection with threshold T.
clear;
X=imread('clown.jpg');
X=double(X);
H=[1 2 1;0 0 0;-1 -2 -1];
X=(X-min(min(X)))/(max(max(X))-min(min(X)));

%Scale image to range 0<X<1.
figure,imagesc(X),colormap(gray),axis off,title('Original image')
T=1.3;%T=threshold-need to set this by trial and error.
Y1=conv2(X,H);Y2=conv2(X,H');Y3=sqrt(Y1.*Y1+Y2.*Y2);%gradient image.
Y3(abs(Y3)<T)=0;Y3(abs(Y3)>T)=1;%Threshold gradient image. Note order of these matters!
figure,imagesc(Y3),colormap(gray),axis off,title('Edge image')
