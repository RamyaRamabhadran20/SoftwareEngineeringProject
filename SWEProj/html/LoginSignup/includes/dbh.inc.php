<?php
$serverName = "localhost";
$dBUsername = "root";
$dBPassword = "";
$dBName = "loginSys";

$conn = mysqli_connect($serverName, $dBUsername, $dBPassword, $dBName);

if (!$conn) {
    die("Connection faled: " . mysqli_connect_error());
}