const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");
const content = document.getElementById("content");
const contentInner = document.getElementById("content-inner");
const backBtn = document.getElementById("back");

let scene, camera, renderer, sprites = [];
let rotY = 0, dragging = false, lx = 0;

// Mulai setelah klik hati
heart.onclick = () => {
    opening.style.display = "none";
    initThree();
    animate();
    startParticles();
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Data Menu
    const menuData = [
        { name: "Surat", icon: "✉️" },
        { name: "Video", icon: "🎬" },
        { name: "Foto", icon: "📸" },
        { name: "Hadiah", icon: "🎁" },
        { name: "Musik", icon: "🎵" }
    ];

    const radius = 3;
    menuData.forEach((data, i) => {
        // Membuat canvas untuk dijadikan tekstur (pengganti file gambar agar tidak error)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 64; canvas.height = 64;
        ctx.font = "50px serif";
        ctx.fillText(data.icon, 5, 50);

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: texture });
        const sp = new THREE.Sprite(mat);

        const a = (i / menuData.length) * Math.PI * 2;
        sp.position.set(Math.cos(a) * radius, Math.sin(a) * 0.5, Math.sin(a) * radius);
        sp.scale.set(1.5, 1.5, 1.5);
        
        sp.userData = { name: data.name }; // Simpan data untuk diklik
        scene.add(sp);
        sprites.push(sp);
    });

    // Kontrol Putar
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", e => {
        if (dragging) {
            rotY += (e.clientX - lx) * 0.01;
            lx = e.clientX;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    sprites.forEach((sp, i) => {
        const a = (i / sprites.length) * Math.PI * 2 + rotY;
        sp.position.x = Math.cos(a) * 3;
        sp.position.z = Math.sin(a) * 3;
    });
    renderer.render(scene, camera);
}

function startParticles() {
    // Efek Bunga
    setInterval(() => {
        const f = document.createElement("div");
        f.className = "falling-flower";
        f.innerHTML = ["🌸", "🌷", "💮"][Math.floor(Math.random() * 3)];
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-5vh";
        f.style.animation = `fall ${4 + Math.random() * 4}s linear forwards`;
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 8000);
    }, 500);

    // Efek Hati
    setInterval(() => {
        const h = document.createElement("div");
        h.className = "heart-particle";
        h.innerHTML = "💗";
        h.style.left = Math.random() * 100 + "vw";
        h.style.bottom = "-5vh";
        h.style.animation = `floatUp ${6 + Math.random() * 4}s linear forwards`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 10000);
    }, 700);
}

// Tombol Kembali
backBtn.onclick = () => content.classList.add("hidden");
