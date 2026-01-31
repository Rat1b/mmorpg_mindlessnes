// ========================================
// Map - Tile-based map system (EXPANDED)
// ========================================

const TILE_SIZE = 32;
const MAP_WIDTH = 200;  // Увеличено с 100 до 200
const MAP_HEIGHT = 150;  // Увеличено с 80 до 150

const TILE_TYPES = {
    GRASS: 0,
    STONE: 1,
    WATER: 2,
    SAND: 3,
    TEMPLE_FLOOR: 4,
    TREE: 5,
    FLOWER: 6,
    ROCK: 7,
    LOTUS: 8,
    ALTAR: 9,
    // Новые биомы
    SNOW: 10,
    ICE: 11,
    DESERT_SAND: 12,
    DARK_GRASS: 13,
    CAVE_FLOOR: 14,
    BEACH: 15
};

const TILE_COLORS = {
    // Мягкие оттенки травы - меньше контраста
    [TILE_TYPES.GRASS]: ['#4A7C4E', '#548B54', '#5F9A5F', '#4A8B4A', '#508050'],
    [TILE_TYPES.STONE]: ['#7A7A7A', '#888888', '#8C8C9C', '#757585'],
    [TILE_TYPES.WATER]: ['#3A8AC0', '#4A9AD0', '#5AAAE0', '#4090C8'],
    [TILE_TYPES.SAND]: ['#D4B896', '#CEAD8A', '#D8C8A0', '#C8A478'],
    [TILE_TYPES.TEMPLE_FLOOR]: ['#A67B5B', '#B8896B', '#C4977B', '#9A7055'],
    // Новые биомы
    [TILE_TYPES.SNOW]: ['#F0F8FF', '#E8F4F8', '#DDEEFF', '#E5F0F5'],
    [TILE_TYPES.ICE]: ['#B0E0E6', '#ADD8E6', '#87CEEB', '#A0D8E6'],
    [TILE_TYPES.DESERT_SAND]: ['#F4A460', '#E8B878', '#DEB887', '#D4A574'],
    [TILE_TYPES.DARK_GRASS]: ['#2D5A3D', '#3A6B4A', '#325545', '#284D38'],
    [TILE_TYPES.CAVE_FLOOR]: ['#4A4A4A', '#555555', '#505050', '#484848'],
    [TILE_TYPES.BEACH]: ['#F5DEB3', '#FAEBD7', '#F0E68C', '#EED9B6']
};

const DECORATION_EMOJIS = {
    [TILE_TYPES.TREE]: ['🌳', '🌲', '🌴'],
    [TILE_TYPES.FLOWER]: ['🌸', '🌺', '🌻', '🌷', '💮'],
    [TILE_TYPES.ROCK]: ['🗿', '💎'],
    [TILE_TYPES.LOTUS]: ['🌸'],
    [TILE_TYPES.ALTAR]: ['🕯️', '⛩️'],
    // Новые декорации для биомов
    snow_tree: ['🌲', '❄️'],
    snow_deco: ['⛷️', '🏔️', '☃️'],
    desert_deco: ['🌵', '🏜️', '🐪'],
    forest_deco: ['🍄', '🦌', '🌿', '🍃'],
    cave_deco: ['💎', '🔥', '🦇'],
    beach_deco: ['🐚', '⛵', '🦀', '🏖️']
};

// Определение зон мира
const WORLD_ZONES = {
    // Центральная зона - Храм
    center: { x: 80, y: 60, w: 40, h: 30, biome: 'temple' },
    // Северная зона - Горы и снег
    mountains: { x: 60, y: 0, w: 80, h: 40, biome: 'snow' },
    // Восточная зона - Пустыня
    desert: { x: 140, y: 40, w: 60, h: 70, biome: 'desert' },
    // Западная зона - Тёмный лес
    forest: { x: 0, y: 30, w: 50, h: 80, biome: 'forest' },
    // Южная зона - Океан и пляж
    ocean: { x: 40, y: 110, w: 120, h: 40, biome: 'beach' },
    // Подземные пещеры (маленькие островки)
    caves1: { x: 20, y: 120, w: 15, h: 15, biome: 'cave' },
    caves2: { x: 170, y: 130, w: 15, h: 15, biome: 'cave' }
};

