// --- JAUGE LOGIC ---

/**
 * Met à jour une jauge (remplissage et texte) en fonction de la valeur (0-100).
 * @param {string} fillId - ID de l'élément de remplissage de la jauge.
 * @param {string} textId - ID de l'élément de texte au centre.
 * @param {number} value - La valeur en pourcentage (ex: 45.5).
 */
function updateGauge(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);

    if (!fill || !text) {
        // console.error("Gauge element not found:", fillId, textId); // Commenté pour éviter le spam
        return;
    }

    // Angle du remplissage
    const deg = (value / 100) * 360;

    // Mise à jour du remplissage (conic-gradient)
    fill.style.background = `conic-gradient(#4caf50 ${deg}deg, transparent ${deg}deg)`;

    // Mise à jour du texte au centre
    text.innerText = value.toFixed(1);
}

/**
 * Récupère les données CPU/RAM via l'API et met à jour les jauges.
 */
function refreshGauges() {
    fetch("/api/stats")
        .then(r => r.json())
        .then(data => {
            // data.cpu et data.ram doivent venir du JSON de ton API
            updateGauge("cpu-fill", "cpu-text", data.cpu);
            updateGauge("ram-fill", "ram-text", data.ram);
        })
        .catch(err => console.error("Erreur API Stats:", err));
}

// Rafraîchit toutes les secondes
setInterval(refreshGauges, 1000);


// --- NOUVEAU : PAGINATION LOGIC --------------------------------------------

const PROCESSES_PER_PAGE = 15; // *** À modifier si vous voulez plus ou moins d'éléments par page ***
let currentPage = 1;
let processRows = [];
let totalPages = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    // Exécute la première mise à jour des jauges au chargement
    refreshGauges();

    // 1. Récupérer toutes les lignes de processus, SAUF l'en-tête.
    processRows = Array.from(document.querySelectorAll('.tableau-processus.ligne'));

    if (processRows.length === 0) {
        // Cache la pagination si aucun processus n'est trouvé
        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }

    // 2. Calculer le nombre total de pages
    totalPages = Math.ceil(processRows.length / PROCESSES_PER_PAGE);

    // 3. Afficher le contenu initial et configurer les événements
    setupPagination();
    displayPage(currentPage);
});

/**
 * Affiche les lignes de processus correspondant à la page donnée.
 * @param {number} page - Le numéro de page à afficher (commence à 1).
 */
function displayPage(page) {
    // Vérification de la validité de la page
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    const startIndex = (page - 1) * PROCESSES_PER_PAGE;
    const endIndex = startIndex + PROCESSES_PER_PAGE;

    processRows.forEach((row, index) => {
        // Affiche la ligne si son index est compris dans l'intervalle
        if (index >= startIndex && index < endIndex) {
            row.style.display = 'grid'; // Affiche la ligne
        } else {
            row.style.display = 'none'; // Cache la ligne
        }
    });

    updatePaginationUI();
}

/**
 * Construit les liens de pagination et attache les gestionnaires d'événements.
 */
function setupPagination() {
    const paginationUl = document.querySelector('.pagination');
    if (!paginationUl) return;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Vider les anciens numéros de page (tout ce qui n'est pas les flèches)
    let currentChild = paginationUl.firstChild;
    while (currentChild) {
        let nextChild = currentChild.nextSibling;
        if (currentChild.id !== 'prev-btn' && currentChild.id !== 'next-btn' && currentChild.nodeType === 1) {
            currentChild.remove();
        }
        currentChild = nextChild;
    }

    // 1. Générer les numéros de page
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i;
        a.dataset.page = i;

        // Gestionnaire de clic pour les numéros
        a.addEventListener('click', (e) => {
            e.preventDefault();
            displayPage(parseInt(e.target.dataset.page));
        });

        paginationUl.insertBefore(li, nextBtn); // Insère avant le bouton Suivant
        li.appendChild(a);
    }

    // 2. Attacher les événements aux flèches (uniquement si ce n'est pas déjà fait)
    // Pour éviter de doubler les écouteurs si setupPagination était appelé plusieurs fois

    // Pour "Précédent"
    const prevLink = prevBtn.querySelector('.page-link');
    if (prevLink) {
        prevLink.onclick = (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                displayPage(currentPage - 1);
            }
        };
    }

    // Pour "Suivant"
    const nextLink = nextBtn.querySelector('.page-link');
    if (nextLink) {
        nextLink.onclick = (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                displayPage(currentPage + 1);
            }
        };
    }

    updatePaginationUI();
}

/**
 * Met à jour les classes 'active' et 'disabled' des boutons de pagination.
 */
function updatePaginationUI() {
    const pageItems = document.querySelectorAll('.pagination .page-item');

    // Mise à jour de l'état "active" pour les numéros de page
    pageItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('.page-link');
        if (link && parseInt(link.dataset.page) === currentPage) {
            item.classList.add('active');
        }
    });

    // Mise à jour de l'état "disabled" des flèches
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.classList.toggle('disabled', currentPage === 1);
    }

    if (nextBtn) {
        nextBtn.classList.toggle('disabled', currentPage === totalPages);
    }
}