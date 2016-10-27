jQuery('body').on('click', 'p', function(e) {
  $(e.currentTarget).toggleClass('shrinked');
});