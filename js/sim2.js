const Sim2 = {
    TRIMESTRES: 4, SUCURSALES: 5,
    nomSuc: ["", "Centro", "Norte", "Sur", "Este", "Oeste"],
    archivo: [], matriz: [], isAnimating: false, isPaused: false,
    
    init() {
        this.archivo = Array.from({length: 30}, () => ({
            factura: "F-"+Math.floor(Math.random()*9000+1000),
            trim: Math.floor(Math.random()*this.TRIMESTRES + 1),
            suc: Math.floor(Math.random()*this.SUCURSALES + 1),
            ventas: Math.floor(Math.random()*100 + 5)
        }));
        
        this.matriz = Array(this.TRIMESTRES + 2).fill().map(() => Array(this.SUCURSALES + 1).fill(0));
        
        this.render();
        document.getElementById('console-2').innerHTML = '';
        writeCon('console-2', `> Archivo cargado (${this.archivo.length} registros).`);
        
        this.isAnimating = false; this.isPaused = false;
        setButtons(2, false, true, true, false, false);
    },
    render() {
        const t = document.getElementById('matrix-2'); t.innerHTML = '';
        let thead = '<tr class="table-light"><th class="border-0"></th>';
        for(let j=1; j<=this.SUCURSALES; j++) { thead += `<th>${this.nomSuc[j]}</th>`; }
        t.innerHTML += `<thead>${thead}</thead>`;
        
        let tbody = document.createElement('tbody');
        for(let i=1; i<=this.TRIMESTRES+1; i++) {
            let tr = document.createElement('tr');
            let isTotal = i === this.TRIMESTRES+1;
            let title = isTotal ? 'Total Anual' : `Trimestre ${i}`;
            let thClass = isTotal ? 'table-secondary border-secondary' : 'bg-light';
            
            tr.innerHTML = `<td class="text-end fw-bold align-middle text-nowrap ${thClass}">${title}</td>`;
            for(let j=1; j<=this.SUCURSALES; j++) {
                let cls = isTotal ? 'table-secondary fw-bold text-dark' : 'bg-white';
                tr.innerHTML += `<td id="s2-c${i}-${j}" class="${cls}">0</td>`;
            }
            tbody.appendChild(tr);
        }
        t.appendChild(tbody);
    },
    updateDOM(i, j) { document.getElementById(`s2-c${i}-${j}`).innerText = this.matriz[i][j]; },
    
    async step() {
        if(this.archivo.length === 0) return this.end();
        if(!this.isAnimating) setButtons(2, false, false, false, false, false);
        
        const reg = this.archivo.shift();
        const {trim, suc, ventas} = reg;
        
        writeCon('console-2', formatReg(reg));
        
        this.matriz[trim][suc] += ventas;
        let c1 = document.getElementById(`s2-c${trim}-${suc}`);
        c1.classList.add('active-cell'); this.updateDOM(trim, suc);
        writeCon('console-2', `↳ Celda: matriz[${trim}][${suc}] := matriz[${trim}][${suc}] + ${ventas}`, true);
        await sleep(600); c1.classList.remove('active-cell');
        
        this.matriz[this.TRIMESTRES+1][suc] += ventas;
        let c2 = document.getElementById(`s2-c${this.TRIMESTRES+1}-${suc}`);
        c2.classList.add('active-total-cell'); this.updateDOM(this.TRIMESTRES+1, suc);
        writeCon('console-2', `↳ Total Col: matriz[${this.TRIMESTRES+1}][${suc}] := matriz[${this.TRIMESTRES+1}][${suc}] + ${ventas}`, true);
        await sleep(600); c2.classList.remove('active-total-cell');
        
        if(this.archivo.length === 0) this.end();
        else if(!this.isAnimating) setButtons(2, false, true, true, false, false);
    },
    
    async play() {
        this.isAnimating = true; this.isPaused = false;
        setButtons(2, false, false, false, true, false);
        while(this.archivo.length > 0 && !this.isPaused) { await this.step(); }
        this.isAnimating = false;
        if(this.isPaused && this.archivo.length > 0) {
            setButtons(2, false, true, true, false, false);
            writeCon('console-2', '> [PAUSADO] Esperando instrucción...');
        }
    },
    
    pause() {
        this.isPaused = true;
        document.getElementById('btn-pause-2').disabled = true;
    },
    
    end() { writeCon('console-2', '> [EOF] Fin.'); setButtons(2, true, false, false, false, true); },
    results() {
        writeCon('console-2', '\n--- RESUMEN ---');
        for(let j=1; j<=this.SUCURSALES; j++) writeCon('console-2', `> ${this.nomSuc[j]}: ${this.matriz[this.TRIMESTRES+1][j]} ventas`);
        setButtons(2, true, false, false, false, false);
    }
};