<?php
try {
    // Update the following variables with your PostgreSQL database credentials
    $host = "localhost";
    $port = "5432";
    $dbname = "Demo";
    $user = "postgres";
    $password = "123";

    // Establish a connection to the PostgreSQL database
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the form is submitted
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Validate and sanitize user input
        $projectNo = filter_var($_POST['projectNo'], FILTER_SANITIZE_STRING);
        // ... (sanitize other fields as needed)

        // Prepare SQL statement
        $sql = "INSERT INTO project_data 
                (project_no, aa_work, work_type, scope_of_work, project_financial_year,
                 department, project_type, project_office, junior_engineer_name, 
                 contact_no, date_in, zone, ward, prabhag_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        echo($sql);
        // Execute SQL statement
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$projectNo, $_POST['aaWork'], $_POST['workType'], $_POST['scopeOfWork'], $_POST['projectFinancialYear'],
                        $_POST['department'], $_POST['projectType'], $_POST['projectOffice'], $_POST['juniorName'],
                        $_POST['contactNo'], $_POST['dateIn'], $_POST['zone'], $_POST['ward'], $_POST['prabhagName']]);

        // Check for successful execution
        if ($stmt->rowCount() > 0) {
            // Successful insertion, redirect
            header("Location: geometry_page.html");
            exit();
        } else {
            // Handle error, for example, display an error message
            echo "Error: Unable to insert data.";
        }
    }
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
} finally {
    // Close the database connection
    $pdo = null;
}
?>
