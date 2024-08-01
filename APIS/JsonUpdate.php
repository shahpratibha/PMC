<?php
require 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Read and parse the JSON file
$jsonFilePath = '../API-Responses/all-project-new-data.json'; // Adjust the path as needed
$jsonData = file_get_contents($jsonFilePath);

if ($jsonData === false) {
    echo json_encode(["error" => "Failed to read JSON file"]);
    exit;
}

$dataArray = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON in file"]);
    exit;
}

// Filter the data to keep only required fields
$filteredData = array_map(function($item) {
    return [
        'works_aa_approval_id' => $item['works_aa_approval_id'],
        'budget_amount' => $item['budget_amount'],
        'used_amt' => $item['used_amt']
    ];
}, $dataArray);

// Define the function to build the SQL query
function buildUpdateSQL($table, $data, $configId) {
    $fields = [];
    foreach ($data as $key => $value) {
        $fields[] = "\"$key\" = :$key";
    }
    $fields = implode(', ', $fields);
    return "UPDATE \"$table\" SET $fields WHERE works_aa_a = :configId";
}

// Define the fields to update
$fieldsToUpdate = [
    'budget_amount',
    'used_amt',
];

try {
    $pdo->beginTransaction();

    // Loop through each item in the filtered data
    foreach ($filteredData as $data) {
        $configId = $data['works_aa_approval_id'] ?? null;
        $budget_amount = $data['budget_amount'] ?? null;
        $used_amt = $data['used_amt'] ?? null;

        if (empty($configId)) {
            continue; // Skip if no project ID provided
        }

        // Prepare update data
        $updateData = [
            'Budget_Amount' => $budget_amount,
            'Used_Amount' => $used_amt
        ];

        if (empty($updateData)) {
            continue; // Skip if no valid fields are provided for this item
        }

        // Update the database for each table
        $tables = ["IWMS_line", "Polygon_data", "IWMS_point"];
        foreach ($tables as $table) {
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
