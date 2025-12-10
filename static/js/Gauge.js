// --- Met à jour une jauge ----------------------------------------------------
function updateGauge(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);

    if (!fill || !text) {
        console.error("Gauge element not found:", fillId, textId);
        return;
    }

    // Angle du remplissage
    const deg = (value / 100) * 360;

    // Mise à jour du remplissage
    fill.style.background = `conic-gradient(#4caf50 ${deg}deg, transparent 0deg)`;

    // Mise à jour du texte au centre
    text.innerText = value.toFixed(1);
}

// --- Récupère CPU / RAM via l’API -------------------------------------------
function refreshGauges() {
    fetch("/api/stats")
        .then(r => r.json())
        .then(data => {
            // data.cpu et data.ram doivent venir du JSON de ton API
            updateGauge("cpu-fill", "cpu-text", data.cpu);
            updateGauge("ram-fill", "ram-text", data.ram);
        })
        .catch(err => console.error("Erreur API:", err));
}

// Rafraîchit toutes les secondes
setInterval(refreshGauges, 1000);

// Première mise à jour au chargement
refreshGauges();