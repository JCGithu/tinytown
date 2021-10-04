function runNightBot(){
    const lurkMessage = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultrices ac dolor ut accumsan. Maecenas tristique turpis in odio laoreet congue. Sed cursus varius ex sed feugiat. Cras imperdiet nisl.',
        'more lurk more lurkmore lurkmore lurkmore lurk more lurk more lurk more lurk more lurk v more lurk more lurk more lurk more lurk more lurk v more lurk vmore lurk',
        'Lurk 3'];
    return lurkMessage[Math.floor(Math.random() * lurkMessage.length)];
}

runNightBot();