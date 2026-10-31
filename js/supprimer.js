import { inscription } from "./data.js";
import { renderDashboard } from "./dashboard.js"

export function deleteListeners() {
  for (let candidate of inscription) {
    const deleteBtn = document.getElementById(`s${candidate.numero}`);
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        supprimerLigne(deleteBtn.parentElement.parentElement, candidate.numero);
      });
    }
  }
}

function supprimerLigne(line, id) {
  line.classList.add("hidden");

  const index = inscription.findIndex((candidate) => candidate.numero === id);
  if (index !== -1) inscription.splice(index, 1);

  localStorage.setItem("inscriptions", JSON.stringify(inscription));

  const dashboard = document.querySelector("#dashboard");
  dashboard.innerHTML = renderDashboard();
}
