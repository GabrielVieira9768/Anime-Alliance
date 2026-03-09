const gameMaps = {
    'namek': {
        id: 'namek',
        name: 'Planeta Namekusei',
        image: 'assets/maps/planet_namek/map.png',
        battleBg: 'assets/maps/planet_namek/battle_stage.png',
        locked: false,
        statusText: '6 Missões Disponíveis',
        missions: [
            { 
                id: 1, top: '20%', left: '15%', isBoss: false,
                enemies: [
                    { id: 'soldier_1', name: 'Soldado Freeza', hp: 80, speed: 90, image: 'assets/enemies/planet_namek/soldier_1.png' },
                    { id: 'cui', name: 'Cui', hp: 150, speed: 100, image: 'assets/enemies/planet_namek/cui.png' },
                    { id: 'soldier_2', name: 'Soldado Freeza', hp: 80, speed: 90, image: 'assets/enemies/planet_namek/soldier_2.png' }
                ]
            },
            { id: 2, top: '40%', left: '30%', isBoss: false, 
                enemies: [
                    { id: 'dodoria', name: 'Dodoria', hp: 200, speed: 95, image: 'assets/enemies/planet_namek/dodoria.png' },
                    { id: 'zarbon', name: 'Zarbon', hp: 180, speed: 105, image: 'assets/enemies/planet_namek/zarbon.png' }
                ] 
            },
            { id: 3, top: '25%', left: '50%', isBoss: false, enemies: [] },
            { id: 4, top: '60%', left: '60%', isBoss: false, enemies: [] },
            { id: 5, top: '40%', left: '80%', isBoss: false, enemies: [] },
            { id: 6, top: '75%', left: '80%', isBoss: true, enemies: [] }
        ]
    },
    'torneio': {
        id: 'torneio',
        name: 'Torneio do Poder',
        image: 'assets/maps/tournament_of_power/map.png',
        battleBg: 'assets/maps/tournament_of_power/battle_stage.png',
        locked: true,
        statusText: 'Desbloqueia após Namekusei',
        missions: []
    }
};

function loadMapSelection() {
    const listaMapas = document.getElementById('lista-mapas');
    if (!listaMapas) return;
    listaMapas.innerHTML = '';

    for (const key in gameMaps) {
        const map = gameMaps[key];
        if (map.locked) {
            listaMapas.innerHTML += `
                <div class="relative h-64 rounded-xl overflow-hidden opacity-50 cursor-not-allowed bg-gray-800">
                    <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <i class="fa-solid fa-lock text-4xl mb-2"></i>
                        <h2 class="text-xl font-bold text-white uppercase">${map.name}</h2>
                    </div>
                </div>
            `;
        } else {
            listaMapas.innerHTML += `
                <div onclick="openMap('${map.id}')" class="relative h-64 rounded-xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-transparent hover:border-green-400 transition-all">
                    <img src="${map.image}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 z-10">
                        <h2 class="text-2xl font-bold text-white uppercase">${map.name}</h2>
                        <p class="text-green-300 font-semibold text-sm">${map.statusText}</p>
                    </div>
                </div>
            `;
        }
    }
}

function openMap(mapId) {
    const map = gameMaps[mapId];
    document.getElementById('mapa-titulo').innerText = map.name;
    const container = document.getElementById('mapa-container');
    
    let mapHTML = `<img src="${map.image}" class="absolute inset-0 w-full h-full object-cover opacity-70 bg-gray-800">`;

    map.missions.forEach(mission => {
        const icon = mission.isBoss ? '<i class="fa-solid fa-skull"></i>' : mission.id;
        const colorClass = mission.isBoss ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]';
        
        mapHTML += `
            <button onclick="startMission('${map.id}', ${mission.id})" style="top: ${mission.top}; left: ${mission.left};" 
            class="absolute w-12 h-12 ${colorClass} rounded-full border-4 border-white flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform z-10">
                ${icon}
            </button>
        `;
    });

    container.innerHTML = mapHTML;
    changeScreen('tela-mapa-interativo');
}