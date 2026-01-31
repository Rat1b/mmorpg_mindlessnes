// ========================================
// Gacha Data - Расширенная гача система
// ========================================

const GACHA_ITEMS = {
    skins: [
        // Common (60%)
        { id: 'skin_casual', name: 'Повседневный', rarity: 'common', emoji: '👤', type: 'skin' },
        { id: 'skin_sporty', name: 'Спортивный', rarity: 'common', emoji: '🏃', type: 'skin' },
        { id: 'skin_student', name: 'Студент', rarity: 'common', emoji: '📚', type: 'skin' },
        { id: 'skin_traveler', name: 'Путешественник', rarity: 'common', emoji: '🎒', type: 'skin' },
        { id: 'skin_gardener', name: 'Садовник', rarity: 'common', emoji: '🌱', type: 'skin' },
        { id: 'skin_artist', name: 'Художник', rarity: 'common', emoji: '🎨', type: 'skin' },

        // Uncommon (25%)
        { id: 'skin_yogi', name: 'Йогин', rarity: 'uncommon', emoji: '🧘', type: 'skin' },
        { id: 'skin_monk_white', name: 'Белый Монах', rarity: 'uncommon', emoji: '⚪', type: 'skin' },
        { id: 'skin_meditator', name: 'Медитатор', rarity: 'uncommon', emoji: '🙏', type: 'skin' },
        { id: 'skin_pilgrim', name: 'Паломник', rarity: 'uncommon', emoji: '🚶', type: 'skin' },
        { id: 'skin_scholar', name: 'Учёный', rarity: 'uncommon', emoji: '📖', type: 'skin' },

        // Rare (10%)
        { id: 'skin_sadhu', name: 'Садху', rarity: 'rare', emoji: '🕉️', type: 'skin' },
        { id: 'skin_zen', name: 'Дзен-Мастер', rarity: 'rare', emoji: '☯️', type: 'skin' },
        { id: 'skin_hermit', name: 'Отшельник', rarity: 'rare', emoji: '🏔️', type: 'skin' },
        { id: 'skin_shaman', name: 'Шаман', rarity: 'rare', emoji: '🔮', type: 'skin' },
        { id: 'skin_druid', name: 'Друид', rarity: 'rare', emoji: '🌲', type: 'skin' },
        { id: 'skin_sufi', name: 'Суфий', rarity: 'rare', emoji: '🌀', type: 'skin' },

        // Epic (4%)
        { id: 'skin_avatar', name: 'Аватар', rarity: 'epic', emoji: '✨', type: 'skin' },
        { id: 'skin_celestial', name: 'Небожитель', rarity: 'epic', emoji: '👼', type: 'skin' },
        { id: 'skin_fire_yogi', name: 'Огненный Йог', rarity: 'epic', emoji: '🔥', type: 'skin' },
        { id: 'skin_water_master', name: 'Водный Мастер', rarity: 'epic', emoji: '💧', type: 'skin' },
        { id: 'skin_wind_walker', name: 'Ходящий по Ветру', rarity: 'epic', emoji: '🌪️', type: 'skin' },

        // Legendary (1%)
        { id: 'skin_buddha', name: 'Образ Будды', rarity: 'legendary', emoji: '☸️', type: 'skin' },
        { id: 'skin_shiva', name: 'Образ Шивы', rarity: 'legendary', emoji: '🔱', type: 'skin' },
        { id: 'skin_cosmic', name: 'Космический Странник', rarity: 'legendary', emoji: '🌌', type: 'skin' },
        { id: 'skin_rainbow', name: 'Радужный Мастер', rarity: 'legendary', emoji: '🌈', type: 'skin' }
    ],

    auras: [
        // Uncommon
        { id: 'aura_peace', name: 'Аура Покоя', rarity: 'uncommon', emoji: '💙', type: 'aura', color: '#87CEEB' },
        { id: 'aura_nature', name: 'Лесной Свет', rarity: 'uncommon', emoji: '💚', type: 'aura', color: '#90EE90' },

        // Rare
        { id: 'aura_gold', name: 'Золотое Сияние', rarity: 'rare', emoji: '💛', type: 'aura', color: '#FFD700' },
        { id: 'aura_lotus', name: 'Лотосовый Свет', rarity: 'rare', emoji: '🌸', type: 'aura', color: '#FF69B4' },
        { id: 'aura_ocean', name: 'Океанская Волна', rarity: 'rare', emoji: '🌊', type: 'aura', color: '#00CED1' },
        { id: 'aura_sunset', name: 'Закатное Сияние', rarity: 'rare', emoji: '🌅', type: 'aura', color: '#FF6347' },

        // Epic
        { id: 'aura_cosmic', name: 'Космическая', rarity: 'epic', emoji: '🌌', type: 'aura', color: '#9400D3' },
        { id: 'aura_thunder', name: 'Грозовая', rarity: 'epic', emoji: '⚡', type: 'aura', color: '#FFD700' },
        { id: 'aura_flame', name: 'Пламенная', rarity: 'epic', emoji: '🔥', type: 'aura', color: '#FF4500' },

        // Legendary
        { id: 'aura_divine', name: 'Божественная', rarity: 'legendary', emoji: '⭐', type: 'aura', color: '#FFFFFF' },
        { id: 'aura_rainbow', name: 'Радужная Аура', rarity: 'legendary', emoji: '🌈', type: 'aura', color: 'rainbow' },
        { id: 'aura_void', name: 'Аура Пустоты', rarity: 'legendary', emoji: '🌑', type: 'aura', color: '#1a1a2e' }
    ],

    titles: [
        // Common
        { id: 'title_seeker', name: 'Искатель', rarity: 'common', emoji: '🔍', type: 'title' },
        { id: 'title_wanderer', name: 'Странник', rarity: 'common', emoji: '🚶', type: 'title' },

        // Uncommon
        { id: 'title_practitioner', name: 'Практикующий', rarity: 'uncommon', emoji: '🧘', type: 'title' },
        { id: 'title_dreamer', name: 'Мечтатель', rarity: 'uncommon', emoji: '💭', type: 'title' },
        { id: 'title_explorer', name: 'Исследователь', rarity: 'uncommon', emoji: '🧭', type: 'title' },

        // Rare
        { id: 'title_devoted', name: 'Преданный', rarity: 'rare', emoji: '❤️', type: 'title' },
        { id: 'title_sage', name: 'Мудрец', rarity: 'rare', emoji: '📚', type: 'title' },
        { id: 'title_healer', name: 'Целитель', rarity: 'rare', emoji: '💚', type: 'title' },

        // Epic
        { id: 'title_enlightened', name: 'Просветлённый', rarity: 'epic', emoji: '✨', type: 'title' },
        { id: 'title_guardian', name: 'Хранитель', rarity: 'epic', emoji: '🛡️', type: 'title' },
        { id: 'title_oracle', name: 'Оракул', rarity: 'epic', emoji: '🔮', type: 'title' },

        // Legendary
        { id: 'title_master', name: 'Великий Мастер', rarity: 'legendary', emoji: '👑', type: 'title' },
        { id: 'title_immortal', name: 'Бессмертный', rarity: 'legendary', emoji: '♾️', type: 'title' }
    ],

    // НОВАЯ КАТЕГОРИЯ: Артефакты (дают бонусы)
    artifacts: [
        // Uncommon
        { id: 'artifact_beads', name: 'Чётки Искателя', rarity: 'uncommon', emoji: '📿', type: 'artifact', bonus: { coins: 0.05 } },
        { id: 'artifact_incense', name: 'Благовония Покоя', rarity: 'uncommon', emoji: '🕯️', type: 'artifact', bonus: { xp: 0.05 } },

        // Rare
        { id: 'artifact_crystal', name: 'Кристалл Ясности', rarity: 'rare', emoji: '💎', type: 'artifact', bonus: { coins: 0.10 } },
        { id: 'artifact_bell', name: 'Колокол Осознанности', rarity: 'rare', emoji: '🔔', type: 'artifact', bonus: { penalty_reduce: 0.20 } },
        { id: 'artifact_scroll', name: 'Древний Свиток', rarity: 'rare', emoji: '📜', type: 'artifact', bonus: { xp: 0.10 } },

        // Epic
        { id: 'artifact_lotus', name: 'Лотос Просветления', rarity: 'epic', emoji: '🌸', type: 'artifact', bonus: { coins: 0.15, xp: 0.10 } },
        { id: 'artifact_om', name: 'Символ Ом', rarity: 'epic', emoji: '🕉️', type: 'artifact', bonus: { xp: 0.20 } },
        { id: 'artifact_eye', name: 'Третий Глаз', rarity: 'epic', emoji: '👁️', type: 'artifact', bonus: { penalty_reduce: 0.40 } },

        // Legendary
        { id: 'artifact_buddha_beads', name: 'Чётки Будды', rarity: 'legendary', emoji: '☸️', type: 'artifact', bonus: { coins: 0.25, xp: 0.25 } },
        { id: 'artifact_shiva_trishula', name: 'Трезубец Шивы', rarity: 'legendary', emoji: '🔱', type: 'artifact', bonus: { coins: 0.30, penalty_reduce: 0.50 } }
    ],

    // НОВАЯ КАТЕГОРИЯ: Спутники (питомцы)
    companions: [
        // Uncommon
        { id: 'companion_butterfly', name: 'Бабочка Трансформации', rarity: 'uncommon', emoji: '🦋', type: 'companion' },
        { id: 'companion_bird', name: 'Птица Свободы', rarity: 'uncommon', emoji: '🐦', type: 'companion' },

        // Rare
        { id: 'companion_deer', name: 'Олень Леса', rarity: 'rare', emoji: '🦌', type: 'companion' },
        { id: 'companion_owl', name: 'Сова Мудрости', rarity: 'rare', emoji: '🦉', type: 'companion' },
        { id: 'companion_fox', name: 'Лис-Хранитель', rarity: 'rare', emoji: '🦊', type: 'companion' },

        // Epic
        { id: 'companion_phoenix', name: 'Феникс Возрождения', rarity: 'epic', emoji: '🔥', type: 'companion' },
        { id: 'companion_dragon_small', name: 'Дракончик Мудрости', rarity: 'epic', emoji: '🐉', type: 'companion' },
        { id: 'companion_spirit', name: 'Дух-Хранитель', rarity: 'epic', emoji: '👻', type: 'companion' },

        // Legendary
        { id: 'companion_dragon', name: 'Великий Дракон', rarity: 'legendary', emoji: '🐲', type: 'companion' },
        { id: 'companion_unicorn', name: 'Единорог Чистоты', rarity: 'legendary', emoji: '🦄', type: 'companion' },
        { id: 'companion_dove', name: 'Голубь Мира', rarity: 'legendary', emoji: '🕊️', type: 'companion' }
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

// Баннеры гачи
const GACHA_BANNERS = {
    standard: {
        id: 'standard',
        name: 'Колесо Сансары',
        icon: '🔮',
        pools: ['skins', 'auras', 'titles', 'artifacts'],
        costSingle: 1000,
        costMulti: 9000
    },
    companions: {
        id: 'companions',
        name: 'Духи-Спутники',
        icon: '🐾',
        pools: ['companions'],
        costSingle: 1500,
        costMulti: 13500,
        rateBoost: { rare: 0.02, epic: 0.01 } // Повышенный шанс
    },
    limited: {
        id: 'limited',
        name: 'Лимитированный Баннер',
        icon: '⭐',
        pools: ['skins', 'auras'],
        costSingle: 1200,
        costMulti: 10800,
        featuredItems: [], // Заполняется динамически
        featuredBoost: 2.0 // Удвоенный шанс на featured
    }
};

function getGachaPull(bannerId = 'standard') {
    const banner = GACHA_BANNERS[bannerId] || GACHA_BANNERS.standard;

    // Определяем редкость
    const roll = Math.random();
    let cumulative = 0;
    let selectedRarity = 'common';

    // Применяем бусты баннера если есть
    const rates = { ...RARITY_RATES };
    if (banner.rateBoost) {
        Object.entries(banner.rateBoost).forEach(([rarity, boost]) => {
            rates[rarity] = (rates[rarity] || 0) + boost;
        });
    }

    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (roll < cumulative) {
            selectedRarity = rarity;
            break;
        }
    }

    // Собираем все предметы из пулов баннера
    let allItems = [];
    banner.pools.forEach(pool => {
        if (GACHA_ITEMS[pool]) {
            allItems = allItems.concat(GACHA_ITEMS[pool]);
        }
    });

    const rarityItems = allItems.filter(i => i.rarity === selectedRarity);

    if (rarityItems.length === 0) {
        // Fallback - вернуть что-то
        return GACHA_ITEMS.skins[0];
    }

    return rarityItems[Math.floor(Math.random() * rarityItems.length)];
}

window.GACHA_ITEMS = GACHA_ITEMS;
window.RARITY_RATES = RARITY_RATES;
window.RARITY_COLORS = RARITY_COLORS;
window.GACHA_BANNERS = GACHA_BANNERS;
window.getGachaPull = getGachaPull;
