// ------------------------------
// Variables globales
// ------------------------------
let currentPage = 1;       // Page en cours
let itemsPerPage = 20;     // Nombre d'éléments affichés par page
let totalPages = 1;        // Mis à jour automatiquement


// ------------------------------
// Met à jour l'affichage de la liste des processus
// ------------------------------
function updateProcessList() {
    const items = Array.from(document.querySelectorAll(".process-item"));
    totalPages = Math.ceil(items.length / itemsPerPage);

    // Masquer tous les items
    items.forEach(item => item.classList.add("hidden"));

    // Calcul index début / fin
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Afficher la bonne tranche
    items.slice(start, end).forEach(item => item.classList.remove("hidden"));

    // Rafraîchir la pagination
    renderPagination(currentPage, totalPages);
}


// ------------------------------
// Affichage pagination : seulement Précédent / Suivant
// ------------------------------
function renderPagination(currentPage, totalPages) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = ""; // Reset

    // Bouton PRECEDENT
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">
                &laquo; Précédent
            </a>
        </li>
    `;

    // Petit indicateur de page
    pagination.innerHTML += `
        <li class="page-item">
            <span class="page-link" style="cursor: default;">
                Page ${currentPage} / ${totalPages}
            </span>
        </li>
    `;

    // Bouton SUIVANT
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">
                Suivant &raquo;
            </a>
        </li>
    `;
}


// ------------------------------
// Changer de page
// ------------------------------
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    updateProcessList();
}


// ------------------------------
// Initialisation auto au chargement
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    updateProcessList();
});
