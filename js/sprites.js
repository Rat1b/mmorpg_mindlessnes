// ========================================
// Sprites - Programmatic sprite generation
// ========================================

const SPRITE_SIZE = 32;
const COLORS = {
    skin: ['#FFDAB9', '#DEB887', '#D2691E', '#8B4513', '#FFE4C4', '#E8BEAC', '#C68642', '#8D5524'],
    robeColors: {
        buddhist: '#FF8C00',
        hindu: '#FF6347',
        taoist: '#191970',
        zen: '#2F4F4F',
        white: '#F5F5F5',
        golden: '#FFD700',
        casual: ['#4682B4', '#556B2F', '#8B4513', '#483D8B', '#2F4F4F', '#708090']
    },
    hair: ['#1A1A1A', '#2F1810', '#4A3728', '#5C4033', '#8B4513', '#A0522D', '#D4A574', '#B8860B', '#A0A0A0', '#C0C0C0', '#FFFFFF', '#DC143C', '#FF69B4']
};

// Стили причёсок
const HAIR_STYLES = ['bald', 'short', 'medium', 'long', 'ponytail', 'mohawk', 'spiky'];

function createSprite(ctx, config) {
    const { x, y, type, color, hairColor, hairStyle, hasBeard, hasMustache, hasHalo, auraColor, skinColor, accessory } = config;

    // Aura effect
    if (auraColor) {
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 22, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x + 16, y + 16, 5, x + 16, y + 16, 22);
        gradient.addColorStop(0, auraColor + '60');
        gradient.addColorStop(1, auraColor + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Body (robe)
    ctx.fillStyle = color || '#4682B4';
    ctx.fillRect(x + 8, y + 16, 16, 14);

    // Arms
    ctx.fillRect(x + 4, y + 17, 5, 10);
    ctx.fillRect(x + 23, y + 17, 5, 10);

    // Head
    ctx.fillStyle = skinColor || '#FFDAB9';
    ctx.beginPath();
    ctx.arc(x + 16, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair styles
    if (hairColor && hairStyle !== 'bald') {
        ctx.fillStyle = hairColor;

        if (hairStyle === 'short') {
            ctx.beginPath();
            ctx.arc(x + 16, y + 8, 6, Math.PI, 0);
            ctx.fill();
        } else if (hairStyle === 'medium') {
            ctx.beginPath();
            ctx.arc(x + 16, y + 7, 7, Math.PI * 0.8, Math.PI * 0.2, true);
            ctx.fill();
            ctx.fillRect(x + 9, y + 7, 3, 8);
            ctx.fillRect(x + 20, y + 7, 3, 8);
        } else if (hairStyle === 'long') {
            ctx.beginPath();
            ctx.arc(x + 16, y + 7, 8, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(x + 7, y + 7, 4, 16);
            ctx.fillRect(x + 21, y + 7, 4, 16);
        } else if (hairStyle === 'ponytail') {
            ctx.beginPath();
            ctx.arc(x + 16, y + 6, 6, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(x + 14, y + 0, 4, 6);
        } else if (hairStyle === 'mohawk') {
            ctx.fillRect(x + 13, y + 0, 6, 10);
        } else if (hairStyle === 'spiky') {
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(x + 9 + i * 3, y + 2 - i % 2 * 2, 3, 6);
            }
        } else {
            ctx.beginPath();
            ctx.arc(x + 16, y + 8, 7, Math.PI, 0);
            ctx.fill();
        }
    }

    // Mustache styles (ниже носа, разные варианты)
    if (hasMustache) {
        ctx.fillStyle = hairColor || '#5C4033';
        const style = config.mustacheStyle || 0;

        if (style === 0) {
            // Классические усы
            ctx.fillRect(x + 10, y + 13, 4, 2);
            ctx.fillRect(x + 18, y + 13, 4, 2);
        } else if (style === 1) {
            // Усы-подковка
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 12);
            ctx.lineTo(x + 10, y + 16);
            ctx.lineTo(x + 13, y + 14);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 22, y + 12);
            ctx.lineTo(x + 22, y + 16);
            ctx.lineTo(x + 19, y + 14);
            ctx.fill();
        } else {
            // Густые усы
            ctx.fillRect(x + 10, y + 12, 12, 3);
        }
    }

    // Beard styles
    if (hasBeard) {
        ctx.fillStyle = hairColor || '#A0A0A0';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 14);
        ctx.lineTo(x + 16, y + 24);
        ctx.lineTo(x + 22, y + 14);
        ctx.fill();
    }

    // Halo for masters
    if (hasHalo) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x + 16, y + 2, 10, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Accessory (glasses, headband, etc)
    if (accessory === 'glasses') {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 10, y + 8, 5, 4);
        ctx.strokeRect(x + 17, y + 8, 5, 4);
        ctx.beginPath();
        ctx.moveTo(x + 15, y + 9);
        ctx.lineTo(x + 17, y + 9);
        ctx.stroke();
    } else if (accessory === 'headband') {
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(x + 8, y + 5, 16, 3);
    }

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 12, y + 9, 2, 2);
    ctx.fillRect(x + 18, y + 9, 2, 2);
}

