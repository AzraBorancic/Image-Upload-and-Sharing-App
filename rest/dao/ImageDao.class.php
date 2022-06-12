<?php

require_once __DIR__ . '/BaseDao.class.php';

class ImageDao extends BaseDao
{

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        parent::__construct("images");
    }

    public function get_all_images() {
        $query = "SELECT * FROM images";
        return $this->query($query, []);
    }

    public function get_images($user_id, $search = NULL)
    {
        $query = "SELECT * FROM images WHERE user_id = :user_id";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query('SELECT i.*, COUNT(uli.image_id) as number_of_likes, DATE_FORMAT(i.created_at, "%Y-%m-%d") as created_at FROM images i 
                                    JOIN users_liked_images uli ON uli.image_id = i.id AND i.id = :id', ['id' => $id]);
    }
}
