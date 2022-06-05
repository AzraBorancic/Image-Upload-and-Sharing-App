<?php
require_once __DIR__ . '/BaseService.class.php';
require_once __DIR__ . '/../dao/FavoriteDao.class.php';
require_once __DIR__ . '/../dao/UserDao.class.php';

class FavoriteImageService extends BaseService
{

    private $user_dao;

    public function __construct()
    {
        parent::__construct(new FavoriteDao());
        $this->user_dao = new UserDao();
    }

    public function get_favorite_images($user, $search = NULL)
    {
        return $this->dao->get_favorite_images($user['id'], $search);
    }

    public function get_by_id($user, $id)
    {
        $favorite = parent::get_by_id($user, $id);
        if ($favorite['user_id'] != $user['id']) {
            throw new Exception("This is hack you will be traced, be prepared :)");
        }

        return $favorite;
    }

    public function add($user, $entity)
    {

        $entity['user_id'] = $user['id'];
        return parent::add($user, $entity);
    }

    public function update($user, $id, $entity)
    {
        $favorite = $this->dao->get_by_id($id);
        if ($favorite['user_id'] != $user['id']) {
            throw new Exception("This is hack you will be traced, be prepared :)");
        }
        unset($entity['user_id']);
        return parent::update($user, $id, $entity);
    }

    public function delete($user, $id)
    {
        $favorite = $this->dao->get_by_id($id);
        if ($favorite['user_id'] != $user['id']) {
            throw new Exception("This is hack you will be traced, be prepared :)");
        }
        parent::delete($user, $id);
    }
}
