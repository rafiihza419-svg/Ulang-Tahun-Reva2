const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");

let scene, camera, renderer;
let sprites = [];
let rotX = 0, rotY = 0;
let dragging = false;
let lx = 0, ly = 0;

heart.onclick = () => {
  opening.style.display = "none";
  initThree();
  animate();
  startFlowers();
};

/* ================= THREE INIT ================= */
function initThree(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const icons = [
    "icon-surat.png",
    "icon-video.png",
    "icon-foto.png",
    "icon-hadiah.png",
    "icon-music.png"
  ];

  const loader = new THREE.TextureLoader();
  const radius = 3;

  icons.forEach((icon, i)=>{
    const mat = new THREE.SpriteMaterial({
      map: loader.load(icon),
      transparent:true
    });

    const sp = new THREE.Sprite(mat);
    const a = (i/icons.length)*Math.PI*2;

    sp.position.set(
      Math.cos(a)*radius,
      Math.sin(a)*radius*0.6,
      Math.sin(a)*radius
    );

    sp.scale.set(1.5,1.5,1.5);
    scene.add(sp);
    sprites.push(sp);
  });

  /* DRAG ROTATION */
  window.addEventListener("mousedown",e=>{
    dragging=true; lx=e.clientX; ly=e.clientY;
  });
  window.addEventListener("mouseup",()=>dragging=false);
  window.addEventListener("mousemove",e=>{
    if(!dragging) return;
    rotY += (e.clientX-lx)*0.005;
    rotX += (e.clientY-ly)*0.005;
    lx=e.clientX; ly=e.clientY;
  });

  window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
}

/* ================= ANIMATE ================= */
function animate(){
  requestAnimationFrame(animate);

  sprites.forEach(sp=>{
    const x = sp.position.x;
    const z = sp.position.z;
    sp.position.x = x*Math.cos(rotY)-z*Math.sin(rotY);
    sp.position.z = x*Math.sin(rotY)+z*Math.cos(rotY);
  });

  renderer.render(scene,camera);
}

/* ================= FLOWERS ================= */
function startFlowers(){
  setInterval(()=>{
    const f=document.createElement("div");
    f.innerHTML=["🌸","💮","🌷"][Math.floor(Math.random()*3)];
    f.style.position="fixed";
    f.style.left=Math.random()*100+"vw";
    f.style.top="-30px";
    f.style.fontSize="22px";
    f.style.animation="fall 6s linear";
    document.body.appendChild(f);
    setTimeout(()=>f.remove(),6000);
  },500);
}

const style=document.createElement("style");
style.innerHTML=`
@keyframes fall{
  to{transform:translateY(110vh) rotate(360deg);opacity:0}
}`;
document.head.appendChild(style);
