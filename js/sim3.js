const Sim3 = {
    CANDIDATOS: 4, REGIONES: 3,
    nomCand: ["", "A. Pérez", "B. Gómez", "C. Ruiz", "D. Sosa"],
    nomReg: ["", "Norte", "Centro", "Sur"],
    archivo: [], matriz: [], isAnimating: false, isPaused: false,
    
    init() {
        this.archivo = Array.from({length: 40}, () => ({
            mesa: Math.floor(Math.random()*5000+1),
            cand: Math.floor(Math.random()*this.CANDIDATOS + 1),
            reg: Math.floor(Math.random()*this.REGIONES + 1),
            votos: Math.floor(Math.random()*500 + 10)
        }));
        
        this.matriz = Array(this.CANDIDATOS + 2).fill().map(() => Array(this.REGIONES + 2).fill(0));
        
        this.render();
        document.getElementById('console-3').innerHTML = '';
        writeCon('console-3', `> Actas cargadas (${this.archivo.length}).`);
        
        this.isAnimating = false; this.isPaused = false;
        setButtons(3, false, true, true, false, false);
    },
    render() {
        const t = document.getElementById('matrix-3'); t.innerHTML = '';
        
        let thead = '<tr class="table-light"><th class="border-0"></th>';
        for(let j=1; j<=this.REGIONES; j++) { thead += `<th>${this.nomReg[j]}</th>`; }
        thead += `<th class="table-secondary border-secondary">Total Nac.</th></tr>`;
        t.innerHTML += `<thead>${thead}</thead>`;
        
        let tbody = document.createElement('tbody');
        for(let i=1; i<=this.CANDIDATOS+1; i++) {
            let tr = document.createElement('tr');
            let isTotal = i === this.CANDIDATOS+1;
            let thClass = isTotal ? 'table-secondary border-secondary' : 'bg-light';
            
            tr.innerHTML = `<td class="text-end fw-bold align-middle text-nowrap ${thClass}">${isTotal ? 'Votos Región' : this.nomCand[i]}</td>`;
            for(let j=1; j<=this.REGIONES+1; j++) {
                let cls = 'bg-white';
                if(isTotal && j === this.REGIONES+1) cls = 'table-warning border-warning fw-bold text-dark';
                else if(isTotal || j === this.REGIONES+1) cls = 'table-secondary fw-bold text-dark';
                
                tr.innerHTML += `<td id="s3-c${i}-${j}" class="${cls}">0</td>`;
            }
            tbody.appendChild(tr);
        }
        t.appendChild(tbody);
    },
    updateDOM(i, j) { document.getElementById(`s3-c${i}-${j}`).innerText = this.matriz[i][j]; },
    
    async step() {
        if(this.archivo.length === 0) return this.end();
        if(!this.isAnimating) setButtons(3, false, false, false, false, false);
        
        const reg_obj = this.archivo.shift();
        const {cand, reg, votos} = reg_obj;
        writeCon('console-3', formatReg(reg_obj));
        
        this.matriz[cand][reg] += votos;
        let c1 = document.getElementById(`s3-c${cand}-${reg}`);
        c1.classList.add('active-cell'); this.updateDOM(cand, reg);
        writeCon('console-3', `↳ Celda: matriz[${cand}][${reg}] := matriz[${cand}][${reg}] + ${votos}`, true);
        await sleep(500); c1.classList.remove('active-cell');
        
        this.matriz[cand][this.REGIONES+1] += votos;
        let c2 = document.getElementById(`s3-c${cand}-${this.REGIONES+1}`);
        c2.classList.add('active-total-cell'); this.updateDOM(cand, this.REGIONES+1);
        writeCon('console-3', `↳ Total Fila: matriz[${cand}][${this.REGIONES+1}] := matriz[${cand}][${this.REGIONES+1}] + ${votos}`, true);
        await sleep(500); c2.classList.remove('active-total-cell');
        
        this.matriz[this.CANDIDATOS+1][reg] += votos;
        let c3 = document.getElementById(`s3-c${this.CANDIDATOS+1}-${reg}`);
        c3.classList.add('active-total-cell'); this.updateDOM(this.CANDIDATOS+1, reg);
        writeCon('console-3', `↳ Total Col: matriz[${this.CANDIDATOS+1}][${reg}] := matriz[${this.CANDIDATOS+1}][${reg}] + ${votos}`, true);
        await sleep(500); c3.classList.remove('active-total-cell');
        
        this.matriz[this.CANDIDATOS+1][this.REGIONES+1] += votos;
        let c4 = document.getElementById(`s3-c${this.CANDIDATOS+1}-${this.REGIONES+1}`);
        c4.classList.add('active-total-cell'); this.updateDOM(this.CANDIDATOS+1, this.REGIONES+1);
        writeCon('console-3', `↳ Gran Total: matriz[${this.CANDIDATOS+1}][${this.REGIONES+1}] := matriz[${this.CANDIDATOS+1}][${this.REGIONES+1}] + ${votos}`, true);
        await sleep(500); c4.classList.remove('active-total-cell');
        
        if(this.archivo.length === 0) this.end();
        else if(!this.isAnimating) setButtons(3, false, true, true, false, false);
    },
    
    async play() {
        this.isAnimating = true; this.isPaused = false;
        setButtons(3, false, false, false, true, false);
        while(this.archivo.length > 0 && !this.isPaused) { await this.step(); }
        this.isAnimating = false;
        if(this.isPaused && this.archivo.length > 0) {
            setButtons(3, false, true, true, false, false);
            writeCon('console-3', '> [PAUSADO] Esperando instrucción...');
        }
    },
    
    pause() {
        this.isPaused = true;
        document.getElementById('btn-pause-3').disabled = true;
    },
    
    end() { writeCon('console-3', '> [EOF] Conteo finalizado.'); setButtons(3, true, false, false, false, true); },
    results() {
        writeCon('console-3', `\n--- VOTOS NACIONALES: ${this.matriz[this.CANDIDATOS+1][this.REGIONES+1]} ---`);
        setButtons(3, true, false, false, false, false);
    }
};