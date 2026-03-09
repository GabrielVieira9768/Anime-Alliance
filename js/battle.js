function startMission(mapId, missionId) {
    if (equippedHeroes.length === 0) {
        alert("Aviso: Você precisa equipar pelo menos um herói!");
        return;
    }

    const map = gameMaps[mapId];
    const mission = map.missions.find(m => m.id === missionId);

    document.getElementById('battle-background').src = map.battleBg;
    document.getElementById('battle-title').innerText = `${map.name} - Missão ${missionId}`;

    combatantesDaBatalha = [];
    renderPlayerUnits();
    renderEnemyUnits(mission.enemies);
    
    combatantesDaBatalha.sort((a, b) => b.speed - a.speed);
    
    atualizarBarraIniciativa();
    changeScreen('tela-batalha');
}

function renderPlayerUnits() {
    const playerContainer = document.getElementById('player-units');
    playerContainer.className = "flex flex-col justify-around items-center h-full w-1/3 z-10";
    playerContainer.innerHTML = ''; 
    
    equippedHeroes.forEach(heroId => {
        const hero = characters[heroId];
        combatantesDaBatalha.push({ 
            id: heroId, 
            name: hero.name, 
            icon: hero.icon, 
            speed: hero.speed, 
            attack: hero.attack, 
            type: 'player', 
            hp: hero.hpMax, 
            hpMax: hero.hpMax,
            energy: hero.energyMax,
            energyMax: hero.energyMax,
            skills: hero.skills
        });

        playerContainer.innerHTML += `
            <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                <img src="${hero.unit}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] z-0">
                <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-500 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                    <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${hero.name}</span>
                    <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10 mb-1">
                        <div id="hp-player-${heroId}" class="bg-gradient-to-r from-green-600 to-green-400 w-full h-full transition-all duration-500"></div>
                        <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
                            ${hero.hpMax} / ${hero.hpMax}
                        </span>
                    </div>
                    <div class="relative w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-[0_0_5px_rgba(59,130,246,0.2)]">
                        <div id="energy-player-${heroId}" class="bg-blue-500 w-full h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]"></div>
                        <span id="energy-text-player-${heroId}" class="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-blue-100 uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
                            ${hero.energyMax} / ${hero.energyMax}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderEnemyUnits(enemies) {
    const enemyContainer = document.getElementById('enemy-units');
    enemyContainer.className = "flex flex-col justify-around items-center h-full w-1/3 z-10";
    enemyContainer.innerHTML = ''; 
    
    enemies.forEach((enemy, index) => {
        combatantesDaBatalha.push({ 
            id: `enemy-${index}`, 
            name: enemy.name, 
            icon: enemy.image, 
            speed: enemy.speed, 
            hp: enemy.hp, 
            hpMax: enemy.hp, 
            type: 'enemy' 
        });

        enemyContainer.innerHTML += `
            <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                <img src="${enemy.image}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-x-[-1] z-0">
                <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-700 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                    <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${enemy.name}</span>
                    <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10">
                        <div id="hp-enemy-${index}" class="bg-red-600 w-full h-full transition-all duration-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
                        <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
                            ${enemy.hp} / ${enemy.hp}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
}

function atualizarBarraIniciativa() {
    const turnOrderContainer = document.getElementById('turn-order');
    if (!turnOrderContainer) return;

    turnOrderContainer.innerHTML = '';
    
    combatantesDaBatalha.forEach((unidade, index) => {
        const estiloTurno = index === 0 ? 'scale-125 opacity-100 z-10' : 'scale-100 opacity-50';
        const borderColor = unidade.type === 'player' ? 'border-blue-400' : 'border-red-500';
        
        const zoomClass = unidade.type === 'enemy' 
            ? 'scale-[1.5] object-top origin-top mt-2' 
            : 'object-cover';

        turnOrderContainer.innerHTML += `
            <div class="flex flex-col items-center transition-all duration-500 ${estiloTurno}">
                <div class="relative w-10 h-10 rounded-full border-2 ${borderColor} bg-gray-900 overflow-hidden shadow-lg">
                    <img src="${unidade.icon}" class="w-full h-full ${zoomClass} transition-transform">
                </div>
            </div>
        `;
    });
}

function iniciarTurno() {
    const unidadeAtiva = combatantesDaBatalha[0];
    atualizarBarraIniciativa();
    
    if (unidadeAtiva.type === 'player') {
        renderActionButtons(unidadeAtiva);
    } else {
        document.getElementById('action-bar').classList.add('hidden');
        setTimeout(executarTurnoIA, 1000);
    }
}

function renderActionButtons(unidadeAtiva) {
    const actionBar = document.getElementById('action-bar');
    if (!actionBar || unidadeAtiva.type !== 'player') {
        actionBar.classList.add('hidden');
        return;
    }

    const heroData = characters[unidadeAtiva.id];
    actionBar.innerHTML = '';
    actionBar.classList.remove('hidden');

    actionBar.innerHTML += `
        <button onclick="executeAction('attack')" class="w-16 h-16 bg-gray-700 border-2 border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-all">
            <i class="fa-solid fa-hand-fist text-white text-2xl"></i>
        </button>
    `;

    heroData.skills.forEach((skill, index) => {
        actionBar.innerHTML += `
            <button onclick="executeAction('skill', ${index})" class="w-16 h-16 bg-blue-900 border-2 border-blue-400 rounded-lg overflow-hidden hover:scale-110 transition-all relative group">
                <img src="${skill.icon}" class="w-full h-full object-cover">
                <div class="absolute bottom-0 bg-black/80 w-full text-[8px] text-center text-blue-200">${skill.energyCost} EN</div>
            </button>
        `;
    });

    actionBar.innerHTML += `
        <button onclick="executeAction('meditate')" class="w-16 h-16 bg-green-900 border-2 border-green-400 rounded-lg flex items-center justify-center hover:bg-green-800 transition-all">
            <i class="fa-solid fa-bolt text-yellow-400 text-2xl"></i>
        </button>
    `;
}

function executeAction(actionType, skillIndex = null) {
    const atacante = combatantesDaBatalha[0];
    const alvo = combatantesDaBatalha.find(u => u.type === 'enemy');
    
    if (actionType === 'attack') {
        alvo.hp -= atacante.attack;
        updateHpBar(alvo);
        
        if (alvo.hp <= 0) {
            removerUnidade(alvo);
        }
    }
    
    finalizarTurno();
}

function removerUnidade(unidade) {
    combatantesDaBatalha = combatantesDaBatalha.filter(u => u.id !== unidade.id);
    document.getElementById(`${unidade.type}-units`).innerHTML = '';
    
    if (unidade.type === 'player') {
        renderPlayerUnits();
    } else {
        // Recarrega inimigos restantes
    }
}

function finalizarTurno() {
    if (combatantesDaBatalha.length > 1) {
        const quemAtacou = combatantesDaBatalha.shift();
        combatantesDaBatalha.push(quemAtacou);
        iniciarTurno();
    } else {
        checkBattleEnd();
    }
}

function checkBattleEnd() {
    const playersVivos = combatantesDaBatalha.filter(u => u.type === 'player').length;
    const enemiesVivos = combatantesDaBatalha.filter(u => u.type === 'enemy').length;
    
    if (enemiesVivos === 0) {
        alert('Vitória!');
        changeScreen('tela-mapa');
    } else if (playersVivos === 0) {
        alert('Derrota!');
        changeScreen('tela-mapa');
    }
}