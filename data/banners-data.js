// ========================================
// Banners Data - Ежедневные SVG-баннеры
// 14 уникальных произведений минимализма
// ========================================

function makeBannerSVG(id, bgColors, elements) {
    const [c1, c2] = bgColors;
    return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${id}bg" x1="0" y1="0" x2="${id.includes('12') ? '1' : '0'}" y2="1">
            <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
        </linearGradient></defs>
        <rect width="400" height="300" fill="url(#${id}bg)"/>
        ${elements}
    </svg>`;
}

const DAILY_BANNERS = [
    {
        id: 'b1', date: '2026-02-14', emoji: '❤️',
        title: 'Сердце Осознанности',
        description: 'День любви и сострадания к себе',
        svg: makeBannerSVG('b1', ['#8B1A4A', '#E8A0BF'], `
            <circle cx="200" cy="140" r="110" fill="rgba(255,255,255,0.12)"/>
            <path d="M200,225 C200,225 110,175 110,125 C110,90 140,72 170,90 C190,102 200,120 200,120 C200,120 210,102 230,90 C260,72 290,90 290,125 C290,175 200,225 200,225Z" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
            <path d="M200,215 C200,215 130,172 130,132 C130,105 152,90 175,102 C192,112 200,128 200,128 C200,128 208,112 225,102 C248,90 270,105 270,132 C270,172 200,215 200,215Z" fill="rgba(255,255,255,0.1)"/>
            <circle cx="200" cy="155" r="7" fill="rgba(255,255,255,0.5)"/>
            <path d="M188,167 Q194,160 200,167 Q206,160 212,167 L210,178 Q200,174 190,178Z" fill="rgba(255,255,255,0.4)"/>
            <circle cx="155" cy="108" r="2" fill="#fff" opacity=".6"/><circle cx="248" cy="102" r="1.5" fill="#fff" opacity=".5"/>
            <circle cx="175" cy="195" r="1.5" fill="#fff" opacity=".5"/><circle cx="230" cy="198" r="2" fill="#fff" opacity=".4"/>
            <circle cx="142" cy="155" r="1" fill="#FFD700" opacity=".7"/><circle cx="258" cy="150" r="1" fill="#FFD700" opacity=".7"/>
            <circle cx="200" cy="88" r="1.5" fill="#fff" opacity=".4"/>`)
    },
    {
        id: 'b2', date: '2026-02-15', emoji: '🌅',
        title: 'Рассвет Присутствия',
        description: 'Каждый рассвет — начало нового пути',
        svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="b2bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a0a2e"/><stop offset="35%" stop-color="#2d1b69"/>
                <stop offset="65%" stop-color="#e8631e"/><stop offset="100%" stop-color="#FFD700"/>
            </linearGradient><radialGradient id="b2s" cx="50%" cy="62%">
                <stop offset="0%" stop-color="#FFD700"/><stop offset="40%" stop-color="#FF8C00" stop-opacity=".5"/>
                <stop offset="100%" stop-color="#FF6347" stop-opacity="0"/>
            </radialGradient></defs>
            <rect width="400" height="300" fill="url(#b2bg)"/>
            <circle cx="200" cy="190" r="70" fill="url(#b2s)"/><circle cx="200" cy="190" r="20" fill="#FFD700"/>
            <path d="M0,250 L80,200 L130,218 L200,178 L270,210 L340,195 L400,230 L400,300 L0,300Z" fill="#1a0a30" opacity=".8"/>
            <path d="M0,268 L60,238 L150,252 L220,228 L300,248 L370,232 L400,258 L400,300 L0,300Z" fill="#2d1040" opacity=".6"/>
            <circle cx="200" cy="175" r="5" fill="rgba(255,255,255,.5)"/>
            <path d="M192,183 Q196,178 200,183 Q204,178 208,183 L207,190 Q200,187 193,190Z" fill="rgba(255,255,255,.35)"/>
            <circle cx="80" cy="40" r="1" fill="#fff" opacity=".6"/><circle cx="320" cy="30" r="1.5" fill="#fff" opacity=".5"/>
            <circle cx="150" cy="55" r="1" fill="#fff" opacity=".4"/><circle cx="280" cy="60" r="1" fill="#fff" opacity=".3"/>
        </svg>`
    },
    {
        id: 'b3', date: '2026-02-16', emoji: '🌊',
        title: 'Океан Спокойствия',
        description: 'Глубина дыхания — глубина океана',
        svg: makeBannerSVG('b3', ['#001a33', '#006994'], `
            <circle cx="320" cy="60" r="18" fill="#E8E8D0" opacity=".9"/>
            <circle cx="317" cy="57" r="13" fill="#001a33"/>
            <path d="M50,155 Q125,135 200,155 Q275,175 350,155" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
            <path d="M30,180 Q130,160 200,180 Q270,200 370,180" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
            <path d="M20,205 Q120,185 200,205 Q280,225 380,205" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>
            <path d="M10,230 Q110,212 200,230 Q290,248 390,230" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1.5"/>
            <path d="M0,253 Q100,238 200,253 Q300,268 400,253" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
            <line x1="320" y1="78" x2="320" y2="150" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="3,5"/>
            <path d="M195,115 L200,100 L205,115 L205,130 Q200,126 195,130Z" fill="rgba(255,255,255,.3)"/>`)
    },
    {
        id: 'b4', date: '2026-02-17', emoji: '🏔️',
        title: 'Путь к Вершине',
        description: 'Каждый шаг — это уже вершина',
        svg: makeBannerSVG('b4', ['#0c1445', '#a8d8ea'], `
            <polygon points="200,60 60,280 340,280" fill="#2c3e6b" opacity=".9"/>
            <polygon points="200,60 150,140 250,140" fill="#e8f0ff" opacity=".6"/>
            <polygon points="80,180 0,300 160,300" fill="#1a2a50" opacity=".5"/>
            <polygon points="320,200 260,300 400,300" fill="#1a2a50" opacity=".5"/>
            <path d="M120,260 C140,248 158,230 172,215 C182,205 190,188 196,172 C198,165 200,152 200,142" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-dasharray="6,4"/>
            <circle cx="200" cy="55" r="5" fill="rgba(255,255,255,.65)"/>
            <circle cx="90" cy="30" r="1.5" fill="#fff" opacity=".7"/><circle cx="310" cy="25" r="1" fill="#fff" opacity=".6"/>
            <circle cx="50" cy="60" r="1" fill="#fff" opacity=".5"/><circle cx="350" cy="50" r="1.2" fill="#fff" opacity=".5"/>
            <circle cx="160" cy="20" r=".8" fill="#fff" opacity=".4"/><circle cx="250" cy="35" r="1" fill="#fff" opacity=".6"/>`)
    },
    {
        id: 'b5', date: '2026-02-18', emoji: '🌸',
        title: 'Цветение Духа',
        description: 'Лотос растёт из тьмы к свету',
        svg: makeBannerSVG('b5', ['#FFF5EE', '#FFE4E1'], `
            <circle cx="200" cy="140" r="80" fill="rgba(255,182,193,.2)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".45" transform="rotate(0,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".4" transform="rotate(45,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".45" transform="rotate(90,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".4" transform="rotate(135,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".45" transform="rotate(180,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".4" transform="rotate(225,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".45" transform="rotate(270,200,140)"/>
            <ellipse cx="200" cy="105" rx="16" ry="38" fill="#FFB6C1" opacity=".4" transform="rotate(315,200,140)"/>
            <circle cx="200" cy="140" r="10" fill="#FF69B4" opacity=".35"/>
            <circle cx="200" cy="140" r="4" fill="#FFD700" opacity=".5"/>
            <circle cx="200" cy="140" r="48" fill="none" stroke="rgba(180,130,140,.12)" stroke-width="1"/>
            <circle cx="200" cy="140" r="68" fill="none" stroke="rgba(180,130,140,.08)" stroke-width="1"/>
            <line x1="200" y1="178" x2="200" y2="280" stroke="#5a8a5a" stroke-width="2" opacity=".35"/>`)
    },
    {
        id: 'b6', date: '2026-02-19', emoji: '🌙',
        title: 'Лунная Медитация',
        description: 'Тишина лунного света',
        svg: makeBannerSVG('b6', ['#0a0520', '#1a1a4e'], `
            <rect x="0" y="200" width="400" height="100" fill="rgba(0,0,20,.5)"/>
            <circle cx="280" cy="80" r="38" fill="#FFFACD" opacity=".9"/>
            <circle cx="272" cy="74" r="5" fill="#D4C57A" opacity=".25"/>
            <circle cx="288" cy="88" r="3.5" fill="#D4C57A" opacity=".18"/>
            <ellipse cx="280" cy="215" rx="6" ry="32" fill="#FFFACD" opacity=".07"/>
            <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,.08)" stroke-width=".5"/>
            <path d="M50,180 L50,120 C50,120 55,100 60,120L60,180" fill="none" stroke="#1a1a3e" stroke-width="3"/>
            <path d="M40,130 C40,130 50,120 65,135" fill="none" stroke="#1a1a3e" stroke-width="2"/>
            <circle cx="120" cy="195" r="5" fill="rgba(255,255,255,.35)"/>
            <path d="M112,200 Q116,194 120,200 Q124,194 128,200 L127,207 Q120,204 113,207Z" fill="rgba(255,255,255,.25)"/>
            <circle cx="100" cy="30" r="1" fill="#fff" opacity=".5"/><circle cx="180" cy="50" r=".8" fill="#fff" opacity=".4"/>
            <circle cx="350" cy="40" r="1.2" fill="#fff" opacity=".5"/><circle cx="40" cy="60" r="1" fill="#fff" opacity=".35"/>`)
    },
    {
        id: 'b7', date: '2026-02-20', emoji: '🔥',
        title: 'Пламя Осознания',
        description: 'Внутренний огонь никогда не гаснет',
        svg: makeBannerSVG('b7', ['#1a0500', '#3d1200'], `
            <ellipse cx="200" cy="200" rx="110" ry="130" fill="rgba(255,165,0,.08)"/>
            <path d="M200,280 C160,240 140,200 150,160 C155,140 170,120 180,110 C175,140 185,150 195,130 C200,120 195,100 200,70 C205,100 215,110 210,135 C220,145 230,140 225,110 C235,125 245,145 250,160 C260,200 240,240 200,280Z" fill="#FF4500" opacity=".65"/>
            <path d="M200,270 C170,248 158,215 165,178 C170,158 182,142 190,132 C187,155 195,162 200,148 C205,160 215,162 212,142 C220,154 230,168 235,182 C245,215 230,248 200,270Z" fill="#FF8C00" opacity=".65"/>
            <path d="M200,258 C182,242 175,222 180,198 C183,184 192,172 196,165 C195,178 200,184 204,174 C208,182 212,180 210,170 C215,178 222,192 224,200 C230,222 218,244 200,258Z" fill="#FFD700" opacity=".5"/>
            <circle cx="200" cy="222" r="6" fill="rgba(255,255,255,.35)"/>
            <path d="M192,228 Q196,223 200,228 Q204,223 208,228 L207,235 Q200,232 193,235Z" fill="rgba(255,255,255,.25)"/>`)
    },
    {
        id: 'b8', date: '2026-02-21', emoji: '🌲',
        title: 'Шёпот Леса',
        description: 'Лес слышит то, что сердце молчит',
        svg: makeBannerSVG('b8', ['#0a2010', '#2a4a30'], `
            <rect x="0" y="200" width="400" height="100" fill="rgba(255,255,255,.03)"/>
            <rect x="0" y="235" width="400" height="65" fill="rgba(255,255,255,.03)"/>
            <rect x="0" y="260" width="400" height="40" fill="rgba(255,255,255,.03)"/>
            <g opacity=".7"><rect x="55" y="100" width="8" height="200" fill="#1a3020" rx="2"/>
            <polygon points="59,40 30,118 88,118" fill="#1a4025" opacity=".8"/></g>
            <g opacity=".8"><rect x="125" y="80" width="10" height="220" fill="#1a3520" rx="2"/>
            <polygon points="130,25 95,108 165,108" fill="#1a4525" opacity=".8"/></g>
            <g opacity=".6"><rect x="210" y="110" width="8" height="190" fill="#1a3020" rx="2"/>
            <polygon points="214,55 185,128 243,128" fill="#1a4025" opacity=".8"/></g>
            <g opacity=".75"><rect x="290" y="90" width="9" height="210" fill="#1a3520" rx="2"/>
            <polygon points="294,35 262,112 326,112" fill="#1a4525" opacity=".8"/></g>
            <g opacity=".5"><rect x="355" y="120" width="7" height="180" fill="#1a3020" rx="2"/>
            <polygon points="358,70 335,135 381,135" fill="#1a4025" opacity=".8"/></g>
            <path d="M240,262 C244,258 250,262 246,266 L242,268 C238,268 236,264 240,262Z" fill="#4a3020" opacity=".35"/>`)
    },
    {
        id: 'b9', date: '2026-02-22', emoji: '✨',
        title: 'Космическое Дыхание',
        description: 'Вселенная дышит вместе с тобой',
        svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs><radialGradient id="b9bg" cx="45%" cy="50%">
                <stop offset="0%" stop-color="#2a1a4e"/><stop offset="100%" stop-color="#0a0018"/>
            </radialGradient></defs>
            <rect width="400" height="300" fill="url(#b9bg)"/>
            <ellipse cx="180" cy="120" rx="90" ry="45" fill="rgba(255,107,157,.1)"/>
            <ellipse cx="250" cy="180" rx="80" ry="40" fill="rgba(74,158,255,.08)"/>
            <ellipse cx="200" cy="150" rx="75" ry="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1" transform="rotate(-30,200,150)"/>
            <ellipse cx="200" cy="150" rx="55" ry="14" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1" transform="rotate(-25,200,150)"/>
            <ellipse cx="200" cy="150" rx="35" ry="9" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1" transform="rotate(-20,200,150)"/>
            <circle cx="200" cy="150" r="4" fill="#fff" opacity=".7"/>
            <circle cx="40" cy="30" r="1.5" fill="#fff" opacity=".6"/><circle cx="380" cy="20" r="2" fill="#fff" opacity=".5"/>
            <circle cx="100" cy="60" r="1" fill="#fff" opacity=".4"/><circle cx="300" cy="50" r="1.5" fill="#fff" opacity=".5"/>
            <circle cx="60" cy="120" r=".8" fill="#fff" opacity=".3"/><circle cx="340" cy="100" r="1.2" fill="#fff" opacity=".4"/>
            <circle cx="30" cy="200" r="1" fill="#fff" opacity=".3"/><circle cx="370" cy="220" r="1.5" fill="#fff" opacity=".35"/>
            <circle cx="80" cy="260" r=".8" fill="#fff" opacity=".25"/><circle cx="320" cy="270" r="1" fill="#fff" opacity=".25"/>
            <circle cx="150" cy="40" r="1.2" fill="#fff" opacity=".5"/><circle cx="260" cy="30" r=".8" fill="#fff" opacity=".35"/>
        </svg>`
    },
    {
        id: 'b10', date: '2026-02-23', emoji: '🐉',
        title: 'Дракон Мудрости',
        description: 'Мудрость — спираль, ведущая к центру',
        svg: makeBannerSVG('b10', ['#0a0a30', '#1a1a50'], `
            <path d="M200,150 C200,150 200,110 230,110 C260,110 260,140 240,150 C220,160 220,130 240,125 C250,122 252,135 245,138" fill="none" stroke="#FFD700" stroke-width="3" stroke-linecap="round" opacity=".75"/>
            <path d="M200,150 C200,150 200,190 170,190 C140,190 140,160 160,150 C180,140 180,170 160,175 C150,178 148,165 155,162" fill="none" stroke="#FFD700" stroke-width="3" stroke-linecap="round" opacity=".75"/>
            <circle cx="200" cy="150" r="8" fill="#FFD700" opacity=".25"/>
            <circle cx="200" cy="150" r="3" fill="#FFD700" opacity=".5"/>
            <path d="M245,105 C248,98 255,95 260,100" fill="none" stroke="#FFD700" stroke-width="1.5" opacity=".5"/>
            <path d="M230,105 C228,100 230,95 235,97" fill="none" stroke="#FFD700" stroke-width="1.5" opacity=".5"/>
            <circle cx="242" cy="108" r="1.5" fill="#FF4500" opacity=".6"/><circle cx="235" cy="108" r="1.5" fill="#FF4500" opacity=".6"/>
            <path d="M0,280 Q50,270 100,278 Q150,285 200,275 Q250,265 300,278 Q350,288 400,280 L400,300 L0,300Z" fill="#FFD700" opacity=".06"/>
            <circle cx="100" cy="50" r="1" fill="#FFD700" opacity=".25"/><circle cx="300" cy="40" r="1.2" fill="#FFD700" opacity=".25"/>`)
    },
    {
        id: 'b11', date: '2026-02-24', emoji: '💎',
        title: 'Кристальная Ясность',
        description: 'Ум чист как горный кристалл',
        svg: makeBannerSVG('b11', ['#1a0a30', '#0a1a3a'], `
            <polygon points="200,40 280,130 250,260 150,260 120,130" fill="rgba(176,224,230,.2)" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
            <polygon points="200,40 280,130 200,150" fill="rgba(255,255,255,.12)"/>
            <polygon points="200,40 120,130 200,150" fill="rgba(255,255,255,.06)"/>
            <polygon points="200,150 280,130 250,260" fill="rgba(255,255,255,.08)"/>
            <polygon points="200,150 120,130 150,260" fill="rgba(255,255,255,.04)"/>
            <polygon points="200,150 250,260 150,260" fill="rgba(255,255,255,.1)"/>
            <line x1="200" y1="40" x2="100" y2="0" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
            <line x1="200" y1="40" x2="300" y2="0" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
            <line x1="200" y1="40" x2="200" y2="0" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
            <circle cx="200" cy="150" r="3" fill="#fff" opacity=".5"/>`)
    },
    {
        id: 'b12', date: '2026-02-25', emoji: '🦋',
        title: 'Превращение',
        description: 'Из гусеницы — в крылатое существо',
        svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="b12bg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#3d2b1f"/><stop offset="45%" stop-color="#4a3528"/>
                <stop offset="55%" stop-color="#4a2860"/><stop offset="100%" stop-color="#6b2fa0"/>
            </linearGradient></defs>
            <rect width="400" height="300" fill="url(#b12bg)"/>
            <line x1="200" y1="30" x2="200" y2="270" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="4,6"/>
            <ellipse cx="120" cy="160" rx="32" ry="48" fill="#5a4535" opacity=".3"/>
            <line x1="130" y1="180" x2="120" y2="250" stroke="#4a3020" stroke-width="2" opacity=".4"/>
            <path d="M270,110 C300,80 330,60 340,90 C350,70 365,80 345,110 C360,95 370,105 348,125L280,145Z" fill="#9b59b6" opacity=".45"/>
            <path d="M270,190 C300,220 330,240 340,210 C350,230 365,220 345,190 C360,205 370,195 348,175L280,155Z" fill="#8e44ad" opacity=".45"/>
            <rect x="278" y="108" width="4" height="85" rx="2" fill="#5a2d82" opacity=".6"/>
            <circle cx="280" cy="103" r="3" fill="#5a2d82" opacity=".45"/>
            <circle cx="310" cy="50" r="1.5" fill="#D8BFD8" opacity=".35"/><circle cx="340" cy="80" r="1" fill="#D8BFD8" opacity=".25"/>
            <circle cx="60" cy="250" r="1" fill="#D2B48C" opacity=".2"/>
        </svg>`
    },
    {
        id: 'b13', date: '2026-02-26', emoji: '🌈',
        title: 'Поток Энергии',
        description: 'Семь центров — одна гармония',
        svg: makeBannerSVG('b13', ['#1a0a2e', '#0a0a1a'], `
            <path d="M200,30 L200,270" stroke="rgba(255,255,255,.06)" stroke-width="18"/>
            <circle cx="200" cy="260" r="11" fill="none" stroke="#FF0000" stroke-width="2" opacity=".65"/><circle cx="200" cy="260" r="4.5" fill="#FF0000" opacity=".3"/>
            <circle cx="200" cy="225" r="11" fill="none" stroke="#FF7F00" stroke-width="2" opacity=".65"/><circle cx="200" cy="225" r="4.5" fill="#FF7F00" opacity=".3"/>
            <circle cx="200" cy="190" r="11" fill="none" stroke="#FFD700" stroke-width="2" opacity=".65"/><circle cx="200" cy="190" r="4.5" fill="#FFD700" opacity=".3"/>
            <circle cx="200" cy="155" r="11" fill="none" stroke="#00CC00" stroke-width="2" opacity=".65"/><circle cx="200" cy="155" r="4.5" fill="#00CC00" opacity=".3"/>
            <circle cx="200" cy="120" r="11" fill="none" stroke="#0099FF" stroke-width="2" opacity=".65"/><circle cx="200" cy="120" r="4.5" fill="#0099FF" opacity=".3"/>
            <circle cx="200" cy="85" r="11" fill="none" stroke="#4B0082" stroke-width="2" opacity=".65"/><circle cx="200" cy="85" r="4.5" fill="#4B0082" opacity=".3"/>
            <circle cx="200" cy="50" r="11" fill="none" stroke="#8B00FF" stroke-width="2" opacity=".65"/><circle cx="200" cy="50" r="4.5" fill="#8B00FF" opacity=".3"/>
            <circle cx="200" cy="50" r="17" fill="none" stroke="#8B00FF" stroke-width=".5" opacity=".25"/>
            <circle cx="200" cy="260" r="17" fill="none" stroke="#FF0000" stroke-width=".5" opacity=".25"/>`)
    },
    {
        id: 'b14', date: '2026-02-27', emoji: '🏯',
        title: 'Храм Внутри',
        description: 'Истинный храм — сердце практикующего',
        svg: makeBannerSVG('b14', ['#1a1000', '#6B4914'], `
            <circle cx="200" cy="160" r="110" fill="rgba(255,215,0,.08)"/>
            <line x1="200" y1="50" x2="50" y2="0" stroke="#FFD700" stroke-width=".5" opacity=".12"/>
            <line x1="200" y1="50" x2="350" y2="0" stroke="#FFD700" stroke-width=".5" opacity=".12"/>
            <line x1="200" y1="50" x2="0" y2="50" stroke="#FFD700" stroke-width=".5" opacity=".08"/>
            <line x1="200" y1="50" x2="400" y2="50" stroke="#FFD700" stroke-width=".5" opacity=".08"/>
            <line x1="200" y1="50" x2="200" y2="0" stroke="#FFD700" stroke-width=".5" opacity=".15"/>
            <g fill="#2a1a00" stroke="#FFD700" stroke-width="1" opacity=".75">
                <polygon points="200,50 178,78 222,78"/><rect x="180" y="78" width="40" height="14"/>
                <polygon points="200,72 168,102 232,102"/><rect x="172" y="102" width="56" height="16"/>
                <polygon points="200,95 158,130 242,130"/><rect x="162" y="130" width="76" height="18"/>
                <polygon points="200,122 148,158 252,158"/><rect x="152" y="158" width="96" height="20"/>
                <polygon points="200,148 138,185 262,185"/><rect x="142" y="185" width="116" height="23"/>
            </g>
            <rect x="192" y="190" width="16" height="18" fill="#FFD700" opacity=".15"/>
            <ellipse cx="200" cy="252" rx="18" ry="8" fill="none" stroke="#FFD700" stroke-width="1" opacity=".25"/>
            <ellipse cx="200" cy="246" rx="10" ry="5" fill="#FFD700" opacity=".12"/>
            <circle cx="200" cy="242" r="2" fill="#FFD700" opacity=".3"/>`)
    }
];

window.DAILY_BANNERS = DAILY_BANNERS;
