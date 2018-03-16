<?php 


try{
	$db = new PDO('sqlite:databases/test.db');
}catch(PDOException $e) {
    echo $e->getMessage();
}

$sql = 'DROP TABLE IF EXISTS Downloads;
CREATE TABLE Downloads(
bookId INTEGER PRIMARY KEY AUTOINCREMENT,
bookName TEXT,
author TEXT,
quantity INT NOT NULL DEFAULT 0
);';

$db->exec($sql);

?>