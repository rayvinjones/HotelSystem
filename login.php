<?php

session_start();


$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$conn = new mysqli("localhost", "root", "", "hotel_db"); 

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows > 0) {
    $_SESSION['username'] = $username; 
    echo "success"; 
} else {
    echo "error";
}

$stmt->close();
$conn->close();
?>
