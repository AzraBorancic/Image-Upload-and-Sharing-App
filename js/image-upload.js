window.addEventListener(
  "DOMContentLoaded",
  function () {
    var myModal = document.getElementById('exampleModalCenter')
    
    myModal.addEventListener('hidden.bs.modal', function () {
      setTimeout(() => {
        let element = document.getElementById('image-modal-container');
        element.remove();
        let modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = '<div id="loader-modal" class="loader text-center"></div>';
      }, 500);
    })
  },
  false
);

function reset(e) {
  e.wrap("<form>").closest("form").get(0).reset();
  e.unwrap();
}

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
          $('.gallery').html();
          toastr.success('Image successfully uploaded!');
          getImages();
        } else {
          toastr.error('Image upload failed: ', response);
          console.log("file not uploaded");
        }
      },
    });
  } else {
    toastr.warning('Please select images to be uploaded!');
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
    likeHtml += ')"  id="dislike_button" class=\"btn btn-secondary\" type=\"button\"> <i class=\"fa-solid fa-heart-crack\"><\/i> Dislike<\/button>';
    $('#like_number').html(Number($('#like_number').text()) + 1);
    $('#like_section').html(likeHtml);
    toastr.success('Image successfully liked!');
  } else {
    likeHtml += '<button onclick="manageImageLikes(';
    likeHtml += id;
    likeHtml += ', true)" id="like_button" class=\"btn btn-primary\" type=\"button\"> <i class=\"fa-solid fa-heart\"><\/i> Like<\/button>';
    $('#like_number').html(Number($('#like_number').text()) - 1);
    $('#like_section').html(likeHtml);
    toastr.warning('Image successfully disliked!');
  }


  $.ajax({
    url: (isLike ? "rest/like/" : "rest/dislike/") + id ,
    type: isLike ? "POST" : "DELETE",
    contentType: false,
    processData: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      switch(window.location.hash) {
        case '#dashboard':
          getImages();
          break;
        case '#my-images':
          getImages(true);
          break;
        case '#favorites':
          getImages(false, true);
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
    favoriteHtml += String('onclick=manageFavorites(' + id + ', ' + imageId + ', ' + true + ')');
    favoriteHtml += " class=\"btn btn-warning\" type=\"button\"> <i class=\"fa-solid fa-star\"><\/i> Remove from Favorites<\/button>";
    $('#favorite_section').html(favoriteHtml);
    toastr.success('Image added to favorites!');
  } else {
    favoriteHtml += "<button id='favorite-button'";
    favoriteHtml += String('onclick=manageFavorites(' + id + ',' + imageId + ')')
    favoriteHtml += " class=\"btn btn-success\" type=\"button\"> <i class=\"fa-solid fa-star\"><\/i> Add to Favorites<\/button>";
    $('#favorite_section').html(favoriteHtml);
    toastr.warning('Image removed from favorites!');
  }


  $.ajax({
    url: !removeFromFavorites ? "rest/favorite/" + id + "/" + imageId : "rest/favorite/" + imageId,
    type: !removeFromFavorites ? "POST" : "DELETE",
    contentType: false,
    processData: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      switch(window.location.hash) {
        case '#dashboard':
          getImages();
          break;
        case '#my-images':
          getImages(true);
          break;
        case '#favorites':
          getImages(false, true);
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

function openModal(id) {
  let favoriteId = JSON.parse(localStorage.getItem('user'))['favorite_id'];
  $('#openModal').click();

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
      imageHtml += '<div class="col-md-7">'
      imageHtml += '            <img';
      imageHtml += '              src=';
      imageHtml += JSON.stringify(data[0]["s3_url"]);
      imageHtml += '              class="gallery-image"';
      imageHtml += '              alt=""';
      imageHtml += "            />";
      imageHtml += '</div>';
      imageHtml += '<div class="col-md-5 justify-content-center align-items-center d-flex">';
      imageHtml += '<div class="d-grid gap-2 col-12 mx-auto">'
      imageHtml += "<h1> Likes: ";
      imageHtml += "<span id='like_number'>";
      imageHtml += data[0]["number_of_likes"];
      imageHtml += "<\/span>";
      imageHtml += "<\/h1>";
      imageHtml += "<\/br>";
      imageHtml += "<div id='like_section' class=\"d-grid gap-2 col-12 mx-auto\">";

      if (data[0]['has_user_liked'] !== 1) {
        imageHtml += '<button onclick="manageImageLikes(';
        imageHtml += data[0]['id'];
        imageHtml += ', true)" id="like_button" class=\"btn btn-primary\" type=\"button\"> <i class=\"fa-solid fa-heart\"><\/i> Like<\/button>';
      } else {
        imageHtml += '<button onclick="manageImageLikes(';
        imageHtml += data[0]['id'];
        imageHtml += ')"  id="dislike_button" class=\"btn btn-secondary\" type=\"button\"> <i class=\"fa-solid fa-heart-crack\"><\/i> Dislike<\/button>';
      }

      imageHtml += '</div>'
      imageHtml += "<div id='favorite_section' class=\"d-grid gap-2 col-12 mx-auto\">";

      if (data[0]['has_user_favorited'] !== 1) {
        imageHtml += "<button id='favorite_button'";
        imageHtml += String('onclick=manageFavorites(' + favoriteId + ',' + id + ')')
        imageHtml += " class=\"btn btn-success\" type=\"button\"> <i class=\"fa-solid fa-star\"><\/i> Add to Favorites<\/button>";
      } else {
        imageHtml += "<button id='remove-favorite-button'";
        imageHtml += String('onclick=manageFavorites(' + favoriteId + ',' + id + ',' + true + ')');
        imageHtml += " class=\"btn btn-warning\" type=\"button\"> <i class=\"fa-solid fa-star\"><\/i> Remove from Favorites<\/button>";
      }

      imageHtml += '</div>'
      imageHtml += "<button class=\"btn btn-info\" type=\"button\"> <i class=\"fa-solid fa-folder-open\"><\/i>  Add to Album<\/button>";
      imageHtml += "<div class=\"input-group mb-3\">";
      imageHtml += "  <input id='image-url-share' type=\"text\" class=\"form-control\" placeholder=\"Image URL\" aria-describedby=\"button-addon2\" value=";
      imageHtml += JSON.stringify(data[0]["s3_url"]);
      imageHtml += ">";
      imageHtml += '  <button onclick="copyLink()"  class=\"btn btn-secondary\" type=\"button\" id=\"button-addon2\"> <i class=\"fa-solid fa-copy\"><\/i> <\/button>';
      imageHtml += "<\/div>";
      imageHtml += "";
      imageHtml += "<br \/>";

      if (JSON.parse(localStorage.getItem('user'))['id'] === data[0]['user_id']) {
        imageHtml += "<button class=\"btn btn-danger\" type=\"button\"> <i class=\"fa-solid fa-trash\"><\/i> Delete image<\/button>";
      }

      imageHtml += '</div>';
      imageHtml += '</div>';
      imageHtml += '</div>';
    
      $('#loader-modal').addClass('d-none');
      $('.modal-body').html(imageHtml);    
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

function getImages(myImages = false, favorites = false) {
  $('.gallery-item').addClass('d-none');
  switch (true) {
    case myImages:
      $("#loader-my-images").removeClass('d-none');
      break;
    case favorites:
        $("#loader-favorites").removeClass('d-none');
        break;
    default:
        $("#loader-dashboard").removeClass('d-none');
        break;
  }
  $.ajax({
    url: myImages ? "rest/images/" : favorites ? "rest/favorite" : "rest/images/all",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var galleryItems = "";
      for (const image of data) {
        var galleryItem = "";
        galleryItem += '        <div onclick=\"openModal('
        galleryItem += String(image["id"]);
        galleryItem += ')\" id="gallery-item-'
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
        galleryItem += image['number_of_likes'];
        galleryItem += "                </li>";
        galleryItem += "              </ul>";
        galleryItem += "            </div>";
        galleryItem += "          </div>";
        galleryItem += "        </div>";
        galleryItems += galleryItem;
      }

      if (myImages) {
        $("#my-images-row").html(galleryItems);
        $("#loader-my-images").addClass('d-none');
      } else if (favorites) {
        $("#favorites-row").html(galleryItems);
        $("#loader-favorites").addClass('d-none');
      } else {
        $(".gallery").html(galleryItems);
        $("#loader-dashboard").addClass('d-none');
        $(".remove-preview").click();
      }

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
    },
  });
}

$("#upload-button").click(function () {
  uploadFile();
});

$(".dropzone").change(function () {
  readFile(this);
});

$(".dropzone-wrapper").on("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass("dragover");
});

$(".dropzone-wrapper").on("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).removeClass("dragover");
});

$(".remove-preview").on("click", function () {
  var boxZone = $(this).parents(".preview-zone").find(".box-body");
  var previewZone = $(this).parents(".preview-zone");
  var dropzone = $(this).parents(".form-group").find(".dropzone");
  boxZone.empty();
  previewZone.addClass("hidden");
  reset(dropzone);
});
