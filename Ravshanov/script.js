/* =============================
   POKIZA — MAGICAL EXPERIENCE
   ============================= */

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let stars = [];
let shootingStars = [];
let animationId = null;

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createStars();
}

function createStars() {
  const count = Math.min(
    220,
    Math.max(65, Math.floor((width * height) / 5500))
  );

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.65 + 0.2,
    speed: Math.random() * 0.012 + 0.003,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.7 ? "#ffbce8" : "#e9ddff"
  }));
}

function drawStars(time) {
  stars.forEach(star => {
    const flicker =
      0.35 + 0.65 *
      ((Math.sin(time * star.speed + star.phase) + 1) / 2);

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    ctx.globalAlpha = star.alpha * flicker;
    ctx.fillStyle = star.color;

    ctx.shadowBlur = star.radius > 1 ? 8 : 3;
    ctx.shadowColor = star.color;
    ctx.fill();

    ctx.shadowBlur = 0;
  });

  ctx.globalAlpha = 1;
}

function createShootingStar() {
  if (shootingStars.length >= 2) return;

  shootingStars.push({
    x: Math.random() * width * 0.8,
    y: Math.random() * height * 0.45,
    length: Math.random() * 100 + 50,
    speed: Math.random() * 5 + 5,
    opacity: 1
  });
}

function drawShootingStars() {
  shootingStars = shootingStars.filter(star => {
    star.x += star.speed;
    star.y += star.speed * 0.45;
    star.opacity -= 0.008;

    const gradient = ctx.createLinearGradient(
      star.x,
      star.y,
      star.x - star.length,
      star.y - star.length * 0.45
    );

    gradient.addColorStop(0, "rgba(255, 220, 255, 0.95)");
    gradient.addColorStop(1, "rgba(190, 120, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(
      star.x - star.length,
      star.y - star.length * 0.45
    );

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = Math.max(0, star.opacity);
    ctx.stroke();
    ctx.globalAlpha = 1;

    return star.opacity > 0 && star.x < width + 100;
  });
}

let lastFrame = 0;
let lastShootingStar = 0;

function animate(time = 0) {
  animationId = requestAnimationFrame(animate);

  // Juda tez qayta chizishni cheklash
  if (time - lastFrame < 25) return;

  lastFrame = time;

  ctx.clearRect(0, 0, width, height);

  drawStars(time);
  drawShootingStars();

  if (time - lastShootingStar > 2600 + Math.random() * 3500) {
    createShootingStar();
    lastShootingStar = time;
  }
}

resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);

// Yurakchalar yaratish

const heartSymbols = ["♡", "♥", "❤", "✧", "✦"];
const heartColors = [
  "#ff80c8",
  "#d49aff",
  "#ffb6e6",
  "#b6a2ff",
  "#fff0fb"
];

function createFloatingHeart(x, y) {
  const heart = document.createElement("span");

  heart.className = "floating-heart";
  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;

  heart.style.setProperty(
    "--heart-color",
    heartColors[Math.floor(Math.random() * heartColors.length)]
  );

  heart.style.setProperty(
    "--heart-size",
    `${Math.random() * 18 + 12}px`
  );

  heart.style.setProperty(
    "--duration",
    `${Math.random() * 1.8 + 2}s`
  );

  heart.style.setProperty(
    "--drift",
    `${Math.random() * 140 - 70}px`
  );

  heart.style.setProperty(
    "--rot",
    `${Math.random() * 70 - 35}deg`
  );

  document.body.appendChild(heart);

  heart.addEventListener("animationend", () => heart.remove(), {
    once: true
  });
}

function createSparkle(x, y) {
  const sparkle = document.createElement("span");

  sparkle.className = "cursor-spark";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;

  document.body.appendChild(sparkle);

  sparkle.addEventListener("animationend", () => sparkle.remove(), {
    once: true
  });
}

// Sichqoncha bilan harakat

let lastSparkleTime = 0;

document.addEventListener("pointermove", event => {
  if (reduceMotion) return;
  if (event.pointerType === "touch") return;

  const now = performance.now();

  if (now - lastSparkleTime < 55) return;

  lastSparkleTime = now;
  createSparkle(event.clientX, event.clientY);
});

// Ekranga bosilganda yurakchalar uchadi

document.addEventListener("pointerdown", event => {
  if (event.target.closest("button")) return;

  const amount = 7;

  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      createFloatingHeart(
        event.clientX + (Math.random() * 50 - 25),
        event.clientY + (Math.random() * 40 - 20)
      );
    }, i * 65);
  }

  // Bosilgan joyda mayda yorqin zarralar
  for (let i = 0; i < 5; i++) {
    createSparkle(
      event.clientX + (Math.random() * 70 - 35),
      event.clientY + (Math.random() * 70 - 35)
    );
  }
});

// Dastlabki mayda yurakchalar

if (!reduceMotion) {
  for (let i = 0; i < 9; i++) {
    setTimeout(() => {
      createFloatingHeart(
        width * (0.2 + Math.random() * 0.6),
        height * (0.45 + Math.random() * 0.35)
      );
    }, 1000 + i * 500);
  }
}

// Sehrli xabar oynasi

const magicButton = document.getElementById("magicButton");
const loveModal = document.getElementById("loveModal");
const closeModal = document.getElementById("closeModal");

function openMagicMessage() {
  loveModal.classList.add("show");
  loveModal.setAttribute("aria-hidden", "false");

  // Xabar ochilganda rangli yurakchalar
  if (!reduceMotion) {
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        createFloatingHeart(
          width * (0.15 + Math.random() * 0.7),
          height * (0.45 + Math.random() * 0.4)
        );
      }, i * 75);
    }
  }

  closeModal.focus();
}

function closeMagicMessage() {
  loveModal.classList.remove("show");
  loveModal.setAttribute("aria-hidden", "true");
  magicButton.focus();
}

magicButton.addEventListener("click", openMagicMessage);
closeModal.addEventListener("click", closeMagicMessage);

// Xabar tashqarisiga bosilganda yopiladi

loveModal.addEventListener("click", event => {
  if (event.target === loveModal) {
    closeMagicMessage();
  }
});

// Escape tugmasi bilan yopish

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && loveModal.classList.contains("show")) {
    closeMagicMessage();
  }
});