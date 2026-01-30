// ========================================
// Map - Tile-based map system
// ========================================

const TILE_SIZE = 32;
const MAP_WIDTH = 100;  // Увеличено с 50
const MAP_HEIGHT = 80;  // Увеличено с 40

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
    ALTAR: 9
};

const TILE_COLORS = {
    // Мягкие оттенки травы - меньше контраста
    [TILE_TYPES.GRASS]: ['#4A7C4E', '#548B54', '#5F9A5F', '#4A8B4A', '#508050'],
    [TILE_TYPES.STONE]: ['#7A7A7A', '#888888', '#8C8C9C', '#757585'],
    [TILE_TYPES.WATER]: ['#3A8AC0', '#4A9AD0', '#5AAAE0', '#4090C8'],
    [TILE_TYPES.SAND]: ['#D4B896', '#CEAD8A', '#D8C8A0', '#C8A478'],
    [TILE_TYPES.TEMPLE_FLOOR]: ['#A67B5B', '#B8896B', '#C4977B', '#9A7055']
};

const DECORATION_EMOJIS = {
    [TILE_TYPES.TREE]: ['🌳', '🌲', '🌴'],
    [TILE_TYPES.FLOWER]: ['🌸', '🌺', '🌻', '🌷', '💮'],
    [TILE_TYPES.ROCK]: ['🗿', '💎'],
    [TILE_TYPES.LOTUS]: ['🌸'],
    [TILE_TYPES.ALTAR]: ['🕯️', '⛩️']
};

class GameMap {
    constructor() {
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.tiles = [];
        this.decorations = [];
        this.zones = [];
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

        // Create zones
        this.createZone('temple', 20, 15, 12, 10, TILE_TYPES.TEMPLE_FLOOR);
        this.createZone('garden', 5, 5, 10, 8, TILE_TYPES.GRASS);
        this.createZone('pond', 35, 25, 8, 6, TILE_TYPES.WATER);
        this.createZone('meditation', 38, 8, 8, 8, TILE_TYPES.SAND);

        // Add paths
        this.createPath(15, 20, 20, 20, TILE_TYPES.STONE);
        this.createPath(32, 20, 35, 28, TILE_TYPES.STONE);
        this.createPath(26, 10, 38, 10, TILE_TYPES.STONE);

        // Add decorations
        this.addDecorations();
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
            }
            if (x !== x2) x += dx;
            else if (y !== y2) y += dy;
        }
    }

    addDecorations() {
        // Много деревьев по всей карте
        for (let i = 0; i < 200; i++) {
            const x = utils.randomInt(0, this.width - 1);
            const y = utils.randomInt(0, this.height - 1);
            if (this.tiles[y][x] === TILE_TYPES.GRASS && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.TREE, emoji: utils.randomChoice(DECORATION_EMOJIS[TILE_TYPES.TREE]) });
            }
        }

        // Цветы в саду и по карте
        for (let i = 0; i < 80; i++) {
            const x = utils.randomInt(2, this.width - 2);
            const y = utils.randomInt(2, this.height - 2);
            if (this.tiles[y][x] !== TILE_TYPES.WATER && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.FLOWER, emoji: utils.randomChoice(DECORATION_EMOJIS[TILE_TYPES.FLOWER]) });
            }
        }

        // Лотосы у пруда
        for (let i = 0; i < 15; i++) {
            const x = utils.randomInt(34, 44);
            const y = utils.randomInt(24, 32);
            if (!this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.LOTUS, emoji: '🌸' });
            }
        }

        // Камни и валуны
        for (let i = 0; i < 30; i++) {
            const x = utils.randomInt(0, this.width - 1);
            const y = utils.randomInt(0, this.height - 1);
            if (this.tiles[y][x] === TILE_TYPES.GRASS && !this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.ROCK, emoji: '🗿' });
            }
        }

        // Храмы и постройки
        this.decorations.push({ x: 26, y: 17, type: TILE_TYPES.ALTAR, emoji: '⛩️' });
        this.decorations.push({ x: 24, y: 19, type: TILE_TYPES.ALTAR, emoji: '🕯️' });
        this.decorations.push({ x: 28, y: 19, type: TILE_TYPES.ALTAR, emoji: '🕯️' });
        this.decorations.push({ x: 50, y: 40, type: TILE_TYPES.ALTAR, emoji: '🏯' });
        this.decorations.push({ x: 75, y: 25, type: TILE_TYPES.ALTAR, emoji: '🛕' });
        this.decorations.push({ x: 30, y: 60, type: TILE_TYPES.ALTAR, emoji: '🏛️' });

        // Скамейки и места для медитации
        for (let i = 0; i < 10; i++) {
            const x = utils.randomInt(10, this.width - 10);
            const y = utils.randomInt(10, this.height - 10);
            if (!this.hasDecoration(x, y)) {
                this.decorations.push({ x, y, type: TILE_TYPES.ALTAR, emoji: utils.randomChoice(['🪑', '🧘', '🔔']) });
            }
        }
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
        // Только вода блокирует движение, деревья и цветы - проходимые
        return tile !== TILE_TYPES.WATER;
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
                ctx.fillText(dec.emoji, dec.x * TILE_SIZE + 16 - camera.x, dec.y * TILE_SIZE + 16 - camera.y);
            }
        });
    }
}

window.GameMap = GameMap;
window.TILE_SIZE = TILE_SIZE;
