function updateGauge(idFill, idText, value) {
    const angle = (value / 100) * 360;
    document.getElementById(idFill).style.background = 
        `conic-gradient(#4caf50 ${angle}deg, transparent 0deg)`;
    document.getElementById(idText).innerText = value + "%";
}

// Test : valeurs aléatoires toutes les 1 sec
setInterval(() => {
    let cpuValue = Math.floor(Math.random() * 100);  
    let ramValue = Math.floor(Math.random() * 100);

    updateGauge("cpu-fill", "cpu-text", cpuValue);
    updateGauge("ram-fill", "ram-text", ramValue);
}, 1000);
