// SHOW MENU

const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });
}

const navLinks = document.querySelectorAll(".nav__link");

const linkAction = () => {
  navMenu.classList.remove("show-menu");
};

navLinks.forEach((link) => {
  link.addEventListener("click", linkAction);
});

// CARDS ANIMATION

// const cardsContainer = document.querySelector('.about__cards-container');
// const cards = document.querySelectorAll('.card');

// function rotateCards() {
//   let angle = 0;
//   cards.forEach((card, index) => {
//     if (card.classList.contains('away')) {
//       card.style.transform = `translateY(-120vh) rotate(-48deg)`;
//     } else {
//       card.style.transform = `rotate(${angle}deg)`;
//       angle -= 10;

//       card.style.zIndex = cards.length - index;
//     }
//   });
// }

// rotateCards();

// window.addEventListener('scroll', () => {
//   let distance = window.innerHeight * 0.5;

//   let topVal = cardsContainer.getBoundingClientRect().top;

//   let index = -1 * (topVal / distance + 1);

//   index = Math.floor(index);

//   for (let i = 0; i < cards.length; i++) {
//     if (i <= index) {
//       cards[i].classList.add('away');
//     } else {
//       cards[i].classList.remove('away');
//     }
//   }

//   rotateCards();
// });

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.about__card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%", 
        toggleActions: "play none none reverse"
      }
    });
  });