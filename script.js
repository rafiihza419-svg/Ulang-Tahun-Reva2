const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");

let scene, camera, renderer, menuGroup;
let rotX = 0, rotY = 0;
let dragging = false;
let lx = 0, ly = 0;

heart.onclick = () => {
    opening.style.display = "none";
    initThree();
    animate();
    startParticles();
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    // Gunakan Emoji agar tidak perlu upload file gambar & tidak ada kotak putih
    const menuData = [
        { icon: "✉️", title: "Surat", text: "Semoga harimu selalu indah!" },
        { icon: "🎁", title: "Hadiah", text: "Ini kejutan kecil untukmu!" },
        { icon: "📸", title: "Foto", text: "Banyak kenangan manis kita." },
        { icon: "🎵", title: "Musik", text: "Dengarkan melodi hati ini." },
        { icon: "🎬", title: "Video", text: "Momen yang tak terlupakan." },
        { icon: "💖", title: "Love", text: "Kamu yang terbaik!" }
    ];

    const radius = 5;
    menuData.forEach((data, i) => {
        // Buat Texture dari Emoji (Solusi terbaik agar tidak ada background putih)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.font = "90px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.icon, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sp = new THREE.Sprite(mat);

        // Rumus posisi bola
        const phi = Math.acos(-1 + (2 * i) / menuData.length);
        const theta = Math.sqrt(menuData.length * Math.PI) * phi;

        sp.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        sp.scale.set(2, 2, 2);
        sp.userData = data; 
        menuGroup.add(sp);
    });

    // Event Mouse & Touch
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", e => {
        if (dragging) {
            rotY += (e.clientX - lx) * 0.01;
            rotX += (e.clientY - ly) * 0.01;
            lx = e.clientX; ly = e.clientY;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (menuGroup) {
        menuGroup.rotation.y = rotY;
        menuGroup.rotation.x = rotX;
        if (!dragging) { rotY += 0.005; } // Putar otomatis pelan
    }
    renderer.render(scene, camera);
}

function startParticles() {
    setInterval(() => {
        const f = document.createElement("div");
        f.className = "falling-flower";
        f.innerHTML = ["🌸", "✨", "🌷", "💗"][Math.floor(Math.random() * 4)];
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-5vh";
        f.style.fontSize = (Math.random() * 20 + 10) + "px";
        f.style.animation = `fall ${5 + Math.random() * 5}s linear forwards`;
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 10000);
    }, 400);
}

// Tambahkan resize agar tidak berantakan di layar beda ukuran
window.addEventListener('resize', () => {
    if(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
