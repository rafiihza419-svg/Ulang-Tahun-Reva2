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
    let isOpened = false; // Flag biar gak double-click

    // Generate Partikel (Debu/Bintang)
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(particle);
    }

    // Heart background particles
setInterval(()=>{
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.innerHTML = '💜';
    h.style.left = Math.random()*100 + 'vw';
    h.style.animationDuration = (6+Math.random()*6)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),12000);
},800);

    // Play Ambient Music (dari awal)
    ambientMusic.volume = 0.3;
    ambientMusic.play().catch(() => {});

    // Klik Heart Logo (Diperbaiki: Langsung responsif)
['click', 'touchstart'].forEach(evt => {
    heartLogo.addEventListener(evt, () => {
        heartLogo.style.animation = 'explode 0.5s ease-out';

        setTimeout(() => {
            openingOverlay.style.opacity = '0';
            openingOverlay.style.pointerEvents = 'none';

            document.body.classList.add('opened');
            ambientMusic.pause();
            bgMusic.play().catch(()=>{});

            for (let i = 0; i < 20; i++) {
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
            }, 2000);
        }, 500);
    }, { once: true });
});


    // CSS untuk explode (inline)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes explode {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Menu Interaction (Teaser: Locked menu alert, unlock setelah progress 50%)
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('locked')) {
                if (progress >= 50) {
                    item.classList.remove('locked'); // Unlock otomatis
                    alert('Menu terbuka! 🎉');
                } else {
                    alert('Menu ini terkunci! Jelajahi yang lain dulu untuk unlock. 🔒');
                    return;
                }
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
                case 'video':
                    html = `<h2>🎥 Video</h2><video controls><source src="assets/video.mp4" type="video/mp4"></video>`;
                    break;
                case 'bunga':
                    html = `<h2>🌸 Bunga</h2><p>Bunga virtual untukmu: 🌹🌷🌻</p>`;
                    break;
                case 'timeline':
                    html = `<h2>🕰 Timeline</h2><div class="timeline"><p>Pertemuan pertama: [Tanggal]</p><p>Momen lucu: [Deskripsi]</p><p>Hari spesial: [Tanggal]</p></div>`;
                    break;
                case 'lagu':
                    html = `<h2>🎶 Lagu Kita</h2><button onclick="toggleMusic()">Play/Pause</button><p>Background berubah warna saat play!</p>`;
                    break;
                case 'secret':
                    const password = prompt('Masukkan password (misal: tanggaljadian):');
                    if (password === 'tanggaljadian') { // Ganti password
                        html = `<h2>🔐 Secret</h2><p>Pesan rahasia: Aku sayang kamu selamanya.</p><img src="assets/secret.jpg"><p>Janji kecil: Aku akan selalu ada untukmu.</p>`;
                    } else {
                        html = '<p>Password salah! Coba lagi.</p>';
                    }
                    break;
                case 'about':
                    html = `<h2>🧠 About Us</h2><div class="card" onclick="flipCard(this)"><p>Fun fact: Kita pertama ketemu jam 5 sore.</p><p>Hal random yang kamu suka: [Isi]</p></div>`;
                    break;
                case 'surprise':
                    html = `<h2>✨ Surprise</h2><button onclick="randomSurprise()">Klik untuk Surprise!</button>`;
                    break;
                default:
                    html = '<p>Konten belum tersedia.</p>';
            }
            content.innerHTML = `<div class="fade-in">${html}</div>`;
        }, 500); // Delay simulasi lazy load
    }

    // Toggle Musik
    window.toggleMusic = () => {
        if (bgMusic.paused) {
            bgMusic.play();
            document.body.style.background = 'linear-gradient(45deg, #ffecd2, #fcb69f)'; // Warna sesuai lagu
        } else {
            bgMusic.pause();
            document.body.style.background = 'linear-gradient(45deg, #ff9a9e, #fecfef)';
        }
    };

    // Flip Card for About Us
    window.flipCard = (card) => {
        card.style.transform = card.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
    };

    // Random Surprise
    window.randomSurprise = () => {
        const surprises = [
            () => alert('Quote: Kamu adalah alasan aku tersenyum setiap hari!'),
            () => { document.body.innerHTML += '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:red;z-index:999;">Hati Hujan! 💖</div>'; setTimeout(() => location.reload(), 3000); }, // Simulasi hati hujan
            () => { alert('Mini Game: Klik hati sebanyak mungkin!'); let score = 0; document.addEventListener('click', () => score++, {once: true}); setTimeout(() => alert(`Score: ${score}`), 5000); }
        ];
        surprises[Math.floor(Math.random() * surprises.length)]();
    };

    // Update Progress
    function updateProgress() {
        progress = Math.min(progress + 10, 100);
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Explore: ${progress}%`;
    }

    // Update Background Halus
    function updateBackground() {
        const colors = ['#ff9a9e', '#fecfef', '#a8edea', '#fed6e3', '#ffecd2'];
        document.body.style.background = `linear-gradient(45deg, ${colors[progress % colors.length]}, ${colors[(progress + 1) % colors.length]})`;
    }

    // Easter Egg: Klik menu 3x untuk unlock hidden
    let menuClicks = 0;
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuClicks++;
            if (menuClicks >= 30) { // 3x per menu x 10 menu
                showHiddenMessage();
                menuClicks = 0;
            }
        });
    });

    // Hidden Message (untuk easter egg)
    function showHiddenMessage() {
        const hiddenMsg = document.getElementById('hidden-message');
        hiddenMsg.classList.add('show');
        bgMusic.pause();
        document.body.style.background = 'linear-gradient(45deg, #a8edea, #fed6e3)';
        setTimeout(() => {
            hiddenMsg.classList.remove('show');
            bgMusic.play();
            document.body.style.background = 'linear-gradient(45deg, #ff9a9e, #fecfef)';
        }, 5000);
    }
});

let isDragging=false;
let lastX=0,lastY=0;
let rotX=0, rotY=0;

menuOrbit.addEventListener('mousedown',e=>{
    isDragging=true;
    lastX=e.clientX;
    lastY=e.clientY;
});

window.addEventListener('mouseup',()=>isDragging=false);

window.addEventListener('mousemove',e=>{
    if(!isDragging) return;
    rotY += (e.clientX-lastX)*0.3;
    rotX -= (e.clientY-lastY)*0.3;
    menuOrbit.style.transform =
        `translate(-50%,-50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    lastX=e.clientX;
    lastY=e.clientY;
});
