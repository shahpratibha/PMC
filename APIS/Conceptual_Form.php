<?php
require('config.php');

header('Content-Type: application/json');

try {

    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }


     $rawData = file_get_contents('php://input');

 
        $formDataArray = json_decode($rawData, true);


    $projectNo = $formDataArray['projectNo'];
    $aaWork = $formDataArray['aaWork'];
    $workType = $formDataArray['workType'];
    $scopeOfWork = $formDataArray['scopeOfWork'];
    $projectFinancialYear = $formDataArray['projectFinancialYear'];
    $department = $formDataArray['department'];
    // $projectType = $formDataArray['projectType'];
    $projectOffice = $formDataArray['projectOffice'];
    $juniorName = $formDataArray['juniorName'];
    $contactNo = $formDataArray['contactNo'];
    $dateIn = $formDataArray['dateIn']; 
    $zone = $formDataArray['zone'];
    $ward = $formDataArray['ward'];
    $budgetCode = $formDataArray['budgetCodes'];
    $Width = $formDataArray['Width'];
    $Length = $formDataArray['Length'];
    $works_aa_approval_id = $formDataArray['Id'] ;
    $createdAt = date('Y-m-d H:i:s');

    $sql = "INSERT INTO conceptual_form (project_no, work_name, work_type, scope_of_work, project_financial_year, department, project_office, junior_engineer_name, contact_no, date_in, zone, ward,width,length,budgetCode,works_approval_id,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectNo, $aaWork, $workType, $scopeOfWork, $projectFinancialYear, $department,  $projectOffice, $juniorName, $contactNo, $dateIn, $zone, $ward, $Width,$Length,$budgetCode,$works_aa_approval_id,$createdAt]);
    $lastInsertId = $pdo->lastInsertId();
    echo json_encode([
        'success' => true, 
        'message' => 'Form data saved successfully.', 
        'data' => [
            'id' => $lastInsertId,
            'width' => $Width,
            'lenght' => $Length,
            'wardname' => $ward
        ]
    ]);
    
} catch (Exception $e) {
 
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
