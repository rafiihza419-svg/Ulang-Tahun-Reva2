document.addEventListener('DOMContentLoaded',()=>{

const opening=document.getElementById('opening-overlay');
const heart=document.getElementById('heart-logo');
const menuOrbit=document.getElementById('menu-orbit');
const content=document.getElementById('content');
const items=document.querySelectorAll('.menu-item');
const ambient=document.getElementById('ambient-music');
const bg=document.getElementById('bg-music');

/* OPENING */
ambient.volume=0.3;
ambient.play().catch(()=>{});

heart.addEventListener('click',()=>{
  opening.style.opacity=0;
  ambient.pause();
  bg.play().catch(()=>{});
  setTimeout(()=>{
    opening.style.display='none';
    menuOrbit.classList.remove('hidden');
  },1200);
},{once:true});

/* MENU POSITION (LINGKARAN) */
const radius=160;
items.forEach((item,i)=>{
  const angle=(i/items.length)*Math.PI*2;
  const x=Math.cos(angle)*radius;
  const y=Math.sin(angle)*radius;
  const z=Math.sin(angle)*40;
  item.style.transform=`translate3d(${x}px,${y}px,${z}px)`;
});

/* MANUAL ROTATE */
let drag=false,lx=0,ly=0,rx=0,ry=0;

menuOrbit.addEventListener('mousedown',e=>{
  drag=true; lx=e.clientX; ly=e.clientY;
});
window.addEventListener('mouseup',()=>drag=false);
window.addEventListener('mousemove',e=>{
  if(!drag)return;
  ry+=(e.clientX-lx)*0.25;
  rx-=(e.clientY-ly)*0.25;
  menuOrbit.style.transform=
    `translate(-50%,-50%) rotateX(${rx}deg) rotateY(${ry}deg)`;
  lx=e.clientX; ly=e.clientY;
});

/* MENU CLICK */
items.forEach(item=>{
  item.onclick=()=>openMenu(item.dataset.menu);
});

function openMenu(menu){
  menuOrbit.classList.add('hidden');
  content.classList.remove('hidden');

  let html=`<button id="back-btn">← Kembali</button><div class="fade-in">`;

  if(menu==='surat'){
    html+=`<h2>💌 Surat</h2>
    <p>Sejak awal perjalanan ini, aku tahu kamu adalah rumah yang selalu ingin aku tuju.</p>`;
  }
  if(menu==='galeri'){
    html+=`
    <h2>📷 Galeri</h2>
    <div class="gallery">
      <img src="assets/photo1.jpg">
      <img src="assets/photo2.jpg">
      <img src="assets/photo3.jpg">
      <img src="assets/photo4.jpg">
      <img src="assets/photo5.jpg">
      <img src="assets/photo6.jpg">
    </div>`;
  }
  if(menu==='video'){
    html+=`<h2>🎥 Video</h2>
    <video controls width="90%">
      <source src="assets/video.mp4" type="video/mp4">
    </video>`;
  }
  if(menu==='hadiah'){
    html+=`<h2>🎁 Hadiah Kecil</h2>
    <p>Hadiah ini sederhana, tapi perasaanku ke kamu luar biasa 💖</p>`;
  }
  if(menu==='bunga'){
    html+=`<h2>🌸 Bunga</h2>
    <p>Bunga ini akan selalu mekar untukmu 🌷</p>`;
  }
  if(menu==='secret'){
    const p=prompt('Password?');
    html+= p==='tanggaljadian'
      ? `<h2>🔐 Rahasia</h2><p>Aku mencintaimu tanpa syarat.</p>`
      : `<p>Password salah.</p>`;
  }

  html+=`</div>`;
  content.innerHTML=html;
  document.getElementById('back-btn').onclick=back;
}

function back(){
  content.classList.add('hidden');
  content.innerHTML='';
  menuOrbit.classList.remove('hidden');
}

});

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
