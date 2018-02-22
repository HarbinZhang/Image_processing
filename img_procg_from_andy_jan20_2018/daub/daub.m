%Reads in a grayscale image, computes its 2-D db3 Daubechies wavelet transform,
%displays it, and computes its inverse 2-D wavelet transform (which matches original).
%OPTIONS: Add 0-mean white Gaussian noise with strength sigma, and denoise image by
%thresholding and shrinkage with lambda. Set sigma=0 and lambda=0 if don't want this.
%Image must be square (or zero-pad) and have size a multiple of 8 (3 levels).
clear;
X=imread('clown.png');
% for i=1:256
%     X(1:256,i)=i;
% end
X=double(X);sigma=0;lambda=0;
N=size(X,1);Y=X+sigma*randn(N,N);T=lambda;%"T" takes less space than "lambda."
 %T=threshold for XLH?,XHL?,XHH? (not XLL3).
% figure,imagesc(X),colormap(gray),axis off,title('Original image')
%db3 Daubechies Scaling Function Coefficients (from table):
G=[0.47046721,1.14111692,0.650365];
G=[G -0.19093442,-0.12083221,0.0498175];

G=G/norm(G);L=length(G);H=fliplr(G).*(-1).^[0:L-1];

% X=X(:,:,1);
X=(X(:,:,1)+X(:,:,2)+X(:,:,3))/3;
%1st Stage db3 Daubechies Wavelet Transform:
XXLL0=[X(:,end-L+2:end) X];%Cyclic Pre-padding



XLL1=G(1)*XXLL0(:,L:2:end-1)+G(2)*XXLL0(:,L-1:2:end-2)+G(3)*XXLL0(:,L-2:2:end-3);
XLL1=XLL1+G(4)*XXLL0(:,L-3:2:end-4)+G(5)*XXLL0(:,L-4:2:end-5)+G(6)*XXLL0(:,L-5:2:end-6);

XHH1=H(1)*XXLL0(:,L:2:end-1)+H(2)*XXLL0(:,L-1:2:end-2)+H(3)*XXLL0(:,L-2:2:end-3);
XHH1=XHH1+H(4)*XXLL0(:,L-3:2:end-4)+H(5)*XXLL0(:,L-4:2:end-5)+H(6)*XXLL0(:,L-5:2:end-6);



XLL1=XLL1';XHH1=XHH1';%Now Do in the Other Direction:


XXLL1=[XLL1(:,end-L+2:end) XLL1];XXHH1=[XHH1(:,end-L+2:end) XHH1];%Cyclic Pre-padding


XLL1=G(1)*XXLL1(:,L:2:end-1)+G(2)*XXLL1(:,L-1:2:end-2)+G(3)*XXLL1(:,L-2:2:end-3);


XLL1=XLL1+G(4)*XXLL1(:,L-3:2:end-4)+G(5)*XXLL1(:,L-4:2:end-5)+G(6)*XXLL1(:,L-5:2:end-6);

XHH1=H(1)*XXHH1(:,L:2:end-1)+H(2)*XXHH1(:,L-1:2:end-2)+H(3)*XXHH1(:,L-2:2:end-3);
XHH1=XHH1+H(4)*XXHH1(:,L-3:2:end-4)+H(5)*XXHH1(:,L-4:2:end-5)+H(6)*XXHH1(:,L-5:2:end-6);



XHL1=H(1)*XXLL1(:,L:2:end-1)+H(2)*XXLL1(:,L-1:2:end-2)+H(3)*XXLL1(:,L-2:2:end-3);
XHL1=XHL1+H(4)*XXLL1(:,L-3:2:end-4)+H(5)*XXLL1(:,L-4:2:end-5)+H(6)*XXLL1(:,L-5:2:end-6);



