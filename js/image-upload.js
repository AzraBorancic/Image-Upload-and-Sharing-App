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

    getImages();
  },
  false
);

function reset(e) {
  e.wrap("<form>").closest("form").get(0).reset();
  e.unwrap();
}

// Code By Webdevtrick ( https://webdevtrick.com )
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
      getImages();

      $.ajax({
        url: "rest/images/" + id,
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function (data) {
        
          $('#like_number').html(data[0]['number_of_likes']);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          toastr.error(XMLHttpRequest.responseJSON.message);
          UserService.logout();
        },
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
      UserService.logout();
    },
  });
}

function openModal(id) {

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
      imageHtml += "<button class=\"btn btn-info\" type=\"button\"> <i class=\"fa-solid fa-folder-open\"><\/i>  Add to Album<\/button>";
      imageHtml += "<button class=\"btn btn-warning\" type=\"button\"> <i class=\"fa-solid fa-star\"><\/i> Add to Favorites<\/button>";
      imageHtml += "<div class=\"input-group mb-3\">";
      imageHtml += "  <input id='image-url-share' type=\"text\" class=\"form-control\" placeholder=\"Image URL\" aria-describedby=\"button-addon2\" value=";
      imageHtml += JSON.stringify(data[0]["s3_url"]);
      imageHtml += ">";
      imageHtml += '  <button onclick="copyLink()"  class=\"btn btn-secondary\" type=\"button\" id=\"button-addon2\"> <i class=\"fa-solid fa-copy\"><\/i> <\/button>';
      imageHtml += "<\/div>";
      imageHtml += "";
      imageHtml += "<br \/>";
      imageHtml += "<button class=\"btn btn-danger\" type=\"button\"> <i class=\"fa-solid fa-trash\"><\/i> Delete image<\/button>";
      imageHtml += '</div>';
      imageHtml += '</div>';
      imageHtml += '</div>';
    
      $('#loader-modal').addClass('d-none');
      $('.modal-body').html(imageHtml);    
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
      UserService.logout();
    },
  });
}

function getImages() {
  $("#loader-dashboard").removeClass('d-none');
  $.ajax({
    url: "rest/images/all",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    success: function (data) {
      var galleryItems = "";
      for (const image of data) {
        var galleryItem = "";
        galleryItem += '        <div onclick=\"openModal('
        galleryItem += image["id"]
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

      $(".gallery").html(galleryItems);
      $("#loader-dashboard").addClass('d-none');
      $(".remove-preview").click();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error(XMLHttpRequest.responseJSON.message);
      UserService.logout();
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
