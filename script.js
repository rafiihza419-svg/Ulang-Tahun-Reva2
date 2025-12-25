const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");

let scene, camera, renderer, menuGroup, raycaster, mouse;
let rotX = 0, rotY = 0;
let dragging = false, lx = 0, ly = 0;

heart.addEventListener("click", () => {
    opening.style.opacity = "0";
    setTimeout(() => {
        opening.style.display = "none";
        initThree();
        animate();
        startFallingParticles();
    }, 800);
});

function initThree() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    /* 🌸 LIGHT PINK AMBIENT */
    scene.add(new THREE.AmbientLight(0xffb6d9, 1.4));
    const light = new THREE.PointLight(0xff7eb3, 1.2);
    light.position.set(0, 10, 10);
    scene.add(light);

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const menus = [
        { name: "Hadiah", icon: "🎁" },
        { name: "Surat", icon: "💌" },
        { name: "Video", icon: "🎬" },
        { name: "Foto", icon: "📸" },
        { name: "Rahasia", icon: "🤍" },
        { name: "Kejutan", icon: "✨" }
    ];

    const radius = 7;

    menus.forEach((m, i) => {
        const phi = Math.acos(-1 + (2 * i) / menus.length);
        const theta = Math.sqrt(menus.length * Math.PI) * phi;

        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(1.8, 48, 48),
            new THREE.MeshStandardMaterial({
                color: 0xff6fae,
                roughness: 0.25,
                metalness: 0.3
            })
        );

        ball.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        ball.userData = m;
        menuGroup.add(ball);

        /* 🔹 ICON KECIL 1 SISI */
        const iconCanvas = document.createElement("canvas");
        iconCanvas.width = 128;
        iconCanvas.height = 128;
        const ictx = iconCanvas.getContext("2d");

        ictx.font = "60px Arial";
        ictx.textAlign = "center";
        ictx.textBaseline = "middle";
        ictx.fillText(m.icon, 64, 70);

        const iconTexture = new THREE.CanvasTexture(iconCanvas);
        const icon = new THREE.Mesh(
            new THREE.PlaneGeometry(0.7, 0.7),
            new THREE.MeshBasicMaterial({
                map: iconTexture,
                transparent: true
            })
        );

        icon.position.set(0, 0, 1.95);
        ball.add(icon);
    });

    /* DRAG ROTATE */
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

    /* 🔥 HOVER MEMBESAR */
    window.addEventListener("mousemove", e => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const hits = raycaster.intersectObjects(menuGroup.children);

        menuGroup.children.forEach(b =>
            b.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        );

        if (hits.length) {
            hits[0].object.scale.lerp(
                new THREE.Vector3(1.25, 1.25, 1.25),
                0.15
            );
        }
    });
}

function startFallingParticles() {
    const chars = ["🌸", "💗", "✨"];
    setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.innerHTML = chars[Math.floor(Math.random() * chars.length)];
        p.style.left = Math.random() * 100 + "vw";
        p.style.fontSize = Math.random() * 20 + 15 + "px";
        p.style.animationDuration = Math.random() * 3 + 4 + "s";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 7000);
    }, 350);
}

function animate() {
    requestAnimationFrame(animate);
    menuGroup.rotation.y = rotY;
    menuGroup.rotation.x = rotX;
    renderer.render(scene, camera);
}
