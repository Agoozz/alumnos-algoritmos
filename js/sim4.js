const Sim4 = {GEN: 2, TALLES: 3, COLORES: 3,
    nomGen: ["", "Hombre", "Mujer"],
    nomTalles: ["", "Small", "Medium", "Large"],
    nomColors: ["", "Rojo", "Verde", "Azul"],
    archivo: [], matriz: [], isAnimating: false, isPaused: false,
    
    init() {
        this.archivo = Array.from({length: 40}, () => ({
            remito: "R-"+Math.floor(Math.random()*9000+1000),
            g: Math.floor(Math.random()*this.GEN + 1),
            t: Math.floor(Math.random()*this.TALLES + 1),
            c: Math.floor(Math.random()*this.COLORES + 1),
            cant: Math.floor(Math.random()*15 + 1)
        }));
        
        this.matriz = Array(this.GEN + 1).fill().map(() => 
            Array(this.TALLES + 2).fill().map(() => Array(this.COLORES + 2).fill(0))
        );
        
        this.render();
        document.getElementById('console-4').innerHTML = '';
        writeCon('console-4', `> INVENTARIO 3D. Cargadas ${this.archivo.length} cajas.`);
        
        this.isAnimating = false; this.isPaused = false;
        setButtons(4, false, true, true, false, false);
    },
    render() {
        for(let g=1; g<=this.GEN; g++) {
            const table = document.getElementById(`matrix-4-${g}`); table.innerHTML = '';
            
            let thead = '<tr class="table-light"><th class="border-0"></th>';
            for(let c=1; c<=this.COLORES; c++) { thead += `<th>${this.nomColors[c]}</th>`; }
            thead += `<th class="table-secondary border-secondary">Tot. Talle</th></tr>`;
            table.innerHTML += `<thead>${thead}</thead>`;
            
            let tbody = document.createElement('tbody');
            for(let t=1; t<=this.TALLES+1; t++) {
                let tr = document.createElement('tr');
                let thClass = (t <= this.TALLES) ? 'bg-light' : 'table-secondary border-secondary';
                tr.innerHTML = `<td class="text-end fw-bold align-middle text-nowrap ${thClass}">${t <= this.TALLES ? this.nomTalles[t] : 'Tot. Color'}</td>`;
                for(let c=1; c<=this.COLORES+1; c++) {
                    let cls = 'bg-white';
                    if(t === this.TALLES+1 && c === this.COLORES+1) cls = 'table-warning border-warning fw-bold text-dark';
                    else if(t === this.TALLES+1 || c === this.COLORES+1) cls = 'table-secondary fw-bold text-dark';
                    
                    tr.innerHTML += `<td id="s4-g${g}-t${t}-c${c}" class="${cls}">0</td>`;
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
        }
    },
    updateDOM(g, t, c) { document.getElementById(`s4-g${g}-t${t}-c${c}`).innerText = this.matriz[g][t][c]; },
    
    async step() {
        if(this.archivo.length === 0) return this.end();
        if(!this.isAnimating) setButtons(4, false, false, false, false, false);
        
        const reg_obj = this.archivo.shift();
        const {g, t, c, cant} = reg_obj;
        writeCon('console-4', formatReg(reg_obj));
        
        // 1. Celda principal
        this.matriz[g][t][c] += cant;
        let c1 = document.getElementById(`s4-g${g}-t${t}-c${c}`);
        c1.classList.add('active-cell'); this.updateDOM(g, t, c);
        writeCon('console-4', `↳ Celda: matriz[${t}][${c}][${g}] := matriz[${t}][${c}][${g}] + ${cant}`, true);
        await sleep(500); c1.classList.remove('active-cell');
        
        // 2. Col total
        this.matriz[g][t][this.COLORES+1] += cant;
        let c2 = document.getElementById(`s4-g${g}-t${t}-c${this.COLORES+1}`);
        c2.classList.add('active-total-cell'); this.updateDOM(g, t, this.COLORES+1);
        writeCon('console-4', `↳ Total Fila: matriz[${t}][${this.COLORES+1}][${g}] := matriz[${t}][${this.COLORES+1}][${g}] + ${cant}`, true);
        await sleep(500); c2.classList.remove('active-total-cell');
        
        // 3. Row total
        this.matriz[g][this.TALLES+1][c] += cant;
        let c3 = document.getElementById(`s4-g${g}-t${this.TALLES+1}-c${c}`);
        c3.classList.add('active-total-cell'); this.updateDOM(g, this.TALLES+1, c);
        writeCon('console-4', `↳ Total Col: matriz[${this.TALLES+1}][${c}][${g}] := matriz[${this.TALLES+1}][${c}][${g}] + ${cant}`, true);
        await sleep(500); c3.classList.remove('active-total-cell');
        
        // 4. Grand total
        this.matriz[g][this.TALLES+1][this.COLORES+1] += cant;
        let c4 = document.getElementById(`s4-g${g}-t${this.TALLES+1}-c${this.COLORES+1}`);
        c4.classList.add('active-total-cell'); this.updateDOM(g, this.TALLES+1, this.COLORES+1);
        writeCon('console-4', `↳ Gran Total: matriz[${this.TALLES+1}][${this.COLORES+1}][${g}] := matriz[${this.TALLES+1}][${this.COLORES+1}][${g}] + ${cant}`, true);
        await sleep(500); c4.classList.remove('active-total-cell');
        
        if(this.archivo.length === 0) this.end();
        else if(!this.isAnimating) setButtons(4, false, true, true, false, false);
    },
    
    async play() {
        this.isAnimating = true; this.isPaused = false;
        setButtons(4, false, false, false, true, false);
        while(this.archivo.length > 0 && !this.isPaused) { await this.step(); }
        this.isAnimating = false;
        if(this.isPaused && this.archivo.length > 0) {
            setButtons(4, false, true, true, false, false);
            writeCon('console-4', '> [PAUSADO] Esperando instrucción...');
        }
    },
    
    pause() {
        this.isPaused = true;
        document.getElementById('btn-pause-4').disabled = true;
    },
    
    end() { writeCon('console-4', '> [EOF] Fin.'); setButtons(4, true, false, false, false, true); },
    results() {
        writeCon('console-4', `\n--- PRENDAS TOTALES ---`);
        for(let g=1; g<=this.GEN; g++) {
            writeCon('console-4', `> ${this.nomGen[g]}: ${this.matriz[g][this.TALLES+1][this.COLORES+1]} unidades.`);
        }
        setButtons(4, true, false, false, false, false);
    }
};