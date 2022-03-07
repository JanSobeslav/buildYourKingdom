let data = [
    {
        name: "Hrad",
        link: "castle",
        active: "false",
        level: 1,
        priceGold: 15,
        priceCoins: 1,
        time: 25, //ČAS ZJISTIT
        finishDateTime: "",
        icon: "fab fa-fort-awesome-alt",
    },
    {
        name: "Zlatý důl",
        link: "gold-mine",
        active: "false",
        level: 1,
        priceGold: 20,
        priceCoins: 2,
        time: 40, //ČAS ZJISTIT
        finishDateTime: "",
        icon: "fas fa-cubes"
    },
    {
        name: "Kasárna",
        link: "barracks",
        active: "false",
        level: 0,
        priceGold: 10,
        priceCoins: 1,
        time: 19, //ČAS ZJISTIT
        finishDateTime: "",
        icon: "fas fa-chess-rook",
        soldiers_type: [
            {
                name: "Šermíř",
                link: "swordsman",
                priceGold: 5,
                priceCoins: 1,
                time: 516,
                attack: 3,
                defence: 3,
                finishDateTime: "",
                icon: "fas fa-chess-pawn"
            },
            {
                name: "Lukostřelec",
                link: "archer",
                priceGold: 6,
                priceCoins: 1,
                time: 556,
                attack: 2,
                defence: 5,
                finishDateTime: "",
                icon: "fas fa-bullseye"
            },
            {
                name: "Jezdec",
                link: "horseman",
                priceGold: 9,
                priceCoins: 2,
                time: 846,
                attack: 6,
                defence: 4,
                finishDateTime: "",
                icon: "fas fa-horse-head"
            }
        ],
    },
    {
        name: "Mincovna",
        link: "mint",
        active: "false",
        level: 0,
        priceGold: 28,
        priceCoins: 3,
        time: 120, //ČAS ZJISTIT
        finishDateTime: "",
        icon: "fas fa-coins",
        coin: {
            time: 1541,
            price: 10
        }
    }
];
let settings = {
    townName: "Vesnice",
    userName: "hráč 1245",
    activeLink: "castle",
    activeBuildState: false,
    activeRecruitState: false,
    buildingUpgradingState: "",
    recruitingUpgradingState: "",
    gold: 60,
    coins: 0,
    army: {
        swordsmans: 5,
        archers: 0,
        horsemans: 0
    }
};

export function getData() {
    return {'data': data, 'settings': settings};
}