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
        return $this->query(' SELECT i.*, 
                            (select COUNT(uli.image_id) from users_liked_images uli where uli.image_id = :id) as number_of_likes, 
                            IFNULL((select CASE WHEN uli2.user_id  = :user_id THEN 1 ELSE 0 END from users_liked_images uli2 where uli2.image_id = :id and uli2.user_id = :user_id), 0) as has_user_liked,
                            IFNULL((select case when f.user_id = :user_id then 1 else 0 end
                            from favorites f
                            join favorite_images fi on fi.favorite_id = f.id and fi.image_id = :id
                            where f.user_id = :user_id), 0) as has_user_favorited
                            FROM images i
                            where i.id = :id;', ['id' => $id, 'user_id' => $user_id]);
    }
}
