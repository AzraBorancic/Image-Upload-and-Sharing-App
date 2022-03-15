<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

require_once("rest/dao/ImageSharingDao.class.php");
$dao = new ImageSharingDao();
$op = $_REQUEST['op'];

switch ($op) {
    case 'insert':
        $username = $_REQUEST['username'];
        $password = $_REQUEST['password'];
        $created_at = $_REQUEST['created_at'];
        $results = $dao->add($username, $password, $created_at);
        break;
    
    case 'delete':
        $id = $_REQUEST['id'];
        $dao->delete($id);
        echo "DELETED USER $id";
        break;
    
    case 'update':
        $id = $_REQUEST['id'];
        $username = $_REQUEST['username'];
        $password = $_REQUEST['password'];
        $created_at = $_REQUEST['created_at'];
        $dao->update($id, $username, $password, $created_at);
        echo "UPDATED USER $id";
        break;

    case 'get':
    default:
        $results = $dao->get_all();
        print_r($results);
        break;
}


?>