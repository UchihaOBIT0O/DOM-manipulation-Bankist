'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(f => f.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//smooth scrolls
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  console.log(e.target.getBoundingClientRect());
  console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height and width of viewport',

    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////////////////////////////////////////////////
//page navigation
// document.querySelectorAll('.nav__link').forEach(f => {
//   f.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//event delegation
//add the eventListener to common parent element
//and determine what element is originated
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  //lookup if the target has a className that we are interested
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (f) {
  f.preventDefault();
  const clicked = f.target.closest('.operations__tab');
  //guard clause it will return early if some condition is matched
  if (!clicked) return;

  //remove the classes
  tabs.forEach(f => f.classList.remove('operations__tab--active'));
  tabsContent.forEach(f => f.classList.remove('operations__content--active'));

  //add the classes
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
//refactoring the menufade
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(f => {
      if (f !== link) f.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', e => handleHover(e, 0.5));
nav.addEventListener('mouseout', e => handleHover(e, 1));

//sticy navigation
const section1ID = document.getElementById('section--1');
const initialCords = section1ID.getBoundingClientRect();
// console.log(initialCords);

// window.addEventListener('scroll', function (e) {
//   e.preventDefault();
//   window.scrollY > initialCords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });
/////////////////////////////////////////////////////////////////////////////////
//sticky navigation using the Intersection Observer Api
//this api allow our code to obeserve the changes to the way that the certain target interset another element or
//the view port

//syntax :- new IntersectionObserver(callback,object of options);

/** 
root is the element that the target element will interset with any by default it is set to null means the viewport of the browser,
threshold is a value in which the observer executes the callback whenever the intersection ratio reaches the threshold value it goes from 0 to 1
callback when ever the intersection ratio reaches threshold the callback is executed  and the callback gets one parameter 'entries'
the entries is a object in which the information about the intersection is stored the most useful values from the entries are the isIntersecting, and intersectionRatio.

a commmon entry look like this below

IntersectionObserverEntry {time: 58.5, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: true, …}
boundingClientRect: DOMRectReadOnly {x: 0, y: 221.8125, width: 1730, height: 1860.0625, top: 221.8125, …}
intersectionRatio: 0.32599449157714844
intersectionRect: DOMRectReadOnly {x: 0, y: 221.8125, width: 1730, height: 606.375, top: 221.8125, …}
isIntersecting: true
isVisible: false
rootBounds: DOMRectReadOnly {x: 0, y: 0, width: 1730, height: 828.1875, top: 0, …}
target: section#section--1.section
time: 58.5
[[Prototype]]: IntersectionObserverEntry
*/
// const obsCallback = function (entries, Observer) {
//   entries.forEach(f => console.log(f));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.1],
// };
// const Observer = new IntersectionObserver(obsCallback, obsOptions);
// Observer.observe(section1ID);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  entry.isIntersecting === false
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.1,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);
/** working
 * so in our case we are observing the header and our threshold is 0.1 or 10% so and the root set to default
 * means it is the viewport,
 *
 * The callback is triggered when the threshold os reached in our case when there is 10% of the header in the
 * viewport the callback is triggered
 * the callback is triggered two times when there is 10% of the header in viewport the isIntersecting=true
 * and when we scroll back and made the header more than 10% in the viewport the isIntersecting=false
 *
 * in our callback fucntion we specified when ever isIntersecting is false we add the 'sticky'
 * and remove the 'sticky' whenever the isIntersecting is true
 *
 * so if we scroll past and only a 10% of the header in the viewport the nav will become stiky and when you
 * scroll back and there is more than 10% of the header in the viewport the nav will not be sticky
 */
//////////////////////////////////////////////////////////////////////////////////////////////////////
//adding the effect of revealing section using the Intersection Observer API

const allSections = Array.from(document.querySelectorAll('.section'));

const optionsRevealing = {
  root: null,
  threshold: 0.15,
};
const relvealingFnc = function (entries) {
  const [entry] = entries;
  //this below statement is a gaurd clause if it is true then the execution stops at that line itself
  //else the execution moves to the next line
  if (!entry.isIntersecting) return;
  //so if the entry.isIntersecting is true the below lines will execute
  entry.target.classList.remove('section--hidden');
  //the unboserve will remove observer on the target after the condition is true
  revealingObserver.unobserve(entry.target);
};

const revealingObserver = new IntersectionObserver(
  relvealingFnc,
  optionsRevealing
);

allSections.forEach(function (f) {
  revealingObserver.observe(f);
  // f.classList.add('section--hidden');
});
//////////////////////////////////////////////////////////////////////////////
//lazy loading in the Javascript
const imageTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace the src with data-src
  entry.target.src = entry.target.dataset.src;
  //the above code is responsible for replacing the src attribute value with the value in the data-src
  //this happens behind the scene and when this completes the javascript ommits a 'load' event and it is
  //as same as every other event so we can listen to the 'load' event

  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTarget.forEach(f => lazyObserver.observe(f));
/////////////////////////////////////////////////////////////////////////////////
const slider = function () {
  //slider component
  const allSliders = document.querySelectorAll('.slide');

  const [btnLeft, btnRight] = document.querySelectorAll('.slider__btn');

  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlides = allSliders.length;

  //move to the slide
  const gotoSlide = s => {
    allSliders.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - s)}%)`;
    });
  };
  // gotoSlide(0);
  /**
   * working
   * for the first we set the currentSlide to 0 and when ever the btnRight is clicked the currentSlide will be
   * incremented by one value inside the event listener of the btnRight we are looping over the slides and
   * subracting the currentSlide value with the index of the loop
   *
   * events
   * for in the first when the button is clicked the forEach is triggered and at the first itereation the
   * currentSlide will be 1 and the index will be 0 so 0-1 = -1 and we are multiplying it with 100 so
   * it becomes -100 and we are storing it to the translateX so the slide with 0 index gets the translateX set to
   * -100
   * and in the next iteration the index will be 1 and index - currentSlide will be 1-1 = 0 and the translateX
   * set to 100 * 0  means translateX(0);
   * and in the next iteration the index will be 2 and index - currentSlide will be  2-1= 1 and the translateX is
   * set to 1* 100 that is translateX(100%);
   *
   *
   * so initially the translateX() will be 0%,100%,200%
   * and for every btnRight click the forEach will be triggered and all the above events
   * and for the firstClick  the translateX() will become  -100%,0%,100%
   * and for the secondClick the translateX() wil become  -200%,-100%,0%
   * and for the thirdClick means when we are at the last slide the according to the condtions
   * if the slide is the lastSlide the currentSlide will be set to the 0 and the translateX() will be back to
   * 0%,100%,200%
   */
  //create the dots in the bottom
  const createDots = function () {
    allSliders.forEach((_, index) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };
  // createDots();

  //activate the fot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(f => f.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // activateDot(0);

  //moving forward
  const nextSlide = () => {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };
  /**
   * nextSlide(); working
   * initially we set the currentSlide to 0 so the translateX() will be 0%,100%,200%
   * the nextSlide checks if the current slide is the lastSlide if yes then it will reassign the currentSlide=0
   * which make that if you using button and moving forward and you're at the end so with this condition it make
   * you go back to the first slide from the last slide sort of a rotation manner
   *
   * if the currentSlide is not the lastSlide it will increment the current slide by 1 value
   * so if you are at 2nd slide and you click the button because it is not the last slide the curentSlide is
   * incremented and because this currentSlide is used as the parameter of gotoSlide which will then makes the
   * slide move forward now you're viewing the nextSlide this makes the fucntionality of the slides
   */

  //moving backward
  const prevSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };
  /**
   * prevSlide() working
   * this is left button click function when you click the button. it checks that if you're at the first slide
   * that is the index'0' slide if yes then it will make the currentSlide = maxSlides - 1; means you will be
   * moved to the last slide sort of a rotation manner if not
   *
   * it will decrement the currentSlide by 1 value means when you're at the slide 2 and you clicked the button
   * it will decrement the currentSlide then this currentSlide is used as the parameter to the gotoSlide
   * which make you go backward in the slides that means to the left
   */

  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //adding events
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keypress event when pressed right or left arrow
  document.documentElement.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    //the below works because of the && operator shortcircuiting
    //the shortcircuit will take the two condition and if the first one returns a falsy value it will return
    //other wise the second condition is also checked
    //in out case if we clicked the ArrowRight the firstCondtion will beocme true so the nextSLide() will execute
    //on other case if we are not clicking the Arrowright the firstCondition becomes false means falsy value
    //so the execution will not move forward for the nextstatement so the nextSlide will not be executed
    e.key === 'ArrowRight' && nextSlide();
  });

  //gotoSlide with the dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////////////////////////////////////////
/** 
//how to select,create and delete elements in javascript

//selecting the elements
//selecting document
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const theHeader = document.querySelector('.header');

console.log(document.querySelectorAll('.section'));

//all the above methods is also avaliable not only on document but also on element
console.log(document.getElementById('section--1'));

//getElementsbyTagName
//it returns HTMLCOlLECTION WITH ALL THE ELEMENTS IN THE HTML
console.log(document.getElementsByTagName('button'));

//it return a htmlcollection which is different from the nodelist
//html collection is a live collection so if the dom the changes this collection automatically gets updated

//but the same does not happen with the nodelist
//so even if you delete a element the nodelist will not update itself

//getElementsByClassName
//this will also return a live htmlcollection
console.log(document.getElementsByClassName('btn'));

///////////////////////////////////////////////////////////////
//creating the html elements ,inserting  and deleting html elements

//1
//createElement('Tagname');
//it will create a element and stores in the variable and the varible will be a DOM element
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'we use cookies for improved functionality and analytics, <button class="btn btn--close--cookie">Got it!</button>';

//INSERT ELEMENTS
const ht = '<button class="shit">THIS IS SHIT</button>';
message.insertAdjacentHTML('afterbegin', ht);

//prepend()
//syntax :- element.prepend(tag);   it adds the tag as the elements first child
// theHeader.prepend(message);
//append()
//synatax :- element.append(tag); it adds the tag as the elements last child
theHeader.append(message);

//here we added the same tag  'message' in the dom twice using prepend() and append() but it will be added to the DOM only once
//because when we added the element with prepend() the 'message' becomes a live element and cannot be at two places at same it  so
//when we try to add the same element with append() it will move from the firstChild of the theHeader to the lastChild
//And a DOM element is unique so it can be only exist at one place

// //what if we want multiple copies of the element
// //we use cloneNode();    syntax:- tag.cloneNode(true);  true will make sure all the child elements within the tag is also copied
// theHeader.append(message.cloneNode(true));

// //before();     syntax:- element.before(tag);  adds the tag before the element
// theHeader.before(message.cloneNode(true));
// //after();   syntax:- element.before(tag);  adds the element after the element
// theHeader.after(message.cloneNode(true));

//DELETE ELEMENT
//remove();   it will only remove the whole elment from the DOM
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', () => message.remove());
//removeChild(); syntax:- tag.removeChild(childName);
//it will remove the selected child from the element
// theHeader.removeChild(message);
////////////////////////////////////////////////////////////////////////////////////
//styles, attributes and classes

//styles
//all these styles are set as inline styles they are set directly on DOM elements
//setting styles
message.style.backgroundColor = 'darkblue';
message.style.width = '120%';

//reading styles
//here we can only read styles that we are set manually
console.log(message.style.width);

//to get every style of the element like inline, external, internal USING THE getComputerStyle()
//syntax getComputedStyle(Element).style;
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  parseInt(getComputedStyle(message).height, 10) + 40 + 'px';

// console.log(getComputedStyle(message).height);

//working with css custom properties/variables
//the css custom properties are set in the :root{} so it means we can access them using the document.documentElement
//to change the custome properties on the css properties we need to use the setProperty()
//setProperty('propertyname', value);  this setProperty works with all the styles also
document.documentElement.style.setProperty('--color-primary', 'orangered');

//attributes
const logo = document.querySelector('.nav__logo');
//here with the element here and img it is supposed to have alt,src
//so for the default attributes of any element the javaScript will create this prop's on object
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
//but when we add a custom attribute on the element the javascript will not create the prop for it automatically
//ex:- we created a  designer="arun" attribute in the img tag with '.nav__logo' class name
//but we cannot access it
//console.log(logo.designer); it logs undefined because it is not a predefined attribute and JSP not created its prop object
//but we can read it using the getAttribute();   //syntax :- element.getAttribute('property');
console.log(logo.getAttribute('designer'));

//we can also set the attribute for the predefined attribute
logo.alt = 'Beautiful minalist logo';
//we can also set the attributes for the userdefined attrbutes using the setAttribute();
//syntax :- element.setAttribute('propertyName', 'Value');
logo.setAttribute('company', 'Bankist');

//some times when we try to access the src we using the element.src it gives the releative address of the address
//like this below but we want the abosolute address for the manipulation
console.log(logo.src); //logs http://127.0.0.1:5500/img/logo.png
//but we want the absolute address for the manupulation of the attribute to get the absolute we need to always use the
//getAttribute() method  only
console.log(logo.getAttribute('src')); //logs img/logo.png
//we need to do the same with <a> tag where we need to get the 'href' attribute
const link = document.querySelector('.nav__link--btn');
console.log(link.href); //logs :- http://127.0.0.1:5500/index.html#
console.log(link.getAttribute('href')); //logs :- #

//Data Attributes
//it is set with the data-anything for example we set data-version-number:'3.0';
//they start with data ex:- data-whatever we want ex:- data-version-numberv
console.log(logo.dataset.versionNumber);

//classes methods
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// /////////////////////////////////////////////////////////////////////////
// //Smooth Scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.getElementById('section--1');
// btnScrollTo.addEventListener('click', e => {
//   //to implement the smooth scrolling we need to get the co-ordinates of the element we are scrolling to
//   const s1coords = section1.getBoundingClientRect();
//   console.log(e.target.getBoundingClientRect()); //log
//   // DOMRect {
//   //this DOMRect is relative to the visible viewport
//   //   "x": 376.5,  //it's the distance between the browser border and element in X-Axis(Horizontally)
//   //    the x,y will change when scrolling mainly y
//   //   "y": 612.078125,//it's the distance between the browserborder and element in Y-Axis(vertically)
//   //   "width": 110,  //width of the element
//   //   "height": 29,  //height of the element
//   //   "top": 612.078125,//space between the top of element and the border of browser and it will not change whenscrolling
//   //   "right": 486.5,//space between the right side of element and the border of browser
//   //   "bottom": 641.078125,//space between the bottom of the element and the border of browser
//   //   "left": 376.5 //space between the left of the element and the border of browser
//   // }

//   //getting the current scroll position
//   console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//   //height and width of the current viewport
//   console.log(
//     'height and width of viewport',
//     //to get the height and width of the view port
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   //scrolling to the element
//   // window.scrollTo(
//   //   {
//   //     left: s1coords.left + s1coords.pageXOffset,
//   //     //how this works is that
//   //     //s1cords.left represent the space between left border of browser and element but when implementing scrolling
//   //     //left is not useful
//   //     top: s1coords.top + window.pageYOffset,
//   //     behavior: 'smooth',
//   //   }
//   //   //the main is the s1cords.top it is the space between the top border of browser and the element
//   //   //the window.pageYoffset represents how much you scrolled in pixels
//   //   //so if you want to implement the scroll from a button in the section-0 to section-1
//   //   //after the button clicked it will jump off to the section-1 when you you are exactly in the full height and
//   //   //width of the section but when you scrolled half in the section-0 and then you want to implement you need to
//   //   //add the section.top to the window.pageoffsetY it bascially takes the space between the section-1 top and
//   //   //add it with the area you scrolled in the page from it's initial state so everytime
//   //   //even if you scrolled some distance vertically from the webpage's initial stage it will takes the present top
//   //   //and add it to the amount of area you scrolled to get to the section-1 everytime perfectlly
//   // );
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

////////////////////////////////////////////////////////////////////////////////////
//types of events and eventhandlers

//event is a signal generated by a DOM node ex:- mouse moving, clicking, user triggering the full screen mode
//and we can listen to the events using eventListener and we can handle them

//it doesnot matter if we listen to event or not it will happen either way when a user clicks

const h1 = document.querySelector('h1');
//similar to the hover in the css
// h1.addEventListener('mouseenter', ()=>{alert('You are hovering over the H1')});
function alertH1(e) {
  e.preventDefault();
  alert('you are reading the heading :D');
  // //removing the event handler
  // h1.removeEventListener('mouseenter', alertH1);
}

//adding eventlistener in other way
//this is the old way of listening the events
// h1.onmouseenter = e => {
//   alert('WE are onmouse');
// };

//removing the eventListener
//removing the eventListener after sometime
h1.addEventListener('mouseenter', alertH1);

//this will remove the eventListener after 3 seconds has passed
setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

/////////////////////////////////////////////////////////////////////////////////////
//event propogation capturing and bubbling
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget); //whene the click happened

  //stop event bubbling
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

//the true here specifies that the .nav will listen to the events in the target phase so the event will first
//happen in the .nav even thought the target is the .nav__link this is also called capturing event so
//what it means is that the event's will pass through all the target's parents in that case if any parent opt
//for the event handling at the capturing phase this is what happens so eventhought the child is target the
//parent will first handle the event and then pass down to the child to hapen the target event
//example:-
//any event will first start at the root that is document and passdown to the target
//so below we are handling the event in the capturing phase at the document element
//so when we event happened at the original target this below handler is triggered first and then it is passed
//down to the target eventually through all its parents
document.documentElement.addEventListener(
  'click',
  function (e) {
    console.log('happened');
  },
  true
);



//////////////////////////////////////////////////////////////////////////////////
//DOM TRAVERSING
//selecting a element based on another element like immediate child of a element or a parent element

const h1 = document.querySelector('h1');

//Going downwards
//selecting the child elements
console.log(h1.querySelectorAll('.highlight'));
//this will select all the children of h1 with the class of '.highlight' no matter how deep the elements are
//inside of these h1 this will only select the childs of h1 and not all the elements with '.highlight' class

//this will work for only direct children and this will return a htmlcollection with elements
//logs:-  HTMLCollection(3) [span.highlight, br, span.highlight]
console.log(h1.children);

//firstElementChild will be the very first children of the element in our case it is the span.highlight
h1.firstElementChild.style.color = 'white';

//lastElementChild will be the last children of the element in our case it is again span.highlight
h1.lastElementChild.style.color = 'orangered';

///Going upwards
//selecting the parents

//will return the immediate parent of the element
console.log(h1.parentElement);

//closet() will select a parent that is not immediate parent and it will find the parent no matter where is the
//parent is located
h1.closest('.header').style.background = 'var(--gradient-secondary)';
//this will select the closed '.header' to our h1
//and when you call the same element type with the closest then closest will be itself
h1.closest('h1').style.background = 'var(--gradient-primary)';
//here we are seleting the closest h1 to our h1 then obviously it will be our h1 itself

//Going sideways
//selecting the sibling's

//in javascript we can only access the direct siblings that is the previous and next sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

//selecting the direct parent's children
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(f => {
//   if (f !== h1) f.style.transform = 'scale(0.5)';
// });
\
*/

//////////////////////////////////////////////////////////////////////////////////////////
//lifecycle of the DOM
//lifecycle means right from the movement the page is accessed and until the user leaves

/** 
//DOMcontentLoaded
it is a event and it is triggered  by the document as soon as the html is parsed which means html is downloaded and converted to the dom tree and all the scripts should be downloaded and executed before the 
DOMcontentLoaded event happen 
*/

document.addEventListener('DOMContentLoaded', e => {
  console.log('HTML parsed and DOM tree built', e);
});

//load
//it is fired by the window as soon as all the images,external resourses like script and external css is loaded
//so it is fired when the page is completely loaded
window.addEventListener('load', function (r) {
  console.log('Page fully loaded', r);
});
//beforeunload
//it is also fired by the window this is created immediately before a user is about to leave the page
//means before cliking the close browser tab
//this is used to create a prompt where it asks to if they are 100% sure to leave the page

// window.addEventListener('beforeunload', function (e) {
//   console.log(e);
//   e.returnValue = '';
// });
// console.log('shit');

////ways of loading the javascript files in the html

//in the html we can write the script tag in the body or in the head the way of definition in body,head will have different behaviours
/**
 * TRADITIONAL WAY
 * <script stc="script.js"></script>

 * SCRIPT TAG IN THE HEAD
 * when we include the script in the head traditionally
 * at first the browser will receive the html and start parsing the html and when it find the script tag in the head
 * it will stop parsing the html and start fetching and executing the script and then after the script is fetched and executed the remaining html will be parsed and after that the DOMcontentLoaded event will be triggered
 * but this is not a ideal situation because the browser will be in the idle state until it finished executing the script so we donot want to include the traditional script in the head instead we use it in the body
 *
 * SCRIPT TAG IN THE BODY
 * when we include the script tag at the end of the body what happen is that the browser will receive the html and start parsing it as we included the script at the end of the body means after all the html elements
 * so the html will be parsed first then browser will find the script it will fetch the script and execute it and fire the DOMcontentLoaded event  this is also not very good because we can downlaad the script while parsing the 
 * html and execute the script after the html is parsed that is where the ASYNC will comes in
 * 
 * ASYNC WAY
 * <script async src="script.js"></script>
 * 
 * SCRIPT TAG IN THE HEAD WITH ASYNC ATTRIBUTE
 * when we include the script in the head with the 'async' attribute in the script tag what happens is the scirpt is feteched along with the html parsing and then when the script tag is discovered by the browser the parsing of the 
 * html stops and the fetched script is executed and then the remaining html is parsed and the DOMcontentLoaded event is fired in this case the browser will load the script along with the htmlparsing but still the browser will stop 
 * parsing until the fetched script is executed but this is better than any traditional way because the loading time is shorter 
 * 
 * DEFER WAY
 * <script defer src="script.js"></script>
 * 
 * SCRIPT TAG IN THE HEAD WITH DEFER ATTRIBUTE 
 * when we include the script in the head with the 'defer' attribute what happens is the script is fetched along while the html is parsing but the execution of the fetched script only happen after the html is parsed completely then 
 * the fetched script is execute and the DOMcontentLoaded is executed this is better than tradional way of script in the head, and async script in the head because the browser will not stop parsing in the middle for the execution
 * of the fetched script
 * 
 *and the ASYNC AND DEFER IN the body has not practical effect in the body and will not improve any loading time.
 *
 */

/**
 * defer vs async in the head
 *
 * ASYNC
 * when we use the script with the async attribute in the head
 * the DOMcontentLoaded will not wait for the script to execute it is fired as soon as the html is parsed
 * and incase of more than one script's inclusion in the head it is not guaranteed that they will executed in the intended order/declared order
 *
 * DEFER
 * when we use the script in the head with the 'defer' attribute
 * the DOMcontentLoaded only fired after the script is executed but incase of multiple script's those will be executed in the intended order only/declared order
 *
 *
 * CONCLUSON
 * so the usage of script in the head with the 'DEFER' attrbute is the most ideal way of loading a script in the html when you want to include a external library in the files you can inlcude them before you script so you can use
 * the library in your script this works because the excution is done in the intented order
 *
 * and for the third-party libraries that you don't use your script you can use the 'ASYNC'.
 *
 * only modren browser supports the async and defer because this is html5 feature but not the javascript feature
 * so when you want to support the old browser you still need to include the script at the end of the body
 */
