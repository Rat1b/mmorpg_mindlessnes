// ========================================
// Battle Pass — Сезонный трек наград
// ========================================

const BATTLE_PASS_SEASON = {
    id: 'season_1',
    name: '🌸 Сезон Пробуждения',
    startDate: '2026-02-14',
    endDate: '2026-04-14',
    maxLevel: 30,
    xpPerLevel: 100, // XP на каждый уровень
    rewards: [
        // Каждый уровень: free + premium награда
        // level 1-30
        { level: 1, free: { type: 'coins', amount: 200, label: '🪙 200' }, premium: { type: 'coins', amount: 500, label: '🪙 500' } },
        { level: 2, free: { type: 'coins', amount: 250, label: '🪙 250' }, premium: { type: 'gems', amount: 5, label: '💎 5' } },
        { level: 3, free: { type: 'coins', amount: 300, label: '🪙 300' }, premium: { type: 'coins', amount: 600, label: '🪙 600' } },
        { level: 4, free: { type: 'gems', amount: 3, label: '💎 3' }, premium: { type: 'coins', amount: 800, label: '🪙 800' } },
        { level: 5, free: { type: 'coins', amount: 400, label: '🪙 400' }, premium: { type: 'title', id: 'awakened', label: '🏷️ Пробуждённый' } },
        { level: 6, free: { type: 'coins', amount: 300, label: '🪙 300' }, premium: { type: 'gems', amount: 10, label: '💎 10' } },
        { level: 7, free: { type: 'coins', amount: 350, label: '🪙 350' }, premium: { type: 'coins', amount: 700, label: '🪙 700' } },
        { level: 8, free: { type: 'gems', amount: 5, label: '💎 5' }, premium: { type: 'coins', amount: 900, label: '🪙 900' } },
        { level: 9, free: { type: 'coins', amount: 400, label: '🪙 400' }, premium: { type: 'gems', amount: 15, label: '💎 15' } },
        { level: 10, free: { type: 'coins', amount: 500, label: '🪙 500' }, premium: { type: 'aura', id: 'spring_glow', label: '✨ Аура Весны' } },
        { level: 11, free: { type: 'coins', amount: 350, label: '🪙 350' }, premium: { type: 'coins', amount: 800, label: '🪙 800' } },
        { level: 12, free: { type: 'coins', amount: 400, label: '🪙 400' }, premium: { type: 'gems', amount: 10, label: '💎 10' } },
        { level: 13, free: { type: 'gems', amount: 5, label: '💎 5' }, premium: { type: 'coins', amount: 1000, label: '🪙 1000' } },
        { level: 14, free: { type: 'coins', amount: 450, label: '🪙 450' }, premium: { type: 'coins', amount: 900, label: '🪙 900' } },
        { level: 15, free: { type: 'coins', amount: 600, label: '🪙 600' }, premium: { type: 'skin', id: 'lotus_robe', label: '👘 Одеяние Лотоса' } },
        { level: 16, free: { type: 'coins', amount: 400, label: '🪙 400' }, premium: { type: 'gems', amount: 15, label: '💎 15' } },
        { level: 17, free: { type: 'coins', amount: 450, label: '🪙 450' }, premium: { type: 'coins', amount: 1000, label: '🪙 1000' } },
        { level: 18, free: { type: 'gems', amount: 8, label: '💎 8' }, premium: { type: 'coins', amount: 1200, label: '🪙 1200' } },
        { level: 19, free: { type: 'coins', amount: 500, label: '🪙 500' }, premium: { type: 'gems', amount: 20, label: '💎 20' } },
        { level: 20, free: { type: 'coins', amount: 800, label: '🪙 800' }, premium: { type: 'companion', id: 'sakura_spirit', label: '🌸 Дух Сакуры' } },
        { level: 21, free: { type: 'coins', amount: 500, label: '🪙 500' }, premium: { type: 'coins', amount: 1000, label: '🪙 1000' } },
        { level: 22, free: { type: 'coins', amount: 550, label: '🪙 550' }, premium: { type: 'gems', amount: 15, label: '💎 15' } },
        { level: 23, free: { type: 'gems', amount: 10, label: '💎 10' }, premium: { type: 'coins', amount: 1500, label: '🪙 1500' } },
        { level: 24, free: { type: 'coins', amount: 600, label: '🪙 600' }, premium: { type: 'coins', amount: 1200, label: '🪙 1200' } },
        { level: 25, free: { type: 'coins', amount: 1000, label: '🪙 1000' }, premium: { type: 'title', id: 'season_warrior', label: '🏷️ Воин Сезона' } },
        { level: 26, free: { type: 'coins', amount: 600, label: '🪙 600' }, premium: { type: 'gems', amount: 25, label: '💎 25' } },
        { level: 27, free: { type: 'gems', amount: 15, label: '💎 15' }, premium: { type: 'coins', amount: 2000, label: '🪙 2000' } },
        { level: 28, free: { type: 'coins', amount: 800, label: '🪙 800' }, premium: { type: 'coins', amount: 1500, label: '🪙 1500' } },
        { level: 29, free: { type: 'coins', amount: 1000, label: '🪙 1000' }, premium: { type: 'gems', amount: 30, label: '💎 30' } },
        { level: 30, free: { type: 'coins', amount: 2000, label: '🪙 2000 🌟' }, premium: { type: 'skin', id: 'enlightened', label: '👑 Просветлённый' } }
    ]
};

class BattlePassSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.init();
    }

    init() {
        if (!this.gameState.battlePass) {
            this.gameState.battlePass = {
                seasonId: BATTLE_PASS_SEASON.id,
                level: 0,
                xp: 0,
                premium: false,
                claimedFree: [],
                claimedPremium: []
            };
        }

        // Если сменился сезон — сбросить
        if (this.gameState.battlePass.seasonId !== BATTLE_PASS_SEASON.id) {
            this.gameState.battlePass = {
                seasonId: BATTLE_PASS_SEASON.id,
                level: 0,
                xp: 0,
                premium: this.gameState.battlePass.premium || false,
                claimedFree: [],
                claimedPremium: []
            };
        }
    }

    // Добавить XP (вызывается из meditation.js)
    addXP(amount) {
        const bp = this.gameState.battlePass;
        if (bp.level >= BATTLE_PASS_SEASON.maxLevel) return;

        bp.xp += amount;
        let levelsGained = 0;

        while (bp.xp >= BATTLE_PASS_SEASON.xpPerLevel && bp.level < BATTLE_PASS_SEASON.maxLevel) {
            bp.xp -= BATTLE_PASS_SEASON.xpPerLevel;
            bp.level++;
            levelsGained++;
        }

        if (levelsGained > 0) {
            showNotification(`⬆️ Battle Pass Ур. ${bp.level}!`);
            storage.saveGame(this.gameState);
        }

        return levelsGained;
    }

    // Забрать награду
    claimReward(level, isPremium) {
        const bp = this.gameState.battlePass;
        if (level > bp.level) return false;

        const list = isPremium ? bp.claimedPremium : bp.claimedFree;
        if (list.includes(level)) return false;
        if (isPremium && !bp.premium) return false;

        const rewardData = BATTLE_PASS_SEASON.rewards.find(r => r.level === level);
        if (!rewardData) return false;

        const reward = isPremium ? rewardData.premium : rewardData.free;
        this.applyReward(reward);
        list.push(level);

        storage.saveGame(this.gameState);
        if (window.updateHUD) updateHUD(this.gameState);
        return true;
    }

    applyReward(reward) {
        switch (reward.type) {
            case 'coins':
                this.gameState.currency.coins += reward.amount;
                break;
            case 'gems':
                this.gameState.currency.gems += reward.amount;
                break;
            case 'title':
            case 'aura':
            case 'skin':
            case 'companion':
                // Добавить в инвентарь
                if (!this.gameState.inventory) this.gameState.inventory = [];
                if (!this.gameState.inventory.find(i => i.id === reward.id)) {
                    this.gameState.inventory.push({
                        id: reward.id,
                        type: reward.type,
                        name: reward.label,
                        source: 'battlepass'
                    });
                }
                break;
        }
    }

    // Забрать все доступные free-награды разом
    claimAllFree() {
        const bp = this.gameState.battlePass;
        let claimed = 0;
        for (let i = 1; i <= bp.level; i++) {
            if (!bp.claimedFree.includes(i)) {
                if (this.claimReward(i, false)) claimed++;
            }
        }
        return claimed;
    }

    getLevel() { return this.gameState.battlePass.level; }
    getXP() { return this.gameState.battlePass.xp; }
    getMaxXP() { return BATTLE_PASS_SEASON.xpPerLevel; }
    isPremium() { return this.gameState.battlePass.premium; }

    // Оставшееся время сезона
    getSeasonTimeLeft() {
        const end = new Date(BATTLE_PASS_SEASON.endDate);
        const now = new Date();
        const diff = end - now;
        if (diff <= 0) return 'Сезон завершён';
        const days = Math.floor(diff / 86400000);
        return `${days} дн. осталось`;
    }

    // === ОТОБРАЖЕНИЕ ===
    updateDisplay() {
        const container = document.getElementById('battlepass-track');
        if (!container) return;

        const bp = this.gameState.battlePass;
        container.innerHTML = '';

        // Прогрессбар XP
        const xpBar = document.getElementById('bp-xp-bar');
        const xpText = document.getElementById('bp-xp-text');
        const lvlText = document.getElementById('bp-level-text');
        const timeText = document.getElementById('bp-time-left');

        if (xpBar) {
            const pct = bp.level >= BATTLE_PASS_SEASON.maxLevel ? 100 : (bp.xp / BATTLE_PASS_SEASON.xpPerLevel) * 100;
            xpBar.style.width = pct + '%';
        }
        if (xpText) xpText.textContent = bp.level >= BATTLE_PASS_SEASON.maxLevel ? 'MAX' : `${bp.xp} / ${BATTLE_PASS_SEASON.xpPerLevel} XP`;
        if (lvlText) lvlText.textContent = `Ур. ${bp.level} / ${BATTLE_PASS_SEASON.maxLevel}`;
        if (timeText) timeText.textContent = this.getSeasonTimeLeft();

        BATTLE_PASS_SEASON.rewards.forEach(r => {
            const unlocked = r.level <= bp.level;
            const freeClaimed = bp.claimedFree.includes(r.level);
            const premClaimed = bp.claimedPremium.includes(r.level);

            const row = document.createElement('div');
            row.className = `bp-reward-row ${unlocked ? 'unlocked' : 'locked'}`;
            row.innerHTML = `
                <div class="bp-level-num">${r.level}</div>
                <div class="bp-reward bp-free ${freeClaimed ? 'claimed' : ''}" 
                     onclick="claimBPReward(${r.level}, false)"
                     title="${r.free.label}">
                    <span>${freeClaimed ? '✅' : r.free.label}</span>
                </div>
                <div class="bp-reward bp-premium ${premClaimed ? 'claimed' : ''} ${!bp.premium ? 'locked-premium' : ''}"
                     onclick="claimBPReward(${r.level}, true)"
                     title="${r.premium.label}">
                    <span>${premClaimed ? '✅' : (bp.premium ? r.premium.label : '🔒')}</span>
                </div>
            `;
            container.appendChild(row);
        });
    }
}

// === UI FUNCTIONS ===
function toggleBattlePassPanel() {
    togglePanel('battlepass-panel');
    if (window.game && window.game.battlePass) {
        window.game.battlePass.updateDisplay();
    }
}

function claimBPReward(level, isPremium) {
    if (!window.game || !window.game.battlePass) return;
    const success = window.game.battlePass.claimReward(level, isPremium);
    if (success) {
        window.game.battlePass.updateDisplay();
    }
}

function claimAllBPFree() {
    if (!window.game || !window.game.battlePass) return;
    const count = window.game.battlePass.claimAllFree();
    if (count > 0) {
        showNotification(`🎁 Забрано ${count} наград!`);
        window.game.battlePass.updateDisplay();
    }
}

// Exports
window.BattlePassSystem = BattlePassSystem;
window.BATTLE_PASS_SEASON = BATTLE_PASS_SEASON;
window.toggleBattlePassPanel = toggleBattlePassPanel;
window.claimBPReward = claimBPReward;
window.claimAllBPFree = claimAllBPFree;
