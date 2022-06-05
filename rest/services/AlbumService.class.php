<?php
require_once __DIR__ . '/BaseService.class.php';
require_once __DIR__ . '/../dao/AlbumDao.class.php';
require_once __DIR__ . '/../dao/AlbumImageDao.class.php';
require_once __DIR__ . '/../dao/UserDao.class.php';

class AlbumService extends BaseService
{

    private $user_dao;
    private $album_image_dao;

    public function __construct()
    {
        parent::__construct(new AlbumDao());
        $this->user_dao = new UserDao();
        $this->album_image_dao = new AlbumImageDao();
    }

    public function get_albums($user, $search = NULL)
    {
        return $this->dao->get_albums($user['id'], $search);
    }

    public function get_by_id($user, $id)
    {
        $album_images = $this->album_image_dao->get_by_id($id);
        return $album_images;
    }

    public function add($user, $entity)
    {

        $entity['user_id'] = $user['id'];
        return parent::add($user, $entity);
    }

    public function update($user, $id, $entity)
    {
        $album = $this->dao->get_by_id($id);
        if ($album['user_id'] != $user['id']) {
            throw new Exception("This is hack you will be traced, be prepared :)");
        }
        unset($entity['user_id']);
        return parent::update($user, $id, $entity);
    }

    public function delete($user, $id)
    {
        $album = $this->dao->get_by_id($id);
        if ($album['user_id'] != $user['id']) {
            throw new Exception("This is hack you will be traced, be prepared :)");
        }
        parent::delete($user, $id);
    }
}
