// ========================================
// Habit Analysis — Нейропсихологический анализ привычки
// Основано на: Lally et al. (2010) — формирование привычки
//              Модель осознанной компетенции (Noel Burch, 1970s)
//              Эриксон — deliberate practice
// ========================================

class HabitAnalysis {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // ==========================
    //  СБОР ДАННЫХ
    // ==========================

    // Все дни практики с минутами { 'YYYY-MM-DD': минуты }
    getAllDailyData() {
        const data = {};
        const s1 = this.gameState.stats && this.gameState.stats.dailyMinutes || {};
        const s2 = this.gameState.stats2 && this.gameState.stats2.dailyMinutes || {};

        // Объединить обе практики
        const allKeys = new Set([...Object.keys(s1), ...Object.keys(s2)]);
        allKeys.forEach(key => {
            data[key] = (s1[key] || 0) + (s2[key] || 0);
        });
        return data;
    }

    // Первый день практики
    getFirstPracticeDate() {
        const data = this.getAllDailyData();
        const dates = Object.keys(data).filter(d => data[d] > 0).sort();
        return dates.length > 0 ? dates[0] : utils.getDateKey();
    }

    // Общее количество часов
    getTotalHours() {
        const m1 = this.gameState.stats ? this.gameState.stats.totalMinutes || 0 : 0;
        const m2 = this.gameState.stats2 ? this.gameState.stats2.totalMinutes || 0 : 0;
        return (m1 + m2) / 60;
    }

    // Дней с практикой
    getDaysWithPractice() {
        const data = this.getAllDailyData();
        return Object.keys(data).filter(d => data[d] > 0).length;
    }

    // Общее количество дней с начала
    getTotalDaysElapsed() {
        const first = new Date(this.getFirstPracticeDate());
        const now = new Date();
        return Math.max(1, Math.ceil((now - first) / 86400000));
    }

    // ==========================
    //  МЕТРИКИ
    // ==========================

    // Консистентность (%) — дни с практикой / всего дней * 100
    getConsistencyScore() {
        const days = this.getDaysWithPractice();
        const total = this.getTotalDaysElapsed();
        return Math.min(100, Math.round((days / total) * 100));
    }

    // Интенсивность — среднее минут в день (считая ТОЛЬКО дни с практикой)
    getAvgIntensity() {
        const data = this.getAllDailyData();
        const activeDays = Object.entries(data).filter(([, v]) => v > 0);
        if (activeDays.length === 0) return 0;
        const sum = activeDays.reduce((s, [, v]) => s + v, 0);
        return sum / activeDays.length;
    }

    // Средние минуты в день (общие, включая пропуски)
    getAvgMinutesPerDay() {
        const data = this.getAllDailyData();
        const sum = Object.values(data).reduce((s, v) => s + v, 0);
        return sum / Math.max(1, this.getTotalDaysElapsed());
    }

    // Текущая серия (сколько дней подряд с практикой, включая сегодня)
    getCurrentStreak() {
        const data = this.getAllDailyData();
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = utils.getDateKey(d);
            if (data[key] && data[key] > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // Лучшая серия
    getBestStreak() {
        const data = this.getAllDailyData();
        const dates = Object.keys(data).filter(d => data[d] > 0).sort();
        if (dates.length === 0) return 0;

        let best = 1, current = 1;
        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diff = Math.round((curr - prev) / 86400000);
            if (diff === 1) {
                current++;
                best = Math.max(best, current);
            } else {
                current = 1;
            }
        }
        return Math.max(best, current);
    }

    // Анализ пропусков — средний промежуток между сессиями
    getAvgGap() {
        const data = this.getAllDailyData();
        const dates = Object.keys(data).filter(d => data[d] > 0).sort();
        if (dates.length < 2) return 0;

        let totalGap = 0;
        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            totalGap += Math.round((curr - prev) / 86400000);
        }
        return totalGap / (dates.length - 1);
    }

    // Моментум — тренд за последние 7 дней vs предыдущие 7
    getMomentum() {
        const data = this.getAllDailyData();
        const today = new Date();
        let recent = 0, previous = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = utils.getDateKey(d);
            recent += (data[key] || 0);
        }
        for (let i = 7; i < 14; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = utils.getDateKey(d);
            previous += (data[key] || 0);
        }

