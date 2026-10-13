/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const SKILLS = [
  { name: "React / Next.js",    cat: "Framework",    level: "Expert" },
  { name: "TypeScript",         cat: "Language",     level: "Advanced" },
  { name: "Tailwind CSS",       cat: "Styling",      level: "Expert" },
  { name: "Framer Motion",      cat: "Motion",       level: "Advanced" },
  { name: "UI/UX Design",       cat: "Design",       level: "Expert" },
  { name: "Web Performance",    cat: "Optimization", level: "Advanced" },
  { name: "Interaction Design", cat: "Motion",       level: "Expert" },
  { name: "State Management",   cat: "Architecture", level: "Advanced" }
];

const QUOTES = [
  "Code is poetry. Design is rhythm.",
  "Simplicity is the soul of efficiency.",
  "Motion is the language of emotion.",
  "Design is intelligence made visible.",
  "The details are not the details. They make the design.",
  "Good design is as little design as possible."
];

/* ⚠️ GANTI 8 LAGU INI PAKAI LAGU FAVORIT LO
   Format: { name, artist, trackId }
   trackId = ID dari URL track, contoh:
   https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
   → trackId = "4cOdK2wGLETKBW3PvgPWqT"
*/
const SPOTIFY_TRACKS = [
  { name: "Lagu Favorit 1", artist: "Artist 1", trackId: "4cOdK2wGLETKBW3PvgPWqT" },
  { name: "Lagu Favorit 2", artist: "Artist 2", trackId: "7qiZfU4dY1lWllzX7mPBI3" },
  { name: "Lagu Favorit 3", artist: "Artist 3", trackId: "0VjIjW4GlUZAMYd2vXMi3b" },
  { name: "Lagu Favorit 4", artist: "Artist 4", trackId: "3kxfsdsCpFgN412fpnW85Y" },
  { name: "Lagu Favorit 5", artist: "Artist 5", trackId: "6I3mqTwhRpn34SLVafSH7G" },
  { name: "Lagu Favorit 6", artist: "Artist 6", trackId: "1BxfuPKGuaTgP7aM0Bbdwr" },
  { name: "Lagu Favorit 7", artist: "Artist 7", trackId: "6DCZcSspjsKoFjzjrWoCdn" },
  { name: "Lagu Favorit 8", artist: "Artist 8", trackId: "0ct6r3EGTcMLPtrXHDvVjc" }
];

/* ═══════════════════════════════════════════
   PASSCODE DINAMIS = JAM + MENIT (HHMM) WIB
   ═══════════════════════════════════════════ */
function getCurrentPasscode() {
  const now = new Date();
  const wib = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
  const hh = String(wib.getHours()).padStart(2, "0");
  const mm = String(wib.getMinutes()).padStart(2, "0");
  return hh + mm;
}

/* ═══════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════ */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

/* ═══════════════════════════════════════════
   CLOCK (gate, hero, footer)
   ═══════════════════════════════════════════ */
function pad(n) { return String(n).padStart(2, "0"); }

function tickClock() {
  const d = new Date();
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const gateTime = $("#gate-time");
  const footerTime = $("#footer-time");
  const heroClock = $("#hero-clock");
  if (gateTime) gateTime.textContent = time;
  if (footerTime) footerTime.textContent = `${time} WIB`;
  if (heroClock) heroClock.textContent = `${time} WIB`;
}
tickClock();
setInterval(tickClock, 1000);

/* ═══════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════ */
const themeToggle = $("#theme-toggle");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle?.classList.toggle("is-active", savedTheme === "dark");

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.classList.toggle("is-active", next === "dark");
  playSound("click");
});

/* ═══════════════════════════════════════════
   NOISE TOGGLE
   ═══════════════════════════════════════════ */
const noiseToggle = $("#noise-toggle");
const grainOverlay = $(".grain-overlay");
let noiseOn = true;

noiseToggle?.addEventListener("click", () => {
  noiseOn = !noiseOn;
  grainOverlay?.classList.toggle("is-off", !noiseOn);
  noiseToggle.classList.toggle("is-active", !noiseOn);
  playSound("click");
});

/* ═══════════════════════════════════════════
   SOUND TOGGLE
   ═══════════════════════════════════════════ */
const soundToggle = $("#sound-toggle");
let soundOn = false;

soundToggle?.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.classList.toggle("is-active", soundOn);
  if (soundOn) playSound("on");
});

