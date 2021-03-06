<?php
require_once __DIR__ . '/BaseService.class.php';
require_once __DIR__ . '/../dao/ImageDao.class.php';
require_once __DIR__ . '/../dao/UserDao.class.php';

use Aws\S3\S3Client;

class ImageService extends BaseService
{

    private $user_dao;

    public function __construct()
    {
        parent::__construct(new ImageDao());
        $this->user_dao = new UserDao();
    }

    public function get_all_images()
    {
        return $this->dao->get_all_images();
    }

    public function get_images($user, $search = NULL)
    {
        return $this->dao->get_images($user['id'], $search);
    }

    public function get_by_id($user, $id)
    {
        $image = $this->dao->get_by_id_and_user($user['id'], $id);
        return $image;
    }

    public function add($user, $entities)
    {

        $credentials = new Aws\Credentials\Credentials($_ENV['AWS_ACCESS_KEY_ID'], $_ENV['AWS_SECRET_ACCESS_KEY']);
        $s3Client = new S3Client([
            'version' => 'latest',
            'region'  => $_ENV['AWS_DEFAULT_REGION'],
            'credentials' => $credentials
        ]);

        $files = $entities;
        $entity = [];

        foreach ($files as $file) {
            try {
                $name = time() . $file['name'];
                $result = $s3Client->putObject([
                    'Bucket' => $_ENV['AWS_BUCKET'],
                    'Key'    => $name,
                    'Body'   => fopen($file['tmp_name'], 'r'),
                    'ContentType' =>'image/jpeg',
                    'ACL'    => 'public-read', // make file 'public'
                ]);
                echo "Image uploaded successfully. Image path is: " . $result->get('ObjectURL');

                $entity['user_id'] = $user['id'];
                $entity['s3_url'] =  $result->get('ObjectURL');
                parent::add($user, $entity);
            } catch (Aws\S3\Exception\S3Exception $e) {
                echo "There was an error uploading the file.\n";
                echo $e->getMessage();
            }
        }

        return $entities;
    }

    public function update($user, $id, $entity)
    {
        $image = $this->dao->get_by_id($id);
        unset($entity['user_id']);
        return parent::update($user, $id, $entity);
    }

    public function delete($user, $id)
    {
        $image = $this->dao->get_by_id($id);
        $credentials = new Aws\Credentials\Credentials($_ENV['AWS_ACCESS_KEY_ID'], $_ENV['AWS_SECRET_ACCESS_KEY']);

        $s3Client = new S3Client([
            'version' => 'latest',
            'region'  => $_ENV['AWS_DEFAULT_REGION'],
            'credentials' => $credentials
        ]);
        $bucket = $_ENV['AWS_BUCKET'];
        $keys = explode('.com/', $image[0]['s3_url']);
        $keyname = $keys[1];


        $result = $s3Client->deleteObject(array(
            'Bucket' => $bucket,
            'Key'    => $keyname
        )); 

        parent::delete($user, $id);
    }
}