        if (previous === 0) return recent > 0 ? 100 : 0;
        return Math.round(((recent - previous) / previous) * 100);
    }

    // Паттерн недели — какие дни сильнее
    getWeekdayPattern() {
        const data = this.getAllDailyData();
        const days = [0, 0, 0, 0, 0, 0, 0]; // Пн-Вс
        const counts = [0, 0, 0, 0, 0, 0, 0];

        Object.entries(data).forEach(([dateStr, mins]) => {
            const d = new Date(dateStr);
            const dayIdx = (d.getDay() + 6) % 7; // Пн=0
            days[dayIdx] += mins;
            counts[dayIdx]++;
        });

        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        return dayNames.map((name, i) => ({
            name,
            avgMinutes: counts[i] > 0 ? Math.round(days[i] / counts[i]) : 0,
            total: days[i]
        }));
    }

    // ==========================
    //  МОДЕЛЬ ЛАЛЛИ — Формирование привычки
    // ==========================

    // Automaticity Score (0-100) — кривая асимптотического роста
    // Формула: A(t) = a * (1 - e^(-c*t))
    // Где t = эффективные дни практики (с учётом консистентности)
    getAutomaticityScore() {
        const practiceDays = this.getDaysWithPractice();
        const consistency = this.getConsistencyScore() / 100;
        const avgIntensity = this.getAvgIntensity();

        // Эффективные дни = дни * консистентность * интенсивность_фактор
        // Высокая интенсивность (много минут) ускоряет формирование
        const intensityFactor = Math.min(2, avgIntensity / 60); // 60 мин = 1x, 120 мин = 2x
        const effectiveDays = practiceDays * consistency * Math.max(0.5, intensityFactor);

        // Асимптотическая кривая: 95% достигается при ~66 эффективных днях
        // A(t) = 100 * (1 - e^(-0.045 * t))
        // При t=66: A = 100 * (1 - e^(-2.97)) ≈ 95%
        const c = 0.045;
        const score = 100 * (1 - Math.exp(-c * effectiveDays));

        return Math.min(100, Math.round(score));
    }

    // Прогноз: через сколько дней привычка сформируется (95% автоматичности)
    getHabitFormationPrediction() {
        const currentScore = this.getAutomaticityScore();
        if (currentScore >= 95) return 0; // Уже сформирована

        const consistency = this.getConsistencyScore() / 100;
        const avgIntensity = this.getAvgIntensity();
        const intensityFactor = Math.min(2, avgIntensity / 60);
        const dailyEffective = consistency * Math.max(0.5, intensityFactor);

        if (dailyEffective < 0.01) return 999; // Слишком мало практики

        // Нужно найти t для score=95: 95 = 100*(1 - e^(-0.045*t))
        // e^(-0.045*t) = 0.05
        // t = -ln(0.05) / 0.045 ≈ 66.5
        const targetEffectiveDays = -Math.log(0.05) / 0.045;
        const currentEffective = this.getDaysWithPractice() * consistency * Math.max(0.5, intensityFactor);
        const remaining = Math.max(0, targetEffectiveDays - currentEffective);

        // Реальные дни = эффективные / дневной_коэф
        return Math.ceil(remaining / dailyEffective);
    }

    // ==========================
    //  МОДЕЛЬ КОМПЕТЕНЦИИ (Noel Burch)
    // ==========================

    getCompetenceStage() {
        const score = this.getAutomaticityScore();
        const totalHours = this.getTotalHours();
        const practiceDays = this.getDaysWithPractice();
        const consistency = this.getConsistencyScore();

        // Этап 4: Неосознанная компетентность
        // Привычка автоматическая, высокие часы, стабильная практика
        if (score >= 90 && totalHours >= 100 && consistency >= 80) {
            return {
                stage: 4,
                name: 'Неосознанная Компетентность',
                emoji: '🧘',
                color: '#FFD700',
                description: 'Осознавание дыхания стало частью тебя. Ты делаешь это автоматически, как дышишь. Внимание держится без усилий.',
                analogy: 'Как опытный водитель — переключаешь передачи не задумываясь, параллельно обсуждая маршрут.',
                advice: 'Углубляй практику: увеличивай длительность, исследуй тонкости дыхания, помогай другим.'
            };
        }

        // Этап 3: Осознанная компетентность
        // Умеет, но требует сознательного усилия
        if (score >= 40 && totalHours >= 10 && practiceDays >= 14) {
            return {
                stage: 3,
                name: 'Осознанная Компетентность',
                emoji: '🎯',
                color: '#4ECDC4',
                description: 'Ты умеешь удерживать внимание на дыхании, но это требует сознательного усилия. Стоит отвлечься — и контакт теряется.',
                analogy: 'Как ученик водитель — знаешь все правила и умеешь, но нужно сосредоточиться на каждом действии.',
                advice: 'Ключевой этап! Практикуй каждый день без исключений. Именно здесь привычка кристаллизуется.'
            };
        }

        // Этап 2: Осознанная некомпетентность
        // Понимает важность, но пока не может стабильно
        if (practiceDays >= 3 || totalHours >= 1) {
            return {
                stage: 2,
                name: 'Осознанная Некомпетентность',
                emoji: '🌱',
                color: '#45B7D1',
                description: 'Ты осознаёшь, что удерживать внимание на дыхании трудно. Ум постоянно уносит. Но ты уже видишь ценность практики.',
                analogy: 'Как первые уроки вождения — понимаешь что нужно делать, но руки и ноги путаются.',
                advice: 'Не сдавайся! Каждая сессия укрепляет нейронные связи. Даже 5 минут в день — это прогресс.'
            };
        }

        // Этап 1: Неосознанная некомпетентность
        return {
            stage: 1,
            name: 'Неосознанная Некомпетентность',
            emoji: '😴',
            color: '#9B59B6',
            description: 'Ты в самом начале пути. Возможно, ещё не до конца понимаешь, как глубоко эта практика может изменить восприятие.',
            analogy: 'Как до первого урока вождения — не знаешь, чего не знаешь.',
            advice: 'Начни с маленьких сессий. Попробуй 5-10 минут осознания дыхания прямо сейчас.'
        };
    }

    // ==========================
    //  УРОВЕНЬ МАСТЕРСТВА (Ericsson / Deliberate Practice)
    // ==========================

    getSkillLevel() {
        const hours = this.getTotalHours();

        const levels = [
            { min: 0, max: 10, name: 'Новичок', emoji: '🌑', color: '#95A5A6', next: 10 },
            { min: 10, max: 50, name: 'Ученик', emoji: '🌒', color: '#3498DB', next: 50 },
            { min: 50, max: 200, name: 'Практикующий', emoji: '🌓', color: '#2ECC71', next: 200 },
            { min: 200, max: 500, name: 'Адепт', emoji: '🌔', color: '#F39C12', next: 500 },
            { min: 500, max: 1000, name: 'Мастер', emoji: '🌕', color: '#E74C3C', next: 1000 },
            { min: 1000, max: 5000, name: 'Гуру', emoji: '✨', color: '#FFD700', next: 5000 },
            { min: 5000, max: Infinity, name: 'Просветлённый', emoji: '🕉️', color: '#FFFFFF', next: Infinity }
        ];

        const level = levels.find(l => hours >= l.min && hours < l.max) || levels[levels.length - 1];
        const progress = level.max === Infinity ? 100 :
            Math.min(100, Math.round(((hours - level.min) / (level.max - level.min)) * 100));

        return {
            ...level,
            hours: Math.round(hours * 10) / 10,
            progress,
            hoursToNext: level.max === Infinity ? 0 : Math.round((level.max - hours) * 10) / 10,
            daysToNext: level.max === Infinity ? 0 :
                Math.ceil((level.max - hours) / Math.max(0.1, this.getAvgMinutesPerDay() / 60))
        };
    }

    // ==========================
    //  НЕЙРОПЛАСТИЧНОСТЬ — Стадии изменения мозга
    // ==========================

    getNeuroplasticityStage() {
        const hours = this.getTotalHours();
        const consistency = this.getConsistencyScore();

        if (hours >= 200 && consistency >= 70) {
            return {
                stage: 'structural',
                name: 'Структурные изменения',
                emoji: '🧠',
                description: 'Исследования показывают: 200+ часов медитации вызывают утолщение префронтальной коры и уменьшение амигдалы. Твой мозг физически меняется.',
                detail: 'Увеличена плотность серого вещества в зонах внимания и эмоциональной регуляции.'
            };
        }
        if (hours >= 50 && consistency >= 50) {
            return {
                stage: 'functional',
                name: 'Функциональные изменения',
                emoji: '⚡',
                description: 'Нейронные связи для осознанности укрепляются. Дефолт-сеть мозга (блуждание ума) ослабевает. Тебе всё легче замечать когда ум уносит.',
                detail: 'Улучшена активация дорсолатеральной префронтальной коры при задачах на внимание.'
            };
        }
        if (hours >= 10) {
            return {
                stage: 'synaptic',
                name: 'Синаптические изменения',
                emoji: '🔗',
                description: 'Новые синаптические связи формируются. Каждая сессия — как протаптывание тропинки в лесу. Сначала трава, потом тропа, потом дорога.',
                detail: 'Формируются новые нейронные паттерны для устойчивого внимания.'
            };
        }
        return {
            stage: 'initial',
            name: 'Начальная стадия',
            emoji: '🌱',
            description: 'Мозг только начинает адаптироваться. Главное сейчас — регулярность. Каждый повтор укрепляет основу для будущих изменений.',
            detail: 'Нейроны, которые вместе активируются — вместе связываются (закон Хебба).'
        };
    }

    // ==========================
    //  ОТОБРАЖЕНИЕ
    // ==========================

    updateDisplay() {
        const container = document.getElementById('habit-analysis-content');
        if (!container) return;

        const stage = this.getCompetenceStage();
        const automaticity = this.getAutomaticityScore();
        const prediction = this.getHabitFormationPrediction();
        const skill = this.getSkillLevel();
        const neuro = this.getNeuroplasticityStage();
        const momentum = this.getMomentum();
        const consistency = this.getConsistencyScore();
        const currentStreak = this.getCurrentStreak();
        const bestStreak = this.getBestStreak();
        const avgGap = this.getAvgGap();
        const weekPattern = this.getWeekdayPattern();
        const avgIntensity = this.getAvgIntensity();

        // Momentum icon
        const momIcon = momentum > 10 ? '📈' : momentum < -10 ? '📉' : '➡️';
        const momColor = momentum > 10 ? '#2ecc71' : momentum < -10 ? '#e74c3c' : '#f39c12';
        const momText = momentum > 0 ? `+${momentum}%` : `${momentum}%`;

        // Prediction text
        let predText = '';
        if (prediction === 0) {
            predText = '✅ Привычка сформирована!';
        } else if (prediction > 365) {
            predText = 'Нужно больше регулярности';
        } else {
            predText = `~${prediction} дней при текущем темпе`;
        }

        // Weekday bars
        const maxWeekday = Math.max(1, ...weekPattern.map(d => d.avgMinutes));
        const weekBarsHtml = weekPattern.map(d => {
            const pct = Math.round((d.avgMinutes / maxWeekday) * 100);
            return `<div class="ha-weekday">
                <div class="ha-weekday-bar-wrap">
                    <div class="ha-weekday-bar" style="height:${pct}%;background:${d.avgMinutes > 0 ? 'var(--nature-green)' : 'rgba(255,255,255,0.1)'}"></div>
                </div>
                <span class="ha-weekday-label">${d.name}</span>
                <span class="ha-weekday-val">${d.avgMinutes}м</span>
            </div>`;
        }).join('');

        container.innerHTML = `
            <!-- Этап компетенции -->
            <div class="ha-section ha-competence" style="border-color:${stage.color}">
                <div class="ha-section-header">
                    <span class="ha-stage-emoji">${stage.emoji}</span>
                    <div>
                        <div class="ha-stage-name" style="color:${stage.color}">Этап ${stage.stage}/4: ${stage.name}</div>
                        <div class="ha-stage-sub">Модель осознанной компетенции (Noel Burch)</div>
                    </div>
                </div>
                <p class="ha-desc">${stage.description}</p>
                <div class="ha-analogy">🚗 <em>${stage.analogy}</em></div>
                <div class="ha-advice">💡 ${stage.advice}</div>
                <div class="ha-stage-dots">
                    ${[1, 2, 3, 4].map(i => `<div class="ha-dot ${i <= stage.stage ? 'active' : ''}" style="${i <= stage.stage ? `background:${stage.color}` : ''}">
                        <span>${i === 1 ? '😴' : i === 2 ? '🌱' : i === 3 ? '🎯' : '🧘'}</span>
                    </div>`).join('<div class="ha-dot-line"></div>')}
                </div>
            </div>

            <!-- Автоматичность (Lally) -->
            <div class="ha-section">
                <div class="ha-section-title">🔬 Индекс Автоматичности</div>
                <div class="ha-section-sub">По модели Phillippa Lally (UCL, 2010)</div>
                <div class="ha-auto-wrap">
                    <div class="ha-auto-ring">
                        <svg viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.08)" stroke-width="8" fill="none"/>
                            <circle cx="60" cy="60" r="54" stroke="${automaticity >= 95 ? '#FFD700' : automaticity >= 60 ? '#2ecc71' : automaticity >= 30 ? '#f39c12' : '#e74c3c'}" 
                                    stroke-width="8" fill="none"
                                    stroke-dasharray="${(automaticity / 100) * 339.3} 339.3" 
                                    stroke-linecap="round"
                                    transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="ha-auto-value">${automaticity}%</div>
                    </div>
                    <div class="ha-auto-info">
                        <div class="ha-auto-pred">${predText}</div>
                        <div class="ha-auto-note">66 дней — среднее время формирования привычки<br>(диапазон: 18–254 дня)</div>
                    </div>
                </div>
            </div>

            <!-- Уровень мастерства -->
            <div class="ha-section">
                <div class="ha-section-title">🌙 Уровень мастерства</div>
                <div class="ha-skill-header">
                    <span class="ha-skill-emoji">${skill.emoji}</span>
                    <span class="ha-skill-name" style="color:${skill.color}">${skill.name}</span>
                    <span class="ha-skill-hours">${skill.hours}ч</span>
                </div>
                <div class="ha-progress-bar">
                    <div class="ha-progress-fill" style="width:${skill.progress}%;background:${skill.color}"></div>
                </div>
                ${skill.hoursToNext > 0 ? `<div class="ha-skill-next">До следующего уровня: ${skill.hoursToNext}ч (~${skill.daysToNext} дн.)</div>` : '<div class="ha-skill-next" style="color:#FFD700">Максимальный уровень!</div>'}
            </div>

            <!-- Нейропластичность -->
            <div class="ha-section">
                <div class="ha-section-title">${neuro.emoji} Нейропластичность мозга</div>
                <div class="ha-neuro-name">${neuro.name}</div>
                <p class="ha-desc">${neuro.description}</p>
                <div class="ha-neuro-detail">🔬 ${neuro.detail}</div>
            </div>

            <!-- Ключевые метрики -->
            <div class="ha-section">
                <div class="ha-section-title">📊 Ключевые метрики</div>
                <div class="ha-metrics-grid">
                    <div class="ha-metric">
                        <div class="ha-metric-value">${consistency}%</div>
                        <div class="ha-metric-label">Консистентность</div>
                    </div>
                    <div class="ha-metric">
                        <div class="ha-metric-value" style="color:${momColor}">${momIcon} ${momText}</div>
                        <div class="ha-metric-label">Моментум (7д)</div>
                    </div>
                    <div class="ha-metric">
                        <div class="ha-metric-value">${currentStreak} 🔥</div>
                        <div class="ha-metric-label">Текущая серия</div>
                    </div>
                    <div class="ha-metric">
                        <div class="ha-metric-value">${bestStreak} ⭐</div>
                        <div class="ha-metric-label">Лучшая серия</div>
                    </div>
                    <div class="ha-metric">
                        <div class="ha-metric-value">${Math.round(avgIntensity)}м</div>
                        <div class="ha-metric-label">Средняя сессия</div>
                    </div>
                    <div class="ha-metric">
                        <div class="ha-metric-value">${avgGap.toFixed(1)}д</div>
                        <div class="ha-metric-label">Средний разрыв</div>
                    </div>
                </div>
            </div>

            <!-- Паттерн недели -->
            <div class="ha-section">
                <div class="ha-section-title">📅 Биоритм недели</div>
                <div class="ha-section-sub">Средние минуты по дням</div>
                <div class="ha-weekdays">${weekBarsHtml}</div>
            </div>

            <!-- Научные источники -->
            <div class="ha-sources">
                <div class="ha-sources-title">📚 Научная база</div>
                <div>• Lally et al. (2010) "How are habits formed" — European J. of Social Psychology</div>
                <div>• Noel Burch — Модель осознанной компетенции (4 стадии)</div>
                <div>• Hölzel et al. (2011) — Структурные изменения мозга от медитации</div>
                <div>• Ericsson (1993) — Deliberate practice в формировании навыков</div>
            </div>
        `;
    }
}

// UI
function toggleHabitPanel() {
    togglePanel('habit-panel');
    if (window.game && window.game.habitAnalysis) {
        window.game.habitAnalysis.updateDisplay();
    }
}

// Exports
window.HabitAnalysis = HabitAnalysis;
window.toggleHabitPanel = toggleHabitPanel;
