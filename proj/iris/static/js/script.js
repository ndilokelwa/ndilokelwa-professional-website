


// Language Stwich
  const switchLang = document.getElementById('languageSwitch');

  switchLang.addEventListener('change', () => {
    const ptElements = document.querySelectorAll('.lang-pt');
    const enElements = document.querySelectorAll('.lang-en');

    ptElements.forEach(el => el.classList.toggle('d-none'));
    enElements.forEach(el => el.classList.toggle('d-none'));
    animateWords("animated-text-pt");
    animateWords("animated-text");
  });


// animate role


document.addEventListener("DOMContentLoaded", () => {
  let role = document.getElementById("intro-role");
  const locationEl = document.getElementById("intro-location");
  const timeEl = document.getElementById("intro-time");
  let name = document.getElementById("intro-name");

  const largeText = role.dataset.textLarge;
  const smallText = role.dataset.textSmall;

  const largeTextN = name.dataset.textLarge;
  const smallTextN= name.dataset.textSmall;
  
  const circleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-circle-fill mx-1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>`;

  let currentReplacement = "Loading...";
  let baseText = largeText;

  // 🔡 Build per-letter spans (text + SVGs)
  function buildLetters(text, animateIn = false) {
    const output = [];
    const svgRegex = /<svg[\s\S]*?<\/svg>/g;
    const parts = text.split(svgRegex);
    const svgs = [...text.matchAll(svgRegex)];
    let i = 0;

    parts.forEach((part, partIndex) => {
      [...part].forEach((char) => {
        const span = document.createElement("span");
        span.className = "letter" + (animateIn ? " animate-in" : "");
        span.style.animationDelay = `${i * 0.05}s`;
        span.textContent = char === " " ? "\u00A0" : char;
        output.push(span);
        i++;
      });

      if (svgs[partIndex]) {
        const wrapper = document.createElement("span");
        wrapper.className = "letter" + (animateIn ? " animate-in" : "");
        wrapper.style.animationDelay = `${i * 0.05}s`;
        wrapper.innerHTML = svgs[partIndex][0];
        output.push(wrapper);
        i++;
      }
    });

    return output;
  }

  // ⏳ Animate out + in
  function animateTo(text) {
    const letters = role.querySelectorAll(".letter");
    letters.forEach((letter, i) => {
      setTimeout(() => letter.classList.add("animate-out"), i * 50);
    });

    setTimeout(() => {
      role.innerHTML = "";
      buildLetters(text, true).forEach(span => role.appendChild(span));
    }, letters.length * 50 + 200);
  }

  function animateBack() {
    animateTo(baseText);
  }

  // 🧠 Logic to apply on screen change
  function setupResponsiveBehavior(isSmall) {
    // Reset node (remove previous listeners)
    const newRole = role.cloneNode(false);
    role.parentNode.replaceChild(newRole, role);
    role = newRole;

    // Update text
    baseText = isSmall ? smallText : largeText;
    role.innerHTML = "";
    buildLetters(baseText).forEach(span => role.appendChild(span));

    // Bind hover only for small screens
    if (isSmall) {
      role.addEventListener("mouseenter", () => animateTo(currentReplacement));
      role.addEventListener("mouseleave", animateBack);
    }
  }

  
  // 🧠 Logic to apply on screen change name
  function setupResponsiveBehaviorN(isSmall) {
    // Reset node (remove previous listeners)
    const newName = name.cloneNode(false);
    name.parentNode.replaceChild(newName, name);
    name = newName;

    // Update text
    baseTextN = isSmall ? smallTextN : largeTextN;
    name.innerHTML = "";
    buildLetters(baseTextN).forEach(span => name.appendChild(span));

  }

  // 🔁 Listen to screen size change
  const mediaQuery = window.matchMedia("(max-width: 767.98px)");
  setupResponsiveBehavior(mediaQuery.matches);
  mediaQuery.addEventListener("change", (e) => {
    setupResponsiveBehavior(e.matches);
  });

   // 🔁 Listen to screen size change
  const mediaQueryN = window.matchMedia("(max-width: 767.98px)");
  setupResponsiveBehaviorN(mediaQuery.matches);
  mediaQueryN.addEventListener("change", (e) => {
    setupResponsiveBehaviorN(e.matches);
  });
  // 🌍 Fetch location
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      locationEl.innerText = data.city;
      updateReplacement();
    });

  // ⏰ Clock
  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    timeEl.innerText = `${h}:${m}`;
    updateReplacement();
  }

  setInterval(updateClock, 1000);
  updateClock();

  // 🔁 Combine location + time
  function updateReplacement() {
    const loc = locationEl.innerText.trim();
    const time = timeEl.innerText.trim();
    if (loc && time) {
      currentReplacement = `${loc} ${circleSVG} ${time}`;
    }
  }

  animateWords("animated-text");

});


// HArd Skills

const container = document.getElementById('scrollContainer');
const content = document.getElementById('scrollContent');

// Duplicate content
content.innerHTML += content.innerHTML;

let scrollAmount = 0;

function animate() {
  scrollAmount += 0.5; // adjust speed
  if (scrollAmount >= content.scrollWidth / 2) {
    scrollAmount = 0;
  }
  container.scrollLeft = scrollAmount;
  requestAnimationFrame(animate);
  }

animate();


// Animate Text
function animateWords(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const words = container.querySelectorAll("span");
  
  // Reset
  //words.forEach(word => word.classList.remove("visible"));

  // Animate in
  words.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add("visible");
    }, 1000 + index * 100);
  });
}

