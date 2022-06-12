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

    public function get_favorite_images($user_id)
    {
        $query = "SELECT i.* FROM images i JOIN favorite_images fi ON i.id = fi.image_id JOIN favorites f ON f.id = fi.id WHERE f.user_id = :user_id";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query_unique('SELECT fi.* FROM favorite_images fi WHERE fi.image_id = :id', ['id' => $id]);
    }
}
