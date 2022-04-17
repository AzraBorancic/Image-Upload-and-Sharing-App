<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'dao\ImageSharingDao.class.php';
require_once '..\vendor\autoload.php';

use Dotenv\Dotenv;
use Aws\S3\S3Client;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();


Flight::register('imageSharingDao', 'ImageSharingDao');

Flight::route('/', function () {
    echo 'hello world!';
});

/**
 * List all users
 */
Flight::route('GET /users', function () {
    Flight::json(Flight::imageSharingDao()->get_all());
});

/**
 * List individual user
 */
Flight::route('GET /users/@id', function ($id) {
    Flight::json(Flight::imageSharingDao()->get_by_id($id));
});

/**
 * Add user
 */
Flight::route('POST /users', function () {
    Flight::json(Flight::imageSharingDao()->add(Flight::request()->data->getData()));
});

/**
 * Update user
 */
Flight::route('PUT /users/@id', function ($id) {
    $data = Flight::request()->data->getData();
    $data['id'] = $id;
    Flight::json(Flight::imageSharingDao()->update($data));
});

/**
 * Delete user
 */
Flight::route('DELETE /users/@id', function ($id) {
    $user = Flight::imageSharingDao()->delete($id);
    Flight::json(["message" => "Deleted."]);
});

Flight::route('POST /images', function () {

    $credentials = new Aws\Credentials\Credentials($_ENV['AWS_ACCESS_KEY_ID'], $_ENV['AWS_SECRET_ACCESS_KEY']);
    $s3Client = new S3Client([
        'version' => 'latest',
        'region'  => $_ENV['AWS_DEFAULT_REGION'],
        'credentials' => $credentials
    ]);

    var_dump($_ENV);

    $files = Flight::request()->files;

    foreach ($files as $file) {
        try {
            $name = time() . $file['name'];
            $result = $s3Client->putObject([
            'Bucket' => $_ENV['AWS_BUCKET'],
            'Key'    => $name,
            'Body'   => fopen($file['tmp_name'], 'r'),
            'ACL'    => 'public-read', // make file 'public'
            ]);
            echo "Image uploaded successfully. Image path is: ". $result->get('ObjectURL');
        } catch (Aws\S3\Exception\S3Exception $e) {
            echo "There was an error uploading the file.\n";
            echo $e->getMessage();
        }
    }
});

Flight::start();
