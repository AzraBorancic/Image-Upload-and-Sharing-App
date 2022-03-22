<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

require_once 'dao/ImageSharingDao.class.php';
require_once '../vendor/autoload.php';

/**
 * List all users
 */
Flight::route('GET /users',function(){
    $dao = new ImageSharingDao();
    $users = $dao->get_all();
    Flight::json($users);
});

/**
 * List individual user
 */
Flight::route('GET /users/@id',function($id){
    $dao = new ImageSharingDao();
    $user = $dao->get_by_id($id);
    Flight::json($user);
});


/**
 * Add user
 */

/**
 * Update user
 */

/**
 * Delete user
 */
Flight::route('/',function(){
    echo 'Welcome to the web page for Image sharing and uploading app!';
});

Flight::route('/azra',function(){
    echo 'Hello Azra';
});

Flight::route('/haris/@name',function($name){
    echo 'Hello Haris!'. $name;
});

Flight::start();

?>