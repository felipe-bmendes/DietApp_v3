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

    // Carregar Home
    async function loadHomePage() {
        userData = await getData('Inf_1', 1);
        document.getElementById('home-greeting').innerText = `Olá, ${userData.name}!`;
        
        let todayData = await getData('Inf_3', today) || { date: today, meals: [] };
        
        // Exemplo de preenchimento visual das barras caso os dados existam (lógica de soma omitida para brevidade)
        const targetKcal = todayData.target_kcal || 0;
        const consumedKcal = 0; // Somatório das meals do dia entraria aqui
        
        document.getElementById('text-cal-val').innerText = `${consumedKcal}/${targetKcal} kcal`;
        if (targetKcal > 0) {
            document.getElementById('bar-cal').style.width = Math.min((consumedKcal/targetKcal)*100, 100) + '%';
        }
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
