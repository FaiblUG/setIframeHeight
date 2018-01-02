'use strict';

document.getElementsByTagName('body')[0].addEventListener('click', function (e) {
  if (e.target && e.target.nodeName == "P") {
    e.target.classList.toggle('shrinked');
  }
});