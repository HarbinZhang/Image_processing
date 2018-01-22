%Reads in a grayscale image, computes its 2-D Haar wavelet transform, displays it,
%and computes its inverse 2-D Haar transform (which matches the original image.
%OPTIONS: Add 0-mean white Gaussian noise with strength sigma, and denoise image by
%thresholding and shrinkage with lambda. Set sigma=0 and lambda=0 if don't want this.
%Image must be square (or zero-pad) and have size a multiple of 16 (4 levels).
clear;X=imread('clown.jpg');X=double(X);X(256,256)=0;%zero-pad to multiple of 16.
sigma=20;lambda=20;
N=size(X,1);Y=X+sigma*randn(N,N);T=lambda;%"T" takes less space than "lambda."
%T=threshold for XLH?,XHL?,XHH? (not XLL3).
ZLL0=Y;%1st stage decomposition
ZLL1=ZLL0(1:2:N,1:2:N)+ZLL0(1:2:N,2:2:N);
ZLL1=ZLL1+ZLL0(2:2:N,1:2:N)+ZLL0(2:2:N,2:2:N);
ZLH1=ZLL0(1:2:N,2:2:N)-ZLL0(1:2:N,1:2:N);
ZLH1=ZLH1+ZLL0(2:2:N,2:2:N)-ZLL0(2:2:N,1:2:N);
ZHL1=ZLL0(2:2:N,2:2:N)-ZLL0(1:2:N,2:2:N);
ZHL1=ZHL1+ZLL0(2:2:N,1:2:N)-ZLL0(1:2:N,1:2:N);
ZHH1=ZLL0(2:2:N,2:2:N)-ZLL0(1:2:N,2:2:N);
ZHH1=ZHH1-ZLL0(2:2:N,1:2:N)+ZLL0(1:2:N,1:2:N);
ZLL1=ZLL1/2;ZLH1=ZLH1/2;ZHL1=ZHL1/2;ZHH1=ZHH1/2;
%2nd stage decomposition
ZLL2=ZLL1(1:2:N/2,1:2:N/2)+ZLL1(1:2:N/2,2:2:N/2);
ZLL2=ZLL2+ZLL1(2:2:N/2,1:2:N/2)+ZLL1(2:2:N/2,2:2:N/2);
ZLH2=ZLL1(1:2:N/2,2:2:N/2)-ZLL1(1:2:N/2,1:2:N/2);
ZLH2=ZLH2+ZLL1(2:2:N/2,2:2:N/2)-ZLL1(2:2:N/2,1:2:N/2);
ZHL2=ZLL1(2:2:N/2,2:2:N/2)-ZLL1(1:2:N/2,2:2:N/2);
ZHL2=ZHL2+ZLL1(2:2:N/2,1:2:N/2)-ZLL1(1:2:N/2,1:2:N/2);
ZHH2=ZLL1(2:2:N/2,2:2:N/2)-ZLL1(1:2:N/2,2:2:N/2);
ZHH2=ZHH2-ZLL1(2:2:N/2,1:2:N/2)+ZLL1(1:2:N/2,1:2:N/2);
ZLL2=ZLL2/2;ZLH2=ZLH2/2;ZHL2=ZHL2/2;ZHH2=ZHH2/2;
%3rd stage decomposition
ZLL3=ZLL2(1:2:N/4,1:2:N/4)+ZLL2(1:2:N/4,2:2:N/4);
ZLL3=ZLL3+ZLL2(2:2:N/4,1:2:N/4)+ZLL2(2:2:N/4,2:2:N/4);
ZLH3=ZLL2(1:2:N/4,2:2:N/4)-ZLL2(1:2:N/4,1:2:N/4);
ZLH3=ZLH3+ZLL2(2:2:N/4,2:2:N/4)-ZLL2(2:2:N/4,1:2:N/4);
ZHL3=ZLL2(2:2:N/4,2:2:N/4)-ZLL2(1:2:N/4,2:2:N/4);
ZHL3=ZHL3+ZLL2(2:2:N/4,1:2:N/4)-ZLL2(1:2:N/4,1:2:N/4);
ZHH3=ZLL2(2:2:N/4,2:2:N/4)-ZLL2(1:2:N/4,2:2:N/4);
ZHH3=ZHH3-ZLL2(2:2:N/4,1:2:N/4)+ZLL2(1:2:N/4,1:2:N/4);
ZLL3=ZLL3/2;ZLH3=ZLH3/2;ZHL3=ZHL3/2;ZHH3=ZHH3/2;
%4th stage decomposition
ZLL4=ZLL3(1:2:N/8,1:2:N/8)+ZLL3(1:2:N/8,2:2:N/8);
ZLL4=ZLL4+ZLL3(2:2:N/8,1:2:N/8)+ZLL3(2:2:N/8,2:2:N/8);
ZLH4=ZLL3(1:2:N/8,2:2:N/8)-ZLL3(1:2:N/8,1:2:N/8);
ZLH4=ZLH4+ZLL3(2:2:N/8,2:2:N/8)-ZLL3(2:2:N/8,1:2:N/8);
ZHL4=ZLL3(2:2:N/8,2:2:N/8)-ZLL3(1:2:N/8,2:2:N/8);
ZHL4=ZHL4+ZLL3(2:2:N/8,1:2:N/8)-ZLL3(1:2:N/8,1:2:N/8);
ZHH4=ZLL3(2:2:N/8,2:2:N/8)-ZLL3(1:2:N/8,2:2:N/8);
ZHH4=ZHH4-ZLL3(2:2:N/8,1:2:N/8)+ZLL3(1:2:N/8,1:2:N/8);
ZLL4=ZLL4/2;ZLH4=ZLH4/2;ZHL4=ZHL4/2;ZHH4=ZHH4/2;
%Display 2-D Haar transform:
ZZ=[ZLL4 ZLH4;ZHL4 ZHH4];ZZ=[ZZ ZLH3;ZHL3 ZHH3];
ZZ=[ZZ ZLH2;ZHL2 ZHH2];ZZ=[ZZ ZLH1;ZHL1 ZHH1];
figure,imagesc(log10(abs(ZZ))),colormap(gray),axis off,title('log of 2-D Haar wavelet transform')
%Threshold and shrinkage of noisy wavelet transform for denoising:
%First, threshold small values of XLH?,XHL?,XHH? to 0.
ZLH1(abs(ZLH1)<T)=0;ZHL1(abs(ZHL1)<T)=0;ZHH1(abs(ZHH1)<T)=0;
ZLH2(abs(ZLH2)<T)=0;ZHL2(abs(ZHL2)<T)=0;ZHH2(abs(ZHH2)<T)=0;
ZLH3(abs(ZLH3)<T)=0;ZHL3(abs(ZHL3)<T)=0;ZHH3(abs(ZHH3)<T)=0;
%Now shrink larger values by T.
ZLH1(abs(ZLH1)>T)=ZLH1(abs(ZLH1)>T)-T*sign(ZLH1(abs(ZLH1)>T));
ZHL1(abs(ZHL1)>T)=ZHL1(abs(ZHL1)>T)-T*sign(ZHL1(abs(ZHL1)>T));
ZHH1(abs(ZHH1)>T)=ZHH1(abs(ZHH1)>T)-T*sign(ZHH1(abs(ZHH1)>T));
ZLH2(abs(ZLH2)>T)=ZLH2(abs(ZLH2)>T)-T*sign(ZLH2(abs(ZLH2)>T));
ZHL2(abs(ZHL2)>T)=ZHL2(abs(ZHL2)>T)-T*sign(ZHL2(abs(ZHL2)>T));
ZHH2(abs(ZHH2)>T)=ZHH2(abs(ZHH2)>T)-T*sign(ZHH2(abs(ZHH2)>T));
ZLH3(abs(ZLH3)>T)=ZLH3(abs(ZLH3)>T)-T*sign(ZLH3(abs(ZLH3)>T));
ZHL3(abs(ZHL3)>T)=ZHL3(abs(ZHL3)>T)-T*sign(ZHL3(abs(ZHL3)>T));
ZHH3(abs(ZHH3)>T)=ZHH3(abs(ZHH3)>T)-T*sign(ZHH3(abs(ZHH3)>T));
%Inverse Haar (note double reversals):
WLL2(2:2:N/4,2:2:N/4)=(ZLL3+ZLH3+ZHL3+ZHH3)/2;
WLL2(2:2:N/4,1:2:N/4)=(ZLL3-ZLH3+ZHL3-ZHH3)/2;
WLL2(1:2:N/4,2:2:N/4)=(ZLL3+ZLH3-ZHL3-ZHH3)/2;
WLL2(1:2:N/4,1:2:N/4)=(ZLL3-ZLH3-ZHL3+ZHH3)/2;
%2nd stage:
WLL1(2:2:N/2,2:2:N/2)=(WLL2+ZLH2+ZHL2+ZHH2)/2;
WLL1(2:2:N/2,1:2:N/2)=(WLL2-ZLH2+ZHL2-ZHH2)/2;
WLL1(1:2:N/2,2:2:N/2)=(WLL2+ZLH2-ZHL2-ZHH2)/2;
WLL1(1:2:N/2,1:2:N/2)=(WLL2-ZLH2-ZHL2+ZHH2)/2;
%1st stage:
W(2:2:N,2:2:N)=(WLL1+ZLH1+ZHL1+ZHH1)/2;
W(2:2:N,1:2:N)=(WLL1-ZLH1+ZHL1-ZHH1)/2;
W(1:2:N,2:2:N)=(WLL1+ZLH1-ZHL1-ZHH1)/2;
W(1:2:N,1:2:N)=(WLL1-ZLH1-ZHL1+ZHH1)/2;
figure,imagesc(Y),colormap(gray),axis off,title('Original image')
figure,imagesc(W),colormap(gray),axis off,title('Reconstructed image')
