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
            this.gameState.dailyGoal = { targetMinutes: 180 };
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
