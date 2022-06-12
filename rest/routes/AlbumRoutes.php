<?php

/**
 * @OA\Get(path="/albums", tags={"albums"}, security={{"ApiKeyAuth": {}}},
 *         summary="Return all user albums from the API. ",
 *         @OA\Parameter(in="query", name="search", description="Search criteria"),
 *         @OA\Response( response=200, description="List of albums.")
 * )
 */
Flight::route('GET /albums', function () {
    // who is the user who calls this method?
    $user = Flight::get('user');
    $search = Flight::query('search');
    Flight::json(Flight::albumService()->get_albums($user, $search));
});

/**
 * @OA\Get(path="/albums/{id}", tags={"albums"}, security={{"ApiKeyAuth": {}}},
 *     @OA\Parameter(in="path", name="id", example=1, description="Id of album"),
 *     @OA\Response(response="200", description="Fetch individual album")
 * )
 */
Flight::route('GET /albums/@id', function ($id) {
    Flight::json([
        'album' => Flight::albumService()->get_by_id(Flight::get('user'), $id),
        'images' => Flight::albumService()->get_album_images($id)
    ]);
});

/**
 * @OA\Post(
 *     path="/albums/{album_id}/images/{image_id}", security={{"ApiKeyAuth": {}}},
 *     description="Add image to user album",
 *     tags={"albums"},
 *     @OA\Parameter(in="path", name="album_id", example=1, description="Id of album"),
 *     @OA\Parameter(in="path", name="image_id", example=2, description="Id of album"),
 *     @OA\Response(
 *         response=200,
 *         description="Image has been added to album."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('POST /albums/@album_id/images/@image_id', function () {
    Flight::json(Flight::albumService()->add_image_to_album(Flight::get('user'), Flight::request()->data->getData()));
});

/**
* @OA\Put(
*     path="/albums/{id}", security={{"ApiKeyAuth": {}}},
*     description="Update user album",
*     tags={"albums"},
*     @OA\Parameter(in="path", name="id", example=1, description="Album ID"),
*     @OA\RequestBody(description="Basic album info", required=true,
*       @OA\MediaType(mediaType="application/json",
*    			@OA\Schema(
*    				@OA\Property(property="name", type="string", example="test",	description="Title of the album")
*        )
*     )),
*     @OA\Response(
*         response=200,
*         description="Album that has been updated"
*     ),
*     @OA\Response(
*         response=500,
*         description="Error"
*     )
* )
*/
Flight::route('PUT /albums/@id', function($id){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::albumService()->update(Flight::get('user'), $id, $data));
});

/**
 * @OA\Delete(
 *     path="/albums/{id}", security={{"ApiKeyAuth": {}}},
 *     description="Delete user album",
 *     tags={"albums"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Album ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Album deleted"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('DELETE /albums/@id', function ($id) {
    Flight::albumService()->delete(Flight::get('user'), $id);
    Flight::json(["message" => "Album has successfully been deleted!"]);
});

/**
 * @OA\Delete(
 *     path="/albums/image/{id}", security={{"ApiKeyAuth": {}}},
 *     description="Remove image from user album",
 *     tags={"albums"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Property ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Image deleted from album"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
Flight::route('DELETE /albums/image/@id', function ($id) {
    Flight::albumService()->remove_image_from_album($id);
    Flight::json(["message" => "Image has been removed from the album!"]);
});

