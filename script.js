const countdown = document.querySelector(".countdown");
const particles = document.querySelector("#particles");
const dateLabel = document.querySelector(".date");
const cards = [...document.querySelectorAll(".letter-card")];
const carouselSlides = [...document.querySelectorAll(".carousel-slide")];
const carouselDots = [...document.querySelectorAll(".carousel-dots button")];
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");

const parts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

// Cambia esta fecha para probar los actos. Usa null para volver a la fecha real.
// Ejemplo: const previewDate = new Date("2026-05-13T12:01:00");
const previewDate = null;

function getNow() {
  return previewDate ? previewDate.getTime() : Date.now();
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function getDurationParts(remaining) {
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function formatShortDuration(remaining) {
  const { days, hours, minutes, seconds } = getDurationParts(remaining);

  return `${formatNumber(days)}d ${formatNumber(hours)}h ${formatNumber(minutes)}m ${formatNumber(seconds)}s`;
}

function getNextLockedCard(now) {
  return cards.find((card) => new Date(card.dataset.unlock).getTime() > now);
}

function updateMainCountdown() {
  const now = getNow();
  const nextCard = getNextLockedCard(now);

  if (!nextCard) {
    countdown.classList.add("expired");
    countdown.innerHTML = `
      <div class="time-block">
        <span>Todos los actos estan abiertos</span>
        <p>El corazon ya sabe el camino</p>
      </div>
    `;
    dateLabel.textContent = "La historia completa ya esta desbloqueada";
    return;
  }

  countdown.classList.remove("expired");
  const unlockDate = new Date(nextCard.dataset.unlock);
  const remaining = unlockDate.getTime() - now;
  const { days, hours, minutes, seconds } = getDurationParts(remaining);
  const actName = nextCard.querySelector(".card-number").textContent;

  dateLabel.textContent = `${actName} se habilita el ${unlockDate.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
  })} a las ${unlockDate.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  parts.days.textContent = formatNumber(days);
  parts.hours.textContent = formatNumber(hours);
  parts.minutes.textContent = formatNumber(minutes);
  parts.seconds.textContent = formatNumber(seconds);
}

function updateLetters() {
  const now = getNow();

  cards.forEach((card) => {
    const unlockDate = new Date(card.dataset.unlock).getTime();
    const isUnlocked = now >= unlockDate;
    const lockedText = card.querySelector(".locked-text");

    card.classList.toggle("unlocked", isUnlocked);
    card.classList.toggle("locked", !isUnlocked);

    if (!isUnlocked) {
      lockedText.textContent = `Se abre en ${formatShortDuration(unlockDate - now)}`;
    }
  });
}

function createParticles() {
  const particleCount = 90;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${Math.random() * 0.42 + 0.1}rem`);
    particle.style.setProperty("--stretch", `${Math.random() * 2.4 + 1.2}`);
    particle.style.setProperty("--alpha", `${Math.random() * 0.58 + 0.28}`);
    particle.style.setProperty("--duration", `${Math.random() * 8 + 6}s`);
    particle.style.setProperty("--delay", `${Math.random() * -16}s`);
    particle.style.setProperty("--drift", `${Math.random() * 16 - 8}rem`);
    particle.style.setProperty("--rotate", `${Math.random() * 70 - 35}deg`);
    particle.style.setProperty("--flicker", `${Math.random() * 0.9 + 0.55}s`);
    fragment.appendChild(particle);
  }

  particles.appendChild(fragment);
}

function setupCarousel() {
  if (!carouselSlides.length || !prevButton || !nextButton) {
    return;
  }

  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + carouselSlides.length) % carouselSlides.length;

    carouselSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    carouselDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  carouselSlides.forEach((slide) => {
    const image = slide.querySelector("img");

    image.addEventListener("error", () => {
      slide.classList.add("missing-photo");
    });
  });

  prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
  nextButton.addEventListener("click", () => showSlide(currentSlide + 1));

  carouselDots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => showSlide(dotIndex));
  });

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5500);
}

createParticles();
setupCarousel();
updateLetters();
updateMainCountdown();

setInterval(() => {
  updateLetters();
  updateMainCountdown();
}, 1000);
