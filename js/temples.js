// ========================================
// Temple Building — Строительство храмов в биомах
// 5 храмов, 15ч медитации рядом = 100%
// Стены проходимые (чтоб NPC не застревали)
// ========================================

const TEMPLES = [
    {
        id: 'temple_forest',
        name: '🌲 Лесной Храм',
        biome: 'forest',
        x: 25, y: 50, // координаты на карте (тайлы)
        size: 5, // 5x5 тайлов
        color: '#2D5A3D',
        accent: '#4CAF50',
        totalMinutes: 900 // 15 часов
    },
    {
        id: 'temple_snow',
        name: '❄️ Горный Храм',
        biome: 'snow',
        x: 95, y: 20,
        size: 5,
        color: '#B0C4DE',
        accent: '#87CEEB',
        totalMinutes: 900
    },
    {
        id: 'temple_desert',
        name: '🏜️ Храм Пустыни',
        biome: 'desert',
        x: 165, y: 55,
        size: 5,
        color: '#D4A574',
        accent: '#F4A460',
        totalMinutes: 900
    },
    {
        id: 'temple_beach',
        name: '🏖️ Прибрежный Храм',
        biome: 'beach',
        x: 80, y: 118,
        size: 5,
        color: '#DEB887',
        accent: '#20B2AA',
        totalMinutes: 900
    },
    {
        id: 'temple_cave',
        name: '🔥 Пещерный Храм',
        biome: 'cave',
        x: 25, y: 122,
        size: 5,
        color: '#4A4A6A',
        accent: '#FF6347',
        totalMinutes: 900
    }
];

class TempleSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.init();
    }

    init() {
        if (!this.gameState.temples) {
            this.gameState.temples = {};
            TEMPLES.forEach(t => {
                this.gameState.temples[t.id] = {
                    minutesSpent: 0,
                    completed: false
                };
            });
        }
        // Добавить недостающие храмы (если появились новые)
        TEMPLES.forEach(t => {
            if (!this.gameState.temples[t.id]) {
                this.gameState.temples[t.id] = { minutesSpent: 0, completed: false };
            }
        });
    }

    // Проверить, находится ли игрок рядом с храмом
    getPlayerNearbyTemple(px, py) {
        for (const t of TEMPLES) {
            const dist = Math.abs(px - t.x - t.size / 2) + Math.abs(py - t.y - t.size / 2);
            if (dist <= t.size + 3) { // Радиус ~8 тайлов
                return t;
            }
        }
        return null;
    }

    // Добавить минуты медитации к ближайшему храму
    addMinutes(px, py, minutes) {
        const temple = this.getPlayerNearbyTemple(px, py);
        if (!temple) return null;

        const data = this.gameState.temples[temple.id];
        if (data.completed) return null;

        data.minutesSpent = Math.min(data.minutesSpent + minutes, temple.totalMinutes);

        if (data.minutesSpent >= temple.totalMinutes && !data.completed) {
            data.completed = true;
            showNotification(`🏛️ ${temple.name} построен!`);
            showConfetti();
            if (window.game) {
                window.game.celebrating = true;
                window.game.celebrationTimer = 420;
            }
        }

        storage.saveGame(this.gameState);
        return temple;
    }

    // Прогресс храма 0-1
    getProgress(templeId) {
        const data = this.gameState.temples[templeId];
        const temple = TEMPLES.find(t => t.id === templeId);
        if (!data || !temple) return 0;
        return Math.min(1, data.minutesSpent / temple.totalMinutes);
    }

    // Этап строительства 0-5
    getStage(templeId) {
        const progress = this.getProgress(templeId);
        if (progress >= 1) return 5;
        if (progress >= 0.75) return 4;
        if (progress >= 0.5) return 3;
        if (progress >= 0.25) return 2;
        if (progress > 0) return 1;
        return 0;
    }

    // === РИСОВАНИЕ ХРАМА НА CANVAS ===
    drawTemples(ctx, camera) {
        TEMPLES.forEach(t => {
            const stage = this.getStage(t.id);
            const screenX = (t.x * TILE_SIZE - camera.x) * camera.zoom;
            const screenY = (t.y * TILE_SIZE - camera.y) * camera.zoom;
            const size = t.size * TILE_SIZE * camera.zoom;

            // Не рисовать если за экраном
            if (screenX + size < 0 || screenY + size < 0 ||
                screenX > ctx.canvas.width || screenY > ctx.canvas.height) return;

            if (stage === 0) {
                // Пустая площадка — только маркер
                this.drawBuildSite(ctx, screenX, screenY, size, t);
            } else {
                this.drawTempleStage(ctx, screenX, screenY, size, stage, t);
            }

            // Прогрессбар под храмом
            if (stage > 0 && stage < 5) {
                const progress = this.getProgress(t.id);
                const barW = size * 0.8;
                const barH = 4 * camera.zoom;
                const barX = screenX + (size - barW) / 2;
                const barY = screenY + size + 4 * camera.zoom;

                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(barX, barY, barW, barH);
                ctx.fillStyle = t.accent;
                ctx.fillRect(barX, barY, barW * progress, barH);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(barX, barY, barW, barH);
            }
        });
    }

    drawBuildSite(ctx, x, y, size, temple) {
        // Мерцающая площадка
        const alpha = 0.2 + Math.sin(Date.now() * 0.003) * 0.1;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.fillRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);

        // Текст "Медитируй рядом"
        ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.font = `${Math.max(8, size * 0.08)}px Philosopher`;
        ctx.textAlign = 'center';
        ctx.fillText('🏛️', x + size / 2, y + size / 2);
    }

    drawTempleStage(ctx, x, y, size, stage, temple) {
        const s = size;
        const cx = x + s / 2;
        const cy = y + s / 2;

        // Фундамент (этап 1+)
        if (stage >= 1) {
            ctx.fillStyle = temple.color;
            ctx.globalAlpha = 0.6;
            ctx.fillRect(x + s * 0.15, y + s * 0.65, s * 0.7, s * 0.25);
            ctx.globalAlpha = 1;

            // Границы пола
            ctx.strokeStyle = temple.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + s * 0.15, y + s * 0.65, s * 0.7, s * 0.25);
        }

        // Стены (этап 2+)
        if (stage >= 2) {
            ctx.fillStyle = temple.color;
            ctx.globalAlpha = 0.7;
            // Левая стена
            ctx.fillRect(x + s * 0.15, y + s * 0.35, s * 0.08, s * 0.55);
            // Правая стена
            ctx.fillRect(x + s * 0.77, y + s * 0.35, s * 0.08, s * 0.55);
            ctx.globalAlpha = 1;
        }

        // Колонны + вход (этап 3+)
        if (stage >= 3) {
            ctx.fillStyle = temple.accent;
            ctx.globalAlpha = 0.8;
            // 4 колонны
            const colW = s * 0.04;
            const colH = s * 0.35;
            ctx.fillRect(x + s * 0.25, y + s * 0.35, colW, colH);
            ctx.fillRect(x + s * 0.40, y + s * 0.35, colW, colH);
            ctx.fillRect(x + s * 0.56, y + s * 0.35, colW, colH);
            ctx.fillRect(x + s * 0.71, y + s * 0.35, colW, colH);
            ctx.globalAlpha = 1;
        }

        // Крыша (этап 4+)
        if (stage >= 4) {
            ctx.fillStyle = temple.accent;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(cx, y + s * 0.15);
            ctx.lineTo(x + s * 0.10, y + s * 0.40);
            ctx.lineTo(x + s * 0.90, y + s * 0.40);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

            // Контур крыши
            ctx.strokeStyle = temple.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Шпиль + сияние (этап 5 — завершён)
        if (stage >= 5) {
            // Шпиль
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(cx, y + s * 0.02);
            ctx.lineTo(cx - s * 0.03, y + s * 0.15);
            ctx.lineTo(cx + s * 0.03, y + s * 0.15);
            ctx.closePath();
            ctx.fill();

            // Сияние вокруг храма
            const glowR = s * 0.6;
            const glowAlpha = 0.1 + Math.sin(Date.now() * 0.002) * 0.05;
            const glow = ctx.createRadialGradient(cx, cy, s * 0.1, cx, cy, glowR);
            glow.addColorStop(0, `rgba(255, 215, 0, ${glowAlpha * 2})`);
            glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(x - s * 0.2, y - s * 0.2, s * 1.4, s * 1.4);

            // Текст эмоджи
            ctx.font = `${Math.max(10, s * 0.12)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('✨', cx, y + s * 0.10);
        }
    }

    // === ОТОБРАЖЕНИЕ В ПАНЕЛИ ===
    updateDisplay() {
        const container = document.getElementById('temples-list');
        if (!container) return;

        container.innerHTML = '';

        TEMPLES.forEach(t => {
            const stage = this.getStage(t.id);
            const progress = this.getProgress(t.id);
            const data = this.gameState.temples[t.id];
            const pct = Math.floor(progress * 100);
            const hoursSpent = (data.minutesSpent / 60).toFixed(1);
            const hoursTotal = (t.totalMinutes / 60).toFixed(0);

            const row = document.createElement('div');
            row.className = `temple-row ${stage >= 5 ? 'completed' : ''}`;
            row.innerHTML = `
                <div class="temple-name">${t.name}</div>
                <div class="temple-progress-wrap">
                    <div class="temple-bar">
                        <div class="temple-fill" style="width:${pct}%;background:${t.accent};"></div>
                    </div>
                    <span class="temple-pct">${pct}%</span>
                </div>
                <div class="temple-time">${hoursSpent} / ${hoursTotal} ч</div>
                <div class="temple-stage">Этап ${stage}/5</div>
            `;
            container.appendChild(row);
        });
    }
}

// UI
function toggleTemplesPanel() {
    togglePanel('temples-panel');
    if (window.game && window.game.temples) {
        window.game.temples.updateDisplay();
    }
}

// Exports
window.TempleSystem = TempleSystem;
window.TEMPLES = TEMPLES;
window.toggleTemplesPanel = toggleTemplesPanel;
