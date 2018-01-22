%Reads in an image, motion blurs it with linear PSF of size (1XL) (length L),
%adds noise, then deblurs it with a Wiener filter with Tikhonov parameter lambda.
%Why do we need Tikhonov regularization? Try setting lambda=0.
clear;X=imread('clown.jpg');X=double(X);[N,M]=size(X);
lambda=0.1;sigma=10;L=51;M1=M+L-1;%blurred image is NXM1.
Y=conv2(X,ones(1,L))+sigma*rand(N,M1);%Blur image and add 0-mean 2-D white Gaussian noise.
FY=fft2(Y,N,M1);FH=fft2(ones(1,L),N,M1);%zero-pad DFT of PSF to size NXM1 of blurred image Y.
FXHAT=FY.*conj(FH)./(FH.*conj(FH)+lambda^2);XHAT=real(ifft2(FXHAT));%2-D Wiener filter.
figure,imagesc(Y),colormap(gray),axis off,title('Blurred image')
figure,imagesc(XHAT),colormap(gray),axis off,title('Reconstructed image')%This is zero-padded.

