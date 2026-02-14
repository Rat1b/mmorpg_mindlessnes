// ========================================
// Daily Login - Цели дня, празднования, галерея баннеров
// ========================================

class DailyLoginSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.goalReached = false;
        this.init();
    }

    init() {
        const today = utils.getDateKey();

        // Инициализация полей если нет (обратная совместимость)
        if (!this.gameState.dailyGoal) {
            this.gameState.dailyGoal = { targetMinutes: 300 };
        }
        if (!this.gameState.collectedBanners) {
            this.gameState.collectedBanners = [];
        }
        if (!this.gameState.dailyGoalReachedToday) {
            this.gameState.dailyGoalReachedToday = null;
        }

        // Проверяем - может цель уже выполнена сегодня?
        if (this.gameState.dailyGoalReachedToday === today) {
            this.goalReached = true;
        } else {
            // Проверяем прогресс
            this.checkDailyGoalSilent();
        }
    }

    // Получить минуты практики за сегодня (обе практики)
    getTodayMinutes() {
        const today = utils.getDateKey();
        const m1 = (this.gameState.stats && this.gameState.stats.dailyMinutes && this.gameState.stats.dailyMinutes[today]) || 0;
        const m2 = (this.gameState.stats2 && this.gameState.stats2.dailyMinutes && this.gameState.stats2.dailyMinutes[today]) || 0;
        return m1 + m2;
    }

    // Получить баннер на сегодня
    getTodayBanner() {
        if (!window.DAILY_BANNERS) return null;
        const today = utils.getDateKey();
        return window.DAILY_BANNERS.find(b => b.date === today) || null;
    }

    // Тихая проверка (при загрузке)
    checkDailyGoalSilent() {
        const todayMinutes = this.getTodayMinutes();
        const goal = this.gameState.dailyGoal.targetMinutes;

        if (todayMinutes >= goal && !this.goalReached) {
            this.goalReached = true;
            const today = utils.getDateKey();
            this.gameState.dailyGoalReachedToday = today;

            // Собрать баннер
            const banner = this.getTodayBanner();
            if (banner && !this.gameState.collectedBanners.includes(banner.id)) {
                this.gameState.collectedBanners.push(banner.id);
                storage.saveGame(this.gameState);
                // Показать празднование с задержкой
                setTimeout(() => this.triggerCelebration(banner), 1500);
            } else {
                storage.saveGame(this.gameState);
            }
        }
    }

    // Проверка после завершения медитации
    checkDailyGoal() {
        if (this.goalReached) return;

        const todayMinutes = this.getTodayMinutes();
        const goal = this.gameState.dailyGoal.targetMinutes;

        if (todayMinutes >= goal) {
            this.goalReached = true;
            const today = utils.getDateKey();
            this.gameState.dailyGoalReachedToday = today;

            const banner = this.getTodayBanner();
            if (banner && !this.gameState.collectedBanners.includes(banner.id)) {
                this.gameState.collectedBanners.push(banner.id);
                storage.saveGame(this.gameState);
                // Празднование!
                this.triggerCelebration(banner);
            } else {
                storage.saveGame(this.gameState);
                // Даже без баннера - конфетти за выполнение цели
                this.triggerCelebrationNoBanner();
            }
        }
    }

    // Получить прогресс для прогрессбара (0-1)
    getProgress() {
        const todayMinutes = this.getTodayMinutes();
        const goal = this.gameState.dailyGoal.targetMinutes;
        return Math.min(1, todayMinutes / goal);
    }

    // === ПРАЗДНОВАНИЕ ===
    triggerCelebration(banner) {
        // 1. Конфетти
        showConfetti();

        // 2. Танец NPC
        if (window.game) {
            window.game.celebrating = true;
            window.game.celebrationTimer = 360; // 6 секунд
        }

        // 3. Показать баннер через 1.5 сек
        setTimeout(() => {
            this.showBannerUnlock(banner);
        }, 1200);
    }

    triggerCelebrationNoBanner() {
        showConfetti();
        if (window.game) {
            window.game.celebrating = true;
            window.game.celebrationTimer = 240;
        }
        showNotification('🎉 Цель дня выполнена!');
    }

    // Попап разблокировки баннера
    showBannerUnlock(banner) {
        const overlay = document.createElement('div');
        overlay.className = 'banner-unlock-overlay';
        overlay.innerHTML = `
            <div class="banner-unlock-content">
                <div class="banner-unlock-title">✨ Новый баннер! ✨</div>
                <div class="banner-unlock-art">${banner.svg}</div>
                <div class="banner-unlock-name">${banner.emoji} ${banner.title}</div>
                <div class="banner-unlock-desc">${banner.description}</div>
                <button class="banner-unlock-btn" onclick="this.closest('.banner-unlock-overlay').remove()">Забрать в коллекцию</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Анимация появления
        requestAnimationFrame(() => overlay.classList.add('active'));
    }

    // === ГАЛЕРЕЯ ===
    updateGalleryDisplay() {
        const grid = document.getElementById('gallery-grid');
        if (!grid || !window.DAILY_BANNERS) return;

        const today = utils.getDateKey();
        grid.innerHTML = '';

        window.DAILY_BANNERS.forEach(banner => {
            const collected = this.gameState.collectedBanners.includes(banner.id);
            const isPast = banner.date < today;
            const isToday = banner.date === today;
            const isFuture = banner.date > today;

            let statusClass = 'upcoming';
            let statusText = '🔮 Скоро';
            if (collected) {
                statusClass = 'collected';
                statusText = '✅ В коллекции';
            } else if (isPast) {
                statusClass = 'missed';
                statusText = '🔒 Пропущен';
            } else if (isToday) {
                statusClass = this.goalReached ? 'collected' : 'today';
                statusText = this.goalReached ? '✅ В коллекции' : `🎯 Сегодня (${Math.floor(this.getTodayMinutes())}/${this.gameState.dailyGoal.targetMinutes} мин)`;
            }

            const card = document.createElement('div');
            card.className = `banner-card ${statusClass}`;
            card.innerHTML = `
                <div class="banner-art">${collected || isToday ? banner.svg : this.getLockedSVG()}</div>
                <div class="banner-info">
                    <div class="banner-title-text">${banner.emoji} ${banner.title}</div>
                    <div class="banner-date">${this.formatDate(banner.date)}</div>
                    <div class="banner-status">${statusText}</div>
                </div>
            `;

            // Клик по собранному баннеру - показать крупно
            if (collected) {
                card.addEventListener('click', () => this.showBannerFull(banner));
            }

            grid.appendChild(card);
        });

        // Обновить прогресс цели дня
        this.updateGoalDisplay();
    }

    updateGoalDisplay() {
        const fill = document.getElementById('goal-fill');
        const text = document.getElementById('goal-text');
        if (!fill || !text) return;

        const todayMinutes = this.getTodayMinutes();
        const goal = this.gameState.dailyGoal.targetMinutes;
        const percent = Math.min(100, (todayMinutes / goal) * 100);

        fill.style.width = percent + '%';
        fill.style.background = percent >= 100 ? 'linear-gradient(90deg, #FFD700, #FFA500)' : 'linear-gradient(90deg, #4CAF50, #66BB6A)';

        const hours = Math.floor(todayMinutes / 60);
        const mins = Math.floor(todayMinutes % 60);
        const goalHours = Math.floor(goal / 60);
        const goalMins = Math.floor(goal % 60);
        text.textContent = `${hours}ч ${mins}м / ${goalHours}ч ${goalMins}м`;

        if (percent >= 100) {
            text.textContent += ' ✅';
        }
    }

    showBannerFull(banner) {
        const overlay = document.createElement('div');
        overlay.className = 'banner-unlock-overlay active';
        overlay.innerHTML = `
            <div class="banner-unlock-content">
                <div class="banner-unlock-art">${banner.svg}</div>
                <div class="banner-unlock-name">${banner.emoji} ${banner.title}</div>
                <div class="banner-unlock-desc">${banner.description}</div>
                <button class="banner-unlock-btn" onclick="this.closest('.banner-unlock-overlay').remove()">Закрыть</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    getLockedSVG() {
        return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#1a1a2e"/>
            <circle cx="200" cy="130" r="35" fill="none" stroke="#333" stroke-width="3"/>
            <rect x="175" y="150" width="50" height="40" rx="5" fill="#333"/>
            <circle cx="200" cy="168" r="6" fill="#1a1a2e"/>
            <rect x="197" y="172" width="6" height="12" fill="#1a1a2e"/>
            <text x="200" y="230" text-anchor="middle" fill="#444" font-size="16" font-family="Philosopher">Выполни цель дня</text>
        </svg>`;
    }

    formatDate(dateStr) {
        const [y, m, d] = dateStr.split('-');
        const months = ['', 'янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        return `${parseInt(d)} ${months[parseInt(m)]} ${y}`;
    }

    // === ЕЖЕДНЕВНЫЙ ЛОГИН С НАГРАДАМИ ===
    checkDailyLogin() {
        const today = utils.getDateKey();
        if (!this.gameState.dailyLoginData) {
            this.gameState.dailyLoginData = {
                lastLoginDate: null,
                consecutiveDays: 0,
                totalDays: 0,
                claimedToday: false
            };
        }

        if (this.gameState.dailyLoginData.lastLoginDate === today) {
            return; // Уже залогинился сегодня
        }

        const yesterday = utils.getDateKey(new Date(Date.now() - 86400000));
        const wasYesterday = this.gameState.dailyLoginData.lastLoginDate === yesterday;

        if (wasYesterday) {
            this.gameState.dailyLoginData.consecutiveDays++;
        } else if (this.gameState.dailyLoginData.lastLoginDate !== null) {
            // Пропустил больше 1 дня — сброс (но 1 день прощаем)
            const lastDate = new Date(this.gameState.dailyLoginData.lastLoginDate);
            const diff = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
            if (diff > 2) {
                this.gameState.dailyLoginData.consecutiveDays = 1;
            } else {
                this.gameState.dailyLoginData.consecutiveDays++;
            }
        } else {
            this.gameState.dailyLoginData.consecutiveDays = 1;
        }

        this.gameState.dailyLoginData.lastLoginDate = today;
        this.gameState.dailyLoginData.totalDays++;
        this.gameState.dailyLoginData.claimedToday = false;
        storage.saveGame(this.gameState);

        // Показать попап логина
        setTimeout(() => this.showLoginRewardPopup(), 2000);
    }

    getLoginReward(day) {
        // Циклическое расписание 30 дней
        const cycle = ((day - 1) % 30) + 1;
        const rewards = {
            1: { coins: 100, label: '🪙 100' },
            2: { coins: 150, label: '🪙 150' },
            3: { coins: 200, label: '🪙 200' },
            4: { coins: 250, label: '🪙 250' },
            5: { coins: 300, label: '🪙 300' },
            6: { coins: 400, label: '🪙 400' },
            7: { coins: 500, gems: 5, label: '🪙 500 + 💎 5' },
            8: { coins: 200, label: '🪙 200' },
            9: { coins: 250, label: '🪙 250' },
            10: { coins: 300, label: '🪙 300' },
            11: { coins: 350, label: '🪙 350' },
            12: { coins: 400, label: '🪙 400' },
            13: { coins: 500, label: '🪙 500' },
            14: { coins: 600, gems: 10, label: '🪙 600 + 💎 10' },
            15: { coins: 300, label: '🪙 300' },
            16: { coins: 350, label: '🪙 350' },
            17: { coins: 400, label: '🪙 400' },
            18: { coins: 450, label: '🪙 450' },
            19: { coins: 500, label: '🪙 500' },
            20: { coins: 600, label: '🪙 600' },
            21: { coins: 700, gems: 15, label: '🪙 700 + 💎 15' },
            22: { coins: 400, label: '🪙 400' },
            23: { coins: 450, label: '🪙 450' },
            24: { coins: 500, label: '🪙 500' },
            25: { coins: 600, label: '🪙 600' },
            26: { coins: 700, label: '🪙 700' },
            27: { coins: 800, label: '🪙 800' },
            28: { coins: 1000, gems: 20, label: '🪙 1000 + 💎 20' },
            29: { coins: 800, label: '🪙 800' },
            30: { coins: 1500, gems: 30, label: '🪙 1500 + 💎 30 🌟' }
        };
        return rewards[cycle] || { coins: 100, label: '🪙 100' };
    }

    claimLoginReward() {
        if (this.gameState.dailyLoginData.claimedToday) return;

        const day = this.gameState.dailyLoginData.consecutiveDays;
        const reward = this.getLoginReward(day);

        // Начислить награды
        this.gameState.currency.coins += (reward.coins || 0);
        this.gameState.currency.gems += (reward.gems || 0);
        this.gameState.dailyLoginData.claimedToday = true;

        storage.saveGame(this.gameState);
        if (window.updateHUD) updateHUD(this.gameState);

        // Проверить milestones
        this.checkStreakMilestone(day);
    }

    showLoginRewardPopup() {
        const day = this.gameState.dailyLoginData.consecutiveDays;
        const reward = this.getLoginReward(day);
        const claimed = this.gameState.dailyLoginData.claimedToday;

        const overlay = document.createElement('div');
        overlay.className = 'banner-unlock-overlay';
        overlay.innerHTML = `
            <div class="banner-unlock-content">
                <div class="banner-unlock-title">📅 День ${day}</div>
                <div style="font-size:48px;margin:15px 0;">🎁</div>
                <div class="banner-unlock-name">Награда: ${reward.label}</div>
                <div class="banner-unlock-desc">Серия: ${day} ${day === 1 ? 'день' : day < 5 ? 'дня' : 'дней'}</div>
                <button class="banner-unlock-btn" id="claim-login-btn" ${claimed ? 'disabled style="opacity:0.5"' : ''}>
                    ${claimed ? 'Уже забрано' : 'Забрать!'}
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        const btn = overlay.querySelector('#claim-login-btn');
        if (!claimed) {
            btn.addEventListener('click', () => {
                this.claimLoginReward();
                btn.textContent = '✅ Забрано!';
                btn.disabled = true;
                btn.style.opacity = '0.5';
                setTimeout(() => overlay.remove(), 1500);
            });
        } else {
            btn.addEventListener('click', () => overlay.remove());
        }
    }

    // === СТРИКИ ===
    checkStreakMilestone(days) {
        const milestones = [
            { days: 3, title: '🔥 3 дня подряд!', duration: 180 },
            { days: 7, title: '⭐ Неделя практики!', duration: 240 },
            { days: 14, title: '🌟 2 недели!', duration: 300 },
            { days: 30, title: '👑 Месяц осознанности!', duration: 360 },
            { days: 100, title: '💫 100 дней!', duration: 420 },
            { days: 365, title: '🏆 Мастер Года!', duration: 480 }
        ];

        const milestone = milestones.find(m => m.days === days);
        if (milestone) {
            showConfetti();
            if (window.game) {
                window.game.celebrating = true;
                window.game.celebrationTimer = milestone.duration;
            }
            setTimeout(() => {
                showNotification(milestone.title);
            }, 1000);
        }
    }

    // Установить цель дня
    setGoal(minutes) {
        if (minutes >= 10 && minutes <= 600) {
            this.gameState.dailyGoal.targetMinutes = minutes;
            this.goalReached = false;
            const today = utils.getDateKey();
            if (this.gameState.dailyGoalReachedToday === today) {
                // Пересчитываем
                this.gameState.dailyGoalReachedToday = null;
            }
            this.checkDailyGoalSilent();
            storage.saveGame(this.gameState);
            this.updateGalleryDisplay();
        }
    }
}

// === КОНФЕТТИ ===
function showConfetti() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF69B4',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#FF4500', '#00CED1'];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';

        // Форма: квадрат или прямоугольник
        const size = 6 + Math.random() * 8;
        piece.style.width = size + 'px';
        piece.style.height = (size * (0.5 + Math.random())) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

        container.appendChild(piece);

        // Удалить после анимации
        setTimeout(() => piece.remove(), 5000);
    }
}

// === UI FUNCTIONS ===
function toggleGalleryPanel() {
    togglePanel('gallery-panel');
    if (window.game && window.game.dailyLogin) {
        window.game.dailyLogin.updateGalleryDisplay();
    }
}

function updateDailyGoal() {
    const input = document.getElementById('daily-goal-input');
    if (!input || !window.game || !window.game.dailyLogin) return;
    const minutes = parseInt(input.value);
    window.game.dailyLogin.setGoal(minutes);
}

// Exports
window.DailyLoginSystem = DailyLoginSystem;
window.showConfetti = showConfetti;
window.toggleGalleryPanel = toggleGalleryPanel;
window.updateDailyGoal = updateDailyGoal;