XLH1=G(1)*XXHH1(:,L:2:end-1)+G(2)*XXHH1(:,L-1:2:end-2)+G(3)*XXHH1(:,L-2:2:end-3);
XLH1=XLH1+G(4)*XXHH1(:,L-3:2:end-4)+G(5)*XXHH1(:,L-4:2:end-5)+G(6)*XXHH1(:,L-5:2:end-6);
XLL1=XLL1';XHH1=XHH1';XHL1=XHL1';XLH1=XLH1';

 
%2nd Stage db3 Daubechies Wavelet Transform:
XXLL1=[XLL1(:,end-L+2:end) XLL1];%Cyclic Pre-padding
XLL2=G(1)*XXLL1(:,L:2:end-1)+G(2)*XXLL1(:,L-1:2:end-2)+G(3)*XXLL1(:,L-2:2:end-3);
XLL2=XLL2+G(4)*XXLL1(:,L-3:2:end-4)+G(5)*XXLL1(:,L-4:2:end-5)+G(6)*XXLL1(:,L-5:2:end-6);
XHH2=H(1)*XXLL1(:,L:2:end-1)+H(2)*XXLL1(:,L-1:2:end-2)+H(3)*XXLL1(:,L-2:2:end-3);
XHH2=XHH2+H(4)*XXLL1(:,L-3:2:end-4)+H(5)*XXLL1(:,L-4:2:end-5)+H(6)*XXLL1(:,L-5:2:end-6);
XLL2=XLL2';XHH2=XHH2';%Now Do in the Other Direction:
XXLL2=[XLL2(:,end-L+2:end) XLL2];XXHH2=[XHH2(:,end-L+2:end) XHH2];%Cyclic Pre-padding
XLL2=G(1)*XXLL2(:,L:2:end-1)+G(2)*XXLL2(:,L-1:2:end-2)+G(3)*XXLL2(:,L-2:2:end-3);
XLL2=XLL2+G(4)*XXLL2(:,L-3:2:end-4)+G(5)*XXLL2(:,L-4:2:end-5)+G(6)*XXLL2(:,L-5:2:end-6);
XHH2=H(1)*XXHH2(:,L:2:end-1)+H(2)*XXHH2(:,L-1:2:end-2)+H(3)*XXHH2(:,L-2:2:end-3);
XHH2=XHH2+H(4)*XXHH2(:,L-3:2:end-4)+H(5)*XXHH2(:,L-4:2:end-5)+H(6)*XXHH2(:,L-5:2:end-6);
XHL2=H(1)*XXLL2(:,L:2:end-1)+H(2)*XXLL2(:,L-1:2:end-2)+H(3)*XXLL2(:,L-2:2:end-3);
XHL2=XHL2+H(4)*XXLL2(:,L-3:2:end-4)+H(5)*XXLL2(:,L-4:2:end-5)+H(6)*XXLL2(:,L-5:2:end-6);
XLH2=G(1)*XXHH2(:,L:2:end-1)+G(2)*XXHH2(:,L-1:2:end-2)+G(3)*XXHH2(:,L-2:2:end-3);
XLH2=XLH2+G(4)*XXHH2(:,L-3:2:end-4)+G(5)*XXHH2(:,L-4:2:end-5)+G(6)*XXHH2(:,L-5:2:end-6);
XLL2=XLL2';XHH2=XHH2';XHL2=XHL2';XLH2=XLH2';

%3rd Stage db3 Daubechies Wavelet Transform:
XXLL2=[XLL2(:,end-L+2:end) XLL2];%Cyclic Pre-padding
XLL3=G(1)*XXLL2(:,L:2:end-1)+G(2)*XXLL2(:,L-1:2:end-2)+G(3)*XXLL2(:,L-2:2:end-3);
XLL3=XLL3+G(4)*XXLL2(:,L-3:2:end-4)+G(5)*XXLL2(:,L-4:2:end-5)+G(6)*XXLL2(:,L-5:2:end-6);
XHH3=H(1)*XXLL2(:,L:2:end-1)+H(2)*XXLL2(:,L-1:2:end-2)+H(3)*XXLL2(:,L-2:2:end-3);
XHH3=XHH3+H(4)*XXLL2(:,L-3:2:end-4)+H(5)*XXLL2(:,L-4:2:end-5)+H(6)*XXLL2(:,L-5:2:end-6);
XLL3=XLL3';XHH3=XHH3';%Now Do in the Other Direction:


