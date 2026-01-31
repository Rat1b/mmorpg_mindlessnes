// ========================================
// Quests - Система квестов (ежедневные, еженедельные, события)
// ========================================

const DAILY_QUESTS = [
    {
        id: 'daily_morning',
        name: '🌅 Утренняя практика',
        description: 'Медитируй минимум 10 минут',
        requirement: { type: 'meditation_minutes', value: 10 },
        reward: { coins: 500, xp: 50 },
        icon: '🧘'
    },
    {
        id: 'daily_perfect',
        name: '🎯 Точность мастера',
        description: 'Заверши медитацию без единого пропуска',
        requirement: { type: 'perfect_session', value: 1 },
        reward: { coins: 800, xp: 80 },
        icon: '🏆'
    },
    {
        id: 'daily_long',
        name: '⏰ Глубокое погружение',
        description: 'Одна сессия 30+ минут',
        requirement: { type: 'single_session_minutes', value: 30 },
        reward: { coins: 1200, xp: 120 },
        icon: '🌊'
    },
    {
        id: 'daily_talk',
        name: '💬 Искатель мудрости',
        description: 'Поговори с 3 разными NPC',
        requirement: { type: 'npc_talks', value: 3 },
        reward: { coins: 400, xp: 40 },
        icon: '🗣️'
    },
    {
        id: 'daily_explore',
        name: '🗺️ Исследователь',
        description: 'Посети 3 разные локации',
        requirement: { type: 'zones_visited', value: 3 },
        reward: { coins: 600, xp: 60 },
        icon: '🧭'
    }
];

const WEEKLY_QUESTS = [
    {
        id: 'weekly_streak',
        name: '🔥 Пламя преданности',
        description: 'Практикуй 7 дней подряд',
        requirement: { type: 'streak_days', value: 7 },
        reward: { coins: 5000, gems: 100 },
        icon: '🔥'
    },
    {
        id: 'weekly_hour',
        name: '⏳ Часовой марафон',
        description: 'Намедитируй 60+ минут за неделю',
        requirement: { type: 'weekly_minutes', value: 60 },
        reward: { coins: 3000, gems: 50 },
        icon: '⌛'
    },
    {
        id: 'weekly_perfection',
        name: '💎 Кристальная точность',
        description: '5 идеальных сессий за неделю',
        requirement: { type: 'weekly_perfect', value: 5 },
        reward: { coins: 4000, gems: 80 },
        icon: '💎'
    },
    {
        id: 'weekly_gacha',
        name: '🎰 Испытание судьбы',
        description: 'Сделай 10 призывов',
        requirement: { type: 'gacha_pulls', value: 10 },
        reward: { coins: 2000, gems: 30, bonus: 'guaranteed_rare' },
        icon: '🔮'
    },
    {
        id: 'weekly_social',
        name: '👥 Путь общения',
        description: 'Поговори с 15 разными NPC',
        requirement: { type: 'weekly_npc_talks', value: 15 },
        reward: { coins: 2500, gems: 40 },
        icon: '🤝'
    }
];

