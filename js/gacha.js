// ========================================
// Gacha - Gacha pull system
// ========================================

function doGachaPull(count) {
    const gameState = window.game.gameState;
    const cost = count === 1 ? 1000 : 9000;

    if (gameState.currency.pranaCoins < cost) {
        alert('Недостаточно Праны! Медитируй больше 🧘');
        return;
    }

    gameState.currency.pranaCoins -= cost;
    gameState.gachaPity += count;

    const results = [];
    for (let i = 0; i < count; i++) {
        // Pity system: guarantee legendary at 90 pulls
        let item;
        if (gameState.gachaPity >= 90) {
            const legendaryItems = [...GACHA_ITEMS.skins, ...GACHA_ITEMS.auras, ...GACHA_ITEMS.titles]
                .filter(i => i.rarity === 'legendary');
            item = utils.randomChoice(legendaryItems);
            gameState.gachaPity = 0;
        } else {
            item = getGachaPull();
        }
        results.push(item);

        // Add to inventory
        if (!gameState.inventory.find(i => i.id === item.id)) {
            gameState.inventory.push({ ...item, count: 1 });
        } else {
            gameState.inventory.find(i => i.id === item.id).count++;
        }

        // Unlock if applicable
        if (item.type === 'skin' && !gameState.unlockedSkins.includes(item.id)) {
            gameState.unlockedSkins.push(item.id);
        }
        if (item.type === 'aura' && !gameState.unlockedAuras.includes(item.id)) {
            gameState.unlockedAuras.push(item.id);
        }
        if (item.type === 'title' && !gameState.unlockedTitles.includes(item.id)) {
            gameState.unlockedTitles.push(item.id);
        }
    }

    storage.saveGame(gameState);
    updateHUD(gameState);
    document.getElementById('pity-counter').textContent = gameState.gachaPity;

    showGachaResults(results);
}

function showGachaResults(results) {
    const rewards = results.map(item => ({
        icon: item.emoji,
        amount: item.name,
        label: getRarityLabel(item.rarity)
    }));

    showRewardPopup(rewards);
}

function getRarityLabel(rarity) {
    const labels = {
        common: '⚪ Обычный',
        uncommon: '🟢 Необычный',
        rare: '🔵 Редкий',
        epic: '🟣 Эпический',
        legendary: '🟡 Легендарный'
    };
    return labels[rarity] || rarity;
}

function updateInventoryDisplay() {
    const gameState = window.game.gameState;
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';

    if (gameState.inventory.length === 0) {
        grid.innerHTML = '<div style="color:#888; text-align:center; padding:20px;">Инвентарь пуст. Призови предметы!</div>';
        return;
    }

    gameState.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = `inventory-item ${item.rarity}`;

        // Показать если экипирован
        const isEquipped = (item.type === 'aura' && gameState.player.aura === item.id) ||
            (item.type === 'title' && gameState.player.title === item.id);

        div.innerHTML = `
            <span>${item.emoji}</span>
            ${item.count > 1 ? `<span class="item-count">×${item.count}</span>` : ''}
            ${isEquipped ? '<span class="equipped-badge">✓</span>' : ''}
        `;
        div.title = `${item.name} (${getRarityLabel(item.rarity)})${isEquipped ? ' — ВЫБРАНО' : ''}\nКлик — надеть`;

        // Клик для экипировки
        div.onclick = () => equipItem(item);

        grid.appendChild(div);
    });
}

function equipItem(item) {
    const gameState = window.game.gameState;

    if (item.type === 'aura') {
        // Toggle - если уже надета, снять
        if (gameState.player.aura === item.id) {
            gameState.player.aura = null;
            if (window.game.player) {
                window.game.player.auraColor = null;
            }
            storage.saveGame(gameState);
            updateInventoryDisplay();
            showNotification(`❌ Аура "${item.name}" снята`);
            return;
        }

        gameState.player.aura = item.id;
        // Найти цвет ауры
        const auraData = GACHA_ITEMS.auras.find(a => a.id === item.id);
        if (auraData && window.game.player) {
            window.game.player.auraColor = auraData.color;
        }
        storage.saveGame(gameState);
        updateInventoryDisplay();
        showNotification(`✨ Аура "${item.name}" активирована!`);
    } else if (item.type === 'title') {
        // Toggle
        if (gameState.player.title === item.id) {
            gameState.player.title = null;
            storage.saveGame(gameState);
            updateInventoryDisplay();
            showNotification(`❌ Титул "${item.name}" снят`);
            return;
        }

        gameState.player.title = item.id;
        storage.saveGame(gameState);
        updateInventoryDisplay();
        showNotification(`🎖️ Титул "${item.name}" выбран!`);
    } else if (item.type === 'skin') {
        // Toggle
        if (gameState.player.skin === item.id) {
            gameState.player.skin = 'skin_casual'; // Возврат к дефолту

            // Reset player appearance
            if (window.game && window.game.player) {
                window.game.player.skin = 'skin_casual';
                window.game.player.emoji = '👤'; // Default emoji
            }

            storage.saveGame(gameState);
            updateInventoryDisplay();
            showNotification(`❌ Образ "${item.name}" снят`);
            return;
        }

        gameState.player.skin = item.id;

        // Apply new skin immediately
        if (window.game && window.game.player) {
            window.game.player.skin = item.id;
            window.game.player.emoji = item.emoji; // Update emoji
        }

        storage.saveGame(gameState);
        updateInventoryDisplay();
        showNotification(`👕 Образ "${item.name}" выбран!`);
    }
}

function showNotification(text) {
    // Простое уведомление
    const notif = document.createElement('div');
    notif.className = 'game-notification';
    notif.textContent = text;
    notif.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.85);
        color: #FFD700;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 10000;
        animation: fadeInOut 2s ease-out forwards;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

function updateSkinsDisplay() {
    const gameState = window.game.gameState;
    const grid = document.getElementById('skins-grid');
    grid.innerHTML = '';

    const allSkins = GACHA_ITEMS.skins;
    allSkins.forEach(skin => {
        const unlocked = gameState.unlockedSkins.includes(skin.id);
        const div = document.createElement('div');
        div.className = `skin-item ${skin.rarity} ${unlocked ? '' : 'locked'}`;
        div.innerHTML = `<span>${unlocked ? skin.emoji : '🔒'}</span>`;
        div.title = unlocked ? skin.name : 'Заблокировано';

        if (unlocked) {
            div.onclick = () => {
                // Update save state
                gameState.player.skin = skin.id;

                // Update live player object
                if (window.game && window.game.player) {
                    window.game.player.skin = skin.id;
                    window.game.player.emoji = skin.emoji;
                }

                storage.saveGame(gameState);
                alert(`Образ "${skin.name}" выбран!`);
                updateSkinsDisplay(); // Refresh UI to show lock change
            };
        }
        grid.appendChild(div);
    });
}

window.doGachaPull = doGachaPull;
window.updateInventoryDisplay = updateInventoryDisplay;
window.updateSkinsDisplay = updateSkinsDisplay;
window.equipItem = equipItem;
window.showNotification = showNotification;
