// --- JAUGE LOGIC -----------------------------------------------------------

function updateGauge(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);

    if (!fill || !text) return;

    // Angle du remplissage
    const deg = (value / 100) * 360;

    // Mise à jour du remplissage
    fill.style.background = `conic-gradient(#4caf50 ${deg}deg, transparent ${deg}deg)`;

    // Mise à jour du texte au centre
    text.innerText = value.toFixed(1);
}

function refreshGauges() {
    fetch("/api/stats")
        .then(r => r.json())
        .then(data => {
            updateGauge("cpu-fill", "cpu-text", data.cpu);
            updateGauge("ram-fill", "ram-text", data.ram);
        })
        .catch(err => console.error("Erreur API Stats:", err));
}

// Rafraîchit toutes les secondes
setInterval(refreshGauges, 1000);


// --- PAGINATION LOGIC -----------------------------

const PROCESSES_PER_PAGE = 10; 
let currentPage = 1;
let processRows = [];
let totalPages = 0;

document.addEventListener('DOMContentLoaded', () => {
    refreshGauges();

    processRows = Array.from(document.querySelectorAll('.tableau-processus.ligne.process-item'));
    if (processRows.length === 0) return;

    totalPages = Math.ceil(processRows.length / PROCESSES_PER_PAGE);

    initSimplePagination();
    displayPage(currentPage);
});


// Affiche une page de 10 lignes max
function displayPage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    const start = (page - 1) * PROCESSES_PER_PAGE;
    const end = start + PROCESSES_PER_PAGE;

    processRows.forEach((row, idx) => {
        if (idx >= start && idx < end) {
            row.classList.remove("hidden");
            row.style.display = "grid";
        } else {
            row.classList.add("hidden");
            row.style.display = "none";
        }
    });

    updateSimplePaginationUI();
}


// Initialise pagination simple : Précédent / Suivant
function initSimplePagination() {
    const pagination = document.querySelector('.pagination');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!pagination || !prevBtn || !nextBtn) return;

    // Supprime tous les anciens numéros
    const items = Array.from(pagination.children);
    items.forEach(li => {
        if (!li.contains(prevBtn) && !li.contains(nextBtn)) li.remove();
    });

    // Clic Précédent
    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) displayPage(currentPage - 1);
    };

    // Clic Suivant
    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) displayPage(currentPage + 1);
    };
}


// Actualise l'état des boutons
function updateSimplePaginationUI() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.parentElement.classList.toggle("disabled", currentPage === 1);
    nextBtn.parentElement.classList.toggle("disabled", currentPage === totalPages);
}
