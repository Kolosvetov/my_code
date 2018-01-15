import $ from 'jquery';

$(document).ready(function() {
    /*--------------------------------------------------кнопка Наверх----------------------------------------*/
    $(window).scroll(function () {
        // Если отступ сверху больше 50px то показываем кнопку "Наверх"
        if ($(this).scrollTop() > 50) {
            $('.b-btn-up').fadeIn();
        } else {
            $('.b-btn-up').fadeOut();
        }
    });
    
    /** При нажатии на кнопку мы перемещаемся к началу страницы */
    $('.b-btn-up').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
});
