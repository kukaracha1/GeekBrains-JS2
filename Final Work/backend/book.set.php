<?php
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$take_till = isset($_GET['take_till']) ? (int) $_GET['take_till'] : false;
$user = isset($_GET['user']) ? (int) $_GET['user'] : null;

if (!($id && $user)) {
    header('HTTP/1.1 404 Not Found');
} else {

    $json = file_get_contents('books.json');
    $books = json_decode($json);

    foreach(array_keys($books) as $key) {
        if ($id === $books[$key]->id) {
            if (!$take_till)
            {   
                $books[$key]->taken = false;
                $books[$key]->taken_by = null;
            }
            else
            {
                $books[$key]->taken = true;
                // $books[$key]->taken = $take_till;
                $books[$key]->taken_by = $user;
            }
            file_put_contents('books.json', json_encode($books, JSON_UNESCAPED_UNICODE));
            echo 'true';
            die();
        }
    }

    header('HTTP/1.1 404 Not Found');
}
