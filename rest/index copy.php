<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once './dao/ImageSharingDao.class.php';
require_once '../vendor/autoload.php';

use Dotenv\Dotenv;

if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

Flight::register('imageSharingDao', 'ImageSharingDao');

Flight::route('/', function () {
    echo 'hello world!';
});

Flight::route('GET /users', function () {
    Flight::json(Flight::imageSharingDao()->get_all());
});

Flight::route('GET /users/@id', function ($id) {
    Flight::json(Flight::imageSharingDao()->get_by_id($id));
});

Flight::route('POST /users', function () {
    Flight::json(Flight::imageSharingDao()->add(Flight::request()->data->getData()));
});

Flight::route('PUT /users/@id', function ($id) {
    $data = Flight::request()->data->getData();
    $data['id'] = $id;
    Flight::json(Flight::imageSharingDao()->update($data));
});

Flight::route('DELETE /users/@id', function ($id) {
    $user = Flight::imageSharingDao()->delete($id);
    Flight::json(["message" => "User has been successfully deleted."]);
});

Flight::start();
