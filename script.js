const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

let scene, camera, renderer, menuGroup, raycaster, mouse;
let rotX = 0, rotY = 0, dragging = false, lx = 0, ly = 0;

/* ================= OPENING ================= */
heart.onclick = () => {
    opening.style.opacity = 0;

    setTimeout(() => {
        opening.style.display = "none";
        container.style.pointerEvents = "auto";

        initThree();
        animate();
        startFallingParticles();
        create3DFlowers();
    }, 800);
};

/* ================= THREE INIT ================= */
function initThree() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffc0dd, 1.4));
    const pinkLight = new THREE.PointLight(0xff9acb, 1.2);
    pinkLight.position.set(0, 10, 10);
    scene.add(pinkLight);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const menus = [
        { name: "Hadiah", icon: "❤️", color: "#ff6b6b", val: "Kejutan spesial menantimu! 💖" },
        { name: "Surat", icon: "💙", color: "#6ba8ff", val: "Terima kasih sudah selalu ada." },
        { name: "Video", icon: "🤍", color: "#dddddd", val: "Momen kita adalah film terbaik." },
        { name: "Foto", icon: "💛", color: "#ffd93d", type: "photo" },
        { name: "Rahasia", icon: "💚", color: "#4cd964", val: "Jadi mau official kapan?" },
        { name: "Kejutan", icon: "🧡", color: "#ff9f43", type: "surprise" }
    ];

    const radius = 7.5;

    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;

        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.9, 48, 48),
            new THREE.MeshStandardMaterial({
                color: m.color,
                roughness: 0.3,
                metalness: 0.25
            })
        );

        ball.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        ball.userData = m;
        menuGroup.add(ball);

        /* === LOGO KECIL 1 SISI === */
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        ctx.font = "42px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(m.icon, 64, 72);

        const texture = new THREE.CanvasTexture(canvas);
        const logo = new THREE.Mesh(
            new THREE.PlaneGeometry(0.55, 0.55),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9
            })
        );

        logo.position.set(0, 0, 1.92);
        ball.add(logo);
    });

    /* === ROTATE === */
    window.addEventListener("mousedown", e => {
        dragging = true;
        lx = e.clientX;
        ly = e.clientY;
    });

    window.addEventListener("mouseup", () => dragging = false);

    window.addEventListener("mousemove", e => {
        if (!dragging) return;
        rotY += (e.clientX - lx) * 0.006;
        rotX += (e.clientY - ly) * 0.006;
        lx = e.clientX;
        ly = e.clientY;
    });

    /* === CLICK === */
    window.addEventListener("click", e => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(menuGroup.children);
        if (hits.length) openMenu(hits[0].object.userData);
    });
}

/* ================= MENU ================= */
function openMenu(data) {
    let html = `<h3>${data.name}</h3><br>`;
    if (data.type === "photo") {
        html += `<div class="photo-grid">`;
        for (let i = 1; i <= 6; i++) html += `<div class="photo-item">FOTO ${i}</div>`;
        html += `</div>`;
    } else if (data.type === "surprise") {
        html += `<p>BOOM! 🎆</p>`;
        createFireworks();
    } else {
        html += `<p style="font-size:18px;font-weight:bold">${data.val}</p>`;
    }
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
}

/* ================= FLOWERS ================= */
function create3DFlowers() {
    const emojis = ["🌸", "🌺", "💮"];
    for (let i = 0; i < 20; i++) {
        const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(createEmojiCanvas(emojis)),
                transparent: true
            })
        );

        sprite.position.set(
            (Math.random() - 0.5) * 18,
            Math.random() * 12 - 6,
            (Math.random() - 0.5) * 18
        );

        sprite.scale.set(2, 2, 1);
        scene.add(sprite);

        const speed = Math.random() * 0.01 + 0.003;
        (function anim() {
            sprite.position.y -= speed;
            if (sprite.position.y < -10) sprite.position.y = 10;
            requestAnimationFrame(anim);
        })();
    }
}

function createEmojiCanvas(arr) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d");
    x.font = "90px Arial";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(arr[Math.floor(Math.random() * arr.length)], 64, 80);
    return c;
}

/* ================= EFFECTS ================= */
function createFireworks() {
    for (let i = 0; i < 40; i++) {
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.12),
            new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        );
        scene.add(p);
        let t = 0;
        (function anim() {
            p.position.x += (Math.random() - 0.5) * 0.4;
            p.position.y += (Math.random() - 0.5) * 0.4;
            if (t++ < 50) requestAnimationFrame(anim);
            else scene.remove(p);
        })();
    }
}

function startFallingParticles() {
    const chars = ["🌸", "🌺", "💮", "✨", "💗"];
    setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.innerHTML = chars[Math.floor(Math.random() * chars.length)];
        p.style.left = Math.random() * 100 + "vw";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 7000);
    }, 300);
}

function animate() {
    requestAnimationFrame(animate);
    menuGroup.rotation.y = rotY;
    menuGroup.rotation.x = rotX;
    renderer.render(scene, camera);
}

closeModal.onclick = () => modal.classList.add("hidden");
