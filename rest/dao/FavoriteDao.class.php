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
        $query = "SELECT i.*, fi.favorite_id, COUNT(uli.image_id) as number_of_likes FROM images i left join users_liked_images uli ON uli.image_id = i.id JOIN favorite_images fi ON i.id = fi.image_id JOIN favorites f ON fi.favorite_id = f.id WHERE f.user_id = :user_id GROUP BY i.id";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query_unique('SELECT fi.* FROM favorite_images fi WHERE fi.image_id = :id', ['id' => $id]);
    }

    public function get_by_user_id($id)
    {
        return $this->query_unique('SELECT f.* FROM favorites f WHERE f.user_id = :id', ['id' => $id]);
    }
}
