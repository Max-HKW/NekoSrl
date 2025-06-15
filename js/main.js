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
    step2Content = document.getElementById('step2Content'),
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
      circles[index].classList[`${index <= currentStep ? 'add' : 'remove'}`]('active');
    });
    progressBar.style.width = `${
      ((currentStep) / (circles.length - 1)) * 100
    }%`;
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

    const ul = document.createElement('ul');
    const listItemType = document.createElement('li');
    listItemType.textContent = `Tipo: ${type}`;
    ul.appendChild(listItemType);

    if (type === 'singolo') {
      const value = data.get('opzione_singolo');
      if (!value) return;
      const years = value.split('_')[0];
      price = value === '10_100' ? 100 : 250;

      const listItemDuration = document.createElement('li');
      listItemDuration.textContent = `Durata: ${years} anni`;
      ul.appendChild(listItemDuration);
    }

    if (type === 'multipli') {
      const courses = data.get('numero_corsi');
      const students = data.get('studenti');
      const duration = data.get('durata');
      const key = `${courses}_${students}_${duration}`;
      price = pricesMultipleCourses[key] || 0;

      const listItemCourses = document.createElement('li');
      listItemCourses.textContent = `Corsi: ${courses}`;
      ul.append(listItemCourses);

      const listItemStudents = document.createElement('li');
      listItemStudents.textContent = `Studenti: ${
        students === 'individuale' ? 'Singolo studente' : '30 studenti'
      }`;
      ul.append(listItemStudents);

      const listItemDuration = document.createElement('li');
      listItemDuration.textContent = `Durata: ${duration}`;
      ul.append(listItemDuration);
    }

    if (type === 'personalizzato') {
    }

    const listItemPrice = document.createElement('li');
    listItemPrice.textContent = `Prezzo totale: ${price}`;
    ul.append(listItemPrice);

    summaryBox.textContent = '';
    summaryBox.appendChild(ul);
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

  nextBtn.addEventListener('click', () => {
    const type = form.querySelector('input[name="tipo"]:checked')?.value;

    if (currentFormStep === 0 && type === 'singolo') {
      currentFormStep = 1;
      showStep(currentFormStep);
      return;
    }

    if (currentFormStep === 1 && type === 'singolo') {
      currentFormStep = steps.length - 1;
      generateSummary();
      showStep(currentFormStep);
      return;
    }

    currentFormStep++;
    showStep(currentFormStep);

    if (currentFormStep === steps.length - 1) generateSummary();
  });

  prevBtn.addEventListener('click', () => {
    if (currentType === 'singolo' && currentFormStep === steps.length - 1) {
      currentFormStep = 1;
    } else {
      currentFormStep--;
    }
    showStep(currentFormStep);
    successMessage.style.display = 'none';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    successMessage.style.display = 'block';
  });

  validateStep();
});
