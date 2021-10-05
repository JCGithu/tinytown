function houseCommand(){
    let user = touser.toLowerCase();
    if (houseData[user]){
        if (houseData[user].district) district = ` in the ${houseData[user].district}`;
        if (houseData[user].num) num = `${houseData[user].num}`;
        if (houseData[user].name) name = ` called ${houseData[user].name}`;
        return `@${user} has ${num}${name}${district}!`;
    }
    return 'Sorry, no data for this user yet!';
};
let num = 'a house'; 
let name = '';
let district = '';
let houseData = {
    "colloquialowl": {
        "name": null,
        "district": "Main District",
        "num": 0,
    },
    "winsord": {
        "name": "Tall and Tiny",
        "district": "Main and Raid districts",
        "num": 2
    }
};
houseCommand();