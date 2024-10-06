const hamburger = document.querySelector(".hamburger");
const mobile_nav_links = document.querySelector(".mobile-nav-links");
const nav_link = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("rotate");
  mobile_nav_links.classList.toggle("display");
});

nav_link.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobile_nav_links.classList.contains("display")) {
      mobile_nav_links.classList.remove("display");
      hamburger.classList.remove("rotate");
    }
  });
});

// document.addEventListener("click", () => {
//   if (mobile_nav_links.classList.contains("display")) {
//     mobile_nav_links.classList.remove("display");
//     hamburger.classList.remove("rotate");
//   }
// });
