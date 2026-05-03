// ======================================
//   LUXE & EMBER CAFÉ v2 — SCRIPTS
// ======================================

document.addEventListener('DOMContentLoaded', () => {

  // ======== DAY / NIGHT MODE ========
  const html = document.documentElement;
  const modeFloat = document.getElementById('modeFloat');
  const modeFloatIcon = document.getElementById('modeFloatIcon');
  const modeFloatText = document.getElementById('modeFloatText');
  const modeToggle = document.getElementById('modeToggle');
  const modeIcon = document.getElementById('modeIcon');

  let isDark = localStorage.getItem('luxe-mode') === 'night';

  function applyMode(dark) {
    isDark = dark;
    html.setAttribute('data-mode', dark ? 'night' : 'day');
    localStorage.setItem('luxe-mode', dark ? 'night' : 'day');

    if (modeFloatIcon) modeFloatIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    if (modeFloatText) modeFloatText.textContent = dark ? 'Switch to Day' : 'Switch to Night';
    if (modeIcon) modeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelectorAll('[data-mode-set]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.modeSet === (dark ? 'night' : 'day'));
    });
  }

  applyMode(isDark);

  if (modeFloat) modeFloat.addEventListener('click', () => applyMode(!isDark));
  if (modeToggle) modeToggle.addEventListener('click', () => applyMode(!isDark));
  document.querySelectorAll('[data-mode-set]').forEach(btn => {
    btn.addEventListener('click', () => applyMode(btn.dataset.modeSet === 'night'));
  });

  // ======== RESERVATION CHIPS ========
  function setupChipGroup(groupName, inputId, defaultValue) {
    const input = document.getElementById(inputId);
    const buttons = document.querySelectorAll(`[data-chip-group="${groupName}"] .chip-btn`);
    if (!input || !buttons.length) return null;

    const activate = (value) => {
      input.value = value;
      buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.chipValue === value));
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', () => activate(btn.dataset.chipValue));
    });

    activate(input.value || defaultValue || buttons[0].dataset.chipValue);
    return { activate };
  }

  const occasionChipGroup = setupChipGroup('foccasion', 'foccasion', 'Just Us');

  // ======== NAVBAR ========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ======== SCROLL REVEAL ========
  const fadEls = document.querySelectorAll('.fade-in');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadEls.forEach(el => revObs.observe(el));

  // ======== AESTHETIC MOOD SLIDER ========
  const amBtns = document.querySelectorAll('.am-btn');
  const amPanels = document.querySelectorAll('.am-panel');

  if (amBtns.length && amPanels.length) {
    amBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amBtns.forEach(b => b.classList.remove('active'));
        amPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');

        const targetId = 'am-' + btn.dataset.target;
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
        }
      });
    });
  }

  // ======== CURATED PAIRINGS CAROUSEL ========
  const pSlides = document.querySelectorAll('.p-slide');
  const pDots = document.querySelectorAll('.pn-dot');
  const btnPrev = document.getElementById('pnPrev');
  const btnNext = document.getElementById('pnNext');
  
  if (pSlides.length && pDots.length && btnPrev && btnNext) {
    let currentSlide = 0;
    const totalSlides = pSlides.length;

    function goToSlide(index) {
      pSlides.forEach(s => s.classList.remove('active'));
      pDots.forEach(d => d.classList.remove('active'));
      
      currentSlide = index;
      
      // Handle bounds
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;
      
      pSlides[currentSlide].classList.add('active');
      pDots[currentSlide].classList.add('active');
    }

    btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    
    pDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        goToSlide(parseInt(e.target.dataset.index));
      });
    });
  }

  // ======== SHIFT TABS (About page) ========
  const shiftTabs = document.querySelectorAll('.shift-tab');
  const dayPanel = document.getElementById('dayPanel');
  const nightPanel = document.getElementById('nightPanel');

  shiftTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      shiftTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const s = tab.dataset.shift;
      if (dayPanel) dayPanel.classList.toggle('active', s === 'day');
      if (nightPanel) nightPanel.classList.toggle('active', s === 'night');
    });
  });

  // ======== BUILD YOUR DRINK ========
  const buildBtn = document.getElementById('buildBtn');
  if (buildBtn) {
    updateBuild();

    buildBtn.addEventListener('click', updateBuild);

    document.querySelectorAll('input[name="base"], input[name="flavor"], input[name="temp"]').forEach(inp => {
      inp.addEventListener('change', updateBuild);
    });

    function updateBuild() {
      const base = document.querySelector('input[name="base"]:checked')?.value || 'Espresso';
      const flavor = document.querySelector('input[name="flavor"]:checked')?.value || 'Caramel';
      const temp = document.querySelector('input[name="temp"]:checked')?.value || 'Hot';

      const nameMap = {
        'Espresso-Caramel-Hot': 'Caramel Ember',
        'Espresso-Vanilla-Hot': 'Vanilla Dream Shot',
        'Espresso-Hazelnut-Hot': 'Hazelnut Noir',
        'Espresso-Plain-Hot': 'Pure Ember',
        'Espresso-Caramel-Iced': 'Iced Caramel Shot',
        'Espresso-Vanilla-Iced': 'Vanilla Ice Brew',
        'Espresso-Plain-Iced': 'Cold Ember',
        'Espresso-Caramel-Blended': 'Caramel Frappé',
        'Espresso-Vanilla-Blended': 'Vanilla Bliss',
        'Milk-Caramel-Hot': 'Caramel Velvet',
        'Milk-Vanilla-Hot': 'Vanilla Steamer',
        'Milk-Hazelnut-Hot': 'Hazelnut Cloud',
        'Milk-Plain-Hot': 'Pure Milk Latte',
        'Milk-Caramel-Iced': 'Iced Caramel Milk',
        'Green Tea-Caramel-Hot': 'Caramel Matcha',
        'Green Tea-Vanilla-Iced': 'Vanilla Ice Matcha',
        'Green Tea-Plain-Iced': 'Pure Matcha Ice',
        'Cold Brew-Caramel-Iced': 'Caramel Cold Brew',
        'Cold Brew-Vanilla-Iced': 'Vanilla Night Brew',
        'Cold Brew-Plain-Iced': 'Midnight Cold Brew',
      };

      const key = `${base}-${flavor}-${temp}`;
      const name = nameMap[key] || `${temp} ${flavor} ${base}`;

      const descMap = {
        Hot: `A warming ${flavor.toLowerCase() === 'plain' ? '' : flavor.toLowerCase() + '-infused '}${base.toLowerCase()} — rich, comforting, and crafted to perfection.`,
        Iced: `A refreshing iced ${base.toLowerCase()}${flavor === 'Plain' ? '' : ' with ' + flavor.toLowerCase()} — chilled, smooth, and utterly satisfying.`,
        Blended: `A dreamy blended creation${flavor === 'Plain' ? '' : ' with ' + flavor.toLowerCase()} and ${base.toLowerCase()} — creamy, indulgent, and irresistible.`
      };

      const basePrice = { Hot: 200, Iced: 240, Blended: 280 };
      const extras = { 'Green Tea': 30, 'Cold Brew': 50 };
      const flavorAdd = (flavor !== 'Plain') ? 20 : 0;
      const price = (basePrice[temp] || 200) + (extras[base] || 0) + flavorAdd;
      const icons = { Hot: '☕', Iced: '🧊', Blended: '🌀' };

      const pName = document.getElementById('prevName');
      const pDesc = document.getElementById('prevDesc');
      const pPrice = document.getElementById('prevPrice');
      const pIcon = document.getElementById('prevIcon');

      if (pName) pName.textContent = name;
      if (pDesc) pDesc.textContent = descMap[temp];
      if (pPrice) pPrice.textContent = `₹${price}`;
      if (pIcon) pIcon.textContent = icons[temp];

      const preview = document.querySelector('.builder-preview');
      if (preview) { preview.style.animation = 'none'; void preview.offsetWidth; preview.style.animation = 'slideIn 0.4s ease'; }
    }
  }

  // ======== RESERVATION FORM ========
  window.submitReservation = function () {
    let valid = true;
    const checks = [
      { id: 'fname', errId: 'fnameErr', fn: v => v.trim().length >= 2 },
      { id: 'femail', errId: 'femailErr', fn: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'fdate', errId: 'fdateErr', fn: v => v !== '' },
      { id: 'fparty', errId: 'fpartyErr', fn: v => v.trim().length >= 1 },
    ];

    checks.forEach(({ id, errId, fn }) => {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el || !err) return;
      const ok = fn(el.value);
      err.classList.toggle('show', !ok);
      el.style.borderColor = ok ? 'var(--accent)' : '#e53935';
      if (!ok) valid = false;
    });

    if (valid) {
      const toast = document.getElementById('successToast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }

      // Reset form
      ['fname', 'femail', 'fdate', 'fparty', 'fnote', 'fstart_time', 'fend_time'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (id === 'fstart_time') el.value = '18:30';
          else if (id === 'fend_time') el.value = '20:00';
          else el.value = '';
          el.style.borderColor = '';
        }
      });
      if (occasionChipGroup) occasionChipGroup.activate('Just Us');
    }
  };

  // ======== GALLERY PANELS ========
  const galleryPanels = document.querySelectorAll('.gallery-panel');
  galleryPanels.forEach(panel => {
    panel.addEventListener('click', () => {
      galleryPanels.forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
    });
    panel.addEventListener('mouseenter', () => {
      galleryPanels.forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
    });
  });

  // ======== ADD TO ORDER BUTTON FEEDBACK ========
  document.querySelectorAll('.mi-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const orig = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = 'var(--accent)';
      this.style.color = '#fff';
      this.style.borderColor = 'var(--accent)';
      setTimeout(() => {
        this.textContent = orig;
        this.style.background = '';
        this.style.color = '';
        this.style.borderColor = '';
      }, 1500);
    });
  });

  // ======== CHATBOT ========
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMsgs = document.getElementById('chatMsgs');

  const replies = {
    menu: "Our menu features handcrafted coffees (₹180–₹320), cold brews, artisan desserts, and gourmet snacks. Top picks: <strong>Rose Gold Latte ₹320</strong>, <strong>Cloud Cold Brew ₹290</strong>, <strong>Gold Tiramisu ₹380</strong>! ☕",
    hours: "We're open every single day! ☕<br><strong>Day Phase</strong>: 08:00 – 16:00<br><strong>Night Phase</strong>: 16:00 – 02:00",
    location: "We're at <strong>12, Inner Circle, Connaught Place, New Delhi</strong> 📍 Nearest metro: Rajiv Chowk.",
    book: `Ready to reserve? Head to our <a href='contact.html' style='color:var(--accent)'>Book a Table</a> page. We'd love to have you! 🥂`,
    price: "Drinks start from ₹180. Desserts ₹290–₹380. Night menu specials ₹280–₹480. We believe every rupee is worth it! 💛",
    wifi: "Yes! Free high-speed Wi-Fi available. Ask our staff for the password. 📶",
    parking: "Good parking at Connaught Place. We recommend Metro (Rajiv Chowk station) for ease!",
    day: "Our Day Phase runs 08:00–16:00. Morning pours, single-origin coffees, artisan pastries. Come for breakfast or work! ☀️",
    night: "Night Phase: 16:00–02:00. The café transforms — cocktail-inspired brews, low lights, jazz. The city's best kept secret. 🌙",
    hi: "Hi! ☕ Welcome to Luxe & Ember! I'm Ember, your café guide. What can I help you with?",
    thanks: "Always a pleasure! We hope to see you at Luxe & Ember very soon. ☕✨",
    default: "I'd love to help! Try asking me about our <strong>menu</strong>, <strong>hours</strong>, <strong>location</strong>, <strong>booking</strong>, <strong>wifi</strong>, <strong>day phase</strong>, or <strong>night phase</strong>. 😊"
  };

  function getReply(msg) {
    const m = msg.toLowerCase();
    if (m.match(/^h[iae]/)) return replies.hi;
    if (m.includes('menu') || m.includes('drink') || m.includes('coffee') || m.includes('food')) return replies.menu;
    if (m.includes('hour') || m.includes('open') || m.includes('time') || m.includes('close')) return replies.hours;
    if (m.includes('locat') || m.includes('where') || m.includes('address') || m.includes('find')) return replies.location;
    if (m.includes('book') || m.includes('reserv') || m.includes('table')) return replies.book;
    if (m.includes('price') || m.includes('cost') || m.includes('much')) return replies.price;
    if (m.includes('wifi') || m.includes('internet') || m.includes('wi-fi')) return replies.wifi;
    if (m.includes('park')) return replies.parking;
    if (m.includes('day')) return replies.day;
    if (m.includes('night') || m.includes('after')) return replies.night;
    if (m.includes('thank')) return replies.thanks;
    return replies.default;
  }

  function addMsg(text, type) {
    if (!chatMsgs) return;
    const div = document.createElement('div');
    div.className = `cmsg ${type}`;
    const p = document.createElement('p');
    p.innerHTML = text;
    div.appendChild(p);
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function sendMsg() {
    const msg = chatInput?.value?.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    chatInput.value = '';
    setTimeout(() => addMsg(getReply(msg), 'bot'), 500);
  }

  if (chatToggle) chatToggle.addEventListener('click', () => chatPanel?.classList.toggle('open'));
  if (chatClose) chatClose.addEventListener('click', () => chatPanel?.classList.remove('open'));
  if (chatSend) chatSend.addEventListener('click', sendMsg);
  if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });

  // ======== PREMIUM EFFECTS (Spotlight & Steam/Embers) ========
  const spotlight = document.getElementById('cursorSpotlight');
  const canvas = document.getElementById('particleCanvas');
  let ctx, particles = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.reset();
        // Start from mouse position with a bit of scatter
        this.x = mouseX + (Math.random() - 0.5) * 40;
        this.y = mouseY + (Math.random() - 0.5) * 40;
        this.life = Math.random() * 0.5 + 0.5; // Start with some life to avoid immediate death
      }
      reset() {
        this.x = mouseX + (Math.random() - 0.5) * 20;
        this.y = mouseY + (Math.random() - 0.5) * 20;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 1) * 1.2 - 0.5; // Float upwards
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.size = Math.random() * 3 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size += 0.05; // Expand slightly as it rises
        if (this.life <= 0) this.reset();
      }
      draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Night mode uses gold embers, day mode uses soft steam
        const isNight = document.documentElement.getAttribute('data-mode') === 'night';
        const rgb = isNight ? '201, 168, 76' : '106, 66, 38';
        const baseAlpha = isNight ? 0.6 : 0.15;

        ctx.fillStyle = `rgba(${rgb}, ${this.life * baseAlpha})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < 40; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // Update mouse position for both effects
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (spotlight) {
      // Offset by half the width/height (250px) because translate(-50%, -50%) 
      // doesn't update the transform origin dynamically with translate in this context easily
      // actually left/top is cleaner
      spotlight.style.left = mouseX + 'px';
      spotlight.style.top = mouseY + 'px';
    }
  });

  // ======== THE GUESTBOOK REEL INTERACTION ========
  const gbReel = document.getElementById('guestbookReel');
  const gbBar = document.getElementById('gbBar');
  
  if (gbReel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    gbReel.addEventListener('mousedown', (e) => {
      isDown = true;
      gbReel.classList.add('active');
      startX = e.pageX - gbReel.offsetLeft;
      scrollLeft = gbReel.scrollLeft;
    });

    gbReel.addEventListener('mouseleave', () => {
      isDown = false;
    });

    gbReel.addEventListener('mouseup', () => {
      isDown = false;
      gbReel.classList.remove('active');
    });

    gbReel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gbReel.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      gbReel.scrollLeft = scrollLeft - walk;
    });

    // Update Progress Bar
    gbReel.addEventListener('scroll', () => {
      const maxScroll = gbReel.scrollWidth - gbReel.clientWidth;
      const progress = (gbReel.scrollLeft / maxScroll) * 100;
      if (gbBar) gbBar.style.width = `${progress}%`;
    });

    // Button Navigation
    const btnPrev = document.getElementById('gbPrev');
    const btnNext = document.getElementById('gbNext');

    if (btnPrev && btnNext) {
      btnNext.addEventListener('click', () => {
        gbReel.scrollBy({ left: 480, behavior: 'smooth' }); // Card width + gap
      });
      btnPrev.addEventListener('click', () => {
        gbReel.scrollBy({ left: -480, behavior: 'smooth' });
      });
    }
  }
  // ======== MASTERFUL HOVER-REVEAL MENU ========
  const masterfulItems = document.querySelectorAll('.masterful-item');
  const previewBox = document.getElementById('menu-preview-container');
  const previewImg = document.getElementById('menu-preview-img');

  if (masterfulItems.length && previewBox && previewImg) {
    masterfulItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const imgSrc = item.dataset.img;
        previewImg.src = imgSrc;
        previewBox.classList.add('active');
      });

      item.addEventListener('mouseleave', () => {
        previewBox.classList.remove('active');
      });

      item.addEventListener('mousemove', (e) => {
        // Smoothly follow the cursor
        const x = e.clientX;
        const y = e.clientY;
        previewBox.style.left = x + 'px';
        previewBox.style.top = y + 'px';
      });
    });
  }
  // ======== MENU HERO GLOW FOLLOWER ========
  const menuHero = document.querySelector('.menu-hero');
  const heroGlow = document.getElementById('heroGlow');

  if (menuHero && heroGlow) {
    menuHero.addEventListener('mousemove', (e) => {
      const rect = menuHero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Centering the glow on the cursor
      heroGlow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
  }
  // ======== CINEMATIC SENSORY FOCUS ========
  const refinedCards = document.querySelectorAll('.refined-menu-card');
  const sensoryTag = document.getElementById('sensory-tag');

  if (refinedCards.length && sensoryTag) {
    refinedCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        sensoryTag.innerText = card.dataset.flavor;
        sensoryTag.classList.add('active');
      });

      card.addEventListener('mouseleave', () => {
        sensoryTag.classList.remove('active');
        card.style.transform = `scale(1) rotateX(0) rotateY(0)`;
      });

      card.addEventListener('mousemove', (e) => {
        // Tag movement
        sensoryTag.style.left = e.clientX + 'px';
        sensoryTag.style.top = e.clientY + 'px';

        // Subtle 3D Tilt
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });
  }

});