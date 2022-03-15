<?php

class ImageSharingDao{

    private $conn;

    public function __construct(){
        $servername = "127.0.0.1";
        $username = "root";
        $password = "root123";
        $schema = "image_sharing";

        $this->conn = new PDO("mysql:host=$servername;dbname=$schema", $username, $password);
        // set the PDO error mode to exception
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function get_all(){
        $stmt = $this->conn->prepare("SELECT * FROM users");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function add($username, $password, $created_at){
        $stmt = $this->conn->prepare("INSERT INTO users (username, password, created_at) VALUES(:username, :password, :created_at)");
        $stmt->execute(['username' => $username, 'password' => $password, 'created_at' => $created_at]);
    }

    public function delete($id){
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute(); 
    }

    public function update($id, $username, $password, $created_at){
        $stmt = $this->conn->prepare("UPDATE users SET username = :username, password = :password, created_at = :created_at WHERE id = :id");
        $stmt->execute(['id' => $id,'username' => $username, 'password' => $password, 'created_at' => $created_at]);
    }
}

?> 