/* ---------- OPENING ---------- */
const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const menuContainer = document.getElementById("menu-container");
const content = document.getElementById("content");
const contentInner = document.getElementById("content-inner");
const backBtn = document.getElementById("back");

/* HEART CLICK FIX */
['click','touchstart'].forEach(evt=>{
  heart.addEventListener(evt, e=>{
    e.preventDefault();
    opening.remove(); // 🔥 HAPUS TOTAL OPENING
menuContainer.classList.remove("hidden");
document.body.style.background = "linear-gradient(135deg,#ff9a9e,#ff2f92,#ff7a18)";
init3DMenu();
  }, {once:true});
});

/* ---------- PARTICLES ---------- */
setInterval(()=>{
  const s=document.createElement("span");
  s.innerHTML="💜";
  s.style.left=Math.random()*100+"vw";
  s.style.fontSize=(12+Math.random()*20)+"px";
  s.style.animationDuration=(6+Math.random()*6)+"s";
  document.getElementById("bg-particles").appendChild(s);
  setTimeout(()=>s.remove(),12000);
},600);

/* ---------- THREE.JS MENU ---------- */
let scene,camera,renderer,group;
let isDrag=false,lastX=0,lastY=0,rotX=0,rotY=0;

function init3DMenu(){
  scene=new THREE.Scene();

  camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,1000);
  camera.position.z=6;

  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x000000, 0);
  menuContainer.appendChild(renderer.domElement);

  group=new THREE.Group();

 const menuItems = [
  { name:"Surat", icon:"icon-surat.png" },
  { name:"Video", icon:"icon-video.png" },
  { name:"Foto", icon:"icon-foto.png" },
  { name:"Hadiah", icon:"icon-hadiah.png" },
  { name:"Musik", icon:"icon-music.png" }
];

const radius = 3;
const sprites = [];

const loader = new THREE.TextureLoader();

menuItems.forEach((item, i) => {
  const texture = loader.load(item.icon);

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent:true
  });

  const sprite = new THREE.Sprite(material);
  const angle = (i / menuItems.length) * Math.PI * 2;

  sprite.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.6,
    Math.sin(angle) * radius
  );

  sprite.scale.set(1.2,1.2,1.2);
  sprite.userData = { menu:item.name };

  scene.add(sprite);
  sprites.push(sprite);
});

  menus.forEach((m,i)=>{
    const angle=(i/menus.length)*Math.PI*2;
    const geo=new THREE.SphereGeometry(0.35,32,32);
    const mat=new THREE.MeshStandardMaterial({color:0xff4ecd});
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(
      Math.cos(angle)*radius,
      Math.sin(angle)*radius,
      0
    );
    mesh.userData=m;
    group.add(mesh);
  });

  scene.add(group);

  const light=new THREE.PointLight(0xffffff,1);
  light.position.set(5,5,5);
  scene.add(light);

  animate();
}

/* RENDER */
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}

/* DRAG ROTATION */
menuContainer.addEventListener("mousedown",e=>{
  isDrag=true; lastX=e.clientX; lastY=e.clientY;
});
window.addEventListener("mouseup",()=>isDrag=false);
window.addEventListener("mousemove",e=>{
  if(!isDrag) return;
  rotY+=(e.clientX-lastX)*0.005;
  rotX+=(e.clientY-lastY)*0.005;
  group.rotation.set(rotX,rotY,0);
  lastX=e.clientX; lastY=e.clientY;
});

/* CLICK MENU */
menuContainer.addEventListener("click",e=>{
  const mouse=new THREE.Vector2(
    (e.clientX/innerWidth)*2-1,
    -(e.clientY/innerHeight)*2+1
  );
  const ray=new THREE.Raycaster();
  ray.setFromCamera(mouse,camera);
  const hit=ray.intersectObjects(group.children);
  if(hit.length){
    openMenu(hit[0].object.userData.id);
  }
});

/* ---------- CONTENT ---------- */
function openMenu(id){
  menuContainer.classList.add("hidden");
  content.classList.remove("hidden");

  const data={
    surat:"<h2>💌 Surat</h2><p>Aku membuat ini karena kamu spesial.</p>",
    galeri:"<h2>📷 Galeri</h2><p>Isi dengan foto kenangan.</p>",
    video:"<h2>🎥 Video</h2><p>Tempat video spesial.</p>",
    hadiah:"<h2>🎁 Hadiah</h2><p>Hadiah kecil penuh makna.</p>",
    lagu:"<h2>🎶 Lagu</h2><p>Lagu kita berdua.</p>",
    about:"<h2>💜 Tentang Kita</h2><p>Cerita perjalanan kita.</p>"
  };

  contentInner.innerHTML=data[id];
}

/* BACK */
backBtn.onclick=()=>{
  content.classList.add("hidden");
  menuContainer.classList.remove("hidden");
};
