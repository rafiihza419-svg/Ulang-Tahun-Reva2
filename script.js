const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");
const content = document.getElementById("content");
const backBtn = document.getElementById("back");

let scene, camera, renderer, menuGroup;
let rotX = 0, rotY = 0;
let dragging = false;
let lx = 0, ly = 0;

// Mulai Program
heart.onclick = () => {
    opening.style.opacity = "0";
    setTimeout(() => opening.style.display = "none", 1000);
    initThree();
    animate();
    startParticles();
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Grup untuk menampung ikon agar bisa diputar segala arah
    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    const menuData = [
        { icon: "✉️", title: "Surat", text: "Terima kasih sudah ada di sini!" },
        { icon: "🎁", title: "Hadiah", text: "Hadiah terbaik adalah waktumu." },
        { icon: "📸", title: "Foto", text: "Menyimpan kenangan dalam pixels." },
        { icon: "🎵", title: "Musik", text: "Lagu ini spesial untukmu." },
        { icon: "🎬", title: "Video", text: "Mari buat momen bersama!" },
        { icon: "💖", title: "Cinta", text: "You are amazing!" }
    ];

    const radius = 4;
    menuData.forEach((data, i) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.font = "90px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.icon, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: texture });
        const sp = new THREE.Sprite(mat);

        // Posisi Bola (Spherical)
        const phi = Math.acos(-1 + (2 * i) / menuData.length);
        const theta = Math.sqrt(menuData.length * Math.PI) * phi;

        sp.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        sp.scale.set(1.8, 1.8, 1.8);
        sp.userData = data; // Simpan info pesan
        menuGroup.add(sp);
    });

    // Event Listener Mouse
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", (e) => {
        if (dragging) {
            rotY += (e.clientX - lx) * 0.007;
            rotX += (e.clientY - ly) * 0.007;
            lx = e.clientX; ly = e.clientY;
        }
    });

    // Touch Support (HP)
    window.addEventListener("touchstart", e => { 
        dragging = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; 
    });
    window.addEventListener("touchend", () => dragging = false);
    window.addEventListener("touchmove", e => {
        if (dragging) {
            rotY += (e.touches[0].clientX - lx) * 0.007;
            rotX += (e.touches[0].clientY - ly) * 0.007;
            lx = e.touches[0].clientX; ly = e.touches[0].clientY;
        }
    });

    // Klik Ikon (Raycaster)
    window.addEventListener("click", onDocumentMouseDown);
}

function onDocumentMouseDown(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(menuGroup.children);

    if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        document.getElementById("msg-title").innerText = data.title;
        document.getElementById("msg-text").innerText = data.text;
        content.classList.remove("hidden");
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (menuGroup) {
        menuGroup.rotation.y = rotY;
        menuGroup.rotation.x = rotX;
        if (!dragging) { rotY += 0.003; } // Auto rotate
    }
    renderer.render(scene, camera);
}

function startParticles() {
    setInterval(() => {
        const f = document.createElement("div");
        f.className = "falling-flower";
        f.innerHTML = ["🌸", "🌷", "✨", "💗"][Math.floor(Math.random() * 4)];
        f.style.left = Math.random() * 100 + "vw";
        f.style.fontSize = Math.random() * 20 + 15 + "px";
        f.style.top = "-5vh";
        f.style.animation = `fall ${5 + Math.random() * 5}s linear forwards`;
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 10000);
    }, 400);
}

backBtn.onclick = () => content.classList.add("hidden");

window.addEventListener("resize", () => {
    if(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
