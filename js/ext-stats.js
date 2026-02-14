// ========================================
// Extended Stats — Heatmap + Graphs
// ========================================

class ExtendedStats {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Получить данные для heatmap (последние 12 недель = 84 дня)
    getHeatmapData(weeks = 12) {
        const days = weeks * 7;
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const key = utils.getDateKey(date);

            const m1 = (this.gameState.stats && this.gameState.stats.dailyMinutes && this.gameState.stats.dailyMinutes[key]) || 0;
            const m2 = (this.gameState.stats2 && this.gameState.stats2.dailyMinutes && this.gameState.stats2.dailyMinutes[key]) || 0;
            const totalMinutes = m1 + m2;

            data.push({
                date: key,
                minutes: totalMinutes,
                dayOfWeek: date.getDay(), // 0=Sun
                weekIndex: Math.floor(i / 7)
            });
        }

        return data;
    }

    // Получить данные за N дней для графика
    getDailyData(days = 30) {
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const key = utils.getDateKey(date);

            const m1 = (this.gameState.stats && this.gameState.stats.dailyMinutes && this.gameState.stats.dailyMinutes[key]) || 0;
            const m2 = (this.gameState.stats2 && this.gameState.stats2.dailyMinutes && this.gameState.stats2.dailyMinutes[key]) || 0;

            data.push({
                date: key,
                minutes: m1 + m2,
                label: `${date.getDate()}.${date.getMonth() + 1}`
            });
        }

        return data;
    }

    // === РЕНДЕРИНГ HEATMAP ===
    renderHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container) return;

        const data = this.getHeatmapData(12);
        const maxMinutes = Math.max(...data.map(d => d.minutes), 1);

        // Перегруппировать: [неделя][день]
        const weeks = {};
        data.forEach(d => {
            const w = d.weekIndex;
            if (!weeks[w]) weeks[w] = [];
            weeks[w].push(d);
        });

        let html = '<div class="heatmap-grid">';

        // Дни недели слева
        html += '<div class="heatmap-labels">';
        ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].forEach((day, i) => {
            html += `<span class="heatmap-day-label">${i % 2 === 1 ? day : ''}</span>`;
        });
        html += '</div>';

        // Сетка
        html += '<div class="heatmap-weeks">';
        const weekKeys = Object.keys(weeks).sort((a, b) => b - a);
        weekKeys.forEach(wk => {
            html += '<div class="heatmap-week">';
            // Создать слоты для всех 7 дней
            const daySlots = new Array(7).fill(null);
            weeks[wk].forEach(d => { daySlots[d.dayOfWeek] = d; });

            daySlots.forEach(d => {
                if (!d) {
                    html += '<div class="heatmap-cell empty"></div>';
                    return;
                }
                const intensity = d.minutes / maxMinutes;
                let level = 0;
                if (d.minutes >= 300) level = 4;      // 5ч+
                else if (d.minutes >= 180) level = 3;  // 3ч+
                else if (d.minutes >= 60) level = 2;   // 1ч+
                else if (d.minutes > 0) level = 1;     // >0
                const hours = (d.minutes / 60).toFixed(1);
                html += `<div class="heatmap-cell level-${level}" title="${d.date}: ${hours}ч"></div>`;
            });
            html += '</div>';
        });
        html += '</div></div>';

        // Легенда
        html += `<div class="heatmap-legend">
            <span>Меньше</span>
            <div class="heatmap-cell level-0"></div>
            <div class="heatmap-cell level-1"></div>
            <div class="heatmap-cell level-2"></div>
            <div class="heatmap-cell level-3"></div>
            <div class="heatmap-cell level-4"></div>
            <span>Больше</span>
        </div>`;

        container.innerHTML = html;
    }

    // === РЕНДЕРИНГ ГРАФИКА ===
    renderChart() {
        const canvas = document.getElementById('stats-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getDailyData(30);
        const maxMin = Math.max(...data.map(d => d.minutes), 1);

        const w = canvas.width;
        const h = canvas.height;
        const padding = { top: 20, right: 10, bottom: 30, left: 40 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        ctx.clearRect(0, 0, w, h);

        // Фон
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, w, h);

        // Сетка по Y
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            // Подписи
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '10px Philosopher';
            ctx.textAlign = 'right';
            const val = Math.round(maxMin * (1 - i / 4));
            ctx.fillText(`${val}м`, padding.left - 5, y + 4);
        }

        // Линия графика
        ctx.beginPath();
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;

        data.forEach((d, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            const y = padding.top + chartH - (d.minutes / maxMin) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Заливка под графиком
        const lastX = padding.left + chartW;
        const lastY = padding.top + chartH - (data[data.length - 1].minutes / maxMin) * chartH;
        ctx.lineTo(lastX, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, 'rgba(155, 89, 182, 0.3)');
        grad.addColorStop(1, 'rgba(155, 89, 182, 0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Точки
        data.forEach((d, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            const y = padding.top + chartH - (d.minutes / maxMin) * chartH;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = d.minutes >= 300 ? '#FFD700' : '#9b59b6';
            ctx.fill();
        });

        // Подписи X (every 5 days)
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '9px Philosopher';
        ctx.textAlign = 'center';
        data.forEach((d, i) => {
            if (i % 5 === 0 || i === data.length - 1) {
                const x = padding.left + (chartW / (data.length - 1)) * i;
                ctx.fillText(d.label, x, h - 5);
            }
        });

        // Линия цели дня
        const goalMin = this.gameState.dailyGoal ? this.gameState.dailyGoal.targetMinutes : 300;
        if (goalMin <= maxMin) {
            const goalY = padding.top + chartH - (goalMin / maxMin) * chartH;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(244, 208, 63, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding.left, goalY);
            ctx.lineTo(w - padding.right, goalY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(244, 208, 63, 0.5)';
            ctx.font = '9px Philosopher';
            ctx.textAlign = 'left';
            ctx.fillText('Цель', w - padding.right - 25, goalY - 5);
        }
    }

    updateDisplay() {
        this.renderHeatmap();
        this.renderChart();
    }
}

// UI
function toggleExtStatsPanel() {
    togglePanel('extstats-panel');
    if (window.game && window.game.extStats) {
        window.game.extStats.updateDisplay();
    }
}

// Exports
window.ExtendedStats = ExtendedStats;
window.toggleExtStatsPanel = toggleExtStatsPanel;