let audioCtx = null;
function playSound(type = "click") {
  if (!soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "click") {
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === "on") {
      osc.frequency.value = 660;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(523, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046, audioCtx.currentTime + 0.2);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) { /* silent */ }
}

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */
const toast = $("#toast");
const toastText = $("#toast-text");
let toastTimer = null;

function showToast(msg) {
  if (!toast || !toastText) return;
  toastText.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* ═══════════════════════════════════════════
   COPY EMAIL
   ═══════════════════════════════════════════ */
$$("[data-copy]").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.getAttribute("data-copy");
    const label = btn.querySelector(".copy-label");
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      showToast("Email copied — " + text);
      playSound("success");
      if (label) {
        const orig = label.textContent;
        label.textContent = "Copied!";
        setTimeout(() => { label.textContent = orig; }, 1800);
      }
    }).catch(() => {
      showToast("Gagal copy — coba manual");
    });
  });
});

/* ═══════════════════════════════════════════
   QUOTE OF THE DAY
   ═══════════════════════════════════════════ */
const quoteEl = $(".info-card__quote");
if (quoteEl) {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteEl.textContent = `"${q}"`;
}

/* ═══════════════════════════════════════════
   GATE LOGIC
   ═══════════════════════════════════════════ */
const gate = $("#gate");
const gateForm = $("#gate-form");
const gateInput = $("#gate-input");
const gateHint = $("#gate-hint");
const gateForgot = $("#gate-forgot");

gateForgot?.addEventListener("click", () => {
  const code = getCurrentPasscode();
  alert("ini passcodenya boss: " + code + "\n\nCepetan masukin, tiap menit ganti 😎");
  if (gateInput) {
    gateInput.focus();
    showHint("— Passcode valid cuma 60 detik. Buruan!", "");
  }
});

function showHint(text, type = "") {
  if (!gateHint) return;
  gateHint.textContent = text;
  gateHint.className = `mt-6 font-mono text-[0.7rem] tracking-[0.18em] uppercase h-5 transition-opacity duration-300 ${
    type === "error" ? "text-red-400" :
    type === "success" ? "text-gold" :
    "text-gold/60"
  }`;
}

function unlockGate() {
  showHint("— Access granted. Loading experience…", "success");
  if (reducedMotion) {
    gate.classList.add("is-hidden");
    runIntro();
    return;
  }
  gsap.to(gate, {
    opacity: 0,
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
    onComplete: () => {
      gate.classList.add("is-hidden");
      runIntro();
    }
  });
}

gateForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = (gateInput.value || "").trim();
  const currentCode = getCurrentPasscode();
  if (val === currentCode) {
    gateInput.blur();
    unlockGate();
  } else {
    showHint("— Passcode salah. Passcode = jam sekarang (HHMM WIB).", "error");
    gateInput.value = "";
    gateInput.focus();
    gate.classList.add("shake");
    setTimeout(() => gate.classList.remove("shake"), 600);
  }
});

setTimeout(() => gateInput?.focus(), 300);

/* ═══════════════════════════════════════════
   INTRO CINEMATIC
   ═══════════════════════════════════════════ */
const intro = $("#intro");
const introBar = $("#intro-bar");
const introProgress = $("#intro-progress");
const introStatus = $("#intro-status");
const introLines = $$(".intro-line");
const introWords = $$(".intro-word");

const STATUSES = [
  "Mounting portfolio…",
  "Compiling shaders…",
  "Summoning creativity…",
  "Brewing coffee…",
  "Polishing pixels…",
  "Almost there…"
];

let introSkipped = false;
let introTimeline = null;

function runIntro() {
  if (!intro) return;
  intro.classList.remove("hidden");
  intro.classList.add("is-skippable");

  const skip = () => {
    if (introSkipped) return;
    introSkipped = true;
    endIntro(true);
  };
  intro.addEventListener("click", skip);
  window.addEventListener("keydown", skip, { once: true });

  gsap.set(introLines, { opacity: 0, y: 20 });
  gsap.set(introBar, { width: "0%" });

  if (reducedMotion) {
    gsap.set(introLines, { opacity: 1, y: 0 });
    gsap.set(introBar, { width: "100%" });
    introProgress.textContent = "100%";
    setTimeout(() => endIntro(false), 600);
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: [0.22, 1, 0.36, 1] } });
  introTimeline = tl;

  tl.to(".intro-line", { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 });

  tl.fromTo(introWords,
    { y: "110%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 0.9, stagger: 0.07 },
    "-=0.4"
  );

  const duration = 3;
  tl.to(introBar, {
    width: "100%",
    duration,
    ease: "power2.inOut",
    onUpdate: function () {
      const prog = Math.round(this.progress() * 100);
      introProgress.textContent = String(prog).padStart(3, "0") + "%";
      const idx = Math.min(STATUSES.length - 1, Math.floor((prog / 100) * STATUSES.length));
      if (introStatus.textContent !== STATUSES[idx]) {
        introStatus.textContent = STATUSES[idx];
      }
    }
  }, "-=0.3");

  tl.to(intro, {
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    onComplete: () => endIntro(false)
  });
}

