<?php
    $page = $_GET['page'];
    $goods_json = file_get_contents('goods/' . $page . '.json');

    $total_pages = 1;

    while(file_exists('goods/' . $total_pages . '.json')) {
        $total_pages++;
    }

    $total_pages--;

    $goods = json_decode($goods_json);

    $response = [
        'goods' => $goods,
        'total_pages' => $total_pages
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
