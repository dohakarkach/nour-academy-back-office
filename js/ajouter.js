
import { courses, inscription } from "./data.js";
import { regexNom, regexTelephone } from "./validation.js";
import { renderTable } from "./inscription.js";

export function afficherFormulaire() {
  const page = document.getElementById("formulaire");

  if (document.getElementById("formInscription")) return;

  // Initialiser localStorage
  if (localStorage.getItem("inscriptions") === null) {
    localStorage.setItem("inscriptions", JSON.stringify(inscription));
  }

  // Créer le formulaire
  const formSection = document.createElement("section");
  formSection.className = "form";

  const form = document.createElement("form");
  form.id = "formInscription";

  form.innerHTML = `
    <h1>Ajouter une inscription</h1>

    <label for="nom">Nom</label>
    <input type="text" id="nom" placeholder="Nom de famille">
    <p class="erreur" id="erreur-nom"></p>

    <label for="prenom">Prénom</label>
    <input type="text" id="prenom" placeholder="Prénom">
    <p class="erreur" id="erreur-prenom"></p>

    <label for="telephone">Téléphone du parent</label>
    <input type="tel" id="telephone" placeholder="06XXXXXXXX">
    <p class="erreur" id="erreur-telephone"></p>

    <label for="niveau">Niveau scolaire</label>
    <select id="niveau">
      <option value="">Choisir un niveau</option>
    </select>
    <p class="erreur" id="erreur-niveau"></p>

    <label>Cours disponibles</label>
    <div id="cours"></div>
    <p class="erreur" id="erreur-cours"></p>

    <button type="submit">Ajouter l'inscription</button>
  `;

  formSection.appendChild(form);
  page.appendChild(formSection);

  // Récupérer les éléments
  const nom = form.querySelector("#nom");
  const prenom = form.querySelector("#prenom");
  const telephone = form.querySelector("#telephone");
  const niveau = form.querySelector("#niveau");
  const containerCours = form.querySelector("#cours");

  // Récupérer les inscriptions
  function getInscriptions() {
    return JSON.parse(localStorage.getItem("inscriptions")) || [];
  }

  // Afficher les messages
  function afficherMessage(id, message, type) {
    const element = form.querySelector(`#${id}`);
    element.textContent = message;
    element.className = type;
  }

  // Validation d'un champ
  function verifierChamp(input, regex, erreurId, messageErreur) {
    const valeur = input.value.trim();

    if (valeur === "") {
      afficherMessage(erreurId, "Ce champ est obligatoire.", "erreur");

      input.classList.remove("input-valide");
      input.classList.add("input-invalide");

      return false;
    }

    if (regex.test(valeur)) {
      afficherMessage(erreurId, "✓ Valide", "valide");

      input.classList.remove("input-invalide");
      input.classList.add("input-valide");

      return true;
    }

    afficherMessage(erreurId, messageErreur, "erreur");

    input.classList.remove("input-valide");
    input.classList.add("input-invalide");

    return false;
  }

  // Validation en temps réel du nom
  nom.addEventListener("input", () => {
    verifierChamp(nom, regexNom, "erreur-nom", "Nom invalide.");
  });

  // Validation en temps réel du prénom
  prenom.addEventListener("input", () => {
    verifierChamp(prenom, regexNom, "erreur-prenom", "Prénom invalide.");
  });

  // Validation en temps réel du téléphone
  telephone.addEventListener("input", () => {
    verifierChamp(
      telephone,
      regexTelephone,
      "erreur-telephone",
      "Téléphone invalide. Exemple : 0612345678"
    );
  });

  // Remplir les niveaux automatiquement
const niveaux = [...new Set(inscription.map(i => i.niveau))];

  niveaux.forEach(niveauCours => {
    const option = document.createElement("option");

    option.value = niveauCours;
    option.textContent = niveauCours;

    niveau.appendChild(option);
  });
const groupesCours = {
  "Primaire": [1, 2],
  "Collège": [3, 4, 5, 6, 7],
  "Tronc commun": [8, 9, 10],
  "1re Bac": [11, 12, 13],
  "2e Bac": [16, 17, 18],
  "Lycée": [14, 15]
};
  // Afficher les cours selon le niveau choisi
  niveau.addEventListener("change", () => {
    containerCours.innerHTML = "";

    afficherMessage("erreur-niveau", "", "erreur");
    afficherMessage("erreur-cours", "", "erreur");

    if (niveau.value === "") {
      niveau.classList.remove("input-valide", "input-invalide");
      return;
    }

    niveau.classList.remove("input-invalide");
    niveau.classList.add("input-valide");

    const idsCours = groupesCours[niveau.value] || [];

const coursDisponibles = courses.filter(
  c => idsCours.includes(Number(c.id))
);

    const inscriptions = getInscriptions();

    coursDisponibles.forEach(c => {
      const nombreInscrits = inscriptions.filter(
        inscriptionExistante =>
          inscriptionExistante.cours.some(
            id => Number(id) === Number(c.id)
          )
      ).length;

      const label = document.createElement("label");
      label.className = "cours-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = c.id;
      checkbox.className = "checkbox-cours";

      if (nombreInscrits >= 15) {
        checkbox.disabled = true;
        label.append(
          checkbox,
          ` ${c.titre} - Complet`
        );
      } else {
        label.append(
          checkbox,
          ` ${c.titre} - ${c.prix} MAD - ${15 - nombreInscrits} places restantes`
        );
      }

      containerCours.appendChild(label);
    });
  });

  // Validation des Checkbox
  containerCours.addEventListener("change", () => {
    const coursSelectionnes = containerCours.querySelectorAll(
      ".checkbox-cours:checked"
    );

    if (coursSelectionnes.length > 0) {
      afficherMessage(
        "erreur-cours",
        "✓ Cours sélectionné(s)",
        "valide"
      );
    } else {
      afficherMessage(
        "erreur-cours",
        "",
        "erreur"
      );
    }
  });

  // Soumission du formulaire
  form.addEventListener("submit", event => {
    event.preventDefault();

    const nomValide = verifierChamp(
      nom,
      regexNom,
      "erreur-nom",
      "Nom invalide."
    );

    const prenomValide = verifierChamp(
      prenom,
      regexNom,
      "erreur-prenom",
      "Prénom invalide."
    );

    const telephoneValide = verifierChamp(
      telephone,
      regexTelephone,
      "erreur-telephone",
      "Téléphone invalide. Exemple : 0612345678"
    );

    let formulaireValide = true;

    // Vérifier le niveau
    if (niveau.value === "") {
      afficherMessage(
        "erreur-niveau",
        "Veuillez choisir un niveau.",
        "erreur"
      );

      niveau.classList.add("input-invalide");
      formulaireValide = false;
    }

    // Récupérer les Checkbox cochées
    const coursSelectionnes = Array.from(
      containerCours.querySelectorAll(".checkbox-cours:checked")
    ).map(checkbox => Number(checkbox.value));

    // Vérifier les cours
    if (coursSelectionnes.length === 0) {
      afficherMessage(
        "erreur-cours",
        "Veuillez choisir au moins un cours.",
        "erreur"
      );

      formulaireValide = false;
    }

    // Vérifier tous les champs
    if (
      !nomValide ||
      !prenomValide ||
      !telephoneValide ||
      !formulaireValide
    ) {
      return;
    }

    const inscriptions = getInscriptions();

    const eleve = `${prenom.value.trim()} ${nom.value.trim()}`;

    // Vérifier les doublons
    const doublon = inscriptions.some(inscriptionExistante => {
      const memeEleve =
        inscriptionExistante.eleve.toLowerCase() ===
        eleve.toLowerCase();

      const memeCours = inscriptionExistante.cours.some(id =>
        coursSelectionnes.includes(Number(id))
      );

      return memeEleve && memeCours;
    });

    if (doublon) {
      afficherMessage(
        "erreur-cours",
        "Cet élève est déjà inscrit à un de ces cours.",
        "erreur"
      );

      return;
    }

    // Vérifier la capacité maximale de 15 élèves
    const coursComplets = coursSelectionnes.some(id => {
      const nombreInscrits = inscriptions.filter(
        inscriptionExistante =>
          inscriptionExistante.cours.some(
            coursId => Number(coursId) === Number(id)
          )
      ).length;

      return nombreInscrits >= 15;
    });

    if (coursComplets) {
      afficherMessage(
        "erreur-cours",
        "Ce groupe a atteint sa capacité maximale de 15 élèves.",
        "erreur"
      );

      return;
    }

    // Générer le numéro de dossier
    const numeros = inscriptions.map(i =>
      Number(i.numero.replace("INS-", ""))
    );

    const prochainNumero = Math.max(0, ...numeros) + 1;

    const numero = `INS-${String(prochainNumero).padStart(3, "0")}`;

    // Créer la nouvelle inscription
    const nouvelleInscription = {
      numero: numero,
      eleve: eleve,
      niveau: niveau.value,
      cours: coursSelectionnes,
      telephone: telephone.value.trim(),
      statut: "En attente",
      date: new Date().toISOString().slice(0, 10)
    };

    // Ajouter et sauvegarder
    inscriptions.push(nouvelleInscription);

    localStorage.setItem(
      "inscriptions",
      JSON.stringify(inscriptions)
    );

    // Actualiser le tableau
    const ancienTableau = document.querySelector(".inscriptions-page");

    if (ancienTableau) {
      ancienTableau.replaceWith(renderTable());
    }

    alert("Inscription ajoutée avec succès !");

    // Réinitialiser le formulaire
    form.reset();
    containerCours.innerHTML = "";

    form.querySelectorAll(".erreur, .valide").forEach(element => {
      element.textContent = "";
    });

    form.querySelectorAll("input, select").forEach(element => {
      element.classList.remove("input-valide", "input-invalide");
    });
  });
}
