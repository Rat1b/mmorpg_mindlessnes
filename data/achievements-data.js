// ========================================
// Achievements Data - Достижения
// ========================================

const ACHIEVEMENTS_DATA = [
    // Первые шаги
    { id: 'first_breath', name: 'Первый Вдох', desc: 'Завершить первую сессию', icon: '🌱', reward: { coins: 50, xp: 100 }, condition: { totalMinutes: 1 } },
    { id: 'five_minutes', name: 'Начало Пути', desc: '5 минут осознанности', icon: '🌿', reward: { coins: 100, xp: 200 }, condition: { totalMinutes: 5 } },
    { id: 'thirty_minutes', name: 'Полчаса Покоя', desc: '30 минут практики', icon: '🌳', reward: { coins: 200, gems: 5 }, condition: { totalMinutes: 30 } },

    // Часы
    { id: 'one_hour', name: 'Час Тишины', desc: '1 час осознанности', icon: '⏰', reward: { coins: 500, gems: 10 }, condition: { totalMinutes: 60 } },
    { id: 'five_hours', name: 'Терпеливый', desc: '5 часов практики', icon: '🕐', reward: { coins: 1000, gems: 20 }, condition: { totalMinutes: 300 } },
    { id: 'ten_hours', name: 'Настойчивый', desc: '10 часов медитации', icon: '🕑', reward: { coins: 2000, gems: 50 }, condition: { totalMinutes: 600 } },
    { id: 'fifty_hours', name: 'Практик', desc: '50 часов', icon: '🕒', reward: { coins: 5000, gems: 100 }, condition: { totalMinutes: 3000 } },
    { id: 'hundred_hours', name: 'Мастер Дыхания', desc: '100 часов', icon: '🏆', reward: { coins: 10000, gems: 200 }, condition: { totalMinutes: 6000 } },
    { id: 'thousand_hours', name: 'Просветлённый', desc: '1000 часов', icon: '👑', reward: { coins: 50000, gems: 1000 }, condition: { totalMinutes: 60000 } },

    // Серии
    { id: 'streak_3', name: '3 Дня Подряд', desc: 'Практика 3 дня', icon: '🔥', reward: { coins: 100, gems: 5 }, condition: { streak: 3 } },
    { id: 'streak_7', name: 'Неделя Осознанности', desc: '7 дней без перерыва', icon: '🔥', reward: { coins: 300, gems: 15 }, condition: { streak: 7 } },
    { id: 'streak_30', name: 'Месяц Дисциплины', desc: '30 дней практики', icon: '💪', reward: { coins: 1000, gems: 50 }, condition: { streak: 30 } },
    { id: 'streak_100', name: '100 Дней!', desc: 'Легендарная серия', icon: '⚡', reward: { coins: 5000, gems: 200 }, condition: { streak: 100 } },
    { id: 'streak_365', name: 'Год Практики', desc: '365 дней!', icon: '🌟', reward: { coins: 20000, gems: 500 }, condition: { streak: 365 } },

    // Точность
    { id: 'perfect_10', name: 'Идеальные 10', desc: '10 мин без пропусков', icon: '✨', reward: { coins: 200, xp: 100 }, condition: { perfectMinutes: 10 } },
    { id: 'perfect_30', name: 'Безупречный', desc: '30 мин без пропусков', icon: '💎', reward: { coins: 500, gems: 20 }, condition: { perfectMinutes: 30 } },
    { id: 'perfect_60', name: 'Алмазный Фокус', desc: '60 мин без единого пропуска', icon: '💠', reward: { coins: 1000, gems: 50 }, condition: { perfectMinutes: 60 } },

    // Уровни
    { id: 'level_10', name: 'Ученик', desc: 'Достигнуть 10 уровня', icon: '📿', reward: { coins: 500 }, condition: { level: 10 } },
    { id: 'level_25', name: 'Адепт', desc: 'Достигнуть 25 уровня', icon: '🧘', reward: { coins: 1500, gems: 25 }, condition: { level: 25 } },
    { id: 'level_50', name: 'Мудрец', desc: 'Достигнуть 50 уровня', icon: '🔮', reward: { coins: 3000, gems: 75 }, condition: { level: 50 } },
    { id: 'level_100', name: 'Мастер', desc: 'Достигнуть 100 уровня', icon: '👑', reward: { coins: 10000, gems: 200 }, condition: { level: 100 } },

    // Социальные
    { id: 'meet_master', name: 'Встреча с Мастером', desc: 'Поговорить с просветлённым', icon: '🙏', reward: { coins: 100, xp: 50 }, condition: { dialogues: 1 } },
    { id: 'ten_dialogues', name: 'Искатель Мудрости', desc: '10 диалогов с NPC', icon: '💬', reward: { coins: 300, xp: 150 }, condition: { dialogues: 10 } },

    // Гача
    { id: 'first_pull', name: 'Первый Призыв', desc: 'Сделать призыв в Храме', icon: '🎰', reward: { xp: 50 }, condition: { pulls: 1 } },
    { id: 'legendary_pull', name: 'Легендарная Удача', desc: 'Получить легендарный предмет', icon: '⭐', reward: { coins: 1000 }, condition: { legendaryItems: 1 } }
];

window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