function endIntro(skipped) {
  if (introTimeline) introTimeline.kill();
  if (!intro) return;
  gsap.to(intro, {
    opacity: 0,
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
    onComplete: () => {
      intro.classList.add("is-hidden");
      revealPortfolio(skipped);
    }
  });
}

/* ═══════════════════════════════════════════
   PORTFOLIO REVEAL
   ═══════════════════════════════════════════ */
const site = $("#site");

function revealPortfolio(skipped) {
  if (!site) return;
  window.scrollTo(0, 0);
  gsap.to(site, { opacity: 1, duration: 0.5, ease: "power2.out" });

  if (skipped && !reducedMotion) {
    gsap.set(".hero-word", { y: "0%", opacity: 1 });
    gsap.set(".hero-sub, .hero-stats, .hero-eyebrow, .hero-cta, .hero-info", { opacity: 1, y: 0 });
  }

  document.body.classList.add("site-ready");
  initPortfolio(skipped);
}

/* ═══════════════════════════════════════════
   PORTFOLIO MODULE INIT
   ═══════════════════════════════════════════ */
let portfolioInitialized = false;

function initPortfolio(skippedHero = false) {
  if (portfolioInitialized) return;
  portfolioInitialized = true;

  /* ── 1. LENIS SMOOTH SCROLL ── */
  const lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reducedMotion,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: 0, duration: 1.2 });
      }
    });
  });

  /* ── 2. GSAP ── */
  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── 3. CUSTOM CURSOR + MOUSE GRADIENT ── */
  const ring = $(".cursor-ring");
  const dot = $(".cursor-dot");
  const label = $(".cursor-label");
  const labelSpan = label?.querySelector("span");

  if (ring && dot && isFinePointer) {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rafPending = false;

    const dotTo = gsap.quickTo(dot, "x", { duration: 0.05 });
    const dotToY = gsap.quickTo(dot, "y", { duration: 0.05 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const labelX = label ? gsap.quickTo(label, "x", { duration: 0.1 }) : null;
    const labelY = label ? gsap.quickTo(label, "y", { duration: 0.1 }) : null;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          dotTo(mouse.x);
          dotToY(mouse.y);
          ringX(mouse.x);
          ringY(mouse.y);
          if (labelX && labelY) {
            labelX(mouse.x);
            labelY(mouse.y);
          }
          document.documentElement.style.setProperty("--mx", mouse.x + "px");
          document.documentElement.style.setProperty("--my", mouse.y + "px");
          document.body.classList.add("cursor-ready");
          rafPending = false;
        });
      }
    });

    function setCursorState(type) {
      ring.classList.remove("active", "hover-large");
      label?.classList.remove("is-visible");
      if (type === "hover") ring.classList.add("active");
      else if (type === "large") ring.classList.add("hover-large");
      else if (type === "label") ring.classList.add("active");
    }

    $$("a:not([data-cursor]), button:not([data-cursor]), .underline-sweep").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });

    $$("[data-cursor]").forEach(el => {
      const type = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        if (type === "hover") setCursorState("hover");
        else if (type === "drag") {
          setCursorState("large");
          if (labelSpan) labelSpan.textContent = "Scroll →";
          label?.classList.add("is-visible");
        } else if (type === "label") {
          setCursorState("label");
          if (labelSpan) labelSpan.textContent = el.getAttribute("data-cursor-text") || "";
          label?.classList.add("is-visible");
        }
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("active", "hover-large");
        label?.classList.remove("is-visible");
      });
    });

    $$("[data-tilt]").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover-large"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover-large"));
    });
  }

  /* ── 4. MAGNETIC BUTTON (throttled) ── */
  if (isFinePointer && !reducedMotion) {
    $$(".magnetic-btn").forEach(btn => {
      const strength = 0.3;
      const maxMove = 14;
      let pending = false;
      let lastEvent = null;

      btn.addEventListener("mousemove", (e) => {
        lastEvent = e;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          if (lastEvent) {
            const rect = btn.getBoundingClientRect();
            const relX = lastEvent.clientX - (rect.left + rect.width / 2);
            const relY = lastEvent.clientY - (rect.top + rect.height / 2);
            const moveX = Math.max(-maxMove, Math.min(maxMove, relX * strength));
            const moveY = Math.max(-maxMove, Math.min(maxMove, relY * strength));
            gsap.to(btn, { x: moveX, y: moveY, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          }
          pending = false;
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: [0.22, 1, 0.36, 1], overwrite: "auto" });
      });

      btn.addEventListener("click", () => playSound("click"));
    });
  }

  /* ── 5. TILT CARDS (throttled) ── */
  if (isFinePointer && !reducedMotion) {
    $$("[data-tilt]").forEach(card => {
      const MAX = 6;
      let pending = false;
      let lastEvent = null;

      card.addEventListener("mousemove", (e) => {
        lastEvent = e;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          if (lastEvent) {
            const rect = card.getBoundingClientRect();
            const x = (lastEvent.clientX - rect.left) / rect.width - 0.5;
            const y = (lastEvent.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotateY: x * MAX * 2,
              rotateX: -y * MAX * 2,
              transformPerspective: 800,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
          pending = false;
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          overwrite: "auto"
        });
      });
    });
  }

  /* ── 6. SCROLL PROGRESS ── */
  gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  /* ── 7. HERO ENTRY ── */
  if (!skippedHero && !reducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: [0.22, 1, 0.36, 1] }, delay: 0.15 });
    heroTl
      .fromTo(".hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(".hero-word",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1, stagger: 0.06 },
        "-=0.5")
      .fromTo(".hero-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
      .fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
      .fromTo(".hero-info", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1 }, "-=0.8")
      .fromTo(".hero-stat",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");
  }

  /* ── 8. EXPERTISE CARDS + HORIZONTAL SCROLL ── */
  const expertiseTrack = $("#expertise-track");
  const expertiseSection = $("#expertise");

  if (expertiseTrack && expertiseSection) {
    expertiseTrack.innerHTML = SKILLS.map((s, i) => `
      <article class="expertise-card">
        <div class="flex items-start justify-between">
          <span class="expertise-card__num">${String(i + 1).padStart(2, "0")} / ${s.cat}</span>
          <span class="expertise-card__num">${s.level}</span>
        </div>
        <h3 class="expertise-card__title">${s.name}</h3>
        <div class="expertise-card__meta">
          <span>Explore</span>
          <span class="expertise-card__arrow">→</span>
        </div>
      </article>
    `).join("");

    if (!reducedMotion && isFinePointer) {
      const getScrollAmount = () => {
        return expertiseTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.12);
      };

      gsap.to(expertiseTrack, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: expertiseSection,
          start: "top top",
          end: () => "+=" + (getScrollAmount() + window.innerHeight * 0.5),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    } else {
      const stickyEl = expertiseSection.querySelector(".expertise-sticky");
      if (stickyEl) stickyEl.style.overflowX = "auto";
    }
  }

  /* ── 9. SCRAMBLE TEXT ── */
  const scrambleChars = "!<>-_\\/[]{}—=+*^?#________";

  function scramble(el) {
    const original = el.getAttribute("data-text") || el.textContent;
    const length = original.length;
    let frame = 0;
    const maxFrames = 20;

    function tick() {
      const progress = frame / maxFrames;
      const revealed = Math.floor(progress * length);
      let result = "";

      for (let i = 0; i < length; i++) {
        if (i < revealed) result += original[i];
        else if (original[i] === " ") result += " ";
        else result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }

      el.textContent = result;
      frame++;
      if (frame <= maxFrames) requestAnimationFrame(tick);
      else el.textContent = original;
    }
    tick();
  }

  if (!reducedMotion) {
    $$(".scramble").forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => scramble(el)
      });
    });
  }

  /* ── 10. SECTION REVEAL ── */
  if (!reducedMotion) {
    $$(".reveal-text").forEach(el => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
        });
    });

    $$(".skill-card").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("is-visible")
      });

      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: "top 88%" }
        });
    });

    const skillsHeadline = $("#skills h2.font-serif");
    if (skillsHeadline) {
      gsap.fromTo(skillsHeadline,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
          scrollTrigger: { trigger: skillsHeadline, start: "top 88%" }
        });
    }

    const hello = $("#contact a.hello-link h2, #contact a[href^='mailto'] h2");
    if (hello) {
      gsap.fromTo(hello,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          scrollTrigger: { trigger: hello, start: "top 92%" }
        });
    }
  }

  /* ── 11. COUNTER ── */
  $$(".counter").forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: counter,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: () => { counter.textContent = Math.floor(obj.val); }
        });
      }
    });
  });

  /* ── 12. SIDE NAV SCROLL SPY ── */
  const sideDots = $$(".side-dot");

  function activateDot(id) {
    sideDots.forEach(d => {
      d.classList.toggle("active", d.getAttribute("data-section") === id);
    });
  }

  /* ── 13. BACK TO TOP ── */
  const backTop = $("#back-top");
  if (backTop) {
    backTop.addEventListener("click", () => {
      lenis.scrollTo(0, { duration: 1.4 });
      playSound("click");
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top -100%",
      end: "bottom bottom",
      onEnter: () => backTop.classList.add("is-visible"),
      onLeaveBack: () => backTop.classList.remove("is-visible")
    });
  }

  /* ── 14. TOP INDICATOR + SIDE NAV (gabung 1 ScrollTrigger) ── */
  const topCurrent = $(".top-indicator__current");
  const topLabel = $(".top-indicator__label");
  const sectionOrder = ["hero", "about", "expertise", "skills", "contact"];
  const sectionNames = { hero: "Intro", about: "About", expertise: "Expertise", skills: "Skills", contact: "Contact" };

  function setActiveSection(id) {
    const idx = sectionOrder.indexOf(id) + 1;
    if (topCurrent) topCurrent.textContent = String(idx).padStart(2, "0");
    if (topLabel) topLabel.textContent = sectionNames[id] || "";
    activateDot(id);
  }

  sectionOrder.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id)
    });
  });

  /* ── 15. SIDE NAV PERCENT (throttled) ── */
  const percentEl = $(".side-nav__percent");
  if (percentEl) {
    let lastPct = -1;
    lenis.on("scroll", ({ progress }) => {
      const pct = Math.round((progress || 0) * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        percentEl.textContent = pct + "%";
      }
    });
  }

  /* ── 16. QUOTE BREAK REVEAL ── */
  if (!reducedMotion) {
    const quoteWords = $$(".quote-word");
    if (quoteWords.length) {
      gsap.fromTo(quoteWords,
        { y: "110%", opacity: 0 },
        {
          y: "0%", opacity: 1,
          duration: 0.85,
          stagger: 0.03,
          ease: [0.22, 1, 0.36, 1],
          scrollTrigger: {
            trigger: ".quote-break",
            start: "top 78%"
          }
        });
    }
  }

  /* ── 17. TIME-AWARE GREETING ── */
  const greetingEl = $("#greeting");
  if (greetingEl) {
    const h = new Date().getHours();
    let greet = "Sekilas tentang gua";
    if (h >= 5 && h < 11) greet = "Selamat pagi — Sekilas tentang gua";
    else if (h >= 11 && h < 15) greet = "Selamat siang — Sekilas tentang gua";
    else if (h >= 15 && h < 18) greet = "Selamat sore — Sekilas tentang gua";
    else greet = "Selamat malam — Sekilas tentang gua";
    greetingEl.textContent = greet;
  }

  /* ── 18. HERO PARALLAX EXIT ── */
  if (!reducedMotion) {
    gsap.to("#hero .hero-title", {
      y: -60,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    gsap.to("#hero .hero-sub, #hero .hero-cta, #hero .hero-info", {
      y: -30,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  /* ── 19. HELLO GLOW FOLLOW CURSOR (throttled) ── */
  const helloLink = $(".hello-link");
  const helloGlow = $(".hello-glow");
  if (helloLink && helloGlow && isFinePointer) {
    let pending = false;
    let lastE = null;
    helloLink.addEventListener("mousemove", (e) => {
      lastE = e;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        if (lastE) {
          const rect = helloLink.getBoundingClientRect();
          gsap.to(helloGlow, {
            left: (lastE.clientX - rect.left) + "px",
            top: (lastE.clientY - rect.top) + "px",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
        pending = false;
      });
    });
  }

  /* ── 20. SECTION NUM CLIP REVEAL ── */
  if (!reducedMotion) {
    $$(".section-num").forEach(el => {
      gsap.fromTo(el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
          scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });
  }

  /* ── 21. REFRESH ── */
  setTimeout(() => ScrollTrigger.refresh(), 300);
}

/* ═══════════════════════════════════════════
   SPOTIFY PANEL
   ═══════════════════════════════════════════ */
const spotifyPanel = $("#spotify-panel");
const spotifyBackdrop = $("#spotify-backdrop");
const spotifyToggle = $("#spotify-toggle");
const spotifyClose = $("#spotify-close");
const spotifySearchInput = $("#spotify-search-input");
const spotifyTracklist = $("#spotify-tracklist");
const spotifyEmpty = $("#spotify-empty");
const spotifyMini = $("#spotify-mini");
const spotifyMiniEmbed = $("#spotify-mini-embed");
const spotifyMiniClose = $("#spotify-mini-close");
const spotifySearchLink = $("#spotify-search-link");
const spotifySearchText = $("#spotify-search-text");

/* ── Render tracklist ── */
function renderSpotifyTracks(filter = "") {
  if (!spotifyTracklist) return;
  const q = filter.trim().toLowerCase();
  const filtered = SPOTIFY_TRACKS.filter(t =>
    !q || t.name.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  );

  if (filtered.length > 0) {
    spotifyEmpty?.classList.remove("is-visible");
    spotifyTracklist.innerHTML = filtered.map((t, i) => `
      <li>
        <button type="button" class="spotify-track" data-track-id="${t.trackId}" data-track-name="${t.name}">
          <span class="spotify-track__num">${String(i + 1).padStart(2, "0")}</span>
          <span class="spotify-track__info">
            <span class="spotify-track__name">${t.name}</span>
            <span class="spotify-track__artist">${t.artist}</span>
          </span>
          <span class="spotify-track__play">▶</span>
        </button>
      </li>
    `).join("");

    // Attach click handler ke tiap track
    $$(".spotify-track").forEach(btn => {
      btn.addEventListener("click", () => {
        const trackId = btn.getAttribute("data-track-id");
        const trackName = btn.getAttribute("data-track-name");
        playTrackInMini(trackId, trackName);
      });
    });
    return;
  }

  // Kalau nggak ada hasil
  spotifyTracklist.innerHTML = "";
  spotifyEmpty?.classList.add("is-visible");

  if (q && spotifySearchLink) {
    spotifySearchLink.href = `https://open.spotify.com/search/${encodeURIComponent(q)}`;
    if (spotifySearchText) spotifySearchText.textContent = `Cari "${q}" di Spotify`;
  }
}

/* ── Play track di mini player ── */
function playTrackInMini(trackId, trackName) {
  if (!spotifyMini || !spotifyMiniEmbed || !trackId) return;
  spotifyMiniEmbed.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  spotifyMini.classList.add("is-visible");
  playSound("success");
  showToast("▶ Playing: " + trackName);

  // Scroll ke mini player
  setTimeout(() => {
    spotifyMini.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

/* ── Close mini player ── */
spotifyMiniClose?.addEventListener("click", () => {
  spotifyMini?.classList.remove("is-visible");
  if (spotifyMiniEmbed) spotifyMiniEmbed.src = "";
  playSound("click");
});

/* ── Initial render ── */
renderSpotifyTracks();

/* ── Search filter ── */
spotifySearchInput?.addEventListener("input", (e) => {
  renderSpotifyTracks(e.target.value);
});

/* ── Open / close panel ── */
function openSpotifyPanel() {
  if (!spotifyPanel) return;
  spotifyPanel.classList.add("is-open");
  spotifyBackdrop?.classList.add("is-open");
  spotifyToggle?.classList.add("is-active");
  spotifyPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => spotifySearchInput?.focus(), 350);
  playSound("click");
}

function closeSpotifyPanel() {
  if (!spotifyPanel) return;
  spotifyPanel.classList.remove("is-open");
  spotifyBackdrop?.classList.remove("is-open");
  spotifyToggle?.classList.remove("is-active");
  spotifyPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  playSound("click");
}

spotifyToggle?.addEventListener("click", () => {
  if (spotifyPanel?.classList.contains("is-open")) closeSpotifyPanel();
  else openSpotifyPanel();
});

spotifyClose?.addEventListener("click", closeSpotifyPanel);
spotifyBackdrop?.addEventListener("click", closeSpotifyPanel);

/* ── ESC to close ── */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && spotifyPanel?.classList.contains("is-open")) {
    closeSpotifyPanel();
  }
});