let houseData = {
    'test': {
        "name": "yes",
        "district": "Main"
    }
}

function houseCommand(user){
    if (houseData[user]){
        let district = houseData[user];
        let name = `called ${houseData[user].name}` || '';
        return `@${user} has a house called ${name} in the ${district} district`
    }
    return 'Sorry, no data for this user yet!'
}

houseCommand(toUser);