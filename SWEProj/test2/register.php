<!DOCTYPE html>
<html>
<head>
  <title>Register an Account</title>
</head>
<body>

  <?php
  // Start the session and connect to the database
  session_start();
  $db = mysqli_connect("localhost", "root", "", "books");
  if (isset($_POST['username']) && isset($_POST['password'])) {
    // Retrieve the user information from the database
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];

    $username = mysqli_real_escape_string($db,$username);
    $password = mysqli_real_escape_string($db,$password);
    $email = mysqli_real_escape_string($db,$email);

    $query = "INSERT INTO users (username, password, email) VALUES ('$username','$password','$email')";
    mysqli_query($db,$query);

    $_SESSION['user_id'] = mysqli_insert_id($db);
    $_SESSION['username'] = $username;
    header("Location: login.php");
    exit();
  }
?>
    
<h1>Register an Account</h1>
<form action = "<?php echo $_SERVER['PHP_SELF']; ?>" method = "post">
<label for = "username">Username</label>; 
<input type = "text" name = "username" id = "username">
<br>
<label for = "email">Email</label>
<input type = "email" name = "email" id = "email">
<br>
<label for = "password">Password</label>
<input type = "password" name = "password" id = "password">
<br>
<input type = "submit" value = "Register">
</form>

</body>
</html>