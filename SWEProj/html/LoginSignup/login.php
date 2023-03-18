<!DOCTYPE html>   
<html>   
<head>  
	<meta name="viewport" content="width=device-width, initial-scale=1">  
	<title>RUListening Login</title>  
	<link rel="stylesheet" type="text/css" href="style.css"/>
</head>    
<body>    
    <h1>Welcome to RUListening!</h1>
    <form action = "includes/login.inc.php" method = "post">  
    <div class="container">  
		<div class="slider"></div>
            <div class="switchButton">
                <button class="login"><a href="login.php">Log In</a></button>
            	<button class="signup"><a href="signup.php">Sign Up</a></button>
        	</div>
        	<div class="userInput">
                <div class="loginInput">
                    <input type="text" placeholder="Enter Username" name="uid" required>  
                    <input type="password" placeholder="Enter Password" name="pwd" required>
                    <div class="extra"><input type="checkbox" checked="checked"> Remember me</div>
                    <div class="forgotPass">Forgot <a href="#">password</a>?</div>
                    <button type="submit" name = "submit">Login</button>    
                </div>
            </div>
    </div>
    </form>

    <?php
        if(isset($_GET["error"])) {
            if ($_GET["error"] == "emptyinput") {
                echo "<p>Fill in all fields!</p>";
            }
            else if ($_GET["error"] == "wronglogin") {
                echo "<p>Incorrect login information!</p>";
            }
            else if ($_GET["error"] == "none") {
                echo "<p>You have logged in!</p>";
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