XXLL3=[XLL3(:,end-L+2:end) XLL3];XXHH3=[XHH3(:,end-L+2:end) XHH3];%Cyclic Pre-padding
XLL3=G(1)*XXLL3(:,L:2:end-1)+G(2)*XXLL3(:,L-1:2:end-2)+G(3)*XXLL3(:,L-2:2:end-3);
XLL3=XLL3+G(4)*XXLL3(:,L-3:2:end-4)+G(5)*XXLL3(:,L-4:2:end-5)+G(6)*XXLL3(:,L-5:2:end-6);
XHH3=H(1)*XXHH3(:,L:2:end-1)+H(2)*XXHH3(:,L-1:2:end-2)+H(3)*XXHH3(:,L-2:2:end-3);
XHH3=XHH3+H(4)*XXHH3(:,L-3:2:end-4)+H(5)*XXHH3(:,L-4:2:end-5)+H(6)*XXHH3(:,L-5:2:end-6);



XHL3=H(1)*XXLL3(:,L:2:end-1)+H(2)*XXLL3(:,L-1:2:end-2)+H(3)*XXLL3(:,L-2:2:end-3);
XHL3=XHL3+H(4)*XXLL3(:,L-3:2:end-4)+H(5)*XXLL3(:,L-4:2:end-5)+H(6)*XXLL3(:,L-5:2:end-6);
XLH3=G(1)*XXHH3(:,L:2:end-1)+G(2)*XXHH3(:,L-1:2:end-2)+G(3)*XXHH3(:,L-2:2:end-3);
XLH3=XLH3+G(4)*XXHH3(:,L-3:2:end-4)+G(5)*XXHH3(:,L-4:2:end-5)+G(6)*XXHH3(:,L-5:2:end-6);
XLL3=XLL3';XHH3=XHH3';XHL3=XHL3';XLH3=XLH3';
%Wavelet Transform:{XLL3,XLH?,XHL?,XHH?,?=1,2,3}.
%Display 2-D db3 Daubechies wavelet transform:
XX=[XLL3 XLH3;XHL3 XHH3];


XX=[XX XLH2;XHL2 XHH2];


XX=[XX XLH1;XHL1 XHH1];


figure,imagesc((abs(XX))),colormap(gray),axis off,title('2-D db3 wavelet transform')

%Inverse Wavelet Transform of {XLL3,XLH?,XHL?,XHH?}
%Threshold and shrinkage of noisy wavelet transform for denoising:
%First, threshold small values of XLH?,XHL?,XHH? to 0.
XLH1(abs(XLH1)<T)=0;XHL1(abs(XHL1)<T)=0;XHH1(abs(XHH1)<T)=0;
XLH2(abs(XLH2)<T)=0;XHL2(abs(XHL2)<T)=0;XHH2(abs(XHH2)<T)=0;
XLH3(abs(XLH3)<T)=0;XHL3(abs(XHL3)<T)=0;XHH3(abs(XHH3)<T)=0;
%Now shrink larger values by T.
XLH1(XLH1>T)=XLH1(XLH1>T)-T;XHL1(XHL1>T)=XHL1(XHL1>T)-T;
XHH1(XHH1>T)=XHH1(XHH1>T)-T;XLH2(XLH2>T)=XLH2(XLH2>T)-T;
XHL2(XHL2>T)=XHL2(XHL2>T)-T;XHH2(XHH2>T)=XHH2(XHH2>T)-T;
XLH3(XLH3>T)=XLH3(XLH3>T)-T;XHL3(XHL3>T)=XHL3(XHL3>T)-T;
XHH3(XHH3>T)=XHH3(XHH3>T)-T;
XLH1(XLH1<-T)=XLH1(XLH1<-T)+T;XHL1(XHL1<-T)=XHL1(XHL1<-T)+T;
XHH1(XHH1<-T)=XHH1(XHH1<-T)+T;XLH2(XLH2<-T)=XLH2(XLH2<-T)+T;
XHL2(XHL2<-T)=XHL2(XHL2<-T)+T;XHH2(XHH2<-T)=XHH2(XHH2<-T)+T;
XLH3(XLH3<-T)=XLH3(XLH3<-T)+T;XHL3(XHL3<-T)=XHL3(XHL3<-T)+T;
XHH3(XHH3<-T)=XHH3(XHH3<-T)+T;LL=length(find(abs(XX<0.000001)));




