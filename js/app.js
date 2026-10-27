import { renderDashboard } from "./dashboard.js";

let menuButton = document.getElementById("menuButton");
let sidebar = document.getElementById("sidebar");
let leftArrow = document.getElementById("mobile-button");

menuButton.addEventListener("click", () => {
  if (window.innerWidth <= 850) sidebar.classList.toggle("sidebar-open");
  else sidebar.classList.toggle("sidebar-collapsed");

  menuButton.setAttribute(
    "aria-expanded",
    sidebar.classList.contains("sidebar-open") ||
      !sidebar.classList.contains("sidebar-collapsed")
      ? "true"
      : "false",
  );
});

leftArrow.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
    leftArrow.setAttribute( "aria-expanded", false);
})

const pageContent = document.querySelector("#pageContent");

pageContent.innerHTML = renderDashboard();
