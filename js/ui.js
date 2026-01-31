// ========================================
// UI - Panel toggles and controls
// ========================================

let activePanels = new Set();

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    if (activePanels.has(panelId)) {
        panel.classList.remove('active');
        activePanels.delete(panelId);
    } else {
        // Close other panels
        activePanels.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        activePanels.clear();

        panel.classList.add('active');
        activePanels.add(panelId);

        // Update content if needed
        if (panelId === 'gacha-panel') {
            if (window.updateInventoryDisplay) window.updateInventoryDisplay();
            if (window.updateSkinsDisplay) window.updateSkinsDisplay();
        }
        if (panelId === 'achievements-panel') {
            updateAchievementsDisplay();
        }
        if (panelId === 'quests-panel') {
            updateQuestsDisplay();
        }
    }
}

function toggleMeditationPanel() { togglePanel('meditation-panel'); }
function toggleStatsPanel() { togglePanel('stats-panel'); }
function toggleGachaPanel() { togglePanel('gacha-panel'); }
function toggleSettingsPanel() { togglePanel('settings-panel'); }
function toggleAchievementsPanel() { togglePanel('achievements-panel'); }
function toggleQuestsPanel() { togglePanel('quests-panel'); }

function updateQuestsDisplay() {
    if (!window.game || !window.game.quests) return;

    const quests = window.game.quests.getAvailableQuests();

    // Ежедневные квесты
    const dailyList = document.getElementById('daily-quests-list');
    if (dailyList) {
        dailyList.innerHTML = '';
        if (quests.daily.length === 0) {
            dailyList.innerHTML = '<div style="padding:10px; opacity:0.6">Нет доступных квестов</div>';
        } else {
            quests.daily.forEach(quest => {
                const div = document.createElement('div');
                div.className = `quest-item ${quest.completed ? 'completed' : ''}`;
                const progressPercent = Math.min(100, (quest.progress / quest.max) * 100);
                div.innerHTML = `
                    <div class="quest-header">
                        <span class="quest-icon">${quest.icon}</span>
                        <span class="quest-name">${quest.name}</span>
                        ${quest.completed ? '<span class="completed-badge">✅</span>' : ''}
                    </div>
                    <div class="quest-desc">${quest.description}</div>
                    <div class="quest-progress-bar">
                        <div class="quest-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="quest-footer">
                        <span class="quest-progress-text">${Math.floor(quest.progress)} / ${quest.max}</span>
                        <span class="quest-reward">✨ ${quest.reward.coins} ${quest.reward.gems ? `💎 ${quest.reward.gems}` : ''}</span>
                    </div>
                `;
                dailyList.appendChild(div);
            });
        }
    }

    // Еженедельные квесты
    const weeklyList = document.getElementById('weekly-quests-list');
    if (weeklyList) {
        weeklyList.innerHTML = '';
        if (quests.weekly.length === 0) {
            weeklyList.innerHTML = '<div style="padding:10px; opacity:0.6">Нет доступных квестов</div>';
        } else {
            quests.weekly.forEach(quest => {
                const div = document.createElement('div');
                div.className = `quest-item ${quest.completed ? 'completed' : ''}`;
                const progressPercent = Math.min(100, (quest.progress / quest.max) * 100);
                div.innerHTML = `
                    <div class="quest-header">
                        <span class="quest-icon">${quest.icon}</span>
                        <span class="quest-name">${quest.name}</span>
                        ${quest.completed ? '<span class="completed-badge">✅</span>' : ''}
                    </div>
                    <div class="quest-desc">${quest.description}</div>
                    <div class="quest-progress-bar">
                        <div class="quest-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="quest-footer">
                        <span class="quest-progress-text">${Math.floor(quest.progress)} / ${quest.max}</span>
                        <span class="quest-reward">✨ ${quest.reward.coins} ${quest.reward.gems ? `💎 ${quest.reward.gems}` : ''}</span>
                    </div>
                `;
                weeklyList.appendChild(div);
            });
        }
    }
}

