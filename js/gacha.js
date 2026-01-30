// ========================================
// Gacha - Gacha pull system
// ========================================

function doGachaPull(count) {
    const gameState = window.game.gameState;
    const cost = count === 1 ? 100 : 900;

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

    gameState.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = `inventory-item ${item.rarity}`;
        div.innerHTML = `
            <span>${item.emoji}</span>
            ${item.count > 1 ? `<span class="item-count">×${item.count}</span>` : ''}
        `;
        div.title = `${item.name} (${getRarityLabel(item.rarity)})`;
        grid.appendChild(div);
    });
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
                gameState.player.skin = skin.id;
                storage.saveGame(gameState);
                alert(`Образ "${skin.name}" выбран!`);
            };
        }
        grid.appendChild(div);
    });
}

window.doGachaPull = doGachaPull;
window.updateInventoryDisplay = updateInventoryDisplay;
window.updateSkinsDisplay = updateSkinsDisplay;
