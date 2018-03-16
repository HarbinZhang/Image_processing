%This reads in a grayscale image and performs histogram equalization on it.
clear;
X=imread('clown.png');
X=double(X);

% for i=1:256
%     X(1:256,i)=i;
% end
[N,M]=size(X);
M=256
NM=N*M-1;
X=X(:,:,1);
X=(X-min(min(X)))/(max(max(X))-min(min(X)));
X=round(X*NM)+1;%Makes program simpler.
figure,imagesc(X),axis off,colormap(gray),title('Original image')
% return;
PX=hist(X(:),0.5+[0:NM]);

figure,plot(PX),title('Histogram of original image')
% return
FX=[0 cumsum(PX)];

Y=FX(X(:));%Compute CDF from histogram and equalize.
% return;
figure,plot(FX),title('Cumulative (CDF) of original image')
PY=hist(Y,0.5+[0:NM]);%Histogram of equalized image.
FY=[0 cumsum(PY)];%Compute CDF from histogram of equalized image.
figure,plot(FY),title('Cumulative (CDF) of transformed image')
figure,plot(PY),title('Histogram of transformed image')
figure,imagesc(reshape(Y,N,M)),colormap(gray),axis off,title('Transformed image')
 
