
const regexNom = /^[A-Za-zÀ-ÿ\s'-]+$/;
const regexTelephone = /^0[67][0-9]{8}$/;

// 1. Création du formulaire
export function afficherFormulaire() {
  const formulaire = document.createElement("section");
  formulaire.classList.add("formulaire-inscription");

  formulaire.innerHTML = `
    <h2 class="titre-formulaire">Ajouter une inscription</h2>

    <form id="formInscription">
      <label for="nom">Nom de l'élève :</label>
      <input type="text" id="nom" class="champ" required>
      <p id="erreur-nom" class="message-erreur"></p>

      <label for="prenom">Prénom de l'élève :</label>
      <input type="text" id="prenom" class="champ" required>
      <p id="erreur-prenom" class="message-erreur"></p>

      <label for="telephone">Téléphone du parent :</label>
      <input type="tel" id="telephone" class="champ" required>
      <p id="erreur-telephone" class="message-erreur"></p>

      <label for="niveau">Niveau scolaire :</label>
      <select id="niveau" required>
        <option value="">Choisir un niveau</option>
        <option value="Primaire">Primaire</option>
        <option value="Collège">Collège</option>
        <option value="Tronc commun">Tronc commun</option>
        <option value="1re Bac">1re Bac</option>
        <option value="2e Bac">2e Bac</option>
      </select>

      <label for="cours">Cours (choisissez un ou plusieurs cours) :</label>
      <select id="cours" multiple required>
        <option value="Mathématiques">Mathématiques</option>
        <option value="Français">Français</option>
        <option value="Anglais">Anglais</option>
        <option value="Physique-Chimie">Physique-Chimie</option>
        <option value="SVT">SVT</option>
      </select>
      <p id="erreur-cours" class="message-erreur"></p>

      <button type="submit">Enregistrer l'inscription</button>
    </form>

    <p id="message"></p>
  `;

  return formulaire;
}

// 2. Validation du formulaire
export function verifierFormulaire() {
  const formulaire = document.querySelector("#formInscription");

  if (!formulaire) return;

  const niveau = formulaire.querySelector("#niveau");
  const cours = formulaire.querySelector("#cours");
  const erreurCours = formulaire.querySelector("#erreur-cours");
  const message = formulaire.parentElement.querySelector("#message");

  // Cours autorisés pour chaque niveau
  const coursParNiveau = {
    "Primaire": ["Mathématiques", "Français"],
    "Collège": [
      "Mathématiques",
      "Français",
      "Anglais",
      "Physique-Chimie",
      "SVT"
    ],
    "Tronc commun": [
      "Mathématiques",
      "Français",
      "Anglais",
      "Physique-Chimie",
      "SVT"
    ],
    "1re Bac": [
      "Mathématiques",
      "Français",
      "Anglais",
      "Physique-Chimie",
      "SVT"
    ],
    "2e Bac": [
      "Mathématiques",
      "Français",
      "Anglais",
      "Physique-Chimie",
      "SVT"
    ]
  };

  // Champs à vérifier
  const champs = [
    {
      id: "nom",
      regex: regexNom,
      erreur: "erreur-nom",
      texte: "Nom invalide : utilisez des lettres uniquement."
    },
    {
      id: "prenom",
      regex: regexNom,
      erreur: "erreur-prenom",
      texte: "Prénom invalide : utilisez des lettres uniquement."
    },
    {
      id: "telephone",
      regex: regexTelephone,
      erreur: "erreur-telephone",
      texte: "Téléphone invalide : 10 chiffres commençant par 06 ou 07."
    }
  ];

  // Vérification pendant la saisie
  champs.forEach(function (champInfo) {
    const input = formulaire.querySelector("#" + champInfo.id);
    const messageErreur = formulaire.querySelector(
      "#" + champInfo.erreur
    );

    input.addEventListener("input", function () {
      const valeur = input.value.trim();
      const valide = champInfo.regex.test(valeur);

      input.classList.toggle("invalide", valeur !== "" && !valide);
      input.classList.toggle("valide", valeur !== "" && valide);

      if (valeur === "") {
        messageErreur.textContent = "";
        messageErreur.className = "message-erreur";
      } else if (valide) {
        messageErreur.textContent = "✓ Champ valide !";
        messageErreur.className = "message-erreur succes";
      } else {
        messageErreur.textContent = "✗ " + champInfo.texte;
        messageErreur.className = "message-erreur";
      }
    });
  });

  // Vérification des cours selon le niveau
  function verifierCoursSelonNiveau() {
    const niveauChoisi = niveau.value;

    const coursChoisis = Array.from(cours.selectedOptions).map(
      function (option) {
        return option.value;
      }
    );

    const coursAutorises = coursParNiveau[niveauChoisi] || [];

    const valide =
      niveauChoisi !== "" &&
      coursChoisis.length > 0 &&
      coursChoisis.every(function (coursChoisi) {
        return coursAutorises.includes(coursChoisi);
      });

    if (!valide) {
      cours.classList.add("invalide");
      cours.classList.remove("valide");

      if (niveauChoisi === "") {
        erreurCours.textContent =
          "Choisissez d'abord un niveau scolaire.";
      } else if (coursChoisis.length === 0) {
        erreurCours.textContent = "Choisissez au moins un cours.";
      } else {
        erreurCours.textContent =
          "Un ou plusieurs cours ne sont pas disponibles pour ce niveau.";
      }

      erreurCours.className = "message-erreur";
    } else {
      cours.classList.remove("invalide");
      cours.classList.add("valide");
      erreurCours.textContent = "";
      erreurCours.className = "message-erreur succes";
    }

    return valide;
  }

  // Vérifier les cours quand le niveau ou la sélection change
  niveau.addEventListener("change", verifierCoursSelonNiveau);
  cours.addEventListener("change", verifierCoursSelonNiveau);

  // Vérification lors de l'envoi
  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    let champsInvalides = false;

    champs.forEach(function (champInfo) {
      const input = formulaire.querySelector("#" + champInfo.id);
      const messageErreur = formulaire.querySelector(
        "#" + champInfo.erreur
      );

      const valeur = input.value.trim();
      const valide = champInfo.regex.test(valeur);

      input.classList.toggle("invalide", !valide);
      input.classList.toggle("valide", valide);

      if (!valide) {
        champsInvalides = true;
        messageErreur.textContent = "✗ " + champInfo.texte;
        messageErreur.className = "message-erreur";
      } else {
        messageErreur.textContent = "✓ Champ valide !";
        messageErreur.className = "message-erreur succes";
      }
    });

    // Vérifier les cours une seule fois
    const coursValide = verifierCoursSelonNiveau();

    if (
      champsInvalides ||
      !coursValide ||
      !formulaire.checkValidity()
    ) {
      message.textContent =
        "Veuillez corriger les erreurs du formulaire.";
      message.className = "erreur";
      formulaire.reportValidity();
      return;
    }

    message.textContent = "Les informations sont valides !";
    message.className = "succes";
  });
}
