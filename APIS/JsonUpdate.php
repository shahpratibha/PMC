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
    'tender_amo',
    'Budget_Year',
    'Agency',
    'Budget_Code',
    'Status',
    'Pid',
];

try {
    $pdo->beginTransaction();

    // Loop through each item in the JSON data
    foreach ($dataArray as $data) {
        $configId = $data['works_aa_approval_id'] ?? null;
        $pid = $data['works_ts_aproval_id'] ?? null;
        $tender_amount = $data['tender_amount'] ?? null;
        $agency = $data['agency'] ?? null;
        $status = $data['status'] ?? null;
        $budget_code = $data['budget_code'] ?? null;
        $budget_year = $data['budget_year'] ?? null;




        if (empty($configId)) {
            echo json_encode(["error" => "No project ID provided"]);
            exit;
        }

        // Prepare update data
        $updateData = array_filter(
            $data,
            function ($key) use ($fieldsToUpdate) {
                return in_array($key, $fieldsToUpdate);
            },
            ARRAY_FILTER_USE_KEY
        );

        // Add Pid to the update data
        $updateData['Pid'] = $pid;
        $updateData['tender_amo'] = $tender_amount;
        $updateData['Budget_Year'] = $budget_year;
        $updateData['Agency'] = $agency;
        $updateData['Budget_Code'] = $budget_code;
        $updateData['Status'] = $status;


        


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
