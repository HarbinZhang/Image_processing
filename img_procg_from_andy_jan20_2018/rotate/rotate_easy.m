%Reads a square grayscale image and ROTATES it clockwise by angle theta (in radians).
clear;
X=imread('clown.png');
N=size(X,1);theta=pi/6;%angle of rotation.
%Zero-pad image to odd size if image size is even:
if(2*floor(N/2)==N);
	X(N+1,N+1)=0;
end;

% figure,imagesc(X),colormap(gray),axis off,title('Original image')
SN=round(sqrt(2)*N);    %362
X(SN,SN)=0;
Y(SN,SN)=0;%Zero-pad to accommodate rotated image.
A=[cos(theta),sin(theta);-sin(theta),cos(theta)];%Rotation matrix.
I=[floor([0:N^2-1]/N)',mod([0:N^2-1],N)']+1;
IS=(N+1)/2;
JS=round(IS*sqrt(2));
I=I-IS;
J=round(I*A);
I=I+IS
J=J+JS;%center image for rotation about its center.
Y(SN*(J(:,1)-1)+J(:,2))=X(SN*(I(:,1)-1)+I(:,2));%Nearest-neighbor interpolation.
% figure,imagesc(Y),colormap(gray),axis off,title('Rotated image')

