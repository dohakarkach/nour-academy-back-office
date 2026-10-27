import {inscription} from './data.js';


const donneesSauvegardees = localStorage.getItem("inscription");

if (donneesSauvegardees === null) {
  localStorage.setItem("inscriptions", JSON.stringify(inscription));
}
const inscriptionsSauvegardees = JSON.parse(
  localStorage.getItem("inscriptions")
);

// 4. Sélectionner le tbody dans le HTML
const tableau = document.querySelector("#inscriptions-body");

// 5. Afficher chaque inscription dans une ligne
inscriptionsSauvegardees.forEach((inscription) => {
  const ligne = document.createElement("tr");

  ligne.innerHTML = `
    <td>${inscription.numero}</td>
    <td>${inscription.eleve}</td>
    <td>${inscription.niveau}</td>
    <td>${inscription.cours}</td>
    <td>${inscription.telephone}</td>
    <td>${inscription.statut}</td>
    <td>${inscription.date}</td>
  `;

  tableau.appendChild(ligne);
});



