const cooldownDuration = 2 * 24 * 60 * 60 * 1000; // 2 jours en millisecondes
let cooldownStartTime = localStorage.getItem('cooldownStartTime');
if (!cooldownStartTime) {
    cooldownStartTime = Date.now();
    localStorage.setItem('cooldownStartTime', cooldownStartTime);
} else {
    cooldownStartTime = parseInt(cooldownStartTime);
}
function updateCooldownTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - cooldownStartTime;
    const remainingTime = Math.max(cooldownDuration - elapsedTime, 0);
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    document.getElementById("cooldownTimer").textContent = `Fin du ctp dans: ${days}j${hours}h${minutes}m${seconds}s`;
}
setInterval(updateCooldownTimer, 1000);