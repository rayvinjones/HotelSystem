<?php

$host = 'localhost';
$dbname = 'hotel_booking';
$username = 'root';
$password = '';
$conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $roomNumber = $_POST['roomNumber'];
    $guestName = $_POST['guestName'];
    $checkinDate = $_POST['checkinDate'];
    $checkoutDate = $_POST['checkoutDate'];

    $stmt = $conn->prepare("INSERT INTO bookings (room_number, guest_name, checkin_date, checkout_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$roomNumber, $guestName, $checkinDate, $checkoutDate]);

    
    echo json_encode(['success' => true]);
}
?>
