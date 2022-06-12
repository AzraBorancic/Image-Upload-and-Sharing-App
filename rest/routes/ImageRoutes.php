<?php

/**
 * @OA\Get(path="/images/all", tags={"images"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return all images from the API. ",
 *         @OA\Response( response=200, description="List of images.")
 * )
 */
Flight::route('GET /images/all', function () {
    Flight::json(Flight::imageService()->get_all_images());
});


/**
 * @OA\Get(path="/images", tags={"images"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return all user images from the API. ",
 *         @OA\Response( response=200, description="List of images.")
 * )
 */
Flight::route('GET /images', function () {
    $user = Flight::get('user');
    Flight::json(Flight::imageService()->get_images($user));
});

/**
 * @OA\Get(path="/images/{id}", tags={"images"}, security={{"ApiKeyAuth": {}}},
 *     @OA\Parameter(in="path", name="id", example=1, description="Id of image"),
 *     @OA\Response(response="200", description="Fetch individual image")
 * )
 */
Flight::route('GET /images/@id', function ($id) {
    Flight::json(Flight::imageService()->get_by_id(Flight::get('user'), $id));
});

/**
 * @OA\Post(
 *     path="/images", security={{"ApiKeyAuth": {}}},
 *     description="Add user image",
 *     tags={"images"},
 *     @OA\RequestBody(description="Images to upload", required=true,
 *       @OA\MediaType(mediaType="multipart/form-data",
 *             @OA\Schema(
 *                @OA\Property(
 *                     description="file to upload",
 *                     property="file",
 *                     type="file"
 *                 ),
 *             )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Image that has been created"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('POST /images', function () {
    $files = Flight::request()->files;
    Flight::json(Flight::imageService()->add(Flight::get('user'), $files));
});

/**
 * @OA\Delete(
 *     path="/images/{id}", security={{"ApiKeyAuth": {}}},
 *     description="Delete user image",
 *     tags={"images"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Image ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Image deleted"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('DELETE /images/@id', function ($id) {
    Flight::imageService()->delete(Flight::get('user'), $id);
    Flight::json(["message" => "Image has successfully been deleted!"]);
});

/**
 * @OA\Get(path="/favorite", tags={"favorites"}, security={{"ApiKeyAuth": {}}},
 *     @OA\Response(response="200", description="Get favorite user images")
 * )
 */
Flight::route('GET /favorite', function () {
    Flight::json(Flight::favoriteImageService()->get_favorite_images(Flight::get('user')));
});

/**
 * @OA\Post(
 *     path="/favorite/{id}/{image_id}", security={{"ApiKeyAuth": {}}},
 *     description="Add image to favorites",
 *     tags={"favorites"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Id of favorite item"),
 *     @OA\Parameter(in="path", name="image_id", example=2, description="Id of image"),
 *     @OA\Response(
 *         response=200,
 *         description="Image has been added to favorites."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('POST /favorite/@id/@image_id', function ($id, $image_id) {
    Flight::json(Flight::favoriteImageService()->add(Flight::get('user'), ['favorite_id' => $id, 'image_id' => $image_id]));
});

/**
 * @OA\Delete(
 *     path="/favorite/{image_id}", security={{"ApiKeyAuth": {}}},
 *     description="Delete user image from favorites",
 *     tags={"favorites"},
 *     @OA\Parameter(in="path", name="image_id", example=1, description="Image ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Image deleted"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('DELETE /favorite/@image_id', function ($image_id) {
    Flight::favoriteImageService()->delete(Flight::get('user'), $image_id);
    Flight::json(["message" => "Image has been removed from favorites!"]);
});

/**
 * @OA\Post(
 *     path="/like/{image_id}", security={{"ApiKeyAuth": {}}},
 *     description="Like image",
 *     tags={"likes"},
 *     @OA\Parameter(in="path", name="image_id", example=1, description="Id of image"),
 *     @OA\Response(
 *         response=200,
 *         description="Image has been added to favorites."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('POST /like/@image_id', function ($image_id) {
    Flight::json(Flight::userLikedImageService()->add(Flight::get('user'), ['image_id' => $image_id]));
});

/**
 * @OA\Delete(
 *     path="/dislike/{image_id}", security={{"ApiKeyAuth": {}}},
 *     description="Dislike image",
 *     tags={"likes"},
 *     @OA\Parameter(in="path", name="image_id", example=1, description="Image ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Image deleted"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('DELETE /dislike/@image_id', function ($image_id) {
    Flight::userLikedImageService()->delete(Flight::get('user'), $image_id);
    Flight::json(["message" => "Image disliked!"]);
});
