//for image modals in gallery
window.addEventListener(
  "DOMContentLoaded",
  function () {
    var imageModal = document.getElementById("exampleModalCenter");

    imageModal.addEventListener("hidden.bs.modal", function () {
      setTimeout(() => {
        let element = document.getElementById("image-modal-container");
        element.remove();
        let modalBody = document.getElementById("modal-body");
        modalBody.innerHTML =
          '<div id="loader-modal" class="loader text-center"></div>';
      }, 500);
    });
  },
  false
);

// Method By Webdevtrick ( https://webdevtrick.com )
function readFile(input) {
  if (input.files && input.files[0]) {
    var wrapperZone = $(input).parent();
    var previewZone = $(input).parent().parent().find(".preview-zone");
    var boxZone = $(input)
      .parent()
      .parent()
      .find(".preview-zone")
      .find(".box")
      .find(".box-body");

    wrapperZone.removeClass("dragover");
    previewZone.removeClass("hidden");
    boxZone.empty();
    for (const file of input.files) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var htmlPreview =
          '<img width="250" src="' +
          e.target.result +
          '" />' +
          "<p>" +
          file.name +
          "</p>";
        boxZone.append(htmlPreview);
      };

      reader.readAsDataURL(file);
    }
  }
}

function uploadFile() {
  toastr.info('Image upload in progress...');
  $("#upload-button").prop('disabled', true);
  var fd = new FormData();
  var files = $(".dropzone")[0].files;

  if (files && files[0]) {
    for (const file of files) {
      fd.append(file.name, file);
    }

    $.ajax({
      url: "rest/images",
      type: "POST",
      data: fd,
      contentType: false,
      processData: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
      },
      success: function (response) {
        if (response != 0) {
          console.log(response);
          $(".gallery").html();
          toastr.success("Image successfully uploaded!");
          $(".remove-preview").click();
          $("#upload-button").prop('disabled', false);
          getImages();
        } else {
          toastr.error("Image upload failed: ", response);
          console.log("file not uploaded");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error(XMLHttpRequest.responseJSON.message);
      },
    });
  } else {
    toastr.warning("Please select images to be uploaded!");
  }
}

// Taken from w3schools
function copyLink() {
  /* Get the text field */
  var copyText = document.getElementById("image-url-share");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  toastr.success("Link copied successfully!");
}

