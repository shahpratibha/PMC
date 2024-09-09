<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$configId = $data['project_id'] ?? null;

if (empty($configId)) {
    echo json_encode(["error" => "No project_id provided"]);
    exit;
}

if (!is_int($configId)) {
    if (ctype_digit($configId)) {
        $configId = (int) $configId;
    } else {
        echo json_encode(["error" => "Invalid project_id provided"]);
        exit;
    }
}


if (isset($data['Pid'])) {
    $pid = $data['Pid'];
    if (!is_int($pid)) {
        if (ctype_digit($pid)) {
            $data['Pid'] = (int) $pid;
        } else {
            echo json_encode(["error" => "Invalid Pid provided"]);
            exit;
        }
    }
}
function buildUpdateSQL($table, $data, $configId) {
    $fields = [];
    foreach ($data as $key => $value) {
        $fields[] = "\"$key\" = :$key";
    }
    $fields = implode(', ', $fields);
    return "UPDATE \"$table\" SET $fields WHERE works_aa_a = :configId";
}

function buildInsertSQL($table, $data) {
    $fields = implode(', ', array_map(fn($key) => "\"$key\"", array_keys($data)));
    $placeholders = implode(', ', array_map(fn($key) => ":$key", array_keys($data)));
    return "INSERT INTO \"$table\" ($fields) VALUES ($placeholders)";
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

    $tables = ["IWMS_line", "Polygon_data", "IWMS_point", "check"];
    foreach ($tables as $table) {
        if ($table === "check") {
            // Add current timestamp for the "time" field
            $updateData['time'] = date('Y-m-d H:i:sO');

            // Build the INSERT SQL
            $insertSQL = buildInsertSQL($table, $updateData);
            $stmtInsert = $pdo->prepare($insertSQL);
            foreach ($updateData as $key => $value) {
                $stmtInsert->bindValue(":$key", $value);
            }
            $stmtInsert->execute();
        } else {
            // Build the UPDATE SQL
            $updateSQL = buildUpdateSQL($table, $updateData, $configId);
            $stmtUpdate = $pdo->prepare($updateSQL);
            foreach ($updateData as $key => $value) {
                $stmtUpdate->bindValue(":$key", $value);
            }
            $stmtUpdate->bindValue(':configId', $configId, PDO::PARAM_INT);
            $stmtUpdate->execute();
        }
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
