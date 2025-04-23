const { exec } = require("child_process");

document.addEventListener("DOMContentLoaded", () => {
  const horasInput = document.getElementById("horasInput");
  const minutosInput = document.getElementById("minutosInput");
  const startBtn = document.getElementById("startBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const countdownDisplay = document.getElementById("countdown");

  let countdownInterval = null;

  startBtn.addEventListener("click", () => {
    const horas = parseInt(horasInput.value) || 0;
    const minutos = parseInt(minutosInput.value) || 0;
    const totalSegundos = (horas * 3600) + (minutos * 60);

    if (totalSegundos <= 0) {
      alert("Ingresá un tiempo válido.");
      return;
    }

    exec(`shutdown /s /t ${totalSegundos}`, (error) => {
      if (error) {
        console.error("❌ Error al programar el apagado:", error);
        alert("No se pudo programar el apagado.");
      } else {
        console.log(`🕒 Apagado en ${horas}h ${minutos}m.`);
        iniciarCountdown(totalSegundos);
      }
    });
  });

  cancelBtn.addEventListener("click", () => {
    exec("shutdown /a", (error) => {
      if (error) {
        console.error("❌ Error al cancelar el apagado:", error);
        alert("No se pudo cancelar el apagado.");
      } else {
        console.log("⛔ Apagado cancelado.");
        detenerCountdown();
      }
    });
  });

  function iniciarCountdown(segundosTotales) {
    detenerCountdown(); // Limpia uno anterior si existe
    countdownDisplay.textContent = "";
    countdownInterval = setInterval(() => {
      if (segundosTotales <= 0) {
        detenerCountdown();
        countdownDisplay.textContent = "⚠️ Apagando ahora...";
        return;
      }

      const horas = Math.floor(segundosTotales / 3600);
      const minutos = Math.floor((segundosTotales % 3600) / 60);
      const segundos = segundosTotales % 60;

      countdownDisplay.textContent = `⏳ Apagado en: ${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
      segundosTotales--;
    }, 1000);
  }

  function detenerCountdown() {
    clearInterval(countdownInterval);
    countdownDisplay.textContent = "";
  }

  function pad(n) {
    return n.toString().padStart(2, '0');
  }
});