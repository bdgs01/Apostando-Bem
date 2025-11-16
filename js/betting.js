// betting.js - Sistema de apostas

const Betting = {
    currentGame: null,
    selectedODS: null,
    selectedInstitution: null,
    currentBetType: 'money',
    betAmount: 50,
    odsData: null,

    // Initialize
    async init() {
        await this.loadODSData();
    },

    // Load ODS data from JSON
    async loadODSData() {
        try {
            const response = await fetch('data/ods-data.json');
            const data = await response.json();
            this.odsData = data.ods;
        } catch (error) {
            console.error('Erro ao carregar dados das ODS:', error);
        }
    },

    // Open betting modal
    openBettingModal(gameId) {
        const game = Games.getGame(gameId);
        if (!game) return;

        this.currentGame = game;
        this.selectedODS = null;
        this.selectedInstitution = null;

        const modal = document.getElementById('bettingModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = this.createBettingInterface();
        modal.classList.add('active');

        // Setup event listeners
        this.setupBettingListeners();
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('bettingModal');
        modal.classList.remove('active');
    },

    // Create betting interface
    createBettingInterface() {
        return `
            <div class="betting-interface">
                <h2>Aposte no Bem</h2>
                <div class="game-info">
                    <p><strong>${this.currentGame.homeTeam.name}</strong> vs <strong>${this.currentGame.awayTeam.name}</strong></p>
                    <p class="game-competition">${this.currentGame.competition}</p>
                </div>

                <div class="bet-type-tabs">
                    <button class="bet-type-tab active" data-type="money">💰 Doação Real</button>
                    <button class="bet-type-tab" data-type="link">🔗 Compartilhar Link</button>
                    <button class="bet-type-tab" data-type="card">🎨 Card Social</button>
                </div>

                <div class="bet-steps">
                    <div class="bet-step active" id="step-ods">
                        <h3>Escolha uma ODS</h3>
                        <div class="ods-grid">
                            ${this.createODSGrid()}
                        </div>
                    </div>

                    <div class="bet-step" id="step-institution">
                        <h3>Escolha uma Instituição</h3>
                        <div class="institution-grid" id="institutionGrid">
                            <!-- Will be filled after ODS selection -->
                        </div>
                    </div>

                    <div class="bet-step" id="step-action">
                        <div class="bet-type-content active" id="content-money">
                            ${this.createMoneyBetContent()}
                        </div>
                        <div class="bet-type-content" id="content-link">
                            ${this.createLinkBetContent()}
                        </div>
                        <div class="bet-type-content" id="content-card">
                            ${this.createCardBetContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Create ODS grid
    createODSGrid() {
        if (!this.odsData) return '<p>Carregando ODS...</p>';

        return this.odsData.map(ods => `
            <div class="ods-card" data-ods-id="${ods.id}">
                <img src="${ods.icone}" alt="${ods.nome}" class="ods-icon">
                <div class="ods-name">${ods.nome}</div>
            </div>
        `).join('');
    },

    // Create money bet content
    createMoneyBetContent() {
        return `
            <div class="amount-slider">
                <h4>Escolha o valor da doação</h4>
                <div class="amount-display">R$ <span id="amountValue">50</span></div>
                <input type="range" min="10" max="1000" value="50" step="10" class="slider" id="amountSlider">
                <div class="slider-labels">
                    <span>R$ 10</span>
                    <span>R$ 1000</span>
                </div>
            </div>
            <div class="impact-display" id="impactDisplay">
                <h4>💚 Impacto Estimado</h4>
                <p id="impactText">Selecione uma ODS para ver o impacto</p>
            </div>
            <button class="btn-primary" id="confirmMoneyBet" disabled>Confirmar e Doar</button>
        `;
    },

    // Create link bet content
    createLinkBetContent() {
        return `
            <div class="link-generator">
                <h4>Compartilhe e ganhe 20 XP</h4>
                <p>Gere um link único e compartilhe com seus amigos para divulgar a causa.</p>
                <button class="btn-primary" id="generateLink" disabled>Gerar Link de Compartilhamento</button>
                <div class="generated-link" id="generatedLinkDiv" style="display:none;">
                    <input type="text" id="generatedLinkInput" readonly>
                    <button class="copy-btn" id="copyLinkBtn">Copiar</button>
                </div>
            </div>
        `;
    },

    // Create card bet content
    createCardBetContent() {
        return `
            <div class="share-card-preview">
                <h4>Gere um card visual e compartilhe</h4>
                <p>Ganhe 30 XP ao compartilhar em suas redes sociais.</p>
                <canvas id="socialCard" width="600" height="600" style="display:none;"></canvas>
                <button class="btn-primary" id="generateCard" disabled>Gerar Card Social</button>
                <div class="share-buttons" id="shareButtons" style="display:none;">
                    <button class="share-btn whatsapp">📱 WhatsApp</button>
                    <button class="share-btn twitter">🐦 Twitter</button>
                    <button class="share-btn facebook">📘 Facebook</button>
                    <button class="share-btn instagram">📸 Instagram</button>
                </div>
            </div>
        `;
    },

    // Setup betting listeners
    setupBettingListeners() {
        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());

        // Bet type tabs
        document.querySelectorAll('.bet-type-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.bet-type-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentBetType = e.target.dataset.type;
                
                document.querySelectorAll('.bet-type-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`content-${this.currentBetType}`).classList.add('active');
                
                this.updateActionButtons();
            });
        });

        // ODS selection
        document.querySelectorAll('.ods-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const odsId = parseInt(e.currentTarget.dataset.odsId);
                this.selectODS(odsId);
            });
        });

        // Amount slider
        const slider = document.getElementById('amountSlider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.betAmount = parseInt(e.target.value);
                document.getElementById('amountValue').textContent = this.betAmount;
                this.updateImpactDisplay();
            });
        }

        // Confirm money bet
        const confirmBtn = document.getElementById('confirmMoneyBet');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmMoneyBet());
        }

        // Generate link
        const generateLinkBtn = document.getElementById('generateLink');
        if (generateLinkBtn) {
            generateLinkBtn.addEventListener('click', () => this.generateShareLink());
        }

        // Copy link
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyLink());
        }

        // Generate card
        const generateCardBtn = document.getElementById('generateCard');
        if (generateCardBtn) {
            generateCardBtn.addEventListener('click', () => this.generateSocialCard());
        }
    },

    // Select ODS
    selectODS(odsId) {
        this.selectedODS = this.odsData.find(ods => ods.id === odsId);
        
        // Update UI
        document.querySelectorAll('.ods-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-ods-id="${odsId}"]`).classList.add('selected');

        // Show institutions
        this.showInstitutions();
        
        // Update impact display
        this.updateImpactDisplay();

        // Move to next step
        document.getElementById('step-ods').classList.remove('active');
        document.getElementById('step-institution').classList.add('active');
    },

    // Show institutions for selected ODS
    showInstitutions() {
        if (!this.selectedODS) return;

        const grid = document.getElementById('institutionGrid');
        grid.innerHTML = this.selectedODS.instituicoes.map(inst => `
            <div class="institution-card" data-inst-name="${inst.nome}">
                <div class="institution-info">
                    <h4>${inst.nome}</h4>
                    <a href="${inst.link}" target="_blank" class="institution-link">${inst.link}</a>
                </div>
                <div class="institution-select">→</div>
            </div>
        `).join('');

        // Add listeners
        document.querySelectorAll('.institution-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectInstitution(e.currentTarget.dataset.instName);
            });
        });
    },

    // Select institution
    selectInstitution(instName) {
        this.selectedInstitution = this.selectedODS.instituicoes.find(i => i.nome === instName);
        
        // Update UI
        document.querySelectorAll('.institution-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-inst-name="${instName}"]`).classList.add('selected');

        // Move to action step
        document.getElementById('step-institution').classList.remove('active');
        document.getElementById('step-action').classList.add('active');

        // Enable action buttons
        this.updateActionButtons();
    },

    // Update action buttons
    updateActionButtons() {
        const confirmMoneyBtn = document.getElementById('confirmMoneyBet');
        const generateLinkBtn = document.getElementById('generateLink');
        const generateCardBtn = document.getElementById('generateCard');

        if (this.selectedODS && this.selectedInstitution) {
            if (confirmMoneyBtn) confirmMoneyBtn.disabled = false;
            if (generateLinkBtn) generateLinkBtn.disabled = false;
            if (generateCardBtn) generateCardBtn.disabled = false;
        }
    },

    // Update impact display
    updateImpactDisplay() {
        if (!this.selectedODS) return;

        const impactText = document.getElementById('impactText');
        if (!impactText) return;

        const impacts = this.selectedODS.impacto;
        let message = '';

        if (this.betAmount >= 500) {
            message = impacts['500'];
        } else if (this.betAmount >= 100) {
            message = impacts['100'];
        } else {
            message = impacts['50'];
        }

        impactText.textContent = message;
    },

    // Confirm money bet
    confirmMoneyBet() {
        // Register bet
        const bet = {
            type: 'money',
            gameId: this.currentGame.id,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            amount: this.betAmount,
            xpEarned: 50
        };

        Storage.addBet(bet);
        Storage.addXP(50);

        // Redirect to institution
        window.open(this.selectedInstitution.link, '_blank');

        // Show confirmation
        this.showConfirmation(50);
    },

    // Generate share link
    generateShareLink() {
        const uniqueId = Date.now().toString(36);
        const link = `https://apostandobem.com/causa/${this.selectedODS.id}/${uniqueId}`;

        document.getElementById('generatedLinkInput').value = link;
        document.getElementById('generatedLinkDiv').style.display = 'flex';

        // Register bet
        const bet = {
            type: 'link',
            gameId: this.currentGame.id,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            xpEarned: 20
        };

        Storage.addBet(bet);
        Storage.addXP(20);

        this.showConfirmation(20);
    },

    // Copy link
    copyLink() {
        const input = document.getElementById('generatedLinkInput');
        input.select();
        document.execCommand('copy');
        
        const btn = document.getElementById('copyLinkBtn');
        btn.textContent = '✓ Copiado!';
        setTimeout(() => {
            btn.textContent = 'Copiar';
        }, 2000);
    },

    // Generate social card
    generateSocialCard() {
        const canvas = document.getElementById('socialCard');
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = this.selectedODS.cor;
        ctx.fillRect(0, 0, 600, 600);

        // White overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(40, 40, 520, 520);

        // Title
        ctx.fillStyle = this.selectedODS.cor;
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('APOSTANDO BEM', 300, 100);

        // ODS name
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = '#000';
        const words = this.selectedODS.nome.split(' ');
        let line = '';
        let y = 180;
        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 450 && line !== '') {
                ctx.fillText(line, 300, y);
                line = word + ' ';
                y += 40;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, 300, y);

        // Institution
        ctx.font = '20px Inter, sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText(`Apoiando: ${this.selectedInstitution.nome}`, 300, 400);

        // Bottom text
        ctx.fillStyle = this.selectedODS.cor;
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText('Aposte no que realmente importa', 300, 500);

        // Show canvas
        canvas.style.display = 'block';
        document.getElementById('shareButtons').style.display = 'flex';

        // Register bet
        const bet = {
            type: 'card',
            gameId: this.currentGame.id,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            xpEarned: 30
        };

        Storage.addBet(bet);
        Storage.addXP(30);

        // Setup share buttons
        this.setupShareButtons(canvas);
    },

    // Setup share buttons
    setupShareButtons(canvas) {
        const shareButtons = document.querySelectorAll('#shareButtons .share-btn');
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            
            shareButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const text = `Acabei de apostar em ${this.selectedODS.nome} no Apostando Bem! 💚`;
                    
                    if (btn.classList.contains('whatsapp')) {
                        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + this.selectedInstitution.link)}`);
                    } else if (btn.classList.contains('twitter')) {
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.selectedInstitution.link)}`);
                    } else if (btn.classList.contains('facebook')) {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.selectedInstitution.link)}`);
                    } else if (btn.classList.contains('instagram')) {
                        // Instagram doesn't support direct sharing, download image
                        const link = document.createElement('a');
                        link.download = 'apostando-bem-card.png';
                        link.href = url;
                        link.click();
                    }
                    
                    this.showConfirmation(30);
                });
            });
        });
    },

    // Show confirmation
    showConfirmation(xp) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="bet-confirmation">
                <div class="confirmation-icon">✅</div>
                <h2 class="confirmation-title">Aposta Confirmada!</h2>
                <p>Você acabou de fazer a diferença apoiando:</p>
                <h3>${this.selectedODS.nome}</h3>
                <p>através de <strong>${this.selectedInstitution.nome}</strong></p>
                <div class="xp-earned">+${xp} XP</div>
                <button class="btn-primary" onclick="location.reload()">Voltar aos Jogos</button>
            </div>
        `;

        // Update header XP
        App.updateUserInfo();
    }
};
