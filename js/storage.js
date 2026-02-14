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
    stats2: {
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
    // Система репутации с NPC
    npcReputation: {},  // { npcId: reputationValue 0-100 }
    activeChallenge: null,  // { npcId, minutes, maxMisses, startedAt }
    settings: {
        soundEnabled: true,
        musicEnabled: true
    },
    // Ежедневная цель и баннеры
    dailyGoal: {
        targetMinutes: 180  // 3 часа по умолчанию
    },
    collectedBanners: [],
    dailyGoalReachedToday: null,
    createdAt: Date.now(),
    lastSaved: Date.now()
};

function loadGame() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            return { ...DEFAULT_SAVE, ...data, player: { ...DEFAULT_SAVE.player, ...data.player }, stats: { ...DEFAULT_SAVE.stats, ...data.stats }, stats2: { ...DEFAULT_SAVE.stats2, ...data.stats2 }, currency: { ...DEFAULT_SAVE.currency, ...data.currency }, settings: { ...DEFAULT_SAVE.settings, ...data.settings } };
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

function exportSaveWin() {
    const gameState = loadGame();
    const jsonStr = JSON.stringify(gameState, null, 2);
    const filename = `breath_awareness_save_${utils.getDateKey()}.json`;
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function exportSaveIOS() {
    const gameState = loadGame();
    const jsonStr = JSON.stringify(gameState, null, 2);

    // Копируем в буфер обмена
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert('✅ JSON скопирован в буфер обмена!\n\nОткрой приложение «Файлы» или «Заметки», вставь текст и сохрани как .json');
        }).catch(() => {
            showCopyFallback(jsonStr);
        });
    } else {
        showCopyFallback(jsonStr);
    }
}

function showCopyFallback(jsonStr) {
    // Показываем textarea для ручного копирования
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    const title = document.createElement('div');
    title.textContent = '📋 Выдели всё и скопируй:';
    title.style.cssText = 'color:white;font-size:16px;margin-bottom:10px;';

    const ta = document.createElement('textarea');
    ta.value = jsonStr;
    ta.style.cssText = 'width:100%;max-width:500px;height:60%;background:#1a1a2e;color:#0f0;border:1px solid #444;border-radius:8px;padding:10px;font-size:12px;font-family:monospace;';
    ta.readOnly = true;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ Закрыть';
    closeBtn.style.cssText = 'margin-top:10px;padding:10px 30px;background:#e74c3c;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(title);
    overlay.appendChild(ta);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // Выделяем текст
    ta.focus();
    ta.select();
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

function setTotalMinutes(minutes) {
    if (typeof minutes !== 'number' || minutes < 0) {
        alert('Введите корректное положительное число минут');
        return false;
    }
    const gameState = loadGame();
    const oldMinutes = gameState.stats.totalMinutes;
    gameState.stats.totalMinutes = minutes;
    saveGame(gameState);
    console.log(`Total minutes updated: ${oldMinutes} -> ${minutes}`);
    return true;
}

window.storage = { loadGame, saveGame, exportSaveWin, exportSaveIOS, importSaveData, updateStreak, setTotalMinutes, DEFAULT_SAVE };
