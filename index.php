<?php

require 'vendor/autoload.php';

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

Flight::route('/',function(){
    echo 'Welcome to the web page for Image sharing and uploading app!';
});

//require_once("rest/dao/ImageSharingDao.class.php");

// $dao = new ImageSharingDao();
// $results = $dao->get_all();
// print_r($results);

Flight::start();

?>