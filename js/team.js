function showMessage(message, type = 'success') {
    let messageContainer = document.getElementById('message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.className = 'fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(messageContainer);
    }
    
    const messageElement = document.createElement('div');
    
    let bgColor = 'bg-green-500';
    let icon = 'fa-check-circle';
    
    if (type === 'error') {
        bgColor = 'bg-red-500';
        icon = 'fa-exclamation-circle';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-500';
        icon = 'fa-exclamation-triangle';
    } else if (type === 'info') {
        bgColor = 'bg-blue-500';
        icon = 'fa-info-circle';
    }
    
    messageElement.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-500 translate-x-full opacity-0 pointer-events-auto max-w-xs`;
    messageElement.innerHTML = `
        <i class="fa-solid ${icon} text-xl"></i>
        <span class="flex-1 font-medium">${message}</span>
        <button onclick="this.parentElement.remove()" class="hover:text-white/80 transition-colors">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    setTimeout(() => {
        messageElement.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
}

function loadTeam() {
    const teamContainer = document.getElementById('lista-equipe');
    if (!teamContainer) return;
    teamContainer.innerHTML = '';

    myInventory.forEach(id => {
        const hero = characters[id];
        const isEquipped = equippedHeroes.includes(id);

        const equippedIcon = isEquipped ? 
            '<div class="absolute top-2 right-2 bg-blue-500 text-white w-8 h-8 rounded-full z-20 shadow-lg flex items-center justify-center"><i class="fa-solid fa-users text-sm"></i></div>' : '';

        const equippedBorder = isEquipped ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : '';

        const cardHTML = `
            <div onclick="showHeroDetails('${id}', 'team')" class="${hero.color} ${equippedBorder} text-white p-4 rounded-lg shadow-lg flex items-center gap-4 relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform">
                <img src="${hero.image}" alt="${hero.name} Fundo" class="absolute -right-4 -bottom-4 w-40 h-40 opacity-30 pointer-events-none object-cover">
                ${equippedIcon}
                <div class="bg-white/20 p-1 rounded-full z-10 shadow-inner">
                    <img src="${hero.icon}" alt="${hero.name}" class="w-16 h-16 rounded-full object-cover border-2 border-white/50 pointer-events-none">
                </div>
                <div class="z-10 flex-1 pointer-events-none">
                    <h2 class="text-xl font-bold uppercase tracking-wider text-shadow-sm">${hero.name}</h2>
                    <p class="text-xs bg-black/40 inline-block px-2 py-1 rounded font-semibold mt-1 shadow-sm">${hero.class}</p>
                    <div class="text-sm mt-2 font-bold bg-black/20 p-2 rounded flex justify-between">
                        <span><i class="fa-solid fa-heart text-red-300 mr-1"></i> ${hero.hpMax}</span>
                        <span><i class="fa-solid fa-hand-fist text-purple-300 mr-1"></i> ${hero.attack}</span>
                    </div>
                </div>
            </div>
        `;
        teamContainer.innerHTML += cardHTML;
    });
}

function renderEquippedSlots() {
    const slotsContainer = document.getElementById('slots-equipe');
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const heroId = equippedHeroes[i];
        if (heroId) {
            const hero = characters[heroId];
            slotsContainer.innerHTML += `
                <div onclick="unequipHero(${i})" class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-lg border-2 border-white/20 relative cursor-pointer shadow-lg overflow-hidden group">
                    <div class="absolute inset-0 ${hero.color} opacity-40"></div>
                    <img src="${hero.icon}" class="w-full h-full object-cover relative z-10">
                    <div class="absolute inset-0 z-20 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i class="fa-solid fa-xmark text-white text-3xl"></i>
                    </div>
                </div>
            `;
        } else {
            slotsContainer.innerHTML += `
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800/50">
                    <i class="fa-solid fa-user-plus text-gray-600 text-2xl"></i>
                </div>
            `;
        }
    }
}

function equipHero(heroId) {
    if (equippedHeroes.includes(heroId)) {
        showMessage(`${characters[heroId].name} já está na sua equipe!`, 'warning');
        return;
    }
    
    if (equippedHeroes.length >= 3) {
        showMessage('Sua equipe já está cheia! (Máximo 3 Unidades)', 'error');
        return;
    }
    
    equippedHeroes.push(heroId);
    renderEquippedSlots();
    loadTeam();
    
    showMessage(`${characters[heroId].name} foi adicionado à equipe!`, 'success');
    
    showHeroDetails(heroId, 'team');
}

function unequipHero(index) {
    const heroId = equippedHeroes[index];
    const heroName = characters[heroId].name;
    
    equippedHeroes.splice(index, 1);
    renderEquippedSlots();
    loadTeam();
    
    showMessage(`${heroName} foi removido da equipe!`, 'info');
    
    const detailsPanel = document.getElementById('painel-detalhes');
    if (detailsPanel && !detailsPanel.classList.contains('hidden')) {
        detailsPanel.classList.add('hidden');
    }
}

const style = document.createElement('style');
style.textContent = `
    #message-container {
        max-width: 320px;
    }
    
    #message-container > div {
        backdrop-filter: blur(8px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);

window.loadTeam = loadTeam;
window.renderEquippedSlots = renderEquippedSlots;
window.equipHero = equipHero;
window.unequipHero = unequipHero;
window.showMessage = showMessage;