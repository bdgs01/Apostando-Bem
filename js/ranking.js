// ranking.js - Sistema de rankings

const Ranking = {
    currentTab: 'geral',

    init() {
        console.log('🏆 Ranking.init() chamado');
        this.setupTabs();
        this.loadRanking('geral');
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const tabName = e.target.dataset.tab;
                this.loadRanking(tabName);
            });
        });
    },

    loadRanking(tabName) {
        this.currentTab = tabName;
        const content = document.getElementById('rankingContent');
        
        if (!content) {
            console.error('❌ rankingContent não encontrado');
            return;
        }
        
        switch(tabName) {
            case 'geral':
                content.innerHTML = this.createGeneralRanking();
                break;
            case 'semanal':
                content.innerHTML = this.createWeeklyRanking();
                break;
            case 'ods':
                content.innerHTML = this.createODSRanking();
                break;
            case 'impacto':
                content.innerHTML = this.createImpactRanking();
                break;
        }
    },

    createGeneralRanking() {
        const ranking = Storage.getRanking();
        
        return `
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Usuário</th>
                            <th>Nível</th>
                            <th>XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map((user, index) => `
                            <tr ${user.name === 'Você' ? 'style="background: rgba(0,255,136,0.1);"' : ''}>
                                <td><span class="rank-position ${index < 3 ? 'top3' : ''}">${index + 1}</span></td>
                                <td><strong>${user.name}</strong></td>
                                <td><span class="level-badge">${user.level}</span></td>
                                <td>${user.xp}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    createWeeklyRanking() {
        const ranking = Storage.getRanking().map(user => ({
            ...user,
            weeklyXP: Math.floor(user.xp * 0.3)
        })).sort((a, b) => b.weeklyXP - a.weeklyXP);
        
        return `
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Usuário</th>
                            <th>XP Semanal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map((user, index) => `
                            <tr ${user.name === 'Você' ? 'style="background: rgba(0,255,136,0.1);"' : ''}>
                                <td><span class="rank-position ${index < 3 ? 'top3' : ''}">${index + 1}</span></td>
                                <td><strong>${user.name}</strong></td>
                                <td>${user.weeklyXP}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    createODSRanking() {
        const odsStats = [
            { id: 1, nome: 'Erradicação da Pobreza', apostas: 234, cor: '#E5243B' },
            { id: 3, nome: 'Saúde e Bem-Estar', apostas: 198, cor: '#4C9F38' },
            { id: 4, nome: 'Educação de Qualidade', apostas: 176, cor: '#C5192D' },
            { id: 13, nome: 'Ação Contra Mudança do Clima', apostas: 145, cor: '#3F7E44' },
            { id: 2, nome: 'Fome Zero', apostas: 132, cor: '#DDA63A' }
        ];

        return `
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ODS</th>
                            <th>Apostas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${odsStats.map((ods, index) => `
                            <tr>
                                <td><span class="rank-position ${index < 3 ? 'top3' : ''}">${index + 1}</span></td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="width: 12px; height: 12px; background: ${ods.cor}; border-radius: 3px;"></div>
                                        <strong>${ods.nome}</strong>
                                    </div>
                                </td>
                                <td>${ods.apostas}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    createImpactRanking() {
        const ranking = Storage.getRanking().sort((a, b) => b.impact - a.impact);
        
        return `
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Usuário</th>
                            <th>Impacto Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map((user, index) => `
                            <tr ${user.name === 'Você' ? 'style="background: rgba(0,255,136,0.1);"' : ''}>
                                <td><span class="rank-position ${index < 3 ? 'top3' : ''}">${index + 1}</span></td>
                                <td><strong>${user.name}</strong></td>
                                <td>R$ ${user.impact.toLocaleString('pt-BR')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
};

console.log('✅ ranking.js carregado');