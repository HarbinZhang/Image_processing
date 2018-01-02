<?php

	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "test";


	$db = mysqli_connect('localhost','root','root','test') 
		or die('Error connecting to MySQL server.');

	// "UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = 1; "
	$update_query = "UPDATE Downloads SET quantity = quantity + 1 WHERE bookId = ".$_REQUEST['bookId'].";";
	mysqli_query($db, $update_query) or die('Error querying database.');
	echo "update successful";	
?>