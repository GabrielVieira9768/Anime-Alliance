let myInventory = ['goku', 'teen_gohan', 'piccolo'];
let equippedHeroes = ['teen_gohan', 'piccolo'];

const characters = {
    goku: {
        name: "Goku",
        class: "Brutamonte",
        hpMax: 170,
        attack: 35,
        speed: 90,
        evasion: 5,
        energyMax: 100,
        skills: [
            { name: 'KaioKen', damage: 40, energyCost: 20, icon: 'assets/characters/goku/skills/skill_1.png' },
            { name: 'Kamehameha', damage: 80, energyCost: 50, icon: 'assets/characters/goku/skills/skill_2.png' }
        ],
        icon: "assets/characters/goku/icon.png",
        image: "assets/characters/goku/character.png",
        unit: "assets/characters/goku/unit.png",
        color: "bg-orange-600",
        cost: 100,
    },
    teen_gohan: {
        name: "Teen Gohan",
        class: "Explosivo",
        hpMax: 120,
        attack: 50,
        speed: 125,
        evasion: 8,
        energyMax: 120,
        skills: [
            { name: 'Disparo Contínuo', damage: 40, energyCost: 20, icon: 'assets/characters/teen_gohan/skills/skill_1.png' },
            { name: 'Masenko', damage: 80, energyCost: 50, icon: 'assets/characters/teen_gohan/skills/skill_2.png' }
        ],
        icon: "assets/characters/teen_gohan/icon.png",
        image: "assets/characters/teen_gohan/character.png",
        unit: "assets/characters/teen_gohan/unit.png",
        color: "bg-purple-600",
        cost: 100,
    },
    piccolo: {
        name: "Piccolo",
        class: "Estrategista",
        hpMax: 190,
        attack: 28,
        speed: 85,
        evasion: 4,
        energyMax: 100,
        skills: [
            { name: 'Granada Infernal', damage: 40, energyCost: 20, icon: 'assets/characters/piccolo/skills/skill_1.png' },
            { name: 'Makankosappo', damage: 80, energyCost: 50, icon: 'assets/characters/piccolo/skills/skill_2.png' }
        ],
        icon: "assets/characters/piccolo/icon.png",
        image: "assets/characters/piccolo/character.png",
        unit: "assets/characters/piccolo/unit.png",
        color: "bg-green-600",
        cost: 100,
    },
    vegeta: {
        name: "Vegeta",
        class: "Brutamonte",
        hpMax: 160,
        attack: 40,
        speed: 85,
        evasion: 6,
        energyMax: 100,
        skills: [
            { name: 'Golpe Final', damage: 40, energyCost: 20, icon: 'assets/characters/vegeta/skills/skill_1.png' },
            { name: 'Galick Ho', damage: 80, energyCost: 50, icon: 'assets/characters/vegeta/skills/skill_2.png' }
        ],
        icon: "assets/characters/vegeta/icon.png",
        image: "assets/characters/vegeta/character.png",
        unit: "assets/characters/vegeta/unit.png",
        color: "bg-blue-600",
        cost: 100,
    },
};