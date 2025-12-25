const heart = document.getElementById("heart");
const opening = document.getElementById("opening");
const menu = document.getElementById("menu");

heart.onclick = () => {
  opening.style.opacity = 0;
  setTimeout(() => {
    opening.style.display = "none";
    menu.classList.remove("hidden");
  }, 600);
};
