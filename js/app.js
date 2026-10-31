
console.log("APP JS fonctionne");

import { renderDashboard } from "./dashboard.js";
import { renderTable } from "./inscription.js";
import { afficherFormulaire } from "./ajouter.js";

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const leftArrow = document.getElementById("mobile-button");

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    if (window.innerWidth <= 850) {
      sidebar.classList.toggle("sidebar-open");
    } else {
      sidebar.classList.toggle("sidebar-collapsed");
    }

    menuButton.setAttribute(
      "aria-expanded",
      sidebar.classList.contains("sidebar-open") ||
        !sidebar.classList.contains("sidebar-collapsed")
        ? "true"
        : "false"
    );
  });
}

if (leftArrow && sidebar) {
  leftArrow.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
    leftArrow.setAttribute("aria-expanded", "false");
  });
}

const pageContent = document.querySelector("#pageContent");

if (pageContent) {
  pageContent.innerHTML = renderDashboard();

  pageContent.appendChild(renderTable());

  afficherFormulaire();
}
