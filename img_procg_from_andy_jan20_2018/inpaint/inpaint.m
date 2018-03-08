%Reads in a grayscale image, randomly sets some pixels to zero, then inpaints them
%using Iterative Shrinkage and Thresholding (IST) and db3 Daubechies wavelet transform.
%Image must be square with size a multiple of 8 (otherwise zero-pad).
%XHAT=image. Z=wavelet of XHAT. W=inverse wavelet of Z.lambda=lambda in IST algorithm.
clear;
X=imread('clown.jpg');
% X=double(X);
% for i=1:256
%     X(1:256,i)=i;
% end
% lambda=0.01;
% IMAX=5;
f=1;%number of IST iterations and fraction of pixel values known.
X=(X-min(min(X)))/(max(max(X))-min(min(X)));
% figure,imagesc(X),colormap(gray),axis off,title('Original image')
N=size(X,1);%Must be a multiple of 8 (3 stages of wavelet transform),if not,zero-pad.
%Determine random locations of known pixels:
f1=1-f;Q=rand(N,N);Q(Q<f1)=0;Q(Q>f1)=1;Y=X;Y=Y.*Q;WK(N,N)=0;

% figure,imagesc(Y),colormap(gray),axis off,title('Known pixel values')
%db3 Daubechies Scaling Function Coefficients (from table):
G=[0.47046721,1.14111692,0.650365];
G=[G -0.19093442,-0.12083221,0.0498175];
G=G/norm(G);L=length(G);H=fliplr(G).*(-1).^[0:L-1];
%Initialize Landweber with all zeros (also preallocates variable spaces):
ZLL3=zeros(N/8,N/8);ZLH3=zeros(N/8,N/8);ZHL3=zeros(N/8,N/8);ZHH3=zeros(N/8,N/8);
ZLL2=zeros(N/4,N/4);ZLH2=zeros(N/4,N/4);ZHL2=zeros(N/4,N/4);ZHH2=zeros(N/4,N/4);
ZLL1=zeros(N/2,N/2);ZLH1=zeros(N/2,N/2);ZHL1=zeros(N/2,N/2);ZHH1=zeros(N/2,N/2);

for I=1:IMAX;%Begin IST algorithm.
%Landweber iteration:z^{k+1}=z^{k}+H'F'(y-FH'z^{k}).
%H=Daubechies wavelet transform operator. F=Known. W=H'z^{k}=XHAT.
%Inverse Daubechies wavelet transform operator: H'=H^{-1}:Z->W. Start with this:
%3rd Stage Reconstruction:
ZZLL3=[ZLL3 ZLL3(:,1:3)];ZZLH3=[ZLH3 ZLH3(:,1:3)];
ZZHL3=[ZHL3 ZHL3(:,1:3)];ZZHH3=[ZHH3 ZHH3(:,1:3)];

K=2*size(ZLL3,1);clear A* B* C* D*%Need this!
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


WLL2=A2+B2+C2+D2;WLL2=WLL2';
%2nd Stage Reconstruction: Use Computed ZLL2 and Given X??2:
ZZLL2=[WLL2 WLL2(:,1:3)];ZZLH2=[ZLH2 ZLH2(:,1:3)];
ZZHL2=[ZHL2 ZHL2(:,1:3)];ZZHH2=[ZHH2 ZHH2(:,1:3)];
K=2*size(WLL2,1);
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
WLL1=A1+B1+C1+D1;WLL1=WLL1';
%1st Stage Reconstruction: Use Computed ZLL1 and Given X??1:
ZZLL1=[WLL1 WLL1(:,1:3)];ZZLH1=[ZLH1 ZLH1(:,1:3)];
ZZHL1=[ZHL1 ZHL1(:,1:3)];ZZHH1=[ZHH1 ZHH1(:,1:3)];
K=2*size(WLL1,1);
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
WLL0=A0+B0+C0+D0;W=WLL0';
%End inverse wavelet transform:Z->W
KK=find(Q==1);WK(KK)=W(KK);YWK=Y-WK;%D=F'(y-FH'z^{k}).%%%%%%%%%%%%


%HF'(y-FH'z^{k})=HF'(FD)=HD=H(YWK).
%Now wavelet transform of YWK:{X???}
%1st Stage db3 Daubechies Wavelet Transform:

XXLL0=[YWK(:,end-L+2:end) YWK];%Cyclic Pre-padding
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

