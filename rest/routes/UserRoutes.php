<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * @OA\Get(path="/me", tags={"login"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return current user data. ",
 *         @OA\Response( response=200, description="List of images.")
 * )
 */
Flight::route('GET /me', function () {
  $user = Flight::get('user');
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
Flight::route('POST /login', function(){
    $login = Flight::request()->data->getData();
    $user = Flight::userDao()->get_user_by_email($login['email']);
    if (isset($user['id'])){
      if($user['password'] == md5($login['password'])){
        unset($user['password']);
        $user['exp'] = time() + $_ENV['JWT_TOKEN_TIME'];
        $jwt = JWT::encode($user, $_ENV['JWT_SECRET'], 'HS256');
        Flight::json(['token' => $jwt]);
      }else{
        Flight::json(["message" => "Wrong password"], 404);
      }
    }else{
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
Flight::route('POST /register', function(){
  $data = Flight::request()->data->getData();
  Flight::userService()->register($data);
  // TODO: add in account verification
  // Flight::json(["message" => "Confirmation email has been sent. Please confirm your account"]);
  Flight::json(["message" => "Account has been created successfully!"]);
});

?>