%Inverse Wavelet Transform of {XLL3,XLH?,XHL?,XHH?}
%3rd Stage Reconstruction:
ZZLL3=[XLL3 XLL3(:,1:3)];ZZLH3=[XLH3 XLH3(:,1:3)];
ZZHL3=[XHL3 XHL3(:,1:3)];ZZHH3=[XHH3 XHH3(:,1:3)];
K=2*size(XLL3,1);

A2(:,1:2:K)=G(1)*ZZLL3(:,1:end-3)+G(3)*ZZLL3(:,2:end-2)+G(5)*ZZLL3(:,3:end-1);
A2(:,2:2:K)=G(2)*ZZLL3(:,2:end-2)+G(4)*ZZLL3(:,3:end-1)+G(6)*ZZLL3(:,4:end);
A2=A2';AA2=[A2 A2(:,1:3)];%Now Do in the Other Direction:
A2(:,1:2:K)=G(1)*AA2(:,1:end-3)+G(3)*AA2(:,2:end-2)+G(5)*AA2(:,3:end-1);
A2(:,2:2:K)=G(2)*AA2(:,2:end-2)+G(4)*AA2(:,3:end-1)+G(6)*AA2(:,4:end);

B2(:,1:2:K)=G(1)*ZZHL3(:,1:end-3)+G(3)*ZZHL3(:,2:end-2)+G(5)*ZZHL3(:,3:end-1);
B2(:,2:2:K)=G(2)*ZZHL3(:,2:end-2)+G(4)*ZZHL3(:,3:end-1)+G(6)*ZZHL3(:,4:end);
B2=B2';BB2=[B2 B2(:,1:3)];%Now Do in the Other Direction:
B2(:,1:2:K)=H(1)*BB2(:,1:end-3)+H(3)*BB2(:,2:end-2)+H(5)*BB2(:,3:end-1);
B2(:,2:2:K)=H(2)*BB2(:,2:end-2)+H(4)*BB2(:,3:end-1)+H(6)*BB2(:,4:end);


C2(:,1:2:K)=H(1)*ZZLH3(:,1:end-3)+H(3)*ZZLH3(:,2:end-2)+H(5)*ZZLH3(:,3:end-1);
C2(:,2:2:K)=H(2)*ZZLH3(:,2:end-2)+H(4)*ZZLH3(:,3:end-1)+H(6)*ZZLH3(:,4:end);
C2=C2';CC2=[C2 C2(:,1:3)];%Now Do in the Other Direction:
C2(:,1:2:K)=G(1)*CC2(:,1:end-3)+G(3)*CC2(:,2:end-2)+G(5)*CC2(:,3:end-1);
C2(:,2:2:K)=G(2)*CC2(:,2:end-2)+G(4)*CC2(:,3:end-1)+G(6)*CC2(:,4:end);


