document.addEventListener('DOMContentLoaded', async () => {
    // Registra PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou:', err));
    }

    await initDB();
    
    const today = new Date().toISOString().split('T')[0];
    let availableFoods = [];

    // Variáveis Globais para o Histórico (Página 4)
    let historyChartInstance = null;
    let histMode = 'macros'; // 'macros' ou 'body'
    let histSubMode = 'kcal'; // kcal, prot, carb, fat | weight, bf, imc, muscle, massGorda, water
    let histRefDate = today;

    // Verifica se Inf_1 existe
    let userData = await getData('Inf_1', 1);
    if (!userData) {
        document.getElementById('page-first-use').classList.add('screen-active');
        document.getElementById('bottom-nav').style.display = 'none';
    } else {
        document.getElementById('page-first-use').classList.remove('screen-active');
        document.getElementById('page-home').classList.add('screen-active');
        loadHomePage();
    }

    // Navegação Inferior
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('screen-active'));
            const targetId = e.currentTarget.getAttribute('data-target');
            document.getElementById(targetId).classList.add('screen-active');
            
            if (targetId === 'page-goals') loadGoalsPage();
            if (targetId === 'page-profile') loadProfilePage();
            if (targetId === 'page-add') loadAddMealPage();
            if (targetId === 'page-history') loadHistoryPage();
        });
    });

    // Salvar Dados da Primeira Tela
    document.getElementById('btn-save-initial').addEventListener('click', async () => {
        const name = document.getElementById('init-name').value;
        const sex = document.getElementById('init-sex').value;
        const birth = document.getElementById('init-birth').value;
        const height = parseFloat(document.getElementById('init-height').value);
        const weight = parseFloat(document.getElementById('init-weight').value);
        const activity = parseFloat(document.getElementById('init-activity').value);

        if (!name || !sex || !birth || !height || !weight || !activity) return alert("Preencha tudo!");

        await saveData('Inf_1', { id: 1, name, sex, birth, height });
        
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        todayData.weight = weight;
        todayData.activityLevel = activity;
        await saveData('Inf_3', todayData);

        document.getElementById('page-first-use').classList.remove('screen-active');
        document.getElementById('bottom-nav').style.display = 'flex';
        document.getElementById('page-home').classList.add('screen-active');
        loadHomePage();
    });

    // Função auxiliar para calcular Idade
    function calcAge(birthDateString) {
        const birthDate = new Date(birthDateString);
        const todayDate = new Date();
        let age = todayDate.getFullYear() - birthDate.getFullYear();
        const m = todayDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) age--;
        return age;
    }

    // Carregar Home (Página 1)
    async function loadHomePage() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };

        document.getElementById('home-greeting').innerText = `Olá, ${userData.name}!`;

        let consumed = { kcal: 0, prot: 0, carb: 0, fat: 0 };
        if (todayData.meals) {
            todayData.meals.forEach(meal => {
                meal.foods.forEach(food => {
                    consumed.kcal += food.kcal;
                    consumed.prot += food.prot;
                    consumed.carb += food.carb;
                    consumed.fat += food.fat;
                });
            });
        }

        const targets = {
            kcal: todayData.target_kcal || 0,
            prot: todayData.target_prot || 0,
            carb: todayData.target_carb || 0,
            fat: todayData.target_fat || 0
        };

        const updateBar = (id, current, target, unit) => {
            const bar = document.getElementById(`bar-${id}`);
            const text = document.getElementById(`text-${id}-val`);
            text.innerText = `${Math.round(current)}/${Math.round(target)} ${unit}`;
            
            let percentage = target > 0 ? (current / target) * 100 : 0;
            if (percentage > 100) percentage = 100; 
            bar.style.width = `${percentage}%`;
        };

        updateBar('cal', consumed.kcal, targets.kcal, 'kcal');
        updateBar('prot', consumed.prot, targets.prot, 'g');
        updateBar('carb', consumed.carb, targets.carb, 'g');
        updateBar('fat', consumed.fat, targets.fat, 'g');

        const container = document.getElementById('home-meals-container');
        container.innerHTML = ''; 

        if (todayData.meals && todayData.meals.length > 0) {
            todayData.meals.forEach((meal, mealIndex) => {
                const mealBox = document.createElement('div');
                mealBox.className = 'meal-box';
                mealBox.style.marginBottom = '10px';
                
                let mealTotal = { kcal: 0, prot: 0, carb: 0, fat: 0 };
                meal.foods.forEach(f => {
                    mealTotal.kcal += f.kcal; 
                    mealTotal.prot += f.prot;
                    mealTotal.carb += f.carb; 
                    mealTotal.fat += f.fat;
                });

                mealBox.innerHTML = `
                    <div class="meal-header" style="display: flex; justify-content: space-between; padding: 12px; background: #fff; border: 1px solid #000; cursor: pointer;">
                        <span><strong>${meal.name}</strong></span>
                        <span>
                            ${meal.time}
                            <i class="fa-solid fa-pencil edit-meal-btn" style="margin-left: 15px; cursor: pointer;"></i>
                        </span>
                    </div>
                    <div class="meal-details" style="display: none; padding: 0; border: 1px solid #000; border-top: none;">
                        <table class="macro-table" style="width: 100%; border: none; font-size: 13px; margin: 0;">
                            <thead>
                                <tr style="background: #eee;">
                                    <th>ALIMENTO</th><th>QTDE</th><th>CAL</th><th>PROT</th><th>CARB</th><th>GORD</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${meal.foods.map((food, foodIndex) => `
                                    <tr>
                                        <td>${food.name}</td>
                                        <td class="editable-qty" data-meal="${mealIndex}" data-food="${foodIndex}" style="cursor:pointer; color: #0066cc; text-decoration: underline; font-weight: bold;">${Math.round(food.amount)}</td>
                                        <td>${Math.round(food.kcal)}</td>
                                        <td>${Math.round(food.prot)}</td>
                                        <td>${Math.round(food.carb)}</td>
                                        <td>${Math.round(food.fat)}</td>
                                    </tr>
                                `).join('')}
                                <tr style="font-weight: bold; background: #f5f5f5;">
                                    <td colspan="2" style="text-align: right; padding-right: 10px;">TOTAL</td>
                                    <td>${Math.round(mealTotal.kcal)}</td>
                                    <td>${Math.round(mealTotal.prot)}</td>
                                    <td>${Math.round(mealTotal.carb)}</td>
                                    <td>${Math.round(mealTotal.fat)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                container.appendChild(mealBox);

                const header = mealBox.querySelector('.meal-header');
                const details = mealBox.querySelector('.meal-details');
                header.addEventListener('click', (e) => {
                    if (e.target.classList.contains('fa-pencil')) return;
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                });
            });
        } else {
            container.innerHTML = '<p style="text-align:center; color: #777; margin-top: 20px;">Nenhuma refeição registrada hoje.</p>';
        }

        document.querySelectorAll('.editable-qty').forEach(cell => {
            cell.addEventListener('click', async (e) => {
                const mealIdx = e.target.getAttribute('data-meal');
                const foodIdx = e.target.getAttribute('data-food');
                
                let currentFood = todayData.meals[mealIdx].foods[foodIdx];
                
                let newAmount = prompt(`Editar quantidade (g/ml) de ${currentFood.name}:`, Math.round(currentFood.amount));
                
                if (newAmount !== null && !isNaN(newAmount) && newAmount > 0) {
                    newAmount = parseFloat(newAmount);
                    
                    const ratio = newAmount / currentFood.amount;
                    
                    currentFood.amount = newAmount;
                    currentFood.kcal *= ratio;
                    currentFood.prot *= ratio;
                    currentFood.carb *= ratio;
                    currentFood.fat *= ratio;

                    await saveData('Inf_3', todayData);
                    loadHomePage(); 
                }
            });
        });
    }

    // Lógica da Página de Objetivos
    document.getElementById('btn-goals-yes').addEventListener('click', () => {
        document.getElementById('goals-question').style.display = 'none';
        document.getElementById('goals-manual').style.display = 'block';
        calculateTDEE();
    });
    
    document.getElementById('btn-goals-no').addEventListener('click', () => {
        document.getElementById('goals-question').style.display = 'none';
        document.getElementById('goals-calculator').style.display = 'block';
        calculateTDEE();
    });

    async function calculateTDEE() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today);
        let weight = todayData?.weight || 70; 
        let fa = todayData?.activityLevel || 1.2;
        let age = calcAge(userData.birth);
        
        let gcd = 0;
        if (userData.sex === 'M') {
            gcd = (66.7 + (13.75 * weight) + (5 * userData.height) - (6.8 * age)) * fa;
        } else {
            gcd = (655.1 + (9.56 * weight) + (1.85 * userData.height) - (4.68 * age)) * fa;
        }
        
        todayData = todayData || { date: today, meals: [] };
        todayData.tdee = Math.round(gcd);
        await saveData('Inf_3', todayData);
        
        document.getElementById('display-tdee').innerText = todayData.tdee;
    }

    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const goal = e.currentTarget.getAttribute('data-goal');
            let todayData = await getData('Inf_3', today);
            let w = todayData.weight;
            let gcd = todayData.tdee;
            
            let kcal=0, prot=0, fat=0, carb=0;
            
            if (goal === 'bulking') {
                kcal = 1.2 * gcd; prot = 2 * w; fat = 1 * w;
            } else if (goal === 'cutting') {
                kcal = 0.8 * gcd; prot = 2.5 * w; fat = 1 * w;
            } else if (goal === 'maintenance') {
                kcal = 1.0 * gcd; prot = 2 * w; fat = 1 * w;
            }
            carb = (kcal - (prot * 4) - (fat * 9)) / 4;
            
            document.getElementById('goal-kcal').value = Math.round(kcal);
            document.getElementById('goal-prot').value = Math.round(prot);
            document.getElementById('goal-fat').value = Math.round(fat);
            document.getElementById('goal-carb').value = Math.round(carb);
            
            document.getElementById('goals-calculator').style.display = 'none';
            document.getElementById('goals-manual').style.display = 'block';
            updateKgRatios(w);
        });
    });

    function updateKgRatios(weight) {
        document.getElementById('goal-prot-kg').innerText = (document.getElementById('goal-prot').value / weight).toFixed(1) + ' g/kg';
        document.getElementById('goal-fat-kg').innerText = (document.getElementById('goal-fat').value / weight).toFixed(1) + ' g/kg';
        document.getElementById('goal-carb-kg').innerText = (document.getElementById('goal-carb').value / weight).toFixed(1) + ' g/kg';
    }

    document.getElementById('save-goals-btn').addEventListener('click', async () => {
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        todayData.target_kcal = parseFloat(document.getElementById('goal-kcal').value);
        todayData.target_prot = parseFloat(document.getElementById('goal-prot').value);
        todayData.target_fat = parseFloat(document.getElementById('goal-fat').value);
        todayData.target_carb = parseFloat(document.getElementById('goal-carb').value);
        
        await saveData('Inf_3', todayData);
        alert('Metas salvas para hoje!');
        loadHomePage(); 
    });

    // Lógica da Página 3 (Adicionar Refeição)
    async function loadAddMealPage() {
        const inf2 = await getAllData('Inf_2') || [];
        const mealNames = inf2.filter(item => item.type === 'mealName');
        availableFoods = inf2.filter(item => item.type === 'food' || item.type === 'plate');

        const nameSelect = document.getElementById('add-meal-name');
        nameSelect.innerHTML = '';
        if (mealNames.length > 0) {
            mealNames.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.name;
                opt.innerText = m.name;
                nameSelect.appendChild(opt);
            });
        } else {
            ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'].forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.innerText = name;
                nameSelect.appendChild(opt);
            });
        }

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('add-meal-time').value = `${hh}:${mm}`;

        let datalist = document.getElementById('food-options');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'food-options';
            document.body.appendChild(datalist);
        }
        datalist.innerHTML = '';
        
        if (availableFoods.length === 0) {
            const mockFoods = [
                { type: 'food', name: 'Arroz Branco', amount: 100, prot: 2.5, carb: 28, fat: 0.2, kcal: 130 },
                { type: 'food', name: 'Feijão Carioca', amount: 100, prot: 4.8, carb: 13.6, fat: 0.5, kcal: 76 },
                { type: 'food', name: 'Frango Grelhado', amount: 100, prot: 32, carb: 0, fat: 2.5, kcal: 159 },
                { type: 'food', name: 'Ovo Cozido', amount: 50, prot: 6.5, carb: 0.5, fat: 5, kcal: 75 }
            ];
            for (let f of mockFoods) await saveData('Inf_2', f);
            availableFoods = mockFoods;
        }

        availableFoods.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.name;
            datalist.appendChild(opt);
        });

        const tbody = document.getElementById('add-meal-tbody');
        tbody.innerHTML = '';
        addMealRow();
    }

    function addMealRow() {
        const tbody = document.getElementById('add-meal-tbody');
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><input type="text" list="food-options" class="row-food-name" style="width:100%; box-sizing:border-box;"></td>
            <td><input type="number" class="row-food-qty" style="width:50px;" min="1"></td>
            <td class="row-prot">0</td>
            <td class="row-carb">0</td>
            <td class="row-fat">0</td>
            <td class="row-kcal">0</td>
        `;

        const nameInput = tr.querySelector('.row-food-name');
        const qtyInput = tr.querySelector('.row-food-qty');
        
        tr.dataset.baseAmount = 0;
        tr.dataset.baseProt = 0;
        tr.dataset.baseCarb = 0;
        tr.dataset.baseFat = 0;
        tr.dataset.baseKcal = 0;

        nameInput.addEventListener('input', (e) => {
            const selectedName = e.target.value;
            const food = availableFoods.find(f => f.name.toLowerCase() === selectedName.toLowerCase());
            
            if (food) {
                qtyInput.value = Math.round(food.amount);
                tr.dataset.baseAmount = food.amount;
                tr.dataset.baseProt = food.prot;
                tr.dataset.baseCarb = food.carb;
                tr.dataset.baseFat = food.fat;
                tr.dataset.baseKcal = food.kcal;
                
                updateRowVisuals(tr, 1);
            }
        });

        qtyInput.addEventListener('input', (e) => {
            const baseAmount = parseFloat(tr.dataset.baseAmount);
            const newAmount = parseFloat(e.target.value);
            
            if (baseAmount > 0 && !isNaN(newAmount) && newAmount > 0) {
                const ratio = newAmount / baseAmount;
                updateRowVisuals(tr, ratio);
            } else {
                updateRowVisuals(tr, 0);
            }
        });

        tbody.appendChild(tr);
    }

    function updateRowVisuals(tr, ratio) {
        tr.querySelector('.row-prot').innerText = Math.round(parseFloat(tr.dataset.baseProt) * ratio);
        tr.querySelector('.row-carb').innerText = Math.round(parseFloat(tr.dataset.baseCarb) * ratio);
        tr.querySelector('.row-fat').innerText = Math.round(parseFloat(tr.dataset.baseFat) * ratio);
        tr.querySelector('.row-kcal').innerText = Math.round(parseFloat(tr.dataset.baseKcal) * ratio);
    }

    document.getElementById('add-row-btn').addEventListener('click', () => { addMealRow(); });

    document.getElementById('save-meal-btn').addEventListener('click', async () => {
        const mealName = document.getElementById('add-meal-name').value;
        const mealTime = document.getElementById('add-meal-time').value;
        const tbody = document.getElementById('add-meal-tbody');
        const rows = tbody.querySelectorAll('tr');
        
        let foodsToSave = [];
        let hasError = false;

        rows.forEach(tr => {
            const name = tr.querySelector('.row-food-name').value;
            const qty = parseFloat(tr.querySelector('.row-food-qty').value);
            
            if (name && name.trim() !== '') {
                if (isNaN(qty) || qty <= 0) {
                    hasError = true;
                } else {
                    foodsToSave.push({
                        name: name.trim(),
                        amount: qty,
                        prot: parseFloat(tr.querySelector('.row-prot').innerText),
                        carb: parseFloat(tr.querySelector('.row-carb').innerText),
                        fat: parseFloat(tr.querySelector('.row-fat').innerText),
                        kcal: parseFloat(tr.querySelector('.row-kcal').innerText)
                    });
                }
            }
        });

        if (hasError) return alert('Insira quantidades válidas maiores que zero.');
        if (foodsToSave.length === 0) return alert('Adicione pelo menos um alimento na refeição.');

        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        if (!todayData.meals) todayData.meals = [];

        todayData.meals.push({ name: mealName, time: mealTime || new Date().toTimeString().slice(0, 5), foods: foodsToSave });
        await saveData('Inf_3', todayData);
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-target="page-home"]').classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('screen-active'));
        document.getElementById('page-home').classList.add('screen-active');
        
        loadHomePage();
    });

    // =========================================================
    // LÓGICA DA PÁGINA 4 (HISTÓRICO E GRÁFICOS)
    // =========================================================
    
    // Controles dos ícones do topo
    document.querySelector('.hist-btn[data-type="macros"]').addEventListener('click', (e) => {
        histMode = 'macros';
        histSubMode = 'kcal'; // Padrão ao mudar para alvo
        loadHistoryPage();
    });

    document.querySelector('.hist-btn[data-type="body"]').addEventListener('click', (e) => {
        histMode = 'body';
        histSubMode = 'weight'; // Padrão ao mudar para balança
        loadHistoryPage();
    });

    // Lógica do Calendário Nativo Pop-up
    document.querySelector('.fa-calendar').parentElement.addEventListener('click', () => {
        let dInput = document.createElement('input');
        dInput.type = 'date';
        dInput.style.position = 'absolute';
        dInput.style.opacity = 0;
        document.body.appendChild(dInput);
        
        dInput.addEventListener('change', (e) => {
            if(e.target.value) {
                histRefDate = e.target.value;
                loadHistoryPage();
            }
            document.body.removeChild(dInput);
        });
        // Aciona a abertura do calendário do dispositivo
        dInput.showPicker ? dInput.showPicker() : dInput.click();
    });

    async function loadHistoryPage() {
        document.getElementById('history-year').innerText = histRefDate.split('-')[0];

        // Buscar dados do Inf_3
        let allData = await getAllData('Inf_3') || [];
        
        // Configurar a janela de 10 dias
        let endDateObj = new Date(histRefDate + 'T12:00:00'); 
        let startDateObj = new Date(endDateObj);
        startDateObj.setDate(startDateObj.getDate() - 9);

        let labels = [];
        let chartData = [];
        let targetData = [];
        let pointColors = [];

        for (let i = 0; i <= 9; i++) {
            let d = new Date(startDateObj);
            d.setDate(d.getDate() + i);
            let dStr = d.toISOString().split('T')[0];
            labels.push(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`);

            let dayData = allData.find(x => x.date === dStr);
            let val = null;
            let target = null;

            if (dayData) {
                if (histMode === 'macros') {
                    let consumed = {kcal:0, prot:0, carb:0, fat:0};
                    if (dayData.meals) {
                        dayData.meals.forEach(m => m.foods.forEach(f => {
                            consumed.kcal += f.kcal; consumed.prot += f.prot;
                            consumed.carb += f.carb; consumed.fat += f.fat;
                        }));
                    }

                    if (histSubMode === 'kcal') { val = consumed.kcal; target = dayData.target_kcal || 0; }
                    else if (histSubMode === 'prot') { val = consumed.prot; target = dayData.target_prot || 0; }
                    else if (histSubMode === 'carb') { val = consumed.carb; target = dayData.target_carb || 0; }
                    else if (histSubMode === 'fat') { val = consumed.fat; target = dayData.target_fat || 0; }

                    chartData.push(val);
                    targetData.push(target);

                    // Lógica de Cor: Verde se estiver até 10% da meta, senão Vermelho
                    if (target > 0) {
                        let diff = Math.abs(val - target) / target;
                        pointColors.push(diff <= 0.1 ? '#4caf50' : '#f44336'); 
                    } else {
                        pointColors.push('#555');
                    }
                } else {
                    if (histSubMode === 'weight') val = dayData.weight || null;
                    else if (histSubMode === 'bf') val = dayData.bf || null;
                    else if (histSubMode === 'imc') val = dayData.imc || null;
                    else if (histSubMode === 'muscle') val = dayData.muscle || null;
                    else if (histSubMode === 'massGorda') val = dayData.massGorda || null;
                    else if (histSubMode === 'water') val = dayData.water || null;

                    chartData.push(val);
                    targetData.push(null);
                    pointColors.push('#000');
                }
            } else {
                chartData.push(null);
                targetData.push(null);
                pointColors.push('#555');
            }
        }

        const ctx = document.getElementById('historyChart').getContext('2d');
        if (historyChartInstance) historyChartInstance.destroy();

        let datasets = [{
            label: histSubMode.toUpperCase(),
            data: chartData,
            backgroundColor: pointColors,
            borderColor: '#000',
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: false,
            type: 'line',
            spanGaps: true // Pula dias sem registro conectando a linha
        }];

        // Adiciona a linha de Meta tracejada se estiver no modo macros
        if (histMode === 'macros') {
            datasets.push({
                label: 'Meta',
                data: targetData,
                borderColor: '#4da6ff',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                type: 'line',
                borderDash: [5, 5]
            });
        }

        historyChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: false } },
                plugins: { legend: { display: false } },
                onClick: (e, elements) => {
                    // Ao clicar em uma bolinha, atualiza os dados mostrados no quadro inferior
                    if (elements.length > 0) {
                        let idx = elements[0].index;
                        let d = new Date(startDateObj);
                        d.setDate(d.getDate() + idx);
                        let clickedDate = d.toISOString().split('T')[0];
                        updateHistoryGrid(clickedDate, allData);
                    }
                }
            }
        });

        // Inicializa o quadro inferior com a data de referência selecionada
        updateHistoryGrid(histRefDate, allData);
    }

    // Função que monta a tabela inferior dinamicamente e habilita os cliques nas opções
    function updateHistoryGrid(dateStr, allData) {
        let container = document.getElementById('history-data-macros');
        let dayData = allData.find(x => x.date === dateStr) || {};
        
        if(histMode === 'macros') {
            let consumed = {kcal:0, prot:0, carb:0, fat:0};
            if(dayData.meals) {
                dayData.meals.forEach(m => m.foods.forEach(f => {
                    consumed.kcal += f.kcal; consumed.prot += f.prot;
                    consumed.carb += f.carb; consumed.fat += f.fat;
                }));
            }
            
            // Textos destacados ganham fundo cinza e negrito dependendo do 'histSubMode'
            container.innerHTML = `
                <div class="col-left">
                    <p>Meta na época: ${Math.round(dayData.target_kcal||0)} Kcal</p>
                    <p>GCD: ${dayData.tdee||0} Kcal</p>
                    <p class="clickable-hist" data-sub="kcal" style="${histSubMode==='kcal'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Calorias: ${Math.round(consumed.kcal)}</p>
                </div>
                <div class="col-center">
                    <p class="clickable-hist" data-sub="prot" style="${histSubMode==='prot'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Proteínas: ${Math.round(consumed.prot)}g</p>
                    <p class="clickable-hist" data-sub="carb" style="${histSubMode==='carb'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Carboidratos: ${Math.round(consumed.carb)}g</p>
                    <p class="clickable-hist" data-sub="fat" style="${histSubMode==='fat'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Gorduras: ${Math.round(consumed.fat)}g</p>
                </div>
                <div class="col-right">
                    <p>Meta prot.: ${Math.round(dayData.target_prot||0)}g</p>
                    <p>Meta carb.: ${Math.round(dayData.target_carb||0)}g</p>
                    <p>Meta gord.: ${Math.round(dayData.target_fat||0)}g</p>
                    <button class="small-btn" style="margin-top:5px; width:100%;">Alimentos</button>
                </div>
            `;
        } else {
             container.innerHTML = `
                <div class="col-left">
                    <p class="clickable-hist" data-sub="weight" style="${histSubMode==='weight'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Peso: ${dayData.weight||0} Kgs</p>
                    <p class="clickable-hist" data-sub="bf" style="${histSubMode==='bf'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Gordura corporal: ${dayData.bf||0}%</p>
                    <p class="clickable-hist" data-sub="imc" style="${histSubMode==='imc'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">IMC: ${dayData.imc||0}</p>
                </div>
                <div class="col-center"></div>
                <div class="col-right">
                    <p class="clickable-hist" data-sub="muscle" style="${histSubMode==='muscle'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Músculo Esquelét.: ${dayData.muscle||0} Kgs</p>
                    <p class="clickable-hist" data-sub="massGorda" style="${histSubMode==='massGorda'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Massa gorda: ${dayData.massGorda||0} Kgs</p>
                    <p class="clickable-hist" data-sub="water" style="${histSubMode==='water'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer; padding:2px;">Água corporal: ${dayData.water||0} Kgs</p>
                </div>
            `;
        }
        
        // Escutador de eventos para quando você clica em "Proteínas", "Peso", etc.
        container.querySelectorAll('.clickable-hist').forEach(el => {
            el.addEventListener('click', (e) => {
                histSubMode = e.currentTarget.getAttribute('data-sub');
                loadHistoryPage(); // Recarrega o gráfico com a nova grandeza Y
            });
        });
    }

    // Carregar Perfil (Dados)
    async function loadProfilePage() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today);
        
        document.getElementById('profile-date').innerText = new Date().toLocaleDateString('pt-BR');
        document.getElementById('prof-name').innerText = userData.name;
        document.getElementById('prof-sex').innerText = userData.sex === 'M' ? 'Masculino' : 'Feminino';
        document.getElementById('prof-age').innerText = calcAge(userData.birth);
        document.getElementById('prof-height').innerText = userData.height;
        
        if (todayData) {
            document.getElementById('prof-weight').innerText = todayData.weight || 'N/A';
            document.getElementById('prof-activity').innerText = todayData.activityLevel || 'N/A';
        }
    }
});
