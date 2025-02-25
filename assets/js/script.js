document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector(".btn");

    btn.addEventListener("mouseover", function() {
        btn.style.backgroundColor = "#ff0055";
    });

    btn.addEventListener("mouseout", function() {
        btn.style.backgroundColor = "#ff4d94";
    });
});
