const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const sceneContainer = document.getElementById("scene-container");
const content = document.getElementById("content");
const contentInner = document.getElementById("content-inner");
const backBtn = document.getElementById("back");

let scene, camera, renderer, controls;

/* OPENING */
heart.onclick = ()=>{
  opening.style.display="none";
  sceneContainer.classList.remove("hidden");
  init3D();
};

/* INIT THREE */
function init3D(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneContainer.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;

  /* LIGHT */
  const light = new THREE.PointLight(0xffffff,1);
  light.position.set(10,10,10);
  scene.add(light);

  /* SPHERE */
  const sphereGeo = new THREE.SphereGeometry(2,32,32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color:0x8e44ad,
    wireframe:true,
    transparent:true,
    opacity:0.3
  });
  const sphere = new THREE.Mesh(sphereGeo,sphereMat);
  scene.add(sphere);

  /* MENU ITEMS */
  const menus = [
    {name:"Surat", text:"💌 Surat"},
    {name:"Galeri", text:"📷 Galeri"},
    {name:"Video", text:"🎥 Video"},
    {name:"Hadiah", text:"🎁 Hadiah"},
    {name:"Bunga", text:"🌸 Bunga"},
    {name:"Secret", text:"🔐 Secret"}
  ];

  menus.forEach((m,i)=>{
    const sprite = createLabel(m.text);
    const phi = Math.acos(-1 + (2*i)/menus.length);
    const theta = Math.sqrt(menus.length*Math.PI)*phi;

    sprite.position.setFromSphericalCoords(2,phi,theta);
    sprite.userData = m;
    scene.add(sprite);
  });

  animate();
}

/* LABEL */
function createLabel(text){
  const div = document.createElement("div");
  div.className="menu-label";
  div.innerHTML=text;

  const texture = new THREE.CanvasTexture(htmlToCanvas(div));
  const material = new THREE.SpriteMaterial({map:texture});
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.5,0.6,1);
  sprite.onClick = ()=>openMenu(text);
  return sprite;
}

/* HTML to Canvas */
function htmlToCanvas(el){
  const canvas = document.createElement("canvas");
  canvas.width=256;
  canvas.height=128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle="#fff";
  ctx.fillRect(0,0,256,128);
  ctx.fillStyle="#000";
  ctx.font="24px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.fillText(el.innerText,128,64);
  return canvas;
}

/* CLICK DETECTION */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click",e=>{
  mouse.x = (e.clientX/window.innerWidth)*2-1;
  mouse.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if(intersects.length){
    const obj = intersects[0].object;
    if(obj.userData?.name){
      openMenu(obj.userData.name);
    }
  }
});

/* OPEN MENU */
function openMenu(name){
  sceneContainer.classList.add("hidden");
  content.classList.remove("hidden");
  contentInner.innerHTML = `<h1>${name}</h1><p>Isi menu ${name}</p>`;
}

/* BACK */
backBtn.onclick = ()=>{
  content.classList.add("hidden");
  sceneContainer.classList.remove("hidden");
};

/* ANIMATE */
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}

/* RESIZE */
window.onresize=()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
};

['click','touchstart'].forEach(evt=>{
  heartLogo.addEventListener(evt, ()=>{
    openingOverlay.style.opacity = '0';
    openingOverlay.style.pointerEvents = 'none';

    setTimeout(()=>{
      openingOverlay.style.display = 'none';
      menuOrbit.classList.remove('hidden');
    },1000);
  }, { once:true });
});
