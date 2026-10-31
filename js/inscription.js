import { inscription, setInscription, courses } from "./data.js";

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
          <button id="m${inscription.numero}" class="menu-button table-button" type="button">M</button>
          <button id="s${inscription.numero}" class="menu-button table-button" type="button">S</button>
        </td>
      `;
      tableBody.appendChild(ligne);

    });

    resultCount.textContent =
      resultats.length + " inscription(s) trouvée(s)";
  }

  searchInput.addEventListener("input", afficherInscriptions);
  statusFilter.addEventListener("change", afficherInscriptions);
  sortBy.addEventListener("change", afficherInscriptions);

  afficherInscriptions();

  return pageContent;
}