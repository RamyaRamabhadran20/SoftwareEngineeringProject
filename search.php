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

    echo '<br /> Book Title: ' .$row['BookTitle'];
    echo '<br /> BookID: ' .$row['BookID'];
    echo '<br /> Author: '.$row['Author'];
    echo '<br /> Genre: '.$row['Genre'];
    echo '<br /> Price: '.$row['Price'];
    echo '<br /> Summary: ' .$row['Summary'];


}
} else {
    echo "No results found with that search";
}

$conn->close();

?>


