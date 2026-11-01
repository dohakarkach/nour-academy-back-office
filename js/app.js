
console.log("APP JS fonctionne");
import { afficherFormulaire } from "./ajouter.js";
import { renderDashboard } from "./dashboard.js";
import { renderTable } from "./inscription.js";

import { deleteListeners } from "./supprimer.js";

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
  leftArrow.setAttribute("aria-expanded", false);
});

const dashboard = document.querySelector("#dashboard");
const table = document.querySelector("#table");
const formulaire = document.querySelector("#formulaire");

dashboard.innerHTML = renderDashboard();
table.appendChild(renderTable());
afficherFormulaire();

const navigationLinks = Array.from(
  document.querySelectorAll(".nav-group a[href^='#']"),
);

function updateSelectedNavigationLink() {
  const activeLink =
    navigationLinks.find((link) => link.hash === window.location.hash) ??
    navigationLinks[0];

  navigationLinks.forEach((link) => {
    const isActive = link === activeLink;
    link.classList.toggle("selected", isActive);

    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("hashchange", updateSelectedNavigationLink);
updateSelectedNavigationLink();

deleteListeners()
