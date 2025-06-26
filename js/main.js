// SHOW MENU

const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  nav = document.querySelector(".nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
    nav.classList.toggle("nav__open");
  });
}

// const navLinks = document.querySelectorAll('.nav__link');

// const linkAction = () => {
//   navMenu.classList.remove('show-menu');
// };

// navLinks.forEach(link => {
//   link.addEventListener('click', linkAction);
// });

// CARD ANIMATION

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  (entries) => {
    let delay = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Imposta un delay crescente per ogni card
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add("animate");
        delay += 0.2; // aumenta il delay per la prossima card
      } else {
        entry.target.classList.remove("animate");
        entry.target.style.transitionDelay = "0s";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

cards.forEach((card) => observer.observe(card));

// CHANGE HEADER BACKGROUND

// const bgHeader = () => {
//   const header = document.getElementById("header");
//   window.scrollY >= 50
//     ? header.classList.add("bg-header")
//     : header.classList.remove("bg-header");
// };

// window.addEventListener("scroll", bgHeader);

// FORM STEP

document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".feature__circle"),
    progressBar = document.querySelector(".feature__indicator"),
    buttons = document.querySelectorAll(".feature__buttons button");

  let currentStep = 1;

  const updateStep = (e) => {
    currentStep = e.target.id === "next" ? ++currentStep : --currentStep;

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
      buttons.forEach((button) => (button.disabled = false));
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", updateStep);
  });

  // WIZARD FORM

  const form = document.getElementById("feature__form"),
    steps = Array.from(document.querySelectorAll("fieldset.step")),
    prevBtn = document.getElementById("prev"),
    nextBtn = document.getElementById("next"),
    summaryBox = document.querySelector(".summary"),
    step2Content = document.querySelector(".step2Content"),
    successMessage = document.getElementById("successMessage"),
    modal = document.getElementById("modal"),
    personalDataForm = document.getElementById("personalDataForm"),
    confirmBtn = document.getElementById("confirmBtn"),
    backBtn = document.getElementById("backBtn"),
    apiOptionalChoice = document.querySelector(".optionalChoices"),
    apiLabel = document.querySelector(".apiLabel"),
    apiCheckbox = document.querySelector(".apiCheckbox"),
    goBackBtn = document.querySelector(".go-back-btn"),
    btnSummary = document.getElementById("btnSummary");

  let currentFormStep = 0;
  let currentType = "";

  if (currentFormStep === 0) {
    prevBtn.disabled = true;
  }

  const pricesMultipleCourses = {
    "10_individuale_10": 300,
    "10_individuale_100": 750,
    "10_30studenti_10": 500,
    "10_30studenti_100": 1250,
    "50_individuale_10": 800,
    "50_individuale_100": 2000,
    "50_30studenti_10": 1000,
    "50_30studenti_100": 2500,
  };

  function uncheckOtherCheckbox(name, current) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((box) => {
      if (box !== current) box.checked = false;
    });
  }

  function validateStep() {
    const formCheckboxInput = steps[currentFormStep].querySelectorAll(
      'input[type="checkbox"]'
    );

    nextBtn.disabled = !Array.from(formCheckboxInput).some(
      (input) => input.checked
    );
  }

  function showStep(currentStep) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
      circles[index].classList[`${index <= currentStep ? "add" : "remove"}`](
        "active"
      );
    });
    progressBar.style.width = `${(currentStep / (circles.length - 1)) * 100}%`;
    // prevBtn.disabled = currentStep === 0;
    validateStep();
  }

  function createCheckBox(name, value, labelText) {
    const label = document.createElement("label");
    label.classList.add("custom-checkbox");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.value = value;
    // input.setAttribute('data-tooltip', '5000');

    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    label.appendChild(input);
    label.appendChild(checkmark);
    label.appendChild(document.createTextNode(" " + labelText));

    return label;
  }

  function createApiCheckBox(name, value, labelText) {
    const label = document.createElement("label");
    label.classList.add("optionalChoices");
    label.setAttribute("data-tooltip", "+ 5000 €");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.value = value;

    input.addEventListener("change", () => {
      if (input.checked) {
        label.classList.add("active");
      } else {
        label.classList.remove("active");
      }
    });

    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("ri-information-line", "info-icon");

    const apiDialog = document.getElementById("apiDialog");
    const closeBtn = document.getElementById("closeApiDialog");

    infoIcon.addEventListener("click", () => {
      apiDialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
      apiDialog.close();
    });

    label.appendChild(input);
    label.appendChild(checkmark);
    label.appendChild(document.createTextNode(" " + labelText));
    label.appendChild(infoIcon);

    return label;
  }

  function renderStep2() {
    step2Content.innerHTML = "";

    const type = form.querySelector('input[name="tipo"]:checked')?.value;
    currentType = type;

    if (type === "singolo") {
      step2Content.appendChild(
        createCheckBox("opzione_singolo", "10_100", "10 anni")
      );
      step2Content.appendChild(
        createCheckBox("opzione_singolo", "10_250", "100 anni")
      );
    } else if (type === "multipli") {
      step2Content.appendChild(
        createCheckBox("numero_corsi", "10", "10 corsi")
      );
      step2Content.appendChild(
        createCheckBox("numero_corsi", "50", "50 corsi")
      );
    }

    // Dopo aver aggiunto tutti i checkbox dinamici:
    step2Content.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener("change", () => {
        uncheckOtherCheckbox(input.name, input); // Mantiene selezione singola
        validateStep(); // Aggiorna stato bottone Avanti
      });
    });

    validateStep(); // Forza la validazione iniziale
  }

  function generateSummary() {
    const data = new FormData(form);
    const type = data.get("tipo");
    let price = 0;

    const cardList = document.createElement("ul");
    cardList.className = "card-list";

    const addItem = (label, value, icon, itemClass) => {
      const listItem = document.createElement("li");
      listItem.className = itemClass;
      listItem.innerHTML = `<i class="ri-${icon}"></i> <strong>${label}:</strong> ${value}`;
      cardList.appendChild(listItem);
    };

    addItem("Tipo", `${type}`, "book-shelf-line", "list-summary");

    if (type === "singolo") {
      const value = data.get("opzione_singolo");
      if (!value) return;
      const years = value.split("_")[0];
      price = value === "10_100" ? 100 : 250;

      addItem("Durata", `${years} anni`, "hourglass-line", "list-summary");
    }

    if (type === "multipli") {
      const courses = data.get("numero_corsi");
      const students = data.get("studenti");
      const duration = data.get("durata");
      const key = `${courses}_${students}_${duration}`;
      price = pricesMultipleCourses[key] || 0;

      addItem("Corsi", `${courses}`, "book-line", "list-summary");

      addItem(
        "Studenti",
        `${students === "individuale" ? "Singolo studente" : "30 studenti"}`,
        "team-line",
        "list-summary"
      );

      addItem("Durata", `${duration}`, "hourglass-line", "list-summary");
    }

    if (type === "personalizzato") {
      const personalData = new FormData(personalDataForm);
      const name = personalData.get("nome");
      const email = personalData.get("email");
      const message = personalData.get("messaggio");

      if (name && email && message) {
        addItem("Nome", name, "user-line", "list-summary");
        addItem("Email", email, "mail-line", "list-summary");
        addItem("Messaggio", message, "chat-1-line", "list-summary");
      }
    }

    summaryBox.textContent = "";

    if (type === "singolo" || type === "multipli") {
      addItem(
        "Prezzo pacchetto",
        `${price.toLocaleString()} €`,
        "money-euro-circle-line",
        "list-summary"
      );
    }

    addItem("Setup iniziale", "+ 1000 €", "settings-4-line", "list-summary");

    summaryBox.appendChild(cardList);

    if (type === "singolo" || type === "multipli") {
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.name = "contatto_nome";
      nameInput.placeholder = "Inserisci il tuo nome";
      nameInput.required = true;

      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.name = "contatto_email";
      emailInput.placeholder = "Inserisci la tua email";
      emailInput.required = true;

      const nameWrapper = document.createElement("li");
      nameWrapper.className = "list-summary";
      nameWrapper.appendChild(nameInput);

      const emailWrapper = document.createElement("li");
      emailWrapper.className = "list-summary";
      emailWrapper.appendChild(emailInput);

      summaryBox.appendChild(nameWrapper);
      summaryBox.appendChild(emailWrapper);
    }

    summaryBox.appendChild(
      createApiCheckBox("accesso_api", "5000", "Accesso API")
    );

    summaryBox.appendChild(btnSummary);
    btnSummary.style.display = "inline-block";
  }

  function populateHiddenForm() {
    const hiddenForm = document.forms["configuratore"];

    const tipo = form.querySelector('input[name="tipo"]:checked')?.value;

    if (!tipo) {
      console.warn("Tipo di configurazione non selezionato");
      return;
    }

    hiddenForm.querySelector('[name="tipo"]').value = tipo;

    if (tipo === "singolo") {
      const opzioneSingolo = document.querySelector(
        'input[name="opzione_singolo"]:checked'
      )?.value;
      const data = new FormData(form);
      const value = data.get("opzione_singolo");
      if (!value) return;
      const numero_corsi = value.split("_")[0];
      const studenti = document.querySelector(
        '#feature__form input[name="studenti"]'
      )?.value;
      const durata = document.querySelector(
        '#feature__form input[name="durata"]'
      )?.value;
      const accessoApi = document.querySelector(
        '#feature__form input[name="accesso_api"]:checked'
      )?.value;
      const nome = document.querySelector(
        '#feature__form input[name="contatto_nome"]'
      )?.value;
      const email = document.querySelector(
        '#feature__form input[name="contatto_email"]'
      )?.value;

      hiddenForm.querySelector('[name="opzione_singolo"]').value =
        opzioneSingolo || "";
      hiddenForm.querySelector('[name="numero_corsi"]').value =
        numero_corsi || "";
      hiddenForm.querySelector('[name="studenti"]').value = studenti || "";
      hiddenForm.querySelector('[name="durata"]').value = durata || "";
      hiddenForm.querySelector('[name="accesso_api"]').value = accessoApi || "";
      hiddenForm.querySelector('[name="contatto_nome"]').value = nome || "";
      hiddenForm.querySelector('[name="contatto_email"]').value = email || "";
    } else if (tipo === "multipli") {
      const numeroCorsi = document.querySelector(
        '#feature__form input[name="numero_corsi"]'
      )?.value;
      const studenti = document.querySelector(
        '#feature__form input[name="studenti"]'
      )?.value;
      const durata = document.querySelector(
        '#feature__form input[name="durata"]'
      )?.value;
      const accessoApi = document.querySelector(
        '#feature__form input[name="accesso_api"]:checked'
      )?.value;
      const nome = document.querySelector(
        '#feature__form input[name="contatto_nome"]'
      )?.value;
      const email = document.querySelector(
        '#feature__form input[name="contatto_email"]'
      )?.value;

      hiddenForm.querySelector('[name="numero_corsi"]').value =
        numeroCorsi || "";
      hiddenForm.querySelector('[name="studenti"]').value = studenti || "";
      hiddenForm.querySelector('[name="durata"]').value = durata || "";
      hiddenForm.querySelector('[name="accesso_api"]').value = accessoApi || "";
      hiddenForm.querySelector('[name="contatto_nome"]').value = nome || "";
      hiddenForm.querySelector('[name="contatto_email"]').value = email || "";
    } else if (tipo === "personalizzato") {
      const nome = document.querySelector(
        '#personalDataForm input[name="nome"]'
      )?.value;
      const email = document.querySelector(
        '#personalDataForm input[name="email"]'
      )?.value;
      const messaggio = document.querySelector(
        "#personalDataForm textarea"
      )?.value;

      hiddenForm.querySelector('[name="nome"]').value = nome || "";
      hiddenForm.querySelector('[name="email"]').value = email || "";
      hiddenForm.querySelector('[name="messaggio"]').value = messaggio || "";
    }
  }

  form.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      uncheckOtherCheckbox(e.target.name, e.target);
      if (e.target.name === "tipo") {
        renderStep2();
      }
    }
    validateStep();
  });

  function updateNavigation() {
    if (currentFormStep === steps.length - 1) {
      generateSummary();
      nextBtn.style.display = "none";
      btnSummary.style.display = "inline-block";
    } else {
      nextBtn.style.display = "block";
      btnSummary.style.display = "none";
    }

    prevBtn.disabled = currentFormStep === 0;

    const formCheckboxInput = steps[currentFormStep].querySelectorAll(
      'input[type="checkbox"]'
    );
    formCheckboxInput.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // confirmBtn.style.display =
    //   currentFormStep === steps.length - 1 ? "inline-block" : "none";
  }

  nextBtn.addEventListener("click", () => {
    const type = form.querySelector('input[name="tipo"]:checked')?.value;

    if (currentFormStep === 0 && type === "singolo") {
      currentFormStep = 1;
      showStep(currentFormStep);
      updateNavigation();
      return;
    }

    if (currentFormStep === 1 && type === "singolo") {
      currentFormStep = steps.length - 1;
      generateSummary();
      showStep(currentFormStep);
      updateNavigation();
      return;
    }

    if (currentFormStep === 0 && type === "personalizzato") {
      modal.showModal();
      nextBtn.style.display = "none";
      prevBtn.style.display = "none";
      return;
    }

    if (currentFormStep === steps.length - 1) {
      btnSummary.style.display = "block";
    }

    currentFormStep++;
    showStep(currentFormStep);

    updateNavigation();
  });

  // personalDataForm.addEventListener("submit", (e) => {
  //   e.preventDefault();

  //   populateHiddenForm();
  //   document.forms["configuratore"].submit();

  //   conditionalPadding();
  // });

  personalDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    populateHiddenForm();

    const formData = new FormData(document.forms["configuratore"]);

    try {
      const response = await fetch(document.forms["configuratore"].action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        conditionalPadding();
      } else {
        console.error("Errore nella risposta del server", response.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch", error);
    }
  });

  const nameInput = personalDataForm.querySelector('[name="nome"]');
  const emailInput = personalDataForm.querySelector('[name="email"]');
  const messageInput = personalDataForm.querySelector('[name="messaggio"]');

  function toggleConfirmButton() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const emailIsValid = emailInput.checkValidity();

    confirmBtn.disabled = !(name && email && message && emailIsValid);
  }

  // Inizializza lo stato del bottone
  toggleConfirmButton();

  // Aggiungi il listener agli input
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", toggleConfirmButton);
  });

  confirmBtn.addEventListener("click", () => {
    modal.close();
    currentFormStep = steps.length - 1;
    generateSummary();
    showStep(currentFormStep);
    updateNavigation();
    prevBtn.style.display = "block";
  });

  backBtn.addEventListener("click", () => {
    modal.close();
    currentFormStep = 0;
    generateSummary();
    showStep(currentFormStep);
    updateNavigation();

    nextBtn.style.display = "block";
    nextBtn.disabled = true;
    prevBtn.style.display = "block";
    prevBtn.disabled = true;
  });

  prevBtn.addEventListener("click", () => {
    if (currentFormStep === steps.length - 1) {
      currentFormStep = 0;
    } else {
      currentFormStep--;
    }

    showStep(currentFormStep);
    updateNavigation();

    successMessage.style.display = "none";
    btnSummary.style.display = "inline-block";
    apiLabel.style.display = "flex";
    apiCheckbox.checked = false;
    nextBtn.disabled = true;
  });

  goBackBtn.addEventListener("click", () => {
    currentFormStep = 0;
    showStep(currentFormStep);
    successMessage.style.display = "none";
    updateNavigation();
    form.style.display = "block";
    conditionalPadding();

    nextBtn.disabled = true;
    prevBtn.disabled = true;
  });

  // form.addEventListener("submit", (e) => {
  //   const btnSummary = document.getElementById("btnSummary");
  //   e.preventDefault();

  //   populateHiddenForm();

  //   document.forms["configuratore"].submit();

  //   successMessage.style.display = "block";
  //   form.style.display = "none";
  //   btnSummary.style.display = "none";
  //   conditionalPadding();
  // });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btnSummary = document.getElementById("btnSummary");

    populateHiddenForm();

    const formData = new FormData(document.forms["configuratore"]);

    try {
      const response = await fetch(document.forms["configuratore"].action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        successMessage.style.display = "block";
        form.style.display = "none";
        btnSummary.style.display = "none";
        conditionalPadding();
      } else {
        console.error("Errore nella risposta del server", response.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch", error);
    }

    validateStep();
  });

  validateStep();
});

// SWIPER

const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 14,
  grabCursor: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// HELPER

function conditionalPadding() {
  const form = document.getElementById("feature__form");
  const reviewsSection = document.getElementById("reviews");

  const formDisplay = window.getComputedStyle(form).display;

  if (formDisplay === "none") {
    reviewsSection.classList.add("padding-top");
  } else {
    reviewsSection.classList.remove("padding-top");
  }
}

// SCROLL UP

const scrollUp = () => {
  const scrollUp = document.getElementById("scrollUp");
  window.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};

window.addEventListener("scroll", scrollUp);