function updateAchievementsDisplay() {
    if (!window.game || !window.game.gameState) return;
    const gameState = window.game.gameState;
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (window.ACHIEVEMENTS_DATA) {
        window.ACHIEVEMENTS_DATA.forEach(ach => {
            const unlocked = gameState.achievements && gameState.achievements.includes(ach.id);
            const div = document.createElement('div');
            div.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <span class="icon">${ach.icon}</span>
                <div class="name">${ach.name}</div>
                <div class="desc">${ach.desc}</div>
                <div class="reward">✨ ${ach.reward.coins || 0} ${ach.reward.gems ? `💎 ${ach.reward.gems}` : ''}</div>
            `;
            grid.appendChild(div);
        });
    }
}

function updatePlayerName() {
    const input = document.getElementById('player-name-input');
    if (!input) return;
    const name = input.value.trim();
    if (name && window.game) {
        window.game.gameState.player.name = name;
        if (window.game.player) window.game.player.name = name;
        storage.saveGame(window.game.gameState);
        if (window.updateHUD) window.updateHUD(window.game.gameState);
    }
}

function updatePlayerAge() {
    const input = document.getElementById('player-age-input');
    if (!input) return;
    const age = parseInt(input.value);
    if (age >= 1 && age <= 150 && window.game) {
        window.game.gameState.player.age = age;
        if (window.game.player) window.game.player.age = age;
        storage.saveGame(window.game.gameState);
    }
}

// Timer presets
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.timer-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.dataset.minutes);
            if (window.game && window.game.meditation) {
                window.game.meditation.setDuration(minutes);
                document.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    });

    // Gacha & Quest tabs
    const setupTabs = (tabClass, contentClass) => {
        document.querySelectorAll(tabClass).forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                document.querySelectorAll(tabClass).forEach(t => t.classList.remove('active'));
                document.querySelectorAll(contentClass).forEach(c => c.classList.remove('active'));

                e.target.classList.add('active');
                const content = document.getElementById(tabName + '-tab');
                if (content) content.classList.add('active');

                if (tabName === 'inventory' && window.updateInventoryDisplay) window.updateInventoryDisplay();
                if (tabName === 'skins' && window.updateSkinsDisplay) window.updateSkinsDisplay();
            });
        });
    };

    setupTabs('.gacha-tab', '.tab-content');
    setupTabs('.quest-tab', '.tab-content');
});

// D-Pad стрелки управления
function setupDpad() {
    const dpad = document.getElementById('dpad');
    if (!dpad) return;

    const buttons = dpad.querySelectorAll('.dpad-btn');
    const pressedDirs = { up: false, down: false, left: false, right: false };

    function updateMovement() {
        if (!window.game) return;

        let dx = 0, dy = 0;
        if (pressedDirs.up) dy = -1;
        if (pressedDirs.down) dy = 1;
        if (pressedDirs.left) dx = -1;
        if (pressedDirs.right) dx = 1;

        window.game.dpadX = dx;
        window.game.dpadY = dy;
    }

    buttons.forEach(btn => {
        const dir = btn.dataset.dir;

        // Touch events
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressedDirs[dir] = true;
            btn.classList.add('pressed');
            updateMovement();
        });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            pressedDirs[dir] = false;
            btn.classList.remove('pressed');
            updateMovement();
        });

        // Mouse events  
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            pressedDirs[dir] = true;
            btn.classList.add('pressed');
            updateMovement();
        });

        btn.addEventListener('mouseup', (e) => {
            pressedDirs[dir] = false;
            btn.classList.remove('pressed');
            updateMovement();
        });

        btn.addEventListener('mouseleave', () => {
            pressedDirs[dir] = false;
            btn.classList.remove('pressed');
            updateMovement();
        });
    });

    // Global mouseup to release if mouse leaves button
    document.addEventListener('mouseup', () => {
        Object.keys(pressedDirs).forEach(k => pressedDirs[k] = false);
        buttons.forEach(b => b.classList.remove('pressed'));
        updateMovement();
    });
}

// Exports
window.toggleMeditationPanel = toggleMeditationPanel;
window.toggleStatsPanel = toggleStatsPanel;
window.toggleGachaPanel = toggleGachaPanel;
window.toggleSettingsPanel = toggleSettingsPanel;
window.toggleAchievementsPanel = toggleAchievementsPanel;
window.toggleQuestsPanel = toggleQuestsPanel;
window.updateQuestsDisplay = updateQuestsDisplay;
window.updatePlayerName = updatePlayerName;
window.updatePlayerAge = updatePlayerAge;
window.setupDpad = setupDpad;
