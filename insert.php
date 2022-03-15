<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

require_once("rest/dao/ImageSharingDao.class.php");

$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$created_at = $_REQUEST['created_at'];

$dao = new ImageSharingDao();
$results = $dao->add($username, $password, $created_at);
print_r($results);

?>