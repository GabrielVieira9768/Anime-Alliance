// battle.js

let combatantesDaBatalha = [];
let aguardandoSelecaoAlvo = null; // { actionType: 'skill', skillIndex: 0, skill: {...} }

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
    
    iniciarTurno();
}

function renderPlayerUnits() {
    const playerContainer = document.getElementById('player-units');
    playerContainer.className = "flex flex-col justify-around items-center h-full w-1/3 z-10";
    playerContainer.innerHTML = ''; 
    
    equippedHeroes.forEach(heroId => {
        const hero = characters[heroId];
        
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
            <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative enemy-unit" data-enemy-index="${index}">
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

    // Botão de ataque normal
    actionBar.innerHTML += `
        <button onclick="iniciarSelecaoAlvo('attack')" class="w-16 h-16 bg-gray-700 border-2 border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-all hover:scale-110">
            <i class="fa-solid fa-hand-fist text-white text-2xl"></i>
        </button>
    `;

    // Botões de habilidades
    if (unidadeAtiva.skills && unidadeAtiva.skills.length > 0) {
        unidadeAtiva.skills.forEach((skill, index) => {
            const hasEnergy = unidadeAtiva.energy >= skill.energyCost;
            const opacityClass = hasEnergy ? 'opacity-100' : 'opacity-50';
            
            actionBar.innerHTML += `
                <button onclick="if(${hasEnergy}) { if('${skill.target}' === 'all') { executarHabilidadeTodos(${index}); } else { iniciarSelecaoAlvo('skill', ${index}); } } else { alert('Energia insuficiente!'); }" 
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

function iniciarSelecaoAlvo(actionType, skillIndex = null) {
    // Verifica se há inimigos vivos
    const inimigosVivos = combatantesDaBatalha.filter(u => u.type === 'enemy');
    if (inimigosVivos.length === 0) {
        checkBattleEnd();
        return;
    }

    const atacante = combatantesDaBatalha[0];
    
    if (actionType === 'skill') {
        const skill = atacante.skills[skillIndex];
        if (atacante.energy < skill.energyCost) {
            alert('Energia insuficiente!');
            return;
        }
        aguardandoSelecaoAlvo = { actionType, skillIndex, skill };
    } else if (actionType === 'attack') {
        aguardandoSelecaoAlvo = { actionType, skillIndex: null, skill: null };
    }
    
    // Habilita seleção de alvo nos inimigos
    habilitarSelecaoInimigos();
    
    // Mostra mensagem
    mostrarMensagem('Clique em um inimigo para atacar...');
}

function habilitarSelecaoInimigos() {
    const inimigos = document.querySelectorAll('#enemy-units > div');
    
    inimigos.forEach((inimigo) => {
        inimigo.classList.add('alvo-selecionavel');
        inimigo.style.cursor = 'pointer';
    });
}

function desabilitarSelecaoInimigos() {
    const inimigos = document.querySelectorAll('#enemy-units > div');
    
    inimigos.forEach((inimigo) => {
        inimigo.classList.remove('alvo-selecionavel');
        inimigo.style.cursor = 'default';
    });
}

function processarAcaoComAlvo(alvo) {
    if (!aguardandoSelecaoAlvo) return;
    
    const atacante = combatantesDaBatalha[0];
    const { actionType, skillIndex, skill } = aguardandoSelecaoAlvo;
    
    // Desabilita seleção de alvo
    desabilitarSelecaoInimigos();
    
    if (actionType === 'attack') {
        // Ataque normal
        alvo.hp -= atacante.attack;
        updateHpBar(alvo);
        
        mostrarMensagem(`${atacante.name} atacou ${alvo.name} causando ${atacante.attack} de dano!`);
        
    } else if (actionType === 'skill' && skill) {
        // Habilidade single target
        if (atacante.energy >= skill.energyCost) {
            atacante.energy -= skill.energyCost;
            updateEnergyBar(atacante);
            
            alvo.hp -= skill.damage;
            updateHpBar(alvo);
            
            mostrarMensagem(`${atacante.name} usou ${skill.name} em ${alvo.name} causando ${skill.damage} de dano!`);
        }
    }
    
    // Verifica se o alvo morreu
    if (alvo.hp <= 0) {
        removerUnidade(alvo);
        mostrarMensagem(`${alvo.name} foi derrotado!`);
    }
    
    // Limpa o estado de seleção
    aguardandoSelecaoAlvo = null;
    
    // Finaliza o turno
    finalizarTurno();
}

function executarHabilidadeTodos(skillIndex) {
    const atacante = combatantesDaBatalha[0];
    const skill = atacante.skills[skillIndex];
    
    // Verifica energia
    if (atacante.energy < skill.energyCost) {
        alert('Energia insuficiente!');
        return;
    }
    
    // Pega todos os inimigos vivos
    const inimigos = combatantesDaBatalha.filter(u => u.type === 'enemy');
    
    if (inimigos.length === 0) {
        checkBattleEnd();
        return;
    }
    
    // Aplica dano em todos
    atacante.energy -= skill.energyCost;
    updateEnergyBar(atacante);
    
    inimigos.forEach(inimigo => {
        inimigo.hp -= skill.damage;
        updateHpBar(inimigo);
    });
    
    mostrarMensagem(`${atacante.name} usou ${skill.name} em todos os inimigos causando ${skill.damage} de dano!`);
    
    // Verifica mortes
    inimigos.forEach(inimigo => {
        if (inimigo.hp <= 0) {
            removerUnidade(inimigo);
            mostrarMensagem(`${inimigo.name} foi derrotado!`);
        }
    });
    
    // Finaliza o turno
    finalizarTurno();
}

function executarTurnoIA() {
    const atacante = combatantesDaBatalha[0];
    
    // Pega todos os jogadores vivos
    const jogadoresVivos = combatantesDaBatalha.filter(u => u.type === 'player');
    
    if (jogadoresVivos.length === 0) {
        checkBattleEnd();
        return;
    }
    
    // Seleciona um alvo aleatório
    const alvoAleatorio = jogadoresVivos[Math.floor(Math.random() * jogadoresVivos.length)];
    
    // Decide se usa skill ou ataque normal (30% de chance de usar skill se tiver)
    const usaSkill = atacante.skills && 
                     atacante.skills.length > 0 && 
                     Math.random() < 0.3 && 
                     atacante.energy >= (atacante.skills[0]?.energyCost || 999);
    
    if (usaSkill) {
        const skill = atacante.skills[0]; // Usa a primeira skill disponível
        atacante.energy -= skill.energyCost;
        
        if (skill.target === 'all') {
            // Ataque em todos os jogadores
            jogadoresVivos.forEach(jogador => {
                jogador.hp -= skill.damage;
                updateHpBar(jogador);
                
                if (jogador.hp <= 0) {
                    removerUnidade(jogador);
                    mostrarMensagem(`${jogador.name} foi derrotado!`);
                }
            });
            mostrarMensagem(`${atacante.name} usou ${skill.name} em todos os jogadores causando ${skill.damage} de dano!`);
        } else {
            // Ataque em um jogador aleatório
            alvoAleatorio.hp -= skill.damage;
            updateHpBar(alvoAleatorio);
            
            if (alvoAleatorio.hp <= 0) {
                removerUnidade(alvoAleatorio);
                mostrarMensagem(`${alvoAleatorio.name} foi derrotado!`);
            }
            
            mostrarMensagem(`${atacante.name} usou ${skill.name} em ${alvoAleatorio.name} causando ${skill.damage} de dano!`);
        }
    } else {
        // Ataque normal
        alvoAleatorio.hp -= atacante.attack;
        updateHpBar(alvoAleatorio);
        
        mostrarMensagem(`${atacante.name} atacou ${alvoAleatorio.name} causando ${atacante.attack} de dano!`);
        
        if (alvoAleatorio.hp <= 0) {
            removerUnidade(alvoAleatorio);
            mostrarMensagem(`${alvoAleatorio.name} foi derrotado!`);
        }
    }
    
    finalizarTurno();
}

function executeAction(actionType, skillIndex = null) {
    // Esta função agora só será usada para ações que não precisam de seleção de alvo
    if (actionType === 'meditate') {
        const atacante = combatantesDaBatalha[0];
        const energiaRecuperada = 20;
        atacante.energy = Math.min(atacante.energy + energiaRecuperada, atacante.energyMax);
        updateEnergyBar(atacante);
        
        mostrarMensagem(`${atacante.name} meditou e recuperou ${energiaRecuperada} de energia!`);
        finalizarTurno();
    }
}

function updateHpBar(unidade) {
    const hpPercent = (unidade.hp / unidade.hpMax) * 100;
    const hpBarId = unidade.type === 'player' 
        ? `hp-player-${unidade.id}` 
        : `hp-enemy-${unidade.id.split('-')[1]}`;
    
    const hpBar = document.getElementById(hpBarId);
    if (hpBar) {
        hpBar.style.width = `${Math.max(0, hpPercent)}%`;
        
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
    console.log(msg);
    // Você pode implementar um sistema de mensagens na UI se desejar
}

function removerUnidade(unidade) {
    combatantesDaBatalha = combatantesDaBatalha.filter(u => u.id !== unidade.id);
    
    if (unidade.type === 'player') {
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
        const enemyContainer = document.getElementById('enemy-units');
        enemyContainer.innerHTML = '';
        
        combatantesDaBatalha
            .filter(u => u.type === 'enemy')
            .forEach((enemy, index) => {
                enemyContainer.innerHTML += `
                    <div class="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer relative enemy-unit" data-enemy-index="${index}">
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
        const quemAtacou = combatantesDaBatalha.shift();
        combatantesDaBatalha.push(quemAtacou);
        
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

// Adiciona event listeners para os inimigos serem clicáveis
document.addEventListener('click', function(e) {
    const enemyUnit = e.target.closest('.enemy-unit');
    if (enemyUnit && aguardandoSelecaoAlvo) {
        const enemyIndex = enemyUnit.dataset.enemyIndex;
        const alvo = combatantesDaBatalha.find(u => u.id === `enemy-${enemyIndex}`);
        if (alvo) {
            processarAcaoComAlvo(alvo);
        }
    }
});

// Exportar funções necessárias
window.startMission = startMission;
window.executeAction = executeAction;
window.iniciarSelecaoAlvo = iniciarSelecaoAlvo;
window.executarHabilidadeTodos = executarHabilidadeTodos;