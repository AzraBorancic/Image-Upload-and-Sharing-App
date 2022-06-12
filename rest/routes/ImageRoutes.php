<?php

/**
 * @OA\Get(path="/images", tags={"images"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return all user images from the API. ",
 *         @OA\Response( response=200, description="List of images.")
 * )
 */
Flight::route('GET /images', function () {
    // who is the user who calls this method?
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
 *     @OA\RequestBody(description="Basic image info", required=true,
 *       @OA\MediaType(mediaType="multipart/form-data",
 *             @OA\Schema(
 *                @OA\Property(
 *                    property="files",
 *                    type="array",
 *                    @OA\Items(type="string", format="binary"),
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