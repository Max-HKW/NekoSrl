// SHOW MENU

const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show-menu');
  });
}

const navLinks = document.querySelectorAll('.nav__link');

const linkAction = () => {
  navMenu.classList.remove('show-menu');
};

navLinks.forEach(link => {
    link.addEventListener('click', linkAction);
});


// CARDS ANIMATION

const cards = document.querySelectorAll('.card');

function rotateCards() {
  let angle = 0;
  cards.forEach((card, index) => {
    card.style.transform = `rotate(${angle}deg)`;
    angle -= 10;

    card.style.zIndex = cards.length -index;
  });
}

rotateCards();