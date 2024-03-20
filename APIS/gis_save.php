<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['geoJSON'])) {
    echo json_encode(["error" => "GeoJSON data not provided"]);
    exit; 
}

$geoJSONData = json_decode($data['geoJSON'], true);
$selectCoordinatesData = $data['selectCoordinatesData'];
$roadLength = isset($data['roadLength']) ? $data['roadLength'] : null;
$bufferWidth = isset($data['bufferWidth']) ? $data['bufferWidth'] : null;
$configId = isset($data['gis_id']) ? (int) $data['gis_id'] : 0;

$geometry = $geoJSONData['features'][0]['geometry'];
$geometryJSON = json_encode($geometry);

$selectedGeometry = $selectCoordinatesData[0]['geometry'] ;
$selectedGeometryJson = json_encode($selectedGeometry);


if (is_null($geoJSONData)) {
    echo json_encode(["error" => "Invalid GeoJSON format"]);
    exit;
}

$sqlGet = "SELECT * FROM conceptual_form WHERE id = :id";
$stmtGet = $pdo->prepare($sqlGet);
$stmtGet->bindParam(':id', $configId, PDO::PARAM_INT);
$stmtGet->execute();
$configData = $stmtGet->fetch(PDO::FETCH_ASSOC);


if (!$configData) {
    echo json_encode(["error" => "No data found for the provided configId"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO geodata (geometry, length, width) VALUES (ST_GeomFromGeoJSON(:geometry), :length, :width)");


$stmt->bindParam(':geometry', $geometryJSON, PDO::PARAM_STR);
$stmt->bindParam(':length', $roadLength, PDO::PARAM_STR); 
$stmt->bindParam(':width', $bufferWidth, PDO::PARAM_STR);

try {
    $stmt->execute();
    $lastInsertId = $pdo->lastInsertId();
  //  echo json_encode(["message" => "Data successfully saved to the database", "lastInsertId" => $lastInsertId]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
     exit;
}




$stmtIWMS = $pdo->prepare("INSERT INTO \"IWMS_line\" (
    geom, je_name, name_of_wo, project_fi, scope_of_w, ward, work_type, zone, contact_no, length, width
) VALUES (
    ST_Force3D(ST_GeomFromGeoJSON(:geometry)), :je_name, :name_of_wo, :project_fi, :scope_of_w, :ward, :work_type, :zone, :contact_no, :length, :width
)");

$stmtIWMS->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
// $stmtIWMS->bindParam(':department', $configData['department'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':je_name', $configData['junior_engineer_name'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':name_of_wo', $configData['work_name'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':project_fi', $configData['project_financial_year'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':scope_of_w', $configData['scope_of_work'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':ward', $configData['ward'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':work_type', $configData['work_type'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':zone', $configData['zone'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':contact_no', $configData['contact_no'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':length', $configData['length'], PDO::PARAM_STR);
$stmtIWMS->bindParam(':width', $configData['width'], PDO::PARAM_STR);

try {
    $stmtIWMS->execute();
    $lastInsertIdIWMS = $pdo->lastInsertId();
    // Respond with success message, including IDs from both insert operations
    echo json_encode(["message" => "Data successfully saved to both tables", "lastInsertIdGeodata" => $lastInsertId, "lastInsertIdIWMS" => $lastInsertIdIWMS]);
} catch (PDOException $e) {
    // If the insert into IWMS_polygon fails, consider how you want to handle the error.
    // This could include rolling back the insert into geodata, if appropriate.
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}


?>
