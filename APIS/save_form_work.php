<?php
include 'config.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data
    $fid = $_POST['fid'];
    $work_id = $_POST['workId'];
    $department = $_POST['department'];
    $username = $_POST['username'];
    $contact = $_POST['contact'];
    $comments = $_POST['comments'];
    $rating = $_POST['rating'];
    $live_location = $_POST['live_location'];
    $ip_address = $_POST['ip_address'];

    try {
        // Prepare and execute the SQL statement using PDO
        $stmt = $pdo->prepare("INSERT INTO work_details (fid, work_id, department, username, contact, comments, rating, live_location, ip_address) 
                               VALUES (:fid, :work_id, :department, :username, :contact, :comments, :rating, :live_location, :ip_address)");
        $stmt->bindParam(':fid', $fid);
        $stmt->bindParam(':work_id', $work_id);
        $stmt->bindParam(':department', $department);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':contact', $contact);
        $stmt->bindParam(':comments', $comments);
        $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
        $stmt->bindParam(':live_location', $live_location);
        $stmt->bindParam(':ip_address', $ip_address);

        if ($stmt->execute()) {
            echo "Form data saved successfully!";
        } else {
            echo "Error: Could not save form data.";
        }

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
