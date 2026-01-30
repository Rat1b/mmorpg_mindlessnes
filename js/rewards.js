// ========================================
// Rewards - XP, coins, particles, achievements
// ========================================

function showRewardPopup(rewards) {
    const popup = document.getElementById('reward-popup');
    const container = document.getElementById('reward-items');
    container.innerHTML = '';

    rewards.forEach(r => {
        const item = document.createElement('div');
        item.className = 'reward-item';
        item.innerHTML = `
            <span class="icon">${r.icon}</span>
            <span class="amount">${r.amount}</span>
            ${r.label ? `<span class="label">${r.label}</span>` : ''}
        `;
        container.appendChild(item);
    });

    popup.classList.add('active');
    spawnParticles('coins', 20);
}

function closeRewardPopup() {
    document.getElementById('reward-popup').classList.remove('active');
}

function showAchievementPopup(achievement) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-icon').textContent = achievement.icon;
    document.getElementById('achievement-title').textContent = achievement.name;
    document.getElementById('achievement-desc').textContent = achievement.desc;

    popup.classList.add('active');
    spawnParticles('xp', 15);

    setTimeout(() => popup.classList.remove('active'), 4000);
}

function spawnParticles(type, count) {
    const container = document.getElementById('particles-container');

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';

            if (type === 'coins') {
                particle.className += ' coin-particle';
                particle.textContent = '✨';
            } else if (type === 'xp') {
                particle.className += ' xp-particle';
                particle.textContent = '+XP';
            }

            particle.style.left = (Math.random() * 80 + 10) + '%';
            particle.style.top = (Math.random() * 40 + 30) + '%';

            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }, i * 50);
    }
}

function checkAchievements(gameState) {
    const stats = gameState.stats;
    const unlocked = gameState.achievements;

    ACHIEVEMENTS_DATA.forEach(ach => {
        if (unlocked.includes(ach.id)) return;

        let earned = false;
        const c = ach.condition;

        if (c.totalMinutes && stats.totalMinutes >= c.totalMinutes) earned = true;
        if (c.streak && stats.streak >= c.streak) earned = true;
        if (c.perfectMinutes && stats.perfectSessions * 10 >= c.perfectMinutes) earned = true;
        if (c.level) {
            const level = utils.calculateLevel(stats.totalMinutes);
            if (level >= c.level) earned = true;
        }

        if (earned) {
            unlocked.push(ach.id);
            gameState.currency.pranaCoins += ach.reward.coins || 0;
            gameState.currency.gems += ach.reward.gems || 0;
            storage.saveGame(gameState);
            showAchievementPopup(ach);
        }
    });
}

function updateHUD(gameState) {
    const level = utils.calculateLevel(gameState.stats.totalMinutes);
    const xpProgress = utils.calculateXPProgress(gameState.stats.totalMinutes);

    document.getElementById('player-name-display').textContent = gameState.player.name;
    document.getElementById('player-level').textContent = level;
    document.getElementById('xp-fill').style.width = xpProgress.percent + '%';
    document.getElementById('prana-coins').textContent = utils.formatNumber(gameState.currency.pranaCoins);
    document.getElementById('gems').textContent = utils.formatNumber(gameState.currency.gems);

    // Stats panel
    const today = utils.getDateKey();
    const todayMins = gameState.stats.dailyMinutes[today] || 0;
    document.getElementById('stat-today').textContent = utils.formatTime(todayMins);
    document.getElementById('stat-total').textContent = utils.formatTime(gameState.stats.totalMinutes);
    document.getElementById('stat-streak').textContent = gameState.stats.streak + ' дней 🔥';

    const accuracy = gameState.stats.totalSessions > 0
        ? Math.round((gameState.stats.perfectSessions / gameState.stats.totalSessions) * 100)
        : 100;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
}

window.showRewardPopup = showRewardPopup;
window.closeRewardPopup = closeRewardPopup;
window.showAchievementPopup = showAchievementPopup;
window.spawnParticles = spawnParticles;
window.checkAchievements = checkAchievements;
window.updateHUD = updateHUD;
