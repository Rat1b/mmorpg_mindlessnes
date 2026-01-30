// ========================================
// Dialogues - NPC interaction system with Reputation
// ========================================

let currentDialogue = null;
let currentNPC = null;
let currentTypeInterval = null;

function openDialogue(npc) {
    currentNPC = npc;
    const gameState = window.game.gameState;

    // Получить репутацию с этим NPC
    const rep = reputation.getNpcReputation(gameState, npc.id);
    const repLevel = reputation.getReputationLevel(rep);

    // Мастер или обычный NPC?
    if (npc.isMaster || npc.type === 'master') {
        // Показать диалог мастера с практиками
        showMasterDialogue(npc, rep, repLevel);
    } else {
        // Обычный NPC - показать простой диалог
        showRegularNpcDialogue(npc);
    }

    document.getElementById('dialogue-panel').classList.add('active');
}

function showMasterDialogue(npc, rep, repLevel) {
    // Мудрость зависит от уровня отношений
    const wisdom = reputation.getWisdomByReputation(npc.id, rep);

    // Доступные практики
    const challenges = reputation.getAvailableChallenges(rep);

    // Приветствие в зависимости от уровня
    let greeting;
    if (rep >= 80) {
        greeting = `Рад видеть тебя, друг мой! ${wisdom}`;
    } else if (rep >= 60) {
        greeting = `Приветствую тебя, последователь. ${wisdom}`;
    } else if (rep >= 40) {
        greeting = `Добро пожаловать, ученик. ${wisdom}`;
    } else if (rep >= 20) {
        greeting = `Здравствуй, знакомый странник. ${wisdom}`;
    } else {
        greeting = `Приветствую тебя, путник. Я ${npc.name}. ${wisdom}`;
    }

    // Формируем опции
    const options = [];

    // Добавить практики
    challenges.forEach(ch => {
        options.push({
            text: ch.label,
            action: 'start_npc_challenge',
            npcId: npc.id,
            minutes: ch.minutes,
            maxMisses: ch.maxMisses
        });
    });

    // Попросить мудрости (если высокий уровень)
    if (rep >= 40) {
        options.push({
            text: '💡 Поделись мудростью',
            next: 'wisdom_share'
        });
    }

    // Закрыть
    options.push({
        text: '🙏 Благодарю',
        next: 'end',
        reward: { coins: Math.floor(5 + rep / 10) }
    });

    const node = {
        text: greeting,
        options: options,
        showReputation: true,
        repValue: rep,
        repLevel: repLevel
    };

    showDialogueNode(npc, node);
}

function showRegularNpcDialogue(npc) {
    const pool = npc.dialoguePool || 'beginner';
    let tree = DIALOGUE_TREES[pool];

    if (!tree) {
        if (npc.quotes && npc.quotes.length > 0) {
            const quote = npc.quotes[Math.floor(Math.random() * npc.quotes.length)];
            const dynamicNode = {
                text: quote,
                options: [{ text: '🙏 Благодарю', next: 'end', reward: { coins: 10 } }]
            };
            showDialogueNode(npc, dynamicNode);
            return;
        }
        tree = DIALOGUE_TREES.beginner;
    }

    showDialogueNode(npc, tree.greeting[0]);
}

function showDialogueNode(npc, node) {
    currentDialogue = node;

    // Очистить предыдущий интервал
    if (currentTypeInterval) {
        clearInterval(currentTypeInterval);
        currentTypeInterval = null;
    }

    // Portrait
    document.getElementById('npc-portrait').textContent = npc.emoji;
    document.getElementById('npc-name').textContent = npc.name;
    document.getElementById('npc-name').style.color = npc.color;

    // Показать репутацию если есть
    const repDisplay = document.getElementById('npc-reputation');
    if (repDisplay && node.showReputation) {
        repDisplay.textContent = `${node.repLevel.emoji} ${node.repLevel.name} (${node.repValue}/100)`;
        repDisplay.style.display = 'block';
    } else if (repDisplay) {
        repDisplay.style.display = 'none';
    }

    // Text
    let text = node.text;

    // Typewriter effect
    const textEl = document.getElementById('dialogue-text');
    textEl.textContent = '';
    let i = 0;

    currentTypeInterval = setInterval(() => {
        if (i < text.length) {
            textEl.textContent += text[i];
            i++;
        } else {
            clearInterval(currentTypeInterval);
            currentTypeInterval = null;
        }
    }, 20);

    // Options
    const optionsEl = document.getElementById('dialogue-options');
    optionsEl.innerHTML = '';

    node.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option';
        btn.textContent = opt.text;

        if (opt.cost) {
            btn.innerHTML += ` <span class="cost">✨${opt.cost}</span>`;
        }

        btn.onclick = () => handleDialogueOption(opt);
        optionsEl.appendChild(btn);
    });
}