function manageImageLikes(id, isLike = false) {
  let likeHtml = "";
  if (isLike) {
    likeHtml += '<button onclick="manageImageLikes(';
    likeHtml += id;
    likeHtml +=
      ')"  id="dislike_button" class="btn btn-secondary" type="button"> <i class="fa-solid fa-heart-crack"></i> Dislike</button>';
    $("#like_number").html(Number($("#like_number").text()) + 1);
    $("#like_section").html(likeHtml);
    toastr.success("Image successfully liked!");
  } else {
    likeHtml += '<button onclick="manageImageLikes(';
    likeHtml += id;
    likeHtml +=
      ', true)" id="like_button" class="btn btn-primary" type="button"> <i class="fa-solid fa-heart"></i> Like</button>';
    $("#like_number").html(Number($("#like_number").text()) - 1);
    $("#like_section").html(likeHtml);
    toastr.warning("Image successfully disliked!");
  }

  $.ajax({
    url: (isLike ? "rest/like/" : "rest/dislike/") + id,
    type: isLike ? "POST" : "DELETE",
    contentType: false,
    processData: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      switch (window.location.hash) {
        case "#dashboard":
          getImages();
          break;
        case "#my-images":
          getImages(true);
          break;
        case "#favorites":
          getImages(false, true);
          break;
        case "#album":
          getAlbum(
            localStorage.getItem("album_id"),
            localStorage.getItem("album_name")
          );
          break;
        default:
          break;
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function manageFavorites(id, imageId, removeFromFavorites = false) {
  let favoriteHtml = "";
  if (!removeFromFavorites) {
    favoriteHtml += "<button id='remove-favorite-button'";
    favoriteHtml += String(
      "onclick=manageFavorites(" + id + ", " + imageId + ", " + true + ")"
    );
    favoriteHtml +=
      ' class="btn btn-warning" type="button"> <i class="fa-solid fa-star"></i> Remove from Favorites</button>';
    $("#favorite_section").html(favoriteHtml);
    toastr.success("Image added to favorites!");
  } else {
    favoriteHtml += "<button id='favorite-button'";
    favoriteHtml += String(
      "onclick=manageFavorites(" + id + "," + imageId + ")"
    );
    favoriteHtml +=
      ' class="btn btn-success" type="button"> <i class="fa-solid fa-star"></i> Add to Favorites</button>';
    $("#favorite_section").html(favoriteHtml);
    toastr.warning("Image removed from favorites!");
  }

  $.ajax({
    url: !removeFromFavorites
      ? "rest/favorite/" + id + "/" + imageId
      : "rest/favorite/" + imageId,
    type: !removeFromFavorites ? "POST" : "DELETE",
    contentType: false,
    processData: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      switch (window.location.hash) {
        case "#dashboard":
          getImages();
          break;
        case "#my-images":
          getImages(true);
          break;
        case "#favorites":
          getImages(false, true);
          break;
        case "#album":
          getAlbum(
            localStorage.getItem("album_id"),
            localStorage.getItem("album_name")
          );
          break;
        default:
          break;
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

//individual image modal
function openModal(id, albumImageId = null) {
  let favoriteId = JSON.parse(localStorage.getItem("user"))["favorite_id"];
  if (window.location.hash !== "#album") {
    $("#openModal").click();
  } else {
    $("#openImageModal").click();
  }

  $.ajax({
    url: "rest/images/" + id,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var imageHtml = "";
      imageHtml += '<div id="image-modal-container"';
      imageHtml += ' class="row text-center" >';
      imageHtml += '<div class="col-md-7">';
      imageHtml += "            <img";
      imageHtml += "              src=";
      imageHtml += JSON.stringify(data[0]["s3_url"]);
      imageHtml += '              class="gallery-image"';
      imageHtml += '              alt=""';
      imageHtml += "            />";
      imageHtml += "</div>";
      imageHtml +=
        '<div class="col-md-5 justify-content-center align-items-center d-flex">';
      imageHtml += '<div class="d-grid gap-2 col-12 mx-auto">';
      imageHtml += "<h1> Likes: ";
      imageHtml += "<span id='like_number'>";
      imageHtml += data[0]["number_of_likes"];
      imageHtml += "</span>";
      imageHtml += "</h1>";
      imageHtml += "</br>";
      imageHtml +=
        "<div id='like_section' class=\"d-grid gap-2 col-12 mx-auto\">";

      if (data[0]["has_user_liked"] !== 1) {
        imageHtml += '<button onclick="manageImageLikes(';
        imageHtml += data[0]["id"];
        imageHtml +=
          ', true)" id="like_button" class="btn btn-primary" type="button"> <i class="fa-solid fa-heart"></i> Like</button>';
      } else {
        imageHtml += '<button onclick="manageImageLikes(';
        imageHtml += data[0]["id"];
        imageHtml +=
          ')"  id="dislike_button" class="btn btn-secondary" type="button"> <i class="fa-solid fa-heart-crack"></i> Dislike</button>';
      }

      imageHtml += "</div>";
      imageHtml +=
        "<div id='favorite_section' class=\"d-grid gap-2 col-12 mx-auto\">";

      if (data[0]["has_user_favorited"] !== 1) {
        imageHtml += "<button id='favorite_button'";
        imageHtml += String(
          "onclick=manageFavorites(" + favoriteId + "," + id + ")"
        );
        imageHtml +=
          ' class="btn btn-success" type="button"> <i class="fa-solid fa-star"></i> Add to Favorites</button>';
      } else {
        imageHtml += "<button id='remove-favorite-button'";
        imageHtml += String(
          "onclick=manageFavorites(" + favoriteId + "," + id + "," + true + ")"
        );
        imageHtml +=
          ' class="btn btn-warning" type="button"> <i class="fa-solid fa-star"></i> Remove from Favorites</button>';
      }

      imageHtml += "</div>";

      imageHtml +=
        "<div id='album_section' class=\"d-grid gap-2 col-12 mx-auto\">";
      if (window.location.hash !== '#album') {
        imageHtml +=
        '<button id="album-show-button" onclick="revealAlbumSelect()" class="btn btn-info" type="button"> <i class="fa-solid fa-folder-open" disabled="true"></i>  Add to Album</button>';
        imageHtml += '<div class="input-group">';
        imageHtml +=
          '<select id=\'album-select\' class="form-select d-none" aria-label="Default select example">';
        imageHtml += "</select>";
        imageHtml += '  <button id="album-add-button" onclick="addToAlbum(';
        imageHtml += data[0]["id"];
        imageHtml += ')" class="btn btn-success d-none" type="button" id="button-addon2"> <i class="fa-solid fa-check"></i> </button>';
        imageHtml += '<input id="album-name-open-modal" name="name" type="text" class="form-control d-none" placeholder="Name" aria-label="Name">'
        imageHtml += '<button id="save-album-button" type="button" class="btn btn-primary d-none" onclick="createAlbum()">Save</button>';
        imageHtml += "</div>";
      } else {
        imageHtml +=
          '<button id="album-remove-button" onclick="removeFromAlbum('
        imageHtml += albumImageId;
        imageHtml += ')" class="btn btn-danger" type="button"> <i class="fa-solid fa-folder-open" disabled="true"></i>  Remove From Album</button>';
      }
      imageHtml += '<div class="input-group mb-3">';
      imageHtml +=
        '  <input id=\'image-url-share\' type="text" class="form-control" placeholder="Image URL" aria-describedby="button-addon2" value=';
      imageHtml += JSON.stringify(data[0]["s3_url"]);
      imageHtml += ">";
      imageHtml +=
        '  <button onclick="copyLink()"  class="btn btn-secondary" type="button" id="button-addon2"> <i class="fa-solid fa-copy"></i> </button>';
      imageHtml += "</div>";
      imageHtml += "</div>";

      imageHtml += "";
      imageHtml += "<br />";

      if (
        JSON.parse(localStorage.getItem("user"))["id"] === data[0]["user_id"]
      ) {
        imageHtml +=
          "<div id='album_section' class=\"d-grid gap-2 col-12 mx-auto\">";
        imageHtml += '<button id="delete-image-button" onclick="deleteImage(';
        imageHtml += data[0]['id'];
        imageHtml += ')" class="btn btn-danger" type="button"> <i class="fa-solid fa-trash"></i> Delete image</button>';
        imageHtml += "</div>";
      }

      imageHtml += "</div>";
      imageHtml += "</div>";
      imageHtml += "</div>";

      $("#loader-modal").addClass("d-none");
      if (window.location.hash !== "#album") {
        $(".modal-body").html(imageHtml);
      } else {
        $("#album-image-modal-body").html(imageHtml);
      }

      $.ajax({
        url: "rest/albums",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function (albumData) {
          for (const album of albumData) {
            $("#album-select").append(`<option value="${album["id"]}">
                                        ${album["name"]}
                                  </option>`);
          }
          $("#album-show-button").prop("disabled", false);
        },
        error: function (
          AlbumXMLHttpRequest,
          albumTextStatus,
          albumErrorThrown
        ) {
          toastr.error(AlbumXMLHttpRequest.responseJSON.message);
        },
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function removeFromAlbum(album_image_id) {
  $("#album-remove-button").prop("disabled", true);
  toastr.info("Removal of image from album in progress...");

  $.ajax({
    url: "rest/albums/image/" + album_image_id,
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      $("#album-remove-button").prop("disabled", false);
      getAlbum(
        localStorage.getItem("album_id"),
        localStorage.getItem("album_name")
      );      
      $("#imageModal").modal('toggle');
      toastr.success("Image removed from album!");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#album-remove-button").prop("disabled", false);
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });

}

function deleteImage(id) {
  $("#delete-image-button").prop("disabled", true);
  toastr.info("Image delete in progress...");

  $.ajax({
    url: "rest/images/" + id,
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      $("#delete-image-button").prop("disabled", false);
      $("#loader-album-modal-individual").addClass("d-none");

      switch (window.location.hash) {
        case "#dashboard":
          getImages();
          break;
        case "#my-images":
          getImages(true);
          break;
        case "#favorites":
          getImages(false, true);
          break;
        case "#album":
          getAlbum(
            localStorage.getItem("album_id"),
            localStorage.getItem("album_name")
          );
          break;
        default:
          break;
      }
      
      if (window.location.hash !== '#album') {
        $("#exampleModalCenter").modal('toggle');
      } else {
        $("#imageModal").modal('toggle');
      }
      toastr.success("Image successfully deleted!");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#delete-image-button").prop("disabled", false);
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function revealAlbumSelect() {
  if ($("#album-select option").length > 0) {
    $("#album-select").removeClass("d-none");
    $("#album-add-button").removeClass("d-none"); 
  } else {
    toastr.info('No albums exist, please create a new one!');
    $("#album-name-open-modal").removeClass("d-none");
    $("#save-album-button").removeClass("d-none");
  }

}

//povuci slike
function getImages(myImages = false, favorites = false) {
  $(".gallery-item").addClass("d-none");
  switch (true) {
    case myImages:
      $("#loader-my-images").removeClass("d-none");
      break;
    case favorites:
      $("#loader-favorites").removeClass("d-none");
      break;
    default:
      $("#loader-dashboard").removeClass("d-none");
      break;
  }
  $.ajax({
    url: myImages
      ? "rest/images/"
      : favorites
      ? "rest/favorite"
      : "rest/images/all",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var galleryItems = "";
      for (const image of data) {
        var galleryItem = "";
        galleryItem += '        <div onclick="openModal(';
        galleryItem += String(image["id"]);
        galleryItem += ')" id="gallery-item-';
        galleryItem += image["id"];
        galleryItem += '"';
        galleryItem += '  class="col-md-3">';
        galleryItem += '          <div class="gallery-item" tabindex="0">';
        galleryItem += "            <img";
        galleryItem += "              src=";
        galleryItem += JSON.stringify(image["s3_url"]);
        galleryItem += '              class="gallery-image"';
        galleryItem += '              alt=""';
        galleryItem += "            />";
        galleryItem += "";
        galleryItem += '            <div class="gallery-item-info">';
        galleryItem += "              <ul>";
        galleryItem += '                <li class="gallery-item-likes">';
        galleryItem +=
          '                  <span class="visually-hidden">Likes:</span';
        galleryItem +=
          '                  ><i class="fas fa-heart" aria-hidden="true"></i> ';
        galleryItem += image["number_of_likes"];
        galleryItem += "                </li>";
        galleryItem += "              </ul>";
        galleryItem += "            </div>";
        galleryItem += "          </div>";
        galleryItem += "        </div>";
        galleryItems += galleryItem;
      }

      if (myImages) {
        $("#my-images-row").html(galleryItems);
        $("#loader-my-images").addClass("d-none");
      } else if (favorites) {
        $("#favorites-row").html(galleryItems);
        $("#loader-favorites").addClass("d-none");
      } else {
        $(".gallery").html(galleryItems);
        $("#loader-dashboard").addClass("d-none");
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function openAlbum(id, name) {
  localStorage.setItem("album_id", id);
  localStorage.setItem("album_name", name);
  setTimeout(() => {
    document.getElementById("album-link").click();
  }, 100);
}

function getAlbums(query = null) {
  // Album snippet and styling taken from https://codepen.io/shunyadezain/pen/GRqoWdG

  $(".album").addClass("d-none");
  $("#loader-albums").removeClass("d-none");

  $.ajax({
    url: "rest/albums" + (query == null ? "" : ("?search=" + query)),
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var albums = "";
      for (const album of data) {
        var albumHtml = "";
        albumHtml += '        <div id="album-';
        albumHtml += album["id"];
        albumHtml += '" onclick="openAlbum(';
        albumHtml += String(album["id"] + ",'" + album["name"] + "'");
        albumHtml +=
          ')" class="album col-md-3 col-xs-12" style="display: flex; justify-content: center; align-items: center; cursor: pointer;">';
        albumHtml += '          <div class="folder">';
        albumHtml += '            <div class="folder__back">';
        albumHtml += '              <div class="paper"></div>';
        albumHtml += '              <div class="paper"></div>';
        albumHtml += '              <div class="paper"></div>';
        albumHtml += '              <div class="folder__front"></div>';
        albumHtml += '              <div class="folder__front right"></div>';
        albumHtml += "            </div>";
        albumHtml += '            <h5 class="text-center mt-2 mb-5">';
        albumHtml += album["name"];
        albumHtml += "</h5>";
        albumHtml += "          </div>";
        albumHtml += "        </div>";

        albums += albumHtml;
      }

      $("#album-row").html(albums);
      $("#loader-albums").addClass("d-none");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function getAlbum(id, name) {
  $(".gallery-item").addClass("d-none");
  $("#loader-album").removeClass("d-none");
  $("#album-title").html(name);
  $("#album-name-edit").val(name);

  $.ajax({
    url: "rest/albums/" + id,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var galleryItems = "";
      for (const image of data["images"]) {
        var galleryItem = "";
        galleryItem += '        <div onclick="openModal(';
        galleryItem += String(image["id"]);

        if (window.location.hash === '#album') {
          galleryItem += ','
          galleryItem += image['album_image_id'];
        }

        galleryItem += ')" id="gallery-item-';
        galleryItem += image["id"];
        galleryItem += '"';
        galleryItem += '  class="col-md-3">';
        galleryItem += '          <div class="gallery-item" tabindex="0">';
        galleryItem += "            <img";
        galleryItem += "              src=";
        galleryItem += JSON.stringify(image["s3_url"]);
        galleryItem += '              class="gallery-image"';
        galleryItem += '              alt=""';
        galleryItem += "            />";
        galleryItem += "";
        galleryItem += '            <div class="gallery-item-info">';
        galleryItem += "              <ul>";
        galleryItem += '                <li class="gallery-item-likes">';
        galleryItem +=
          '                  <span class="visually-hidden">Likes:</span';
        galleryItem +=
          '                  ><i class="fas fa-heart" aria-hidden="true"></i> ';
        galleryItem += image["number_of_likes"];
        galleryItem += "                </li>";
        galleryItem += "              </ul>";
        galleryItem += "            </div>";
        galleryItem += "          </div>";
        galleryItem += "        </div>";
        galleryItems += galleryItem;
      }

      $("#individual-album-row").html(galleryItems);
      $("#loader-album").addClass("d-none");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function createAlbum() {
  toastr.info('Album creation started...');
  let albumName = "";
  if (window.location.hash === '#albums') {
    //u #albums
    albumName = $("#album-name-modal").val();
    $("#album-name-modal").prop("disabled", true);
    $("#save-button").prop("disabled", true);
    $("#loader-album-modal").removeClass("d-none");
  } else {
    //u #dashboard
    albumName = $("#album-name-open-modal").val();
    $("#album-name-open-modal").prop("disabled", true);
    $("#save-album-button").prop("disabled", true);
  }

  $.ajax({
    url: "rest/albums",
    type: "POST",
    data: {
      name: albumName,
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      if (window.location.hash === '#albums') {
        $("#album-name-modal").val("");
        $("#album-name-modal").prop("disabled", false);
        $("#save-button").prop("disabled", false);
        $("#loader-album-modal").addClass("d-none");
        $("#exampleModal").modal("toggle");
      } else {
        $("#album-name-open-modal").val("");
        $("#album-name-open-modal").prop("disabled", false);
        $("#save-album-button").prop("disabled", false);
      }
      toastr.success("Album successfully added, fetching data...");

      if (window.location.hash === '#albums') {
        getAlbums();
      } else {
        $.ajax({
          url: "rest/albums",
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
          },
          success: function (albumData) {
            for (const album of albumData) {
              $("#album-select").append(`<option value="${album["id"]}">
                                          ${album["name"]}
                                    </option>`);
            }
            $("#album-show-button").prop("disabled", false);
            $("#album-select").removeClass("d-none");
            $("#album-add-button").removeClass("d-none");
            $("#album-name-open-modal").addClass("d-none");
            $("#save-album-button").addClass("d-none");
          },
          error: function (
            AlbumXMLHttpRequest,
            albumTextStatus,
            albumErrorThrown
          ) {
            toastr.error(AlbumXMLHttpRequest.responseJSON.message);
          },
        });
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#album-name").prop("disabled", false);
      $("#save-button").prop("disabled", false);
      $("loader-album-modal").addClass("d-none");
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function addToAlbum(imageId) {
  let albumId = $("#album-select").val();
  $("#album-add-button").prop("disabled", true);
  toastr.info("Adding to album...");

  $.ajax({
    url: "rest/albums/" + albumId + "/images/" + imageId,
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      $("#album-add-button").prop("disabled", false);
      toastr.success("Image successfully added to album!");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#album-add-button").prop("disabled", false);
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function editAlbum() {
  let albumName = $("#album-name-edit").val();
  $("#album-name-edit").prop("disabled", true);
  $("#edit-button").prop("disabled", true);
  $("#loader-album-modal-edit").removeClass("d-none");

  $.ajax({
    url: "rest/albums/" + localStorage.getItem("album_id"),
    type: "PUT",
    data: JSON.stringify({
      name: albumName,
    }),
    contentType: "application/json",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      $("#album-name-modal").val("");
      $("#album-name-modal").prop("disabled", false);
      $("#edit-button").prop("disabled", false);
      $("#loader-album-modal-edit").addClass("d-none");
      $("#editModal").modal("toggle");
      toastr.success("Album successfully added!");
      getAlbum(localStorage.getItem("album_id"), albumName);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#album-name-modal").prop("disabled", false);
      $("#edit-button").prop("disabled", false);
      $("loader-album-modal-edit").addClass("d-none");
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function deleteAlbum() {
  let albumId = localStorage.getItem("album_id");
  $("#delete-button").prop("disabled", true);
  $("#loader-album-modal-individual").removeClass("d-none");

  $.ajax({
    url: "rest/albums/" + albumId,
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      $("#delete-button").prop("disabled", false);
      $("#loader-album-modal-individual").addClass("d-none");
      $("#deleteModal").modal("toggle");
      toastr.success("Album successfully deleted!");
      setTimeout(() => {
        document.getElementById("albums-link").click();
      }, 100);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $("#delete-button").prop("disabled", false);
      $("loader-album-modal").addClass("d-none");
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}