document.addEventListener('DOMContentLoaded', () => {
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
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    let progress = 0;
    let heartPressTime = 0;
    let cornerClicks = 0;

    // Generate Partikel (Debu/Bintang)
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(particle);
    }

    // Play Ambient Music
    ambientMusic.volume = 0.3;
    ambientMusic.play().catch(() => {});

    // Klik Heart Logo
    heartLogo.addEventListener('click', () => {
        // Meledak jadi partikel cahaya (simulasi)
        heartLogo.style.animation = 'explode 0.5s ease-out';
        setTimeout(() => {
            openingOverlay.style.opacity = '0';
            document.body.classList.add('opened'); // Transisi ke dunia utama
            ambientMusic.pause();
            bgMusic.play(); // Musik utama
            // Kelopak bunga jatuh
            for (let i = 0; i < 20; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                petal.style.left = Math.random() * 100 + '%';
                petal.style.animationDelay = Math.random() * 5 + 's';
                petals.appendChild(petal);
            }
            // Zoom in effect (simulasi)
            document.body.style.transform = 'scale(1.05)';
            setTimeout(() => document.body.style.transform = 'scale(1)', 2000);
            // Show menu dan content
            setTimeout(() => {
                openingOverlay.style.display = 'none';
                menuOrbit.classList.remove('hidden');
                content.classList.remove('hidden');
                welcomeText.classList.remove('hidden');
                tooltip.classList.add('show');
            }, 2000);
        }, 500);
    });

    // CSS untuk explode (tambahan inline)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes explode {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Menu Interaction (Teaser: Locked menu alert)
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('locked')) {
                alert('Menu ini terkunci! Jelajahi yang lain dulu. 🔒');
                return;
            }
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadContent(item.dataset.menu);
            updateProgress();
            updateBackground();
        });
    });

    // Load Content (Lazy Load)
    function loadContent(menu) {
        content.innerHTML = '<div class="fade-in">Loading...</div>';
        setTimeout(() => {
            let html = '';
            switch(menu) {
                case 'surat':
                    html = `<h2>💌 Surat</h2><p>Pesan cinta dari aku: [Tulis pesanmu di sini]</p>`;
                    break;
                case 'galeri':
                    html = `<h2>📷 Galeri</h2><img src="assets/photo1.jpg" alt="Kenangan"><img src="assets/photo2.jpg" alt="Kenangan">`;
                    break;
                case 'hadiah':
                    html = `<h2>🎁 Hadiah Kecil</h2><p>Klik untuk download hadiah virtual: <a href="assets/gift.pdf">Download</a></p>`;
                    break;
                // Menu lain unlock setelah progress 50%
                default:
                    if (progress >=
