<?php

$host = 'localhost';
$dbname = 'hotel_booking';
$username = 'root';
$password = '';
$conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

$stmt = $conn->query("SELECT * FROM bookings");
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['bookings' => $bookings]);
?>
