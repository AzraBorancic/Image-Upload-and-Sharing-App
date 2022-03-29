<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

require_once 'dao\ImageSharingDao.class.php';
require_once '..\vendor\autoload.php';

Flight::register('imageSharingDao', 'ImageSharingDao');

Flight::route('/', function(){
    echo 'hello world!';
});

/**
 * List all users
 */
Flight::route('GET /users',function(){
    Flight::json(Flight::imageSharingDao()->get_all());
});

/**
 * List individual user
 */
Flight::route('GET /users/@id',function($id){
    Flight::json(Flight::imageSharingDao()->get_by_id($id));
    
});

/**
 * Add user
 */
Flight::route('POST /users',function(){
    Flight::json(Flight::imageSharingDao()->add(Flight::request()->data->getData()));
});

/**
 * Update user
 */
Flight::route('PUT /users/@id',function($id){
    $data = Flight::request()->data->getData();
    $data['id'] = $id;
    Flight::json(Flight::imageSharingDao()->update($data));
});

/**
 * Delete user
 */
Flight::route('DELETE /users/@id',function($id){
    $user = Flight::imageSharingDao()->delete($id);
    Flight::json(["message" => "Deleted."]);
});

Flight::start();

?>