function generateCharacterSprites() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const sprites = {};

    // Generate different character types
    const configs = [
        { id: 'player', x: 0, y: 0, color: '#4169E1', skinColor: '#FFDAB9', hairColor: '#5C4033', hairStyle: 'short' },
        { id: 'monk', x: 32, y: 0, color: '#FF8C00', skinColor: '#DEB887', hairStyle: 'bald' },
        { id: 'master', x: 64, y: 0, color: '#FFD700', skinColor: '#FFDAB9', hasBeard: true, hasHalo: true, hairColor: '#FFFFFF', hairStyle: 'bald' },
        { id: 'npc', x: 96, y: 0, color: '#6B8E23', skinColor: '#FFE4C4', hairColor: '#2F1810', hairStyle: 'medium' }
    ];

    configs.forEach(cfg => createSprite(ctx, cfg));

    return canvas;
}

function drawCharacter(ctx, x, y, character, frame = 0) {
    // Генерируем характеристики на основе id персонажа
    const seed = character.id ? character.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : Math.random() * 1000;

    const skinColors = COLORS.skin;
    const hairColors = COLORS.hair;

    // Выбираем стиль волос - НЕ все лысые
    const hairIndex = (seed + 3) % HAIR_STYLES.length;
    // Только ~15% лысые
    const hairStyle = (seed % 7 === 0) ? 'bald' : HAIR_STYLES[hairIndex === 0 ? 1 : hairIndex];

    const config = {
        x: x - 16,
        y: y - 24,
        color: character.color || COLORS.robeColors.casual[seed % COLORS.robeColors.casual.length],
        skinColor: skinColors[seed % skinColors.length],
        hairColor: hairColors[(seed * 3 + 2) % hairColors.length],
        hairStyle: hairStyle,
        hasBeard: character.level > 500 || seed % 6 === 0,
        hasMustache: seed % 8 === 0,
        mustacheStyle: (seed % 3), // 0, 1, 2 - разные стили усов
        hasHalo: character.level > 100 || character.isMaster,
        auraColor: character.auraColor,
        accessory: seed % 10 === 0 ? 'glasses' : (seed % 15 === 0 ? 'headband' : null)
    };

    createSprite(ctx, config);

    // Walking animation - legs movement
    if (character.isMoving && frame % 15 < 8) {
        ctx.fillStyle = config.color;
        ctx.fillRect(x - 5, y + 6, 4, 5);
        ctx.fillRect(x + 1, y + 8, 4, 5);
    } else if (character.isMoving) {
        ctx.fillStyle = config.color;
        ctx.fillRect(x - 5, y + 8, 4, 5);
        ctx.fillRect(x + 1, y + 6, 4, 5);
    }
}


function drawCharacterInfo(ctx, x, y, character) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px Philosopher';

    // Подготавливаем строки для отображения (над головой)
    const lines = [];

    // Строка 1: Имя
    lines.push({ text: character.name, color: character.color || '#FFFFFF', bold: true });

    // Строка 2: Возраст
    const age = character.age === Infinity ? '∞' : character.age;
    lines.push({ text: `${age} лет`, color: '#AADDFF', bold: false });

    // Строка 3: Время практики (игрок видит минуты, у NPC — короткий формат)
    const formatFn = character.isPlayer ? utils.formatTimeFull : utils.formatTime;
    const hours = character.meditationHours === Infinity ? '∞' : formatFn(character.meditationHours * 60);
    lines.push({ text: `⏱ ${hours}`, color: '#AAFFAA', bold: false });

    // Рассчитываем размеры фона
    const lineHeight = 14;
    const padding = 4;
    const totalHeight = lines.length * lineHeight + padding * 2;

    // Находим максимальную ширину
    let maxWidth = 0;
    lines.forEach(line => {
        ctx.font = line.bold ? 'bold 11px Philosopher' : '10px Philosopher';
        const w = ctx.measureText(line.text).width;
        if (w > maxWidth) maxWidth = w;
    });
    maxWidth += padding * 2 + 6;

    // Рисуем фон
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    const bgX = x - maxWidth / 2;
    const bgY = y - 58 - (lines.length - 2) * lineHeight;
    ctx.fillRect(bgX, bgY, maxWidth, totalHeight);

    // Рисуем текст
    let textY = bgY + lineHeight;
    lines.forEach(line => {
        ctx.font = line.bold ? 'bold 11px Philosopher' : '10px Philosopher';
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, x, textY);
        textY += lineHeight;
    });

    // === НИЖНЯЯ КОРОБКА (под персонажем) ===
    const lvl = character.level || 1;
    const lvlText = `Lv.${utils.formatNumber(lvl)}`;

    // Для игрока добавляем время практики 2
    let bottomText = lvlText;
    let bottomWidth;

    if (character.isPlayer) {
        const hours2 = (character.meditationHours2 === Infinity) ? '∞' : utils.formatTime((character.meditationHours2 || 0) * 60);
        bottomText = `${lvlText} | ${hours2}`;
    }

    ctx.font = 'bold 10px Philosopher';
    bottomWidth = ctx.measureText(bottomText).width;

    // Цвет по уровню
    let lvlColor = '#4CAF50';
    if (lvl > 10000) lvlColor = '#FFD700';
    else if (lvl > 1000) lvlColor = '#9C27B0';
    else if (lvl > 100) lvlColor = '#2196F3';
    else if (lvl > 50) lvlColor = '#00BCD4';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - bottomWidth / 2 - 5, y + 18, bottomWidth + 10, 14);

    ctx.fillStyle = lvlColor;
    ctx.fillText(bottomText, x, y + 29);
}

window.sprites = { drawCharacter, drawCharacterInfo, generateCharacterSprites, SPRITE_SIZE };


