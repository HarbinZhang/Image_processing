<?php

	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "test";


	$db = mysqli_connect('localhost','root','root','test') 
		or die('Error connecting to MySQL server.');
?>



<html>
 <head>
 	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 </head>
 <body>
	<h1>PHP connect to MySQL</h1>
 
<?php
	$query = "SELECT * FROM Downloads";
	$result = mysqli_query($db, $query) or die('Error querying database.');



	while ($row = mysqli_fetch_array($result)) {
	echo '<p id=' . $row['bookId'] . '>' . ' ' . $row['bookName'] . ' : ' . $row['quantity'] 
	 	.'  <button id=btn_'.$row['bookId'].' onclick="download_func('. $row['bookId']. ')">download</button>' . '</p>';
	}

	mysqli_close($db);
?>

<script>
function download_func(id) {
	$.ajax({
		type: "POST",
		url: "update_downloads.php",
		data: { bookId:id },
		success:function( msg ) {
			alert( "Data returned: " + msg );
		}
	});	
}
</script>



</body>
</html>