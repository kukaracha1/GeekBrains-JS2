<?php
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if (!$id) {
    header('HTTP/1.1 404 Not Found');
} else {
    $json = file_get_contents('books.json');
    $books = json_decode($json);

    while($book = array_shift($books)) {
        if ($id === $book->id) {
            echo json_encode($book, JSON_UNESCAPED_UNICODE);
            die();
        }
    }
    header('HTTP/1.1 404 Not Found');
}