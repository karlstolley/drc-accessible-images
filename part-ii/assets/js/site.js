(function($) {
  $('html').removeClass('no-js').addClass('js');
  /* Add logger for showPicSrc below & keep HTML cleaner */
  $('#garden-photo').prepend('<pre id="logger"></pre>');
})(shoestring);

/* cribbed from http://cloudfour.com/examples/img-currentsrc/ */
(function() {
  var currentSrc, oldSrc, imgEl;
  var showPicSrc = function() {
    oldSrc     = currentSrc;
    imgEl      = document.getElementById('hank-photo');
    currentSrc = imgEl.currentSrc || imgEl.src;

    if (typeof oldSrc === 'undefined' || oldSrc !== currentSrc) {
      document.getElementById('logger').innerHTML = currentSrc.split('img/')[1];
    }
  };

  // You may wish to debounce resize if you have performance concerns
  window.addEventListener('resize', showPicSrc);
  window.addEventListener('load', showPicSrc);
})(window);
