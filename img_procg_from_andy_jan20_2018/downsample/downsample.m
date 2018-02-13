%Reads in a square grayscale image and produces a smaller (thumbnail) version of it.
%Original image is MXM. Downsampled image is MdXMd. Lowpass filter so no aliasing.
%M need not be an integer multiple of Md. If it is, can't just decimate-get aliasing.
clear;
X=imread('clown.jpg');
X=double(X);
M=size(X,1);
Md=20;%Downsampled image is MdXMd.
figure,imagesc(X),colormap(gray),title('Original image')%Note axes
FX=fft2(X)*M/Md;%Deal with even and odd Md separately:
if(2*floor(Md/2)==Md);
	MM=[1:Md/2+1 (M+2-Md/2):M];
	FY=FX(MM,MM);
	FY(Md/2+1,:)=0;
	FY(:,Md/2+1)=0;
end;%Md even. Replace row and column #Md/2+1 with 0s.
if(2*floor(Md/2)==Md-1);
MM=[1:(Md+1)/2 (M+2-(Md+1)/2):M];
FY=FX(MM,MM);end;%Md odd
Y=real(ifft2(FY));figure,imagesc(Y),colormap(gray),title('Downsampled image')%Note axes