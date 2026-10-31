import { inscription } from "./data.js";
import { renderDashboard } from "./dashboard.js";

const niveauOptions = ["Primaire", "Collège", "Tronc commun", "1re Bac", "2e Bac"];

const statutOptions = ["En attente", "Validée", "Payée"];

export function editListeners() {
  for (let candidate of inscription) {
    const editBtn = document.getElementById(`m${candidate.numero}`);
    if (editBtn) {
      editBtn.addEventListener("click", (ev) => {
        modifierLigne(editBtn.parentNode.parentNode, ev);
      });
    }
  }
}

function modifierLigne(line, event) {

    const cells = line.children;

    const currentEleve = cells[1].textContent.trim();
    const currentNiveau = cells[2].textContent.trim();
    const currentCours = String(cells[3].innerHTML).trim().split("<br><br>");
    const currentTel = cells[4].textContent.trim();
    const currentStatut = cells[5].textContent.trim();


    cells[1].contentEditable = "plaintext-only";
    cells[4].contentEditable = "plaintext-only";

    cells[1].classList.add("editable");
    cells[4].classList.add("editable");

    const niveauSelect = document.createElement("select");
    niveauOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === currentNiveau) option.selected = true;
        niveauSelect.appendChild(option);
    });
    cells[2].innerHTML = "";
    cells[2].appendChild(niveauSelect);

    const statutSelect = document.createElement("select");
    statutOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === currentStatut) option.selected = true;
        statutSelect.appendChild(option);
    });
    cells[5].innerHTML = "";
    cells[5].appendChild(statutSelect);

    const updateChecklist = (selectedNiveau) => {
        cells[3].innerHTML = "";
        const courses = selectedNiveau === "Primaire" ? ["Mathématiques", "Français"] : ["Mathématiques", "Français", "Anglais", "Physique-Chimie", "SVT"];

        courses.forEach(course => {
            const label = document.createElement("label");
            label.style.display = "block";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = course;

            if (currentCours.includes(course)) input.checked = true;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${course}`));
            cells[3].appendChild(label);
        });
    };

    updateChecklist(currentNiveau);
    niveauSelect.addEventListener("change", () => updateChecklist(niveauSelect.value));

    // console.log(cells[6].children[1]);

    // const index = inscription.findIndex((candidate) => candidate.numero === id);
    //   if (index !== -1) inscription.splice(index, 1);

    localStorage.setItem("inscriptions", JSON.stringify(inscription));

    const dashboard = document.querySelector("#dashboard");
    dashboard.innerHTML = renderDashboard();
}
