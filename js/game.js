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
            meditationHours2: this.gameState.stats2.totalMinutes / 60,
            isPlayer: true,
            color: '#4169E1',
            emoji: '🧘'
        });

        // Generate NPCs
        const npcData = generateWorldNPCs({ mastersCount: 15, practitionersCount: 25, ordinaryCount: 40 });
        this.npcs = createNPCsFromData(npcData, this.map);

        // Meditation system
        this.meditation = new MeditationSystem(this.gameState, () => this.onMeditationUpdate());

        // Meditation system 2 (second practice)
        this.meditation2 = new MeditationSystem2(this.gameState, () => this.onMeditationUpdate());

        // Quest system
        this.quests = new QuestSystem(this.gameState);

        // Resources (Albion-style farming)
        this.resources = window.generateWorldResources ? generateWorldResources(this.map) : [];

        // Daily login & banners system
        this.dailyLogin = new DailyLoginSystem(this.gameState);
        this.celebrating = false;
        this.celebrationTimer = 0;

        // Проверить ежедневный логин при входе
        this.dailyLogin.checkDailyLogin();

        // Battle Pass
        this.battlePass = new BattlePassSystem(this.gameState);

        // Temple building
        this.temples = new TempleSystem(this.gameState);

        // Extended Stats
        this.extStats = new ExtendedStats(this.gameState);

        // Events
        this.events = new EventSystem(this.gameState);


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

        // Check if clicked on Resource
        if (this.resources) {
            for (const res of this.resources) {
                if (res.isDepleted) continue;

                const dist = utils.distance(clickX, clickY, res.x, res.y);
                if (dist < 50) {
                    const playerDist = utils.distance(this.player.x, this.player.y, res.x, res.y);
                    if (playerDist < 80) {
                        // Gather!
                        showNotification(`🧘 Медитируйте в этой зоне, чтобы собрать ${res.data.name}`);
                    } else {
                        // Move player towards Resource
                        this.player.moveTo(res.x, res.y - 40);
                    }
                    return;
                }
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
        const mapPixelWidth = (this.map.width || 200) * (window.TILE_SIZE || 32);
        const mapPixelHeight = (this.map.height || 150) * (window.TILE_SIZE || 32);
        this.camera.x = utils.clamp(this.camera.x, 0, Math.max(0, mapPixelWidth - this.camera.width));
        this.camera.y = utils.clamp(this.camera.y, 0, Math.max(0, mapPixelHeight - this.camera.height));

        // Update resources
        if (this.resources) {
            this.resources.forEach(res => res.update());
        }

        // Celebration timer (NPC dancing)
        if (this.celebrating) {
            this.celebrationTimer--;
            if (this.celebrationTimer <= 0) {
                this.celebrating = false;
            }
        }

        this.updateResourceForecast();
    }

    updateResourceForecast() {
        if (this.frame % 30 !== 0) return; // Update every 0.5s

        const forecastDiv = document.getElementById('resource-forecast');
        if (!forecastDiv) return;

        // 1. Active Meditation State
        if (this.meditation && this.meditation.isActive) {
            forecastDiv.style.display = 'block';
            const elapsed = Math.floor(this.meditation.getElapsedSeconds() / 60);

            document.getElementById('forecast-zone').textContent = '🧘 Сбор ресурсов...';
            document.getElementById('forecast-zone').style.color = '#00FF00';

            // Show what we are gathering based on zone
            const x = this.player.x;
            const y = this.player.y;
            const biome = this.map.getBiomeId(x, y);
            const potential = window.ZONE_RESOURCES && window.ZONE_RESOURCES[biome];

            if (potential) {
                const dropNames = potential.map(p => window.RESOURCE_TYPES[p.type].emoji).join(' ');
                document.getElementById('forecast-drops').textContent = `${dropNames}`;
            }

            document.getElementById('forecast-estimates').innerHTML = `
                <div style="font-size:1.1em; color:#fff">⏳ ${elapsed} мин</div>
                <div style="color:#FFFF00">📥 Ожидается: ~${elapsed} предм.</div>
            `;
            return;
        }

        // 2. Forecast State (Idle)
        const x = this.player.x;
        const y = this.player.y;
        const biome = this.map.getBiomeId(x, y);
        const zoneName = this.map.getZoneName(x, y);

        // Check if there are resources in this biome
        const potential = window.ZONE_RESOURCES && window.ZONE_RESOURCES[biome];
        if (!potential || potential.length === 0) {
            forecastDiv.style.display = 'none';
            return;
        }

        forecastDiv.style.display = 'block';
        document.getElementById('forecast-zone').textContent = zoneName;
        document.getElementById('forecast-zone').style.color = '#FFD700';

        // Drops
        const dropNames = potential.map(p => {
            const res = window.RESOURCE_TYPES[p.type];
            return `${res.emoji}`;
        }).join(' ');
        document.getElementById('forecast-drops').textContent = `Добыча: ${dropNames}`;

        // Estimates
        document.getElementById('forecast-estimates').innerHTML = `
            <div style="display:flex; justify-content:space-around; width:100%">
                <span>5м: ~5</span>
                <span>15м: ~15</span>
                <span>30м: ~35</span>
            </div>
        `;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Применяем зум
        this.ctx.save();
        this.ctx.scale(this.zoom, this.zoom);

        // Draw map
        this.map.draw(this.ctx, this.camera);

        // Draw resources (ground level)
        if (this.resources) {
            this.resources.forEach(res => res.draw(this.ctx, this.camera));
        }

        // Draw temples
        if (this.temples) {
            this.temples.drawTemples(this.ctx, this.camera);
        }

        // Collect all entities for y-sorting

        const entities = [this.player, ...this.npcs];
        entities.sort((a, b) => a.y - b.y);

        // Draw entities (with celebration dance)
        entities.forEach(entity => {
            let savedY = entity.y;
            if (this.celebrating && !entity.isPlayer) {
                entity.y += Math.sin(this.frame * 0.15 + entity.x * 0.1) * 5;
            }
            entity.draw(this.ctx, this.camera, this.frame);
            entity.y = savedY;
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
        this.player.meditationHours2 = this.gameState.stats2.totalMinutes / 60;
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

