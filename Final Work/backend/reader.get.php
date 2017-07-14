<?php
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if (!$id) {
    header('HTTP/1.1 404 Not Found');
} else {
    $json = file_get_contents('readers.json');
    $readers = json_decode($json);

    while($reader = array_shift($readers)) {
        if ($id === $reader->id) {
            echo json_encode($reader, JSON_UNESCAPED_UNICODE);
            die();
        }
    }
    header('HTTP/1.1 404 Not Found');
}