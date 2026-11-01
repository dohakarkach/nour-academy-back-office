
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

    <label for="cours">Cours disponibles</label>
    <select id="cours" multiple></select>
    <small>Maintenir Ctrl pour sélectionner plusieurs cours.</small>
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
  const selectCours = form.querySelector("#cours");

  // Récupérer les inscriptions depuis localStorage
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
      afficherMessage(
        erreurId,
        "Ce champ est obligatoire.",
        "erreur"
      );

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
    verifierChamp(
      nom,
      regexNom,
      "erreur-nom",
      "Nom invalide."
    );
  });

  // Validation en temps réel du prénom
  prenom.addEventListener("input", () => {
    verifierChamp(
      prenom,
      regexNom,
      "erreur-prenom",
      "Prénom invalide."
    );
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
  const niveaux = [...new Set(courses.map(c => c.niveau))];

  niveaux.forEach(niveauCours => {
    const option = document.createElement("option");

    option.value = niveauCours;
    option.textContent = niveauCours;

    niveau.appendChild(option);
  });

  // Afficher les cours selon le niveau choisi
  niveau.addEventListener("change", () => {
    selectCours.innerHTML = "";

    afficherMessage("erreur-niveau", "", "erreur");
    afficherMessage("erreur-cours", "", "erreur");

    selectCours.classList.remove("input-valide", "input-invalide");

    if (niveau.value === "") {
      niveau.classList.remove("input-valide", "input-invalide");
      return;
    }

    niveau.classList.remove("input-invalide");
    niveau.classList.add("input-valide");

    const coursDisponibles = courses.filter(
      c => c.niveau === niveau.value
    );

    const inscriptions = getInscriptions();

    coursDisponibles.forEach(c => {
      const option = document.createElement("option");

      option.value = c.id;

      const nombreInscrits = inscriptions.filter(
        inscriptionExistante =>
          inscriptionExistante.cours.some(
            id => Number(id) === Number(c.id)
          )
      ).length;

      if (nombreInscrits >= 15) {
        option.textContent = `${c.titre} - Complet`;
        option.disabled = true;
      } else {
        option.textContent =
          `${c.titre} - ${c.prix} MAD - ${15 - nombreInscrits} places restantes`;
      }

      selectCours.appendChild(option);
    });
  });

  // Validation de la sélection des cours
  selectCours.addEventListener("change", () => {
    const selection = Array.from(selectCours.selectedOptions)
      .filter(option => !option.disabled);

    if (selection.length > 0) {
      afficherMessage(
        "erreur-cours",
        "✓ Cours sélectionné(s)",
        "valide"
      );

      selectCours.classList.remove("input-invalide");
      selectCours.classList.add("input-valide");
    } else {
      afficherMessage("erreur-cours", "", "erreur");
      selectCours.classList.remove("input-valide", "input-invalide");
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

      niveau.classList.remove("input-valide");
      niveau.classList.add("input-invalide");

      formulaireValide = false;
    }

    // Récupérer les cours sélectionnés
    const coursSelectionnes = Array.from(
      selectCours.selectedOptions
    )
      .filter(option => !option.disabled)
      .map(option => Number(option.value));

    // Vérifier les cours
    if (coursSelectionnes.length === 0) {
      afficherMessage(
        "erreur-cours",
        "Veuillez choisir au moins un cours.",
        "erreur"
      );

      selectCours.classList.add("input-invalide");
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
    selectCours.innerHTML = "";

    document.querySelectorAll(".erreur").forEach(element => {
      element.textContent = "";
    });

    form.querySelectorAll("input, select").forEach(element => {
      element.classList.remove("input-valide", "input-invalide");
    });
  });
}
