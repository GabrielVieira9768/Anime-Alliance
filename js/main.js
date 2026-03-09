function changeScreen(newScreenId) {
    const allScreens = document.querySelectorAll('.tela');
    allScreens.forEach(screen => screen.classList.remove('ativa'));

    const targetScreen = document.getElementById(newScreenId);
    if (targetScreen) {
        targetScreen.classList.add('ativa');
    }

    if (newScreenId === 'tela-loja') {
        loadShop();
    }
    if (newScreenId === 'tela-equipe') {
        loadTeam();
    }
    if (newScreenId === 'tela-mapa') {
        loadMapSelection();
    }
}

function showHeroDetails(heroId, context = 'team') {
    const hero = characters[heroId];
    const panelId = (context === 'shop' || context === 'owned') ? 'painel-detalhes-loja' : 'painel-detalhes';
    const detailsPanel = document.getElementById(panelId);

    if (!detailsPanel) return;

    let actionButton = '';
    
    if (context === 'shop') {
        actionButton = `
            <button onclick="buyHero('${heroId}')" class="fa-solid fa-coins bg-yellow-500 hover:bg-yellow-400 w-full py-3 rounded-lg font-black text-lg shadow-lg transition-all text-black uppercase tracking-widest transform active:scale-95">
                ${hero.cost}
            </button>`;
    } 
    else if (context === 'team') {
        const isEquipped = equippedHeroes.includes(heroId);
        
        if (isEquipped) {
            actionButton = `
                <button onclick="unequipHeroFromDetails('${heroId}')" class="bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all text-white uppercase tracking-widest transform active:scale-95">
                    <i class="fa-solid fa-xmark mr-2"></i> Desequipar
                </button>`;
        } else {
            actionButton = `
                <button onclick="equipHero('${heroId}')" class="${hero.color} hover:brightness-110 w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all text-white uppercase tracking-widest transform active:scale-95">
                    <i class="fa-solid fa-plus mr-2"></i> Equipar
                </button>`;
        }
    } 
    else {
        actionButton = `<div class="bg-green-600/30 text-green-400 text-center font-bold uppercase tracking-widest py-3 rounded-lg border border-green-500/50 px-4">
            <i class="fa-solid fa-check mr-2"></i> Unidade Adquirida
        </div>`;
    }

    detailsPanel.innerHTML = `
        <div class="relative w-full flex justify-center mb-4">
            <div class="${hero.color} absolute w-24 h-24 rounded-full blur-xl opacity-50"></div>
            <img src="${hero.icon}" class="w-28 h-28 rounded-full border-4 border-gray-800 shadow-xl object-cover z-10 relative">
        </div>
        <h2 class="text-3xl font-bold uppercase tracking-widest text-white text-center">${hero.name}</h2>
        <span class="${hero.color} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 mb-6 text-white shadow">${hero.class}</span>
        
        <div class="w-full bg-gray-800 rounded-lg p-4 mb-6 shadow-inner border border-gray-700">
            <h3 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-1 w-full text-center">Atributos de Combate</h3>
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300 font-semibold"><i class="fa-solid fa-heart text-red-500 mr-2"></i> Vida</span>
                <span class="text-white font-bold text-lg">${hero.hpMax}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300 font-semibold"><i class="fa-solid fa-hand-fist text-purple-500 mr-2"></i> Ataque</span>
                <span class="text-white font-bold text-lg">${hero.attack}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300 font-semibold"><i class="fa-solid fa-wind text-green-500 mr-2"></i> Esquiva</span>
                <span class="text-white font-bold text-lg">${hero.evasion}%</span>
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300 font-semibold"><i class="fa-solid fa-person-running text-yellow-500 mr-2"></i> Velocidade</span>
                <span class="text-white font-bold text-lg">${hero.speed}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-gray-300 font-semibold"><i class="fa-solid fa-bolt text-blue-500 mr-2"></i> Energia</span>
                <span class="text-white font-bold text-lg">${hero.energyMax}</span>
            </div>
        </div>
        ${actionButton}
    `;
    detailsPanel.classList.remove('hidden');
}

window.onload = () => {
    loadTeam();
    renderEquippedSlots(); 
    loadMapSelection();
    loadShop();
};

window.changeScreen = changeScreen;
window.showHeroDetails = showHeroDetails;