$(document).ready(function () {
  $('.carousel__inner').slick({
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1200,
    prevArrow: '<button type="button" class="slick-prev"><img src="assets/icons/left.svg"></button>',
    nextArrow: '<button type="button" class="slick-next"><img src="assets/icons/right.svg"></button>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: true,
          arrows: false
        }

      }
    ]
  });

  $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function () {
    $(this)
      .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
      .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
  });

  function toggleSlide(item) {
    $(item).each(function (i) {
      $(this).on('click', function (e) {
        e.preventDefault();
        $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
        $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
      })
    })
  }

  toggleSlide('.catalog-item__link');
  toggleSlide('.catalog-item__back');

  // Modal

  $('.pageup').fadeOut()

var bool = true;
function pageUpIfLess1600(flag) {
  $(window).scroll(function () {
    console.log(flag);
    if ($(this).scrollTop() > 1600 & flag == true) {
      $('.pageup').fadeIn();
    } else {
      $('.pageup').fadeOut();
    }

  });
}

pageUpIfLess1600(bool);

  $('[data-modal=consultation]').on('click', function () {
    $('.overlay, #consultation').fadeIn('slow');
    // $('.pageup').fadeOut();
    $('.pageup').fadeOut()
    bool = false;
    pageUpIfLess1600(bool);

  });

  $('.modal__close').on('click', function () {
    $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
    $('.pageup').fadeOut()
    bool = false;
    pageUpIfLess1600(bool);
  });

  $('.button_mini').each(function (i) {
    $(this).on('click', function () {
      $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
      $('.overlay, #order').fadeIn('slow');
      $('.pageup').fadeOut()
      bool = false;
    })
  });
  

  function validation_form(form) {
    $(form).validate({
      rules: {
        name: {
          required: true,
          minlength: 2
        },
        email: {
          required: true,
          email: true
        },
        phone: {
          required: true
        }
      },

      messages: {
        name: {
          required: "Please enter your name",
          minlength: jQuery.validator.format("At least {0} characters required!")
        },

        phone: {
          required: "Please enter your phone",
        },
        email: {
          required: "We need your email to contact you",
          email: "Your email address must be in the format of name@domain.com"
        }
      }
    });
  }

  validation_form('#consultation-form');
  validation_form('#consultation form');
  validation_form('#order form');

  $('input[name=phone]').mask("+999 (99) 999-99-99");

  $('form').submit(function (e) {
    if (!$(this).valid()) {
      return;
    }
    e.preventDefault();
    $.ajax({
      // client-server settings
    }).done(function () {
      // after information is send we clear inputs and value
      $(this).find("input").val("");
      $('#consultation, #order').fadeOut();
      $('.overlay, #thanks').fadeIn('slow');
      $('form').trigger('reset');
    });
    return false;
  });

  // Smooth scroll up

  $(".pageup").on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      const hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {

        window.location.hash = hash;
      });
    }
  });

  new WOW().init();

});