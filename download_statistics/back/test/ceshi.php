<?php
//Step1
 $db = mysqli_connect('localhost','root','root','test')
 or die('Error connecting to MySQL server.');
?>

<html>
 <head>
 </head>
 <body>
<h1>PHP connect to MySQL</h1>
 
<?php
//Step2
$query = "SELECT * FROM User";
$result = mysqli_query($db, $query) or die('Error querying database.');

$row = mysqli_fetch_array($result);

while ($row = mysqli_fetch_array($result)) {
 echo $row['username'] . ' ' . $row['firstname'] . ': ' . $row['lastname'] . ' ' . $row['Email'] .'<br />';
}
?>

</body>
</html>