<?php
require_once __DIR__.'/BaseDao.class.php';

class AlbumDao extends BaseDao{

  /**
  * constructor of dao class
  */
  public function __construct(){
    parent::__construct("albums");
  }

  public function get_albums($user_id, $search = NULL){
    $query = "(SELECT * FROM albums WHERE user_id = :user_id";

    if (isset($search)){
        $query .= " AND name LIKE '%".$search."%'";
      }

    return $this->query($query, ['user_id' => $user_id]);
  }

  public function get_by_id($id){
    return $this->query_unique('SELECT a.* FROM albums a WHERE a.id = :id', ['id' => $id]);
  }
}

?>