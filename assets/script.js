const hamburger = document.querySelector(".hamburger");
const mobile_nav_links = document.querySelector(".mobile-nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("rotate");
  mobile_nav_links.classList.toggle("display");
});
