<?php
require_once __DIR__ . '/BaseService.class.php';
require_once __DIR__ . '/../dao/UserDao.class.php';

class UserService extends BaseService
{

  public function __construct()
  {
    parent::__construct(new UserDao());
  }

  public function get_user_by_email($email)
  {
    return $this->dao->get_user_by_email($email);
  }

  public function register($user)
  {
    try {
      $user = $this->dao->add([
        "username" => $user['username'],
        "first_name" => $user['first_name'],
        "last_name" => $user['last_name'],
        "email" => $user['email'],
        "password" => md5($user['password'])
        // "status" => "PENDING",
        // "token" => md5(random_bytes(16))
      ]);
    } catch (\Exception $e) {
      if (str_contains($e->getMessage(), 'users.uq_user_email')) {
        throw new Exception("Account with same email exists in the database", 400, $e);
      } else {
        throw $e;
      }
    }

    //  $this->smtpClient->send_register_user_token($user);

    return $user;
  }
}
