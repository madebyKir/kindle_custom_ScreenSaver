$(function () {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    
    // Начальные параметры (Kindle 11)
    var cropwidth = 1072;
    var cropheight = 1448;
    var currentdevice = "kindle11";

    $('#changeDevice').click(function(e) {
        e.preventDefault();
        $( ".cropFrame" ).remove(); // Очищаем предыдущую обрезку

        if (currentdevice == "kindle11") {
            // Переключаем на Paperwhite 5 (1236×1648)
            $('#kindle').css("background-image", "url('images/kindle_pw5.png')");
            cropwidth = 1236;
            cropheight = 1648;
            $('#device').text("Paperwhite 5");
            currentdevice = "paperwhite5";
        } 
        else if (currentdevice == "paperwhite5") {
            // Переключаем на Paperwhite 6 (1264×1680)
            $('#kindle').css("background-image", "url('images/kindle_pw6.png')");
            cropwidth = 1264;
            cropheight = 1680;
            $('#device').text("Paperwhite 6");
            currentdevice = "paperwhite6";
        }
        else if (currentdevice == "paperwhite6") {
            // Переключаем на Paperwhite (758×1024)
            $('#kindle').css("background-image", "url('images/paperwhite.png')");
            cropwidth = 758;
            cropheight = 1024;
            $('#device').text("Paperwhite");
            currentdevice = "paperwhite";
        }
        else if (currentdevice == "paperwhite") {
            // Переключаем на Touch (600×800)
            $('#kindle').css("background-image", "url('images/touch.png')");
            cropwidth = 600;
            cropheight = 800;
            $('#device').text("Touch");
            currentdevice = "touch";
        }
        else {
            // Возвращаемся к Kindle 11 (1072×1448)
            $('#kindle').css("background-image", "url('images/kindle-11.png')");
            cropwidth = 1072;
            cropheight = 1448;
            $('#device').text("Kindle 11");
            currentdevice = "kindle11";
        }
    });

    // Остальные функции без изменений
    function grayScale(context, canvas) {
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imgData.data;
        for (var i = 0, n = pixels.length; i < n; i += 4) {
            var grayscale = pixels[i] * 0.3 + pixels[i+1] * 0.59 + pixels[i+2] * 0.11;
            pixels[i] = grayscale;   // red
            pixels[i+1] = grayscale; // green
            pixels[i+2] = grayscale; // blue
        }
        context.putImageData(imgData, 0, 0);
    };

    function cropImage() {
        $('.cropimage').each(function () {
            var image = $(this),
                results = image.next('.results'),
                x = $('.cropX', results),
                y = $('.cropY', results),
                w = $('.cropW', results),
                h = $('.cropH', results),
                download = results.next('.download').find('a');

            image.cropbox({
                width: cropwidth,
                height: cropheight,
                showControls: 'auto'
            }).on('cropbox', function(event, results, img) {
                x.text(results.cropX);
                y.text(results.cropY);
                w.text(results.cropW);
                h.text(results.cropH);
                download.attr('href', img.getDataURL());
            });
        });
    };

    function handleImage(e) {
        $(".cropFrame").remove();
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                grayScale(ctx, canvas);
                
                var domImg = new Image();
                domImg.className = "cropimage";
                domImg.setAttribute("cropwidth", cropwidth);
                domImg.setAttribute("cropheight", cropheight);
                domImg.src = canvas.toDataURL();
                
                $('#kindle').prepend(domImg);
                cropImage();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});