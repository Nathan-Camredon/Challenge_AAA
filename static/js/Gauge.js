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


// --- PAGINATION LOGIC (Corrigée) -------------------------------------------

const PROCESSES_PER_PAGE = 10; 
let currentPage = 1;
let processRows = [];
let totalPages = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Lancer les jauges
    refreshGauges();

    // 2. Récupérer les processus
    processRows = Array.from(document.querySelectorAll('.tableau-processus.ligne.process-item'));

    if (processRows.length === 0) return;

    // 3. Calculer le nombre de pages
    totalPages = Math.ceil(processRows.length / PROCESSES_PER_PAGE);

    // 4. Initialiser la pagination
    setupPagination();
    displayPage(currentPage);
});

function displayPage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    const startIndex = (page - 1) * PROCESSES_PER_PAGE;
    const endIndex = startIndex + PROCESSES_PER_PAGE;

    // Affiche ou cache les lignes
    processRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.classList.remove('hidden');
            row.style.display = 'grid'; // Force l'affichage grid
        } else {
            row.classList.add('hidden');
            row.style.display = 'none';
        }
    });

    updatePaginationUI();
}

function setupPagination() {
    const paginationUl = document.querySelector('.pagination');
    const prevBtn = document.getElementById('prev-btn'); // C'est le lien <a>
    const nextBtn = document.getElementById('next-btn'); // C'est le lien <a>
    
    if (!paginationUl || !prevBtn || !nextBtn) return;

    // Nettoyage : On garde uniquement les boutons Précédent et Suivant
    // On supprime les anciens numéros ou indicateurs (comme "Page 1")
    const items = Array.from(paginationUl.children);
    items.forEach(item => {
        if (!item.contains(prevBtn) && !item.contains(nextBtn)) {
            item.remove();
        }
    });

    // Le parent <li> du bouton Suivant (pour insérer avant lui)
    const nextLi = nextBtn.closest('li');

    // Générer les numéros de page (1, 2, 3...)
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.innerText = i;
        
        // Clic sur un numéro
        a.onclick = (e) => {
            e.preventDefault();
            displayPage(i);
        };

        li.appendChild(a);
        paginationUl.insertBefore(li, nextLi);
    }

    // Gestionnaire Clic Précédent
    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) displayPage(currentPage - 1);
    };

    // Gestionnaire Clic Suivant
    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) displayPage(currentPage + 1);
    };

    updatePaginationUI();
}

function updatePaginationUI() {
    // Mettre à jour la classe 'active' sur les numéros
    const pageLinks = document.querySelectorAll('.pagination .page-item .page-link');
    pageLinks.forEach(link => {
        // On ignore les boutons prev/next pour le style "active"
        if (link.id !== 'prev-btn' && link.id !== 'next-btn') {
            const pageNum = parseInt(link.innerText);
            if (pageNum === currentPage) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        }
    });
}