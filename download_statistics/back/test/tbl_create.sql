DROP TABLE IF EXISTS User;
create table User(
username VARCHAR(20),
firstname VARCHAR(20),
lastname VARCHAR(20),
Password VARCHAR(256),
Email VARCHAR(40),
primary key (username)
);

DROP TABLE IF EXISTS Album; 
create table Album(
albumid INT NOT NULL AUTO_INCREMENT,
title VARCHAR(50),
created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
username VARCHAR(20) REFERENCES User(username),
access ENUM('private','public'),
primary key (albumid)
);
DROP TABLE IF EXISTS AlbumAccess; 
create table AlbumAccess(
albumid INT NOT NULL AUTO_INCREMENT,
username VARCHAR(20) REFERENCES User(username),
primary key (albumid,username)
);
DROP TABLE IF EXISTS Contain;
create table Contain(
sequencenum INT,
albumid INT REFERENCES Album(albumid),
picid VARCHAR(40),
caption VARCHAR(255) NOT NULL DEFAULT "",
primary key (sequencenum)
);
DROP TABLE IF EXISTS Photo;
create table Photo(
picid VARCHAR(40),
format CHAR(3) DEFAULT 'JPG',
date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
primary key(picid)
); 

ALTER TABLE Contain ADD FOREIGN KEY (picid) REFERENCES Photo (picid);
