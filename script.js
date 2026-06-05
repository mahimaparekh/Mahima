/* ── Typed.js intro ── */
var typed = new Typed("#element", {
  strings: ["hi, it's <span class='purple'>mahima.</span>"],
  typeSpeed: 50,
  showCursor: true,
  cursorChar: '<span class="purple-cursor">|</span>',
});

/* Neural network sphere */
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
const SIZE = 340;
canvas.width = SIZE;
canvas.height = SIZE;
const CX = SIZE / 2,
  CY = SIZE / 2,
  R = SIZE / 2;

let mouse = { x: null, y: null };
canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

const NODE_COUNT = 90,
  MAX_DIST = 105;
const nodes = [];
for (let i = 0; i < NODE_COUNT; i++) {
  let x, y;
  do {
    x = Math.random() * SIZE;
    y = Math.random() * SIZE;
  } while ((x - CX) ** 2 + (y - CY) ** 2 > R * R);
  nodes.push({
    x,
    y,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  });
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#000021";
  ctx.fillRect(0, 0, SIZE, SIZE);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x,
        dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        ctx.strokeStyle = `rgba(164,93,231,${(1 - d / MAX_DIST) * 0.82})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  for (const n of nodes) {
    if (mouse.x !== null) {
      const mdx = n.x - mouse.x,
        mdy = n.y - mouse.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 110 && md > 0) {
        const f = (1 - md / 110) * 0.75;
        n.vx += (mdx / md) * f;
        n.vy += (mdy / md) * f;
      }
    }
    n.vx *= 0.984;
    n.vy *= 0.984;
    const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (sp < 0.12) {
      n.vx += (Math.random() - 0.5) * 0.04;
      n.vy += (Math.random() - 0.5) * 0.04;
    }
    n.x += n.vx;
    n.y += n.vy;
    const nx = n.x - CX,
      ny = n.y - CY,
      nd = Math.sqrt(nx * nx + ny * ny);
    if (nd > R - 2) {
      const nnx = nx / nd,
        nny = ny / nd,
        dot = n.vx * nnx + n.vy * nny;
      n.vx -= 2 * dot * nnx;
      n.vy -= 2 * dot * nny;
      n.x = CX + nnx * (R - 2);
      n.y = CY + nny * (R - 2);
    }
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  requestAnimationFrame(draw);
}
draw();

/* ── Hamburger menu ── */
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navbar.classList.toggle("open");
  document.body.style.overflow = navbar.classList.contains("open")
    ? "hidden"
    : "";
});

// close menu when a link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navbar.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ── Project cards fade in on scroll ── */
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
});

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

projectCards.forEach((card) => cardObserver.observe(card));
