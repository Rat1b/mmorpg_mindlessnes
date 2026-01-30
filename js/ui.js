// ========================================
// UI - Panel toggles and controls
// ========================================

let activePanels = new Set();

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (activePanels.has(panelId)) {
        panel.classList.remove('active');
        activePanels.delete(panelId);
    } else {
        // Close other panels
        activePanels.forEach(id => {
            document.getElementById(id).classList.remove('active');
        });
        activePanels.clear();

        panel.classList.add('active');
        activePanels.add(panelId);

        // Update content if needed
        if (panelId === 'gacha-panel') {
            updateInventoryDisplay();
            updateSkinsDisplay();
        }
        if (panelId === 'achievements-panel') {
            updateAchievementsDisplay();
        }
    }
}

function toggleMeditationPanel() { togglePanel('meditation-panel'); }
function toggleStatsPanel() { togglePanel('stats-panel'); }
function toggleGachaPanel() { togglePanel('gacha-panel'); }
function toggleSettingsPanel() { togglePanel('settings-panel'); }
function toggleAchievementsPanel() { togglePanel('achievements-panel'); }

function updateAchievementsDisplay() {
    const gameState = window.game.gameState;
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    ACHIEVEMENTS_DATA.forEach(ach => {
        const unlocked = gameState.achievements.includes(ach.id);
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

function updatePlayerName() {
    const name = document.getElementById('player-name-input').value.trim();
    if (name) {
        window.game.gameState.player.name = name;
        window.game.player.name = name;
        storage.saveGame(window.game.gameState);
        updateHUD(window.game.gameState);
    }
}

function updatePlayerAge() {
    const age = parseInt(document.getElementById('player-age-input').value);
    if (age >= 1 && age <= 150) {
        window.game.gameState.player.age = age;
        window.game.player.age = age;
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

    // Gacha tabs
    document.querySelectorAll('.gacha-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.gacha-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');

            if (tabName === 'inventory') updateInventoryDisplay();
            if (tabName === 'skins') updateSkinsDisplay();
        });
    });
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

window.toggleMeditationPanel = toggleMeditationPanel;
window.toggleStatsPanel = toggleStatsPanel;
window.toggleGachaPanel = toggleGachaPanel;
window.toggleSettingsPanel = toggleSettingsPanel;
window.toggleAchievementsPanel = toggleAchievementsPanel;
window.updatePlayerName = updatePlayerName;
window.updatePlayerAge = updatePlayerAge;
window.setupDpad = setupDpad;