%End wavelet transform of DYWK->X???.
%z^{k+1}=z^{k}+HF'(y-FH'z^{k}):Now add z^{k}:
ZLH1=ZLH1+XLH1;ZHL1=ZHL1+XHL1;ZHH1=ZHH1+XHH1;
ZLH2=ZLH2+XLH2;ZHL2=ZHL2+XHL2;ZHH2=ZHH2+XHH2;
ZLH3=ZLH3+XLH3;ZHL3=ZHL3+XHL3;ZHH3=ZHH3+XHH3;
ZLL3=ZLL3+XLL3;%Only use finest-scale average.
%First, threshold small values to 0.
ZLH1(abs(ZLH1)<lambda)=0;ZHL1(abs(ZHL1)<lambda)=0;
ZLH2(abs(ZLH2)<lambda)=0;ZHL2(abs(ZHL2)<lambda)=0;
ZLH3(abs(ZLH3)<lambda)=0;ZHL3(abs(ZHL3)<lambda)=0;
ZHH1(abs(ZHH1)<lambda)=0;ZHH2(abs(ZHH2)<lambda)=0;
ZHH3(abs(ZHH3)<lambda)=0;ZLL3(abs(ZLL3)<lambda)=0;
%Shrink non-small values of Z???:
ZLH1(abs(ZLH1)>lambda)=ZLH1(abs(ZLH1)>lambda)-lambda*sign(ZLH1(abs(ZLH1)>lambda));
ZLH2(abs(ZLH2)>lambda)=ZLH2(abs(ZLH2)>lambda)-lambda*sign(ZLH2(abs(ZLH2)>lambda));
ZLH3(abs(ZLH3)>lambda)=ZLH3(abs(ZLH3)>lambda)-lambda*sign(ZLH3(abs(ZLH3)>lambda));
ZHL1(abs(ZHL1)>lambda)=ZHL1(abs(ZHL1)>lambda)-lambda*sign(ZHL1(abs(ZHL1)>lambda));
ZHL2(abs(ZHL2)>lambda)=ZHL2(abs(ZHL2)>lambda)-lambda*sign(ZHL2(abs(ZHL2)>lambda));
ZHL3(abs(ZHL3)>lambda)=ZHL3(abs(ZHL3)>lambda)-lambda*sign(ZHL3(abs(ZHL3)>lambda));
ZHH1(abs(ZHH1)>lambda)=ZHH1(abs(ZHH1)>lambda)-lambda*sign(ZHH1(abs(ZHH1)>lambda));
ZHH2(abs(ZHH2)>lambda)=ZHH2(abs(ZHH2)>lambda)-lambda*sign(ZHH2(abs(ZHH2)>lambda));
ZHH3(abs(ZHH3)>lambda)=ZHH3(abs(ZHH3)>lambda)-lambda*sign(ZHH3(abs(ZHH3)>lambda));
ZLL3(abs(ZLL3)>lambda)=ZLL3(abs(ZLL3)>lambda)-lambda*sign(ZLL3(abs(ZLL3)>lambda));
end;%Final inverse wavelet to get XHAT from Z:











%Inverse Wavelet H'=H^{-1}:Z->W:
%3rd Stage Reconstruction:
ZZLL3=[ZLL3 ZLL3(:,1:3)];ZZLH3=[ZLH3 ZLH3(:,1:3)];
ZZHL3=[ZHL3 ZHL3(:,1:3)];ZZHH3=[ZHH3 ZHH3(:,1:3)];
K=2*size(ZLL3,1);clear A* B* C* D*%Need this!
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
WLL2=A2+B2+C2+D2;WLL2=WLL2';
%2nd Stage Reconstruction: Use Computed ZLL2 and Given X??2:
ZZLL2=[WLL2 WLL2(:,1:3)];ZZLH2=[ZLH2 ZLH2(:,1:3)];
ZZHL2=[ZHL2 ZHL2(:,1:3)];ZZHH2=[ZHH2 ZHH2(:,1:3)];
K=2*size(WLL2,1);
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
WLL1=A1+B1+C1+D1;WLL1=WLL1';
%1st Stage Reconstruction: Use Computed ZLL1 and Given X??1:
ZZLL1=[WLL1 WLL1(:,1:3)];ZZLH1=[ZLH1 ZLH1(:,1:3)];
ZZHL1=[ZHL1 ZHL1(:,1:3)];ZZHH1=[ZHH1 ZHH1(:,1:3)];
K=2*size(WLL1,1);
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
WLL0=A0+B0+C0+D0;XHAT=WLL0';
%End inverse wavelet transform:Z->W=XHAT.
% figure,imagesc(XHAT),axis off,colormap(gray),title('Inpainted image')
