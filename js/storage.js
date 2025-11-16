// storage.js - Gerenciamento de localStorage

const Storage = {
    KEYS: {
        USER_XP: 'apostandoBem_userXP',
        USER_LEVEL: 'apostandoBem_userLevel',
        USER_BETS: 'apostandoBem_userBets',
        RANKING: 'apostandoBem_ranking'
    },

    getXP() {
        return parseInt(localStorage.getItem(this.KEYS.USER_XP)) || 0;
    },

    setXP(xp) {
        localStorage.setItem(this.KEYS.USER_XP, xp);
        this.updateLevel(xp);
    },

    addXP(amount) {
        const currentXP = this.getXP();
        const newXP = currentXP + amount;
        this.setXP(newXP);
        return newXP;
    },

    getLevel() {
        return localStorage.getItem(this.KEYS.USER_LEVEL) || 'BRONZE';
    },

    updateLevel(xp) {
        let level = 'BRONZE';
        if (xp >= 3000) level = 'PLATINA';
        else if (xp >= 1501) level = 'OURO';
        else if (xp >= 501) level = 'PRATA';
        
        localStorage.setItem(this.KEYS.USER_LEVEL, level);
        return level;
    },

    getBets() {
        const bets = localStorage.getItem(this.KEYS.USER_BETS);
        return bets ? JSON.parse(bets) : [];
    },

    addBet(bet) {
        const bets = this.getBets();
        bet.id = Date.now();
        bet.timestamp = new Date().toISOString();
        bets.push(bet);
        localStorage.setItem(this.KEYS.USER_BETS, JSON.stringify(bets));
        return bet;
    },

    getRanking() {
        const ranking = localStorage.getItem(this.KEYS.RANKING);
        if (ranking) {
            return JSON.parse(ranking);
        }
        
        const fakeRanking = [
            { name: 'Você', xp: this.getXP(), level: this.getLevel(), impact: 0 },
            { name: 'Maria Silva', xp: 4500, level: 'PLATINA', impact: 15000 },
            { name: 'João Santos', xp: 3200, level: 'PLATINA', impact: 12000 },
            { name: 'Ana Costa', xp: 2800, level: 'OURO', impact: 9500 },
            { name: 'Carlos Lima', xp: 2100, level: 'OURO', impact: 7800 },
            { name: 'Juliana Souza', xp: 1800, level: 'OURO', impact: 6200 },
            { name: 'Pedro Oliveira', xp: 1200, level: 'PRATA', impact: 4500 },
            { name: 'Fernanda Dias', xp: 900, level: 'PRATA', impact: 3200 },
            { name: 'Ricardo Alves', xp: 650, level: 'PRATA', impact: 2100 },
            { name: 'Beatriz Rocha', xp: 400, level: 'BRONZE', impact: 1500 }
        ];
        
        localStorage.setItem(this.KEYS.RANKING, JSON.stringify(fakeRanking));
        return fakeRanking;
    },

    updateRanking() {
        const ranking = this.getRanking();
        const userIndex = ranking.findIndex(u => u.name === 'Você');
        
        if (userIndex !== -1) {
            ranking[userIndex].xp = this.getXP();
            ranking[userIndex].level = this.getLevel();
            ranking.sort((a, b) => b.xp - a.xp);
            localStorage.setItem(this.KEYS.RANKING, JSON.stringify(ranking));
        }
        
        return ranking;
    },

    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

console.log('✅ storage.js carregado');