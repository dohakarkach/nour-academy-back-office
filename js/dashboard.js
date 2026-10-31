import { courses } from "./data.js";
import { inscription} from "./data.js";

const CAPACITY = 15;

function formatMoney(amount) {
  return amount.toLocaleString("fr-FR") + " MAD";
}

function getStatistics(inscriptions) {
  const stats = {
    total: inscriptions.length,
    waiting: 0,
    validated: 0,
    paid: 0,
    revenue: 0,
  };

  inscriptions.forEach((inscription) => {
    if (inscription.statut === "En attente") {
      stats.waiting++;
    }

    if (inscription.statut === "Validée") {
      stats.validated++;
    }

    if (inscription.statut === "Payée") {
      stats.paid++;
      for (let id of inscription.cours) stats.revenue += courses[id - 1].prix;
    }
  });

  return stats;
}

function getCourseOccupancy(inscriptions) {
  const courseObject = [];

  for (let course of courses) {
    let obj = {
      name: course.titre,
      students: 0,
    };

    courseObject.push(obj);
  }

  inscriptions.forEach((inscription) => {
    for (let id of inscription.cours) courseObject[id - 1].students++;
  });

  return courseObject;
}

function renderCourseOccupancy(inscriptions) {
  const courses = getCourseOccupancy(inscriptions);

  if (courses.length === 0) {
    return "<p>Aucun cours à afficher.</p>";
  }

  let html = "";

  courses.forEach((course) => {
    const percentage = Math.round((course.students / CAPACITY) * 100);

    html += `
      <article class="course-occupancy">
        <div class="course-info">
          <h3>${course.name}</h3>
          <span>${course.students} / ${CAPACITY} élèves</span>
        </div>

        <div
          class="progress-track"
          role="progressbar"
          aria-label="Remplissage du cours ${course.name}"
          aria-valuemin="0"
          aria-valuemax="${CAPACITY}"
          aria-valuenow="${course.students}"
        >
          <div
            class="progress-fill"
            style="width: ${Math.min(percentage, 100)}%"
          ></div>
        </div>

        <p class="course-percentage">${percentage}%</p>
      </article>
    `;
  });

  return html;
}

export function renderDashboard() {
  const stats = getStatistics(inscription);

  return `
    <div id="tableau-de-bord" class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Vue générale des inscriptions de Nour Academy.</p>
    </div>

    <section class="dashboard-stats" aria-label="Statistiques générales">
      <article class="stat-card">
        <p class="stat-label">Nombre d'inscrits</p>
        <p class="stat-value">${stats.total}</p>
      </article>

      <article class="stat-card">
        <p class="stat-label">En attente</p>
        <p class="stat-value">${stats.waiting}</p>
      </article>

      <article class="stat-card">
        <p class="stat-label">Validées</p>
        <p class="stat-value">${stats.validated}</p>
      </article>

      <article class="stat-card">
        <p class="stat-label">Payées</p>
        <p class="stat-value">${stats.paid}</p>
      </article>

      <article class="stat-card revenue-card">
        <p class="stat-label">Recettes encaissées</p>
        <p class="stat-value">${formatMoney(stats.revenue)}</p>
      </article>
    </section>

    <section class="dashboard-panel">
      <h2>Remplissage des cours</h2>
      <p class="panel-description">
        Nombre d'élèves inscrits par rapport à la capacité maximale.
      </p>

      <div class="course-list">
        ${renderCourseOccupancy(inscription)}
      </div>
    </section>
  `;
}
