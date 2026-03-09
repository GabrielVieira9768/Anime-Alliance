// Variável global para controlar a batalha
let combatantesDaBatalha = [];

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
    
    // Ordenar por velocidade para determinar ordem dos turnos
    combatantesDaBatalha.sort((a, b) => b.speed - a.speed);
    
    atualizarBarraIniciativa();
    changeScreen('tela-batalha');
    
    // Iniciar o primeiro turno após um pequeno delay
    setTimeout(() => {
        iniciarTurno();
    }, 500);
}

function renderPlayerUnits() {
    const playerContainer = document.getElementById('player-units');
    playerContainer.className = "flex flex-col justify-around items-center h-full w-1/3 z-10";
    playerContainer.innerHTML = ''; 
    
    equippedHeroes.forEach(heroId => {
        const hero = characters[heroId];
        
        // Criar cópia do herói com status atuais
        const combatente = { 
            id: heroId, 
            name: hero.name, 
            icon: hero.icon, 
            unit: hero.unit,
            speed: hero.speed, 
            attack: hero.attack, 
            type: 'player', 
            hp: hero.hpMax, 
            hpMax: hero.hpMax,
            energy: hero.energyMax,
            energyMax: hero.energyMax,
            skills: hero.skills || []
        };
        
        combatantesDaBatalha.push(combatente);

        playerContainer.innerHTML += `
            <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                <img src="${hero.unit}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] z-0">
                <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-500 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                    <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${hero.name}</span>
                    <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10 mb-1">
                        <div id="hp-player-${heroId}" class="bg-gradient-to-r from-green-600 to-green-400 w-full h-full transition-all duration-500" style="width: 100%"></div>
                        <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
                            ${hero.hpMax} / ${hero.hpMax}
                        </span>
                    </div>
                    <div class="relative w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-[0_0_5px_rgba(59,130,246,0.2)]">
                        <div id="energy-player-${heroId}" class="bg-blue-500 w-full h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]" style="width: 100%"></div>
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
        const enemyId = `enemy-${index}`;
        const combatente = { 
            id: enemyId, 
            name: enemy.name, 
            icon: enemy.image, 
            speed: enemy.speed, 
            attack: enemy.attack || 10,
            hp: enemy.hp, 
            hpMax: enemy.hp, 
            type: 'enemy',
            skills: enemy.skills || []
        };
        
        combatantesDaBatalha.push(combatente);

        enemyContainer.innerHTML += `
            <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                <img src="${enemy.image}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-x-[-1] z-0">
                <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-700 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                    <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${enemy.name}</span>
                    <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10">
                        <div id="hp-enemy-${index}" class="bg-red-600 w-full h-full transition-all duration-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" style="width: 100%"></div>
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
        
        turnOrderContainer.innerHTML += `
            <div class="flex flex-col items-center transition-all duration-500 ${estiloTurno}">
                <div class="relative w-10 h-10 rounded-full border-2 ${borderColor} bg-gray-900 overflow-hidden shadow-lg">
                    <img src="${unidade.icon}" class="w-full h-full object-cover transition-transform">
                </div>
            </div>
        `;
    });
}

function iniciarTurno() {
    if (combatantesDaBatalha.length === 0) return;
    
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

    actionBar.innerHTML = '';
    actionBar.classList.remove('hidden');

    // Botão de ataque básico
    actionBar.innerHTML += `
        <button onclick="executeAction('attack')" class="w-16 h-16 bg-gray-700 border-2 border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-all hover:scale-110">
            <i class="fa-solid fa-hand-fist text-white text-2xl"></i>
        </button>
    `;

    // Botões de skills - AGORA CORRETO: usando as skills do próprio unidadeAtiva
    if (unidadeAtiva.skills && unidadeAtiva.skills.length > 0) {
        unidadeAtiva.skills.forEach((skill, index) => {
            // Verificar se tem energia suficiente para usar a skill
            const hasEnergy = unidadeAtiva.energy >= skill.energyCost;
            const opacityClass = hasEnergy ? 'opacity-100' : 'opacity-50';
            
            actionBar.innerHTML += `
                <button onclick="if(${hasEnergy}) executeAction('skill', ${index}); else alert('Energia insuficiente!')" 
                    class="w-16 h-16 bg-blue-900 border-2 border-blue-400 rounded-lg overflow-hidden hover:scale-110 transition-all relative group ${opacityClass}">
                    <img src="${skill.icon}" class="w-full h-full object-cover">
                    <div class="absolute bottom-0 bg-black/80 w-full text-[8px] text-center text-blue-200">${skill.energyCost} EN</div>
                </button>
            `;
        });
    }

    // Botão de meditar
    actionBar.innerHTML += `
        <button onclick="executeAction('meditate')" class="w-16 h-16 bg-green-900 border-2 border-green-400 rounded-lg flex items-center justify-center hover:bg-green-800 transition-all hover:scale-110">
            <i class="fa-solid fa-bolt text-yellow-400 text-2xl"></i>
        </button>
    `;
}

