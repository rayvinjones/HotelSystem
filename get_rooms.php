<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
include 'db.php';

$sql = "SELECT * FROM rooms";
$result = $conn->query($sql);

$rooms = [];

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $rooms[] = $row;
  }
}

echo json_encode($rooms);

$conn->close();
?>
