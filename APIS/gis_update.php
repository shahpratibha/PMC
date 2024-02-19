<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['geoJSON'])) {
    echo json_encode(["error" => "GeoJSON data not provided"]);
    exit; 
}
$geoJSONData = $data['geoJSON'];
$roadLength = isset($data['roadLength']) ? $data['roadLength'] : null;
$bufferWidth = isset($data['bufferWidth']) ? $data['bufferWidth'] : null;

if (is_null($geoJSONData)) {
    echo json_encode(["error" => "Invalid GeoJSON format"]);
    exit; 
}

$geometry = $geoJSONData['features'][0]['geometry'];
$geometryJSON = json_encode($geometry);

$stmt = $pdo->prepare("INSERT INTO geodata (geometry, length, width) VALUES (ST_GeomFromGeoJSON(:geometry), :length, :width)");

$stmt->bindParam(':geometry', $geometryJSON, PDO::PARAM_STR);
$stmt->bindParam(':length', $roadLength, PDO::PARAM_STR); 
$stmt->bindParam(':width', $bufferWidth, PDO::PARAM_STR);

try {
    $stmt->execute();
    $lastInsertId = $pdo->lastInsertId();
    echo json_encode(["message" => "Data successfully saved to the database", "lastInsertId" => $lastInsertId]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
