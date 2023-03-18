<?php
$search = $_POST['search'];
$conn = mysqli_connect('localhost', 'root','rishika123', 'catalogtable');;
if ($conn->connect_error){
    die("Connection failed: ". $conn->connect_error);
}

$sql = "select * from catalogtable where BookTitle like '%$search%' or Author like '%$search%'or Genre like '%$search%'";

$result = $conn->query($sql);

if ($result->num_rows > 0){
while($row = $result->fetch_assoc() ){
    echo $row["BookTitle"]."  ".$row["BookID"]."  ".$row["Author"]."  ".$row["Genre"]."  ".$row["Price"]."  ".$row["Summary"]."<br>";
}
} else {
    echo "0 records";
}

$conn->close();

?>
