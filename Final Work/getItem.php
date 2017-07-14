<?php
  $url = $_GET['url'];

  // get list of data
  $json = file_get_contents($url);
  $json = json_decode($json);

  foreach($json as $key) {
      if ($key->id == $_GET['id'])
      {
        echo json_encode($key);
        break;
      }
  }

?>