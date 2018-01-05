<?php

try{
	$db = new PDO('sqlite:databases/test.db');
	$update_query = $db->prepare("UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = :bookId");
	$update_query->bindValue(':bookId',$_REQUEST['bookId']);
	$res = $update_query->execute();

	if($res){
		echo "hi";
	}else{
		echo "\nPDO::errorInfo():\n";
		print_r($update_query->errorInfo());
	}

}catch(PDOException $e) {
    echo $e->getMessage();
}

	// "UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = 1; "

?>