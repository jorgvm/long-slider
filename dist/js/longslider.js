'use strict';

/*
  Welcome to the LongSlider®©™ plugin: helping you with your long slidey needs since 1997

  To use the LongSlider®©™ plugin, please follow these instructions:

  1) Include this .js file and the longslide.scss file in your project

  2) Create a wrapper element, and assign an image, like so:
        <div class="_ls" data-ls-image="dist/images/background.jpg">

  3) Inside this wrapper element, put all your slides and define a position, like so:
        <div class="slide align-top active" data-ls-position="0">

  4) Great success!

  5) Optionally, you can add a "loading" elements, like so:
      <div class="_ls__loader">

  Enjoy your LongSlider®©™ plugin!
*/
function longslider(id, {
  loaderId = null,
  transitionSpeed = 500,
  loaderMinimum = 2500
} = {}) {
  // References
  const wrapper = document.getElementById(id)
  const loader = !!loaderId && document.getElementById(loaderId);
  const slides = wrapper.querySelectorAll('.slide');
  let busy = false;
  let image;
  let nav_prev;
  let nav_next;
  let currentSlideNr = 0;

  // Delay helper function
  let delay = ms => new Promise((resolve, reject)=>setTimeout(resolve, ms))

  // Load longslider
  // Load the image, wait at least for certain time, then show slider
  Promise.all([loadImage(), delay(loaderMinimum)]).then(() => {
    wrapper.classList.add('active');
    loader.classList.add('inactive');

    // After a delay, clean up, remove loader code
    delay(transitionSpeed).then(() => {
      loader.remove();
    });
  });

  // Create elements
  createPagination();
  createNavigation();

  // Load main image
  function loadImage(){
    let img = new Image();
    img.classList.add('_ls__image');
    img.alt = ' ';

    return new Promise((resolve, reject) => {
      img.onload = function() {
        wrapper.prepend(this);
        image = wrapper.firstChild;
        resolve();
      }

      img.src = wrapper.dataset.lsImage;
    });
  }

  // Navigation
  function nextSlide() {
    if(slides.length - 1 === currentSlideNr) navChange(0)
    else navChange(currentSlideNr + 1);
  }

  function prevSlide() {
    if(currentSlideNr === 0) navChange(slides.length - 1)
    else navChange(currentSlideNr - 1);
  }

  // Change to certain slide
  function navChange(pos) {
    // Prevent double clicks
    if(busy || currentSlideNr === pos) return false;
    busy = true;

    currentSlideNr = pos;
    const newSlide = slides[pos];

    slides.forEach(slide => {           // Remove active
      slide.classList.remove('active');
    });

    delay(transitionSpeed)              // Wait for slide animation
    .then((resolve,reject) => {         // Animate image
      updateNavigation(pos);
      updatePagination(pos);
      animate(newSlide);
    })
    .then(() => delay(transitionSpeed)) // Wait
    .then(() => {                       // Set new slide active
      busy = false;
      newSlide.classList.add('active');
    });
  }

  // Animate the main image
  function animate(slide){
    if(slide && slide.dataset) {
      image.style.transform = `translateX(-${slide.dataset.lsPosition}%)`;
    }
  }

  // Create pagination elements
  function createPagination(){
    // Create list
    let list = document.createElement('ul');
    list.classList.add('_ls__pagination');

    // Create items
    slides.forEach((slide,index) => {
      let i = document.createElement('li');
      let content = document.createTextNode(index);
      i.appendChild(content);
      i.addEventListener('click', () => navChange(index));
      list.appendChild(i);
    });

    // pagination text (x out of x slides)
    const paginationText = document.createElement('div');
    paginationText.classList.add('_ls__pagination-text');
    paginationText.innerHTML = `Step <span>x</span> out of <span>${slides.length - 2}</span> on the path to digital enlightment`;

    // wrap
    const paginationWrap = document.createElement('div');
    paginationWrap.classList.add('_ls__pagination-wrap');

    // Set pagination
    paginationWrap.appendChild(list);
    paginationWrap.appendChild(paginationText);
    wrapper.appendChild(paginationWrap);
  }

  // Update pagination
  function updatePagination(pos){
    // Update active slide number
    wrapper.querySelectorAll('._ls__pagination li').forEach((item,index) => {
      if(index === pos) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update pagination text
    const textNode = wrapper.querySelector('._ls__pagination-text');

    if (pos === 0 || pos === slides.length - 1) {
      textNode.classList.remove('active');
    } else {
      textNode.querySelector('span:first-child').innerHTML = pos;
      textNode.classList.add('active');
    }
  }

  // Update navigation buttons (wether shown or not)
  function updateNavigation(pos){
    if(pos === 0) {
      nav_prev.classList.remove('active');
      nav_next.classList.add('active');
    } else if(pos === slides.length - 1){
      nav_prev.classList.add('active');
      nav_next.classList.remove('active');
    } else {
      nav_prev.classList.add('active');
      nav_next.classList.add('active');
    }
  }

  // Create navigation elements
  function createNavigation() {
    ['next', 'prev'].forEach(type => {
      // Create elements, add proper classes
      let item = document.createElement('div');
      item.appendChild(document.createTextNode(type === 'next' ? '>' : '<'));
      item.classList.add(`_ls__${type}`);

      // Next button gets active status
      if(type === 'next') item.classList.add('active');

      // Set listener events
      item.addEventListener('click', type === 'next' ? nextSlide : prevSlide);
      wrapper.appendChild(item);

      // Set references
      if(type === 'next') nav_next = wrapper.lastChild;
      else nav_prev = wrapper.lastChild;
    });
  }

  return {
    navChange,
    nextSlide,
    prevSlide,
  }
}