function handleDialogueOption(option) {
    // Очистить typewriter
    if (currentTypeInterval) {
        clearInterval(currentTypeInterval);
        currentTypeInterval = null;
    }

    const gameState = window.game.gameState;

    // Handle rewards
    if (option.reward) {
        if (option.reward.coins) gameState.currency.pranaCoins += option.reward.coins;
        if (option.reward.gems) gameState.currency.gems += option.reward.gems;
        storage.saveGame(gameState);
        updateHUD(gameState);
        spawnParticles('coins', 3);
    }

    // Handle NPC challenge start
    if (option.action === 'start_npc_challenge') {
        reputation.startNpcChallenge(gameState, option.npcId, option.minutes, option.maxMisses);
        closeDialogue();
        window.game.meditation.setDuration(option.minutes);
        toggleMeditationPanel();
        showNotification(`🧘 Практика от ${currentNPC.name}: ${option.minutes} мин`);
        return;
    }

    // Legacy challenge action
    if (option.action === 'start_challenge') {
        closeDialogue();
        window.game.meditation.setDuration(option.challengeMinutes);
        toggleMeditationPanel();
        return;
    }

    // Wisdom share
    if (option.next === 'wisdom_share') {
        const rep = reputation.getNpcReputation(gameState, currentNPC.id);
        const wisdom = reputation.getWisdomByReputation(currentNPC.id, rep);
        showDialogueNode(currentNPC, {
            text: wisdom,
            options: [{ text: '🙏 Благодарю за мудрость', next: 'end', reward: { coins: 10 } }]
        });
        return;
    }

    // End dialogue
    if (option.next === 'end') {
        closeDialogue();
        return;
    }

    // Navigate tree
    const pool = currentNPC.dialoguePool || 'beginner';
    const tree = DIALOGUE_TREES[pool] || DIALOGUE_TREES.beginner;
    const nextNode = tree[option.next];

    if (nextNode && nextNode[0]) {
        showDialogueNode(currentNPC, nextNode[0]);
    } else {
        closeDialogue();
    }
}

function closeDialogue() {
    if (currentTypeInterval) {
        clearInterval(currentTypeInterval);
        currentTypeInterval = null;
    }
    document.getElementById('dialogue-panel').classList.remove('active');
    currentDialogue = null;
    currentNPC = null;
}

function interactWithNearbyNPC() {
    if (!window.game) return;

    const player = window.game.player;
    const npcs = window.game.npcs;

    let nearestNPC = null;
    let nearestDist = 80;

    npcs.forEach(npc => {
        const dist = utils.distance(player.x, player.y, npc.x, npc.y);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestNPC = npc;
        }
    });

    if (nearestNPC) {
        openDialogue(nearestNPC);
    }
}

// Показать результат челленджа после медитации
function showChallengeResult(result) {
    if (!result) return;

    const npc = window.game.npcs.find(n => n.id === result.npcId);
    const npcName = npc ? npc.name : 'Учитель';

    let message = `${npcName}: ${result.message}`;
    let color = result.success ? '#4CAF50' : '#FF5722';

    if (result.perfect) {
        message += ` (+${result.repChange} 💛)`;
        color = '#FFD700';
    } else if (result.repChange > 0) {
        message += ` (+${result.repChange} ❤️)`;
    } else if (result.repChange < 0) {
        message += ` (${result.repChange} 💔)`;
    }

    // Показать как большое уведомление
    const popup = document.createElement('div');
    popup.className = 'challenge-result-popup';
    popup.innerHTML = `
        <div class="popup-content" style="border-color: ${color}">
            <div class="popup-icon">${result.perfect ? '🌟' : result.success ? '✅' : '😔'}</div>
            <div class="popup-text">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()">Понятно</button>
        </div>
    `;
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    popup.querySelector('.popup-content').style.cssText = `
        background: linear-gradient(135deg, #1a1a3e, #2c1654);
        padding: 30px 40px;
        border-radius: 20px;
        border: 3px solid ${color};
        text-align: center;
        max-width: 400px;
    `;
    popup.querySelector('.popup-icon').style.cssText = 'font-size: 60px; margin-bottom: 15px;';
    popup.querySelector('.popup-text').style.cssText = 'font-size: 18px; color: #fff; margin-bottom: 20px; line-height: 1.5;';
    popup.querySelector('button').style.cssText = `
        background: ${color};
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
    `;
    document.body.appendChild(popup);
}

window.openDialogue = openDialogue;
window.closeDialogue = closeDialogue;
window.interactWithNearbyNPC = interactWithNearbyNPC;
window.showChallengeResult = showChallengeResult;
