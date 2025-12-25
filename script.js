const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");

let scene, camera, renderer, menuGroup;
let rotX = 0, rotY = 0;
let dragging = false;
let lx = 0, ly = 0;

// Saat hati diklik, mulai scene 3D
heart.onclick = () => {
    opening.style.opacity = 0;
    setTimeout(() => opening.style.display = "none", 800);
    initThree();
    animate();
    startParticles();
};

function initThree() {
    // 1. Setup Dasar
    scene = new THREE.Scene();
    // Kamera dimundurkan sedikit agar bola terlihat jelas
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. Tambahkan Cahaya (PENTING agar objek 3D terlihat)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Cahaya dasar
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1); // Cahaya sorot
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    // 3. Buat Grup Menu
    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    // Gunakan warna-warna cerah sebagai pengganti ikon
    const colors = [0xff0055, 0x00aaff, 0xffaa00, 0x00ff66, 0x9900ff, 0xff3300];
    
    // Bentuk dasar: Bola (Sphere)
    const geometry = new THREE.SphereGeometry(1.2, 32, 32); 
    const radius = 6; // Jarak dari pusat

    colors.forEach((color, i) => {
        // Material yang bereaksi terhadap cahaya
        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.3,
            metalness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Rumus matematika untuk menyusun posisi membentuk bola besar
        const phi = Math.acos(-1 + (2 * i) / colors.length);
        const theta = Math.sqrt(colors.length * Math.PI) * phi;

        mesh.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        menuGroup.add(mesh);
    });

    // 4. Kontrol Mouse/Sentuh untuk Rotasi
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", e => {
        if (dragging) {
            rotY += (e.clientX - lx) * 0.008;
            rotX += (e.clientY - ly) * 0.008;
            lx = e.clientX; ly = e.clientY;
        }
    });
    
    // Support sentuhan HP
    window.addEventListener("touchstart", e => { dragging = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; });
    window.addEventListener("touchend", () => dragging = false);
    window.addEventListener("touchmove", e => {
        if (dragging) {
            rotY += (e.touches[0].clientX - lx) * 0.008;
            rotX += (e.touches[0].clientY - ly) * 0.008;
            lx = e.touches[0].clientX; ly = e.touches[0].clientY;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (menuGroup) {
        // Terapkan rotasi dari mouse
        menuGroup.rotation.y = rotY;
        menuGroup.rotation.x = rotX;
        
        // SUDAH DIHAPUS: Bagian auto-rotate
        // if (!dragging) { rotY += 0.005; } 
    }
    renderer.render(scene, camera);
}

// Efek Partikel Bunga (Pemanis)
function startParticles() {
    setInterval(() => {
        const f = document.createElement("div");
        f.className = "falling-flower";
        f.innerHTML = ["🌸", "✨", "💮"][Math.floor(Math.random() * 3)];
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-5vh";
        f.style.fontSize = (Math.random() * 15 + 10) + "px";
        f.style.animation = `fall ${5 + Math.random() * 5}s linear forwards`;
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 10000);
    }, 500);
}

// Agar responsif saat layar diubah ukurannya
window.addEventListener('resize', () => {
    if(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
