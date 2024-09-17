<?php
session_start();
require_once '../APIS/db.php'; // Database connection

// Check if work_id is present in the query string and store it in the session
if (isset($_GET['work_id'])) {
    $_SESSION['Work_ID'] = $_GET['work_id'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $workID = $_SESSION['Work_ID'] ?? ''; // Retrieve Work_ID from the session

    if (empty($email) || empty($password)) {
        $_SESSION['login_status'] = 'failed';
        header('Location: login.php');
        exit;
    }

    try {
        $sql = "SELECT * FROM users_login WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['user_id'] = $user['user_id']; // Store user ID in session

            // Redirect to geometry page with Work_ID if available
            if (!empty($workID)) {
                $redirectURL = "http://localhost/PMC/IWMS/IWMS_test/geometry_page.html?Work_ID={$workID}";
                header('Location: ' . $redirectURL);
                exit;
            } else {
                header('Location: geometry_page.html');
                exit;
            }
        } else {
            $_SESSION['login_status'] = 'failed';
            header('Location: login.php');
            exit;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMC Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h2>Login</h2>
        <form action="login.php" method="post">
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <?php
        if (isset($_SESSION['login_status']) && $_SESSION['login_status'] == 'failed') {
            echo '<p style="color: red;">Invalid email or password. Please try again.</p>';
            unset($_SESSION['login_status']);
        }
        ?>
    </div>
</body>
</html>
