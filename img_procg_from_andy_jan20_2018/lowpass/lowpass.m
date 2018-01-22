%Peforms brick-wall 2-D lowpass filtering of grayscale image
%'clown.jpg' with cutoff wavenumber of Omega in both directions.
clear;X=imread('clown.jpg');X=double(X);[N,M]=size(X);Omega=pi/4;%Omega=cutoff.
KN=round(Omega*N/2/pi);KM=round(Omega*M/2/pi);FX=fft2(X);
FX(KN:N+2-KN,:)=0;FX(:,KM:M+2-KM)=0;Y=real(ifft2(FX));
figure,imagesc(X),colormap(gray),axis off,title('Original image')
figure,imagesc(fftshift(log10(abs(FX)))),colormap(gray),axis off,...
title('Log of magnitude of spectrum of filtered image')
figure,imagesc(Y),colormap(gray),axis off,title('Filtered image')