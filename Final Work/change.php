<?php

function create($json , $item)
{
      $array = array_keys($item);
    for($j=0 ; $j<count($array) ; $j++)
    {
        $test = $item[$array[$j]];
    // file_put_contents('server.txt',$test);
        
        if ( is_bool($test) == true)
            $json[$i]->$array[$j] = filter_var( $test , FILTER_VALIDATE_BOOLEAN);
        else
            $json[$i]->$array[$j] = $test;                
    }

}



  $item = $_GET['item'];
  $url = $_GET['url'];

  $json = file_get_contents($url);
  $json = json_decode($json);

  $response = (object)[];

  $response->status = "error";
  
  file_put_contents('server.txt', $item,FILE_APPEND);

for($i=0 ; $i<count($json) ; $i++)
      if ($json[$i]->id == $item['id'])
      {
         $array = array_keys($item);
        for($j=0 ; $j<count($array) ; $j++)
       {
            $test = $item[$array[$j]];
        // file_put_contents('server.txt',$test);
            if ( ($test) === true ||  ($test) === false)
                $json[$i]->$array[$j] = filter_var( $test , FILTER_VALIDATE_BOOLEAN);
            else
                $json[$i]->$array[$j] = $test;                
       }
       $response->status = "ok";
        break;
      }
  if ($response->status != "ok")
  {
    // create a new item
    $newItem = (object)[];
    $array = array_keys($item);
    for($j=0 ; $j<count($array) ; $j++)
       {
            $test = $item[$array[$j]];
        // file_put_contents('server.txt',$test);
            
            if ( is_bool($test) == true)
                $newItem->$array[$j] = filter_var( $test , FILTER_VALIDATE_BOOLEAN);
            else
                $newItem->$array[$j] = $test;                
       }

    array_push($json , $newItem);
  }
  file_put_contents($url,json_encode($json));

  echo json_encode($response);

?>