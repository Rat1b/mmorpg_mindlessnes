// ========================================
// Events — Система временных событий
// ========================================

const GAME_EVENTS = [
    {
        id: 'spring_awakening',
        name: '🌸 Весеннее Пробуждение',
        description: 'Медитируй каждый день и получай двойные монеты за каждую сессию!',
        startDate: '2026-02-14',
        endDate: '2026-03-14',
        bonusType: 'double_coins',
        bonusMultiplier: 2,
        quests: [
            { id: 'spring_q1', title: '🎯 Медитируй 3 дня подряд', type: 'streak', target: 3, reward: { coins: 500, label: '🪙 500' } },
            { id: 'spring_q2', title: '🎯 Достигни 30мин за сессию', type: 'single_session', target: 30, reward: { coins: 300, gems: 5, label: '🪙 300 + 💎 5' } },
            { id: 'spring_q3', title: '🎯 Накопи 5 часов всего', type: 'total_minutes', target: 300, reward: { coins: 1000, gems: 10, label: '🪙 1000 + 💎 10' } },
            { id: 'spring_q4', title: '🎯 Собери 5 баннеров', type: 'banners', target: 5, reward: { coins: 800, gems: 15, label: '🪙 800 + 💎 15' } },
            { id: 'spring_q5', title: '🏆 Достигни 10ч медитации', type: 'total_minutes', target: 600, reward: { coins: 2000, gems: 30, label: '🪙 2000 + 💎 30 🌟' } }
        ]
    },
    {
        id: 'lunar_meditation',
        name: '🌙 Лунная Медитация',
        description: 'Ночные сессии (20:00-06:00) дают тройной опыт!',
        startDate: '2026-03-15',
        endDate: '2026-04-14',
        bonusType: 'night_bonus',
        bonusMultiplier: 3,
        nightHours: [20, 21, 22, 23, 0, 1, 2, 3, 4, 5],
        quests: [
            { id: 'lunar_q1', title: '🌙 Медитируй ночью 3 раза', type: 'night_sessions', target: 3, reward: { coins: 600, label: '🪙 600' } },
            { id: 'lunar_q2', title: '🌙 Накопи 2ч ночных медитаций', type: 'night_minutes', target: 120, reward: { coins: 1000, gems: 10, label: '🪙 1000 + 💎 10' } },
            { id: 'lunar_q3', title: '🏆 Стрик 7 дней с ночной сессией', type: 'streak', target: 7, reward: { coins: 1500, gems: 20, label: '🪙 1500 + 💎 20 🌟' } }
        ]
    }
];

class EventSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.init();
    }

    init() {
        if (!this.gameState.events) {
            this.gameState.events = {
                completedQuests: [],
                eventProgress: {}
            };
        }
    }

    // Текущие активные события
    getActiveEvents() {
        const today = utils.getDateKey();
        return GAME_EVENTS.filter(e => e.startDate <= today && e.endDate >= today);
    }

    // Прогресс квеста
    getQuestProgress(quest) {
        const gs = this.gameState;
        switch (quest.type) {
            case 'streak': {
                const data = gs.dailyLoginData;
                return data ? data.consecutiveDays : 0;
            }
            case 'single_session': {
                // Максимальная длительность одной сессии
                const s1 = gs.stats ? gs.stats.totalMinutes || 0 : 0;
                const s2 = gs.stats2 ? gs.stats2.totalMinutes || 0 : 0;
                // Используем последнюю сессию как приблизительное значение
                return Math.max(s1, s2) > 0 ? quest.target : 0; // Упрощение
            }
            case 'total_minutes': {
                const m1 = gs.stats ? gs.stats.totalMinutes || 0 : 0;
                const m2 = gs.stats2 ? gs.stats2.totalMinutes || 0 : 0;
                return m1 + m2;
            }
            case 'banners': {
                return gs.collectedBanners ? gs.collectedBanners.length : 0;
            }
            case 'night_sessions': {
                const prog = gs.events.eventProgress;
                return prog.nightSessions || 0;
            }
            case 'night_minutes': {
                const prog = gs.events.eventProgress;
                return prog.nightMinutes || 0;
            }
            default:
                return 0;
        }
    }

    // Проверить и забрать квест
    claimQuest(questId) {
        if (this.gameState.events.completedQuests.includes(questId)) return false;

        // Найти квест
        let quest = null;
        for (const event of GAME_EVENTS) {
            quest = event.quests.find(q => q.id === questId);
            if (quest) break;
        }
        if (!quest) return false;

        const progress = this.getQuestProgress(quest);
        if (progress < quest.target) return false;

        // Забрать награду
        this.gameState.currency.coins += (quest.reward.coins || 0);
        this.gameState.currency.gems += (quest.reward.gems || 0);
        this.gameState.events.completedQuests.push(questId);

        storage.saveGame(this.gameState);
        if (window.updateHUD) updateHUD(this.gameState);
        showNotification(`✅ Квест выполнен! ${quest.reward.label}`);
        return true;
    }

    // Записать ночную медитацию
    trackNightSession(minutes) {
        const hour = new Date().getHours();
        const nightHours = [20, 21, 22, 23, 0, 1, 2, 3, 4, 5];
        if (nightHours.includes(hour)) {
            if (!this.gameState.events.eventProgress.nightSessions) {
                this.gameState.events.eventProgress.nightSessions = 0;
                this.gameState.events.eventProgress.nightMinutes = 0;
            }
            this.gameState.events.eventProgress.nightSessions++;
            this.gameState.events.eventProgress.nightMinutes += minutes;
            storage.saveGame(this.gameState);
        }
    }

    // Получить множитель бонуса от событий
    getBonusMultiplier() {
        const active = this.getActiveEvents();
        let multiplier = 1;
        const hour = new Date().getHours();

        active.forEach(e => {
            if (e.bonusType === 'double_coins') {
                multiplier *= e.bonusMultiplier;
            } else if (e.bonusType === 'night_bonus' && e.nightHours && e.nightHours.includes(hour)) {
                multiplier *= e.bonusMultiplier;
            }
        });
        return multiplier;
    }

    // === ОТОБРАЖЕНИЕ ===
    updateDisplay() {
        const container = document.getElementById('events-list');
        if (!container) return;

        const active = this.getActiveEvents();
        if (active.length === 0) {
            container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;">Сейчас нет активных событий</p>';
            return;
        }

        container.innerHTML = '';

        active.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event-card';

            // Оставшееся время
            const endDate = new Date(event.endDate);
            const daysLeft = Math.max(0, Math.ceil((endDate - Date.now()) / 86400000));

            let questsHtml = '';
            event.quests.forEach(q => {
                const progress = this.getQuestProgress(q);
                const completed = this.gameState.events.completedQuests.includes(q.id);
                const ready = progress >= q.target && !completed;
                const pct = Math.min(100, Math.floor((progress / q.target) * 100));

                questsHtml += `
                    <div class="event-quest ${completed ? 'done' : ''} ${ready ? 'ready' : ''}">
                        <div class="event-quest-title">${completed ? '✅' : ready ? '🎁' : ''} ${q.title}</div>
                        <div class="event-quest-progress">
                            <div class="event-quest-bar">
                                <div class="event-quest-fill" style="width:${pct}%"></div>
                            </div>
                            <span>${progress}/${q.target}</span>
                        </div>
                        ${ready ? `<button class="event-claim-btn" onclick="claimEventQuest('${q.id}')">Забрать ${q.reward.label}</button>` : ''}
                        ${completed ? `<span class="event-claimed">Получено</span>` : ''}
                    </div>
                `;
            });

            eventEl.innerHTML = `
                <div class="event-header">
                    <div class="event-name">${event.name}</div>
                    <div class="event-timer">⏰ ${daysLeft} дн.</div>
                </div>
                <div class="event-desc">${event.description}</div>
                <div class="event-quests">${questsHtml}</div>
            `;

            container.appendChild(eventEl);
        });
    }
}

// UI
function toggleEventsPanel() {
    togglePanel('events-panel');
    if (window.game && window.game.events) {
        window.game.events.updateDisplay();
    }
}

function claimEventQuest(questId) {
    if (!window.game || !window.game.events) return;
    window.game.events.claimQuest(questId);
    window.game.events.updateDisplay();
}

// Exports
window.EventSystem = EventSystem;
window.GAME_EVENTS = GAME_EVENTS;
window.toggleEventsPanel = toggleEventsPanel;
window.claimEventQuest = claimEventQuest;
