// SHOW MENU

const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  nav = document.querySelector('.nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show-menu');
    nav.classList.toggle('nav__open');
  });
}

const navLinks = document.querySelectorAll('.nav__link');

const linkAction = () => {
  navMenu.classList.remove('show-menu');
};

navLinks.forEach(link => {
  link.addEventListener('click', linkAction);
});

// CHANGE HEADER BACKGROUND-COLOR

const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(
  entries => {
    let delay = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Imposta un delay crescente per ogni card
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('animate');
        delay += 0.2; // aumenta il delay per la prossima card
      } else {
        entry.target.classList.remove('animate');
        entry.target.style.transitionDelay = '0s';
      }
    });
  },
  {
    threshold: 0.1,
  }
);

cards.forEach(card => observer.observe(card));


// FORM

const circles = document.querySelectorAll('.feature__circle'),
      progressBar = document.querySelector('.feature__indicator'),
      buttons = document.querySelectorAll('.feature__buttons button');


let currentStep = 1;

const updateStep = e => {
  currentStep = e.target.id === 'next' ? ++currentStep : --currentStep;

  circles.forEach((circle, index) => {
    circle.classList[`${index < currentStep ? 'add' : 'remove'}`]('active');
  })

  progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;

  if (currentStep === circles.length) {
    buttons[1].disabled = true;
  } else if (currentStep === 1) {
    buttons[0].disabled = true;
  } else {
    buttons.forEach(button => button.disabled = false);
  }
}

buttons.forEach(button => {
  button.addEventListener('click', updateStep);
})