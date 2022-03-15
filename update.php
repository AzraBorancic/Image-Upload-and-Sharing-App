<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

require_once("rest/dao/ImageSharingDao.class.php");

$id = $_REQUEST['id'];
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$created_at = $_REQUEST['created_at'];

$dao = new ImageSharingDao();
$dao->update($id, $username, $password, $created_at);

echo "UPDATED USER $id";

?>