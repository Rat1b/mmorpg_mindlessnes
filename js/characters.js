// ========================================
// Characters - Player and NPC classes
// ========================================

class Character {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.title = data.title || '';
        this.age = data.age || 25;
        this.meditationHours = data.meditationHours || 0;
        this.level = data.level || 1;
        this.skin = data.skin || 'casual_male';
        this.emoji = data.emoji || '👤';
        this.color = data.color || '#4682B4';
        this.rarity = data.rarity || 'common';
        this.dialoguePool = data.dialoguePool || 'beginner';
        this.quotes = data.quotes || null;
        this.isMaster = data.isMaster || false;

        this.x = data.x || 400;
        this.y = data.y || 300;
        this.targetX = this.x;
        this.targetY = this.y;
        this.speed = 2;
        this.isMoving = false;
        this.direction = 'down';
        this.auraColor = null;
    }

    update(map) {
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.speed) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            } else {
                const nx = this.x + (dx / dist) * this.speed;
                const ny = this.y + (dy / dist) * this.speed;

                if (map.isWalkable(nx, ny)) {
                    this.x = nx;
                    this.y = ny;
                } else {
                    this.isMoving = false;
                }
            }

            // Update direction
            if (Math.abs(dx) > Math.abs(dy)) {
                this.direction = dx > 0 ? 'right' : 'left';
            } else {
                this.direction = dy > 0 ? 'down' : 'up';
            }
        }
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
    }

    draw(ctx, camera, frame) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        sprites.drawCharacter(ctx, screenX, screenY, this, frame);
        sprites.drawCharacterInfo(ctx, screenX, screenY, this);
    }
}

class Player extends Character {
    constructor(data) {
        super({ ...data, id: 'player' });
        this.speed = 3;
    }

    handleInput(keys, map) {
        let dx = 0, dy = 0;

        if (keys.up || keys.w) dy = -1;
        if (keys.down || keys.s) dy = 1;
        if (keys.left || keys.a) dx = -1;
        if (keys.right || keys.d) dx = 1;

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = this.x + (dx / len) * this.speed;
            const ny = this.y + (dy / len) * this.speed;

            if (map.isWalkable(nx, this.y)) this.x = nx;
            if (map.isWalkable(this.x, ny)) this.y = ny;

            this.isMoving = true;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.direction = dx > 0 ? 'right' : 'left';
            } else {
                this.direction = dy > 0 ? 'down' : 'up';
            }
        } else {
            this.isMoving = false;
        }
    }

    handleJoystick(jx, jy, map) {
        if (Math.abs(jx) > 0.1 || Math.abs(jy) > 0.1) {
            const nx = this.x + jx * this.speed;
            const ny = this.y + jy * this.speed;

            if (map.isWalkable(nx, this.y)) this.x = nx;
            if (map.isWalkable(this.x, ny)) this.y = ny;

            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
    }
}

class NPC extends Character {
    constructor(data) {
        super(data);
        this.wanderRadius = 100;
        this.homeX = this.x;
        this.homeY = this.y;
        this.wanderTimer = 0;
        this.wanderDelay = utils.randomInt(120, 300);
    }

    update(map) {
        super.update(map);

        this.wanderTimer++;
        if (this.wanderTimer >= this.wanderDelay && !this.isMoving) {
            this.wander(map);
            this.wanderTimer = 0;
            this.wanderDelay = utils.randomInt(120, 300);
        }
    }

    wander(map) {
        const angle = Math.random() * Math.PI * 2;
        const dist = utils.randomInt(30, this.wanderRadius);
        const nx = this.homeX + Math.cos(angle) * dist;
        const ny = this.homeY + Math.sin(angle) * dist;

        if (map.isWalkable(nx, ny)) {
            this.moveTo(nx, ny);
        }
    }
}

function createNPCsFromData(npcsData, map) {
    const npcs = [];
    const placedPositions = [];
    const MIN_DISTANCE = 120; // Минимальное расстояние между NPC

    // Проверка что позиция не слишком близко к другим
    function isTooClose(x, y) {
        for (const pos of placedPositions) {
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (dist < MIN_DISTANCE) return true;
        }
        return false;
    }

    // Найти свободную позицию
    function findFreePosition(minX, maxX, minY, maxY) {
        for (let attempt = 0; attempt < 30; attempt++) {
            const x = utils.randomInt(minX, maxX);
            const y = utils.randomInt(minY, maxY);
            if (!isTooClose(x, y) && map.isWalkable(x, y)) {
                return { x, y };
            }
        }
        // Если не нашли - просто случайная позиция
        return { x: utils.randomInt(minX, maxX), y: utils.randomInt(minY, maxY) };
    }

    // Карта теперь 100x80 тайлов = 3200x2560 пикселей
    const mapPixelWidth = 100 * 32;
    const mapPixelHeight = 80 * 32;

    npcsData.forEach((data, i) => {
        let pos;

        if (data.isMaster) {
            // Мастера в центре карты (область храма)
            pos = findFreePosition(1200, 1800, 900, 1500);
        } else if (data.rarity === 'rare') {
            // Практикующие в разных зонах
            pos = findFreePosition(400, 2800, 400, 2200);
        } else {
            // Обычные люди по всей карте
            pos = findFreePosition(200, mapPixelWidth - 200, 200, mapPixelHeight - 200);
        }

        placedPositions.push(pos);
        const npc = new NPC({ ...data, x: pos.x, y: pos.y });
        npcs.push(npc);
    });

    return npcs;
}

window.Character = Character;
window.Player = Player;
window.NPC = NPC;
window.createNPCsFromData = createNPCsFromData;

