<!DOCTYPE html>
<html>
<head>
  <title>Rent the First Percy Jackson Book</title>
</head>
<body>

  <?php

  // Connect to the database
  session_start();
  $db = mysqli_connect("localhost", "root", "", "books");
  $user = mysqli_query($db, "SELECT * FROM users");
    if(!isset($_SESSION['user_id'])){
        header('Location: login.php');
        exit();
    }
    echo "<p>Hello, ".$_SESSION['username']."</p>";

  // Retrieve the Percy Jackson book information from the database
  $result = mysqli_query($db, "SELECT * FROM catalog WHERE BookTitle='Percy Jackson: The Lightning Thief'");
  $book = mysqli_fetch_assoc($result);

  // Check if the book is there
/*  if (isset($_POST['book_id'])) {
    $book_id = $_POST['book_id'];
    mysqli_query($db, "UPDATE books SET available=0 WHERE id='$book_id'");
    echo "<p>Thank you for renting the book! You can now enjoy reading it.</p>";
  }*/
  if(isset($_POST['Wishlist'])){
    $book_id = $_POST['BookID'];
    $query = "INSERT INTO users (Wishlist) VALUE ('$book_id')";
    mysqli_query($db,$query);
    echo "<p>Book has been added</p>";

    /*
    $user_id = $_SESSION['username'];
    $query = "INSERT INTO Wishlist (BookID)";
    mysqli_query($user,$query);
    */

    echo "<p>Book added to wishlist!</p>";
  }
  ?>

  <h1>Rent the First Percy Jackson Book</h1>

  <div class="book">
    <h2><?php echo $book['BookTitle']; ?></h2>
    <p>By <?php echo $book['Author']; ?></p>
    <p><?php echo $book['Summary']; ?></p>
    <img src="https://rif.org/sites/default/files/images/2022/06/14/Book_Covers/lightningthief.jpg" alt="Book cover image">
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
      <input type="hidden" name="book_id" value="<?php echo $book['BookID']; ?>">
      <input type="submit" value="Rent this book">
      <input type ="submit" value = "Wishlist">
    </form>
  </div>

</body>
</html>