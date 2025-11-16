// app.js - VERSÃO DEFINITIVA

const App = {
    isInitialized: false,

    async init() {
        if (this.isInitialized) {
            console.log('⚠️ App já inicializado');
            return;
        }

        console.log('🚀 APOSTANDO BEM - INICIANDO');
        console.log('📅 Data:', new Date().toLocaleString('pt-BR'));
        
        try {
            console.log('📄 PASSO 1: Verificando DOM...');
            const gamesGrid = document.getElementById('gamesGrid');
            console.log('   → gamesGrid existe?', !!gamesGrid);
            
            if (!gamesGrid) {
                console.error('❌ ERRO CRÍTICO: gamesGrid não encontrado no HTML!');
                return;
            }
            
            console.log('📦 PASSO 2: Carregando ODS...');
            await Betting.init();
            console.log('   ✅ ODS carregadas');
            
            console.log('⚽ PASSO 3: Carregando jogos...');
            Games.loadGames();
            console.log('   ✅ Jogos carregados');
            
            const cardsInDOM = document.querySelectorAll('.game-card').length;
            console.log('   → Cards no DOM:', cardsInDOM);
            
            if (cardsInDOM === 0) {
                console.error('❌ ERRO: Nenhum card foi inserido no DOM!');
            }
            
            console.log('🏆 PASSO 5: Inicializando ranking...');
            Ranking.init();
            console.log('   ✅ Ranking inicializado');
            
            this.updateUserInfo();
            this.setupMenuToggle();
            this.setupSmoothScroll();
            this.setupEscapeKey();
            
            this.isInitialized = true;
            
            console.log('✅ APOSTANDO BEM ESTÁ PRONTO!');
            console.log('📊 XP:', Storage.getXP());
            console.log('🏆 Nível:', Storage.getLevel());
            
        } catch (error) {
            console.error('❌ ERRO FATAL:', error);
            console.error('Stack:', error.stack);
        }
    },

    updateUserInfo() {
        const xpElement = document.getElementById('userXP');
        const levelElement = document.getElementById('userLevel');
        
        if (xpElement) xpElement.textContent = Storage.getXP();
        if (levelElement) levelElement.textContent = Storage.getLevel();
        
        Storage.updateRanking();
        
        if (Ranking && Ranking.currentTab) {
            Ranking.loadRanking(Ranking.currentTab);
        }
    },

    setupMenuToggle() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('mainNav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => nav.classList.toggle('active'));
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
        }
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const nav = document.getElementById('mainNav');
                    if (nav) nav.classList.remove('active');
                }
            });
        });
    },

    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('bettingModal');
                if (modal && modal.classList.contains('active')) {
                    Betting.closeModal();
                }
            }
        });
    }
};

function scrollToGames() {
    const gamesSection = document.getElementById('jogos');
    if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

console.log('📜 app.js carregado');
console.log('🔍 Estado do documento:', document.readyState);

if (document.readyState === 'loading') {
    console.log('⏳ Aguardando DOM carregar...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM carregado!');
        App.init();
    });
} else {
    console.log('✅ DOM já estava carregado');
    App.init();
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);