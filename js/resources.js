// ========================================
// Resources - Farming nodes like Albion Online
// ========================================

const RESOURCE_TYPES = {
    wood: { id: 'wood', name: 'Древнее Дерево', emoji: '🌳', color: '#8B4513', tier: 1, xp: 100, coins: 50, type: 'resource' },
    stone: { id: 'stone', name: 'Медитативный Камень', emoji: '🪨', color: '#808080', tier: 1, xp: 150, coins: 80, type: 'resource' },
    fiber: { id: 'fiber', name: 'Золотой Лён', emoji: '🌾', color: '#DAA520', tier: 1, xp: 120, coins: 60, type: 'resource' },
    ore: { id: 'ore', name: 'Руда Сознания', emoji: '⛏️', color: '#708090', tier: 2, xp: 250, coins: 150, type: 'resource' },
    crystal: { id: 'crystal', name: 'Кристалл Ясности', emoji: '💎', color: '#E0FFFF', tier: 3, xp: 500, coins: 300, type: 'resource' },
    mushroom: { id: 'mushroom', name: 'Гриб Мудрости', emoji: '🍄', color: '#8B0000', tier: 1, xp: 200, coins: 100, type: 'resource' },
    pearl: { id: 'pearl', name: 'Жемчужина', emoji: '⚪', color: '#F0F8FF', tier: 2, xp: 300, coins: 200, type: 'resource' },
    cactus: { id: 'cactus', name: 'Кактус Терпения', emoji: '🌵', color: '#2E8B57', tier: 1, xp: 150, coins: 100, type: 'resource' }
};

const ZONE_RESOURCES = {
    forest: [{ type: 'wood', chance: 0.8 }, { type: 'mushroom', chance: 0.2 }],
    mountains: [{ type: 'stone', chance: 0.7 }, { type: 'ore', chance: 0.3 }],
    desert: [{ type: 'fiber', chance: 0.6 }, { type: 'cactus', chance: 0.4 }],
    beach: [{ type: 'pearl', chance: 0.3 }, { type: 'fiber', chance: 0.2 }], // Low chance for pearls
    cave: [{ type: 'stone', chance: 0.5 }, { type: 'crystal', chance: 0.5 }],
    meadow: [{ type: 'wood', chance: 0.3 }, { type: 'fiber', chance: 0.3 }],
    temple: [] // No resources in temple
};

class ResourceNode {
    constructor(type, x, y) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.data = RESOURCE_TYPES[type];
        this.x = x;
        this.y = y;
        this.isVisual = true; // Nodes are now visual indicators of zone richness
    }

    update() {
        // Animation or glowing logic could go here
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Не рисуем если за пределами экрана
        if (screenX < -50 || screenX > camera.width + 50 ||
            screenY < -50 || screenY > camera.height + 50) return;

        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 10, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.fillText(this.data.emoji, screenX, screenY);
    }
}

function calculateZoneYield(biome, minutes) {
    const yieldItems = [];
    if (!ZONE_RESOURCES[biome]) return yieldItems;

    const resources = ZONE_RESOURCES[biome];
    if (resources.length === 0) return yieldItems;

    // Base rate: 1 resource roll per 2 minutes (approx)
    // But player wants "mined by minutes", so let's be generous.
    // 1 minute = 1 roll.
    const rolls = Math.floor(minutes);

    for (let i = 0; i < rolls; i++) {
        const roll = Math.random();
        // Check for drop
        // Logic: Pick a random resource from the list, check against its chance
        const targetRes = utils.randomChoice(resources);
        if (Math.random() < targetRes.chance) {
            yieldItems.push(RESOURCE_TYPES[targetRes.type]);
        }
    }

    // Combine same items
    const combined = {};
    yieldItems.forEach(item => {
        if (!combined[item.id]) {
            combined[item.id] = { ...item, count: 0 };
        }
        combined[item.id].count++;
    });

    return Object.values(combined);
}

function generateWorldResources(map) {
    const resources = [];
    // Visual indicators only now
    const mapWidth = 200 * 32;
    const mapHeight = 150 * 32;

    function addNodes(type, count, zoneRect) {
        for (let i = 0; i < count; i++) {
            const x = utils.randomInt(zoneRect.x, zoneRect.x + zoneRect.w);
            const y = utils.randomInt(zoneRect.y, zoneRect.y + zoneRect.h);

            if (map.isWalkable(x, y)) {
                resources.push(new ResourceNode(type, x, y));
            }
        }
    }

    // Лес (Запад)
    addNodes('wood', 50, { x: 0, y: 1280, w: 1920, h: 2240 });
    addNodes('mushroom', 30, { x: 0, y: 1280, w: 1920, h: 2240 });
    // Горы (Север)
    addNodes('stone', 40, { x: 0, y: 0, w: 6400, h: 1280 });
    addNodes('ore', 20, { x: 1000, y: 200, w: 4000, h: 800 });
    // Пустыня (Восток)
    addNodes('cactus', 40, { x: 4480, y: 1280, w: 1920, h: 2240 });
    addNodes('fiber', 30, { x: 4480, y: 1280, w: 1920, h: 2240 });
    // Пляж (Юг)
    addNodes('pearl', 20, { x: 0, y: 3520, w: 6400, h: 1280 });
    // Пещеры
    addNodes('crystal', 15, { x: 1500, y: 1500, w: 3000, h: 2000 });

    return resources;
}

window.ResourceNode = ResourceNode;
window.generateWorldResources = generateWorldResources;
window.calculateZoneYield = calculateZoneYield;
window.RESOURCE_TYPES = RESOURCE_TYPES;
window.ZONE_RESOURCES = ZONE_RESOURCES;
