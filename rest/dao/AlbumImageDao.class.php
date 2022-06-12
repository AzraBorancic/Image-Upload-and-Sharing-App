<?php
require_once __DIR__.'/BaseDao.class.php';

class AlbumImageDao extends BaseDao{

  /**
  * constructor of dao class
  */
  public function __construct(){
    parent::__construct("album_images");
  }

  public function get_by_id($id){
    $query = "SELECT i.* FROM album_images al JOIN images i ON al.image_id = i.id AND al.album_id = :id";
    return $this->query($query, ['id' => $id]);
  }
}

?>