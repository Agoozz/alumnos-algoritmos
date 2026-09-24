// Helpers compartidos
const sleep = ms => new Promise(r => setTimeout(r, ms));

function formatReg(reg) {
    let html = `<div style="background: rgba(0,0,0,0.2); border-left: 3px solid #ffbfa0; padding: 6px; margin: 4px 0; border-radius: 0 4px 4px 0; line-height: 1.2;">`;
    html += `<div style="color: #ffbfa0; font-weight: bold; font-size: 0.75rem; margin-bottom: 5px; letter-spacing: 0.5px;">ðŸ“¥ REGISTRO LEÃDO:</div>`;
    html += `<div style="display: flex; flex-wrap: wrap; gap: 5px;">`;
    for (const [key, value] of Object.entries(reg)) {
        html += `<div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <span style="color: #a0e8c5;">${key}:</span> <span style="color: #fff; font-weight: 600;">${value}</span>
                 </div>`;
    }
    html += `</div></div>`;
    return html;
}

function writeCon(id, text, isSub = false) {
    const term = document.getElementById(id);
    const formatted = text.replace(/\n/g, '<br>');
    
    let style = "border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2px; margin-bottom: 2px;";
    if (isSub) {
        style += " color: #ffbfa0; padding-left: 15px; font-size: 0.75rem; border-bottom: none;";
    }
    
    term.innerHTML += `<div style="${style}">${formatted}</div>`;
    term.scrollTop = term.scrollHeight;
}

function setButtons(simId, init, step, play, pause, res) {
    document.getElementById(`btn-init-${simId}`).disabled = !init;
    document.getElementById(`btn-step-${simId}`).disabled = !step;
    document.getElementById(`btn-play-${simId}`).disabled = !play;
    document.getElementById(`btn-pause-${simId}`).disabled = !pause;
    document.getElementById(`btn-res-${simId}`).disabled = !res;
}

/* =========================================
   SIMULADOR 1: PREVIAJE (Totales Columna)
   ========================================= */

