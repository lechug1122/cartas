const countdown = document.querySelector(".countdown");
const particles = document.querySelector("#particles");
const dateLabel = document.querySelector(".date");
const cards = [...document.querySelectorAll(".letter-card")];
const carouselFrame = document.querySelector("#carousel-frame");
const carouselDotsContainer = document.querySelector("#carousel-dots");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const spotifyList = document.querySelector("#spotify-list");

const photos = [
  { src: "fotos/foto-1.JPEG", caption: "Foto 1", alt: "Recuerdo 1" },
  { src: "fotos/foto-2.JPEG", caption: "Foto 2", alt: "Recuerdo 2" },
  { src: "fotos/foto-3.JPEG", caption: "Foto 3", alt: "Recuerdo 3" },
  { src: "fotos/foto-4.JPEG", caption: "Foto 4", alt: "Recuerdo 4" },
  { src: "fotos/foto-5.JPEG", caption: "Foto 5", alt: "Recuerdo 5" },
  { src: "fotos/foto-6.JPEG", caption: "Foto 6", alt: "Recuerdo 6" },
  { src: "fotos/foto-7.JPEG", caption: "Foto 7", alt: "Recuerdo 7" },
  { src: "fotos/foto-8.JPEG", caption: "Foto 8", alt: "Recuerdo 8" },
];

const spotifySongs = [
  {
    title: "Cancion 1",
    note: "Cuando despierto y no estas, esta cancion la que me acompaña",
    url: "https://open.spotify.com/intl-es/track/19lxccnIRRnxzqQssfQzAD?si=ec343037dfa04804",
  },
  {
    title: "Cancion 2",
    note: "Cuando te maquillas suena esta cancion en mi cabeza",
    url: "https://open.spotify.com/intl-es/track/3jjujdWJ72nww5eGnfs2E7?si=b5564776ac9147d9",
  },
  {
    title: "Cancion 3",
    note: "Si hubiera una cacion que pudiera describir lo que siento por ti, seria esta",
    url: "https://open.spotify.com/intl-es/track/2LKOHdMsL0K9KwcPRlJK2v?si=643f2b3f59a74de6",
  },
];

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

function createCarouselItems() {
  if (!carouselFrame || !carouselDotsContainer) {
    return;
  }

  const slideFragment = document.createDocumentFragment();
  const dotsFragment = document.createDocumentFragment();

  photos.forEach((photo, index) => {
    const slide = document.createElement("figure");
    slide.className = `carousel-slide${index === 0 ? " active" : ""}`;

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt;

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;

    slide.append(image, caption);
    slideFragment.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
    dot.classList.toggle("active", index === 0);
    dotsFragment.appendChild(dot);
  });

  carouselFrame.appendChild(slideFragment);
  carouselDotsContainer.appendChild(dotsFragment);
}

function setupCarousel() {
  const carouselSlides = [...document.querySelectorAll(".carousel-slide")];
  const carouselDots = [...document.querySelectorAll(".carousel-dots button")];

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

function setupSpotifySongs() {
  if (!spotifyList) {
    return;
  }

  const fragment = document.createDocumentFragment();

  spotifySongs.forEach((song) => {
    const item = document.createElement(song.url ? "a" : "div");
    item.className = `spotify-song${song.url ? "" : " empty"}`;

    if (song.url) {
      item.href = song.url;
      item.target = "_blank";
      item.rel = "noopener";
    }

    const title = document.createElement("span");
    title.className = "spotify-song-title";
    title.textContent = song.title;

    const note = document.createElement("span");
    note.className = "spotify-song-note";
    note.textContent = song.note;

    item.append(title, note);
    fragment.appendChild(item);
  });

  spotifyList.appendChild(fragment);
}

createParticles();
createCarouselItems();
setupCarousel();
setupSpotifySongs();
updateLetters();
updateMainCountdown();

setInterval(() => {
  updateLetters();
  updateMainCountdown();
}, 1000);
