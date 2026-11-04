import { inscription } from "./data.js";
import { renderDashboard } from "./dashboard.js";
import { renderTable } from "./inscription.js";
import { deleteListeners } from "./supprimer.js";

const niveauOptions = [
  "Primaire",
  "Collège",
  "Tronc commun",
  "1re Bac",
  "2e Bac",
];

const statutOptions = ["En attente", "Validée", "Payée"];

export let needToConfirm = new Map();

export function editListeners() {
  for (let candidate of inscription) {
    const editBtn = document.getElementById(`m${candidate.numero}`);
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        modifierLigne(editBtn.parentNode.parentNode);
      });
    }
  }
}

function modifierLigne(line) {
  const cells = line.children;

  for (let numero of needToConfirm.keys()) {
    if (numero !== cells[0].textContent && needToConfirm.get(numero)) {
      // alert(
      //   "Vous devez confirmer les modifications de la ligne " +
      //     numero +
      //     " avant de modifier une autre ligne.",
      // );
      return;
    }
  }

  if (needToConfirm.get(cells[0].textContent)) {
    confirmerLigne(line);
    return;
  }

  const currentNiveau = cells[2].textContent.trim();
  const currentCours = String(cells[3].innerHTML).trim().split("<br><br>");
  const currentStatut = cells[5].textContent.trim();

  cells[1].contentEditable = "plaintext-only";
  cells[4].contentEditable = "plaintext-only";

  cells[1].classList.add("editable");
  cells[4].classList.add("editable");

  const niveauSelect = document.createElement("select");
  niveauOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    if (opt === currentNiveau) option.selected = true;
    niveauSelect.appendChild(option);
  });
  cells[2].innerHTML = "";
  cells[2].appendChild(niveauSelect);

  const statutSelect = document.createElement("select");
  statutOptions.forEach((opt) => {
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
    const courses =
      selectedNiveau === "Primaire"
        ? ["Mathématiques", "Français"]
        : ["Mathématiques", "Français", "Anglais", "Physique-Chimie", "SVT"];

    courses.forEach((course) => {
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
  niveauSelect.addEventListener("change", () =>
    updateChecklist(niveauSelect.value),
  );

  cells[6].children[1].innerHTML = `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
  <polyline points="17 21 17 13 7 13 7 21" />
  <polyline points="7 3 7 8 15 8" />
</svg>`;

  needToConfirm.set(cells[0].textContent, true);
}

function confirmerLigne(line) {
  const cells = line.children;

  const eleveInput = cells[1].firstChild.textContent.trim();
  if (!eleveInput.match(/^[A-Za-z\s'-]+$/)) {
    alert("Le nom de l'élève n'est pas valide.");
    return;
  }

  const telInput = cells[4].firstChild.textContent.trim();
  if (!telInput.match(/^0[67][0-9]{8}$/)) {
    alert("Le numéro de téléphone n'est pas valide.");
    return;
  }

  const niveauSelect = cells[2].firstChild;

  if (!niveauOptions.includes(niveauSelect.value)) {
    alert("Le niveau scolaire n'est pas valide.");
    return;
  }

  const statutSelect = cells[5].firstChild;
  if (!statutOptions.includes(statutSelect.value)) {
    alert("Le statut n'est pas valide.");
    return;
  }

  const coursesCheckboxes = cells[3].querySelectorAll("input[type='checkbox']");

  let checkedCourses = [];
  for (let i = 0; i < coursesCheckboxes.length; i++) {
    if (coursesCheckboxes[i].checked) {
      checkedCourses.push(coursesCheckboxes[i].value);
    }
  }

  if (checkedCourses.length === 0) {
    alert("Vous devez sélectionner au moins un cours.");
    return;
  }

  if (niveauSelect.value === "Primaire") {
    for (let i = 0; i < checkedCourses.length; i++) {
      if (
        checkedCourses[i] !== "Mathématiques" &&
        checkedCourses[i] !== "Français"
      ) {
        alert(
          "Pour le niveau Primaire, seuls les cours Mathématiques et Français sont disponibles.",
        );
        return;
      }
    }
  }

  const allCourses = [
    "Mathématiques",
    "Français",
    "Anglais",
    "Physique-Chimie",
    "SVT",
  ];

  if (niveauSelect.value !== "Primaire") {
    for (let i = 0; i < checkedCourses.length; i++) {
      if (!allCourses.includes(checkedCourses[i])) {
        alert("Un des cours sélectionnés n'est pas valide.");
        return;
      }
    }
  }

  let full = false;

  checkedCourses.forEach((course) => {
    const courseId = idCourses(niveauSelect, [course])[0];
    const inscriptionsForCourse = inscription.filter((insc) =>
      insc.cours.includes(courseId) && insc.numero !== cells[0].textContent,
    );
    if (inscriptionsForCourse.length >= 15) {
      alert(`Le cours ${course} est complet.`);
      full = true;
      return;
    }
  });

  if (full) return;

  const numero = cells[0].textContent;
  const index = inscription.findIndex(
    (candidate) => candidate.numero === numero,
  );

  if (index !== -1) {
    inscription[index].eleve = eleveInput;
    inscription[index].niveau = niveauSelect.value;
    inscription[index].telephone = telInput;
    inscription[index].statut = statutSelect.value;
    inscription[index].cours = idCourses(niveauSelect, checkedCourses);
  }

  localStorage.setItem("inscriptions", JSON.stringify(inscription));

  const dashboard = document.querySelector("#dashboard");
  dashboard.innerHTML = renderDashboard();

  const table = document.querySelector("#table");
  table.innerHTML = "";
  table.appendChild(renderTable());
  deleteListeners();
  editListeners();

  needToConfirm.set(cells[0].textContent, false);
}

function idCourses(niveauSelect, checkedCourses) {
  const coursesData = [];

  if (niveauSelect.value === "Primaire") {
    checkedCourses.forEach((course) => {
      if (course === "Mathématiques") coursesData.push(1);
      if (course === "Français") coursesData.push(2);
    });
  }

  if (niveauSelect.value === "Collège") {
    checkedCourses.forEach((course) => {
      if (course === "Mathématiques") coursesData.push(3);
      if (course === "Français") coursesData.push(4);
      if (course === "Anglais") coursesData.push(5);
      if (course === "Physique-Chimie") coursesData.push(6);
      if (course === "SVT") coursesData.push(7);
    });
  }

  if (niveauSelect.value === "Tronc commun") {
    checkedCourses.forEach((course) => {
      if (course === "Mathématiques") coursesData.push(8);
      if (course === "Français") coursesData.push(15);
      if (course === "Anglais") coursesData.push(14);
      if (course === "Physique-Chimie") coursesData.push(9);
      if (course === "SVT") coursesData.push(10);
    });
  }

  if (niveauSelect.value === "1re Bac") {
    checkedCourses.forEach((course) => {
      if (course === "Mathématiques") coursesData.push(11);
      if (course === "Français") coursesData.push(15);
      if (course === "Anglais") coursesData.push(14);
      if (course === "Physique-Chimie") coursesData.push(12);
      if (course === "SVT") coursesData.push(13);
    });
  }

  if (niveauSelect.value === "2e Bac") {
    checkedCourses.forEach((course) => {
      if (course === "Mathématiques") coursesData.push(16);
      if (course === "Français") coursesData.push(15);
      if (course === "Anglais") coursesData.push(14);
      if (course === "Physique-Chimie") coursesData.push(17);
      if (course === "SVT") coursesData.push(18);
    });
  }

  return coursesData;
}