// Специальные события (меняются по сезонам)
const SEASONAL_EVENTS = {
    winter: {
        name: '❄️ Зимнее Просветление',
        startMonth: 12, endMonth: 2,
        quests: [
            {
                id: 'winter_meditation',
                name: '☃️ Снежная медитация',
                description: 'Практикуй 30 минут в горах',
                requirement: { type: 'zone_meditation', zone: 'mountains', value: 30 },
                reward: { coins: 3000, gems: 50, item: 'skin_winter' }
            }
        ],
        bonusMultiplier: 1.5 // 50% больше наград
    },
    spring: {
        name: '🌸 Фестиваль Цветения',
        startMonth: 3, endMonth: 5,
        quests: [
            {
                id: 'spring_lotus',
                name: '🌷 Цветение лотоса',
                description: 'Собери 10 цветов (посети места с цветами)',
                requirement: { type: 'flower_collection', value: 10 },
                reward: { coins: 2500, gems: 40, item: 'aura_spring' }
            }
        ],
        bonusMultiplier: 1.3
    },
    summer: {
        name: '☀️ Летнее Пробуждение',
        startMonth: 6, endMonth: 8,
        quests: [
            {
                id: 'summer_beach',
                name: '🏖️ Медитация у океана',
                description: 'Практикуй 45 минут на пляже',
                requirement: { type: 'zone_meditation', zone: 'beach', value: 45 },
                reward: { coins: 3500, gems: 60, item: 'skin_beach' }
            }
        ],
        bonusMultiplier: 1.2
    },
    autumn: {
        name: '🍂 Осенняя Рефлексия',
        startMonth: 9, endMonth: 11,
        quests: [
            {
                id: 'autumn_forest',
                name: '🍁 Лесная тишина',
                description: 'Медитируй 40 минут в тёмном лесу',
                requirement: { type: 'zone_meditation', zone: 'forest', value: 40 },
                reward: { coins: 3000, gems: 55, item: 'aura_autumn' }
            }
        ],
        bonusMultiplier: 1.25
    }
};

class QuestSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.initQuestState();
    }

    initQuestState() {
        if (!this.gameState.quests) {
            this.gameState.quests = {
                daily: {},
                weekly: {},
                seasonal: {},
                dailyProgress: {},
                weeklyProgress: {},
                lastDailyReset: null,
                lastWeeklyReset: null
            };
        }
        this.checkResets();
    }

    checkResets() {
        const today = utils.getDateKey();
        const thisWeek = utils.getWeekKey();

        // Сброс ежедневных квестов
        if (this.gameState.quests.lastDailyReset !== today) {
            this.gameState.quests.daily = {};
            this.gameState.quests.dailyProgress = {
                meditation_minutes: 0,
                perfect_session: 0,
                single_session_minutes: 0,
                npc_talks: 0,
                zones_visited: new Set()
            };
            this.gameState.quests.lastDailyReset = today;
        }

        // Сброс еженедельных квестов
        if (this.gameState.quests.lastWeeklyReset !== thisWeek) {
            this.gameState.quests.weekly = {};
            this.gameState.quests.weeklyProgress = {
                weekly_minutes: 0,
                weekly_perfect: 0,
                gacha_pulls: 0,
                weekly_npc_talks: new Set()
            };
            this.gameState.quests.lastWeeklyReset = thisWeek;
        }
    }

    // Обновить прогресс после медитации
    onMeditationComplete(minutes, missedBreaths) {
        const dp = this.gameState.quests.dailyProgress;
        const wp = this.gameState.quests.weeklyProgress;

        dp.meditation_minutes += minutes;
        wp.weekly_minutes += minutes;

        if (missedBreaths === 0 && minutes >= 5) {
            dp.perfect_session++;
            wp.weekly_perfect++;
        }

        if (minutes > dp.single_session_minutes) {
            dp.single_session_minutes = minutes;
        }

        this.checkQuestCompletion();
        storage.saveGame(this.gameState);
    }

    // Обновить прогресс после разговора с NPC
    onNPCTalk(npcId) {
        const dp = this.gameState.quests.dailyProgress;
        const wp = this.gameState.quests.weeklyProgress;

        if (!dp.npcTalkedToday) dp.npcTalkedToday = new Set();
        dp.npcTalkedToday.add(npcId);
        dp.npc_talks = dp.npcTalkedToday.size;

        if (!wp.npcTalkedWeek) wp.npcTalkedWeek = new Set();
        wp.npcTalkedWeek.add(npcId);
        wp.weekly_npc_talks = wp.npcTalkedWeek.size;

        this.checkQuestCompletion();
        storage.saveGame(this.gameState);
    }

    // Обновить прогресс посещения зон
    onZoneVisit(zoneName) {
        const dp = this.gameState.quests.dailyProgress;
        if (!dp.zonesVisitedToday) dp.zonesVisitedToday = new Set();
        dp.zonesVisitedToday.add(zoneName);
        dp.zones_visited = dp.zonesVisitedToday.size;

        this.checkQuestCompletion();
    }

    // Обновить прогресс гачи
    onGachaPull(count) {
        const wp = this.gameState.quests.weeklyProgress;
        wp.gacha_pulls = (wp.gacha_pulls || 0) + count;

        this.checkQuestCompletion();
        storage.saveGame(this.gameState);
    }

    checkQuestCompletion() {
        const completed = [];

        // Проверяем ежедневные квесты
        DAILY_QUESTS.forEach(quest => {
            if (this.gameState.quests.daily[quest.id]) return; // Уже выполнен

            const progress = this.getQuestProgress(quest);
            if (progress >= quest.requirement.value) {
                this.completeQuest(quest, 'daily');
                completed.push(quest);
            }
        });

        // Проверяем еженедельные квесты
        WEEKLY_QUESTS.forEach(quest => {
            if (this.gameState.quests.weekly[quest.id]) return;

            const progress = this.getQuestProgress(quest);
            if (progress >= quest.requirement.value) {
                this.completeQuest(quest, 'weekly');
                completed.push(quest);
            }
        });

        return completed;
    }

    getQuestProgress(quest) {
        const req = quest.requirement;
        const dp = this.gameState.quests.dailyProgress;
        const wp = this.gameState.quests.weeklyProgress;

        switch (req.type) {
            case 'meditation_minutes': return dp.meditation_minutes || 0;
            case 'perfect_session': return dp.perfect_session || 0;
            case 'single_session_minutes': return dp.single_session_minutes || 0;
            case 'npc_talks': return dp.npc_talks || 0;
            case 'zones_visited': return dp.zones_visited || 0;
            case 'streak_days': return this.gameState.stats.streak || 0;
            case 'weekly_minutes': return wp.weekly_minutes || 0;
            case 'weekly_perfect': return wp.weekly_perfect || 0;
            case 'gacha_pulls': return wp.gacha_pulls || 0;
            case 'weekly_npc_talks': return wp.weekly_npc_talks || 0;
            default: return 0;
        }
    }

    completeQuest(quest, type) {
        // Записываем выполнение
        this.gameState.quests[type][quest.id] = true;

        // Выдаём награды
        if (quest.reward.coins) {
            this.gameState.currency.pranaCoins += quest.reward.coins;
        }
        if (quest.reward.gems) {
            this.gameState.currency.gems += quest.reward.gems;
        }

        // Показываем уведомление
        showNotification(`✅ Квест выполнен: ${quest.name}!`);

        // Показываем награду
        const rewards = [];
        if (quest.reward.coins) rewards.push({ icon: '✨', amount: `+${quest.reward.coins}`, label: 'Прана' });
        if (quest.reward.gems) rewards.push({ icon: '💎', amount: `+${quest.reward.gems}`, label: 'Кристаллы' });
        if (quest.reward.xp) rewards.push({ icon: '⭐', amount: `+${quest.reward.xp}`, label: 'Опыт' });

        setTimeout(() => showRewardPopup(rewards), 500);
    }

    // Получить актуальные квесты для UI
    getAvailableQuests() {
        const available = {
            daily: [],
            weekly: []
        };

        DAILY_QUESTS.forEach(quest => {
            const completed = this.gameState.quests.daily[quest.id];
            const progress = this.getQuestProgress(quest);
            available.daily.push({
                ...quest,
                completed,
                progress,
                max: quest.requirement.value
            });
        });

        WEEKLY_QUESTS.forEach(quest => {
            const completed = this.gameState.quests.weekly[quest.id];
            const progress = this.getQuestProgress(quest);
            available.weekly.push({
                ...quest,
                completed,
                progress,
                max: quest.requirement.value
            });
        });

        return available;
    }
}

// Экспорт  
window.QuestSystem = QuestSystem;
window.DAILY_QUESTS = DAILY_QUESTS;
window.WEEKLY_QUESTS = WEEKLY_QUESTS;
window.SEASONAL_EVENTS = SEASONAL_EVENTS;
