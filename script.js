const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

let scene, camera, renderer, menuGroup, raycaster, mouse;
let rotX = 0, rotY = 0, dragging = false, lx = 0, ly = 0;

heart.onclick = () => {
    opening.style.opacity = 0;
    setTimeout(() => {
        opening.style.display = "none";
        initThree();
        animate();
        startFallingParticles();
    }, 800);
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const menus = [
        { name: "Hadiah", icon: "🎁", color: 0xff6b6b, type: "text", val: "Kejutan spesial menantimu! 💖" },
        { name: "Surat", icon: "✉️", color: 0x4ecdc4, type: "text", val: "Terima kasih sudah selalu ada." },
        { name: "Video", icon: "🎬", color: 0xffd93d, type: "text", val: "Momen kita adalah film terbaik." },
        { name: "Foto", icon: "📸", color: 0xff8066, type: "photo" },
        { name: "Rahasia", icon: "🤫", color: 0x6c5ce7, type: "secret", val: "Jadi mau official kapan?" },
        { name: "Kejutan", icon: "✨", color: 0xfeca57, type: "surprise" }
    ];

    const radius = 6.5;
    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;

        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 32, 32),
            new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.1, metalness: 0.2 })
        );
        ball.position.set(radius * Math.cos(theta) * Math.sin(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(phi));
        ball.userData = m;
        menuGroup.add(ball);

        // Buat Label Ikon (Emoji)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.font = "80px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(m.icon, 64, 64);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
        sprite.position.copy(ball.position);
        sprite.scale.set(3, 3, 1);
        menuGroup.add(sprite);
    });

    // Kontrol Putar
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", e => {
        if (dragging) {
            rotY += (e.clientX - lx) * 0.007;
            rotX += (e.clientY - ly) * 0.007;
            lx = e.clientX; ly = e.clientY;
        }
    });

    // Deteksi Klik Sangat Akurat
    window.addEventListener("click", (e) => {
        if (dragging && Math.abs(e.clientX - lx) > 5) return;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(menuGroup.children);
        const target = hits.find(h => h.object.userData.name);
        if (target) openMenu(target.object.userData);
    });
}

function openMenu(data) {
    let html = `<h3>${data.name} ${data.icon}</h3><br>`;
    if (data.type === "photo") {
        html += `<div class="photo-grid">`;
        for(let i=1; i<=6; i++) html += `<div class="photo-item">FOTO ${i}</div>`;
        html += `</div>`;
    } else if (data.type === "surprise") {
        html += `<p>BOOM! 🎆</p>`;
        createFireworks();
    } else {
        html += `<p style="font-size:18px; font-weight:bold;">${data.val}</p>`;
    }
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
}

function createFireworks() {
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
        scene.add(p);
        const vx=(Math.random()-0.5)*0.8, vy=(Math.random()-0.5)*0.8, vz=(Math.random()-0.5)*0.8;
        let t = 0;
        const up = () => {
            p.position.x += vx; p.position.y += vy; p.position.z += vz;
            if(t++ < 50) requestAnimationFrame(up); else scene.remove(p);
        };
        up();
    }
}

function startFallingParticles() {
    const chars = ["🌸", "💗", "🌷", "✨"];
    setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.innerHTML = chars[Math.floor(Math.random() * chars.length)];
        p.style.left = Math.random() * 95 + "vw"; // Sebar di seluruh lebar layar
        p.style.fontSize = Math.random() * 20 + 15 + "px";
        p.style.animationDuration = Math.random() * 3 + 4 + "s";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 7000);
    }, 400);
}

function animate() {
    requestAnimationFrame(animate);
    if(menuGroup) {
        menuGroup.rotation.y = rotY;
        menuGroup.rotation.x = rotX;
    }
    renderer.render(scene, camera);
}

closeModal.onclick = () => modal.classList.add("hidden");
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
