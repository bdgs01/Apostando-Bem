// games.js - Gerenciamento de jogos - CORRIGIDO

const Games = {
    currentGames: [
        {
            id: 1,
            homeTeam: { name: 'Flamengo', logo: '🔴⚫' },
            awayTeam: { name: 'Palmeiras', logo: '🟢⚪' },
            date: '2025-11-17',
            time: '16:00',
            competition: 'Brasileirão Série A',
            isLive: false,
            apostas: 0,
            impacto: 0
        },
        {
            id: 2,
            homeTeam: { name: 'Corinthians', logo: '⚫⚪' },
            awayTeam: { name: 'São Paulo', logo: '🔴⚪⚫' },
            date: '2025-11-17',
            time: '18:30',
            competition: 'Brasileirão Série A',
            isLive: true,
            apostas: 127,
            impacto: 8450
        },
        {
            id: 3,
            homeTeam: { name: 'Internacional', logo: '🔴⚪' },
            awayTeam: { name: 'Grêmio', logo: '🔵⚫⚪' },
            date: '2025-11-18',
            time: '20:00',
            competition: 'Brasileirão Série A',
            isLive: false,
            apostas: 89,
            impacto: 5670
        },
        {
            id: 4,
            homeTeam: { name: 'Atlético-MG', logo: '⚫⚪' },
            awayTeam: { name: 'Cruzeiro', logo: '🔵⚪' },
            date: '2025-11-18',
            time: '19:00',
            competition: 'Brasileirão Série A',
            isLive: false,
            apostas: 64,
            impacto: 4120
        },
        {
            id: 5,
            homeTeam: { name: 'Santos', logo: '⚪⚫' },
            awayTeam: { name: 'Botafogo', logo: '⚫⚪' },
            date: '2025-11-19',
            time: '21:00',
            competition: 'Brasileirão Série A',
            isLive: false,
            apostas: 52,
            impacto: 3280
        },
        {
            id: 6,
            homeTeam: { name: 'Fluminense', logo: '🟢🔴⚪' },
            awayTeam: { name: 'Vasco', logo: '⚫⚪' },
            date: '2025-11-19',
            time: '19:30',
            competition: 'Brasileirão Série A',
            isLive: false,
            apostas: 41,
            impacto: 2590
        }
    ],

    // Load games into the page
    loadGames() {
        const gamesGrid = document.getElementById('gamesGrid');
        
        if (!gamesGrid) {
            console.error('❌ Elemento gamesGrid não encontrado no DOM');
            return;
        }

        console.log('✅ Carregando jogos...', this.currentGames.length, 'jogos disponíveis');

        // Clear existing content
        gamesGrid.innerHTML = '';

        // Add games
        this.currentGames.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.innerHTML += gameCard;
        });

        console.log('✅ Jogos carregados com sucesso!');

        // Setup event listeners AFTER adding to DOM
        this.setupGameListeners();
    },

    // Setup event listeners for game cards
    setupGameListeners() {
        // Game card clicks
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the bet button
                if (!e.target.classList.contains('bet-button') && 
                    !e.target.closest('.bet-button')) {
                    const gameId = parseInt(card.dataset.gameId);
                    this.showGameDetails(gameId);
                }
            });
        });

        // Bet button clicks
        document.querySelectorAll('.bet-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = parseInt(e.target.closest('.game-card').dataset.gameId);
                console.log('🎯 Abrindo modal de aposta para jogo:', gameId);
                Betting.openBettingModal(gameId);
            });
        });

        console.log('✅ Event listeners configurados');
    },

    // Create game card HTML
    createGameCard(game) {
        const gameDate = new Date(game.date + 'T' + game.time);
        const formattedDate = gameDate.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
        });
        const formattedTime = game.time;

        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-header">
                    <span class="game-date">${formattedDate} • ${formattedTime}</span>
                    ${game.isLive ? '<span class="game-live">• AO VIVO</span>' : ''}
                </div>
                
                <div class="game-teams">
                    <div class="team">
                        <div class="team-logo">${game.homeTeam.logo}</div>
                        <div class="team-name">${game.homeTeam.name}</div>
                    </div>
                    
                    <div class="vs">VS</div>
                    
                    <div class="team">
                        <div class="team-logo">${game.awayTeam.logo}</div>
                        <div class="team-name">${game.awayTeam.name}</div>
                    </div>
                </div>

                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">Apostas</span>
                        <span class="stat-value">${game.apostas}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Impacto</span>
                        <span class="stat-value">R$ ${game.impacto}</span>
                    </div>
                </div>

                <button class="bet-button">Apostar Agora</button>
            </div>
        `;
    },

    // Show game details
    showGameDetails(gameId) {
        const game = this.currentGames.find(g => g.id === gameId);
        if (!game) return;

        console.log('📊 Detalhes do jogo:', game);
        // For now, just open betting modal
        Betting.openBettingModal(gameId);
    },

    // Get game by ID
    getGame(gameId) {
        return this.currentGames.find(g => g.id === gameId);
    },

    // Update game stats (pode ser usado depois para atualizar em tempo real)
    updateGameStats(gameId, apostas, impacto) {
        const game = this.currentGames.find(g => g.id === gameId);
        if (game) {
            game.apostas = apostas;
            game.impacto = impacto;
            // Recarregar apenas este card
            this.loadGames();
        }
    }
};