// app.js - Main application controller

const App = {
    // Initialize app
    async init() {
        console.log('🚀 Apostando Bem - Iniciando...');
        
        // Load ODS data
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
        
        console.log('✅ Apostando Bem - Pronto!');
    },

    // Update user info in header
    updateUserInfo() {
        const xpElement = document.getElementById('userXP');
        const levelElement = document.getElementById('userLevel');
        
        if (xpElement) {
            xpElement.textContent = Storage.getXP();
        }
        
        if (levelElement) {
            levelElement.textContent = Storage.getLevel();
        }
        
        // Update ranking
        Storage.updateRanking();
    },

    // Setup menu toggle for mobile
    setupMenuToggle() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('mainNav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
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
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Close mobile menu if open
                    const nav = document.getElementById('mainNav');
                    if (nav) nav.classList.remove('active');
                }
            });
        });
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
