// ========================================
// Gacha Data - Гача система
// ========================================

const GACHA_ITEMS = {
    skins: [
        // Common (60%)
        { id: 'skin_casual', name: 'Повседневный', rarity: 'common', emoji: '👤', type: 'skin' },
        { id: 'skin_sporty', name: 'Спортивный', rarity: 'common', emoji: '🏃', type: 'skin' },
        { id: 'skin_student', name: 'Студент', rarity: 'common', emoji: '📚', type: 'skin' },
        { id: 'skin_traveler', name: 'Путешественник', rarity: 'common', emoji: '🎒', type: 'skin' },
        // Uncommon (25%)
        { id: 'skin_yogi', name: 'Йогин', rarity: 'uncommon', emoji: '🧘', type: 'skin' },
        { id: 'skin_monk_white', name: 'Белый Монах', rarity: 'uncommon', emoji: '⚪', type: 'skin' },
        { id: 'skin_meditator', name: 'Медитатор', rarity: 'uncommon', emoji: '🙏', type: 'skin' },
        // Rare (10%)
        { id: 'skin_sadhu', name: 'Садху', rarity: 'rare', emoji: '🕉️', type: 'skin' },
        { id: 'skin_zen', name: 'Дзен-Мастер', rarity: 'rare', emoji: '☯️', type: 'skin' },
        { id: 'skin_hermit', name: 'Отшельник', rarity: 'rare', emoji: '🏔️', type: 'skin' },
        // Epic (4%)
        { id: 'skin_avatar', name: 'Аватар', rarity: 'epic', emoji: '✨', type: 'skin' },
        { id: 'skin_celestial', name: 'Небожитель', rarity: 'epic', emoji: '👼', type: 'skin' },
        // Legendary (1%)
        { id: 'skin_buddha', name: 'Образ Будды', rarity: 'legendary', emoji: '☸️', type: 'skin' },
        { id: 'skin_shiva', name: 'Образ Шивы', rarity: 'legendary', emoji: '🔱', type: 'skin' }
    ],
    auras: [
        { id: 'aura_peace', name: 'Аура Покоя', rarity: 'uncommon', emoji: '💙', type: 'aura', color: '#87CEEB' },
        { id: 'aura_gold', name: 'Золотое Сияние', rarity: 'rare', emoji: '💛', type: 'aura', color: '#FFD700' },
        { id: 'aura_lotus', name: 'Лотосовый Свет', rarity: 'rare', emoji: '🌸', type: 'aura', color: '#FF69B4' },
        { id: 'aura_cosmic', name: 'Космическая', rarity: 'epic', emoji: '🌌', type: 'aura', color: '#9400D3' },
        { id: 'aura_divine', name: 'Божественная', rarity: 'legendary', emoji: '⭐', type: 'aura', color: '#FFFFFF' }
    ],
    titles: [
        { id: 'title_seeker', name: 'Искатель', rarity: 'common', type: 'title' },
        { id: 'title_practitioner', name: 'Практикующий', rarity: 'uncommon', type: 'title' },
        { id: 'title_devoted', name: 'Преданный', rarity: 'rare', type: 'title' },
        { id: 'title_enlightened', name: 'Просветлённый', rarity: 'epic', type: 'title' },
        { id: 'title_master', name: 'Великий Мастер', rarity: 'legendary', type: 'title' }
    ]
};

const RARITY_RATES = {
    common: 0.60,
    uncommon: 0.25,
    rare: 0.10,
    epic: 0.04,
    legendary: 0.01
};

const RARITY_COLORS = {
    common: '#9E9E9E',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FFD700'
};

function getGachaPull() {
    const roll = Math.random();
    let cumulative = 0;
    let selectedRarity = 'common';

    for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
        cumulative += rate;
        if (roll < cumulative) {
            selectedRarity = rarity;
            break;
        }
    }

    const allItems = [...GACHA_ITEMS.skins, ...GACHA_ITEMS.auras, ...GACHA_ITEMS.titles];
    const rarityItems = allItems.filter(i => i.rarity === selectedRarity);
    return rarityItems[Math.floor(Math.random() * rarityItems.length)];
}

window.GACHA_ITEMS = GACHA_ITEMS;
window.RARITY_RATES = RARITY_RATES;
window.RARITY_COLORS = RARITY_COLORS;
window.getGachaPull = getGachaPull;
