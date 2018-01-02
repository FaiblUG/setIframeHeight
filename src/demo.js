document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
  if(e.target && e.target.nodeName == "P") {
    e.target.classList.toggle('shrinked');
  }
});