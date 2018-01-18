<?php
try{


	$db  = new SQLite3('databases/test.db');
	// $db = new SQLite3('analytics.sqlite', SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);
	$db->query('CREATE TABLE IF NOT EXISTS "visits" (
	    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	    "user_id" INTEGER,
	    "url" VARCHAR,
	    "time" DATETIME
	)');
	// $results = $db->query('UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = 3');


	// while ($row = $results->fetchArray()) {
 //    	var_dump($row);
	// }
	// $db_handle->exec($query_string);
	// $result     = $db_handle->query($query_string);
	// $row        = $result->fetchArray();



	// $file_db = new PDO('sqlite:databases/test.db');
	// // foreach ($file_db->query('SELECT bookId, bookName, quantity FROM Downloads;') as $row) {
	// // 	echo $row[0].' / '.$row[1].' / '.$row[2].'<br />';
	// // }

	// // $update_query = $file_db->prepare("UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = 3");

	// $update_query = $file_db->prepare("DELETE * FROM Downloads");

	// // // $update_query->bindValue(':bookId',1);
	// $res = $update_query->execute();
	// if($res){
	// 	echo "hi";
	// }else{
	// 	echo "\nPDO::errorInfo():\n";
	// 	print_r($update_query->errorInfo());
	// }
	// echo "hi";
	// echo '"'$res'"';
	// echo "</p>";
	// $file_db->query("UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = 3");

	// $count = $file_db->exec("DELETE * FROM Downloads WHERE bookId = 1");
	// $count = $file_db->query("SELECT * FROM Downloads WHERE bookId = 1");
	// print("Deleted $count rows.\n");
	echo"good";
	
}catch(PDOException $e) {
    echo $e->getMessage();
    echo "bad";
}
?>

<?php phpinfo();?>
