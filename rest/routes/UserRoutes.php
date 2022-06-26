<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// this implementation was a part of my SSSD project with prof. Adnan Miljkovic

function check_pass($password)
{
  $pp = new PwnedPasswords\PwnedPasswords;
  $insecure = $pp->isPwned($password); //returns true or false

  if ($insecure) {
    return ['status' => 'error', 'message' => 'Password has already been compromised in previous data leaks, please try a more secure passphrase.'];
  } else {
    return ['status' => 'ok', 'message' => 'Password is valid!'];
  }
}

function domain_exists($email, $record = 'MX')
{
  list($user, $domain) = explode('@', $email);
  return checkdnsrr($domain, $record);
}

/**
 * @OA\Get(path="/me", tags={"login"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return current user data. ",
 *         @OA\Response( response=200, description="List of images.")
 * )
 */
Flight::route('GET /me', function () {
  $user = Flight::get('user');
  $favorite = Flight::favoriteDao()->get_by_user_id($user['id']);
  $user['favorite_id'] = $favorite['id'];
  Flight::json($user);
});

/**
 * @OA\Post(
 *     path="/login",
 *     description="Login to the system",
 *     tags={"login"},
 *     @OA\RequestBody(description="Basic user info", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="email", type="string", example="name@example.com",	description="Email"),
 *    				@OA\Property(property="password", type="string", example="1234",	description="Password" )
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="JWT Token on successful response"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Wrong Password | User doesn't exist"
 *     )
 * )
 */
Flight::route('POST /login', function () {

  $login = Flight::request()->data->getData();
  $user = Flight::userDao()->get_user_by_email($login['email']);
  if (isset($user['id'])) {
    if ($user['password'] == md5($login['password'])) {
      unset($user['password']);
      $user['exp'] = time() + $_ENV['JWT_TOKEN_TIME'];
      $jwt = JWT::encode($user, $_ENV['JWT_SECRET'], 'HS256');
      Flight::json(['token' => $jwt, 'message' => 'Logged in successfully!']);
    } else {
      Flight::json(["message" => "Wrong password"], 404);
    }
  } else {
    Flight::json(["message" => "User doesn't exist"], 404);
  }
});


/**
 * @OA\Post(path="/register", tags={"login"},
 *   @OA\RequestBody(description="Basic user info", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *             required={"username", "first_name", "last_name", "email", "password"},
 *    				 @OA\Property(property="username", type="string", example="User123",	description="Username of the account" ),
 *     				 @OA\Property(property="first_name", type="string", example="First Name",	description="First name of the user" ),
 *     				 @OA\Property(property="last_name", type="string", example="Last Name",	description="Last name of the user" ),
 *    				 @OA\Property(property="email", type="string", example="myemail@gmail.com",	description="User's email address" ),
 *             @OA\Property(property="password", type="string", example="12345",	description="Password" )
 *          )
 *       )
 *     ),
 *  @OA\Response(response="200", description="Message that user has been created.")
 * )
 */
Flight::route('POST /register', function () {

  $username = $id = Flight::request()->data->username;
  $password = $id = Flight::request()->data->password;
  $email_address = $id = Flight::request()->data->email;
  $phone_number = $id = Flight::request()->data->phone_number;

  if (strlen($username) < 3) {
    Flight::json(array('status' => 'error', 'message' => 'Username should be at least 3 characters!'));
    die();
  }

  if (!ctype_alnum($username)) {
    Flight::json(array('status' => 'error', 'message' => 'Username has to contain only alphanumeric characters!'));
    die();
  }

  if (preg_match('/\s/', $username)) {
    Flight::json(array('status' => 'error', 'message' => 'Username cannot contain whitespace characters!'));
    die();
  }

  $user = Flight::userDao()->get_user_by_email($email_address);

  if (isset($user['id'])) {
    Flight::json(["message" => "User already exists for this email address!"], 404);
    die();
  }

  if (strlen($password) < 8) {
    Flight::json(array('status' => 'error', 'message' => 'Password should be at least 8 characters!'));
    die();
  }

  $validate_password = check_pass($password);

  if ($validate_password['status'] != 'ok') {
    Flight::json($validate_password);
    die();
  }

  if (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
    Flight::json(array('status' => 'error', 'message' => 'Email is not valid'));
    die();
  }

  if (!domain_exists($email_address)) {
    Flight::json(array('status' => 'error', 'message' => 'Email domain does not exist!'));
    die();
  }

  $phoneUtil = \libphonenumber\PhoneNumberUtil::getInstance();

  try {
    $numberProto = $phoneUtil->parse($phone_number, "BA");
    $is_possible_number = $phoneUtil->isPossibleNumber($numberProto);
  } catch (\libphonenumber\NumberParseException $e) {
    Flight::json(array('status' => 'error', 'message' => $e->getMessage()));
    die();
  }

  if (!$is_possible_number) {
    Flight::json(array('status' => 'error', 'message' => 'Phone number is not valid!'));
    die();
  }

  $data = Flight::request()->data->getData();
  Flight::userService()->register($data);
  // TODO: add in account verification
  // Flight::json(["message" => "Confirmation email has been sent. Please confirm your account"]);
  Flight::json(["message" => "Account has been created successfully!"]);
});
