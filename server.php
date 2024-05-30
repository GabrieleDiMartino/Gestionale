<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gest";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    
    $sql = "INSERT INTO products (title, price, category) VALUES ('$title', '$price', '$category')";
    if ($conn->query($sql) === TRUE) {
        echo "Nuovo prodotto aggiunto con successo!";
    } else {
        echo "Errore: " . $sql . "<br>" . $conn->error;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);
    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    echo json_encode($products);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'];
    $sql = "DELETE FROM products WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Prodotto cancellato con successo!";
    } else {
        echo "Errore nella cancellazione del prodotto: " . $conn->error;
    }
}

$conn->close();
?>
