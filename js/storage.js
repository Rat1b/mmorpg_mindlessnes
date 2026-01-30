// ========================================
// Storage - Save/Load System
// ========================================

const STORAGE_KEY = 'breath_awareness_game_save';

const DEFAULT_SAVE = {
    version: 1,
    player: {
        name: 'Искатель',
        age: 18,
        skin: 'casual_male',
        aura: null,
        title: null,
        x: 400,
        y: 300
    },
    stats: {
        totalMinutes: 0,
        totalSessions: 0,
        totalMissedBreaths: 0,
        perfectSessions: 0,
        streak: 0,
        lastPracticeDate: null,
        dailyMinutes: {},
        weeklyMinutes: {},
        monthlyMinutes: {}
    },
    currency: {
        pranaCoins: 100,
        gems: 10
    },
    inventory: [],
    unlockedSkins: ['skin_casual'],
    unlockedAuras: [],
    unlockedTitles: ['title_seeker'],
    achievements: [],
    dialogueHistory: [],
    gachaPity: 0,
    settings: {
        soundEnabled: true,
        musicEnabled: true
    },
    createdAt: Date.now(),
    lastSaved: Date.now()
};

function loadGame() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            return { ...DEFAULT_SAVE, ...data, player: { ...DEFAULT_SAVE.player, ...data.player }, stats: { ...DEFAULT_SAVE.stats, ...data.stats }, currency: { ...DEFAULT_SAVE.currency, ...data.currency }, settings: { ...DEFAULT_SAVE.settings, ...data.settings } };
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
    return { ...DEFAULT_SAVE };
}

function saveGame(gameState) {
    try {
        gameState.lastSaved = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
}

function exportSaveData() {
    const gameState = loadGame();
    const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath_awareness_save_${utils.getDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importSaveData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.version) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                alert('Данные импортированы! Перезагрузка...');
                location.reload();
            } else {
                alert('Неверный формат файла');
            }
        } catch (err) {
            alert('Ошибка чтения файла');
        }
    };
    reader.readAsText(file);
}

function updateStreak(gameState) {
    const today = utils.getDateKey();
    const yesterday = utils.getDateKey(new Date(Date.now() - 86400000));

    if (gameState.stats.lastPracticeDate === today) return;

    if (gameState.stats.lastPracticeDate === yesterday) {
        gameState.stats.streak++;
    } else if (gameState.stats.lastPracticeDate !== today) {
        gameState.stats.streak = 1;
    }
    gameState.stats.lastPracticeDate = today;
}

window.storage = { loadGame, saveGame, exportSaveData, importSaveData, updateStreak, DEFAULT_SAVE };
