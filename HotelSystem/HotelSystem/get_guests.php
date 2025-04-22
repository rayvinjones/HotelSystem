<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Return JSON response
header("Content-Type: application/json");

// Include DB connection
require 'db_connection.php';

$guests = [];

$sql = "SELECT guest_id, firstname, middlename, surname, gender, address, contact, status FROM guests";

if ($result = $conn->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        $guests[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $guests
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Query failed: " . $conn->error
    ]);
}

$conn->close();
?>
