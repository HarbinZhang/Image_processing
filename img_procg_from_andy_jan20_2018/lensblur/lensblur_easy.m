
clear;
X=imread('clown.jpg');
X=double(X);
[N,M]=size(X);
lambda=0.1;
sigma=10;
R=15;
R1=2*R+1;
N1=N+2*R;
M1=M+2*R;
%blurred image is N1XM1.
%Create (roughly) circular PSF of radius R centered at MATLAB coordinates (R+1,R+1):
H(R1,R1)=0;
for n=1:R1;
	for m=1:R1;
		if((n-R-1)*(n-R-1)+(m-R-1)*(m-R-1)<R*R+1);
			H(n,m)=1;
		end;
	end;
end;
Y=conv2(X,H)+sigma*randn(N1,M1);%Blur image and add 0-mean 2-D white Gaussian noise.
FY=fft2(Y,N1,M1);
FH=fft2(H,N1,M1);%zero-pad DFT of PSF to size of blurred image Y.
FXHAT=FY.*conj(FH)./(FH.*conj(FH)+lambda^2);
XHAT=real(ifft2(FXHAT));%2-D Wiener filter.
figure,imagesc(Y),colormap(gray),axis off,title('Blurred image')
figure,imagesc(XHAT),colormap(gray),axis off,title('Reconstructed image')%This is zero-padded.