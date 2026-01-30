// ========================================
// Utils - Utility functions
// ========================================

function formatTime(minutes) {
    if (minutes < 60) return `${Math.round(minutes)} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours < 24) return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
    const days = Math.floor(hours / 24);
    return `${days} д ${hours % 24} ч`;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function calculateLevel(totalMinutes) {
    // 4 стадии компетентности:
    // 1. Неосознанная некомпетентность (0-10ч = Lv 1-10)   
    // 2. Осознанная некомпетентность (10-100ч = Lv 10-30)
    // 3. Осознанная компетентность (100-500ч = Lv 30-70)
    // 4. Неосознанная компетентность (500-1200ч = Lv 70-100, 1200+ = 100+)

    const hours = totalMinutes / 60;

    if (hours < 10) {
        // Первые шаги: быстрый рост поначалу
        return Math.floor(hours) + 1;
    } else if (hours < 100) {
        // Осознанное обучение: стабильный рост
        return 10 + Math.floor((hours - 10) / 4.5);  // ~20 уровней за 90ч
    } else if (hours < 500) {
        // Практика: замедленный рост
        return 30 + Math.floor((hours - 100) / 10);  // ~40 уровней за 400ч  
    } else if (hours < 1200) {
        // Мастерство: медленный рост
        return 70 + Math.floor((hours - 500) / 23.3);  // ~30 уровней за 700ч
    } else {
        // Эксперт: очень медленный рост после 1200ч
        return 100 + Math.floor((hours - 1200) / 100);
    }
}

function calculateXPForLevel(level) {
    // XP нужный для достижения уровня (в минутах)
    if (level <= 10) return level * 60;
    if (level <= 30) return 600 + (level - 10) * 270;
    if (level <= 70) return 6000 + (level - 30) * 600;
    if (level <= 100) return 30000 + (level - 70) * 1400;
    return 72000 + (level - 100) * 6000;
}

function calculateXPProgress(totalMinutes) {
    const level = calculateLevel(totalMinutes);
    const currentLevelXP = calculateXPForLevel(level);
    const nextLevelXP = calculateXPForLevel(level + 1);
    const progress = totalMinutes - currentLevelXP;
    const needed = nextLevelXP - currentLevelXP;
    return { level, progress: Math.max(0, progress), needed, percent: Math.min(100, Math.max(0, (progress / needed) * 100)) };
}

function getDateKey(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function getWeekKey(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().split('T')[0];
}

function getMonthKey(date = new Date()) {
    return date.toISOString().slice(0, 7);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.utils = {
    formatTime, formatNumber, randomRange, randomInt, randomChoice,
    clamp, lerp, distance, calculateLevel, calculateXPForLevel,
    calculateXPProgress, getDateKey, getWeekKey, getMonthKey, debounce
};
