function runLurkMessage(){
    const lurkMessage = [
        'has happened upon a fork in the road. They look left, then glance right. With a deep breath, they begin walking down the path to the left, heading into the Lurking Woods.',
        'is continuing to lurk yes yes yes',
        'has found a test lurk message, lucky you!'];
    return lurkMessage[Math.floor(Math.random() * lurkMessage.length)];
}

runLurkMessage();