D2(:,1:2:K)=H(1)*ZZHH3(:,1:end-3)+H(3)*ZZHH3(:,2:end-2)+H(5)*ZZHH3(:,3:end-1);
D2(:,2:2:K)=H(2)*ZZHH3(:,2:end-2)+H(4)*ZZHH3(:,3:end-1)+H(6)*ZZHH3(:,4:end);
D2=D2';DD2=[D2 D2(:,1:3)];%Now Do in the Other Direction:
D2(:,1:2:K)=H(1)*DD2(:,1:end-3)+H(3)*DD2(:,2:end-2)+H(5)*DD2(:,3:end-1);
D2(:,2:2:K)=H(2)*DD2(:,2:end-2)+H(4)*DD2(:,3:end-1)+H(6)*DD2(:,4:end);


ZLL2=A2+B2+C2+D2;Z5LL2=ZLL2';
%2nd Stage Reconstruction: Use Computed ZLL2 and Given X??2:
ZZLL2=[ZLL2 ZLL2(:,1:3)];ZZLH2=[XLH2 XLH2(:,1:3)];
ZZHL2=[XHL2 XHL2(:,1:3)];ZZHH2=[XHH2 XHH2(:,1:3)];


K=2*size(ZLL2,1);
A1(:,1:2:K)=G(1)*ZZLL2(:,1:end-3)+G(3)*ZZLL2(:,2:end-2)+G(5)*ZZLL2(:,3:end-1);
A1(:,2:2:K)=G(2)*ZZLL2(:,2:end-2)+G(4)*ZZLL2(:,3:end-1)+G(6)*ZZLL2(:,4:end);
A1=A1';AA1=[A1 A1(:,1:3)];%Now Do in the Other Direction:
A1(:,1:2:K)=G(1)*AA1(:,1:end-3)+G(3)*AA1(:,2:end-2)+G(5)*AA1(:,3:end-1);
A1(:,2:2:K)=G(2)*AA1(:,2:end-2)+G(4)*AA1(:,3:end-1)+G(6)*AA1(:,4:end);
B1(:,1:2:K)=G(1)*ZZHL2(:,1:end-3)+G(3)*ZZHL2(:,2:end-2)+G(5)*ZZHL2(:,3:end-1);
B1(:,2:2:K)=G(2)*ZZHL2(:,2:end-2)+G(4)*ZZHL2(:,3:end-1)+G(6)*ZZHL2(:,4:end);
B1=B1';BB1=[B1 B1(:,1:3)];%Now Do in the Other Direction:
B1(:,1:2:K)=H(1)*BB1(:,1:end-3)+H(3)*BB1(:,2:end-2)+H(5)*BB1(:,3:end-1);
B1(:,2:2:K)=H(2)*BB1(:,2:end-2)+H(4)*BB1(:,3:end-1)+H(6)*BB1(:,4:end);
C1(:,1:2:K)=H(1)*ZZLH2(:,1:end-3)+H(3)*ZZLH2(:,2:end-2)+H(5)*ZZLH2(:,3:end-1);
C1(:,2:2:K)=H(2)*ZZLH2(:,2:end-2)+H(4)*ZZLH2(:,3:end-1)+H(6)*ZZLH2(:,4:end);
C1=C1';CC1=[C1 C1(:,1:3)];%Now Do in the Other Direction:
C1(:,1:2:K)=G(1)*CC1(:,1:end-3)+G(3)*CC1(:,2:end-2)+G(5)*CC1(:,3:end-1);
C1(:,2:2:K)=G(2)*CC1(:,2:end-2)+G(4)*CC1(:,3:end-1)+G(6)*CC1(:,4:end);
D1(:,1:2:K)=H(1)*ZZHH2(:,1:end-3)+H(3)*ZZHH2(:,2:end-2)+H(5)*ZZHH2(:,3:end-1);
D1(:,2:2:K)=H(2)*ZZHH2(:,2:end-2)+H(4)*ZZHH2(:,3:end-1)+H(6)*ZZHH2(:,4:end);
D1=D1';DD1=[D1 D1(:,1:3)];%Now Do in the Other Direction:
D1(:,1:2:K)=H(1)*DD1(:,1:end-3)+H(3)*DD1(:,2:end-2)+H(5)*DD1(:,3:end-1);
D1(:,2:2:K)=H(2)*DD1(:,2:end-2)+H(4)*DD1(:,3:end-1)+H(6)*DD1(:,4:end);
ZLL1=A1+B1+C1+D1;ZLL1=ZLL1';
%1st Stage Reconstruction: Use Computed ZLL1 and Given X??1:
ZZLL1=[ZLL1 ZLL1(:,1:3)];ZZLH1=[XLH1 XLH1(:,1:3)];
ZZHL1=[XHL1 XHL1(:,1:3)];ZZHH1=[XHH1 XHH1(:,1:3)];
K=2*size(ZLL1,1);
A0(:,1:2:K)=G(1)*ZZLL1(:,1:end-3)+G(3)*ZZLL1(:,2:end-2)+G(5)*ZZLL1(:,3:end-1);
A0(:,2:2:K)=G(2)*ZZLL1(:,2:end-2)+G(4)*ZZLL1(:,3:end-1)+G(6)*ZZLL1(:,4:end);
A0=A0';AA0=[A0 A0(:,1:3)];%Now Do in the Other Direction:
A0(:,1:2:K)=G(1)*AA0(:,1:end-3)+G(3)*AA0(:,2:end-2)+G(5)*AA0(:,3:end-1);
A0(:,2:2:K)=G(2)*AA0(:,2:end-2)+G(4)*AA0(:,3:end-1)+G(6)*AA0(:,4:end);
B0(:,1:2:K)=G(1)*ZZHL1(:,1:end-3)+G(3)*ZZHL1(:,2:end-2)+G(5)*ZZHL1(:,3:end-1);
B0(:,2:2:K)=G(2)*ZZHL1(:,2:end-2)+G(4)*ZZHL1(:,3:end-1)+G(6)*ZZHL1(:,4:end);
B0=B0';BB0=[B0 B0(:,1:3)];%Now Do in the Other Direction:
B0(:,1:2:K)=H(1)*BB0(:,1:end-3)+H(3)*BB0(:,2:end-2)+H(5)*BB0(:,3:end-1);
B0(:,2:2:K)=H(2)*BB0(:,2:end-2)+H(4)*BB0(:,3:end-1)+H(6)*BB0(:,4:end);
C0(:,1:2:K)=H(1)*ZZLH1(:,1:end-3)+H(3)*ZZLH1(:,2:end-2)+H(5)*ZZLH1(:,3:end-1);
C0(:,2:2:K)=H(2)*ZZLH1(:,2:end-2)+H(4)*ZZLH1(:,3:end-1)+H(6)*ZZLH1(:,4:end);
C0=C0';CC0=[C0 C0(:,1:3)];%Now Do in the Other Direction:
C0(:,1:2:K)=G(1)*CC0(:,1:end-3)+G(3)*CC0(:,2:end-2)+G(5)*CC0(:,3:end-1);
C0(:,2:2:K)=G(2)*CC0(:,2:end-2)+G(4)*CC0(:,3:end-1)+G(6)*CC0(:,4:end);
D0(:,1:2:K)=H(1)*ZZHH1(:,1:end-3)+H(3)*ZZHH1(:,2:end-2)+H(5)*ZZHH1(:,3:end-1);
D0(:,2:2:K)=H(2)*ZZHH1(:,2:end-2)+H(4)*ZZHH1(:,3:end-1)+H(6)*ZZHH1(:,4:end);
D0=D0';DD0=[D0 D0(:,1:3)];%Now Do in the Other Direction:
D0(:,1:2:K)=H(1)*DD0(:,1:end-3)+H(3)*DD0(:,2:end-2)+H(5)*DD0(:,3:end-1);
D0(:,2:2:K)=H(2)*DD0(:,2:end-2)+H(4)*DD0(:,3:end-1)+H(6)*DD0(:,4:end);
ZLL0=A0+B0+C0+D0;
% ZLL0=ZLL0';

% return;
figure,imagesc(ZLL0),colormap(gray),axis off,title('Reconstructed image')





