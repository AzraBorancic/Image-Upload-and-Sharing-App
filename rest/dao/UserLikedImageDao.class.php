<?php

require_once __DIR__ . '/BaseDao.class.php';

class UserLikedImageDao extends BaseDao
{

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        parent::__construct("users_liked_images");
    }

    public function get_like_by_id($user_id, $image_id)
    {
        return $this->query('SELECT uli.* FROM users_liked_images uli WHERE uli.image_id = :image_id AND uli.user_id = :user_id', ['image_id' => $image_id, 'user_id' => $user_id]);
    }
}
