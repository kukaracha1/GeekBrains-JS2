<?php
    $id = (int) $_GET['id'];

    $json = file_get_contents('goods/2.json');

    $goods = json_decode($json);

    $result = [];
    for($i = 0; $i < count($goods); $i++) {
        if ($goods[$i]->id === $id) {
            continue;
        }
        $result[] = $goods[$i];
    }

    file_put_contents('goods/2.json', json_encode($result));
?>{
    "status": "ok"
}
