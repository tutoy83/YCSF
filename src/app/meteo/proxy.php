<?php
  $url = "http://193.251.90.145:8080/axis-cgi/mjpg/video.cgi?resolution=1920x1080&dummy=1681910686856";
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  $output = curl_exec($ch);
  curl_close($ch);
  header("Content-type: video/mp4");
  echo $output;
?>
