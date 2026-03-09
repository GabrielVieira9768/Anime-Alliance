function loadShop() {
    const shopContainer = document.getElementById('lista-loja');
    if (!shopContainer) return;
    shopContainer.innerHTML = '';

    const allHeroesIds = Object.keys(characters);
    allHeroesIds.sort((a, b) => {
        const temA = myInventory.includes(a);
        const temB = myInventory.includes(b);
        return temA - temB; 
    });

    allHeroesIds.forEach(id => {
        const hero = characters[id];
        const jaPossui = myInventory.includes(id);
        
        const statusClasses = jaPossui 
            ? "grayscale opacity-60 cursor-default" 
            : "hover:scale-[1.03] cursor-pointer ring-2 ring-white/10 hover:ring-yellow-400";

        const cardHTML = `
            <div onclick="showHeroDetails('${id}', '${jaPossui ? 'owned' : 'shop'}')" 
                 class="${hero.color} ${statusClasses} text-white p-4 rounded-lg shadow-lg flex items-center gap-4 relative overflow-hidden transition-all duration-300">
                
                <img src="${hero.image}" class="absolute -right-4 -bottom-4 w-40 h-40 opacity-30 pointer-events-none object-cover">
                
                <div class="bg-white/20 p-1 rounded-full z-10 shadow-inner">
                    <img src="${hero.icon}" class="w-16 h-16 rounded-full object-cover border-2 border-white/50">
                </div>

                <div class="z-10 flex-1">
                    <h2 class="text-xl font-bold uppercase tracking-wider">${hero.name}</h2>
                    <div class="flex justify-between items-center mt-2">
                        ${jaPossui 
                            ? `<span class="bg-black/60 px-3 py-1 rounded text-[10px] font-black text-green-400 uppercase tracking-tighter">Já Adquirido</span>`
                            : `<span class="bg-yellow-400/90 px-3 py-1 rounded text-[10px] font-black text-black uppercase tracking-tighter">
                                <i class="fa-solid fa-coins mr-1"></i> ${hero.cost}
                               </span>`
                        }
                    </div>
                </div>
            </div>
        `;
        shopContainer.innerHTML += cardHTML;
    });
}

function buyHero(heroId) {
    if (!myInventory.includes(heroId)) {
        myInventory.push(heroId);

        const detailsPanel = document.getElementById('painel-detalhes-loja');
        
        const buyButton = detailsPanel.querySelector('button');
        if (buyButton) {
            buyButton.outerHTML = `
                <div class="bg-blue-600 text-white w-full py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 animate-pop">
                    <i class="fa-solid fa-circle-check"></i> ADQUIRIDO!
                </div>
            `;
        }

        loadShop();
        loadTeam();
    }
}