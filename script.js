const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

let scene, camera, renderer, menuGroup, raycaster, mouse;
let rotX = 0, rotY = 0, dragging = false, lx = 0, ly = 0;

// Mulai
heart.onclick = () => {
    opening.style.opacity = 0;
    setTimeout(() => opening.style.display = "none", 800);
    initThree();
    animate();
    startFallingParticles();
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pLight = new THREE.PointLight(0xffffff, 1);
    pLight.position.set(10, 10, 10);
    scene.add(pLight);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const menus = [
        { name: "Hadiah", icon: "🎁", color: 0xff6b6b, type: "text", val: "Hadiah spesial untukmu! 💝" },
        { name: "Surat", icon: "✉️", color: 0x4ecdc4, type: "text", val: "Hanya ingin bilang kamu hebat." },
        { name: "Video", icon: "🎬", color: 0xffd93d, type: "text", val: "Momen indah kita dalam video." },
        { name: "Foto", icon: "📸", color: 0xff8066, type: "photo" },
        { name: "Rahasia", icon: "🤫", color: 0x6c5ce7, type: "secret", val: "Jadi mau official kapan?" },
        { name: "Kejutan", icon: "✨", color: 0xfeca57, type: "surprise" }
    ];

    const radius = 7;
    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;

        // Bola
        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 32, 32),
            new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.2 })
        );
        ball.position.set(radius * Math.cos(theta) * Math.sin(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(phi));
        ball.userData = m;
        menuGroup.add(ball);

        // Label Emoji
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

    // Kontrol Rotasi
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", e => {
        if (!dragging) return;
        rotY += (e.clientX - lx) * 0.007;
        rotX += (e.clientY - ly) * 0.007;
        lx = e.clientX; ly = e.clientY;
    });

    // Deteksi Klik Bola
    window.addEventListener("click", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(menuGroup.children);
        const hit = intersects.find(i => i.object.userData.name);
        if (hit) openMenu(hit.object.userData);
    });
}

function openMenu(data) {
    let html = `<h2>${data.name}</h2><br>`;
    if (data.type === "photo") {
        html += `<div class="photo-grid">`;
        for(let i=1; i<=6; i++) html += `<div class="photo-item">FOTO ${i}</div>`;
        html += `</div>`;
    } else if (data.type === "surprise") {
        html += `<p>BOOM! 🎉</p>`;
        createFireworks();
    } else {
        html += `<p style="font-weight:bold">${data.val}</p>`;
    }
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
}

function createFireworks() {
    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
        scene.add(p);
        const vx=(Math.random()-0.5), vy=(Math.random()-0.5), vz=(Math.random()-0.5);
        let t = 0;
        const up = () => {
            p.position.x += vx; p.position.y += vy; p.position.z += vz;
            if(t++ < 40) requestAnimationFrame(up); else scene.remove(p);
        };
        up();
    }
}

function startFallingParticles() {
    const icons = ["🌸", "💗", "🌷", "✨"];
    setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        p.style.left = Math.random() * 100 + "vw";
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
