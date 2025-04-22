<?php
header("Content-Type: application/json");

$guestName = $_POST['guestName'] ?? '';
$roomNumber = $_POST['roomNumber'] ?? '';
$checkinDate = $_POST['checkinDate'] ?? '';
$checkoutDate = $_POST['checkoutDate'] ?? '';

if (!$guestName || !$roomNumber || !$checkinDate || !$checkoutDate) {
  echo json_encode(["success" => false, "message" => "Missing required fields"]);
  exit;
}

try {
  $pdo = new PDO("mysql:host=localhost;dbname=your_database_name", "your_username", "your_password");
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $stmt = $pdo->prepare("INSERT INTO bookings (guest_name, room_number, check_in, check_out) VALUES (?, ?, ?, ?)");
  $stmt->execute([$guestName, $roomNumber, $checkinDate, $checkoutDate]);

  echo json_encode(["success" => true]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
