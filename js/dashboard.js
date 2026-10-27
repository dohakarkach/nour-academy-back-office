import { courses } from "./data.js";

const CAPACITY = 15;

const sampleInscriptions = [
  {
    studentName: "Amine Alaoui",
    course: [1, 5, 8],
    status: "Payée",
    fee: 1200,
  },
  {
    studentName: "Sara Amrani",
    course: [7, 10, 12],
    status: "Validée",
    fee: 1200,
  },
  {
    studentName: "Youssef Karim",
    course: [15],
    status: "En attente",
    fee: 1200,
  },
  {
    studentName: "Salma Idrissi",
    course: [15, 16],
    status: "Payée",
    fee: 1200,
  },
  { studentName: "Adam Naji", course: [3, 5], status: "Payée", fee: 1500 },
  {
    studentName: "Lina Fassi",
    course: [16, 17, 18],
    status: "Validée",
    fee: 1500,
  },
  {
    studentName: "Omar Bennis",
    course: [14, 15],
    status: "En attente",
    fee: 1500,
  },
  {
    studentName: "Meryem Saidi",
    course: [7, 8, 10],
    status: "Payée",
    fee: 1000,
  },
  {
    studentName: "Anas Tazi",
    course: [6],
    status: "Payée",
    fee: 1000,
  },
  {
    studentName: "Aya Mansouri",
    course: [14],
    status: "Validée",
    fee: 1000,
  },
  { studentName: "Hamza Rami", course: [12, 16], status: "Payée", fee: 1200 },
  {
    studentName: "Nour El Fassi",
    course: [3, 4],
    status: "Payée",
    fee: 1500,
  },
  {
    studentName: "Ilyas Haddad",
    course: [1, 2],
    status: "En attente",
    fee: 1000,
  },
  {
    studentName: "Imane Ziani",
    course: [7, 8, 9],
    status: "Validée",
    fee: 1200,
  },
  {
    studentName: "Mehdi Chraibi",
    course: [16],
    status: "Payée",
    fee: 1500,
  },
  {
    studentName: "Aya Bennani",
    course: [11, 12],
    status: "Payée",
    fee: 1000,
  },
  {
    studentName: "Rayan Lahlou",
    course: [13],
    status: "En attente",
    fee: 1200,
  },
  {
    studentName: "Sara Naciri",
    course: [9, 10],
    status: "Validée",
    fee: 1500,
  },
  {
    studentName: "Yassine Boulahcen",
    course: [8, 9],
    status: "Payée",
    fee: 1000,
  },
  {
    studentName: "Loubna Ait Ali",
    course: [16],
    status: "Payée",
    fee: 1200,
  },
];

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
    if (inscription.status === "En attente") {
      stats.waiting++;
    }

    if (inscription.status === "Validée") {
      stats.validated++;
    }

    if (inscription.status === "Payée") {
      stats.paid++;
      for (let id of inscription.course) stats.revenue += courses[id - 1].prix;
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
    for (let id of inscription.course) courseObject[id - 1].students++;
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
  const inscriptions = sampleInscriptions;
  const stats = getStatistics(inscriptions);

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
        ${renderCourseOccupancy(inscriptions)}
      </div>
    </section>
  `;
}
