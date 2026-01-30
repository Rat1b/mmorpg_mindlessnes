// ========================================
// Reputation - NPC Relationship System
// ========================================

// Уровни отношений
const REPUTATION_LEVELS = {
    stranger: { min: 0, max: 19, name: 'Незнакомец', emoji: '👤' },
    acquaintance: { min: 20, max: 39, name: 'Знакомый', emoji: '🤝' },
    student: { min: 40, max: 59, name: 'Ученик', emoji: '📖' },
    disciple: { min: 60, max: 79, name: 'Последователь', emoji: '🙏' },
    friend: { min: 80, max: 100, name: 'Доверенный', emoji: '💛' }
};

// Получить уровень репутации по значению
function getReputationLevel(value) {
    if (value >= 80) return REPUTATION_LEVELS.friend;
    if (value >= 60) return REPUTATION_LEVELS.disciple;
    if (value >= 40) return REPUTATION_LEVELS.student;
    if (value >= 20) return REPUTATION_LEVELS.acquaintance;
    return REPUTATION_LEVELS.stranger;
}

// Получить репутацию с конкретным NPC
function getNpcReputation(gameState, npcId) {
    return gameState.npcReputation[npcId] || 0;
}

// Изменить репутацию с NPC
function changeNpcReputation(gameState, npcId, delta) {
    const current = gameState.npcReputation[npcId] || 0;
    const newValue = Math.max(0, Math.min(100, current + delta));
    gameState.npcReputation[npcId] = newValue;

    const level = getReputationLevel(newValue);
    console.log(`Репутация с ${npcId}: ${current} → ${newValue} (${level.name})`);

    return newValue;
}

// Начать челлендж от NPC
function startNpcChallenge(gameState, npcId, minutes, maxMisses = 3) {
    gameState.activeChallenge = {
        npcId: npcId,
        minutes: minutes,
        maxMisses: maxMisses,
        startedAt: Date.now()
    };
    storage.saveGame(gameState);
    console.log(`Челлендж от ${npcId}: ${minutes} мин, допустимо пропусков: ${maxMisses}`);
}

// Завершить челлендж и оценить результат
function completeChallenge(gameState, actualMinutes, missedBreaths) {
    const challenge = gameState.activeChallenge;
    if (!challenge) return null;

    const npcId = challenge.npcId;
    const requiredMinutes = challenge.minutes;
    const maxMisses = challenge.maxMisses;

    let result = {
        npcId: npcId,
        success: false,
        perfect: false,
        repChange: 0,
        message: ''
    };

    // Проверка выполнения
    if (actualMinutes >= requiredMinutes * 0.9) { // 90% времени засчитывается
        if (missedBreaths === 0) {
            // Идеально!
            result.success = true;
            result.perfect = true;
            result.repChange = 15;
            result.message = 'Превосходно! Твоя осознанность безупречна.';
        } else if (missedBreaths <= maxMisses) {
            // Хорошо
            result.success = true;
            result.repChange = 8;
            result.message = 'Хорошая практика. Продолжай развиваться.';
        } else {
            // Много пропусков
            result.success = false;
            result.repChange = -3;
            result.message = 'Ты отвлекался... Практикуй внимательность.';
        }
    } else {
        // Не завершил
        result.success = false;
        result.repChange = -5;
        result.message = 'Ты не завершил практику. Попробуй снова.';
    }

    // Применить изменение репутации
    changeNpcReputation(gameState, npcId, result.repChange);

    // Очистить активный челлендж
    gameState.activeChallenge = null;
    storage.saveGame(gameState);

    return result;
}

// Получить доступные практики по уровню репутации
function getAvailableChallenges(reputation) {
    const level = getReputationLevel(reputation);

    if (reputation >= 80) {
        // Друг - сложные практики
        return [
            { minutes: 30, maxMisses: 2, label: '🧘 Глубокая практика (30 мин)' },
            { minutes: 45, maxMisses: 1, label: '🔥 Интенсивная сессия (45 мин)' },
            { minutes: 60, maxMisses: 0, label: '💎 Мастерская практика (60 мин)' }
        ];
    } else if (reputation >= 60) {
        // Последователь - средние
        return [
            { minutes: 15, maxMisses: 3, label: '🧘 Медитация (15 мин)' },
            { minutes: 20, maxMisses: 2, label: '🌟 Расширенная практика (20 мин)' },
            { minutes: 30, maxMisses: 2, label: '🔥 Глубокая сессия (30 мин)' }
        ];
    } else if (reputation >= 40) {
        // Ученик - базовые+
        return [
            { minutes: 10, maxMisses: 4, label: '🧘 Практика (10 мин)' },
            { minutes: 15, maxMisses: 3, label: '🌟 Углублённая (15 мин)' }
        ];
    } else if (reputation >= 20) {
        // Знакомый - базовые
        return [
            { minutes: 5, maxMisses: 5, label: '🌱 Короткая практика (5 мин)' },
            { minutes: 10, maxMisses: 4, label: '🧘 Медитация (10 мин)' }
        ];
    } else {
        // Незнакомец - только начальные
        return [
            { minutes: 3, maxMisses: 5, label: '🌱 Пробная практика (3 мин)' },
            { minutes: 5, maxMisses: 5, label: '🧘 Начальная (5 мин)' }
        ];
    }
}

// Получить мудрость по уровню репутации
function getWisdomByReputation(npcId, reputation) {
    const level = getReputationLevel(reputation);

    // Разная мудрость для разных уровней
    const wisdomTiers = {
        stranger: [
            'Дыхание — мост между телом и умом.',
            'Начни с наблюдения за своим дыханием.',
            'Каждый момент осознанности — шаг к пробуждению.'
        ],
        acquaintance: [
            'Не пытайся остановить мысли — просто наблюдай за ними.',
            'Регулярная практика важнее длительных сессий.',
            'Осознанность — это возвращение домой, к себе.'
        ],
        student: [
            'Истинная медитация — это состояние бытия, а не действие.',
            'Когда ум успокаивается, мудрость проявляется сама.',
            'Наблюдай промежуток между мыслями — там покой.'
        ],
        disciple: [
            'Ты не тот, кто дышит. Ты — само дыхание.',
            'Просветление не в будущем — оно здесь и сейчас.',
            'Когда наблюдатель и наблюдаемое сливаются — это самадхи.'
        ],
        friend: [
            'Ты уже пробуждён. Осталось лишь вспомнить это.',
            'Нирвана и сансара — два названия одной реальности.',
            'Высшая мудрость — знать, что знать нечего.',
            'Ты — вечное сознание, играющее роль человека.'
        ]
    };

    const tierName = Object.keys(REPUTATION_LEVELS).find(
        key => REPUTATION_LEVELS[key].min <= reputation && REPUTATION_LEVELS[key].max >= reputation
    ) || 'stranger';

    const pool = wisdomTiers[tierName] || wisdomTiers.stranger;
    return pool[Math.floor(Math.random() * pool.length)];
}

window.reputation = {
    REPUTATION_LEVELS,
    getReputationLevel,
    getNpcReputation,
    changeNpcReputation,
    startNpcChallenge,
    completeChallenge,
    getAvailableChallenges,
    getWisdomByReputation
};
