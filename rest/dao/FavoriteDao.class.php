<?php

require_once __DIR__ . '/BaseDao.class.php';

class FavoriteDao extends BaseDao
{

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        parent::__construct("favorites");
    }

    public function get_images($user_id, $search = NULL)
    {
        $query = "(SELECT * FROM favorites WHERE user_id = :user_id";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query_unique('SELECT f.* FROM favorites f WHERE f.id = :id', ['id' => $id]);
    }
}
