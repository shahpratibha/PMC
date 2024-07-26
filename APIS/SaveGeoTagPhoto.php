<?php
require 'config.php';

header('Content-Type: application/json');

// Decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Extract parameters from input
$proj_id = isset($data['proj_id']) ? (int) $data['proj_id'] : null;
$ra = isset($data['ra']) ? (int) $data['ra'] : null;
$category = isset($data['category']) ? (string) $data['category'] : null;
$photo = isset($data['photo']) ? (string) $data['photo'] : null;
$selectedGeometry = isset($data['geom']) ? $data['geom'] : null;

if (is_null($proj_id)) {
    echo json_encode(["error" => "Missing required field: proj_id"]);
    exit;
}

if (is_null($ra)) {
    echo json_encode(["error" => "Missing required field: ra"]);
    exit;
}

if (is_null($category)) {
    echo json_encode(["error" => "Missing required field: category"]);
    exit;
}

if (is_null($photo)) {
    echo json_encode(["error" => "Missing required field: photo"]);
    exit;
}

if (is_null($selectedGeometry) || !is_array($selectedGeometry) || count($selectedGeometry) != 2) {
    echo json_encode(["error" => "Invalid or missing geometry"]);
    exit;
}

$longitude = $selectedGeometry[0];
$latitude = $selectedGeometry[1];
$wktGeom = "POINT($longitude $latitude)";

try {
    $stmtInsertData = $pdo->prepare("INSERT INTO geotagphoto (proj_id, ra, category, photo, geom) VALUES (:proj_id, :ra, :category, :photo, ST_GeomFromText(:geom, 4326))");
    $stmtInsertData->bindParam(':proj_id', $proj_id, PDO::PARAM_INT);
    $stmtInsertData->bindParam(':ra', $ra, PDO::PARAM_INT);
    $stmtInsertData->bindParam(':category', $category, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':photo', $photo, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':geom', $wktGeom, PDO::PARAM_STR);

    $stmtInsertData->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Geometry Saved Successfully'
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>
