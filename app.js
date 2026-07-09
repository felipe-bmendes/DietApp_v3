document.addEventListener('DOMContentLoaded', async () => {
    // Registra PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou:', err));
    }

    await initDB();
    
    // Obter data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

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

    // Carregar Home (Página 1) - ATUALIZADO
    async function loadHomePage() {
        userData = await getData('Inf_1', 1);
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };

        // 1. Atualizar saudação
        document.getElementById('home-greeting').innerText = `Olá, ${userData.name}!`;

        // 2. Calcular somatórios do dia
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

        // 3. Preencher Barras de Progresso
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
            if (percentage > 100) percentage = 100; // Trava visualmente em 100%
            bar.style.width = `${percentage}%`;
        };

        updateBar('cal', consumed.kcal, targets.kcal, 'kcal');
        updateBar('prot', consumed.prot, targets.prot, 'g');
        updateBar('carb', consumed.carb, targets.carb, 'g');
        updateBar('fat', consumed.fat, targets.fat, 'g');

        // 4. Renderizar a lista de refeições e a minitabela expansível
        const container = document.getElementById('home-meals-container');
        container.innerHTML = ''; // Limpar contêiner antes de re-renderizar

        if (todayData.meals && todayData.meals.length > 0) {
            todayData.meals.forEach((meal, mealIndex) => {
                const mealBox = document.createElement('div');
                mealBox.className = 'meal-box';
                mealBox.style.marginBottom = '10px';
                
                // Somatório interno da refeição
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

                // Evento para expandir/retrair a minitabela
                const header = mealBox.querySelector('.meal-header');
                const details = mealBox.querySelector('.meal-details');
                header.addEventListener('click', (e) => {
                    // Impede de abrir/fechar se o usuário clicou direto no ícone do lápis
                    if (e.target.classList.contains('fa-pencil')) return;
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                });
            });
        } else {
            container.innerHTML = '<p style="text-align:center; color: #777; margin-top: 20px;">Nenhuma refeição registrada hoje.</p>';
        }

        // 5. Lógica de edição rápida das quantidades
        document.querySelectorAll('.editable-qty').forEach(cell => {
            cell.addEventListener('click', async (e) => {
                const mealIdx = e.target.getAttribute('data-meal');
                const foodIdx = e.target.getAttribute('data-food');
                
                let currentFood = todayData.meals[mealIdx].foods[foodIdx];
                
                // Prompt para o usuário digitar a nova quantidade
                let newAmount = prompt(`Editar quantidade (g/ml) de ${currentFood.name}:`, Math.round(currentFood.amount));
                
                // Valida se o usuário digitou um número válido e maior que zero
                if (newAmount !== null && !isNaN(newAmount) && newAmount > 0) {
                    newAmount = parseFloat(newAmount);
                    
                    // Regra de três simples para recalcular todos os macros
                    const ratio = newAmount / currentFood.amount;
                    
                    currentFood.amount = newAmount;
                    currentFood.kcal *= ratio;
                    currentFood.prot *= ratio;
                    currentFood.carb *= ratio;
                    currentFood.fat *= ratio;

                    // Salva no banco de dados
                    await saveData('Inf_3', todayData);
                    
                    // Recarrega a página automaticamente para atualizar tabelas e as barras de resumo
                    loadHomePage(); 
                }
            });
        });
    }

    // Lógica da Página de Objetivos (Harris-Benedict)
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
        let weight = todayData?.weight || 70; // fallback se houver erro
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

    // Cálculos de Macros Automáticos
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

    // Salvar Objetivos
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
