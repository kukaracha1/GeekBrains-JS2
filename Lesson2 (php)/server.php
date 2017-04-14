<?php
$input = $_GET['login'];
// echo $_GET['login'];

//загружаем json файл в переменную
$json = file_get_contents('server.json');


// преобразуем строку в json объект
$json = json_decode($json);

foreach($json as $login)
{
    if ($input == $login->login)
    {
        echo "true";
        return true;
    }
}
echo "false";
return false;
