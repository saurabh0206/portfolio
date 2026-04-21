const yearEl = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const reveals = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".top-nav a");
const tiltCards = document.querySelectorAll(".tilt-card");

if (yearEl) yearEl.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);
reveals.forEach((el) => revealObserver.observe(el));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);
sections.forEach((section) => navObserver.observe(section));

// 3D tilt interaction for cards.
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = -((y / rect.height) - 0.5) * 10;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(3px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  });
});

// Animated gradient mesh background on canvas.
const canvas = document.getElementById("bgMesh");
const ctx = canvas?.getContext("2d");

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw(time) {
  if (!ctx || !canvas) return;
  const t = time * 0.0004;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradients = [
    { x: canvas.width * (0.2 + 0.05 * Math.sin(t)), y: canvas.height * (0.18 + 0.08 * Math.cos(t)), r: 280, c: "rgba(83, 209, 255, 0.22)" },
    { x: canvas.width * (0.78 + 0.06 * Math.cos(t * 1.5)), y: canvas.height * (0.28 + 0.07 * Math.sin(t * 1.3)), r: 330, c: "rgba(104, 140, 255, 0.18)" },
    { x: canvas.width * (0.52 + 0.04 * Math.sin(t * 1.1)), y: canvas.height * (0.82 + 0.05 * Math.cos(t * 1.1)), r: 310, c: "rgba(79, 246, 193, 0.16)" }
  ];

  gradients.forEach((g) => {
    const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
    grad.addColorStop(0, g.c);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  requestAnimationFrame(draw);
}

if (canvas && ctx) {
  resizeCanvas();
  requestAnimationFrame(draw);
  window.addEventListener("resize", resizeCanvas);
}
