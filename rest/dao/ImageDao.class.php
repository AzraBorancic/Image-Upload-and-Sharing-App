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

    public function get_all_images()
    {
        $query = "SELECT i.id, i.s3_url, i.user_id, i.created_at, 
                  COUNT(uli.image_id) as number_of_likes
                  from images i left join users_liked_images uli ON uli.image_id = i.id group by i.id;";
        return $this->query($query, []);
    }

    public function get_images($user_id, $search = NULL)
    {
        $query = "SELECT i.id, i.s3_url, i.user_id, i.created_at, 
                  COUNT(uli.image_id) as number_of_likes
                  from images i left join users_liked_images uli ON uli.image_id = i.id WHERE i.user_id = :user_id group by i.id;";
        return $this->query($query, ['user_id' => $user_id]);
    }

    public function get_by_id($id)
    {
        return $this->query('SELECT i.*, COUNT(uli.image_id) as number_of_likes, DATE_FORMAT(i.created_at, "%Y-%m-%d") as created_at FROM images i 
                                    JOIN users_liked_images uli ON uli.image_id = i.id AND i.id = :id', ['id' => $id]);
    }

    public function get_by_id_and_user($user_id, $id)
    {
        return $this->query('SELECT i.*, 
        COUNT(uli.image_id) as number_of_likes, 
        CASE WHEN uli.user_id  = :user_id THEN 1 ELSE 0 END as has_user_liked, 
        case when fi.image_id is not null then 1 else 0 END as has_user_favorited,
        DATE_FORMAT(i.created_at, "%Y-%m-%d") as created_at 
        FROM images i 
        JOIN users_liked_images uli ON uli.image_id = i.id AND i.id = :id
        left JOIN favorite_images fi on i.id = fi.image_id;', ['id' => $id, 'user_id' => $user_id]);
    }
}
