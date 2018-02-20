%Reads in a square grayscale image and produces a larger (magnified) version of it.
%Original image is MXM. Upsampled is MuXMu. Mu need not be an integer multiple of M.
clear;X=imread('clown.png');X=double(X);
M=size(X,1);
Mu=400;%Upsampled image is MuXMu.
figure,imagesc(X),colormap(gray),title('Original image')%Note axes
FX=fft2(X)*Mu/M;
FY(Mu,Mu)=0;%Deal with even and odd M separately:
if(2*floor(M/2)==M-1);
    MU=[1:(M+1)/2 (Mu+2)-(M+1)/2:Mu];
    FY(MU,MU)=FX;
end;%M odd
if(2*floor(M/2)==M);
    MU=[1:M/2 Mu+2-M/2:Mu];
    MM=[1:M/2 (M/2+2):M];
    FY(MU,MU)=FX(MM,MM);
end;
%M even; just omit Omega_i=pi components of original image (makes simpler).
Y=real(ifft2(FY));figure,imagesc(Y),colormap(gray),title('Upsampled image')%Note axes

