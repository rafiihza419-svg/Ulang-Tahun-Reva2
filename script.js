document.addEventListener('DOMContentLoaded', () => {
    const hiddenMsg = document.getElementById('hidden-message');
    const menuItems = document.querySelectorAll('.menu-item');
    const content = document.getElementById('content');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const bgMusic = document.getElementById('bg-music');
    let progress = 0;
    let heartPressTime = 0;
    let cornerClicks = 0;

    // Auto-play musik (opsional, tergantung browser policy)
    bgMusic.play().catch(() => {}); // Mute jika gak bisa auto-play

    // Hidden Message: Tekan logo hati 5 detik (💌)
    document.addEventListener('mousedown', (e) => {
        if (e.target.textContent.includes('💌')) {
            heartPressTime = Date.now();
        }
    });
    document.addEventListener('mouseup', (e) => {
        if (e.target.textContent.includes('💌') && Date.now() - heartPressTime >= 5000) {
            showHiddenMessage();
        }
    });

    // Hidden Message: Klik sudut kanan bawah 3x
    document.addEventListener('click', (e) => {
        if (e.clientX > window.innerWidth - 50 && e.clientY > window.innerHeight - 50) {
            cornerClicks++;
            setTimeout(() => cornerClicks = 0, 1000); // Reset setelah 1s
            if (cornerClicks >= 3) {
                showHiddenMessage();
                cornerClicks = 0;
            }
        }
    });

    function showHiddenMessage() {
        hiddenMsg.classList.add('show');
        bgMusic.pause(); // Musik berhenti
        document.body.style.background = 'linear-gradient(45deg, #a8edea, #fed6e3)'; // Background tenang
        setTimeout(() => {
            hiddenMsg.classList.remove('show');
            bgMusic.play();
            document.body.style.background = 'linear-gradient(45deg, #ff9a9e, #fecfef)'; // Kembali
        }, 5000);
    }

    // Menu Interaction
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
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
        setTimeout(() => { // Simulasi lazy load
            let html = '';
            switch(menu) {
                case 'surat':
                    html = `<h2>💌 Surat</h2><p>Pesan cinta dari aku: [Tulis pesanmu di sini]</p>`;
                    break;
                case 'galeri':
                    html = `<h2>📷 Galeri</h2><img src="assets/photo1.jpg" alt="Kenangan"><img src="assets/photo2.jpg" alt="Kenangan">`;
                    break;
                case 'video':
                    html = `<h2>🎥 Video</h2><video controls><source src="assets/video.mp4" type="video/mp4"></video>`;
                    break;
                case 'hadiah':
                    html = `<h2>🎁 Hadiah Kecil</h2><p>Klik untuk download hadiah virtual: <a href="assets/gift.pdf">Download</a></p>`;
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
        }, 500); // Delay simulasi
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
});
