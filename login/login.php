<?php
session_start();
require_once './APIS/db.php'; // Database connection

// Handle form submission if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $workID = $_POST['work_id'] ?? ''; // Retrieve work_id from POST if available

    // Check if email and password are not empty
    if (empty($email) || empty($password)) {
        $_SESSION['login_status'] = 'failed';
        header('Location: login1.php');
        exit;
    }

    // Query the database to verify the user credentials
    try {
        $sql = "SELECT * FROM users_login WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Credentials are valid
            $_SESSION['loggedin'] = true;
            $_SESSION['user_id'] = $user['user_id']; // Store user ID in session

            if ($workID) {
                // Store Work_ID in session and local storage
                $_SESSION['Work_ID'] = $workID;

                // Output JavaScript to store Work_ID in localStorage and redirect
                echo "<script>
                        localStorage.setItem('Work_ID', '" . addslashes($workID) . "');
                        window.location.href = 'geometry_page.html';
                      </script>";
                exit;
            } else {
                // Retrieve Work_ID from session (or set default value if needed)
                $workID = $_SESSION['Work_ID'] ?? ''; // Assuming Work_ID is stored or generated

                // Construct the redirect URL
                $redirectURL = "http://localhost/login_validation_ok/geometry_page.html?Work_ID={$workID}";

                // Redirect to the page with Work_ID in the URL
                header('Location: ' . $redirectURL);
                exit;
            }
        } else {
            $_SESSION['login_status'] = 'failed';
            header('Location: login1.php');
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
    <link rel="icon" href="png/pmcjpeg.png" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="register.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php
    // Display error message if login failed
    if (isset($_SESSION['login_status']) && $_SESSION['login_status'] === 'failed') {
        echo '<script type="text/javascript">',
             'document.addEventListener("DOMContentLoaded", function() {',
             'showPopup("<strong>Login information didn\'t work</strong><br><br>Check your Email or Password and try again");',
             '});',
             '</script>';
        // Clear the session variables
        unset($_SESSION['login_status']);
    }
    ?>

    <div id="myModal" class="modal">
        <div class="modal-content">
            <p id="modalMessage"></p>
            <div class="modal-footer">
                <button class="modal-button" onclick="closeModal()">OK</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="login-container1">
            <!-- Optional home button can be uncommented if needed -->
        </div>
        <div class="right-section">
            <div class="login-container">
                <form class="login-form" action="login1.php" method="post">
                    <h2 class="login-title"><img src="" class="logo" alt=""></h2>
                    <div class="form-control">
                        <i class="fas fa-envelope icon"></i>
                        <input type="email" name="email" placeholder="abc@gmail.com" required>
                    </div>
                    <div class="form-control">
                        <i class="fas fa-lock icon"></i>
                        <input type="password" name="password" placeholder="Password" id="password" required>
                    </div>
                    <button type="submit" value="Login">Login</button>
                    <p class="endline">
                        <a href="register.php" class="btn">Create an account</a>
                    </p>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Function to display popup message
        function showPopup(message) {
            var modal = document.getElementById("myModal");
            var modalMessage = document.getElementById("modalMessage");
            modalMessage.innerHTML = message; // Use innerHTML to handle HTML content
            modal.style.display = "block";
        }

        // Function to close the modal
        function closeModal() {
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
        }

        // Close the modal when clicking outside of the modal content
        window.onclick = function(event) {
            var modal = document.getElementById("myModal");
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
</body>
</html>
