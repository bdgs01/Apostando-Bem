// games.js - VERSÃO DEFINITIVA E FUNCIONAL

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

    loadGames() {
        console.log('🎮 Games.loadGames() chamado');
        
        const gamesGrid = document.getElementById('gamesGrid');
        
        console.log('📍 Procurando elemento gamesGrid...');
        console.log('📍 Elemento encontrado:', gamesGrid);
        
        if (!gamesGrid) {
            console.error('❌ ERRO: Elemento gamesGrid não encontrado!');
            return;
        }

        console.log('✅ Elemento gamesGrid encontrado!');
        console.log('📊 Total de jogos:', this.currentGames.length);

        let gamesHTML = '';
        
        this.currentGames.forEach((game, index) => {
            console.log(`🎯 Criando card do jogo ${index + 1}:`, game.homeTeam.name, 'vs', game.awayTeam.name);
            gamesHTML += this.createGameCard(game);
        });

        console.log('📝 Inserindo HTML no DOM...');
        gamesGrid.innerHTML = gamesHTML;
        console.log('✅ HTML inserido com sucesso!');
        
        const cardsCount = gamesGrid.querySelectorAll('.game-card').length;
        console.log('✅ Cards no DOM:', cardsCount);

        console.log('🎧 Configurando event listeners...');
        this.setupGameListeners();
        console.log('✅ Event listeners configurados!');
    },

    setupGameListeners() {
        const gameCards = document.querySelectorAll('.game-card');
        console.log('🎴 Total de cards encontrados:', gameCards.length);

        gameCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('bet-button') && 
                    !e.target.closest('.bet-button')) {
                    const gameId = parseInt(card.dataset.gameId);
                    console.log('🎯 Card clicado, jogo ID:', gameId);
                    this.showGameDetails(gameId);
                }
            });
        });

        const betButtons = document.querySelectorAll('.bet-button');
        console.log('🎲 Total de botões de aposta:', betButtons.length);

        betButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.game-card');
                const gameId = parseInt(card.dataset.gameId);
                console.log('🎰 Botão de aposta clicado, jogo ID:', gameId);
                
                if (typeof Betting !== 'undefined' && Betting.openBettingModal) {
                    Betting.openBettingModal(gameId);
                } else {
                    console.error('❌ Betting não está disponível');
                }
            });
        });
    },

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

    showGameDetails(gameId) {
        const game = this.getGame(gameId);
        if (!game) {
            console.error('❌ Jogo não encontrado:', gameId);
            return;
        }

        console.log('📊 Mostrando detalhes do jogo:', game);
        
        if (typeof Betting !== 'undefined' && Betting.openBettingModal) {
            Betting.openBettingModal(gameId);
        } else {
            console.error('❌ Betting não está disponível');
        }
    },

    getGame(gameId) {
        return this.currentGames.find(g => g.id === gameId);
    }
};

console.log('✅ games.js carregado');
console.log('✅ Games object:', Games);
console.log('✅ Total de jogos configurados:', Games.currentGames.length);