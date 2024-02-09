
<?php
require 'config.php';

header('Content-Type: application/json');

// Extract geometry type and coordinates from GeoJSON data
// $geometryType = $data['geometry']['type'];

$data = json_decode($_POST['geoJSON'], true);

print_r($data);

$geometryType = $data['features'][0]['geometry']['type'];

$dd = $data['features'][0]['properties'];



$stmt = $pdo->prepare("INSERT INTO geodata (geometry) VALUES (ST_GeomFromGeoJSON(:geometry))");

// Bind parameters
// $stmt->bindParam(':geometry', json_encode($data['geometry']), PDO::PARAM_STR);
$stmt->bindParam(':geometry', json_encode($data['features'][0]['geometry']), PDO::PARAM_STR);
$stmt->bindParam(':type', $geometryType, PDO::PARAM_STR);

// ''''''''''added from here

$stmt = $pdo->prepare("INSERT INTO geodata (geometry)
                        VALUES (ST_GeomFromGeoJSON(:geometry))");

// Bind parameters
$stmt->bindParam(':geometry', json_encode($data['features'][0]['geometry']), PDO::PARAM_STR);
$stmt->bindParam(':type', $geometryType, PDO::PARAM_STR);
// foreach ($dd as $key => $value) {
// Assuming you have key1, value1, key2, value2 in your $data array
$stmt->bindParam(':key1', $key1, PDO::PARAM_STR);
$stmt->bindParam(':value1', $value1, PDO::PARAM_STR);
$stmt->bindParam(':key2', $key2, PDO::PARAM_STR);
$stmt->bindParam(':value2', $value2, PDO::PARAM_INT);

try {
    // Execute the prepared statement
    $stmt->execute();
    echo "Data successfully saved to the database";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
// }

?>

