'use strict';

// Load longslider (multiple sliders possible)
const myLongSlider = longslider('slider', {loaderId: 'slider-loader'});

// Animate loader
(function(){
  const loader = document.querySelector('._ls__loader');
  const text = document.querySelector('._ls__loader div span');

  setTimeout(function () {
    text.innerHTML = text.innerHTML.replace(/.$/,",")
    loader.classList.add('active');
  }, 1000);
})()
