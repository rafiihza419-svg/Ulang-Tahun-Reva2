const opening = document.getElementById("opening");
const heart = document.getElementById("heart");
const container = document.getElementById("three-container");

heart.addEventListener("click", () => {
    console.log("❤️ HEART CLICKED"); // DEBUG (boleh dihapus nanti)

    opening.style.opacity = "0";

    setTimeout(() => {
        opening.style.display = "none";
        initThree();
        animate();
        startFallingParticles();
    }, 800);
});
