<?php
require 'config.php';

header('Content-Type: application/json');

// Decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Extract parameters from input
$works_aa_approval_id = isset($data['works_aa_approval_id']) ? (int) $data['works_aa_approval_id'] : null;
$proj_id = isset($data['proj_id']) ? (int) $data['proj_id'] : null;
$ra = isset($data['ra']) ? (int) $data['ra'] : null;
$category = isset($data['category']) ? (string) $data['category'] : null;
$photo = isset($data['photo']) ? (string) $data['photo'] : null;
$selectedGeometry = isset($data['geom']) ? $data['geom'] : null;

$longitude =  isset($data['longitude']) ? $data['longitude'] : null;
$latitude =  isset($data['lattitude']) ? $data['lattitude'] : null;

$imagePath =  isset($data['imagePath']) ? $data['imagePath'] : null;


if (is_null($works_aa_approval_id)) {
    echo json_encode(["error" => "Missing required field: works_aa_approval_id"]);
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

if (is_null($longitude)) {
    echo json_encode(["error" => "Missing required field: longitude"]);
    exit;
}

if (is_null($latitude)) {
    echo json_encode(["error" => "Missing required field: latitude"]);
    exit;
}




$wktGeom = "POINT($longitude $latitude)";

try {
    $stmtInsertData = $pdo->prepare("INSERT INTO geotagphoto (works_aa_approval_id,proj_id, ra, category, photo, geom, imagePath) VALUES (:works_aa_approval_id,:proj_id, :ra, :category, :photo, ST_GeomFromText(:geom, 4326),:imagePath)");
  
    $stmtInsertData->bindParam(':works_aa_approval_id', $works_aa_approval_id, PDO::PARAM_INT);
    $stmtInsertData->bindParam(':proj_id', $proj_id, PDO::PARAM_INT);
    $stmtInsertData->bindParam(':ra', $ra, PDO::PARAM_INT);
    $stmtInsertData->bindParam(':category', $category, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':photo', $photo, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':geom', $wktGeom, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':imagePath', $imagePath, PDO::PARAM_STR);

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
