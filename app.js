/* ============================================
   DHAROHAR — Application JavaScript
   India's Living Heritage Platform
   ============================================ */

// =========== STATE ===========
let currentPage = 'landing'; // 'landing' | 'jhansi'
let fortRotation = 0;
let fortZoom = 1;

// =========== INITIALIZATION ===========
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollAnimations();
  initSearch();
  initMapInteraction();
  initFort3D();
});

// =========== NAVIGATION ===========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function navigateToJhansi() {
  if (currentPage === 'jhansi') return;

  const overlay = document.getElementById('pageTransition');
  overlay.classList.add('active');

  setTimeout(() => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('jhansi-page').classList.add('visible');
    currentPage = 'jhansi';

    // Update nav
    document.getElementById('nav-home').classList.remove('active');
    document.getElementById('nav-explore').classList.add('active');

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Re-trigger scroll animations
    setTimeout(() => {
      initScrollAnimations();
      overlay.classList.remove('active');
    }, 400);
  }, 800);
}

function navigateToLanding() {
  if (currentPage === 'landing') return;

  const overlay = document.getElementById('pageTransition');
  overlay.querySelector('.transition-text').textContent = 'Returning to Dharohar…';
  overlay.classList.add('active');

  setTimeout(() => {
    document.getElementById('jhansi-page').classList.remove('visible');
    document.getElementById('landing-page').style.display = '';
    currentPage = 'landing';

    // Update nav
    document.getElementById('nav-explore').classList.remove('active');
    document.getElementById('nav-home').classList.add('active');

    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.querySelector('.transition-text').textContent = 'Entering Jhansi…';
    }, 400);
  }, 800);
}

// =========== HERO PARTICLES ===========
function initParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const container = canvas;
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(232, 173, 53, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite alternate;
      animation-delay: ${Math.random() * -10}s;
    `;
    container.appendChild(p);
  }

  // Add particle animation keyframes
  if (!document.getElementById('particleStyles')) {
    const style = document.createElement('style');
    style.id = 'particleStyles';
    style.textContent = `
      @keyframes particleFloat {
        0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        50% { opacity: 0.8; }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100 + 30}px, ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100 + 30}px) scale(${Math.random() + 0.5}); opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }
}

// =========== SCROLL ANIMATIONS ===========
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    // Reset visibility so re-observation works
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    } else {
      // Re-observe already visible items for page transitions
      observer.observe(el);
    }
  });
}

// =========== SEARCH ===========
function initSearch() {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  const resultsDiv = document.getElementById('searchResults');

  const searchItems = [
    { name: 'Jhansi', type: 'City', desc: 'Heritage capital of Bundelkhand', action: () => navigateToJhansi() },
    { name: 'Jhansi Fort', type: 'Monument', desc: 'Historic fort built in 1613', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('jhansiFort'), 1200); } },
    { name: 'Rani Lakshmibai', type: 'Historical Figure', desc: 'Queen of Jhansi, 1857 uprising leader', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('raniSection'), 1200); } },
    { name: 'Rani Mahal', type: 'Palace', desc: 'Royal palace of Jhansi queens', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('heritageMap'), 1200); } },
    { name: 'Bundelkhand', type: 'Region', desc: 'Historic cultural region in central India', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('bundelkhandConnection'), 1200); } },
    { name: 'Folk Dance', type: 'Culture', desc: 'Rai, Badhai and other folk dances', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('livingCulture'), 1200); } },
    { name: 'Bundeli Language', type: 'Language', desc: 'Western Hindi dialect of Bundelkhand', action: () => { navigateToJhansi(); setTimeout(() => scrollToSection('livingCulture'), 1200); } },
  ];

  function performSearch() {
    const query = input.value.toLowerCase().trim();
    if (!query) {
      resultsDiv.style.display = 'none';
      return;
    }

    const matches = searchItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsDiv.innerHTML = `
        <div style="background:var(--bg-glass); backdrop-filter:blur(12px); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; text-align:center;">
          <p style="color:var(--text-tertiary); font-size:0.85rem;">No results found. Try "Jhansi", "Fort", or "Culture".</p>
        </div>
      `;
      resultsDiv.style.display = 'block';
      return;
    }

    resultsDiv.innerHTML = matches.map(item => `
      <div class="search-result-item" style="
        background: var(--bg-glass);
        backdrop-filter: blur(12px);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 12px 16px;
        margin-bottom: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease;
      " onmouseenter="this.style.borderColor='rgba(232,173,53,0.4)'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.06)'" onclick="handleSearchClick('${item.name}')">
        <div>
          <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary);">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-tertiary);">${item.type} — ${item.desc}</div>
        </div>
        <span style="color:var(--gold-400); font-size:0.8rem;">→</span>
      </div>
    `).join('');
    resultsDiv.style.display = 'block';
  }

  // Store search items globally for click handler
  window._searchItems = searchItems;

  input.addEventListener('input', performSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  btn.addEventListener('click', performSearch);

  // Close results on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero__search')) {
      resultsDiv.style.display = 'none';
    }
  });
}

