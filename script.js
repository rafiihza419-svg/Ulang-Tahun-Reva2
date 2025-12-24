document.addEventListener('DOMContentLoaded', () => {

  /* ========================
     ELEMENTS
  ======================== */
  const openingOverlay = document.getElementById('opening-overlay');
  const heartLogo = document.getElementById('heart-logo');
  const particles = document.getElementById('particles');
  const petals = document.getElementById('petals');
  const ambientMusic = document.getElementById('ambient-music');
  const bgMusic = document.getElementById('bg-music');
  const menuOrbit = document.getElementById('menu-orbit');
  const content = document.getElementById('content');
  const welcomeText = document.getElementById('welcome-text');
  const tooltip = document.getElementById('tooltip');
  const menuItems = document.querySelectorAll('.menu-item');

  let opened = false;

  /* ========================
     PARTICLES (BINTANG)
  ======================== */
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 5 + 's';
    particles.appendChild(p);
  }

  /* ========================
     HEART BACKGROUND PARTICLES
  ======================== */
  setInterval(() => {
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.innerHTML = '💜';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.animationDuration = (6 + Math.random() * 6) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 12000);
  }, 900);

  /* ========================
     OPENING MUSIC
  ======================== */
  ambientMusic.volume = 0.3;
  ambientMusic.play().catch(() => {});

  /* ========================
     HEART CLICK (OPEN WORLD)
  ======================== */
  ['click', 'touchstart'].forEach(evt => {
    heartLogo.addEventListener(evt, () => {
      if (opened) return;
      opened = true;

      heartLogo.style.animation = 'explode 0.6s ease-out';

      setTimeout(() => {
        openingOverlay.style.opacity = '0';
        openingOverlay.style.pointerEvents = 'none';

        document.body.classList.add('opened');
        ambientMusic.pause();
        bgMusic.play().catch(()=>{});

        for (let i = 0; i < 25; i++) {
          const petal = document.createElement('div');
          petal.className = 'petal';
          petal.style.left = Math.random() * 100 + '%';
          petal.style.animationDelay = Math.random() * 5 + 's';
          petals.appendChild(petal);
        }

        setTimeout(() => {
          openingOverlay.style.display = 'none';
          menuOrbit.classList.remove('hidden');
          content.classList.remove('hidden');
          welcomeText.classList.remove('hidden');
          tooltip.classList.add('show');
        }, 1800);
      }, 500);
    }, { once:true });
  });

  /* ========================
     3D SPHERE MENU POSITION
  ======================== */
  const radius = 140;
  menuItems.forEach((item, i) => {
    const phi = Math.acos(-1 + (2 * i) / menuItems.length);
    const theta = Math.sqrt(menuItems.length * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    item.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
  });

  /* ========================
     MANUAL ROTATE (DRAG)
  ======================== */
  let dragging = false;
  let lastX = 0, lastY = 0;
  let rotX = 0, rotY = 0;

  menuOrbit.addEventListener('mousedown', e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('mouseup', () => dragging = false);

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX) * 0.3;
    rotX -= (e.clientY - lastY) * 0.3;
    menuOrbit.style.transform =
      `translate(-50%,-50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  /* ========================
     FULLSCREEN SECTION
  ======================== */
  const section = document.getElementById('section');
  const sectionContent = document.getElementById('section-content');
  const backBtn = document.getElementById('backBtn');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('locked')) return;

      menuOrbit.style.display = 'none';
      section.classList.remove('hidden');

      switch (item.dataset.menu) {
        case 'surat':
          sectionContent.innerHTML = `<h1>💌 Surat</h1><p>Ini surat cinta untukmu…</p>`;
          break;
        case 'galeri':
          sectionContent.innerHTML = `<h1>📷 Galeri</h1><p>Foto kenangan kita</p>`;
          break;
        case 'hadiah':
          sectionContent.innerHTML = `<h1>🎁 Hadiah</h1><p>Kejutan kecil buat kamu</p>`;
          break;
        case 'surprise':
          startFireworks();
          break;
        default:
          sectionContent.innerHTML = `<h1>✨ Menu</h1><p>Konten segera hadir</p>`;
      }
    });
  });

  backBtn.onclick = () => {
    section.classList.add('hidden');
    menuOrbit.style.display = 'block';
  };

  /* ========================
     FIREWORK ENDING
  ======================== */
  function startFireworks() {
    sectionContent.innerHTML = '';

    for (let i = 0; i < 40; i++) {
      const f = document.createElement('div');
      f.className = 'firework';
      f.innerHTML = '🎆';
      f.style.left = Math.random() * 100 + 'vw';
      f.style.top = Math.random() * 100 + 'vh';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 2000);
    }

    setTimeout(() => {
      const t = document.createElement('div');
      t.id = 'birthdayText';
      t.innerHTML = '🎉 HAPPY BIRTHDAY 🎉';
      document.body.appendChild(t);
    }, 2000);
  }

});
