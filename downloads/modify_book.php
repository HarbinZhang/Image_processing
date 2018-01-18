<?php
try{
	$db = new PDO('sqlite:databases/test.db');
}catch(PDOException $e) {
    echo $e->getMessage();
}





if (is_ajax()) {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if data value exists
		$bookName = $_POST['bookName'];
		$author = $_POST['author'];
		$action = $_POST["action"];
		switch($action) { //Switch case for value of action
			case "add": addBook($db, $bookName, $author); break;
			case "delete": deleteBook($db, $bookName, $author); break;
		}
	}
}



echo -1;

?>

<?php
	function addBook($db, $bookName, $author){
		$sql = 'INSERT INTO Downloads(bookName, author) VALUES(:bookName, :author)';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':bookName', $bookName);
		$stmt->bindValue(':author', $author);
		$stmt->execute();
	}

	function deleteBook($db, $bookName, $author){
		$sql = 'DELETE FROM Downloads WHERE bookName =:bookName AND author =:author';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':bookName', $bookName);
		$stmt->bindValue(':author', $author);
		$stmt->execute();
	}

	function is_ajax() {
		return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
	}

?>