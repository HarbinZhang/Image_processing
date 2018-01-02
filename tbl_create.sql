DROP TABLE IF EXISTS Downloads;
create table Downloads(
bookId INT NOT NULL AUTO_INCREMENT,
bookName VARCHAR(50),
author VARCHAR(20),
quantity INT NOT NULL DEFAULT 0,
primary key (bookId)
);