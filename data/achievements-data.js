// ========================================
// Achievements Data - Расширенные достижения
// ========================================

const ACHIEVEMENTS_DATA = [
    // === ПЕРВЫЕ ШАГИ ===
    { id: 'first_breath', name: 'Первый Вдох', desc: 'Завершить первую сессию', icon: '🌱', reward: { coins: 50, xp: 100 }, condition: { totalMinutes: 1 } },
    { id: 'five_minutes', name: 'Начало Пути', desc: '5 минут осознанности', icon: '🌿', reward: { coins: 100, xp: 200 }, condition: { totalMinutes: 5 } },
    { id: 'thirty_minutes', name: 'Полчаса Покоя', desc: '30 минут практики', icon: '🌳', reward: { coins: 200, gems: 5 }, condition: { totalMinutes: 30 } },

    // === ЧАСЫ ПРАКТИКИ ===
    { id: 'one_hour', name: 'Час Тишины', desc: '1 час осознанности', icon: '⏰', reward: { coins: 500, gems: 10 }, condition: { totalMinutes: 60 } },
    { id: 'three_hours', name: 'Три Часа Покоя', desc: '3 часа медитации', icon: '🕐', reward: { coins: 750, gems: 15 }, condition: { totalMinutes: 180 } },
    { id: 'five_hours', name: 'Терпеливый', desc: '5 часов практики', icon: '🕑', reward: { coins: 1000, gems: 20 }, condition: { totalMinutes: 300 } },
    { id: 'ten_hours', name: 'Настойчивый', desc: '10 часов медитации', icon: '🕒', reward: { coins: 2000, gems: 50 }, condition: { totalMinutes: 600 } },
    { id: 'twentyfive_hours', name: 'Посвящённый', desc: '25 часов', icon: '🕓', reward: { coins: 3500, gems: 75 }, condition: { totalMinutes: 1500 } },
    { id: 'fifty_hours', name: 'Практик', desc: '50 часов', icon: '🕔', reward: { coins: 5000, gems: 100 }, condition: { totalMinutes: 3000 } },
    { id: 'hundred_hours', name: 'Мастер Дыхания', desc: '100 часов', icon: '🏆', reward: { coins: 10000, gems: 200 }, condition: { totalMinutes: 6000 } },
    { id: 'twohundred_hours', name: 'Великий Практик', desc: '200 часов', icon: '🥇', reward: { coins: 20000, gems: 400 }, condition: { totalMinutes: 12000 } },
    { id: 'fivehundred_hours', name: 'Легенда', desc: '500 часов', icon: '🎖️', reward: { coins: 35000, gems: 700 }, condition: { totalMinutes: 30000 } },
    { id: 'thousand_hours', name: 'Просветлённый', desc: '1000 часов', icon: '👑', reward: { coins: 50000, gems: 1000 }, condition: { totalMinutes: 60000 } },
    { id: 'fivethousand_hours', name: 'Бессмертный', desc: '5000 часов', icon: '✨', reward: { coins: 200000, gems: 5000 }, condition: { totalMinutes: 300000 } },

    // === СЕРИИ ДНЕЙ ===
    { id: 'streak_3', name: '3 Дня Подряд', desc: 'Практика 3 дня', icon: '🔥', reward: { coins: 100, gems: 5 }, condition: { streak: 3 } },
    { id: 'streak_7', name: 'Неделя Осознанности', desc: '7 дней без перерыва', icon: '🔥', reward: { coins: 300, gems: 15 }, condition: { streak: 7 } },
    { id: 'streak_14', name: 'Две Недели', desc: '14 дней практики', icon: '🔥', reward: { coins: 600, gems: 30 }, condition: { streak: 14 } },
    { id: 'streak_30', name: 'Месяц Дисциплины', desc: '30 дней практики', icon: '💪', reward: { coins: 1000, gems: 50 }, condition: { streak: 30 } },
    { id: 'streak_60', name: 'Два Месяца', desc: '60 дней подряд', icon: '💪', reward: { coins: 2500, gems: 100 }, condition: { streak: 60 } },
    { id: 'streak_100', name: '100 Дней!', desc: 'Легендарная серия', icon: '⚡', reward: { coins: 5000, gems: 200 }, condition: { streak: 100 } },
    { id: 'streak_200', name: '200 Дней!', desc: 'Эпическая серия', icon: '⚡', reward: { coins: 10000, gems: 350 }, condition: { streak: 200 } },
    { id: 'streak_365', name: 'Год Практики', desc: '365 дней!', icon: '🌟', reward: { coins: 20000, gems: 500 }, condition: { streak: 365 } },
    { id: 'streak_500', name: 'Полтора Года!', desc: '500 дней', icon: '🌟', reward: { coins: 30000, gems: 750 }, condition: { streak: 500 } },
    { id: 'streak_1000', name: 'Тысяча Дней', desc: '1000 дней практики!', icon: '👑', reward: { coins: 100000, gems: 2000 }, condition: { streak: 1000 } },

    // === ТОЧНОСТЬ (ИДЕАЛЬНЫЕ СЕССИИ) ===
    { id: 'perfect_10', name: 'Идеальные 10', desc: '10 мин без пропусков', icon: '✨', reward: { coins: 200, xp: 100 }, condition: { perfectMinutes: 10 } },
    { id: 'perfect_30', name: 'Безупречный', desc: '30 мин без пропусков', icon: '💎', reward: { coins: 500, gems: 20 }, condition: { perfectMinutes: 30 } },
    { id: 'perfect_60', name: 'Алмазный Фокус', desc: '60 мин без единого пропуска', icon: '💠', reward: { coins: 1000, gems: 50 }, condition: { perfectMinutes: 60 } },
    { id: 'perfect_sessions_10', name: '10 Идеальных Сессий', desc: '10 сессий без пропусков', icon: '🎯', reward: { coins: 1500, gems: 40 }, condition: { perfectSessions: 10 } },
    { id: 'perfect_sessions_50', name: '50 Идеальных Сессий', desc: '50 сессий без пропусков', icon: '🎯', reward: { coins: 5000, gems: 150 }, condition: { perfectSessions: 50 } },
    { id: 'perfect_sessions_100', name: '100 Идеальных Сессий', desc: 'Мастер концентрации', icon: '🏆', reward: { coins: 10000, gems: 300 }, condition: { perfectSessions: 100 } },

    // === УРОВНИ ===
    { id: 'level_5', name: 'Новичок', desc: 'Достигнуть 5 уровня', icon: '📿', reward: { coins: 200 }, condition: { level: 5 } },
    { id: 'level_10', name: 'Ученик', desc: 'Достигнуть 10 уровня', icon: '📿', reward: { coins: 500 }, condition: { level: 10 } },
    { id: 'level_25', name: 'Адепт', desc: 'Достигнуть 25 уровня', icon: '🧘', reward: { coins: 1500, gems: 25 }, condition: { level: 25 } },
    { id: 'level_50', name: 'Мудрец', desc: 'Достигнуть 50 уровня', icon: '🔮', reward: { coins: 3000, gems: 75 }, condition: { level: 50 } },
    { id: 'level_75', name: 'Наставник', desc: 'Достигнуть 75 уровня', icon: '📖', reward: { coins: 6000, gems: 150 }, condition: { level: 75 } },
    { id: 'level_100', name: 'Мастер', desc: 'Достигнуть 100 уровня', icon: '👑', reward: { coins: 10000, gems: 200 }, condition: { level: 100 } },
    { id: 'level_150', name: 'Великий Мастер', desc: 'Достигнуть 150 уровня', icon: '🌟', reward: { coins: 25000, gems: 500 }, condition: { level: 150 } },
    { id: 'level_200', name: 'Легенда', desc: 'Достигнуть 200 уровня', icon: '✨', reward: { coins: 50000, gems: 1000 }, condition: { level: 200 } },

    // === ИССЛЕДОВАНИЕ ЗОН ===
    { id: 'visit_mountains', name: 'Покоритель Гор', desc: 'Посетить горы', icon: '🏔️', reward: { coins: 300, xp: 100 }, condition: { visitedZone: 'mountains' } },
    { id: 'visit_desert', name: 'Странник Пустыни', desc: 'Посетить пустыню', icon: '🏜️', reward: { coins: 300, xp: 100 }, condition: { visitedZone: 'desert' } },
    { id: 'visit_forest', name: 'Лесной Путник', desc: 'Посетить тёмный лес', icon: '🌲', reward: { coins: 300, xp: 100 }, condition: { visitedZone: 'forest' } },
    { id: 'visit_beach', name: 'Морской Путешественник', desc: 'Посетить побережье', icon: '🌊', reward: { coins: 300, xp: 100 }, condition: { visitedZone: 'beach' } },
    { id: 'visit_caves', name: 'Исследователь Глубин', desc: 'Посетить пещеры', icon: '🕳️', reward: { coins: 500, xp: 150 }, condition: { visitedZone: 'caves' } },
    { id: 'visit_all_zones', name: 'Великий Путешественник', desc: 'Посетить все зоны', icon: '🗺️', reward: { coins: 2000, gems: 100 }, condition: { allZonesVisited: true } },

    // === СОЦИАЛЬНЫЕ ===
    { id: 'meet_master', name: 'Встреча с Мастером', desc: 'Поговорить с просветлённым', icon: '🙏', reward: { coins: 100, xp: 50 }, condition: { dialogues: 1 } },
    { id: 'ten_dialogues', name: 'Искатель Мудрости', desc: '10 диалогов с NPC', icon: '💬', reward: { coins: 300, xp: 150 }, condition: { dialogues: 10 } },
    { id: 'fifty_dialogues', name: 'Дипломат', desc: '50 диалогов с NPC', icon: '🗣️', reward: { coins: 1000, gems: 30 }, condition: { dialogues: 50 } },
    { id: 'hundred_dialogues', name: 'Мастер Общения', desc: '100 диалогов', icon: '🤝', reward: { coins: 2500, gems: 75 }, condition: { dialogues: 100 } },
    { id: 'meet_all_masters', name: 'Ученик Всех Мастеров', desc: 'Поговорить со всеми мастерами', icon: '👥', reward: { coins: 5000, gems: 200 }, condition: { allMastersMet: true } },

    // === ГАЧА ===
    { id: 'first_pull', name: 'Первый Призыв', desc: 'Сделать призыв в Храме', icon: '🎰', reward: { xp: 50 }, condition: { pulls: 1 } },
    { id: 'ten_pulls', name: 'Азартный', desc: '10 призывов', icon: '🎰', reward: { coins: 200 }, condition: { pulls: 10 } },
    { id: 'fifty_pulls', name: 'Коллекционер', desc: '50 призывов', icon: '🎲', reward: { coins: 1000, gems: 30 }, condition: { pulls: 50 } },
    { id: 'hundred_pulls', name: 'Охотник за Редкостями', desc: '100 призывов', icon: '🔮', reward: { coins: 3000, gems: 100 }, condition: { pulls: 100 } },
    { id: 'legendary_pull', name: 'Легендарная Удача', desc: 'Получить легендарный предмет', icon: '⭐', reward: { coins: 1000 }, condition: { legendaryItems: 1 } },
    { id: 'five_legendary', name: 'Любимец Фортуны', desc: '5 легендарных предметов', icon: '🌟', reward: { coins: 5000, gems: 200 }, condition: { legendaryItems: 5 } },
    { id: 'pity_reached', name: 'Терпение вознаграждено', desc: 'Дойти до гарантии (90 призывов)', icon: '💫', reward: { coins: 2000 }, condition: { pityReached: 1 } },

    // === КОЛЛЕКЦИОНИРОВАНИЕ ===
    { id: 'collect_5_skins', name: 'Гардероб', desc: '5 разных скинов', icon: '👔', reward: { coins: 500 }, condition: { skinsCount: 5 } },
    { id: 'collect_10_skins', name: 'Модник', desc: '10 разных скинов', icon: '👕', reward: { coins: 1500, gems: 30 }, condition: { skinsCount: 10 } },
    { id: 'collect_all_skins', name: 'Полный Гардероб', desc: 'Все скины', icon: '👑', reward: { coins: 20000, gems: 500 }, condition: { allSkins: true } },
    { id: 'collect_5_auras', name: 'Сияющий', desc: '5 аур', icon: '💠', reward: { coins: 1000, gems: 25 }, condition: { aurasCount: 5 } },
    { id: 'collect_all_auras', name: 'Радужное Сияние', desc: 'Все ауры', icon: '🌈', reward: { coins: 15000, gems: 400 }, condition: { allAuras: true } },
    { id: 'collect_5_companions', name: 'Друг Животных', desc: '5 спутников', icon: '🐾', reward: { coins: 2000, gems: 50 }, condition: { companionsCount: 5 } },
    { id: 'collect_all_companions', name: 'Повелитель Зверей', desc: 'Все спутники', icon: '🦄', reward: { coins: 25000, gems: 600 }, condition: { allCompanions: true } },

    // === КВЕСТЫ ===
    { id: 'first_daily', name: 'Начало Дня', desc: 'Выполнить первый ежедневный квест', icon: '📋', reward: { coins: 100 }, condition: { dailyQuestsCompleted: 1 } },
    { id: 'all_daily', name: 'Трудоголик', desc: 'Выполнить все ежедневные квесты за день', icon: '✅', reward: { coins: 500, gems: 20 }, condition: { allDailyInDay: true } },
    { id: 'weekly_complete', name: 'Недельный Марафон', desc: 'Выполнить еженедельный квест', icon: '📅', reward: { coins: 1000, gems: 30 }, condition: { weeklyQuestsCompleted: 1 } },
    { id: 'all_weekly', name: 'Мастер Недели', desc: 'Выполнить все еженедельные квесты', icon: '🏆', reward: { coins: 3000, gems: 100 }, condition: { allWeeklyInWeek: true } },

    // === ОСОБЫЕ ===
    { id: 'night_meditation', name: 'Ночной Практик', desc: 'Медитация после полуночи', icon: '🌙', reward: { coins: 300, xp: 100 }, condition: { nightMeditation: true } },
    { id: 'morning_meditation', name: 'Утренний Ритуал', desc: 'Медитация до 7 утра', icon: '🌅', reward: { coins: 300, xp: 100 }, condition: { morningMeditation: true } },
    { id: 'marathon_2hours', name: 'Марафон', desc: 'Одна сессия 2+ часа', icon: '🏃', reward: { coins: 3000, gems: 100 }, condition: { singleSession: 120 } },
    { id: 'marathon_4hours', name: 'Ультра-Марафон', desc: 'Одна сессия 4+ часа', icon: '🦸', reward: { coins: 8000, gems: 250 }, condition: { singleSession: 240 } }
];

window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
