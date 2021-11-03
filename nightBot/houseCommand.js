function houseCommand(){
    let user = touser.toLowerCase();
    if (houseData[user]){
        if (houseData[user].district) district = ` in the ${houseData[user].district}`;
        if (houseData[user].num) num = `${houseData[user].num} houses`;
        if (houseData[user].name) name = ` called ${houseData[user].name}`;
        return `@${user} has ${num}${name}${district}!`;
    }
    return `Sorry, no data for ${user} yet!`;
};
let num = 'a house'; 
let name = '';
let district = '';
let houseData = {
    "colloquialowl": {
        "name": "Owl House",
        "district": "Main District",
    },
    "winsord": {
        "name": "Tall and Tiny",
        "district": "Main and Raid districts",
        "num": 2
    },
    "beckycas_":{
        "name": "Sparkles",
        "district": "Main District"
    },
    "desirelinesgames":{
        "name": "Tigger and Red Penguin",
        "district": "Main District",
        "num": 2
    },
    "lydiapancakes": {
        "district": "Main District"
    },
    "kellanmahree": {
        "district": "Main District"
    },
    "between_the_pages_co": {
        "name": "Christine’s Cabin",
        "district": "Main District"
    },
    "arcanetempest": {
        "name": "Hellequin",
        "district": "Main District and an entire library in the Raid District"
    },
    "azlxns": {
        "name": "Kylo Rent",
        "district": "Main District"
    },
    "cowlandcape": {
        "district": "Main District"
    },
    "hellovonnie": {
        "district": "Main District"
    },
    "coco___glez":{
        "district": "Main District",
    },
    "auntieplant": {
        "district": "Main District",
    },
    "astoldbyangela": {
        "name": "Wombat House",
        "district": "Main District"
    },
    "jostockdale":{
        "district": "Marbles District"
    },
    "millisaysmaybe": {
        "name": "Cog the Dragon's house",
        "district": "Marbles District"
    },
    "mattfraser": {
        "name": "Derp",
        "district": "Raid District"
    },
    "arcasian": {
        "district": "Raid District"
    },
    "aeeolus": {
        "district": "Origins District"
    },
    "emm__a_":{
        "name": "NotDitto",
        "district": "Main District"
    },
    "yukfun":{
        "district": "Main District" 
    },
    "letsbrock":{
        "district": "Main & Raid districts",
        "num": 2,
    }
};
houseCommand();