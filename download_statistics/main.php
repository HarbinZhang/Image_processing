<?php

try{
	$db = new PDO('sqlite:databases/test.db');
}catch(PDOException $e) {
    echo $e->getMessage();
}
?>


<html>
 <head>
 	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 </head>
 <body>
	<h1>PHP connect to SQLite</h1>
 
<?php
	foreach ($db->query('SELECT bookId, bookName, quantity FROM Downloads;') as $row) {
		echo '<p id=' . $row[0] . ' name='.$row[1].'>' . ' ' . $row[1] . ' : ' . $row[2] 
	 		.'  <button id=btn_'.$row[0].' onclick="download_func('. $row[0].')">download</button>' . '</p>';
	}
?>

<script>
function download_func(id) {
	var name = document.getElementById(id).getAttribute("name");
	$.ajax({
		type: "POST",
		url: "update_downloads.php",
		data: { bookId:id }
		// success:function( msg ) {
		// 	alert( "Data returned: " + msg );
		// }
	});	
	window.open("pdf/"+name+".pdf");
}
</script>



</body>
</html>