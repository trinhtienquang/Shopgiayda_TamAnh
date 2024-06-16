//sticky navbar
$(document).ready(function () {
  var header = $('.midle_header');
  var threshold = 100;

  function handleScroll() {
    var scrollPosition = $(window).scrollTop();

    if (scrollPosition > threshold) {
      header.addClass('fix_menu');
    } else {
      header.removeClass('fix_menu');
    }
  }

  $(window).scroll(handleScroll);
});
