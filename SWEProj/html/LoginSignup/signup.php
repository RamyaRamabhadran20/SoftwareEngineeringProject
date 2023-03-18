<!DOCTYPE html>   
<html>   
<head>  
    <meta name="viewport" content="width=device-width, initial-scale=1">  
    <title>RUListening Sign Up</title>  
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>    
<body>    
    <h1>Welcome to RUListening!</h1>
    <form action = "includes/signup.inc.php" method = "post">
    <div class="container">
        <div class="slider2"></div>
            <div class="switchButton">
                <button class="login"><a href="login.php">Log In</a></button>
                <button class="signup"><a href="signup.php">Sign Up</a></button>
            </div>
            <div class="userInput">
                <div class="signupInput">
                    <input type="text" placeholder="Enter First Name" name="firstName" required>
                    <input type="text" placeholder="Enter Last Name" name="lastName" required>
                    <input type="email" placeholder="Enter Email" name="email" required>            
                    <input type="text" placeholder="Enter Username" name="username" required>  
                    <input type="password" pattern="(?=.*d) (?=.*[a-z]) (?=.*[A-Z]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters." placeholder="Enter Password" name="password" required>   
                    <input type="password" placeholder="Confirm Password" name="confirmPassword" required>          
                    <button type="submit" name = "submit">Sign Up</button>                    
                </div>
            </div>
    </div>
    </form>
    
    <?php
        if(isset($_GET["error"])) {
            if ($_GET["error"] == "emptyinput") {
                echo "<p>Fill in all fields!</p>";
            }
            else if ($_GET["error"] == "invaliduid") {
                echo "<p>Choose a proper username!</p>";
            }
            else if ($_GET["error"] == "invalidemail") {
                echo "<p>Choose a proper email!</p>";
            }
            else if ($_GET["error"] == "passwordsdontmatch") {
                echo "<p>Passwords don't match!</p>";
            }
            else if ($_GET["error"] == "stmtfailed") {
                echo "<p>Something went wrong, try again!</p>";
            }
            else if ($_GET["error"] == "usernametaken") {
                echo "<p>Username already taken!</p>";
            }
            else if ($_GET["error"] == "none") {
                echo "<p>You have signed up!</p>";
            }
        }
    ?>
    <?php
$connection = mysqli_connect('localhost', 'root', '', 'shoping_cart');
if(!$connection){
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
?>
</body>     
</html> 
