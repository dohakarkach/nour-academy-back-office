import { inscription } from "./data.js";
import { courses } from "./data.js";

const donneesSauvegardees = localStorage.getItem("inscription");

if (donneesSauvegardees === null) {
  localStorage.setItem("inscriptions", JSON.stringify(inscription));
}
const inscriptionsSauvegardees = JSON.parse(
  localStorage.getItem("inscriptions"),
);

export function renderTable() {
  const pageContent = document.createElement("div");
  pageContent.classList.add("table-container");

  const table = document.createElement("table");
  table.innerHTML = `
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
          `;

  const tableBody = document.createElement("tbody");
  tableBody.id = "inscriptions-body";

  inscriptionsSauvegardees.forEach((inscription) => {
    const ligne = document.createElement("tr");

    // Récupérer les cours correspondants aux IDs dans l'inscription sans .map() ni .find()
    const tableauDesCours = [];

    for (let i = 0; i < inscription.cours.length; i++) {
      const coursId = inscription.cours[i];

      const coursTrouve = courses.find((c) => Number(c.id) === Number(coursId));

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
    <td>${inscription.date}</td>
`;

    tableBody.appendChild(ligne);
  });

  table.appendChild(tableBody);
  pageContent.appendChild(table);

  return pageContent;
}
