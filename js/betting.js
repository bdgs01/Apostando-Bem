// betting.js - Sistema de apostas CORRIGIDO

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
            console.log('✅ ODS carregadas:', this.odsData.length);
        } catch (error) {
            console.error('❌ Erro ao carregar dados das ODS:', error);
        }
    },

    // Open betting modal
    openBettingModal(gameId) {
        const game = Games.getGame(gameId);
        if (!game) return;

        this.currentGame = game;
        this.selectedODS = null;
        this.selectedInstitution = null;
        this.betAmount = 50;

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
                <div class="betting-header">
                    <h2>🎯 Escolha sua causa</h2>
                    <p class="betting-subtitle">Aposte em ODS, não em times</p>
                </div>
                
                <div class="game-info-card">
                    <div class="game-info-content">
                        <span class="game-label">Jogo:</span>
                        <strong>${this.currentGame.homeTeam.name} vs ${this.currentGame.awayTeam.name}</strong>
                    </div>
                    <span class="game-competition-badge">${this.currentGame.competition}</span>
                </div>

                <div class="bet-type-selector">
                    <button class="bet-type-btn active" data-type="money">
                        <span class="bet-type-icon">💰</span>
                        <span class="bet-type-text">Doar Agora</span>
                        <span class="bet-type-xp">+50 XP</span>
                    </button>
                    <button class="bet-type-btn" data-type="link">
                        <span class="bet-type-icon">🔗</span>
                        <span class="bet-type-text">Compartilhar</span>
                        <span class="bet-type-xp">+20 XP</span>
                    </button>
                    <button class="bet-type-btn" data-type="card">
                        <span class="bet-type-icon">🎨</span>
                        <span class="bet-type-text">Card Social</span>
                        <span class="bet-type-xp">+30 XP</span>
                    </button>
                </div>

                <div class="bet-steps-container">
                    <!-- STEP 1: Select ODS -->
                    <div class="bet-step-section active" id="stepSelectODS">
                        <h3 class="step-title">1️⃣ Escolha um Objetivo de Desenvolvimento Sustentável (ODS)</h3>
                        <div class="ods-grid" id="odsGrid">
                            ${this.createODSGrid()}
                        </div>
                    </div>

                    <!-- STEP 2: ODS Details & Select Institution -->
                    <div class="bet-step-section" id="stepSelectInstitution" style="display:none;">
                        <button class="back-button" id="backToODS">← Voltar para ODS</button>
                        <div id="odsDetails"></div>
                        <h3 class="step-title">2️⃣ Escolha uma instituição para apoiar</h3>
                        <div class="institution-list" id="institutionList"></div>
                    </div>

                    <!-- STEP 3: Action based on bet type -->
                    <div class="bet-step-section" id="stepAction" style="display:none;">
                        <button class="back-button" id="backToInstitution">← Voltar para instituições</button>
                        
                        <!-- Money Bet Content -->
                        <div class="bet-action-content" id="contentMoney">
                            <h3 class="step-title">3️⃣ Escolha o valor da doação</h3>
                            <div class="amount-selector">
                                <div class="amount-display-large">
                                    R$ <span id="amountValue">50</span>
                                </div>
                                <input type="range" min="10" max="1000" value="50" step="10" class="amount-slider" id="amountSlider">
                                <div class="slider-range-labels">
                                    <span>R$ 10</span>
                                    <span>R$ 1.000</span>
                                </div>
                            </div>
                            <div class="impact-card" id="impactCard">
                                <div class="impact-icon">💚</div>
                                <h4>Impacto Estimado</h4>
                                <p id="impactText">Ajuste o valor para ver o impacto</p>
                            </div>
                            <button class="btn-confirm-bet" id="confirmMoneyBet">
                                Confirmar Doação (+50 XP)
                            </button>
                        </div>

                        <!-- Link Bet Content -->
                        <div class="bet-action-content" id="contentLink" style="display:none;">
                            <h3 class="step-title">3️⃣ Gerar link de compartilhamento</h3>
                            <div class="share-link-section">
                                <p class="share-description">Compartilhe esta causa com seus amigos e ganhe XP!</p>
                                <button class="btn-generate" id="generateLinkBtn">
                                    🔗 Gerar Link Único
                                </button>
                                <div class="generated-link-container" id="linkContainer" style="display:none;">
                                    <input type="text" class="link-input" id="generatedLink" readonly>
                                    <button class="btn-copy" id="copyLinkBtn">Copiar</button>
                                </div>
                            </div>
                        </div>

                        <!-- Card Bet Content -->
                        <div class="bet-action-content" id="contentCard" style="display:none;">
                            <h3 class="step-title">3️⃣ Gerar card para redes sociais</h3>
                            <div class="card-generator-section">
                                <p class="share-description">Crie um card visual para compartilhar nas redes sociais!</p>
                                <button class="btn-generate" id="generateCardBtn">
                                    🎨 Gerar Card Social
                                </button>
                                <div class="card-preview-container" id="cardPreview" style="display:none;">
                                    <canvas id="socialCardCanvas" width="1080" height="1080"></canvas>
                                    <div class="card-share-buttons">
                                        <button class="btn-download" id="downloadCardBtn">📥 Baixar Imagem</button>
                                        <div class="social-share-group">
                                            <button class="btn-share-social whatsapp" id="shareWhatsApp">
                                                📱 WhatsApp
                                            </button>
                                            <button class="btn-share-social twitter" id="shareTwitter">
                                                🐦 Twitter
                                            </button>
                                            <button class="btn-share-social facebook" id="shareFacebook">
                                                📘 Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Create ODS grid with images
    createODSGrid() {
        if (!this.odsData || this.odsData.length === 0) {
            return '<p class="loading-message">Carregando Objetivos de Desenvolvimento Sustentável...</p>';
        }

        return this.odsData.map(ods => `
            <div class="ods-card-selectable" data-ods-id="${ods.id}" style="border-color: ${ods.cor}33;">
                <div class="ods-image-container">
                    <img src="${ods.icone}" alt="${ods.nome}" class="ods-image" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="ods-fallback" style="background-color: ${ods.cor}; display:none;">
                        <span>${ods.id}</span>
                    </div>
                </div>
                <div class="ods-card-content">
                    <h4 class="ods-card-title">${ods.nome}</h4>
                    <p class="ods-card-description">${ods.descricao}</p>
                </div>
            </div>
        `).join('');
    },

    // Setup all event listeners
    setupBettingListeners() {
        // Close modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());

        // Click outside modal to close
        document.getElementById('bettingModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'bettingModal') {
                this.closeModal();
            }
        });

        // Bet type selector
        document.querySelectorAll('.bet-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                document.querySelectorAll('.bet-type-btn').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.currentBetType = button.dataset.type;
                this.updateActionContent();
            });
        });

        // ODS selection
        document.querySelectorAll('.ods-card-selectable').forEach(card => {
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

        // Back buttons
        document.getElementById('backToODS')?.addEventListener('click', () => this.goToStep('stepSelectODS'));
        document.getElementById('backToInstitution')?.addEventListener('click', () => this.goToStep('stepSelectInstitution'));

        // Action buttons
        document.getElementById('confirmMoneyBet')?.addEventListener('click', () => this.confirmMoneyBet());
        document.getElementById('generateLinkBtn')?.addEventListener('click', () => this.generateShareLink());
        document.getElementById('copyLinkBtn')?.addEventListener('click', () => this.copyLink());
        document.getElementById('generateCardBtn')?.addEventListener('click', () => this.generateSocialCard());
        document.getElementById('downloadCardBtn')?.addEventListener('click', () => this.downloadCard());
        document.getElementById('shareWhatsApp')?.addEventListener('click', () => this.shareOnPlatform('whatsapp'));
        document.getElementById('shareTwitter')?.addEventListener('click', () => this.shareOnPlatform('twitter'));
        document.getElementById('shareFacebook')?.addEventListener('click', () => this.shareOnPlatform('facebook'));
    },

    // Select ODS
    selectODS(odsId) {
        this.selectedODS = this.odsData.find(ods => ods.id === odsId);
        if (!this.selectedODS) return;

        console.log('✅ ODS selecionada:', this.selectedODS.nome);

        // Update UI - highlight selected
        document.querySelectorAll('.ods-card-selectable').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-ods-id="${odsId}"]`)?.classList.add('selected');

        // Show ODS details
        document.getElementById('odsDetails').innerHTML = `
            <div class="ods-details-card" style="border-left: 4px solid ${this.selectedODS.cor};">
                <div class="ods-details-header">
                    <img src="${this.selectedODS.icone}" alt="${this.selectedODS.nome}" class="ods-details-image">
                    <div>
                        <h3 style="color: ${this.selectedODS.cor};">${this.selectedODS.nome}</h3>
                        <p class="ods-details-description">${this.selectedODS.descricaoCompleta}</p>
                        <a href="${this.selectedODS.link}" target="_blank" class="ods-learn-more">Saiba mais sobre esta ODS →</a>
                    </div>
                </div>
            </div>
        `;

        // Show institutions
        this.showInstitutions();

        // Move to next step
        this.goToStep('stepSelectInstitution');
    },

    // Show institutions
    showInstitutions() {
        const institutionList = document.getElementById('institutionList');
        if (!institutionList || !this.selectedODS) return;

        institutionList.innerHTML = this.selectedODS.instituicoes.map(inst => `
            <div class="institution-item" data-inst-name="${inst.nome}">
                <div class="institution-info">
                    <h4>${inst.nome}</h4>
                    <a href="${inst.link}" target="_blank" class="institution-website" onclick="event.stopPropagation();">
                        ${inst.link} ↗
                    </a>
                </div>
                <div class="institution-select-icon">→</div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.institution-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectInstitution(item.dataset.instName);
            });
        });
    },

    // Select institution
    selectInstitution(instName) {
        this.selectedInstitution = this.selectedODS.instituicoes.find(i => i.nome === instName);
        if (!this.selectedInstitution) return;

        console.log('✅ Instituição selecionada:', this.selectedInstitution.nome);

        // Update UI
        document.querySelectorAll('.institution-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-inst-name="${instName}"]`)?.classList.add('selected');

        // Move to action step
        setTimeout(() => {
            this.goToStep('stepAction');
            this.updateImpactDisplay();
        }, 300);
    },

    // Go to specific step
    goToStep(stepId) {
        document.querySelectorAll('.bet-step-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.style.display = 'block';
            targetStep.classList.add('active');
        }
    },

    // Update action content based on bet type
    updateActionContent() {
        document.querySelectorAll('.bet-action-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`content${this.currentBetType.charAt(0).toUpperCase() + this.currentBetType.slice(1)}`)?.style.display = 'block';
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
        if (!this.selectedODS || !this.selectedInstitution) {
            alert('Por favor, selecione uma ODS e uma instituição');
            return;
        }

        // Save bet
        const bet = {
            type: 'money',
            gameId: this.currentGame.id,
            game: `${this.currentGame.homeTeam.name} vs ${this.currentGame.awayTeam.name}`,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            institutionLink: this.selectedInstitution.link,
            amount: this.betAmount,
            xpEarned: 50,
            timestamp: new Date().toISOString()
        };

        Storage.addBet(bet);
        const newXP = Storage.addXP(50);
        
        console.log('✅ Aposta registrada:', bet);
        console.log('✅ XP atualizado:', newXP);

        // Show success and redirect
        this.showSuccess(50, () => {
            window.open(this.selectedInstitution.link, '_blank');
            setTimeout(() => {
                this.closeModal();
                App.updateUserInfo();
            }, 1000);
        });
    },

    // Generate share link
    generateShareLink() {
        if (!this.selectedODS || !this.selectedInstitution) {
            alert('Por favor, selecione uma ODS e uma instituição');
            return;
        }

        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const shareLink = `https://apostandobem.com/causa/${this.selectedODS.id}/${uniqueId}`;

        document.getElementById('generatedLink').value = shareLink;
        document.getElementById('linkContainer').style.display = 'flex';

        // Save bet
        const bet = {
            type: 'link',
            gameId: this.currentGame.id,
            game: `${this.currentGame.homeTeam.name} vs ${this.currentGame.awayTeam.name}`,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            shareLink: shareLink,
            xpEarned: 20,
            timestamp: new Date().toISOString()
        };

        Storage.addBet(bet);
        const newXP = Storage.addXP(20);
        
        console.log('✅ Link gerado e aposta registrada:', bet);
        console.log('✅ XP atualizado:', newXP);

        this.showSuccess(20);
    },

    // Copy link to clipboard
    copyLink() {
        const linkInput = document.getElementById('generatedLink');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999); // For mobile
        
        try {
            document.execCommand('copy');
            const btn = document.getElementById('copyLinkBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copiado!';
            btn.style.background = '#00ff88';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
    },

    // Generate social card
    async generateSocialCard() {
        if (!this.selectedODS || !this.selectedInstitution) {
            alert('Por favor, selecione uma ODS e uma instituição');
            return;
        }

        const canvas = document.getElementById('socialCardCanvas');
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background with ODS color
        ctx.fillStyle = this.selectedODS.cor;
        ctx.fillRect(0, 0, 1080, 1080);

        // White content area
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(60, 60, 960, 960);

        // Load and draw ODS icon
        const odsIcon = new Image();
        odsIcon.crossOrigin = 'anonymous';
        odsIcon.src = this.selectedODS.icone;
        
        await new Promise((resolve) => {
            odsIcon.onload = () => {
                ctx.drawImage(odsIcon, 390, 150, 300, 300);
                resolve();
            };
            odsIcon.onerror = () => {
                console.log('Erro ao carregar imagem, usando fallback');
                resolve();
            };
        });

        // Brand name
        ctx.fillStyle = this.selectedODS.cor;
        ctx.font = 'bold 60px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('APOSTANDO BEM', 540, 550);

        // ODS name (multiline)
        ctx.fillStyle = '#0A0E17';
        ctx.font = 'bold 48px Inter, Arial, sans-serif';
        const words = this.selectedODS.nome.split(' ');
        let line = '';
        let y = 650;
        
        words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 800 && line !== '') {
                ctx.fillText(line.trim(), 540, y);
                line = word + ' ';
                y += 60;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line.trim(), 540, y);

        // Institution
        ctx.fillStyle = '#6b7280';
        ctx.font = '32px Inter, Arial, sans-serif';
        ctx.fillText(`Apoiando: ${this.selectedInstitution.nome}`, 540, y + 100);

        // Call to action
        ctx.fillStyle = this.selectedODS.cor;
        ctx.font = 'bold 40px Inter, Arial, sans-serif';
        ctx.fillText('Apostei em ODS, não em BET', 540, 900);

        // Show canvas and buttons
        document.getElementById('cardPreview').style.display = 'block';
        canvas.style.display = 'block';

        // Save bet
        const bet = {
            type: 'card',
            gameId: this.currentGame.id,
            game: `${this.currentGame.homeTeam.name} vs ${this.currentGame.awayTeam.name}`,
            odsId: this.selectedODS.id,
            odsName: this.selectedODS.nome,
            institution: this.selectedInstitution.nome,
            xpEarned: 30,
            timestamp: new Date().toISOString()
        };

        Storage.addBet(bet);
        const newXP = Storage.addXP(30);
        
        console.log('✅ Card gerado e aposta registrada:', bet);
        console.log('✅ XP atualizado:', newXP);

        this.showSuccess(30);
    },

    // Download card
    downloadCard() {
        const canvas = document.getElementById('socialCardCanvas');
        const link = document.createElement('a');
        link.download = `apostando-bem-${this.selectedODS.nome.toLowerCase().replace(/ /g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    },

    // Share on social platforms
    shareOnPlatform(platform) {
        const text = `Acabei de apostar em "${this.selectedODS.nome}" no Apostando Bem! 💚

Apostei em ODS, não em BET.

`;
        const url = this.selectedInstitution.link;

        switch(platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
                break;
        }
    },

    // Show success message
    showSuccess(xp, callback) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="success-animation">
                <div class="success-checkmark">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>
                <h2 class="success-title">Aposta Confirmada!</h2>
                <p class="success-message">Você acabou de apostar em:</p>
                <h3 class="success-ods">${this.selectedODS.nome}</h3>
                <p class="success-institution">através de <strong>${this.selectedInstitution.nome}</strong></p>
                <div class="xp-badge-large">+${xp} XP</div>
                <p class="success-encouragement">Continue apostando no bem! 💚</p>
                <button class="btn-success-close" onclick="location.reload()">Fazer Outra Aposta</button>
            </div>
        `;

        App.updateUserInfo();
        
        if (callback) {
            setTimeout(callback, 1500);
        }
    }
};