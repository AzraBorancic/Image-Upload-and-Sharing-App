<?php

require_once __DIR__ . '/BaseDao.class.php';

class FavoriteDao extends BaseDao
{

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        parent::__construct("favorite_images");
    }

    public function get_favorite_images($user_id, $search = NULL)
    {
        $query = "SELECT i.* FROM users u JOIN favorite_images fi ON u.id = fi.user_id AND u.id = :user_id JOIN images i ON fi.image_id = i.id";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query_unique('SELECT f.* FROM favorites f WHERE f.id = :id', ['id' => $id]);
    }
}