function executeAction(actionType, skillIndex = null) {
    const atacante = combatantesDaBatalha[0];
    const alvo = combatantesDaBatalha.find(u => u.type === 'enemy');
    
    if (!alvo) {
        checkBattleEnd();
        return;
    }
    
    if (actionType === 'attack') {
        // Ataque básico
        alvo.hp -= atacante.attack;
        updateHpBar(alvo);
        
        // Mensagem de feedback
        mostrarMensagem(`${atacante.name} atacou ${alvo.name} causando ${atacante.attack} de dano!`);
        
    } else if (actionType === 'skill' && skillIndex !== null) {
        const skill = atacante.skills[skillIndex];
        
        if (atacante.energy >= skill.energyCost) {
            // Usar a skill
            atacante.energy -= skill.energyCost;
            updateEnergyBar(atacante);
            
            // Calcular dano da skill (usando o dano da skill ou dano aumentado)
            const dano = skill.damage || atacante.attack * 1.5;
            alvo.hp -= dano;
            updateHpBar(alvo);
            
            // Mensagem de feedback
            mostrarMensagem(`${atacante.name} usou ${skill.name} causando ${dano} de dano!`);
        } else {
            alert("Energia insuficiente!");
            return; // Não finaliza o turno se não tiver energia
        }
        
    } else if (actionType === 'meditate') {
        // Recuperar energia
        const energiaRecuperada = 20;
        atacante.energy = Math.min(atacante.energy + energiaRecuperada, atacante.energyMax);
        updateEnergyBar(atacante);
        
        // Mensagem de feedback
        mostrarMensagem(`${atacante.name} meditou e recuperou ${energiaRecuperada} de energia!`);
    }
    
    // Verificar se o alvo morreu
    if (alvo.hp <= 0) {
        removerUnidade(alvo);
        mostrarMensagem(`${alvo.name} foi derrotado!`);
    }
    
    // Finalizar o turno
    finalizarTurno();
}

function executarTurnoIA() {
    const atacante = combatantesDaBatalha[0];
    const alvo = combatantesDaBatalha.find(u => u.type === 'player');
    
    if (!alvo) {
        checkBattleEnd();
        return;
    }
    
    // IA simples: sempre ataca
    alvo.hp -= atacante.attack;
    updateHpBar(alvo);
    
    mostrarMensagem(`${atacante.name} atacou ${alvo.name} causando ${atacante.attack} de dano!`);
    
    if (alvo.hp <= 0) {
        removerUnidade(alvo);
        mostrarMensagem(`${alvo.name} foi derrotado!`);
    }
    
    finalizarTurno();
}

function updateHpBar(unidade) {
    const hpPercent = (unidade.hp / unidade.hpMax) * 100;
    const hpBarId = unidade.type === 'player' 
        ? `hp-player-${unidade.id}` 
        : `hp-enemy-${unidade.id.split('-')[1]}`;
    
    const hpBar = document.getElementById(hpBarId);
    if (hpBar) {
        hpBar.style.width = `${Math.max(0, hpPercent)}%`;
        
        // Atualizar o texto da barra de HP
        const parentDiv = hpBar.parentElement;
        const spanText = parentDiv.querySelector('span');
        if (spanText) {
            spanText.textContent = `${Math.max(0, unidade.hp)} / ${unidade.hpMax}`;
        }
    }
}

