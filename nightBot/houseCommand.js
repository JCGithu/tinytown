function houseCommand(){
    let user = touser.toLowerCase();
    let houseData = {
        'colloquialowl': {
            "name": "Owl House",
            "district": "Main"
        }
    };

    if (houseData[user]){
        let district = houseData[user].district;
        let name = `called ${houseData[user].name}` || '';
        return `@${user} has a house called ${name} in the ${district} district!`;
    }
    return 'Sorry, no data for this user yet!';
};

houseCommand();