function handleSearchClick(name) {
  const item = window._searchItems.find(i => i.name === name);
  if (item) {
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('searchInput').value = '';
    item.action();
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =========== MAP INTERACTION ===========
function initMapInteraction() {
  // Click on UP state or Jhansi marker
  const upState = document.getElementById('up-state');
  if (upState) {
    upState.addEventListener('click', () => navigateToJhansi());
  }

  // Click on Jhansi dot
  const jhDots = document.querySelectorAll('.jhansi-dot');
  jhDots.forEach(dot => {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => navigateToJhansi());
  });

  // Click on Jhansi label group
  const labelGroup = document.querySelector('.jhansi-label-group');
  if (labelGroup) {
    labelGroup.style.cursor = 'pointer';
  }
}

// =========== HERITAGE CARD (MAP MARKERS) ===========
const heritageData = {
  'fort': {
    name: 'Jhansi Fort (Jhansi ka Qila)',
    type: 'Fort / Military Architecture',
    importance: 'The most significant historical monument in Jhansi, central to the 1857 uprising.',
    desc: 'Built in 1613 by Raja Bir Singh Deo of Orchha on Bangira hill, this imposing granite fort covers about 15 acres. It served as the seat of power for the rulers of Jhansi and is closely associated with Rani Lakshmibai\'s defense during the 1857 revolt. Key features include the Panch Mahal, Shiv Temple, and the Kadak Bijli cannon.',
    image: 'assets/images/jhansi-fort-hero.jpg'
  },
  'rani-mahal': {
    name: 'Rani Mahal',
    type: 'Palace / Royal Residence',
    importance: 'The palace of the queens of Jhansi, now an archaeological museum.',
    desc: 'Rani Mahal is a palace located in the heart of Jhansi city. Originally the residence of the queens of Jhansi, it was used by Rani Lakshmibai. The palace features Bundelkhandi architectural elements with ornate carvings, arched corridors, and a small courtyard. It now functions as an archaeological museum managed by the ASI.',
    image: 'assets/images/rani-mahal.jpg'
  },
  'space-museum': {
    name: 'Jhansi Space Museum',
    type: 'Museum',
    importance: 'A modern space museum exploring the universe and space exploration.',
    desc: 'The Jhansi Space Museum offers an interactive journey into astronomy and space science. Featuring state-of-the-art exhibits, it aims to educate visitors about the wonders of the cosmos, satellite technology, and India\'s contributions to space exploration.',
    image: 'assets/images/jhansi-overview.jpg'
  },
  'st-jude': {
    name: 'St. Jude\'s Shrine',
    type: 'Religious Site / Church',
    importance: 'One of the few Catholic shrines in the region, reflecting Jhansi\'s diverse religious heritage.',
    desc: 'St. Jude\'s Shrine in Jhansi is a Roman Catholic church dedicated to St. Jude, the patron saint of hopeless causes. It attracts pilgrims from across India, particularly during the annual feast of St. Jude. The shrine represents the religious diversity and historical Christian presence in the Bundelkhand region.',
    image: 'assets/images/jhansi-overview.jpg'
  },
  'barua-sagar': {
    name: 'Barua Sagar',
    type: 'Historical Site / Lake',
    importance: 'A historic town near Jhansi with a fort and ancient lake built during the Chandela period.',
    desc: 'Barua Sagar, located about 24 km from Jhansi, features an ancient dam believed to have been constructed during the Chandela period (9th-12th century). The site includes a fort and several temples. The Battle of Barua Sagar (1858) during the Indian Rebellion also took place here.',
    image: 'assets/images/jhansi-overview.jpg'
  }
};

function openHeritageCard(id) {
  const data = heritageData[id];
  if (!data) return;

  document.getElementById('hcImage').src = data.image;
  document.getElementById('hcImage').alt = data.name;
  document.getElementById('hcType').textContent = data.type;
  document.getElementById('hcName').textContent = data.name;
  document.getElementById('hcImportance').textContent = data.importance;
  document.getElementById('hcDesc').textContent = data.desc;

  document.getElementById('heritageCardOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeHeritageCard(event, force) {
  if (force || event.target === document.getElementById('heritageCardOverlay')) {
    document.getElementById('heritageCardOverlay').classList.remove('active');
    document.body.style.overflow = '';
    event.stopPropagation();
  }
}

// =========== JHANSI FORT 3D VIEWER ===========
function initFort3D() {
  const canvas = document.getElementById('fortCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  fortRotation = 0;
  fortZoom = 1;

  // Draw the fort wireframe
  function drawFort() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(fortZoom, fortZoom);

    const rotRad = (fortRotation * Math.PI) / 180;
    const perspective = 0.4;

    // Colors
    const wallColor = 'rgba(232, 173, 53, 0.6)';
    const wallFill = 'rgba(232, 173, 53, 0.08)';
    const towerColor = 'rgba(232, 173, 53, 0.8)';
    const groundColor = 'rgba(232, 173, 53, 0.15)';

    // 3D rotation helpers
    function project(x, y, z) {
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);
      const rx = x * cosR - z * sinR;
      const rz = x * sinR + z * cosR;
      const scale = 1 / (1 + rz * 0.001);
      return {
        x: rx * scale,
        y: (y - rz * perspective * 0.15) * scale,
        z: rz
      };
    }

    // Fort base (hill/platform)
    ctx.beginPath();
    const hillPts = [];
    for (let angle = 0; angle < 360; angle += 10) {
      const rad = (angle * Math.PI) / 180;
      const radius = 200 + Math.sin(rad * 3) * 20;
      const p = project(Math.cos(rad) * radius, 60, Math.sin(rad) * radius * 0.6);
      hillPts.push(p);
    }
    ctx.moveTo(hillPts[0].x, hillPts[0].y);
    hillPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = groundColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(232, 173, 53, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Fort walls (rectangular shape with perspective)
    const wallH = 80;
    const fortW = 160;
    const fortD = 100;

    // Define corners bottom
    const corners = [
      { x: -fortW, y: 0, z: -fortD },
      { x: fortW, y: 0, z: -fortD },
      { x: fortW, y: 0, z: fortD },
      { x: -fortW, y: 0, z: fortD }
    ];
    const topCorners = corners.map(c => ({ ...c, y: -wallH }));

    // Project all corners
    const pBot = corners.map(c => project(c.x, c.y, c.z));
    const pTop = topCorners.map(c => project(c.x, c.y, c.z));

    // Draw walls with depth sorting
    const walls = [
      { bot: [pBot[0], pBot[1]], top: [pTop[0], pTop[1]], z: (corners[0].z + corners[1].z) / 2, label: 'North Wall' },
      { bot: [pBot[1], pBot[2]], top: [pTop[1], pTop[2]], z: (corners[1].z + corners[2].z) / 2, label: 'East Wall' },
      { bot: [pBot[2], pBot[3]], top: [pTop[2], pTop[3]], z: (corners[2].z + corners[3].z) / 2, label: 'South Wall' },
      { bot: [pBot[3], pBot[0]], top: [pTop[3], pTop[0]], z: (corners[3].z + corners[0].z) / 2, label: 'West Wall' }
    ];

    // Sort by z (back to front)
    const rCorners = corners.map(c => {
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);
      return { ...c, rz: c.x * sinR + c.z * cosR };
    });

    const wallOrder = [0, 1, 2, 3].sort((a, b) => {
      const azMid = (rCorners[a].rz + rCorners[(a + 1) % 4].rz) / 2;
      const bzMid = (rCorners[b].rz + rCorners[(b + 1) % 4].rz) / 2;
      return bzMid - azMid;
    });

    wallOrder.forEach(i => {
      const wall = walls[i];
      ctx.beginPath();
      ctx.moveTo(wall.bot[0].x, wall.bot[0].y);
      ctx.lineTo(wall.bot[1].x, wall.bot[1].y);
      ctx.lineTo(wall.top[1].x, wall.top[1].y);
      ctx.lineTo(wall.top[0].x, wall.top[0].y);
      ctx.closePath();
      ctx.fillStyle = wallFill;
      ctx.fill();
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Battlements (crenellations)
      const numCren = 8;
      for (let j = 0; j < numCren; j++) {
        const t1 = j / numCren;
        const t2 = (j + 0.4) / numCren;
        const cx1 = wall.top[0].x + (wall.top[1].x - wall.top[0].x) * t1;
        const cy1 = wall.top[0].y + (wall.top[1].y - wall.top[0].y) * t1;
        const cx2 = wall.top[0].x + (wall.top[1].x - wall.top[0].x) * t2;
        const cy2 = wall.top[0].y + (wall.top[1].y - wall.top[0].y) * t2;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx1, cy1 - 10);
        ctx.lineTo(cx2, cy2 - 10);
        ctx.lineTo(cx2, cy2);
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Corner towers
    const towerR = 18;
    const towerH = wallH + 25;
    corners.forEach((c, i) => {
      const bot = project(c.x, c.y, c.z);
      const top = project(c.x, -towerH, c.z);

      // Tower body
      ctx.beginPath();
      ctx.moveTo(bot.x - towerR * 0.7, bot.y);
      ctx.lineTo(bot.x + towerR * 0.7, bot.y);
      ctx.lineTo(top.x + towerR * 0.7, top.y);
      ctx.lineTo(top.x - towerR * 0.7, top.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(232, 173, 53, 0.12)';
      ctx.fill();
      ctx.strokeStyle = towerColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tower top (dome)
      ctx.beginPath();
      ctx.arc(top.x, top.y - 5, towerR * 0.6, Math.PI, 0);
      ctx.strokeStyle = towerColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Central structure (Panch Mahal)
    const innerW = 50;
    const innerD = 35;
    const innerH = 55;
    const innerCorners = [
      { x: -innerW, y: 0, z: -innerD },
      { x: innerW, y: 0, z: -innerD },
      { x: innerW, y: 0, z: innerD },
      { x: -innerW, y: 0, z: innerD }
    ];
    const innerTop = innerCorners.map(c => ({ ...c, y: -innerH }));

    const pInBot = innerCorners.map(c => project(c.x, c.y, c.z));
    const pInTop = innerTop.map(c => project(c.x, c.y, c.z));

    // Draw inner structure
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      ctx.beginPath();
      ctx.moveTo(pInBot[i].x, pInBot[i].y);
      ctx.lineTo(pInBot[next].x, pInBot[next].y);
      ctx.lineTo(pInTop[next].x, pInTop[next].y);
      ctx.lineTo(pInTop[i].x, pInTop[i].y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(232, 173, 53, 0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(232, 173, 53, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Dome on central structure
    const domeCenter = project(0, -innerH, 0);
    const domeTop = project(0, -innerH - 30, 0);
    ctx.beginPath();
    ctx.moveTo(pInTop[0].x, pInTop[0].y);
    ctx.quadraticCurveTo(domeTop.x, domeTop.y, pInTop[1].x, pInTop[1].y);
    ctx.strokeStyle = 'rgba(232, 173, 53, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pInTop[3].x, pInTop[3].y);
    ctx.quadraticCurveTo(domeTop.x, domeTop.y, pInTop[2].x, pInTop[2].y);
    ctx.stroke();

    // Gate (front)
    const gateMid = project(0, 0, -fortD);
    const gateTop = project(0, -wallH * 0.7, -fortD);
    ctx.beginPath();
    ctx.moveTo(gateMid.x - 15, gateMid.y);
    ctx.lineTo(gateMid.x + 15, gateMid.y);
    ctx.lineTo(gateTop.x + 15, gateTop.y);
    ctx.arc(gateTop.x, gateTop.y, 15, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(232, 173, 53, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(232, 173, 53, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Flag on top
    const flagBase = project(0, -innerH - 30, 0);
    const flagTop2 = project(0, -innerH - 55, 0);
    ctx.beginPath();
    ctx.moveTo(flagBase.x, flagBase.y);
    ctx.lineTo(flagTop2.x, flagTop2.y);
    ctx.strokeStyle = 'rgba(232, 173, 53, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Flag
    ctx.beginPath();
    ctx.moveTo(flagTop2.x, flagTop2.y);
    ctx.lineTo(flagTop2.x + 20, flagTop2.y + 5);
    ctx.lineTo(flagTop2.x, flagTop2.y + 10);
    ctx.fillStyle = 'rgba(232, 173, 53, 0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(232, 173, 53, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(232, 173, 53, 0.5)';
    ctx.font = '11px Outfit, sans-serif';
    ctx.textAlign = 'center';

    const labelPanch = project(0, -innerH - 5, 0);
    ctx.fillText('Panch Mahal', labelPanch.x, labelPanch.y - 40);

    const labelGate = project(0, -wallH * 0.8, -fortD - 15);
    ctx.fillText('Main Gate', labelGate.x, labelGate.y);

    ctx.restore();
  }

  // Initial draw
  drawFort();

  // Drag to rotate
  let isDragging = false;
  let lastX = 0;
  const canvasEl = document.getElementById('fort3dCanvas');

  canvasEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    canvasEl.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    fortRotation += dx * 0.5;
    lastX = e.clientX;
    drawFort();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (canvasEl) canvasEl.style.cursor = 'grab';
  });

  // Touch support
  canvasEl.addEventListener('touchstart', (e) => {
    isDragging = true;
    lastX = e.touches[0].clientX;
  }, { passive: true });

  canvasEl.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - lastX;
    fortRotation += dx * 0.5;
    lastX = e.touches[0].clientX;
    drawFort();
  }, { passive: true });

  canvasEl.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Scroll to zoom (only with Ctrl held, so normal page scrolling works)
  canvasEl.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return; // Allow normal scrolling
    e.preventDefault();
    fortZoom += e.deltaY > 0 ? -0.05 : 0.05;
    fortZoom = Math.max(0.5, Math.min(2, fortZoom));
    drawFort();
  }, { passive: false });

  // Store draw function globally for controls
  window._drawFort = drawFort;
}

function rotateFort(degrees) {
  fortRotation += degrees;
  if (window._drawFort) window._drawFort();
}

function zoomFort(delta) {
  fortZoom = Math.max(0.5, Math.min(2, fortZoom + delta));
  if (window._drawFort) window._drawFort();
}

function resetFortView() {
  fortRotation = 0;
  fortZoom = 1;
  if (window._drawFort) window._drawFort();
}

// =========== ADD YOUR HERITAGE LOGIC ===========
let currentCategory = '';
let isRecording = false;
let mockTranscriptText = 'Hamare gaon mein har saal ye parampara hoti hai. Hum mitti se sundar bartan banate hain...';
let recordingInterval;

function openHeritageForm() {
  document.getElementById('heritageFormOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  nextStep(1); // Reset to step 1
}

function closeHeritageForm() {
  document.getElementById('heritageFormOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function nextStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`formStep${step}`).classList.add('active');
}

function selectCategory(cat) {
  currentCategory = cat;
  
  if (cat === 'Artisan / Knowledge Keeper') {
    document.getElementById('standardForm').style.display = 'none';
    document.getElementById('artisanForm').style.display = 'block';
    document.getElementById('step3Title').textContent = 'Artisan Details';
  } else {
    document.getElementById('standardForm').style.display = 'block';
    document.getElementById('artisanForm').style.display = 'none';
    document.getElementById('step3Title').textContent = `Share Details: ${cat}`;
  }
  nextStep(3);
}

function toggleRecord() {
  const btn = document.getElementById('btnRecord');
  if (!isRecording) {
    isRecording = true;
    btn.classList.add('recording');
    btn.innerHTML = '🛑 Stop Recording';
  } else {
    isRecording = false;
    btn.classList.remove('recording');
    btn.innerHTML = '🎙️ Record Your Story';
    
    // Show transcript
    document.getElementById('transcriptArea').style.display = 'block';
    document.getElementById('hTranscript').value = mockTranscriptText;
  }
}

function playMockRecording() {
  alert('Playing mock recording...');
}

function simulateAI() {
  nextStep(4);
  setTimeout(() => {
    // Generate mock AI output based on category
    let aiContent = '';
    
    if (currentCategory === 'Artisan / Knowledge Keeper') {
      const aName = document.getElementById('aName').value || 'Anonymous Artisan';
      const aVillage = document.getElementById('aVillage').value || 'Jhansi District';
      const aCraft = document.getElementById('aCraft').value || 'Traditional Craft';
      
      aiContent = `
        <p><strong>Category:</strong> ${currentCategory}</p>
        <p><strong>Knowledge Keeper:</strong> ${aName}</p>
        <p><strong>Location:</strong> ${aVillage}</p>
        <p><strong>Craft/Skill:</strong> ${aCraft}</p>
      `;
    } else {
      const hName = document.getElementById('hName').value || 'Untitled Heritage';
      const hVillage = document.getElementById('hVillage').value || 'Jhansi District';
      
      aiContent = `
        <p><strong>Heritage Name:</strong> ${hName}</p>
        <p><strong>Category:</strong> ${currentCategory}</p>
        <p><strong>Location:</strong> ${hVillage}, Jhansi</p>
        <p><strong>Description:</strong> ${document.getElementById('hTranscript').value || document.getElementById('hDesc').value || 'No description provided.'}</p>
      `;
    }
    
    document.getElementById('aiResult').innerHTML = aiContent;
    nextStep(5);
  }, 2000);
}

function showFinalCard() {
  const finalCard = document.getElementById('finalCard');
  
  if (currentCategory === 'Artisan / Knowledge Keeper') {
    finalCard.innerHTML = `
      <h3>👨‍🎨 ${document.getElementById('aName').value || 'Anonymous Artisan'}</h3>
      <div class="meta">📍 ${document.getElementById('aVillage').value || 'Jhansi'} • 🧵 ${document.getElementById('aCraft').value || 'Traditional Craft'}</div>
      <div class="desc">"${document.getElementById('aDesc').value || document.getElementById('aWhat').value || 'Local knowledge keeper'}"</div>
    `;
  } else {
    finalCard.innerHTML = `
      <h3>🏛️ ${document.getElementById('hName').value || 'Untitled Heritage'}</h3>
      <div class="meta">📍 ${document.getElementById('hVillage').value || 'Jhansi'} • ✨ ${currentCategory}</div>
      <div class="desc">"${document.getElementById('hTranscript').value || document.getElementById('hDesc').value || 'A local tradition'}"</div>
      <button class="btn-ghost" style="padding:0;" onclick="playMockRecording()">🎙️ Listen to the original story</button>
    `;
  }
  
  nextStep(6);
}

/* ============================================
   SANSKRITI SETU AI CHATBOT LOGIC
   ============================================ */

function openSanskritiChat(initialContext = '') {
  document.getElementById('sanskritiChatOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  if (initialContext && typeof initialContext === 'string') {
    addChatMessage(`Hi! I'm ready to answer questions about ${initialContext}.`, 'ai');
  } else if (document.getElementById('chatMessages').children.length === 0) {
    addChatMessage('Namaste! I am Sanskriti Setu AI. You can ask me anything about Jhansi\'s rich history, forts, culture, traditions, or Rani Lakshmibai.', 'ai');
  }
}

function closeSanskritiChat() {
  document.getElementById('sanskritiChatOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleChatVoice() {
  const btn = document.getElementById('chatMicBtn');
  if (btn.classList.contains('recording')) {
    btn.classList.remove('recording');
    document.getElementById('chatInput').value = "Jhansi Fort kab bana tha?";
    setTimeout(handleChatSubmit, 500);
  } else {
    btn.classList.add('recording');
  }
}

function handleChatSubmit() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  
  input.value = '';
  sendChatMessage(msg);
}

function sendChatMessage(msg) {
  addChatMessage(msg, 'user');
  
  const typingId = 'typing-' + Date.now();
  addChatMessage('<span class="ai-typing">...</span>', 'ai', typingId);
  
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if(typingEl) typingEl.remove();
    generateMockAIResponse(msg);
  }, 1000);
}

function addChatMessage(htmlContent, sender, id = null) {
  const messagesContainer = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-bubble ${sender}-msg`;
  if (id) div.id = id;
  
  div.innerHTML = htmlContent;
  messagesContainer.appendChild(div);
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateMockAIResponse(prompt) {
  const query = prompt.toLowerCase();
  const lang = document.getElementById('chatLanguage').value;
  let response = '';
  
  if (query.includes('fort') || query.includes('qila') || query.includes('kab bana')) {
    if (lang === 'hi') {
      response = `
        <p>झांसी का किला (Jhansi Fort) 1613 में ओरछा के राजा बीर सिंह जू देव बुंदेला द्वारा बनवाया गया था। यह किला बंगिरा नामक पहाड़ी पर स्थित है।</p>
        <p>क्या आप इसके बारे में और जानना चाहते हैं?</p>
        <div class="chat-source">Source: Verified Historical Database</div>
        <div class="chat-actions">
          <button class="chat-btn" onclick="document.getElementById('fort3dViewer').scrollIntoView(); closeSanskritiChat();">Explore Jhansi Fort</button>
          <button class="chat-btn" onclick="scrollToSection('heritageMap'); closeSanskritiChat();">View on Map</button>
        </div>
      `;
    } else if (lang === 'bu') {
      response = `
        <p>झांसी को किलो (Jhansi Fort) 1613 में ओरछा के राजा बीर सिंह जू देव बुंदेला जू ने बनवाओ हतो। ई किलो बंगिरा नाम की पहाड़िया पे बनो है।</p>
        <p>का तुम ईके बारे में और जानवे की चाहत हो?</p>
        <div class="chat-source">Source: Verified Historical Database</div>
        <div class="chat-actions">
          <button class="chat-btn" onclick="document.getElementById('fort3dViewer').scrollIntoView(); closeSanskritiChat();">Explore Jhansi Fort</button>
          <button class="chat-btn" onclick="scrollToSection('heritageMap'); closeSanskritiChat();">View on Map</button>
        </div>
      `;
    } else {
      response = `
        <p>Jhansi Fort is one of the major historical landmarks of Jhansi. It was built in 1613 by Raja Bir Singh Deo of Orchha on Bangira hill.</p>
        <p>It is closely associated with the history of Jhansi and Rani Lakshmibai, particularly during the events of 1857.</p>
        <p>Would you like to explore it further?</p>
        <div class="chat-source">Sources: • Heritage database • Government historical source</div>
        <div class="chat-actions">
          <button class="chat-btn" onclick="document.getElementById('fort3dViewer').scrollIntoView(); closeSanskritiChat();">Explore Jhansi Fort</button>
          <button class="chat-btn" onclick="scrollToSection('heritageMap'); closeSanskritiChat();">View on Map</button>
        </div>
      `;
    }
  } 
  else if (query.includes('rani lakshmibai') || query.includes('rani') || query.includes('lakshmi')) {
    response = `
      <p>Rani Lakshmibai was the legendary Queen of Jhansi and a prominent figure in the Indian Rebellion of 1857. She fiercely defended Jhansi against British forces.</p>
      <div class="chat-source">Source: Verified Historical Database</div>
      <div class="chat-actions">
        <button class="chat-btn" onclick="scrollToSection('raniSection'); closeSanskritiChat();">Explore Rani Lakshmibai</button>
        <button class="chat-btn" onclick="openHeritageCard('rani-mahal'); closeSanskritiChat();">View Rani Mahal</button>
      </div>
    `;
  }
  else if (query.includes('culture') || query.includes('tradition') || query.includes('bundelkhand') || query.includes('festival')) {
    response = `
      <p>Jhansi is deeply rooted in Bundelkhand culture. Traditional folk dances like 'Rai' and 'Badhai', and oral traditions like the 'Alha-Khand' epic are widely practiced.</p>
      <p>Recently, a local community member documented a traditional festival practiced in a nearby village.</p>
      <div class="chat-source" style="color:#d4600c;">Community Submitted — Not Yet Verified</div>
      <div class="chat-actions">
        <button class="chat-btn" onclick="scrollToSection('livingCulture'); closeSanskritiChat();">Explore Living Culture</button>
      </div>
    `;
  }
  else if (query.includes('1857') || query.includes('uprising')) {
    response = `
      <p>In 1857, Jhansi became a major center of resistance against the British East India Company. Rani Lakshmibai led the defense of Jhansi Fort against Sir Hugh Rose.</p>
      <div class="chat-source">Source: Verified Historical Database</div>
      <div class="chat-actions">
        <button class="chat-btn" onclick="scrollToSection('historicalTimeline'); closeSanskritiChat();">View Timeline</button>
      </div>
    `;
  }
  else {
    // Graceful fallback for non-Jhansi questions (No Hallucination)
    if (query.includes('france') || query.includes('capital') || query.includes('who is the prime minister')) {
      response = `
        <p>I’m Sanskriti Setu AI, focused on Jhansi’s heritage right now. Try asking me something about Jhansi's history, culture or traditions.</p>
      `;
    } else {
      response = `
        <p>I couldn't find enough reliable information about this in my current Jhansi heritage knowledge base.</p>
        <p>Please try asking about Jhansi Fort, Rani Lakshmibai, or local traditions.</p>
      `;
    }
  }
  
  addChatMessage(response, 'ai');
}
