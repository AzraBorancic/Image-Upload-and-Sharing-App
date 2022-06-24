<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

use Dotenv\Dotenv;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/services/UserService.class.php';
require_once __DIR__.'/services/ImageService.class.php';
require_once __DIR__.'/services/AlbumService.class.php';
require_once __DIR__.'/services/FavoriteImageService.class.php';
require_once __DIR__.'/services/UserLikedImageService.class.php';

require_once __DIR__.'/dao/UserDao.class.php';
require_once __DIR__.'/dao/FavoriteDao.class.php';

if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

Flight::register('userDao', 'UserDao');
Flight::register('favoriteDao', 'FavoriteDao');
Flight::register('userService', 'UserService');
Flight::register('imageService', 'ImageService');
Flight::register('albumService', 'AlbumService');
Flight::register('favoriteImageService', 'FavoriteImageService');
Flight::register('userLikedImageService', 'userLikedImageService');

Flight::map('error', function($ex){
    // Handle error
    if ($ex instanceof Exception) {
      Flight::json(['message' => $ex->getMessage()], 500);
    } else {
      Flight::json(['message' => var_dump($ex)], 500);
    }
});

/* utility function for reading query parameters from URL */
Flight::map('query', function($name, $default_value = ''){
  $request = Flight::request();
  $query_param = @$request->query->getData()[$name];
  $query_param = $query_param ? $query_param : $default_value;
  return urldecode($query_param);
});

// middleware method for login
Flight::route('/*', function(){
  //return TRUE;
  //perform JWT decode
  $path = Flight::request()->url;
  if ($path == '/login' || $path == '/register' || $path == '/docs.json') return TRUE; // exclude login route from middleware

  $headers = getallheaders();
  if (@!$headers['Authorization']){
    Flight::json(["message" => "Authorization is missing"], 403);
    return FALSE;
  }else{
    try {
      $decoded = (array)JWT::decode($headers['Authorization'], new Key($_ENV['JWT_SECRET'], 'HS256'));
      Flight::set('user', $decoded);
      return TRUE;
    } catch (\Exception $e) {
      Flight::json(["message" => "Authorization token is not valid"], 403);
      return FALSE;
    }
  }
});

/* REST API documentation endpoint */
Flight::route('GET /docs.json', function(){
  $openapi = \OpenApi\scan('./routes');
  header('Content-Type: application/json');
  echo $openapi->toJson();
});

require_once __DIR__.'/routes/UserRoutes.php';
require_once __DIR__.'/routes/ImageRoutes.php';
require_once __DIR__.'/routes/AlbumRoutes.php';

Flight::start();
