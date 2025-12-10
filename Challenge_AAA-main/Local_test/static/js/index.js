function updateGauge(id, value) {
    const fill = document.getElementById(id);
    const deg = (value / 100) * 360;

    fill.style.background = `conic-gradient(#4caf50 ${deg}deg, transparent 0deg)`;
}