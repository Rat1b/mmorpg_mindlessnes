// ========================================
// Meditation - Timer and tracking system
// ========================================

class MeditationSystem {
    constructor(gameState, onUpdate) {
        this.gameState = gameState;
        this.onUpdate = onUpdate;

        this.interval = null;
        this.isActive = false;
        this.isPaused = false;

        // Timer state
        this.targetMinutes = 10;
        this.startedAt = null;
        this.pausedAt = null;
        this.totalPausedMs = 0;
        this.missedBreaths = 0;
        this.challengeFromNPC = null;

        // Check for active offline session
        if (this.gameState.activeMeditation) {
            this.resumeFromStorage();
        }

        // Setup visibility change handler for background tab support
        this.setupVisibilityHandler();
    }

    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (this.isActive && !this.isPaused) {
                // Tab became visible again - sync the display
                this.syncFromTimestamp();
                this.updateDisplay();
            }
        });

        // Also handle window focus for additional reliability
        window.addEventListener('focus', () => {
            if (this.isActive && !this.isPaused) {
                this.syncFromTimestamp();
                this.updateDisplay();
            }
        });
    }

    // Calculate elapsed seconds from timestamps (works even in background)
    getElapsedSeconds() {
        if (!this.startedAt) return 0;
        const now = Date.now();
        const pauseOffset = this.isPaused ? (now - this.pausedAt) : 0;
        const totalElapsedMs = now - this.startedAt - this.totalPausedMs - pauseOffset;
        return Math.floor(totalElapsedMs / 1000);
    }

    syncFromTimestamp() {
        const elapsed = this.getElapsedSeconds();
        // Check if meditation completed while in background
        if (elapsed >= this.targetMinutes * 60) {
            this.stop();
        }
    }

    setDuration(minutes) {
        this.targetMinutes = minutes;
        this.updateDisplay();
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.isPaused = false;
        this.missedBreaths = 0;

        // Use timestamp instead of counter
        this.startedAt = Date.now();
        this.pausedAt = null;
        this.totalPausedMs = 0;
        this.missedBreaths = 0;
        this.isActive = true;
        this.isPaused = false;

        // Persist session
        this.gameState.activeMeditation = {
            startTime: this.startedAt,
            targetMinutes: this.targetMinutes,
            missedBreaths: 0
        };
        storage.saveGame(this.gameState);

        document.getElementById('missed-breaths-count').textContent = '0';
        document.getElementById('start-meditation-btn').style.display = 'none';
        document.getElementById('pause-meditation-btn').style.display = 'inline-flex';
        document.getElementById('stop-meditation-btn').style.display = 'inline-flex';

        // Interval only for display updates, actual time from timestamps
        this.interval = setInterval(() => this.tick(), 1000);
        this.updateDisplay();
    }

    pause() {
        if (this.isPaused) {
            // Resuming - add paused duration to total
            this.totalPausedMs += Date.now() - this.pausedAt;
            this.pausedAt = null;
            this.isPaused = false;
        } else {
            // Pausing - record when we paused
            this.pausedAt = Date.now();
            this.isPaused = true;
        }
        document.getElementById('pause-meditation-btn').textContent = this.isPaused ? '▶ Продолжить' : '⏸ Пауза';
    }

    stop() {
        if (!this.isActive) return;
        clearInterval(this.interval);
        this.isActive = false;

        const elapsedSeconds = this.getElapsedSeconds();
        const minutes = elapsedSeconds / 60;
        this.completeMeditation(minutes, this.missedBreaths);

        document.getElementById('start-meditation-btn').style.display = 'inline-flex';
        document.getElementById('pause-meditation-btn').style.display = 'none';
        document.getElementById('stop-meditation-btn').style.display = 'none';

        this.startedAt = null;
        this.pausedAt = null;
        this.totalPausedMs = 0;
        this.updateDisplay();

        // Clear persistence
        delete this.gameState.activeMeditation;
        storage.saveGame(this.gameState);
    }

    resumeFromStorage() {
        const session = this.gameState.activeMeditation;
        if (!session) return;

        const now = Date.now();
        const elapsedMinutes = (now - session.startTime) / 60000;

        if (elapsedMinutes >= session.targetMinutes) {
            // Completed while offline!
            console.log(`Offline meditation completed! Elapsed: ${elapsedMinutes.toFixed(1)}m`);
            // We need to call complete, but logic expects running state or we assume implicit
            this.startedAt = session.startTime;
            this.targetMinutes = session.targetMinutes;
            this.missedBreaths = session.missedBreaths || 0;

            // Clean up UI state just in case
            delete this.gameState.activeMeditation;
            storage.saveGame(this.gameState);

            // Give rewards immediately
            this.completeMeditation(this.targetMinutes, this.missedBreaths);
        } else {
            // Resume
            console.log(`Resuming session. Elapsed: ${elapsedMinutes.toFixed(1)}m / ${session.targetMinutes}m`);
            this.isActive = true;
            this.isPaused = false;
            this.targetMinutes = session.targetMinutes;
            this.startedAt = session.startTime;
            this.missedBreaths = session.missedBreaths || 0;
            this.totalPausedMs = 0; // Assume no pause during offline

            document.getElementById('start-meditation-btn').style.display = 'none';
            document.getElementById('pause-meditation-btn').style.display = 'inline-flex';
            document.getElementById('stop-meditation-btn').style.display = 'inline-flex';

            this.interval = setInterval(() => this.tick(), 100);
            this.updateDisplay();
        }
    }

    tick() {
        if (this.isPaused) return;

        const elapsedSeconds = this.getElapsedSeconds();
        this.updateDisplay();

        if (elapsedSeconds >= this.targetMinutes * 60) {
            this.stop();
        }
    }

    updateDisplay() {
        const elapsedSeconds = this.getElapsedSeconds();
        const remaining = Math.max(0, this.targetMinutes * 60 - elapsedSeconds);
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

        // Base rewards (reduced 5x for balance)
        const baseCoins = Math.floor(minutes * 2);
        const baseXP = Math.floor(minutes * 1);

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

        // === NPC CHALLENGE COMPLETION ===
        let challengeResult = null;
        if (this.gameState.activeChallenge && !isRetroactive) {
            challengeResult = reputation.completeChallenge(this.gameState, minutes, missedBreaths);
        }

        // === ZONE RESOURCES (FARMING) ===
        let gatheredResources = [];
        if (window.game && window.game.map && window.calculateZoneYield) {
            const px = this.gameState.player.x;
            const py = this.gameState.player.y;
            const biome = window.game.map.getBiomeId(px, py);

            // Calculate yield
            gatheredResources = window.calculateZoneYield(biome, minutes);

            // Add to inventory
            gatheredResources.forEach(res => {
                const existing = this.gameState.inventory.find(i => i.id === res.id);
                if (existing) {
                    existing.count += res.count;
                } else {
                    this.gameState.inventory.push({ ...res });
                }
            });
        }

        // Save
        storage.saveGame(this.gameState);

        // Show reward popup
        const rewards = [
            { icon: '✨', amount: `+${coins}`, label: 'Прана' },
            { icon: '⭐', amount: `+${xp}`, label: 'Опыт' }
        ];

        // Add gathered resources to popup
        gatheredResources.forEach(res => {
            rewards.push({
                icon: res.emoji,
                amount: `+${res.count}`,
                label: res.name
            });
        });

        if (penaltyPercent > 0) {
            rewards.push({ icon: '⚠️', amount: `-${penaltyPercent}%`, label: 'Штраф (дыхание)' });
        }

        if (isRetroactive) {
            rewards.push({ icon: '📅', amount: '', label: 'Заднее число' });
        }

        showRewardPopup(rewards);
        this.onUpdate();

        // Check achievements
        checkAchievements(this.gameState);

        // === Показать результат челленджа после попапа наград ===
        if (challengeResult) {
            setTimeout(() => {
                showChallengeResult(challengeResult);
            }, 2500);
        }
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