class GameMap {
    constructor() {
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.tiles = [];
        this.decorations = [];
        this.zones = [];
        this.buildings = []; // Список зданий
        this.generate();
    }

    generate() {
        // Initialize with grass
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = TILE_TYPES.GRASS;
            }
        }

        // === СОЗДАНИЕ БИОМОВ ===

        // 1. Северные горы и снег
        this.createBiome(60, 0, 80, 35, TILE_TYPES.SNOW);
        this.createBiome(70, 5, 60, 15, TILE_TYPES.ICE); // Ледяные вершины

        // 2. Восточная пустыня
        this.createBiome(145, 35, 55, 75, TILE_TYPES.DESERT_SAND);

        // 3. Западный тёмный лес
        this.createBiome(0, 25, 55, 85, TILE_TYPES.DARK_GRASS);

        // 4. Южный океан и пляж
        this.createBiome(30, 125, 140, 25, TILE_TYPES.WATER);
        this.createBiome(30, 115, 140, 15, TILE_TYPES.BEACH);

        // 5. Центральная храмовая зона
        this.createZone('temple', 85, 55, 30, 25, TILE_TYPES.TEMPLE_FLOOR);

        // 6. Пещеры
        this.createBiome(15, 115, 20, 20, TILE_TYPES.CAVE_FLOOR);
        this.createBiome(165, 125, 20, 20, TILE_TYPES.CAVE_FLOOR);

        // === ВОДОЁМЫ ===
        // Центральный пруд
        this.createZone('pond', 70, 75, 10, 8, TILE_TYPES.WATER);
        // Горное озеро
        this.createZone('mountain_lake', 90, 15, 12, 8, TILE_TYPES.WATER);
        // Оазис в пустыне
        this.createZone('oasis', 165, 60, 8, 8, TILE_TYPES.WATER);
        this.createZone('oasis_sand', 163, 58, 12, 12, TILE_TYPES.SAND);
        this.createZone('oasis', 165, 60, 8, 8, TILE_TYPES.WATER);
        // Лесное озеро
        this.createZone('forest_lake', 20, 55, 10, 10, TILE_TYPES.WATER);

        // === ДОРОГИ ===
        // Центральные пути
        this.createPath(50, 70, 85, 70, TILE_TYPES.STONE);  // Запад - Центр
        this.createPath(115, 70, 145, 70, TILE_TYPES.STONE); // Центр - Восток
        this.createPath(100, 40, 100, 55, TILE_TYPES.STONE); // Север - Центр
        this.createPath(100, 80, 100, 115, TILE_TYPES.STONE); // Центр - Юг

        // Дополнительные пути
        this.createPath(100, 20, 120, 20, TILE_TYPES.STONE); // В горах
        this.createPath(165, 55, 165, 75, TILE_TYPES.SAND); // В пустыне
        this.createPath(25, 45, 25, 75, TILE_TYPES.STONE); // В лесу

        // === ЗДАНИЯ И ЛОКАЦИИ ===
        this.addBuildings();

        // === ДЕКОРАЦИИ ===
        this.addDecorations();
    }

    createBiome(x, y, w, h, tileType) {
        // Создаём биом с размытыми границами
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                const tx = x + dx;
                const ty = y + dy;
                if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                    // Размытые края биома
                    const edgeDist = Math.min(dx, dy, w - dx - 1, h - dy - 1);
                    if (edgeDist >= 0 || Math.random() > 0.3) {
                        this.tiles[ty][tx] = tileType;
                    }
                }
            }
        }
    }

    createZone(name, x, y, w, h, tileType) {
        this.zones.push({ name, x, y, w, h });
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                const tx = x + dx;
                const ty = y + dy;
                if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                    this.tiles[ty][tx] = tileType;
                }
            }
        }
    }

    createPath(x1, y1, x2, y2, tileType) {
        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);
        let x = x1, y = y1;

        while (x !== x2 || y !== y2) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.tiles[y][x] = tileType;
                // Делаем дорогу шире (2 тайла)
                if (y + 1 < this.height) this.tiles[y + 1][x] = tileType;
            }
            if (x !== x2) x += dx;
            else if (y !== y2) y += dy;
        }
    }

    addBuildings() {
        // === ЦЕНТРАЛЬНАЯ ЗОНА ===
        this.buildings.push({ x: 100, y: 65, emoji: '⛩️', name: 'Главный Храм' });
        this.buildings.push({ x: 95, y: 60, emoji: '🕯️', name: 'Алтарь Света' });
        this.buildings.push({ x: 105, y: 60, emoji: '🕯️', name: 'Алтарь Тени' });
        this.buildings.push({ x: 100, y: 55, emoji: '🏛️', name: 'Зал Мудрости' });
        this.buildings.push({ x: 90, y: 70, emoji: '🏯', name: 'Пагода Созерцания' });
        this.buildings.push({ x: 110, y: 70, emoji: '🛕', name: 'Храм Медитации' });

        // === ГОРЫ (СЕВЕР) ===
        this.buildings.push({ x: 80, y: 10, emoji: '🏔️', name: 'Вершина Просветления' });
        this.buildings.push({ x: 100, y: 15, emoji: '🛖', name: 'Монастырь Тишины' });
        this.buildings.push({ x: 120, y: 12, emoji: '⛷️', name: 'Пещера Отшельника' });
        this.buildings.push({ x: 95, y: 25, emoji: '🏠', name: 'Горная Хижина' });

        // === ПУСТЫНЯ (ВОСТОК) ===
        this.buildings.push({ x: 165, y: 65, emoji: '🌴', name: 'Оазис Покоя' });
        this.buildings.push({ x: 175, y: 50, emoji: '🐪', name: 'Караван-Сарай' });
        this.buildings.push({ x: 160, y: 80, emoji: '🕌', name: 'Храм Пустыни' });
        this.buildings.push({ x: 180, y: 70, emoji: '⛺', name: 'Шатёр Суфия' });
        this.buildings.push({ x: 155, y: 45, emoji: '🗿', name: 'Древние Руины' });

        // === ТЁМНЫЙ ЛЕС (ЗАПАД) ===
        this.buildings.push({ x: 25, y: 40, emoji: '🏚️', name: 'Хижина Отшельника' });
        this.buildings.push({ x: 15, y: 60, emoji: '🌲', name: 'Священное Дерево' });
        this.buildings.push({ x: 35, y: 75, emoji: '🍄', name: 'Грибная Поляна' });
        this.buildings.push({ x: 20, y: 85, emoji: '🦌', name: 'Святилище Леса' });
        this.buildings.push({ x: 40, y: 50, emoji: '🔮', name: 'Башня Друида' });

        // === ПОБЕРЕЖЬЕ (ЮГ) ===
        this.buildings.push({ x: 100, y: 120, emoji: '🏖️', name: 'Пляж Покоя' });
        this.buildings.push({ x: 80, y: 118, emoji: '⛵', name: 'Порт Странников' });
        this.buildings.push({ x: 120, y: 118, emoji: '🐚', name: 'Жемчужная Бухта' });
        this.buildings.push({ x: 140, y: 122, emoji: '🏠', name: 'Рыбацкая Деревня' });
        this.buildings.push({ x: 60, y: 120, emoji: '🗼', name: 'Маяк Осознанности' });

        // === ПЕЩЕРЫ ===
        this.buildings.push({ x: 25, y: 125, emoji: '🕳️', name: 'Пещера Глубин' });
        this.buildings.push({ x: 175, y: 135, emoji: '💎', name: 'Кристальная Пещера' });

        // Добавляем здания как декорации
        this.buildings.forEach(b => {
            this.decorations.push({ x: b.x, y: b.y, type: TILE_TYPES.ALTAR, emoji: b.emoji, isBuilding: true, name: b.name });
        });
    }

    addDecorations() {
        // === ДЕРЕВЬЯ ===
        // Обычные деревья по всей карте
        for (let i = 0; i < 400; i++) {
            const x = utils.randomInt(0, this.width - 1);
            const y = utils.randomInt(0, this.height - 1);
            const tile = this.tiles[y][x];
            if ((tile === TILE_TYPES.GRASS || tile === TILE_TYPES.DARK_GRASS) && !this.hasDecoration(x, y)) {
                const emoji = tile === TILE_TYPES.DARK_GRASS
                    ? utils.randomChoice(['🌲', '🌳', '🍂'])
                    : utils.randomChoice(DECORATION_EMOJIS[TILE_TYPES.TREE]);
                this.decorations.push({ x, y, type: TILE_TYPES.TREE, emoji });
            }
        }

        // Снежные деревья в горах
        for (let i = 0; i < 80; i++) {
            const x = utils.randomInt(60, 140);
            const y = utils.randomInt(0, 35);
            if (this.tiles[y] && this.tiles[y][x] === TILE_TYPES.SNOW && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.TREE, emoji: utils.randomChoice(['🌲', '❄️', '⛄']) });
            }
        }

        // Кактусы в пустыне
        for (let i = 0; i < 60; i++) {
            const x = utils.randomInt(145, 195);
            const y = utils.randomInt(35, 105);
            if (this.tiles[y] && this.tiles[y][x] === TILE_TYPES.DESERT_SAND && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.ROCK, emoji: utils.randomChoice(['🌵', '🏜️', '🦂']) });
            }
        }

        // === ЦВЕТЫ ===
        for (let i = 0; i < 150; i++) {
            const x = utils.randomInt(2, this.width - 2);
            const y = utils.randomInt(2, this.height - 2);
            const tile = this.tiles[y][x];
            if ((tile === TILE_TYPES.GRASS || tile === TILE_TYPES.TEMPLE_FLOOR) && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.FLOWER, emoji: utils.randomChoice(DECORATION_EMOJIS[TILE_TYPES.FLOWER]) });
            }
        }

        // === ЛОТОСЫ У ВОДЫ ===
        for (let i = 0; i < 40; i++) {
            const x = utils.randomInt(65, 85);
            const y = utils.randomInt(72, 85);
            if (!this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.LOTUS, emoji: '🌸' });
            }
        }

        // === КАМНИ И ВАЛУНЫ ===
        for (let i = 0; i < 80; i++) {
            const x = utils.randomInt(0, this.width - 1);
            const y = utils.randomInt(0, this.height - 1);
            const tile = this.tiles[y][x];
            if ((tile === TILE_TYPES.GRASS || tile === TILE_TYPES.SNOW || tile === TILE_TYPES.CAVE_FLOOR) && !this.hasDecoration(x, y)) {
                const emoji = tile === TILE_TYPES.SNOW ? '🪨' : (tile === TILE_TYPES.CAVE_FLOOR ? '💎' : '🗿');
                this.decorations.push({ x, y, type: TILE_TYPES.ROCK, emoji });
            }
        }

        // === ПЛЯЖНЫЕ ПРЕДМЕТЫ ===
        for (let i = 0; i < 40; i++) {
            const x = utils.randomInt(30, 170);
            const y = utils.randomInt(115, 125);
            if (this.tiles[y] && this.tiles[y][x] === TILE_TYPES.BEACH && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.FLOWER, emoji: utils.randomChoice(['🐚', '🦀', '🌴', '⛱️']) });
            }
        }

        // === ЛЕСНЫЕ ГРИБЫ И ЖИВОТНЫЕ ===
        for (let i = 0; i < 50; i++) {
            const x = utils.randomInt(0, 55);
            const y = utils.randomInt(25, 110);
            if (this.tiles[y] && this.tiles[y][x] === TILE_TYPES.DARK_GRASS && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.FLOWER, emoji: utils.randomChoice(['🍄', '🦌', '🦊', '🐿️', '🌿']) });
            }
        }

        // === СКАМЕЙКИ И МЕСТА ДЛЯ МЕДИТАЦИИ ===
        const meditationSpots = [
            { x: 100, y: 68 }, { x: 95, y: 65 }, { x: 105, y: 65 },
            { x: 85, y: 15 }, { x: 165, y: 62 }, { x: 25, y: 55 },
            { x: 100, y: 117 }, { x: 22, y: 122 }, { x: 172, y: 132 }
        ];
        meditationSpots.forEach(spot => {
            if (!this.hasDecoration(spot.x, spot.y)) {
                this.decorations.push({ x: spot.x, y: spot.y, type: TILE_TYPES.ALTAR, emoji: utils.randomChoice(['🧘', '🪑', '🔔']) });
            }
        });
    }

    hasDecoration(x, y) {
        return this.decorations.some(d => d.x === x && d.y === y);
    }

    getTile(x, y) {
        const tx = Math.floor(x / TILE_SIZE);
        const ty = Math.floor(y / TILE_SIZE);
        if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return TILE_TYPES.WATER;
        return this.tiles[ty][tx];
    }

    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        // Только вода и лёд блокируют движение
        return tile !== TILE_TYPES.WATER && tile !== TILE_TYPES.ICE;
    }

    // Получить название текущей зоны
    getZoneName(x, y) {
        const tx = Math.floor(x / TILE_SIZE);
        const ty = Math.floor(y / TILE_SIZE);

        // Проверяем по биомам
        if (ty < 35 && tx >= 60 && tx <= 140) return '🏔️ Горы Сознания';
        if (tx >= 145 && ty >= 35 && ty <= 105) return '🏜️ Пустыня Молчания';
        if (tx <= 55 && ty >= 25 && ty <= 110) return '🌲 Лес Просветления';
        if (ty >= 115) return '🌊 Побережье Бесконечности';
        if (tx >= 85 && tx <= 115 && ty >= 55 && ty <= 80) return '⛩️ Священный Храм';
        return '🌿 Долина Покоя';
    }

    // Получить ID биома для логики (ресурсы и т.д.)
    getBiomeId(x, y) {
        const tx = Math.floor(x / TILE_SIZE);
        const ty = Math.floor(y / TILE_SIZE);

        if (ty < 35 && tx >= 60 && tx <= 140) return 'mountains';
        if (tx >= 145 && ty >= 35 && ty <= 105) return 'desert';
        if (tx <= 55 && ty >= 25 && ty <= 110) return 'forest';
        if (ty >= 115) return 'beach';
        if (tx >= 85 && tx <= 115 && ty >= 55 && ty <= 80) return 'temple';

        // Пещеры (островки)
        if ((tx >= 15 && tx <= 35 && ty >= 115 && ty <= 135) ||
            (tx >= 165 && tx <= 185 && ty >= 125 && ty <= 145)) return 'cave';

        return 'meadow';
    }

    draw(ctx, camera) {
        const startX = Math.max(0, Math.floor(camera.x / TILE_SIZE));
        const startY = Math.max(0, Math.floor(camera.y / TILE_SIZE));
        const endX = Math.min(this.width, Math.ceil((camera.x + camera.width) / TILE_SIZE) + 1);
        const endY = Math.min(this.height, Math.ceil((camera.y + camera.height) / TILE_SIZE) + 1);

        // Draw tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.tiles[y][x];
                const colors = TILE_COLORS[tile] || TILE_COLORS[TILE_TYPES.GRASS];
                const colorIndex = (x + y) % colors.length;
                ctx.fillStyle = colors[colorIndex];
                ctx.fillRect(x * TILE_SIZE - camera.x, y * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
            }
        }

        // Draw decorations
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.decorations.forEach(dec => {
            if (dec.x >= startX && dec.x < endX && dec.y >= startY && dec.y < endY) {
                const drawX = dec.x * TILE_SIZE + 16 - camera.x;
                const drawY = dec.y * TILE_SIZE + 16 - camera.y;

                // Здания рисуем крупнее
                if (dec.isBuilding) {
                    ctx.font = '32px serif';
                    ctx.fillText(dec.emoji, drawX, drawY);
                    ctx.font = '24px serif';
                } else {
                    ctx.fillText(dec.emoji, drawX, drawY);
                }
            }
        });
    }
}

window.GameMap = GameMap;
window.TILE_SIZE = TILE_SIZE;
window.WORLD_ZONES = WORLD_ZONES;
