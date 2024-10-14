<?php
  $recaptcha_secret = "your-recaptcha-secret-key";
  $recaptcha_response = $_POST["g-recaptcha-response"];

  $url = "https://www.google.com/recaptcha/api/siteverify?secret=$recaptcha_secret&response=$recaptcha_response";
  $response = file_get_contents($url);
  $response_data = json_decode($response, true);

  if (!$response_data["success"]) {
    // reCaptcha validation failed, return an error message
  } else {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(
                !empty($_POST['name'])
                && !empty($_POST['email'])
                && !empty($_POST['message'])
            ){

            $name = $_POST["name"];
            $email = $_POST["email"];
            $message = $_POST["message"];

            $to = "alexalmaguer92@gmail.com";
            $subject = "ALEXS NFLDB New Contact Form Submission";
            $body = "Name: {$name}\nEmail: {$email}\nMessage: {$message}";
            $headers = "From: {$email}";

            if (mail($to, $subject, $body, $headers)) {
                echo "Message sent successfully!";
            } else {
                echo "Failed to send message.";
            }
        }
    }
}
?>