function houseCommand(){
    let user = touser.toLowerCase();
    if (houseData[user]){
        let district = houseData[user].district;
        let num = `${houseData[user].num} houses` || 'a house';
        let name = `called ${houseData[user].name}` || '';
        return `@${user} has ${num} ${name} in the ${district}!`;
    }
    return 'Sorry, no data for this user yet!';
};
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