document.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou:', err));
    }

    await initDB();
    
    // =========================================================
    // INJEÇÃO AUTOMÁTICA DE ALIMENTOS (Sua Planilha .xlsx)
    // =========================================================
    let inf2Check = await getAllData('Inf_2');
    if (!inf2Check || inf2Check.length === 0) {
        const PRELOAD_DATA = [
  { "type": "food", "name": "PEITO DE FRANGO", "amount": 100.0, "prot": 20.0, "fat": 8.0, "carb": 0.0, "kcal": 160.0 },
  { "type": "food", "name": "CARNE DE BOI COZIDA", "amount": 100.0, "prot": 28.0, "fat": 11.0, "carb": 0.0, "kcal": 207.0 },
  { "type": "food", "name": "PEITO DE PORCO ASSADA", "amount": 100.0, "prot": 24.0, "fat": 33.0, "carb": 0.0, "kcal": 393.0 },
  { "type": "food", "name": "BATA DOCE", "amount": 100.0, "prot": 0.6, "fat": 0.1, "carb": 20.0, "kcal": 77.0 },
  { "type": "food", "name": "INHAME", "amount": 80.0, "prot": 0.6, "fat": 0.1, "carb": 20.0, "kcal": 77.0 },
  { "type": "food", "name": "QUEIJO MINAS", "amount": 30.0, "prot": 6.0, "fat": 6.0, "carb": 0.0, "kcal": 80.0 },
  { "type": "food", "name": "QUEIJO MUSSARELA", "amount": 40.0, "prot": 4.0, "fat": 4.0, "carb": 0.0, "kcal": 60.0 },
  { "type": "food", "name": "ARROZ BRANCO CRU", "amount": 50.0, "prot": 3.7, "fat": 0.5, "carb": 40.0, "kcal": 177.0 },
  { "type": "food", "name": "ARROZ BRANCO COZIDO", "amount": 300.0, "prot": 6.0, "fat": 0.0, "carb": 84.0, "kcal": 360.0 },
  { "type": "food", "name": "FEIJÃO CARIOCA", "amount": 40.0, "prot": 9.0, "fat": 0.0, "carb": 24.0, "kcal": 135.0 },
  { "type": "food", "name": "FEIJÃO PRETO", "amount": 60.0, "prot": 12.0, "fat": 1.3, "carb": 20.0, "kcal": 136.0 },
  { "type": "food", "name": "FEIJÃO COZIDO", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 22.0, "kcal": 0.0 },
  { "type": "food", "name": "BISTECA DE PORCO", "amount": 100.0, "prot": 30.0, "fat": 17.0, "carb": 0.0, "kcal": 280.0 },
  { "type": "food", "name": "CARNE DE HAMBURGUER", "amount": 180.0, "prot": 31.0, "fat": 40.0, "carb": 0.0, "kcal": 482.0 },
  { "type": "food", "name": "CARNE DE SOL COM CEBOLA", "amount": 100.0, "prot": 19.0, "fat": 18.0, "carb": 2.8, "kcal": 240.0 },
  { "type": "food", "name": "COXAS DE FRANGO", "amount": 100.0, "prot": 16.0, "fat": 7.2, "carb": 1.3, "kcal": 134.0 },
  { "type": "food", "name": "OVO", "amount": 1.0, "prot": 6.0, "fat": 5.0, "carb": 1.0, "kcal": 80.0 },
  { "type": "food", "name": "AZEITE", "amount": 13.0, "prot": 0.0, "fat": 12.0, "carb": 0.0, "kcal": 108.0 },
  { "type": "food", "name": "LEITE INTEGRAL", "amount": 200.0, "prot": 6.0, "fat": 6.0, "carb": 10.0, "kcal": 118.0 },
  { "type": "food", "name": "BANANA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 25.0, "kcal": 100.0 },
  { "type": "food", "name": "WHEY HIPERCALÓRICO", "amount": 120.0, "prot": 80.0, "fat": 2.5, "carb": 30.0, "kcal": 462.5 },
  { "type": "food", "name": "(TOP) HIPERCALÓRICO", "amount": 45.0, "prot": 12.0, "fat": 1.25, "carb": 28.5, "kcal": 173.5 },
  { "type": "food", "name": "WHEY 80%", "amount": 30.0, "prot": 23.0, "fat": 2.0, "carb": 3.4, "kcal": 124.0 },
  { "type": "food", "name": "TAPIOCA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 85.0, "kcal": 340.0 },
  { "type": "food", "name": "MACARRÃO CRU", "amount": 80.0, "prot": 9.8, "fat": 1.0, "carb": 57.0, "kcal": 276.0 },
  { "type": "food", "name": "MACARRÃO COZIDO", "amount": 100.0, "prot": 4.9, "fat": 0.5, "carb": 28.5, "kcal": 0.0 },
  { "type": "food", "name": "BRÓCOLIS", "amount": 100.0, "prot": 3.0, "fat": 0.0, "carb": 5.0, "kcal": 20.0 },
  { "type": "food", "name": "MAÇÃ", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 15.0, "kcal": 60.0 },
  { "type": "food", "name": "UVA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 13.0, "kcal": 52.0 },
  { "type": "food", "name": "PERA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 13.0, "kcal": 52.0 },
  { "type": "food", "name": "KIWI", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 13.0, "kcal": 52.0 },
  { "type": "food", "name": "MAMÃO", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 11.0, "kcal": 44.0 },
  { "type": "food", "name": "TANGERINA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 12.0, "kcal": 48.0 },
  { "type": "food", "name": "MELANCIA", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 8.0, "kcal": 32.0 },
  { "type": "food", "name": "MORANGO", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 8.0, "kcal": 32.0 },
  { "type": "food", "name": "MELÃO", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 7.0, "kcal": 28.0 },
  { "type": "food", "name": "LIMÃO", "amount": 100.0, "prot": 0.0, "fat": 0.0, "carb": 4.0, "kcal": 16.0 },
  { "type": "food", "name": "LEITE EM PÓ DESNATADO", "amount": 20.0, "prot": 7.0, "fat": 0.0, "carb": 10.0, "kcal": 68.0 },
  { "type": "food", "name": "LEITE EM PÓ INTEGRAL", "amount": 25.0, "prot": 6.4, "fat": 6.7, "carb": 9.4, "kcal": 124.0 },
  { "type": "food", "name": "AVEIA", "amount": 100.0, "prot": 14.0, "fat": 6.0, "carb": 67.0, "kcal": 374.0 },
  { "type": "food", "name": "CENOURA", "amount": 100.0, "prot": 1.0, "fat": 0.0, "carb": 11.0, "kcal": 45.0 },
  { "type": "food", "name": "IOGURTE NATURAL", "amount": 170.0, "prot": 6.8, "fat": 7.0, "carb": 6.8, "kcal": 117.0 },
  { "type": "food", "name": "PÃO TORTILHA RAP10", "amount": 33.0, "prot": 2.72, "fat": 2.31, "carb": 14.85, "kcal": 90.75 },
  { "type": "food", "name": "PÃO INTEGRAL", "amount": 50.0, "prot": 4.6, "fat": 1.8, "carb": 22.0, "kcal": 123.0 },
  { "type": "food", "name": "PÃO DE FORMA", "amount": 50.0, "prot": 4.5, "fat": 2.2, "carb": 25.0, "kcal": 138.0 },
  { "type": "food", "name": "PÃO DE HAMBURGUER", "amount": 50.0, "prot": 3.5, "fat": 1.0, "carb": 27.0, "kcal": 131.0 },
  { "type": "food", "name": "REQUEIJÃO LIGHT", "amount": 100.0, "prot": 11.0, "fat": 16.0, "carb": 1.8, "kcal": 193.0 },
  { "type": "food", "name": "CREAM CHEESE", "amount": 30.0, "prot": 1.6, "fat": 8.0, "carb": 1.3, "kcal": 84.0 },
  { "type": "food", "name": "MAIONESE", "amount": 12.0, "prot": 0.1, "fat": 3.7, "carb": 0.8, "kcal": 37.0 },
  { "type": "food", "name": "KETCHUP", "amount": 12.0, "prot": 0.1, "fat": 0.0, "carb": 2.9, "kcal": 13.0 },
  { "type": "food", "name": "PASTA DE AMENDOIM", "amount": 20.0, "prot": 4.1, "fat": 9.1, "carb": 5.1, "kcal": 117.0 },
  { "type": "plate", "name": "TAPIOCA COM QUEIJO E CARNE (GRANDE)", "amount": 205, "prot": 18, "fat": 9.5, "carb": 97.75, "kcal": 554.5, "foods": [
      { "name": "TAPIOCA", "amount": 115, "prot": 0, "fat": 0, "carb": 97.75, "kcal": 391 },
      { "name": "CARNE DE BOI COZIDA", "amount": 50, "prot": 14, "fat": 5.5, "carb": 0, "kcal": 103.5 },
      { "name": "QUEIJO MUSSARELA", "amount": 40, "prot": 4, "fat": 4, "carb": 0, "kcal": 60 }
    ]
  },
  { "type": "plate", "name": "PREPARADO DE PASTA DE FRANGO COM REQUEIJÃO E CENOURA", "amount": 700, "prot": 84, "fat": 56, "carb": 25.2, "kcal": 476, "foods": [
      { "name": "PEITO DE FRANGO", "amount": 300, "prot": 60, "fat": 24, "carb": 0, "kcal": 0 },
      { "name": "REQUEIJÃO LIGHT", "amount": 200, "prot": 22, "fat": 32, "carb": 3.2, "kcal": 386 },
      { "name": "CENOURA", "amount": 200, "prot": 2, "fat": 0, "carb": 22, "kcal": 90 }
    ]
  },
  { "type": "plate", "name": "SANDUÍCHE NATURAL COM PASTA DE FRANGO, REQUEIJÃO E CENOURA", "amount": 110, "prot": 11.7, "fat": 7, "carb": 27.16, "kcal": 178.8, "foods": [
      { "name": "PREPARADO DE PASTA DE FRANGO COM REQUEIJÃO E CENOURA", "amount": 60, "prot": 7.2, "fat": 4.8, "carb": 2.16, "kcal": 40.8 },
      { "name": "PÃO DE FORMA", "amount": 50, "prot": 4.5, "fat": 2.2, "carb": 25, "kcal": 138 }
    ]
  },
  { "type": "plate", "name": "HAMBÚRGUER CASEIRO", "amount": 290, "prot": 40.7, "fat": 48.2, "carb": 27.36, "kcal": 651.6, "foods": [
      { "name": "PÃO DE HAMBURGUER", "amount": 50, "prot": 3.5, "fat": 1, "carb": 27, "kcal": 131 },
      { "name": "CARNE DE HAMBURGUER", "amount": 180, "prot": 31, "fat": 40, "carb": 0, "kcal": 482 },
      { "name": "QUEIJO MUSSARELA", "amount": 40, "prot": 4, "fat": 4, "carb": 0, "kcal": 60 },
      { "name": "REQUEIJÃO LIGHT", "amount": 20, "prot": 2.2, "fat": 3.2, "carb": 0.36, "kcal": 38.6 }
    ]
  },
  { "type": "plate", "name": "OVOS FRITOS COM AZEITE", "amount": 2, "prot": 12, "fat": 22, "carb": 2, "kcal": 268, "foods": [
      { "name": "OVO", "amount": 2, "prot": 12, "fat": 10, "carb": 2, "kcal": 160 },
      { "name": "AZEITE", "amount": 13, "prot": 0, "fat": 12, "carb": 0, "kcal": 108 }
    ]
  }
        ];
        
        for (let item of PRELOAD_DATA) {
            await saveData('Inf_2', item);
        }
    }

    const today = new Date().toISOString().split('T')[0];
    let availableFoods = [];
    let historyChartInstance = null;
    let histMode = 'macros';
    let histSubMode = 'kcal';
    let histRefDate = today;
    let notifiedMeals = { date: today };

    let currentWeight = 70;
    let currentGCD = 2000;

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    setInterval(async () => {
        const now = new Date();
        const currentStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const todayStr = now.toISOString().split('T')[0];

        if(notifiedMeals.date !== todayStr) notifiedMeals = { date: todayStr };

        let allInf2 = await getAllData('Inf_2') || [];
        const mealConfigs = allInf2.filter(d => d.type === 'mealName');
        
        mealConfigs.forEach(meal => {
            if(meal.time && meal.reminder > 0) {
                let mealTimeDate = new Date();
                let [h, m] = meal.time.split(':');
                mealTimeDate.setHours(parseInt(h), parseInt(m), 0, 0);
                mealTimeDate.setMinutes(mealTimeDate.getMinutes() - meal.reminder);
                
                let remStr = `${String(mealTimeDate.getHours()).padStart(2, '0')}:${String(mealTimeDate.getMinutes()).padStart(2, '0')}`;
                
                if(currentStr === remStr && !notifiedMeals[meal.name]) {
                    if (Notification.permission === 'granted') {
                        new Notification("DietApp - Lembrete", {
                            body: `Sua refeição "${meal.name}" está programada para as ${meal.time}.`,
                        });
                        notifiedMeals[meal.name] = true;
                    }
                }
            }
        });
    }, 60000);

    let userData = await getData('Inf_1', 1);
    if (!userData) {
        document.getElementById('page-first-use').classList.add('screen-active');
        document.getElementById('bottom-nav').style.display = 'none';
    } else {
        document.getElementById('page-first-use').classList.remove('screen-active');
        document.getElementById('page-home').classList.add('screen-active');
        loadHomePage();
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('screen-active'));
            const targetId = e.currentTarget.getAttribute('data-target');
            document.getElementById(targetId).classList.add('screen-active');
            
            if (targetId === 'page-home') loadHomePage();
            if (targetId === 'page-goals') loadGoalsPage();
            if (targetId === 'page-add') loadAddMealPage();
            if (targetId === 'page-history') loadHistoryPage();
            if (targetId === 'page-food') loadFoodPage();
            if (targetId === 'page-profile') loadProfilePage();
        });
    });

    document.getElementById('btn-save-initial').addEventListener('click', async () => {
        const name = document.getElementById('init-name').value;
        const sex = document.getElementById('init-sex').value;
        const birth = document.getElementById('init-birth').value;
        const height = parseFloat(document.getElementById('init-height').value);
        const weight = parseFloat(document.getElementById('init-weight').value);
        const activity = parseFloat(document.getElementById('init-activity').value);

        if (!name || !sex || !birth || !height || !weight || !activity) return alert("Preencha todos os campos.");

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

    function calcAge(birthDateString) {
        const birthDate = new Date(birthDateString);
        const todayDate = new Date();
        let age = todayDate.getFullYear() - birthDate.getFullYear();
        const m = todayDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) age--;
        return age;
    }

    // =========================================================
    // LÓGICA DA PÁGINA 1 (HOME)
    // =========================================================
    async function loadHomePage() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };

        document.getElementById('home-greeting').innerText = `Olá, ${userData.name}!`;

        let consumed = { kcal: 0, prot: 0, carb: 0, fat: 0 };
        if (todayData.meals) {
            todayData.meals.forEach(meal => {
                meal.foods.forEach(food => {
                    consumed.kcal += food.kcal; consumed.prot += food.prot;
                    consumed.carb += food.carb; consumed.fat += food.fat;
                });
            });
        }

        const targets = {
            kcal: todayData.target_kcal || 0, prot: todayData.target_prot || 0,
            carb: todayData.target_carb || 0, fat: todayData.target_fat || 0
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
                    mealTotal.kcal += f.kcal; mealTotal.prot += f.prot;
                    mealTotal.carb += f.carb; mealTotal.fat += f.fat;
                });

                mealBox.innerHTML = `
                    <div class="meal-header" style="display: flex; justify-content: space-between; padding: 12px; background: #fff; border: 1px solid #000; cursor: pointer;">
                        <span><strong>${meal.name}</strong></span>
                        <span>
                            ${meal.time} 
                            <i class="fa-solid fa-pencil edit-meal-btn" data-meal="${mealIndex}" style="margin-left: 10px; cursor: pointer; color: #555;"></i>
                            <i class="fa-solid fa-trash delete-meal-btn" data-meal="${mealIndex}" style="margin-left: 15px; cursor: pointer; color: #ff4d4d;"></i>
                        </span>
                    </div>
                    <div class="meal-details" style="display: none; padding: 0; border: 1px solid #000; border-top: none;">
                        <table class="macro-table" style="width: 100%; border: none; font-size: 13px; margin: 0;">
                            <thead><tr style="background: #eee;"><th>ALIMENTO</th><th>QTDE</th><th>CAL</th><th>PROT</th><th>CARB</th><th>GORD</th></tr></thead>
                            <tbody>
                                ${meal.foods.map((food, foodIndex) => `
                                    <tr>
                                        <td>${food.name}</td>
                                        <td class="editable-qty" data-meal="${mealIndex}" data-food="${foodIndex}" style="cursor:pointer; color: #0066cc; text-decoration: underline; font-weight: bold;">${Math.round(food.amount)}</td>
                                        <td>${Math.round(food.kcal)}</td><td>${Math.round(food.prot)}</td><td>${Math.round(food.carb)}</td><td>${Math.round(food.fat)}</td>
                                    </tr>
                                `).join('')}
                                <tr style="font-weight: bold; background: #f5f5f5;"><td colspan="2" style="text-align: right; padding-right: 10px;">TOTAL</td>
                                    <td>${Math.round(mealTotal.kcal)}</td><td>${Math.round(mealTotal.prot)}</td><td>${Math.round(mealTotal.carb)}</td><td>${Math.round(mealTotal.fat)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                container.appendChild(mealBox);

                const header = mealBox.querySelector('.meal-header');
                const details = mealBox.querySelector('.meal-details');
                header.addEventListener('click', (e) => {
                    // Previne que o clique nos ícones expanda a tabela
                    if (e.target.classList.contains('fa-pencil') || e.target.classList.contains('fa-trash')) return;
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                });
            });

            // Lógica para excluir refeição
            document.querySelectorAll('.delete-meal-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const mealIdx = e.target.getAttribute('data-meal');
                    if(confirm(`Tem certeza que deseja excluir a refeição "${todayData.meals[mealIdx].name}"?`)) {
                        todayData.meals.splice(mealIdx, 1);
                        await saveData('Inf_3', todayData);
                        loadHomePage();
                    }
                });
            });

            // Lógica para editar Nome e Horário da refeição
            document.querySelectorAll('.edit-meal-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const mealIdx = e.target.getAttribute('data-meal');
                    showEditMealModal(mealIdx, todayData);
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
                    currentFood.kcal *= ratio; currentFood.prot *= ratio;
                    currentFood.carb *= ratio; currentFood.fat *= ratio;
                    await saveData('Inf_3', todayData);
                    loadHomePage(); 
                }
            });
        });
    }

    async function showEditMealModal(mealIdx, todayData) {
        const meal = todayData.meals[mealIdx];
        const inf2 = await getAllData('Inf_2') || [];
        const mealNames = inf2.filter(item => item.type === 'mealName');
        
        let optionsHtml = '';
        if (mealNames.length > 0) {
            mealNames.forEach(m => {
                optionsHtml += `<option value="${m.name}" ${m.name === meal.name ? 'selected' : ''}>${m.name}</option>`;
            });
        } else {
            ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'].forEach(name => {
                optionsHtml += `<option value="${name}" ${name === meal.name ? 'selected' : ''}>${name}</option>`;
            });
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; display:flex; justify-content:center; align-items:center;";
        overlay.innerHTML = `
            <div style="background:#fff; padding:20px; border: 2px solid #000; width:90%; max-width:350px;">
                <h3 style="text-align:center; margin-bottom:15px;">EDITAR REFEIÇÃO</h3>
                <label style="display:block; margin-bottom:10px;">Nome: 
                    <select id="edit-m-name" style="width:100%; padding:5px; margin-top:5px;">${optionsHtml}</select>
                </label>
                <label style="display:block; margin-bottom:15px;">Horário: 
                    <input type="time" id="edit-m-time" value="${meal.time}" style="width:100%; padding:5px; margin-top:5px;">
                </label>
                <div style="display:flex; justify-content:space-between;">
                    <button id="edit-m-cancel" style="padding:8px 15px;">Cancelar</button>
                    <button id="edit-m-save" class="action-btn" style="margin:0; width:60px;"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('edit-m-cancel').addEventListener('click', () => document.body.removeChild(overlay));
        document.getElementById('edit-m-save').addEventListener('click', async () => {
            meal.name = document.getElementById('edit-m-name').value;
            meal.time = document.getElementById('edit-m-time').value;
            await saveData('Inf_3', todayData);
            document.body.removeChild(overlay);
            loadHomePage();
        });
    }

    // =========================================================
    // LÓGICA DA PÁGINA 2 (OBJETIVOS) 
    // =========================================================
    async function calculateTDEE() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today);
        currentWeight = todayData?.weight || 70; 
        let fa = todayData?.activityLevel || 1.2;
        let age = calcAge(userData.birth);
        let gcd = 0;
        if (userData.sex === 'M') { gcd = (66.7 + (13.75 * currentWeight) + (5 * userData.height) - (6.8 * age)) * fa; } 
        else { gcd = (655.1 + (9.56 * currentWeight) + (1.85 * userData.height) - (4.68 * age)) * fa; }
        
        currentGCD = Math.round(gcd);
        todayData = todayData || { date: today, meals: [] };
        todayData.tdee = currentGCD;
        await saveData('Inf_3', todayData);
        document.getElementById('display-tdee').innerText = currentGCD;
    }

    async function loadGoalsPage() {
        await calculateTDEE();
        let todayData = await getData('Inf_3', today);

        if (todayData && todayData.target_kcal) {
            document.getElementById('goals-question').style.display = 'none';
            document.getElementById('goals-calculator').style.display = 'none';
            document.getElementById('goals-manual').style.display = 'block';

            document.getElementById('goal-kcal').value = todayData.target_kcal;
            document.getElementById('goal-prot').value = todayData.target_prot;
            document.getElementById('goal-fat').value = todayData.target_fat;
            document.getElementById('goal-carb').value = todayData.target_carb;

            syncFromMacros();
        } else {
            document.getElementById('goals-question').style.display = 'block';
            document.getElementById('goals-calculator').style.display = 'none';
            document.getElementById('goals-manual').style.display = 'none';
        }
    }

    document.getElementById('btn-goals-yes').addEventListener('click', () => {
        document.getElementById('goals-question').style.display = 'none';
        document.getElementById('goals-manual').style.display = 'block';
    });
    
    document.getElementById('btn-goals-no').addEventListener('click', () => {
        document.getElementById('goals-question').style.display = 'none';
        document.getElementById('goals-calculator').style.display = 'block';
    });

    document.getElementById('btn-recalc-goals').addEventListener('click', () => {
        document.getElementById('goals-manual').style.display = 'none';
        document.getElementById('goals-calculator').style.display = 'block';
    });

    function parseCustomNumber(val) {
        if(!val) return 0;
        return parseFloat(val.toString().replace('+', '').replace(',', '.')) || 0;
    }

    function syncFromMacros() {
        const p = parseCustomNumber(document.getElementById('goal-prot').value);
        const c = parseCustomNumber(document.getElementById('goal-carb').value);
        const f = parseCustomNumber(document.getElementById('goal-fat').value);

        if(currentWeight > 0) {
            document.getElementById('goal-prot-kg').value = (p / currentWeight).toFixed(1).replace('.', ',');
            document.getElementById('goal-carb-kg').value = (c / currentWeight).toFixed(1).replace('.', ',');
            document.getElementById('goal-fat-kg').value = (f / currentWeight).toFixed(1).replace('.', ',');
        }

        const newKcal = Math.round((p * 4) + (c * 4) + (f * 9));
        document.getElementById('goal-kcal').value = newKcal;
        
        if(currentGCD > 0) {
            const pct = ((newKcal / currentGCD) - 1) * 100;
            document.getElementById('goal-kcal-pct').value = pct > 0 ? `+${pct.toFixed(1)}` : pct.toFixed(1);
        }
    }

    function syncFromKcal() {
        const kcal = parseCustomNumber(document.getElementById('goal-kcal').value);
        const p = parseCustomNumber(document.getElementById('goal-prot').value);
        const f = parseCustomNumber(document.getElementById('goal-fat').value);

        if(currentGCD > 0) {
            const pct = ((kcal / currentGCD) - 1) * 100;
            document.getElementById('goal-kcal-pct').value = pct > 0 ? `+${pct.toFixed(1)}` : pct.toFixed(1);
        }

        let c = (kcal - (p * 4) - (f * 9)) / 4;
        if (c < 0) c = 0; 
        document.getElementById('goal-carb').value = Math.round(c);
        
        if(currentWeight > 0) {
            document.getElementById('goal-carb-kg').value = (c / currentWeight).toFixed(1).replace('.', ',');
        }
    }

    function syncFromKcalPct() {
        const pct = parseCustomNumber(document.getElementById('goal-kcal-pct').value);
        const newKcal = Math.round(currentGCD * (1 + (pct / 100)));
        document.getElementById('goal-kcal').value = newKcal;
        syncFromKcal();
    }

    document.getElementById('goal-kcal').addEventListener('input', syncFromKcal);
    document.getElementById('goal-kcal-pct').addEventListener('input', syncFromKcalPct);
    document.getElementById('goal-prot').addEventListener('input', syncFromMacros);
    document.getElementById('goal-fat').addEventListener('input', syncFromMacros);
    document.getElementById('goal-carb').addEventListener('input', syncFromMacros);

    document.getElementById('goal-prot-kg').addEventListener('input', (e) => {
        let val = parseCustomNumber(e.target.value);
        document.getElementById('goal-prot').value = Math.round(val * currentWeight);
        syncFromMacros();
    });
    document.getElementById('goal-fat-kg').addEventListener('input', (e) => {
        let val = parseCustomNumber(e.target.value);
        document.getElementById('goal-fat').value = Math.round(val * currentWeight);
        syncFromMacros();
    });
    document.getElementById('goal-carb-kg').addEventListener('input', (e) => {
        let val = parseCustomNumber(e.target.value);
        document.getElementById('goal-carb').value = Math.round(val * currentWeight);
        syncFromMacros();
    });

    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const goal = e.currentTarget.getAttribute('data-goal');
            let kcal=0, prot=0, fat=0, carb=0;
            
            if (goal === 'bulking') { kcal = 1.2 * currentGCD; prot = 2 * currentWeight; fat = 1 * currentWeight; } 
            else if (goal === 'cutting') { kcal = 0.8 * currentGCD; prot = 2.5 * currentWeight; fat = 1 * currentWeight; } 
            else if (goal === 'maintenance') { kcal = 1.0 * currentGCD; prot = 2 * currentWeight; fat = 1 * currentWeight; }
            carb = (kcal - (prot * 4) - (fat * 9)) / 4;
            
            document.getElementById('goal-kcal').value = Math.round(kcal);
            document.getElementById('goal-prot').value = Math.round(prot);
            document.getElementById('goal-fat').value = Math.round(fat);
            document.getElementById('goal-carb').value = Math.round(carb);
            
            document.getElementById('goals-calculator').style.display = 'none';
            document.getElementById('goals-manual').style.display = 'block';
            
            syncFromMacros();
        });
    });

    document.getElementById('save-goals-btn').addEventListener('click', async () => {
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        
        todayData.target_kcal = parseFloat(document.getElementById('goal-kcal').value);
        todayData.target_prot = parseFloat(document.getElementById('goal-prot').value);
        todayData.target_fat = parseFloat(document.getElementById('goal-fat').value);
        todayData.target_carb = parseFloat(document.getElementById('goal-carb').value);
        
        await saveData('Inf_3', todayData);
        alert('Metas registradas com sucesso e sincronizadas com o seu resumo diário.');
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-target="page-home"]').classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('screen-active'));
        document.getElementById('page-home').classList.add('screen-active');
        
        loadHomePage(); 
    });

    // =========================================================
    // LÓGICA DA PÁGINA 3 (ADICIONAR REFEIÇÃO)
    // =========================================================
    async function loadAddMealPage() {
        const inf2 = await getAllData('Inf_2') || [];
        const mealNames = inf2.filter(item => item.type === 'mealName');
        availableFoods = inf2.filter(item => item.type === 'food' || item.type === 'plate');

        const nameSelect = document.getElementById('add-meal-name');
        nameSelect.innerHTML = '';
        if (mealNames.length > 0) {
            mealNames.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.name; opt.innerText = m.name; nameSelect.appendChild(opt);
            });
        } else {
            ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'].forEach(name => {
                const opt = document.createElement('option');
                opt.value = name; opt.innerText = name; nameSelect.appendChild(opt);
            });
        }

        const now = new Date();
        document.getElementById('add-meal-time').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        let datalist = document.getElementById('food-options');
        if (!datalist) { datalist = document.createElement('datalist'); datalist.id = 'food-options'; document.body.appendChild(datalist); }
        datalist.innerHTML = '';
        
        availableFoods.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.name; datalist.appendChild(opt);
        });

        document.getElementById('add-meal-tbody').innerHTML = '';
        addMealRow();
    }

    function addMealRow() {
        const tbody = document.getElementById('add-meal-tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" list="food-options" class="row-food-name" style="width:100%; box-sizing:border-box;"></td>
            <td><input type="number" class="row-food-qty" style="width:50px;" min="1"></td>
            <td class="row-prot">0</td><td class="row-carb">0</td><td class="row-fat">0</td><td class="row-kcal">0</td>
        `;
        const nameInput = tr.querySelector('.row-food-name');
        const qtyInput = tr.querySelector('.row-food-qty');
        
        tr.dataset.baseAmount = 0; tr.dataset.baseProt = 0; tr.dataset.baseCarb = 0; tr.dataset.baseFat = 0; tr.dataset.baseKcal = 0;

        nameInput.addEventListener('input', (e) => {
            const food = availableFoods.find(f => f.name.toLowerCase() === e.target.value.toLowerCase());
            if (food) {
                qtyInput.value = Math.round(food.amount);
                tr.dataset.baseAmount = food.amount; tr.dataset.baseProt = food.prot;
                tr.dataset.baseCarb = food.carb; tr.dataset.baseFat = food.fat; tr.dataset.baseKcal = food.kcal;
                updateRowVisuals(tr, 1);
            }
        });

        qtyInput.addEventListener('input', (e) => {
            const baseAmount = parseFloat(tr.dataset.baseAmount);
            const newAmount = parseFloat(e.target.value);
            if (baseAmount > 0 && !isNaN(newAmount) && newAmount > 0) updateRowVisuals(tr, newAmount / baseAmount);
            else updateRowVisuals(tr, 0);
        });
        tbody.appendChild(tr);
    }

    function updateRowVisuals(tr, ratio) {
        tr.querySelector('.row-prot').innerText = Math.round(parseFloat(tr.dataset.baseProt) * ratio);
        tr.querySelector('.row-carb').innerText = Math.round(parseFloat(tr.dataset.baseCarb) * ratio);
        tr.querySelector('.row-fat').innerText = Math.round(parseFloat(tr.dataset.baseFat) * ratio);
        tr.querySelector('.row-kcal').innerText = Math.round(parseFloat(tr.dataset.baseKcal) * ratio);
    }

    document.getElementById('add-row-btn').addEventListener('click', () => addMealRow());

    document.getElementById('save-meal-btn').addEventListener('click', async () => {
        const mealName = document.getElementById('add-meal-name').value;
        const mealTime = document.getElementById('add-meal-time').value;
        const rows = document.getElementById('add-meal-tbody').querySelectorAll('tr');
        
        let foodsToSave = [];
        let hasError = false;

        rows.forEach(tr => {
            const name = tr.querySelector('.row-food-name').value;
            const qty = parseFloat(tr.querySelector('.row-food-qty').value);
            if (name && name.trim() !== '') {
                if (isNaN(qty) || qty <= 0) hasError = true;
                else {
                    foodsToSave.push({
                        name: name.trim(), amount: qty,
                        prot: parseFloat(tr.querySelector('.row-prot').innerText), carb: parseFloat(tr.querySelector('.row-carb').innerText),
                        fat: parseFloat(tr.querySelector('.row-fat').innerText), kcal: parseFloat(tr.querySelector('.row-kcal').innerText)
                    });
                }
            }
        });

        if (hasError) return alert('Por favor, informe quantidades maiores que zero para os alimentos.');
        if (foodsToSave.length === 0) return alert('Adicione ao menos um alimento.');

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
    // LÓGICA DA PÁGINA 4 (HISTÓRICO E GRÁFICOS) E CALENDÁRIO
    // =========================================================
    document.querySelector('.hist-btn[data-type="macros"]').addEventListener('click', () => { histMode = 'macros'; histSubMode = 'kcal'; loadHistoryPage(); });
    document.querySelector('.hist-btn[data-type="body"]').addEventListener('click', () => { histMode = 'body'; histSubMode = 'weight'; loadHistoryPage(); });

    document.querySelector('.fa-calendar').parentElement.addEventListener('click', async () => {
        let currentDateView = new Date(histRefDate + 'T12:00:00'); 
        let allData = await getAllData('Inf_3') || [];
        
        function renderCalendar(year, month) {
            let overlay = document.getElementById('custom-calendar-overlay');
            if(overlay) document.body.removeChild(overlay);

            overlay = document.createElement('div');
            overlay.id = 'custom-calendar-overlay';
            overlay.className = 'calendar-overlay';

            const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
            
            let firstDay = new Date(year, month, 1).getDay(); 
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let daysInPrevMonth = new Date(year, month, 0).getDate();

            let popup = document.createElement('div');
            popup.className = 'calendar-popup';

            let header = document.createElement('div');
            header.className = 'calendar-header';
            header.innerHTML = `<span class="calendar-nav" id="cal-prev"><</span><span>${monthNames[month]} de ${year}</span><span class="calendar-nav" id="cal-next">></span>`;
            popup.appendChild(header);

            let grid = document.createElement('div');
            grid.className = 'calendar-grid';
            const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            daysOfWeek.forEach(d => {
                let cell = document.createElement('div');
                cell.className = 'calendar-day-header';
                cell.innerText = d;
                grid.appendChild(cell);
            });

            for(let i = firstDay - 1; i >= 0; i--) {
                let cell = document.createElement('div');
                cell.className = 'calendar-day empty';
                cell.innerText = daysInPrevMonth - i;
                cell.style.color = i === firstDay - 1 ? '#ff9999' : '#ccc';
                grid.appendChild(cell);
            }

            for(let i = 1; i <= daysInMonth; i++) {
                let cell = document.createElement('div');
                cell.className = 'calendar-day';
                
                let currentDayOfWeek = new Date(year, month, i).getDay();
                if(currentDayOfWeek === 0) cell.classList.add('sunday');

                let dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
                
                let dayData = allData.find(d => d.date === dateStr);
                if(dayData && dayData.meals && dayData.meals.length > 0) {
                    cell.classList.add('has-data');
                }

                if(dateStr === histRefDate) cell.classList.add('selected');

                cell.innerText = i;
                cell.addEventListener('click', () => {
                    histRefDate = dateStr;
                    document.body.removeChild(overlay);
                    loadHistoryPage();
                });
                grid.appendChild(cell);
            }

            let totalCells = firstDay + daysInMonth;
            let remainingCells = 42 - totalCells; 
            if(remainingCells >= 7 && totalCells <= 35) remainingCells = 35 - totalCells; 
            
            for(let i = 1; i <= remainingCells; i++) {
                let cell = document.createElement('div');
                cell.className = 'calendar-day empty';
                cell.innerText = i;
                cell.style.color = '#ccc';
                grid.appendChild(cell);
            }

            popup.appendChild(grid);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                if(e.target === overlay) document.body.removeChild(overlay);
            });

            document.getElementById('cal-prev').addEventListener('click', () => {
                let newDate = new Date(year, month - 1, 1);
                renderCalendar(newDate.getFullYear(), newDate.getMonth());
            });
            document.getElementById('cal-next').addEventListener('click', () => {
                let newDate = new Date(year, month + 1, 1);
                renderCalendar(newDate.getFullYear(), newDate.getMonth());
            });
        }

        renderCalendar(currentDateView.getFullYear(), currentDateView.getMonth());
    });

    async function loadHistoryPage() {
        document.getElementById('history-year').innerText = histRefDate.split('-')[0];
        let allData = await getAllData('Inf_3') || [];
        let endDateObj = new Date(histRefDate + 'T12:00:00'); 
        let startDateObj = new Date(endDateObj);
        startDateObj.setDate(startDateObj.getDate() - 9);

        let labels = [], chartData = [], targetData = [], pointColors = [];

        for (let i = 0; i <= 9; i++) {
            let d = new Date(startDateObj);
            d.setDate(d.getDate() + i);
            let dStr = d.toISOString().split('T')[0];
            labels.push(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`);

            let dayData = allData.find(x => x.date === dStr);
            let val = null, target = null;

            if (dayData) {
                if (histMode === 'macros') {
                    let consumed = {kcal:0, prot:0, carb:0, fat:0};
                    if (dayData.meals) dayData.meals.forEach(m => m.foods.forEach(f => { consumed.kcal+=f.kcal; consumed.prot+=f.prot; consumed.carb+=f.carb; consumed.fat+=f.fat; }));
                    
                    if (histSubMode === 'kcal') { val = consumed.kcal; target = dayData.target_kcal || 0; }
                    else if (histSubMode === 'prot') { val = consumed.prot; target = dayData.target_prot || 0; }
                    else if (histSubMode === 'carb') { val = consumed.carb; target = dayData.target_carb || 0; }
                    else if (histSubMode === 'fat') { val = consumed.fat; target = dayData.target_fat || 0; }

                    chartData.push(val); targetData.push(target);
                    pointColors.push((target > 0 && Math.abs(val - target)/target <= 0.1) ? '#4caf50' : '#f44336'); 
                } else {
                    if (histSubMode === 'weight') val = dayData.weight || null;
                    else if (histSubMode === 'bf') val = dayData.bf || null;
                    else if (histSubMode === 'imc') val = dayData.imc || null;
                    else if (histSubMode === 'muscle') val = dayData.muscle || null;
                    else if (histSubMode === 'massGorda') val = dayData.massGorda || null;
                    else if (histSubMode === 'water') val = dayData.water || null;
                    chartData.push(val); targetData.push(null); pointColors.push('#000');
                }
            } else { chartData.push(null); targetData.push(null); pointColors.push('#555'); }
        }

        const ctx = document.getElementById('historyChart').getContext('2d');
        if (historyChartInstance) historyChartInstance.destroy();

        let datasets = [{
            label: histSubMode.toUpperCase(), data: chartData, backgroundColor: pointColors, borderColor: '#000',
            borderWidth: 1, pointRadius: 6, pointHoverRadius: 8, fill: false, type: 'line', spanGaps: true 
        }];

        if (histMode === 'macros') {
            datasets.push({ label: 'Meta', data: targetData, borderColor: '#4da6ff', borderWidth: 2, pointRadius: 0, fill: false, type: 'line', borderDash: [5, 5] });
        }

        historyChartInstance = new Chart(ctx, {
            type: 'line', data: { labels: labels, datasets: datasets },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: false } },
                onClick: (e, elements) => {
                    if (elements.length > 0) {
                        let d = new Date(startDateObj);
                        d.setDate(d.getDate() + elements[0].index);
                        updateHistoryGrid(d.toISOString().split('T')[0], allData);
                    }
                }
            }
        });
        updateHistoryGrid(histRefDate, allData);
    }

    function updateHistoryGrid(dateStr, allData) {
        let container = document.getElementById('history-data-macros');
        let dayData = allData.find(x => x.date === dateStr) || {};
        
        if(histMode === 'macros') {
            let consumed = {kcal:0, prot:0, carb:0, fat:0};
            if(dayData.meals) dayData.meals.forEach(m => m.foods.forEach(f => { consumed.kcal+=f.kcal; consumed.prot+=f.prot; consumed.carb+=f.carb; consumed.fat+=f.fat; }));
            
            container.innerHTML = `
                <div class="col-left">
                    <p>Meta: ${Math.round(dayData.target_kcal||0)} Kcal</p><p>GCD: ${dayData.tdee||0} Kcal</p>
                    <p class="clickable-hist" data-sub="kcal" style="${histSubMode==='kcal'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Calorias: ${Math.round(consumed.kcal)}</p>
                </div>
                <div class="col-center">
                    <p class="clickable-hist" data-sub="prot" style="${histSubMode==='prot'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Proteínas: ${Math.round(consumed.prot)}g</p>
                    <p class="clickable-hist" data-sub="carb" style="${histSubMode==='carb'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Carboidratos: ${Math.round(consumed.carb)}g</p>
                    <p class="clickable-hist" data-sub="fat" style="${histSubMode==='fat'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Gorduras: ${Math.round(consumed.fat)}g</p>
                </div>
                <div class="col-right">
                    <p>Meta prot.: ${Math.round(dayData.target_prot||0)}g</p><p>Meta carb.: ${Math.round(dayData.target_carb||0)}g</p><p>Meta gord.: ${Math.round(dayData.target_fat||0)}g</p>
                </div>
            `;
        } else {
             container.innerHTML = `
                <div class="col-left">
                    <p class="clickable-hist" data-sub="weight" style="${histSubMode==='weight'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Peso: ${dayData.weight||0} Kgs</p>
                    <p class="clickable-hist" data-sub="bf" style="${histSubMode==='bf'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Gordura (%): ${dayData.bf||0}%</p>
                    <p class="clickable-hist" data-sub="imc" style="${histSubMode==='imc'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">IMC: ${dayData.imc||0}</p>
                </div>
                <div class="col-right" style="text-align: right;">
                    <p class="clickable-hist" data-sub="muscle" style="${histSubMode==='muscle'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Músculo Esq.: ${dayData.muscle||0} Kgs</p>
                    <p class="clickable-hist" data-sub="massGorda" style="${histSubMode==='massGorda'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Massa gorda: ${dayData.massGorda||0} Kgs</p>
                    <p class="clickable-hist" data-sub="water" style="${histSubMode==='water'?'font-weight:bold; background:#e0e0e0;':''} cursor:pointer;">Água corporal: ${dayData.water||0} Kgs</p>
                </div>
            `;
        }
        container.querySelectorAll('.clickable-hist').forEach(el => el.addEventListener('click', (e) => { histSubMode = e.currentTarget.getAttribute('data-sub'); loadHistoryPage(); }));
    }

    // =========================================================
    // LÓGICA DA PÁGINA 5 (ALIMENTOS, PRATOS E REFEIÇÕES)
    // =========================================================
    let currentFoodTab = 'alimentos';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentFoodTab = e.currentTarget.getAttribute('data-tab');
            loadFoodPage();
        });
    });

    async function loadFoodPage() {
        const container = document.getElementById('tab-alimentos');
        container.innerHTML = ''; 
        const inf2 = await getAllData('Inf_2') || [];

        if (currentFoodTab === 'alimentos') {
            const foods = inf2.filter(i => i.type === 'food').sort((a,b) => a.name.localeCompare(b.name));
            let html = `<table class="macro-table"><thead><tr><th>NOME</th><th>QTDE(g/ml)</th><th>PROT</th><th>CARB</th><th>GORD</th><th>Kcal</th></tr></thead><tbody>`;
            foods.forEach(f => {
                html += `<tr><td>${f.name}</td><td>${f.amount}</td><td>${f.prot}</td><td>${f.carb}</td><td>${f.fat}</td><td>${f.kcal}</td></tr>`;
            });
            html += `</tbody></table>
                     <div style="position: fixed; bottom: 80px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
                        <button class="fab-btn" id="edit-food-btn" style="position: static;"><i class="fa-solid fa-pencil"></i></button>
                        <button class="fab-btn" id="add-food-btn" style="position: static;"><i class="fa-solid fa-plus"></i></button>
                     </div>`;
            container.innerHTML = html;

            document.getElementById('add-food-btn').addEventListener('click', () => showFoodModal(null));
            document.getElementById('edit-food-btn').addEventListener('click', () => {
                let nameToEdit = prompt("Digite o nome exato do alimento para edição:");
                let food = foods.find(f => f.name.toLowerCase() === nameToEdit?.toLowerCase());
                if(food) showFoodModal(food); else if(nameToEdit) alert("Alimento não localizado.");
            });

        } else if (currentFoodTab === 'pratos') {
            const plates = inf2.filter(i => i.type === 'plate').sort((a,b) => a.name.localeCompare(b.name));
            let html = `<table class="macro-table"><thead><tr><th>NOME</th><th>QTDE</th><th>PROT</th><th>CARB</th><th>GORD</th><th>Kcal</th></tr></thead><tbody>`;
            plates.forEach(p => {
                html += `<tr style="background:#eee; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'table-row' : 'none'">
                            <td><strong>${p.name}</strong></td><td>${Math.round(p.amount)}</td><td>${Math.round(p.prot)}</td><td>${Math.round(p.carb)}</td><td>${Math.round(p.fat)}</td><td>${Math.round(p.kcal)}</td>
                         </tr>
                         <tr style="display:none;"><td colspan="6" style="padding:0;">
                            <table style="width:100%; font-size:12px; background:#fff;">
                                ${p.foods.map(f => `<tr><td>${f.name}</td><td>${Math.round(f.amount)}</td><td>${Math.round(f.prot)}</td><td>${Math.round(f.carb)}</td><td>${Math.round(f.fat)}</td><td>${Math.round(f.kcal)}</td></tr>`).join('')}
                            </table>
                         </td></tr>`;
            });
            html += `</tbody></table>
                     <div style="position: fixed; bottom: 80px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
                        <button class="fab-btn" id="edit-plate-btn" style="position: static;"><i class="fa-solid fa-pencil"></i></button>
                        <button class="fab-btn" id="add-plate-btn" style="position: static;"><i class="fa-solid fa-plus"></i></button>
                     </div>`;
            container.innerHTML = html;

            document.getElementById('add-plate-btn').addEventListener('click', () => showPlateModal(null));
            document.getElementById('edit-plate-btn').addEventListener('click', () => {
                let nameToEdit = prompt("Digite o nome exato do prato para edição:");
                let plate = plates.find(p => p.name.toLowerCase() === nameToEdit?.toLowerCase());
                if(plate) showPlateModal(plate); else if(nameToEdit) alert("Prato não localizado.");
            });

        } else if (currentFoodTab === 'refeicoes') {
            const meals = inf2.filter(i => i.type === 'mealName');
            let html = `<p style="text-align:center; margin-bottom:10px;">Como você quer organizar suas refeições ao longo do dia?</p>
                        <table class="macro-table" id="meal-config-table">
                            <thead><tr><th>Nome da Refeição</th><th>Horário</th><th>Definir Lembrete</th></tr></thead>
                            <tbody>`;
            
            if(meals.length === 0) meals.push({name:'', time:'', reminder:0}); 
            meals.forEach(m => {
                html += `<tr>
                            <td><input type="text" class="m-name" value="${m.name}" style="width:100%;"></td>
                            <td><input type="time" class="m-time" value="${m.time}" style="width:100%;"></td>
                            <td><select class="m-rem"><option value="0" ${m.reminder==0?'selected':''}>Sem lembrete</option><option value="5" ${m.reminder==5?'selected':''}>5 min antes</option><option value="10" ${m.reminder==10?'selected':''}>10 min antes</option><option value="15" ${m.reminder==15?'selected':''}>15 min antes</option></select></td>
                         </tr>`;
            });
            html += `</tbody></table>
                     <div style="display:flex; justify-content:center; gap:20px; margin-top:15px;">
                        <button id="add-meal-row-btn" class="icon-btn"><i class="fa-solid fa-plus"></i></button>
                        <button id="save-meal-config-btn" class="action-btn" style="width:auto; margin:0;"><i class="fa-solid fa-check"></i></button>
                     </div>`;
            container.innerHTML = html;

            document.getElementById('add-meal-row-btn').addEventListener('click', () => {
                const tbody = document.getElementById('meal-config-table').querySelector('tbody');
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><input type="text" class="m-name" style="width:100%;"></td><td><input type="time" class="m-time" style="width:100%;"></td><td><select class="m-rem"><option value="0">Sem lembrete</option><option value="5">5 min antes</option><option value="10">10 min antes</option><option value="15">15 min antes</option></select></td>`;
                tbody.appendChild(tr);
            });

            document.getElementById('save-meal-config-btn').addEventListener('click', async () => {
                if(Notification.permission !== "granted") Notification.requestPermission();
                const rows = document.querySelectorAll('#meal-config-table tbody tr');
                
                const dbTransact = db.transaction(['Inf_2'], 'readwrite');
                const store = dbTransact.objectStore('Inf_2');
                let allItemsReq = store.getAll();
                allItemsReq.onsuccess = () => {
                    allItemsReq.result.forEach(item => { if(item.type === 'mealName') store.delete(item.id); });
                };
                
                setTimeout(async () => {
                    for(let tr of rows) {
                        const n = tr.querySelector('.m-name').value.trim();
                        if(n) await saveData('Inf_2', { type: 'mealName', name: n, time: tr.querySelector('.m-time').value, reminder: parseInt(tr.querySelector('.m-rem').value) });
                    }
                    alert("A configuração das refeições e dos lembretes foi salva com sucesso.");
                    loadFoodPage();
                }, 100);
            });
        }
    }

    function showFoodModal(foodData) {
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; display:flex; justify-content:center; align-items:center;";
        overlay.innerHTML = `
            <div style="background:#fff; padding:20px; border: 2px solid #000; width:95%;">
                <h3 style="text-align:center; margin-bottom:15px;">${foodData ? 'EDITAR ALIMENTO' : 'REGISTRAR NOVO ALIMENTO'}</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <label>Nome: <input type="text" id="modal-f-name" value="${foodData ? foodData.name : ''}" style="width:100%;"></label>
                    <div style="display:flex; gap:5px;">
                        <label>Qtde: <input type="number" id="modal-f-qty" value="${foodData ? foodData.amount : ''}" style="width:100%;"></label>
                        <label>Prot: <input type="number" id="modal-f-prot" value="${foodData ? foodData.prot : ''}" style="width:100%;"></label>
                        <label>Carb: <input type="number" id="modal-f-carb" value="${foodData ? foodData.carb : ''}" style="width:100%;"></label>
                        <label>Gord: <input type="number" id="modal-f-fat" value="${foodData ? foodData.fat : ''}" style="width:100%;"></label>
                        <label>Kcal: <input type="number" id="modal-f-kcal" value="${foodData ? foodData.kcal : ''}" style="width:100%;"></label>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <button id="modal-f-cancel" style="padding:10px;">Cancelar</button>
                    <button id="modal-f-save" class="action-btn" style="margin:0; width:60px;"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        document.getElementById('modal-f-cancel').addEventListener('click', () => document.body.removeChild(overlay));
        document.getElementById('modal-f-save').addEventListener('click', async () => {
            const dataToSave = {
                type: 'food',
                name: document.getElementById('modal-f-name').value.trim(),
                amount: parseFloat(document.getElementById('modal-f-qty').value),
                prot: parseFloat(document.getElementById('modal-f-prot').value),
                carb: parseFloat(document.getElementById('modal-f-carb').value),
                fat: parseFloat(document.getElementById('modal-f-fat').value),
                kcal: parseFloat(document.getElementById('modal-f-kcal').value)
            };
            if(foodData) dataToSave.id = foodData.id;
            
            if(dataToSave.name && !isNaN(dataToSave.amount)) {
                await saveData('Inf_2', dataToSave);
                document.body.removeChild(overlay);
                loadFoodPage();
            } else alert('É necessário preencher o nome e a quantidade do alimento com dados válidos.');
        });
    }

    async function showPlateModal(plateData) {
        const inf2 = await getAllData('Inf_2') || [];
        availableFoods = inf2.filter(item => item.type === 'food'); 

        let datalist = document.getElementById('plate-food-options');
        if (!datalist) { datalist = document.createElement('datalist'); datalist.id = 'plate-food-options'; document.body.appendChild(datalist); }
        datalist.innerHTML = '';
        availableFoods.forEach(f => { const opt = document.createElement('option'); opt.value = f.name; datalist.appendChild(opt); });

        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; display:flex; justify-content:center; align-items:center;";
        
        let initialRowsHTML = '';
        if(plateData && plateData.foods) {
            plateData.foods.forEach(f => {
                initialRowsHTML += `<tr><td><input type="text" list="plate-food-options" class="p-f-name" value="${f.name}" style="width:100%;"></td>
                <td><input type="number" class="p-f-qty" value="${f.amount}" style="width:50px;"></td><td class="p-f-prot">${f.prot}</td><td class="p-f-carb">${f.carb}</td><td class="p-f-fat">${f.fat}</td><td class="p-f-kcal">${f.kcal}</td></tr>`;
            });
        }

        overlay.innerHTML = `
            <div style="background:#fff; padding:15px; border: 2px solid #000; width:95%; max-height:90vh; overflow-y:auto;">
                <h3 style="text-align:center; margin-bottom:10px;">${plateData ? 'EDITAR PRATO' : 'REGISTRAR NOVO PRATO'}</h3>
                <label>Nome do Prato: <input type="text" id="modal-p-name" value="${plateData ? plateData.name : ''}" style="width:100%; margin-bottom:10px;"></label>
                <table class="macro-table" id="plate-foods-table" style="font-size:12px;">
                    <thead><tr><th>ALIMENTO</th><th>QTDE</th><th>PROT</th><th>CARB</th><th>GORD</th><th>Kcal</th></tr></thead>
                    <tbody>${initialRowsHTML}</tbody>
                </table>
                <div style="text-align:center; margin-top:5px;"><button id="add-p-row-btn" class="icon-btn"><i class="fa-solid fa-plus"></i></button></div>
                <div style="display:flex; justify-content:space-between; margin-top:15px;">
                    <button id="modal-p-cancel" style="padding:10px;">Cancelar</button>
                    <button id="modal-p-save" class="action-btn" style="margin:0; width:60px;"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const addRowToPlate = () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><input type="text" list="plate-food-options" class="p-f-name" style="width:100%;"></td><td><input type="number" class="p-f-qty" style="width:50px;"></td><td class="p-f-prot">0</td><td class="p-f-carb">0</td><td class="p-f-fat">0</td><td class="p-f-kcal">0</td>`;
            tr.dataset.baseAmount = 0; tr.dataset.baseProt = 0; tr.dataset.baseCarb = 0; tr.dataset.baseFat = 0; tr.dataset.baseKcal = 0;
            
            tr.querySelector('.p-f-name').addEventListener('input', (e) => {
                const food = availableFoods.find(f => f.name.toLowerCase() === e.target.value.toLowerCase());
                if (food) {
                    tr.querySelector('.p-f-qty').value = Math.round(food.amount);
                    tr.dataset.baseAmount = food.amount; tr.dataset.baseProt = food.prot; tr.dataset.baseCarb = food.carb; tr.dataset.baseFat = food.fat; tr.dataset.baseKcal = food.kcal;
                    updatePlateRowVisuals(tr, 1);
                }
            });
            tr.querySelector('.p-f-qty').addEventListener('input', (e) => {
                const baseAmount = parseFloat(tr.dataset.baseAmount); const newAmount = parseFloat(e.target.value);
                if (baseAmount > 0 && !isNaN(newAmount)) updatePlateRowVisuals(tr, newAmount / baseAmount);
            });
            document.getElementById('plate-foods-table').querySelector('tbody').appendChild(tr);
        };

        function updatePlateRowVisuals(tr, ratio) {
            tr.querySelector('.p-f-prot').innerText = Math.round(parseFloat(tr.dataset.baseProt) * ratio);
            tr.querySelector('.p-f-carb').innerText = Math.round(parseFloat(tr.dataset.baseCarb) * ratio);
            tr.querySelector('.p-f-fat').innerText = Math.round(parseFloat(tr.dataset.baseFat) * ratio);
            tr.querySelector('.p-f-kcal').innerText = Math.round(parseFloat(tr.dataset.baseKcal) * ratio);
        }

        if(!plateData || !plateData.foods) addRowToPlate(); 
        else {
            overlay.querySelectorAll('tbody tr').forEach(tr => {
                const fName = tr.querySelector('.p-f-name').value;
                const dbFood = availableFoods.find(f => f.name === fName);
                if(dbFood) {
                    tr.dataset.baseAmount = dbFood.amount; tr.dataset.baseProt = dbFood.prot; tr.dataset.baseCarb = dbFood.carb; tr.dataset.baseFat = dbFood.fat; tr.dataset.baseKcal = dbFood.kcal;
                    tr.querySelector('.p-f-qty').addEventListener('input', (e) => { updatePlateRowVisuals(tr, parseFloat(e.target.value) / parseFloat(tr.dataset.baseAmount)); });
                }
            });
        }

        document.getElementById('add-p-row-btn').addEventListener('click', addRowToPlate);
        document.getElementById('modal-p-cancel').addEventListener('click', () => document.body.removeChild(overlay));
        
        document.getElementById('modal-p-save').addEventListener('click', async () => {
            const pName = document.getElementById('modal-p-name').value.trim();
            if(!pName) return alert("O prato requer um nome.");

            let sumAmount=0, sumProt=0, sumCarb=0, sumFat=0, sumKcal=0;
            let foodsArray = [];
            const rows = document.getElementById('plate-foods-table').querySelectorAll('tbody tr');
            
            rows.forEach(tr => {
                const n = tr.querySelector('.p-f-name').value.trim();
                const q = parseFloat(tr.querySelector('.p-f-qty').value);
                if(n && q > 0) {
                    const p = parseFloat(tr.querySelector('.p-f-prot').innerText);
                    const c = parseFloat(tr.querySelector('.p-f-carb').innerText);
                    const f = parseFloat(tr.querySelector('.p-f-fat').innerText);
                    const k = parseFloat(tr.querySelector('.p-f-kcal').innerText);
                    foodsArray.push({name:n, amount:q, prot:p, carb:c, fat:f, kcal:k});
                    sumAmount += q; sumProt += p; sumCarb += c; sumFat += f; sumKcal += k;
                }
            });

            if(foodsArray.length === 0) return alert("Insira pelo menos um alimento ao prato.");

            const dataToSave = { type: 'plate', name: pName, amount: sumAmount, prot: sumProt, carb: sumCarb, fat: sumFat, kcal: sumKcal, foods: foodsArray };
            if(plateData) dataToSave.id = plateData.id;

            await saveData('Inf_2', dataToSave);
            document.body.removeChild(overlay);
            loadFoodPage();
        });
    }

    // =========================================================
    // LÓGICA DA PÁGINA 6 (PERFIL / DADOS E NOVA MEDIÇÃO)
    // =========================================================
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

    document.getElementById('new-measurement-btn').addEventListener('click', async () => {
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        const act = todayData.activityLevel || 1.2;

        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; display:flex; justify-content:center; align-items:center;";
        
        overlay.innerHTML = `
            <div style="background:#fff; padding:20px; border: 2px solid #000; width:95%; max-height:90vh; overflow-y:auto;">
                <h3 style="text-align:center; margin-bottom:15px;">NOVA MEDIÇÃO: ${new Date().toLocaleDateString('pt-BR')}</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <label>Peso (kg): <input type="number" id="mod-m-weight" value="${todayData.weight || ''}" step="0.1" style="width:100%;"></label>
                    <label>Gordura Corporal (%): <input type="number" id="mod-m-bf" value="${todayData.bf || ''}" style="width:100%;"></label>
                    <label>IMC: <input type="number" id="mod-m-imc" value="${todayData.imc || ''}" style="width:100%;"></label>
                    <label>Músculo Esquelético (kg): <input type="number" id="mod-m-muscle" value="${todayData.muscle || ''}" style="width:100%;"></label>
                    <label>Massa Gorda (kg): <input type="number" id="mod-m-fatmass" value="${todayData.massGorda || ''}" style="width:100%;"></label>
                    <label>Água Corporal (kg): <input type="number" id="mod-m-water" value="${todayData.water || ''}" style="width:100%;"></label>
                    <label>Nível de atividade física:
                        <select id="mod-m-activity" style="width:100%; padding: 5px; margin-top: 5px;">
                            <option value="1.2" ${act == 1.2 ? 'selected' : ''}>Sedentário</option>
                            <option value="1.375" ${act == 1.375 ? 'selected' : ''}>Levemente Ativo</option>
                            <option value="1.55" ${act == 1.55 ? 'selected' : ''}>Moderadamente Ativo</option>
                            <option value="1.725" ${act == 1.725 ? 'selected' : ''}>Altamente Ativo</option>
                            <option value="1.9" ${act == 1.9 ? 'selected' : ''}>Extremamente Ativo</option>
                        </select>
                    </label>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <button id="mod-m-cancel" style="padding:10px;">Cancelar</button>
                    <button id="mod-m-save" class="action-btn" style="margin:0; width:60px;"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        document.getElementById('mod-m-cancel').addEventListener('click', () => document.body.removeChild(overlay));
        
        document.getElementById('mod-m-save').addEventListener('click', async () => {
            const w = parseFloat(document.getElementById('mod-m-weight').value);
            if (!isNaN(w) && w > 0) todayData.weight = w;
            
            const bf = parseFloat(document.getElementById('mod-m-bf').value);
            if (!isNaN(bf)) todayData.bf = bf;
            
            const imc = parseFloat(document.getElementById('mod-m-imc').value);
            if (!isNaN(imc)) todayData.imc = imc;
            
            const muscle = parseFloat(document.getElementById('mod-m-muscle').value);
            if (!isNaN(muscle)) todayData.muscle = muscle;
            
            const fatmass = parseFloat(document.getElementById('mod-m-fatmass').value);
            if (!isNaN(fatmass)) todayData.massGorda = fatmass;
            
            const water = parseFloat(document.getElementById('mod-m-water').value);
            if (!isNaN(water)) todayData.water = water;
            
            const activity = parseFloat(document.getElementById('mod-m-activity').value);
            if (!isNaN(activity)) todayData.activityLevel = activity;

            let usr = await getData('Inf_1', 1);
            let age = calcAge(usr.birth);
            let gcd = 0;
            
            if (usr.sex === 'M') { 
                gcd = (66.7 + (13.75 * todayData.weight) + (5 * usr.height) - (6.8 * age)) * todayData.activityLevel; 
            } else { 
                gcd = (655.1 + (9.56 * todayData.weight) + (1.85 * usr.height) - (4.68 * age)) * todayData.activityLevel; 
            }
            
            todayData.tdee = Math.round(gcd);

            await saveData('Inf_3', todayData);
            document.body.removeChild(overlay);
            loadProfilePage();
        });
    });
});
