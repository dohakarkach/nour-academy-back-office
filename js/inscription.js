import { inscription, setInscription, courses } from "./data.js";
import { editListeners } from "./modifier.js";
import { deleteListeners } from "./supprimer.js";

const donneesSauvegardees = localStorage.getItem("inscriptions");

if (donneesSauvegardees === null) {
  localStorage.setItem("inscriptions", JSON.stringify(inscription));
}

setInscription(JSON.parse(localStorage.getItem("inscriptions")));

export function renderTable() {
  const pageContent = document.createElement("div");
  pageContent.classList.add("inscriptions-page");
  pageContent.id = "inscriptions";

  const searchInput = document.getElementById("globalSearch");
  const statusFilter = document.getElementById("statusFilter");
  const sortBy = document.querySelector("#sortBy");

  searchInput.value = sessionStorage.getItem("recherche") || "";
  statusFilter.value = sessionStorage.getItem("statutFiltre") || "Tous";
  sortBy.value = sessionStorage.getItem("triFiltre") || sortBy.value;

  pageContent.innerHTML = `
    <p id="resultCount" aria-live="polite"></p>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Numéro de dossier</th>
            <th>Élève</th>
            <th>Niveau</th>
            <th>Cours</th>
            <th>Téléphone du parent</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="inscriptions-body"></tbody>
      </table>
    </div>
  `;

  const tableBody = pageContent.querySelector("#inscriptions-body");
  const resultCount = pageContent.querySelector("#resultCount");

  function afficherInscriptions() {
    const recherche = searchInput.value.trim().toLowerCase();
    const statutChoisi = statusFilter.value;
    const triChoisi = sortBy.value;

    sessionStorage.setItem("recherche", searchInput.value);
    sessionStorage.setItem("statutFiltre", statutChoisi);
    sessionStorage.setItem("triFiltre", triChoisi);

    // Lire les dernières inscriptions depuis localStorage
    const inscriptionsSauvegardees =
      JSON.parse(localStorage.getItem("inscriptions")) || [];

    const resultats = [];

    inscription.forEach((inscription) => {
      const nom = inscription.eleve.toLowerCase();
      const telephone = inscription.telephone.toLowerCase();

      const correspondRecherche =
        nom.includes(recherche) || telephone.includes(recherche);

      const correspondStatut =
        statutChoisi === "Tous" || inscription.statut === statutChoisi;

      if (correspondRecherche && correspondStatut) {
        resultats.push(inscription);
      }
    });

    resultats.sort((a, b) => {
      if (triChoisi === "nom-asc") {
        return a.eleve.localeCompare(b.eleve, "fr");
      }

      if (triChoisi === "nom-desc") {
        return b.eleve.localeCompare(a.eleve, "fr");
      }

      if (triChoisi === "date-asc") {
        return a.date.localeCompare(b.date);
      }

      if (triChoisi === "date-desc") {
        return b.date.localeCompare(a.date);
      }

      return 0;
    });

    tableBody.innerHTML = "";

    resultats.forEach((inscription) => {
      const ligne = document.createElement("tr");
      const tableauDesCours = [];

      for (let i = 0; i < inscription.cours.length; i++) {
        const coursId = inscription.cours[i];

        const coursTrouve = courses.find(
          (cours) => Number(cours.id) === Number(coursId),
        );

        if (coursTrouve) {
          tableauDesCours.push(coursTrouve.matiere);
        }
      }

      ligne.innerHTML = `
        <td>${inscription.numero}</td>
        <td>${inscription.eleve}</td>
        <td>${inscription.niveau}</td>
        <td>${tableauDesCours.join("<br><br>")}</td>
        <td>${inscription.telephone}</td>
        <td>${inscription.statut}</td>
        <td class="date-container">
          <div class="date">${inscription.date}</div>
          <button id="m${inscription.numero}" class="menu-button table-button" type="button">
            <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button id="s${inscription.numero}" class="menu-button table-button" type="button">
            <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </td>
      `;
      tableBody.appendChild(ligne);
    });

    resultCount.textContent = resultats.length + " inscription(s) trouvée(s)";

    editListeners();
    deleteListeners();
  }

  searchInput.addEventListener("input", afficherInscriptions);
  statusFilter.addEventListener("change", afficherInscriptions);
  sortBy.addEventListener("change", afficherInscriptions);

  afficherInscriptions();

  return pageContent;
}