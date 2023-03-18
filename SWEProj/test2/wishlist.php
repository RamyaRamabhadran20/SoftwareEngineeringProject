<!DOCTYPE html>
<html>
<head>
  <title>Wishlist</title>
</head>
<body>
  <?php
  // Start session and connect to database
  session_start();
  $db = mysqli_connect("localhost", "root", "", "books");

  // Check if user is logged in
  if (!isset($_SESSION['username'])) {
    header('Location: login.php');
    exit();
  }

  // Get user's wishlist items
  $user_id = $_SESSION['username'];
  $result = mysqli_query($db, "SELECT wishlist FROM users WHERE username='$user_id'");
  $wishlist = mysqli_fetch_assoc($result)['wishlist'];

  // Check if there are any items in the wishlist
  if (empty($wishlist)) {
    echo "<p>Your wishlist is empty.</p>";
  } else {
    // Display each item in the wishlist
    $book_ids = explode(",", $wishlist);
    echo "<h1>Wishlist</h1>";
    echo "<ul>";
    foreach ($book_ids as $book_id) {
      $result = mysqli_query($db, "SELECT * FROM catalog WHERE BookID='$book_id'");
      $book = mysqli_fetch_assoc($result);
      echo "<li><a href='tester.php?BookID={$book['BookID']}'>{$book['BookTitle']}</a></li>";
    }
    echo "</ul>";
  }
  ?>

</body>
</html>