// ========================================
// Meditation - Timer and tracking system
// ========================================

class MeditationSystem {
    constructor(gameState, onUpdate) {
        this.gameState = gameState;
        this.onUpdate = onUpdate;
        this.isActive = false;
        this.isPaused = false;
        this.targetMinutes = 10;
        this.elapsedSeconds = 0;
        this.missedBreaths = 0;
        this.interval = null;
        this.challengeFromNPC = null;
    }

    setDuration(minutes) {
        this.targetMinutes = minutes;
        this.updateDisplay();
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.isPaused = false;
        this.elapsedSeconds = 0;
        this.missedBreaths = 0;

        document.getElementById('missed-breaths-count').textContent = '0';
        document.getElementById('start-meditation-btn').style.display = 'none';
        document.getElementById('pause-meditation-btn').style.display = 'inline-flex';
        document.getElementById('stop-meditation-btn').style.display = 'inline-flex';

        this.interval = setInterval(() => this.tick(), 1000);
        this.updateDisplay();
    }

    pause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pause-meditation-btn').textContent = this.isPaused ? '▶ Продолжить' : '⏸ Пауза';
    }

    stop() {
        if (!this.isActive) return;
        clearInterval(this.interval);
        this.isActive = false;

        const minutes = this.elapsedSeconds / 60;
        this.completeMeditation(minutes, this.missedBreaths);

        document.getElementById('start-meditation-btn').style.display = 'inline-flex';
        document.getElementById('pause-meditation-btn').style.display = 'none';
        document.getElementById('stop-meditation-btn').style.display = 'none';

        this.elapsedSeconds = 0;
        this.updateDisplay();
    }

    tick() {
        if (this.isPaused) return;
        this.elapsedSeconds++;
        this.updateDisplay();

        if (this.elapsedSeconds >= this.targetMinutes * 60) {
            this.stop();
        }
    }

    updateDisplay() {
        const remaining = Math.max(0, this.targetMinutes * 60 - this.elapsedSeconds);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        document.getElementById('timer-minutes').textContent = mins.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = secs.toString().padStart(2, '0');
    }

    adjustMissedBreaths(delta) {
        this.missedBreaths = Math.max(0, this.missedBreaths + delta);
        document.getElementById('missed-breaths-count').textContent = this.missedBreaths;
    }

    addRetroactive(minutes, missed = 0) {
        this.completeMeditation(minutes, missed, true);
    }

    completeMeditation(minutes, missedBreaths, isRetroactive = false) {
        if (minutes < 0.1) return;

        // Calculate penalty for missed breaths (2% per miss, max 80%)
        const penaltyPercent = Math.min(80, missedBreaths * 2);
        const multiplier = 1 - (penaltyPercent / 100);

        // Base rewards
        const baseCoins = Math.floor(minutes * 10);
        const baseXP = Math.floor(minutes * 5);

        // Apply penalty
        const coins = Math.floor(baseCoins * multiplier);
        const xp = Math.floor(baseXP * multiplier);

        // Update stats
        const today = utils.getDateKey();
        this.gameState.stats.totalMinutes += minutes;
        this.gameState.stats.totalSessions++;
        this.gameState.stats.totalMissedBreaths += missedBreaths;
        if (missedBreaths === 0 && minutes >= 5) {
            this.gameState.stats.perfectSessions++;
        }

        // Daily tracking
        if (!this.gameState.stats.dailyMinutes[today]) {
            this.gameState.stats.dailyMinutes[today] = 0;
        }
        this.gameState.stats.dailyMinutes[today] += minutes;

        // Update streak
        storage.updateStreak(this.gameState);

        // Give rewards
        this.gameState.currency.pranaCoins += coins;

        // Save
        storage.saveGame(this.gameState);

        // Show reward popup
        const rewards = [
            { icon: '✨', amount: `+${coins}`, label: 'Прана' },
            { icon: '✨', amount: `+${xp}`, label: 'Опыт' }
        ];

        if (penaltyPercent > 0) {
            rewards.push({ icon: '😔', amount: `-${penaltyPercent}%`, label: 'Штраф' });
        }

        if (missedBreaths === 0 && minutes >= 10) {
            rewards.push({ icon: '🏆', amount: 'Идеально!', label: '' });
        }

        showRewardPopup(rewards);
        this.onUpdate();

        // Check achievements
        checkAchievements(this.gameState);
    }
}

function startMeditation() {
    if (window.game && window.game.meditation) {
        window.game.meditation.start();
    }
}

function pauseMeditation() {
    if (window.game && window.game.meditation) {
        window.game.meditation.pause();
    }
}

function stopMeditation() {
    if (window.game && window.game.meditation) {
        window.game.meditation.stop();
    }
}

function adjustMissedBreaths(delta) {
    if (window.game && window.game.meditation) {
        window.game.meditation.adjustMissedBreaths(delta);
    }
}

function setCustomTimer() {
    const minutes = parseInt(document.getElementById('custom-minutes').value);
    if (minutes > 0 && minutes <= 180) {
        window.game.meditation.setDuration(minutes);
    }
}

function addRetroactiveMeditation() {
    const minutes = parseInt(document.getElementById('retro-minutes').value);
    const missed = parseInt(document.getElementById('retro-missed').value) || 0;
    if (minutes > 0) {
        window.game.meditation.addRetroactive(minutes, missed);
        document.getElementById('retro-minutes').value = '';
        document.getElementById('retro-missed').value = '0';
    }
}

window.MeditationSystem = MeditationSystem;
