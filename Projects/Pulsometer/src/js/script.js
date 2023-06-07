$(document).ready(function () {

  let funcDone = true;
  let mql = window.matchMedia('(max-width: 575.98px)');

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
      $('.catalog-item__list_active').removeClass('catalog-item__list_active');
      $('.catalog-item__content').addClass('catalog-item__content_active');
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

  $(document).mouseup(function (e) { 
    const over = $('.overlay');
    const div = $("#consultation, #order, #thanks"); 

    if (!div.is(e.target) 
      && div.has(e.target).length === 0) { 
      div.fadeOut("slow"); 
      over.fadeOut("slow");
      clearForm();
    }
    pageUpIfLess1600();
    
  });

  function pageUpIfLess1600() {
    $(window).scroll(function () {

      if ($(this).scrollTop() > 1600 && funcDone && !mql.matches) {
        $('.pageup').fadeIn();
      } else {
        $('.pageup').fadeOut();
      }
    });
  }

  pageUpIfLess1600();

  function escFromModal() {
    $(document).keyup((e) => {
      if (e.keyCode === 27) {
        clearForm();
        $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
      }
      pageUpIfLess1600();
    });
    
  }

  function enterSubmit(sel) {
    const btn_sub = $(sel);

    $(document).keyup((e) => {
      if (e.keyCode === 13) {
        call_submit();
      }
    });
  }

  $('.button_mini').each(function (i) {

    $(this).on('click', function () {
      escFromModal();
      enterSubmit();   /* '.feed-form_mt25 .button_subbmit' */
      $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
      $('.overlay, #order').fadeIn('slow');
      $('.pageup').fadeOut()
      $('.feed-form_mt25 .button_subbmit').focus();
      !funcDone;
    })
  });

  $('[data-modal=consultation]').on('click', function () {
    $('.overlay, #consultation').fadeIn('slow');
    $('.pageup').fadeOut()
    $('.button_subbmit').focus();
    enterSubmit('.button_subbmit');
    escFromModal();
    !funcDone;
  });

  function clearForm() {
    $('form').find("input").val("");
    $('form').find("label").text("");
    $('form').trigger('reset');
    $('form label').removeClass('error');
    $('form input').removeClass('error');
  }

  $('.modal__close').on('click', function () {
    clearForm();
    $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
    $('.pageup').fadeOut();
    pageUpIfLess1600();
  });

  $('.button_mini').each(function (i) {
    $(this).on('click', function () {
      escFromModal();
      enterSubmit($(this).eq(i));
      $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
      $('.overlay, #order').fadeIn('slow');
      $('.pageup').fadeOut()
      !funcDone;
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

  function call_submit() {
    $('form').submit(function (e) {
      if (!$(this).valid()) {
        return;
      }
      e.preventDefault();
      $.ajax({
        // client-server settings
      }).done(function () {
        $(this).find("input").val("");
        $('#consultation, #order').fadeOut('fast');
        $('.overlay, #thanks').fadeIn('fast');
        $('form').trigger('reset');
      });
      return false;
    });
  }
  call_submit();

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