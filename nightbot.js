function runLurkMessage(){
    const lurkMessage = [
        "has happened upon a fork in the road. They look left, then glance right. With a deep breath, they begin walking down the path to the left, heading into the Lurking Woods.",
        "has been beckoned by the shadows of the lurk. For wisdom, for power, for treasure, or for courage, they begin their long and dangerous journey into the Lurking Woods.",
        "it appears as though you are being summoned into the Lurking Woods. We know not what they want or why they have asked for you, but it is dangerous to go alone. Take this 🔪!",
        "woke up one morning and found that a strange feeling had overcome them. Something like a force was calling to them from the Lurking Woods, and so they embarked on their journey, seeking answers to questions they didn't have.",
        "suddenly realized that they had bought too much bread from the bakery today. Looking to share some of the excess with their grandmother, they headed into the Lurking Woods, unawares of what dangers may be there.",
        "was happily staying in their lane until something shiny caught their eye. It was a marble, hiding in the grass. Upon inspecting it, they saw that it was a trail of marbles, and so they followed them into the Lurking Woods."
    ];
    return lurkMessage[Math.floor(Math.random() * lurkMessage.length)];
}

function Return(x){
    return `${x}`;
}

if (user){
    Return(user);
}
console.log('whahah');

runLurkMessage();