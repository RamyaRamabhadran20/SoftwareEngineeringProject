<!DOCTYPE html>
<html>
<head>
    <title>T-Shirt Shop</title>
</head>
<body>
    <h1>T-Shirt Shop</h1>
    <?php
        // Initialize variables for shirt attributes
        $shirt_color = '';
        $shirt_size = '';
        $shirt_quantity = '';

        // Check if the form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Retrieve shirt attributes from the form
            $shirt_color = test_input($_POST["color"]);
            $shirt_size = test_input($_POST["size"]);
            $shirt_quantity = test_input($_POST["quantity"]);
            
            // Perform validation on shirt attributes (e.g., make sure quantity is a number)
            // ...

            // Calculate the total cost of the order
            $price_per_shirt = 20.00; // Set the price per shirt
            $total_cost = $shirt_quantity * $price_per_shirt;
            
            // Display the order confirmation to the user
            echo "<p>Thank you for your order!</p>";
            echo "<p>You ordered $shirt_quantity $shirt_color T-shirts in size $shirt_size.</p>";
            echo "<p>The total cost of your order is $total_cost.</p>";
        }

        // A function to sanitize user input
        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    ?>

    <h2>Order Form</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        <label for="color">Color:</label>
        <input type="text" id="color" name="color"><br><br>

        <label for="size">Size:</label>
        <select id="size" name="size">
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
        </select><br><br>

        <label for="quantity">Quantity:</label>
        <input type="text" id="quantity" name="quantity"><br><br>

        <input type="submit" value="Order Now">
    </form>
</body>
</html>