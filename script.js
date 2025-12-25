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
    setTimeout(() => opening.style.display = "none", 800);
    initThree();
    animate();
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pl = new THREE.PointLight(0xffffff, 1);
    pl.position.set(10, 10, 10);
    scene.add(pl);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const menus = [
        { name: "Hadiah", icon: "🎁", color: 0xff6b6b, type: "text", val: "Ini hadiah spesial buat kamu! 💝" },
        { name: "Surat", icon: "✉️", color: 0x4ecdc4, type: "text", val: "Kamu adalah hal terbaik yang pernah terjadi padaku." },
        { name: "Video", icon: "🎬", color: 0xffd93d, type: "text", val: "Bayangkan video kenangan kita diputar di sini..." },
        { name: "Foto", icon: "📸", color: 0xff8066, type: "photo" },
        { name: "Rahasia", icon: "🤫", color: 0x6c5ce7, type: "secret", val: "Jadi mau official kapan?" },
        { name: "Kejutan", icon: "✨", color: 0xfeca57, type: "surprise" }
    ];

    // Buat Bola & Logo
    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;
        const radius = 7;

        // Bola
        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 32, 32),
            new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.3 })
        );
        ball.position.set(radius * Math.cos(theta) * Math.sin(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(phi));
        ball.userData = m;
        menuGroup.add(ball);

        // Logo (Emoji)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.font = "80px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(m.icon, 64, 64);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
        sprite.position.copy(ball.position);
        sprite.scale.set(3.5, 3.5, 1);
        menuGroup.add(sprite);
    });

    // Partikel (Hati & Bunga) Keliling Layar
    const pIcons = ["🌸", "💗", "🌷", "✨"];
    for (let i = 0; i < 150; i++) {
        const c = document.createElement('canvas');
        const cx = c.getContext('2d');
        c.width = 64; c.height = 64;
        cx.font = "30px Arial"; cx.fillText(pIcons[Math.floor(Math.random()*4)], 10, 40);
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.6 }));
        p.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50);
        menuGroup.add(p);
    }

    // Event Handlers
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", e => {
        dragging = false;
        // Deteksi Klik
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(menuGroup.children);
        const clickedBall = intersects.find(o => o.object.userData.name);
        if (clickedBall) openMenu(clickedBall.object.userData);
    });
    window.addEventListener("mousemove", e => {
        if (!dragging) return;
        rotY += (e.clientX - lx) * 0.007;
        rotX += (e.clientY - ly) * 0.007;
        lx = e.clientX; ly = e.clientY;
    });
}

function openMenu(data) {
    let html = `<h3>${data.name} ${data.icon}</h3><div style="margin-top:15px">`;
    if (data.type === "secret") html += `<p style="font-weight:bold; font-size:20px">"${data.val}"</p>`;
    else if (data.type === "photo") {
        html += `<div class="photo-grid">`;
        for(let i=1; i<=6; i++) html += `<div class="photo-item">FOTO ${i}</div>`;
        html += `</div>`;
    } else if (data.type === "surprise") {
        html += `<p>BOOM! 🎆</p>`;
        createFireworks();
    } else html += `<p>${data.val || ""}</p>`;
    
    html += `</div>`;
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
}

function createFireworks() {
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
        scene.add(p);
        const vx = (Math.random()-0.5)*0.8, vy = (Math.random()-0.5)*0.8, vz = (Math.random()-0.5)*0.8;
        let life = 0;
        const up = () => {
            p.position.x += vx; p.position.y += vy; p.position.z += vz;
            if(life++ < 50) requestAnimationFrame(up); else scene.remove(p);
        };
        up();
    }
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
