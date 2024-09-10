<?php
require 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON received"]);
    exit;
}

$configId = $data['project_id'] ?? null;

if (empty($configId)) {
    echo json_encode(["error" => "No project ID provided"]);
    exit;
}

function buildUpdateSQL($table, $data) {
    $fields = [];
    foreach ($data as $key => $value) {
        $fields[] = "\"$key\" = :$key";
    }
    
    // Add the Project_Time field with the current timestamp
    $fields[] = "\"Project_Time\" = NOW()";
    
    $fields = implode(', ', $fields);
    return "UPDATE \"$table\" SET $fields WHERE works_aa_a = :configId";
}

$fieldsToUpdate = [
    'tender_amo',
    'Budget_Year',
    'Agency',
    'Budget_Code',
    'Status',
    'Pid',
];

$updateData = array_filter(
    $data,
    function ($key) use ($fieldsToUpdate) {
        return in_array($key, $fieldsToUpdate);
    },
    ARRAY_FILTER_USE_KEY
);

if (empty($updateData)) {
    echo json_encode(["error" => "No valid fields provided for update"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $tables = ["IWMS_line", "Polygon_data", "IWMS_point", "GIS_Ward_Layer"];
    foreach ($tables as $table) {
        $updateSQL = buildUpdateSQL($table, $updateData);
        $stmtUpdate = $pdo->prepare($updateSQL);
        foreach ($updateData as $key => $value) {
            $stmtUpdate->bindValue(":$key", $value);
        }
        $stmtUpdate->bindValue(':configId', $configId, PDO::PARAM_INT);
        $stmtUpdate->execute();
    }

    $pdo->commit();

    echo json_encode([
        'status' => true,
        'message' => 'Data updated successfully.',
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
