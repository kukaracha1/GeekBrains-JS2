<?php
  $item = $_GET['item'];
  $url = $_GET['url'];

  $json = file_get_contents($url);
  $json = json_decode($json);
//$item = json_decode($item);
  $response = (object)[];

  $response->status = "error";

for($i=0 ; $i<count($json) ; $i++)
//   foreach($json as $key) {
      if ($json[$i]->id == $item['id'])
      {
          
    //    $json[$i] = $item;
       $array = array_keys($item);
    //    echo $array[0];
        for($j=0 ; $j<count($array) ; $j++)
       {
            $test = $item[$array[$j]];
        file_put_contents('server.txt',$test);
            
            if ( is_bool($test) == true)
                $json[$i]->$array[$j] = filter_var( $test , FILTER_VALIDATE_BOOLEAN);
            else
                $json[$i]->$array[$j] = $test;                
       }
       $response->status = "ok";
        break;
      }
//   }

  file_put_contents($url,json_encode($json));

  echo json_encode($response);

?>