// ========================================
// Game - Main game engine
// ========================================

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.gameState = storage.loadGame();
        this.map = new GameMap();

        // ZOOM - автоматическое определение масштаба по размеру экрана
        // ПК с большим экраном получает больший зум
        this.zoom = this.calculateOptimalZoom();

        // Create player
        this.player = new Player({
            name: this.gameState.player.name,
            age: this.gameState.player.age,
            x: this.gameState.player.x || 1600,
            y: this.gameState.player.y || 1280,
            level: utils.calculateLevel(this.gameState.stats.totalMinutes),
            meditationHours: this.gameState.stats.totalMinutes / 60,
            color: '#4169E1',
            emoji: '🧘'
        });

        // Generate NPCs
        const npcData = generateWorldNPCs({ mastersCount: 15, practitionersCount: 25, ordinaryCount: 40 });
        this.npcs = createNPCsFromData(npcData, this.map);

        // Meditation system
        this.meditation = new MeditationSystem(this.gameState, () => this.onMeditationUpdate());

        // Quest system
        this.quests = new QuestSystem(this.gameState);


        // Camera - размер вьюпорта в игровых координатах (делим на зум)
        this.camera = {
            x: 0,
            y: 0,
            width: window.innerWidth / this.zoom,
            height: window.innerHeight / this.zoom
        };

        // Animation
        this.frame = 0;
        this.lastTime = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Keyboard - только зум и интеракция
        window.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                interactWithNearbyNPC();
            }
            // Zoom controls: + and -
            if (e.key === '=' || e.key === '+') {
                this.zoom = Math.min(4, this.zoom + 0.5);
                this.resize();
            }
            if (e.key === '-') {
                this.zoom = Math.max(1, this.zoom - 0.5);
                this.resize();
            }
        });

        // Click/Tap для ходьбы
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e));

        // Update HUD
        updateHUD(this.gameState);

        // Populate settings
        document.getElementById('player-name-input').value = this.gameState.player.name;
        document.getElementById('player-age-input').value = this.gameState.player.age;
        document.getElementById('pity-counter').textContent = this.gameState.gachaPity;

        // Start game loop
        this.loop();

        // Auto-save every 30 seconds
        setInterval(() => this.save(), 30000);
    }

    calculateOptimalZoom() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenSize = Math.max(screenWidth, screenHeight);

        // Larger screens get more zoom for better visibility
        if (screenSize >= 1920) return 3;      // 4K or large monitor
        if (screenSize >= 1440) return 2.5;    // 1440p monitor
        if (screenSize >= 1200) return 2.25;   // Standard PC monitor
        if (screenSize >= 900) return 2;       // Small monitor / laptop
        return 1.5;                             // Tablet / small screen
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Recalculate zoom on resize
        this.zoom = this.calculateOptimalZoom();
        this.camera.width = window.innerWidth / this.zoom;
        this.camera.height = window.innerHeight / this.zoom;
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / this.zoom + this.camera.x;
        const clickY = (e.clientY - rect.top) / this.zoom + this.camera.y;

        // Check if clicked on NPC
        for (const npc of this.npcs) {
            const dist = utils.distance(clickX, clickY, npc.x, npc.y);
            if (dist < 50) {
                const playerDist = utils.distance(this.player.x, this.player.y, npc.x, npc.y);
                if (playerDist < 100) {
                    openDialogue(npc);
                } else {
                    // Move player towards NPC
                    this.player.moveTo(npc.x, npc.y - 40);
                }
                return;
            }
        }

        // Move player to tap position
        if (this.map.isWalkable(clickX, clickY)) {
            this.player.moveTo(clickX, clickY);
        }
    }

    handleTouch(e) {
        if (e.target !== this.canvas) return;
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }

    update() {
        // Update player movement (tap-to-walk)
        this.player.update(this.map);

        // Update NPCs
        this.npcs.forEach(npc => npc.update(this.map));

        // Update camera to follow player
        this.camera.x = this.player.x - this.camera.width / 2;
        this.camera.y = this.player.y - this.camera.height / 2;

        // Clamp camera
        const mapPixelWidth = this.map.width * TILE_SIZE;
        const mapPixelHeight = this.map.height * TILE_SIZE;
        this.camera.x = utils.clamp(this.camera.x, 0, Math.max(0, mapPixelWidth - this.camera.width));
        this.camera.y = utils.clamp(this.camera.y, 0, Math.max(0, mapPixelHeight - this.camera.height));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Применяем зум
        this.ctx.save();
        this.ctx.scale(this.zoom, this.zoom);

        // Draw map
        this.map.draw(this.ctx, this.camera);

        // Collect all entities for y-sorting
        const entities = [this.player, ...this.npcs];
        entities.sort((a, b) => a.y - b.y);

        // Draw entities
        entities.forEach(entity => {
            entity.draw(this.ctx, this.camera, this.frame);
        });

        this.ctx.restore();
    }

    loop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.frame++;
        this.update();
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }

    onMeditationUpdate() {
        this.player.meditationHours = this.gameState.stats.totalMinutes / 60;
        this.player.level = utils.calculateLevel(this.gameState.stats.totalMinutes);
        updateHUD(this.gameState);
    }

    save() {
        this.gameState.player.x = this.player.x;
        this.gameState.player.y = this.player.y;
        storage.saveGame(this.gameState);
    }
}

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    console.log('🧘 Путь Осознанности загружен!');
});

