<!DOCTYPE html>
<html>
<head>
  <title>Login Page</title>
</head>
<body>

  <?php
  // Start the session and connect to the database
  session_start();
  $db = mysqli_connect("localhost", "root", "", "books");


  // Check if the login form has been submitted
  if (isset($_POST['username']) && isset($_POST['password'])) {
    // Retrieve the user information from the database
    $username = $_POST['username'];
    $password = $_POST['password'];
    $result = mysqli_query($db, "SELECT * FROM users WHERE username='$username' AND password='$password'");
    $user = mysqli_fetch_assoc($result);

    // Check if the user exists in the database
    if (mysqli_num_rows($result) == 1) {
      // Store the user information in the session and redirect to the home page
      $_SESSION['user_id'] = $user['id'];
      $_SESSION['username'] = $user['username'];
      header("Location: tester.php");
      exit();
    } else {
      // Display an error message if the login credentials are incorrect
      echo "<p>Invalid username or password. Please try again.</p>";
    }
  }
  ?>

  <h1>Login Page</h1>

  <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    <label for="username">Username:</label>
    <input type="text" name="username" id="username">
    <br>
    <label for="password">Password:</label>
    <input type="password" name="password" id="password">
    <br>
    <input type="submit" value="Login">
  </form>

</body>
</html>