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

    public function get_favorite_images($user)
    {
        return $this->dao->get_favorite_images($user['id']);
    }

    public function get_by_id($user, $id)
    {
        $favorite = parent::get_by_id($user, $id);
        return $favorite;
    }

    public function add($user, $entity)
    {
        return parent::add($user, $entity);
    }

    public function update($user, $id, $entity)
    {
        $favorite = $this->dao->get_by_id($id);
        unset($entity['user_id']);
        return parent::update($user, $id, $entity);
    }

    public function delete($user, $id)
    {
        $favorite = $this->dao->get_by_id($id);
        parent::delete($user, $favorite['id']);
    }
}
