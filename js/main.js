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

// FORM STEP

document.addEventListener('DOMContentLoaded', () => {
  const circles = document.querySelectorAll('.feature__circle'),
    progressBar = document.querySelector('.feature__indicator'),
    buttons = document.querySelectorAll('.feature__buttons button');

  let currentStep = 1;

  const updateStep = e => {
    currentStep = e.target.id === 'next' ? ++currentStep : --currentStep;

    // circles.forEach((circle, index) => {
    //   circle.classList[`${index < currentStep ? 'add' : 'remove'}`]('active');
    // });

    // progressBar.style.width = `${
    //   ((currentStep - 1) / (circles.length - 1)) * 100
    // }%`;

    if (currentStep === circles.length) {
      buttons[1].disabled = true;
    } else if (currentStep === 1) {
      buttons[0].disabled = true;
    } else {
      buttons.forEach(button => (button.disabled = false));
    }
  };

  buttons.forEach(button => {
    button.addEventListener('click', updateStep);
  });

  // WIZARD FORM

  const form = document.getElementById('feature__form'),
    steps = Array.from(document.querySelectorAll('fieldset.step')),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    summaryBox = document.querySelector('.summary'),
    step2Content = document.querySelector('.step2Content'),
    successMessage = document.getElementById('successMessage');

  let currentFormStep = 0;
  let currentType = '';

  const pricesMultipleCourses = {
    '10_individuale_10': 300,
    '10_individuale_100': 750,
    '10_30studenti_10': 500,
    '10_30studenti_100': 1250,
    '50_individuale_10': 800,
    '50_individuale_100': 2000,
    '50_30studenti_10': 1000,
    '50_30studenti_100': 2500,
  };

  function uncheckOtherCheckbox(name, current) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(box => {
      if (box !== current) box.checked = false;
    });
  }

  function validateStep() {
    const formInputs = steps[currentFormStep].querySelectorAll(
      'input[type="checkbox"]'
    );
    nextBtn.disabled = !Array.from(formInputs).some(input => input.checked);
  }

  function showStep(currentStep) {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
      circles[index].classList[`${index <= currentStep ? 'add' : 'remove'}`](
        'active'
      );
    });
    progressBar.style.width = `${(currentStep / (circles.length - 1)) * 100}%`;
    // prevBtn.disabled = currentStep === 0;
    validateStep();
  }

  function createCheckBox(name, value, labelText) {
    const label = document.createElement('label');
    label.className = 'custom-checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = value;

    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';
    label.appendChild(input);
    label.appendChild(checkmark);
    label.appendChild(document.createTextNode(' ' + labelText));

    return label;
  }

  function renderStep2() {
    step2Content.innerHTML = '';

    const type = form.querySelector('input[name="tipo"]:checked')?.value;
    currentType = type;

    if (type === 'singolo') {
      step2Content.appendChild(
        createCheckBox('opzione_singolo', '10_100', '10 anni')
      );
      step2Content.appendChild(
        createCheckBox('opzione_singolo', '10_250', '100 anni')
      );
    } else if (type === 'multipli') {
      step2Content.appendChild(
        createCheckBox('numero_corsi', '10', '10 corsi')
      );
      step2Content.appendChild(
        createCheckBox('numero_corsi', '50', '50 corsi')
      );
    }
  }

  function generateSummary() {
    const data = new FormData(form);
    const type = data.get('tipo');
    let price = 0;
    // let card = document.createElement('div');
    // card.className = 'summary-card';

    // let title = document.createElement('h3');
    // title.className = 'summary-title';
    // title.textContent = 'Riepilogo Configurazione 📋';
    // card.appendChild(title);

    const cardList = document.createElement('ul');
    cardList.className = 'card-list';

    const addItem = (label, value, icon, itemClass) => {
      const listItem = document.createElement('li');
      listItem.className = itemClass;
      listItem.innerHTML = `<i class="ri-${icon}"></i> <strong>${label}:</strong> ${value}`;
      cardList.appendChild(listItem);
    };

    // const listItemType = document.createElement('li');
    // listItemType.className = 'list-summary';
    // listItemType.innerHTML = `<strong>Tipo:</strong> ${type}`;
    // cardList.appendChild(listItemType);

    addItem('Tipo', `${type}`, 'book-shelf-line', 'list-summary');

    if (type === 'singolo') {
      const value = data.get('opzione_singolo');
      if (!value) return;
      const years = value.split('_')[0];
      price = value === '10_100' ? 100 : 250;

      // const listItemDuration = document.createElement('li');
      // listItemDuration.className = 'list-summary';
      // listItemDuration.innerHTML = `<strong>Durata:</strong> ${years} anni`;
      // cardList.appendChild(listItemDuration);

      addItem('Durata', `${years} anni`, 'hourglass-line', 'list-summary');
    }

    if (type === 'multipli') {
      const courses = data.get('numero_corsi');
      const students = data.get('studenti');
      const duration = data.get('durata');
      const key = `${courses}_${students}_${duration}`;
      price = pricesMultipleCourses[key] || 0;

      // const listItemCourses = document.createElement('li');
      // listItemCourses.className = 'list-summary';
      // listItemCourses.innerHTML = `<strong>Corsi:</strong> ${courses}`;
      // cardList.append(listItemCourses);

      addItem('Corsi', `${courses}`, 'book-line', 'list-summary');

      // const listItemStudents = document.createElement('li');
      // listItemStudents.className = 'list-summary';
      // listItemStudents.innerHTML = `<strong>Studenti:</strong> ${
      //   students === 'individuale' ? 'Singolo studente' : '30 studenti'
      // }`;
      // cardList.append(listItemStudents);

      addItem('Strudenti', `${students === 'individuale' ? 'Singolo studente' : '30 studenti'}`, 'team-line', 'list-summary');

      // const listItemDuration = document.createElement('li');
      // listItemDuration.className = 'list-summary';
      // listItemDuration.innerHTML = `<strong>Durata:</strong> ${duration}`;
      // cardList.append(listItemDuration);

      addItem('Durata', `${duration}`, 'hourglass-line', 'list-summary');
    }

    if (type === 'personalizzato') {
    }

    // const listItemPrice = document.createElement('li');
    // listItemPrice.className = 'list-summary';
    // listItemPrice.innerHTML = `<strong>Prezzo totale:</strong> ${price}`;
    // cardList.append(listItemPrice);

    addItem('Prezzo totale', `${price}`, 'money-euro-circle-line', 'list-summary');

    summaryBox.textContent = '';
    summaryBox.appendChild(cardList);
  }

  form.addEventListener('change', e => {
    if (e.target.type === 'checkbox') {
      uncheckOtherCheckbox(e.target.name, e.target);
      if (e.target.name === 'tipo') {
        renderStep2();
      }
    }
    validateStep();
  });

  function updateNavigation() {
    if (currentFormStep === steps.length - 1) {
      generateSummary();
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'block';
    }
  }

  nextBtn.addEventListener('click', () => {
    const type = form.querySelector('input[name="tipo"]:checked')?.value;

    if (currentFormStep === 0 && type === 'singolo') {
      currentFormStep = 1;
      showStep(currentFormStep);
      updateNavigation();
      return;
    }

    if (currentFormStep === 1 && type === 'singolo') {
      currentFormStep = steps.length - 1;
      generateSummary();
      showStep(currentFormStep);
      updateNavigation();
      return;
    }

    currentFormStep++;
    showStep(currentFormStep);

    // if (currentFormStep === steps.length - 1) {
    //   generateSummary();
    //   nextBtn.style.display = 'none';
    // } else {
    //   nextBtn.style.display = 'block';
    // }
    updateNavigation();
  });

  prevBtn.addEventListener('click', () => {
    if (currentType === 'singolo' && currentFormStep === steps.length - 1) {
      currentFormStep = 1;
    } else {
      currentFormStep--;
    }
    showStep(currentFormStep);
    successMessage.style.display = 'none';
    updateNavigation();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    successMessage.style.display = 'block';
  });

  validateStep();
});
