const Sim1 = {
    DESTINOS: 7, MESES: 10,
    provs: ["", "Bs. Aires", "Córdoba", "Mendoza", "Salta", "Misiones", "Neuquén", "Río Negro"],
    archivo: [], matriz: [], isAnimating: false, isPaused: false,
    
    init() {
        this.archivo = Array.from({length: 40}, () => ({
            ticket: Math.floor(Math.random()*90000+10000),
            dni: Math.floor(Math.random()*80000000+10000000),
            mes: Math.floor(Math.random()*this.MESES + 1),
            dest: Math.floor(Math.random()*this.DESTINOS + 1),
            monto: Math.floor(Math.random()*400+10)*100
        }));
        
        this.matriz = Array(this.DESTINOS + 1).fill().map(() => Array(this.MESES + 2).fill(0));
        
        this.render();
        document.getElementById('console-1').innerHTML = '';
        writeCon('console-1', `> Archivo cargado (${this.archivo.length} registros).`);
        
        this.isAnimating = false;
        this.isPaused = false;
        setButtons(1, false, true, true, false, false);
    },
    render() {
        const t = document.getElementById('matrix-1'); t.innerHTML = '';
        let thead = '<tr class="table-light"><th class="border-0"></th>';
        for(let j=1; j<=this.MESES; j++) { thead += `<th>M${j}</th>`; }
        thead += `<th class="table-secondary border-secondary">Total</th></tr>`;
        t.innerHTML += `<thead>${thead}</thead>`;
        
        let tbody = document.createElement('tbody');
        for(let i=1; i<=this.DESTINOS; i++) {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td class="text-end fw-bold bg-light align-middle text-nowrap">${i}. ${this.provs[i]}</td>`;
            for(let j=1; j<=this.MESES+1; j++) {
                let cls = (j === this.MESES+1) ? 'table-secondary fw-bold text-dark' : 'bg-white';
                tr.innerHTML += `<td id="s1-c${i}-${j}" class="${cls}">$0</td>`;
            }
            tbody.appendChild(tr);
        }
        t.appendChild(tbody);
    },
    updateDOM(i, j) { document.getElementById(`s1-c${i}-${j}`).innerText = `$${this.matriz[i][j]}`; },
    
    async step() {
        if(this.archivo.length === 0) return this.end();
        if(!this.isAnimating) setButtons(1, false, false, false, false, false);
        
        const reg = this.archivo.shift();
        const {dest, mes, monto} = reg;
        
        writeCon('console-1', formatReg(reg));
        
        this.matriz[dest][mes] += monto;
        let c1 = document.getElementById(`s1-c${dest}-${mes}`);
        c1.classList.add('active-cell'); this.updateDOM(dest, mes);
        writeCon('console-1', `↳ Celda: matriz[${dest}][${mes}] := matriz[${dest}][${mes}] + ${monto}`, true);
        await sleep(600); c1.classList.remove('active-cell');
        
        this.matriz[dest][this.MESES+1] += monto;
        let c2 = document.getElementById(`s1-c${dest}-${this.MESES+1}`);
        c2.classList.add('active-total-cell'); this.updateDOM(dest, this.MESES+1);
        writeCon('console-1', `↳ Total Fila: matriz[${dest}][${this.MESES+1}] := matriz[${dest}][${this.MESES+1}] + ${monto}`, true);
        await sleep(600); c2.classList.remove('active-total-cell');
        
        if(this.archivo.length === 0) {
            this.end();
        } else if(!this.isAnimating) {
            setButtons(1, false, true, true, false, false);
        }
    },
    
    async play() {
        this.isAnimating = true; 
        this.isPaused = false;
        setButtons(1, false, false, false, true, false); 
        
        while(this.archivo.length > 0 && !this.isPaused) { 
            await this.step(); 
        }
        
        this.isAnimating = false;
        if(this.isPaused && this.archivo.length > 0) {
            setButtons(1, false, true, true, false, false);
            writeCon('console-1', '> [PAUSADO] Esperando instrucción...');
        }
    },
    
    pause() {
        this.isPaused = true;
        document.getElementById('btn-pause-1').disabled = true;
    },
    
    end() { writeCon('console-1', '> [EOF] Fin del archivo.'); setButtons(1, true, false, false, false, true); },
    results() {
        writeCon('console-1', '\n--- RESULTADOS ---');
        for(let i=1; i<=this.DESTINOS; i++) writeCon('console-1', `> ${this.provs[i]}: $${this.matriz[i][this.MESES+1]}`);
        setButtons(1, true, false, false, false, false);
    }
};