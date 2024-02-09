<?php
require('config.php');

header('Content-Type: application/json');

try {

    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }


     $rawData = file_get_contents('php://input');

        // Parse the FormData into an associative array

        $formDataArray = json_decode($rawData, true);

    
    // Retrieve form data
    $projectNo = $formDataArray['projectNo'];
    $aaWork = $formDataArray['aaWork'];
    $workType = $formDataArray['workType'];
    $scopeOfWork = $formDataArray['scopeOfWork'];
    $projectFinancialYear = $formDataArray['projectFinancialYear'];
    $department = $formDataArray['department'];
    $projectType = $formDataArray['projectType'];
    $projectOffice = $formDataArray['projectOffice'];
    $juniorName = $formDataArray['juniorName'];
    $contactNo = $formDataArray['contactNo'];
    $dateIn = $formDataArray['dateIn']; 
    $zone = $formDataArray['zone'];
    $ward = $formDataArray['ward'];
    $prabhagName = $formDataArray['prabhagName'];
    $Width = $formDataArray['Width'];
    $Length = $formDataArray['Length'];

    // Prepare SQL statement to insert data
    $sql = "INSERT INTO conceptual_form (project_no, work_name, work_type, scope_of_work, project_financial_year, department, project_type, project_office, junior_engineer_name, contact_no, date_in, zone, ward, prabhag_name,width,length) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectNo, $aaWork, $workType, $scopeOfWork, $projectFinancialYear, $department, $projectType, $projectOffice, $juniorName, $contactNo, $dateIn, $zone, $ward, $prabhagName,$Width,$Length]);
    $lastInsertId = $pdo->lastInsertId();
    echo json_encode([
        'success' => true, 
        'message' => 'Form data saved successfully.', 
        'data' => [
            'id' => $lastInsertId,
            'width' => $Width,
            'lenght' => $Length
        ]
    ]);
    
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
