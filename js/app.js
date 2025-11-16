// app.js - Main application controller - ORDEM DE CARREGAMENTO CORRIGIDA

const App = {
    isInitialized: false,

    // Initialize app
    async init() {
        // Prevent double initialization
        if (this.isInitialized) {
            console.log('⚠️ App já foi inicializado');
            return;
        }

        console.log('🚀 Apostando Bem - Iniciando...');
        
        try {
            // 1. Load ODS data first (async)
            console.log('📦 Carregando dados das ODS...');
            await Betting.init();
            console.log('✅ ODS carregadas');
            
            // 2. Load games (requires DOM)
            console.log('⚽ Carregando jogos...');
            Games.loadGames();
            console.log('✅ Jogos carregados');
            
            // 3. Initialize ranking
            console.log('🏆 Inicializando ranking...');
            Ranking.init();
            console.log('✅ Ranking inicializado');
            
            // 4. Update user info in header
            this.updateUserInfo();
            
            // 5. Setup menu toggle
            this.setupMenuToggle();
            
            // 6. Setup smooth scroll
            this.setupSmoothScroll();
            
            // 7. Setup modal close on ESC
            this.setupEscapeKey();
            
            this.isInitialized = true;
            console.log('✅ Apostando Bem - Pronto!');
            console.log('📊 XP Atual:', Storage.getXP());
            console.log('🏆 Nível Atual:', Storage.getLevel());
            
        } catch (error) {
            console.error('❌ Erro ao inicializar app:', error);
        }
    },

    // Update user info in header
    updateUserInfo() {
        const xpElement = document.getElementById('userXP');
        const levelElement = document.getElementById('userLevel');
        
        if (xpElement) {
            const xp = Storage.getXP();
            xpElement.textContent = xp;
        }
        
        if (levelElement) {
            const level = Storage.getLevel();
            levelElement.textContent = level;
        }
        
        // Update ranking
        Storage.updateRanking();
        
        // Refresh ranking display if on ranking section
        if (Ranking && Ranking.currentTab) {
            Ranking.loadRanking(Ranking.currentTab);
        }
    },

    // Setup menu toggle for mobile
    setupMenuToggle() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('mainNav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
        }
    },

    // Setup smooth scroll
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Close mobile menu if open
                    const nav = document.getElementById('mainNav');
                    if (nav) nav.classList.remove('active');
                }
            });
        });
    },

    // Setup ESC key to close modals
    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('bettingModal');
                if (modal && modal.classList.contains('active')) {
                    Betting.closeModal();
                }
            }
        });
    },

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--danger)'};
            color: var(--bg-dark);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 700;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Helper function for CTA button
function scrollToGames() {
    const gamesSection = document.getElementById('jogos');
    if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize app when DOM is COMPLETELY loaded
if (document.readyState === 'loading') {
    // DOM still loading
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded');
        App.init();
    });
} else {
    // DOM already loaded
    console.log('📄 DOM já estava carregado');
    App.init();
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);