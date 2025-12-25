const opening = document.getElementById("opening");
const menu = document.getElementById("menu");
const page = document.getElementById("page");
const content = document.getElementById("content");
const heart = document.getElementById("heart");

heart.onclick = () => {
  opening.style.display = "none";
  menu.classList.remove("hidden");
  startParticles();
};

function openPage(type) {
  menu.classList.add("hidden");
  page.classList.remove("hidden");

  if (type === "foto") {
    content.innerHTML = `
      <h2>Foto 📸</h2>
      <div class="foto-grid">
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
      </div>`;
  }

  if (type === "video") {
    content.innerHTML = `
      <h2>Video 🎥</h2>
      <video controls width="100%"></video><br><br>
      <video controls width="100%"></video>`;
  }

  if (type === "hadiah") {
    content.innerHTML = `
      <h2>🎁 Selamat Ulang Tahun</h2>
      <p>Semoga hari ini penuh cinta dan kebahagiaan 💖</p>`;
  }

  if (type === "pesan") {
    content.innerHTML = `
      <h2>💌 Pesan</h2>
      <p>Terima kasih sudah hadir dan membuat segalanya lebih indah.</p>`;
  }

  if (type === "kejutan") {
    content.innerHTML = `
      <h2>🎆 Kejutan</h2>
      <p>BOOM!! 🎉🎉🎉</p>`;
  }

  if (type === "secret") {
    content.innerHTML = `
      <h2>🔒 Secret</h2>
      <p><b>jadi kapan mau official?</b></p>`;
  }
}

function backMenu() {
  page.classList.add("hidden");
  menu.classList.remove("hidden");
}

function startParticles() {
  const icons = ["🌸","💗"];
  setInterval(() => {
    const s = document.createElement("span");
    s.innerHTML = icons[Math.floor(Math.random()*icons.length)];
    s.style.left = Math.random()*100 + "vw";
    s.style.fontSize = Math.random()*18 + 14 + "px";
    s.style.animationDuration = Math.random()*3 + 4 + "s";
    document.querySelector(".particles").appendChild(s);
    setTimeout(()=>s.remove(),7000);
  }, 350);
}
