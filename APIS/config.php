<?php
// $host = 'database-1.c01x1jtcm1ms.ap-south-1.rds.amazonaws.com';
// $dbname = 'postgres';
// $username = 'postgres';
// $password = 'anup12345';

// Database connection:
$Host- 'iwmsgis.pmc.gov.in';
// $Port- '5432';
$Dbname- 'pmc';
$Username- 'postgres';
$Password- 'pmc992101';

try {
    // Establish a connection to the database
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Connected successfully!";
} catch (PDOException $e) {
    // Handle connection errors
    echo "Connection failed: " . $e->getMessage();
}
?>
