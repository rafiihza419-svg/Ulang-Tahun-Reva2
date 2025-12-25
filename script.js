const container = document.getElementById("three-container");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

let scene, camera, renderer, menuGroup;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let rotX = 0, rotY = 0, dragging = false, lx = 0, ly = 0;

/* OPEN APP */
function openApp() {
    const opening = document.getElementById("opening");
    opening.style.opacity = "0";

    setTimeout(() => {
        opening.style.display = "none";
        container.style.pointerEvents = "auto";
        initThree();
        animate();
        startFallingParticles();
    }, 800);
}

/* INIT THREE */
function initThree() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffc0dd, 1.4));
    const light = new THREE.PointLight(0xff9acb, 1.2);
    light.position.set(0, 10, 10);
    scene.add(light);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    const menus = [
        { name: "Hadiah", val: "Kejutan spesial 💖" },
        { name: "Surat", val: "Terima kasih sudah ada 🤍" },
        { name: "Video", val: "Kita adalah cerita 🎥" },
        { name: "Foto", val: "Kenangan indah 📸" },
        { name: "Rahasia", val: "Hehehe 🤫" },
        { name: "Kejutan", val: "BOOM 🎆" }
    ];

    const radius = 7.5;

    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;

        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.9, 48, 48),
            new THREE.MeshStandardMaterial({ color: 0xff6fae })
        );

        ball.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        ball.userData = m;
        menuGroup.add(ball);
    });

    /* DRAG */
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

    /* CLICK */
    window.addEventListener("click", e => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.intersectObjects(menuGroup.children);
        if (hit.length) openMenu(hit[0].object.userData);
    });
}

/* OPEN MENU */
function openMenu(data) {
    modalContent.innerHTML = `<h3>${data.name}</h3><p>${data.val}</p>`;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

/* PARTICLES */
function startFallingParticles() {
    const chars = ["🌸","💮","✨","💗"];
    setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.innerHTML = chars[Math.floor(Math.random()*chars.length)];
        p.style.left = Math.random()*100+"vw";
        p.style.fontSize = 20+Math.random()*20+"px";
        p.style.animationDuration = 4+Math.random()*3+"s";
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),8000);
    },300);
}

/* LOOP */
function animate() {
    requestAnimationFrame(animate);
    menuGroup.rotation.y = rotY;
    menuGroup.rotation.x = rotX;
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
