// ========================================
// Dialogues - NPC interaction system
// ========================================

let currentDialogue = null;
let currentNPC = null;

function openDialogue(npc) {
    currentNPC = npc;
    const pool = npc.dialoguePool || 'beginner';
    let tree = DIALOGUE_TREES[pool];

    // Если пул не найден - используем цитаты NPC или стандартный диалог
    if (!tree) {
        // Создаём динамический диалог из цитат мастера
        if (npc.quotes && npc.quotes.length > 0) {
            const quote = npc.quotes[Math.floor(Math.random() * npc.quotes.length)];
            const dynamicNode = {
                text: quote,
                options: [{ text: '🙏 Благодарю', next: 'end', reward: { xp: 30, coins: 15 } }]
            };
            showDialogueNode(npc, dynamicNode);
            document.getElementById('dialogue-panel').classList.add('active');
            return;
        }
        tree = DIALOGUE_TREES.beginner;
    }

    showDialogueNode(npc, tree.greeting[0]);
    document.getElementById('dialogue-panel').classList.add('active');
}

function showDialogueNode(npc, node) {
    currentDialogue = node;

    // Portrait
    document.getElementById('npc-portrait').textContent = npc.emoji;
    document.getElementById('npc-name').textContent = npc.name;
    document.getElementById('npc-name').style.color = npc.color;

    // Text
    let text = node.text;

    // Typewriter effect
    const textEl = document.getElementById('dialogue-text');
    textEl.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            textEl.textContent += text[i];
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 25);

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
    // Handle rewards
    if (option.reward) {
        const gameState = window.game.gameState;
        if (option.reward.coins) gameState.currency.pranaCoins += option.reward.coins;
        if (option.reward.xp) gameState.stats.totalMinutes += option.reward.xp / 10;
        if (option.reward.gems) gameState.currency.gems += option.reward.gems;
        storage.saveGame(gameState);
        updateHUD(gameState);
        spawnParticles('coins', 5);
    }

    // Handle actions
    if (option.action === 'start_challenge') {
        closeDialogue();
        window.game.meditation.setDuration(option.challengeMinutes);
        toggleMeditationPanel();
        return;
    }

    // Navigate to next node
    if (option.next === 'end') {
        closeDialogue();
        return;
    }

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

window.openDialogue = openDialogue;
window.closeDialogue = closeDialogue;
window.interactWithNearbyNPC = interactWithNearbyNPC;
