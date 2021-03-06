<?php
require_once __DIR__ . '/BaseDao.class.php';

class AlbumImageDao extends BaseDao
{

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    parent::__construct("album_images");
  }

  public function get_by_id($id)
  {
    $query = "SELECT i.* FROM album_images al JOIN images i ON al.image_id = i.id AND al.album_id = :id";
    return $this->query($query, ['id' => $id]);
  }

  public function get_by_id_and_user($user_id, $id)
  {
    return $this->query('SELECT i.id, i.s3_url, i.user_id, i.created_at, al.id as album_image_id,
    COUNT(distinct uli.image_id) as number_of_likes,
    CASE WHEN uli.user_id  = :user_id THEN 1 ELSE 0 END as has_user_liked,
    case when fi.image_id is not null then 1 else 0 END as has_user_favorited
    from images i 
    JOIN album_images al on al.image_id = i.id AND al.album_id = :id
    left JOIN users_liked_images uli ON uli.image_id = i.id
    left JOIN favorite_images fi on i.id = fi.image_id
    group by i.id;', ['id' => $id, 'user_id' => $user_id]);
  }
}
