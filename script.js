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
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pl = new THREE.PointLight(0xffffff, 1);
    pl.position.set(10, 10, 10);
    scene.add(pl);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // DATA MENU
    const menus = [
        { name: "Hadiah", type: "gift", color: 0xff4d6d, icon: "🎁" },
        { name: "Surat", type: "letter", color: 0xff85a1, icon: "✉️" },
        { name: "Video", type: "video", color: 0xffb3c1, icon: "🎬" },
        { name: "Foto", type: "photo", color: 0xffccd5, icon: "📸" },
        { name: "Rahasia", type: "secret", color: 0xffa500, icon: "🤫" },
        { name: "Kejutan", type: "surprise", color: 0xff6b6b, icon: "✨" }
    ];

    // Buat Bola Menu
    menus.forEach((m, i) => {
        const geo = new THREE.SphereGeometry(1.8, 32, 32);
        const mat = new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.3 });
        const mesh = new THREE.Mesh(geo, mat);

        const angle = (i / menus.length) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * 8, Math.sin(angle) * 8, 0);
        mesh.userData = m;
        menuGroup.add(mesh);

        // Tambah Label Icon di atas bola
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 64; canvas.height = 64;
        ctx.font = "40px Arial"; ctx.textAlign = "center";
        ctx.fillText(m.icon, 32, 45);
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(mesh.position);
        sprite.scale.set(3, 3, 1);
        menuGroup.add(sprite);
    });

    // PARTIKEL AMBIENT (Hati & Bunga yang ikut berputar)
    const pCount = 150;
    const pIcons = ["🌸", "💗", "🌷", "✨"];
    for (let i = 0; i < pCount; i++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 64; canvas.height = 64;
        ctx.font = "30px Arial";
        ctx.fillText(pIcons[Math.floor(Math.random() * pIcons.length)], 16, 40);
        
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.7 });
        const p = new THREE.Sprite(mat);
        
        // Sebar partikel di area luas
        p.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        );
        p.scale.set(1.5, 1.5, 1);
        menuGroup.add(p);
    }

    // EVENT MOUSE
    window.addEventListener("mousedown", e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", rotateAction);
    window.addEventListener("click", clickAction);
}

function rotateAction(e) {
    if (!dragging) return;
    rotY += (e.clientX - lx) * 0.007;
    rotX += (e.clientY - ly) * 0.007;
    lx = e.clientX; ly = e.clientY;
}

function clickAction(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const interacts = raycaster.intersectObjects(menuGroup.children);
    
    if (interacts.length > 0 && interacts[0].object.userData.name) {
        openMenu(interacts[0].object.userData);
    }
}

function openMenu(data) {
    modalContent.innerHTML = `<h3>${data.name}</h3>`;
    
    if (data.type === 'photo') {
        let grid = `<div class="photo-grid">`;
        for(let i=1; i<=6; i++) grid += `<div class="photo-item">FOTO ${i}</div>`;
        grid += `</div>`;
        modalContent.innerHTML += grid;
    } else if (data.type === 'secret') {
        modalContent.innerHTML += `<p style="margin-top:20px; font-weight:bold;">"Jadi mau official kapan?"</p>`;
    } else if (data.type === 'surprise') {
        createFirework();
        modalContent.innerHTML += `<p>BOOM! 🎉 Selamat!</p>`;
    } else if (data.type === 'letter') {
        modalContent.innerHTML += `<p style="margin-top:10px">Hanya sebuah surat cinta digital untukmu...</p>`;
    } else {
        modalContent.innerHTML += `<p style="margin-top:10px">Isi menu ${data.name} sedang disiapkan...</p>`;
    }
    
    modal.classList.remove("hidden");
}

// EFEK KEMBANG API SEDERHANA
function createFirework() {
    const fCount = 50;
    const colors = [0xff0000, 0xffff00, 0xff00ff, 0x00ffff];
    for(let i=0; i<fCount; i++) {
        const g = new THREE.SphereGeometry(0.1);
        const m = new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random()*colors.length)] });
        const p = new THREE.Mesh(g, m);
        scene.add(p);
        
        const vx = (Math.random()-0.5)*1;
        const vy = (Math.random()-0.5)*1;
        const vz = (Math.random()-0.5)*1;
        
        let timer = 0;
        const anim = () => {
            p.position.x += vx; p.position.y += vy; p.position.z += vz;
            timer++;
            if(timer < 60) requestAnimationFrame(anim);
            else scene.remove(p);
        };
        anim();
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (menuGroup) {
        menuGroup.rotation.y = rotY;
        menuGroup.rotation.x = rotX;
    }
    renderer.render(scene, camera);
}

closeModal.onclick = () => modal.classList.add("hidden");
