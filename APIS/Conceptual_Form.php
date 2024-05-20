<?php
require 'config.php';

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
    $Width = (isset($formDataArray['Width']) && $formDataArray['Width'] !== '') ? (int) $formDataArray['Width'] : null;
    $Length = (isset($formDataArray['Length']) && $formDataArray['Length'] !== '') ? (int) $formDataArray['Length'] : null;

    $works_aa_approval_id = $formDataArray['Id'];
    $createdAt = date('Y-m-d H:i:s');

    $conceptual_no = $formDataArray['conceptual_no'];
    $con_appr_date = $formDataArray['con_appr_date'];
    $created_date = $formDataArray['created_date'];
    $tender_amount = $formDataArray['tender_amount'];
    $updated_date = $formDataArray['updated_date'];
    $gis_id = $formDataArray['gis_id'];
    $no_of_road = $formDataArray['no_of_road'];
    $area = $formDataArray['area'];
    $measure_in = $formDataArray['measure_in'];
    $project_from = $formDataArray['project_from'];
    $budget_year = $formDataArray['budget_year'];
    $agency = $formDataArray['agency'];
    $work_completion_date = $formDataArray['work_completion_date'];

    $sql = "INSERT INTO conceptual_form (project_no, work_name, work_type, scope_of_work, project_financial_year, department, project_office, junior_engineer_name, contact_no, date_in, zone, ward,width,length,budgetCode,works_approval_id,created_at,conceptual_no,con_appr_date,created_date,tender_amount,updated_date,gis_id,no_of_road,area,measure_in,project_from,budget_year,agency,work_completion_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?, ?,?,?,?, ?, ?,?,?,?, ?, ?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $projectNo,
        $aaWork,
        $workType,
        $scopeOfWork,
        $projectFinancialYear,
        $department,
        $projectOffice,
        $juniorName,
        $contactNo,
        $dateIn,
        $zone,
        $ward,
        $Width,
        $Length,
        $budgetCode,
        $works_aa_approval_id,
        $createdAt,
        $conceptual_no,
        $con_appr_date,
        $created_date,
        $tender_amount,
        $updated_date,
        $gis_id,
        $no_of_road,
        $area,
        $measure_in,
        $project_from,
        $budget_year,
        $agency,
        $work_completion_date
    ]);
    $lastInsertId = $pdo->lastInsertId();
    echo json_encode([
        'success' => true,
        'message' => 'Form data saved successfully.',
        'data' => [
            'id' => $lastInsertId,
            'width' => $Width,
            'lenght' => $Length,
            'wardname' => $ward,
            'department' => $department,

        ],
    ]);

} catch (Exception $e) {

    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