function updateEnergyBar(unidade) {
    if (unidade.type !== 'player') return;
    
    const energyPercent = (unidade.energy / unidade.energyMax) * 100;
    const energyBar = document.getElementById(`energy-player-${unidade.id}`);
    const energyText = document.getElementById(`energy-text-player-${unidade.id}`);
    
    if (energyBar) {
        energyBar.style.width = `${Math.max(0, energyPercent)}%`;
    }
    if (energyText) {
        energyText.textContent = `${Math.max(0, unidade.energy)} / ${unidade.energyMax}`;
    }
}

function mostrarMensagem(msg) {
    // Você pode implementar um sistema de log de batalha depois
    console.log(msg);
}

function removerUnidade(unidade) {
    // Remover da lista de combatentes
    combatantesDaBatalha = combatantesDaBatalha.filter(u => u.id !== unidade.id);
    
    // Recarregar as unidades na tela
    if (unidade.type === 'player') {
        // Recarregar apenas os players que ainda estão vivos
        const playerContainer = document.getElementById('player-units');
        playerContainer.innerHTML = '';
        
        combatantesDaBatalha
            .filter(u => u.type === 'player')
            .forEach(player => {
                const hero = characters[player.id];
                playerContainer.innerHTML += `
                    <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                        <img src="${hero.unit}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] z-0">
                        <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-500 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                            <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${hero.name}</span>
                            <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10 mb-1">
                                <div id="hp-player-${player.id}" class="bg-gradient-to-r from-green-600 to-green-400 w-full h-full transition-all duration-500" style="width: ${(player.hp/player.hpMax)*100}%"></div>
                                <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
                                    ${player.hp} / ${player.hpMax}
                                </span>
                            </div>
                            <div class="relative w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-[0_0_5px_rgba(59,130,246,0.2)]">
                                <div id="energy-player-${player.id}" class="bg-blue-500 w-full h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]" style="width: ${(player.energy/player.energyMax)*100}%"></div>
                                <span id="energy-text-player-${player.id}" class="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-blue-100 uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
                                    ${player.energy} / ${player.energyMax}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
    } else {
        // Recarregar inimigos restantes
        const enemyContainer = document.getElementById('enemy-units');
        enemyContainer.innerHTML = '';
        
        combatantesDaBatalha
            .filter(u => u.type === 'enemy')
            .forEach((enemy, index) => {
                enemyContainer.innerHTML += `
                    <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative">
                        <img src="${enemy.icon}" class="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-x-[-1] z-0">
                        <div class="-mt-8 z-10 bg-black/90 px-3 py-2 rounded-xl border border-gray-700 flex flex-col items-center min-w-[140px] shadow-xl backdrop-blur-sm">
                            <span class="text-[10px] font-black text-white mb-1 uppercase tracking-widest">${enemy.name}</span>
                            <div class="relative w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/10">
                                <div id="hp-enemy-${index}" class="bg-red-600 w-full h-full transition-all duration-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" style="width: ${(enemy.hp/enemy.hpMax)*100}%"></div>
                                <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
                                    ${enemy.hp} / ${enemy.hpMax}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
    }
}

function finalizarTurno() {
    if (combatantesDaBatalha.length > 1) {
        // Rotacionar a lista (quem atacou vai para o final)
        const quemAtacou = combatantesDaBatalha.shift();
        combatantesDaBatalha.push(quemAtacou);
        
        // Iniciar próximo turno
        setTimeout(() => {
            iniciarTurno();
        }, 500);
    } else {
        checkBattleEnd();
    }
}

function checkBattleEnd() {
    const playersVivos = combatantesDaBatalha.filter(u => u.type === 'player').length;
    const enemiesVivos = combatantesDaBatalha.filter(u => u.type === 'enemy').length;
    
    if (enemiesVivos === 0) {
        alert('Vitória! Missão completada com sucesso!');
        changeScreen('tela-missoes');
    } else if (playersVivos === 0) {
        alert('Derrota! Seus heróis foram derrotados...');
        changeScreen('tela-missoes');
    }
}

// Exportar funções necessárias
window.startMission = startMission;
window.executeAction = executeAction;