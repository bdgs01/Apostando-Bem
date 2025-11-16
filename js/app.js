// app.js - Main application controller - CORRIGIDO

const App = {
    // Initialize app
    async init() {
        console.log('🚀 Apostando Bem - Iniciando...');
        
        // Load ODS data first
        await Betting.init();
        
        // Load games
        Games.loadGames();
        
        // Initialize ranking
        Ranking.init();
        
        // Update user info in header
        this.updateUserInfo();
        
        // Setup menu toggle
        this.setupMenuToggle();
        
        // Setup smooth scroll
        this.setupSmoothScroll();
        
        // Setup modal close on ESC
        this.setupEscapeKey();
        
        console.log('✅ Apostando Bem - Pronto!');
        console.log('📊 XP Atual:', Storage.getXP());
        console.log('🏆 Nível Atual:', Storage.getLevel());
    },

    // Update user info in header
    updateUserInfo() {
        const xpElement = document.getElementById('userXP');
        const levelElement = document.getElementById('userLevel');
        
        if (xpElement) {
            const xp = Storage.getXP();
            xpElement.textContent = xp;
            console.log('✅ XP atualizado no header:', xp);
        }
        
        if (levelElement) {
            const level = Storage.getLevel();
            levelElement.textContent = level;
            console.log('✅ Nível atualizado no header:', level);
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

    // Show notification (opcional - para feedback visual)
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

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