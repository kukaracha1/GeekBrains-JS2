<?php
$page = isset($_GET['page']) ? (int) $_GET['page'] : null;

define('BOOKS_PER_PAGE', 10);

$json = file_get_contents('books.json');
$books = json_decode($json);

$user = isset($_GET['user']) ? (int) $_GET['user'] : null;

if ($user) {
    foreach(array_keys($books) as $key) {
        if ($books[$key]->taken_by === $user) unset($books[$key]);
    }
}

$books_count = count($books);

if ($page) {
    $start = ($page - 1) * BOOKS_PER_PAGE;
    $finish = $page * BOOKS_PER_PAGE;

    if ($start > $books_count) {
        header('HTTP/1.1 404 Not Found');
        die();
    }

    $result = [];
    for ($i = $start; $i < $finish; $i++) {
        $result[] = $books[$i];
    }
} else {
    $result = $books;
}

$response = [
    'books' => $result,
    'total_pages' => ceil(count($books) / BOOKS_PER_PAGE)
];

echo json_encode($response);