%Read in a grayscale image and sharpen it using (1) unsharp masking (2) Laplacian.
%sigma is standard deviation for Gaussian lowpass filter for unsharp masking.
clear;
load imdemos.mat;
X=double(tire);
sigma=5;%use any of coins,quarter,circuit
%Next 3 lines: Generate Gaussian lowpass filter PSF and perform unsharp masking:
L=round(5*sigma);
if(2*floor(L/2)==L);
	L=L+1;
end;

L1=(L+1)/2;%make L an odd integer.
for n=1:L;
	for m=1:L;
		G(n,m)=exp(-((n-L1)^2+(m-L1)^2)/2/sigma^2)/sqrt(2*pi*sigma^2);
	end;
end;
G=G/sum(sum(G));
Y=X+X-conv2(X,G,'same');%Now use Laplacian for sharpening:
H=-[0 1 0;1 -5 1;0 1 0];
Z=conv2(X,H);%amplifies noise.
figure,imagesc(X),colormap(gray),axis off,title('Original image')
figure,imagesc(Y),colormap(gray),axis off,title('Unsharp masking')
figure,imagesc(Z),colormap(gray),axis off,title('Laplacian-sharpened')
