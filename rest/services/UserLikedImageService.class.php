<?php
require_once __DIR__ . '/BaseService.class.php';
require_once __DIR__ . '/../dao/UserLikedImageDao.class.php';
require_once __DIR__ . '/../dao/UserDao.class.php';

class UserLikedImageService extends BaseService
{

    private $user_dao;

    public function __construct()
    {
        parent::__construct(new UserLikedImageDao());
        $this->user_dao = new UserDao();
    }

    public function get_by_id($user, $id)
    {
        $image_liked_by_user = $this->dao->get_like_by_id($user['id'], $id);
        return count($image_liked_by_user) > 0 ? true : false;
    }

    public function add($user, $entity)
    {
        $entity['user_id'] = $user['id'];
        return parent::add($user, $entity);
    }

    public function delete($user, $id)
    {
        $liked_property = $this->dao->get_like_by_id($user['id'], $id);
        $like = NULL;
        if (count($liked_property) > 0) {
            $like = $liked_property[0];
            parent::delete($user, $like['id']);
        } else {
            throw new Exception('Property does not exist!', 400);
        }
    }
}
