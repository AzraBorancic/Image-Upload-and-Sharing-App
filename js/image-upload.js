// Code By Webdevtrick ( https://webdevtrick.com )
function readFile(input) {
  if (input.files && input.files[0]) {
    var wrapperZone = $(input).parent();
    var previewZone = $(input).parent().parent().find('.preview-zone');
    var boxZone = $(input).parent().parent().find('.preview-zone').find('.box').find('.box-body');

    wrapperZone.removeClass('dragover');
    previewZone.removeClass('hidden');
    boxZone.empty();
    for (const file of input.files) {
      var reader = new FileReader();
      console.log(file)
      reader.onload = function (e) {
        var htmlPreview =
          '<img width="200" src="' + e.target.result + '" />' +
          '<p>' + file.name + '</p>';
        boxZone.append(htmlPreview);
      };

      reader.readAsDataURL(file);
    }
  }
}

function uploadFile() {
  var fd = new FormData();
  var files = $('.dropzone')[0].files;

  if (files && files[0]) {

    for (const file of files) {
      fd.append(file.name, file);
    }

    $.ajax({
      url: 'rest/images',
      type: 'post',
      data: fd,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response != 0) {
          console.log(response)
        } else {
          console.log('file not uploaded');
        }
      },
    });
  }
}

function reset(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();
}

$("#upload-button").click(function () {
  uploadFile();
});

$(".dropzone").change(function () {
  readFile(this);
});

$('.dropzone-wrapper').on('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass('dragover');
});

$('.dropzone-wrapper').on('dragleave', function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).removeClass('dragover');
});

$('.remove-preview').on('click', function () {
  var boxZone = $(this).parents('.preview-zone').find('.box-body');
  var previewZone = $(this).parents('.preview-zone');
  var dropzone = $(this).parents('.form-group').find('.dropzone');
  boxZone.empty();
  previewZone.addClass('hidden');
  reset(dropzone);
});