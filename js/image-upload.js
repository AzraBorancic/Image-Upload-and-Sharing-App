window.addEventListener(
  "DOMContentLoaded",
  function () {
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

function getImages() {
  $(".loader").removeClass('d-none');
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
        galleryItem += '        <div id="gallery-item-';
        galleryItem += image["id"];
        galleryItem += '"';
        galleryItem += '  class="col-md-3">';
        galleryItem += '          <div class="gallery-item" tabindex="0">';
        galleryItem += "            <img";
        galleryItem += "              src=";
        galleryItem += JSON.stringify(image["s3_url"]);
        galleryItem += '"';
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
      $(".loader").addClass('d-none');
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
