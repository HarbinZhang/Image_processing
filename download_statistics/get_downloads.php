<?php



try{
	$db = new PDO('sqlite:databases/test.db');
}catch(PDOException $e) {
    echo $e->getMessage();
}


if (is_ajax()) {
	if (isset($_POST["data"]) && !empty($_POST["data"])) { //Checks if data value exists
		$data = $_POST["data"];
		switch($data) { //Switch case for value of action
		case "all": getAll_function(); break;
		}
	}
}

//Function to check if the request is an AJAX request
function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function getAll_function(){
	global $db;

	$return = array();
	foreach ($db->query('SELECT bookId, bookName, author, quantity FROM Downloads;') as $row) {
		$item = array();
		array_push($item, $row[0], $row[1], $row[2], $row[3]);

		array_push($return, $item);
	}

	// $return["json"] = json_encode($return);
	echo json_encode(json_encode($return));
}



?>