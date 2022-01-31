// TOOLS

async function readTextFile(file, callback) {
  return new Promise (res => {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        res(JSON.parse(rawFile.responseText));
        //return JSON.parse(rawFile.responseText);
      }
    }
    rawFile.send(null);
  })
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// ~~~~~~

//LOAD DATA
let houses;
let running = false;
let jobQueue = [];

async function boot(){
  houses = await readTextFile(`./gacha/finalData.json`);
  console.log(houses);
}

boot();

//TMI SETUP
const client = new tmi.Client({
  channels: ['arcasian', 'colloquialowl']
});

client.on("connected", () => {console.log('Reading from Twitch! ✅')});

//GACHA
async function newGacha(tags){
  let houseArray = Object.keys(houses);
  let num = getRandomInt(houseArray.length);
  let houseData = houses[houseArray[num]];
  houseData.redeemer = tags.username;
  jobQueue.push(houseData);
}

async function play(data){
  running = true;

  let eventBox = document.createElement('div');
  eventBox.id = 'eventbox';
  // load image
  let img = document.createElement('img');
  img.src = `./houseData/images/${data.img}`;
  console.log(data.img);
  eventBox.appendChild(img);
  let title = document.createElement('h1');
  title.innerHTML = `${data.redeemer},<br> you won ${data.owner != 'TBC' ? data.owner + "'s" : "a"} tiny home! ${data.title != 'TBC' ? "<br>It's called " + data.title : ''}`;
  console.log(title.innerHTML.length);
  console.log(title.style.fontSize);
  if (data.owner.length > 8){
    title.style.fontSize = '30px';
  }
  if (title.innerHTML.length > 50){
    console.log(title.innerHTML);
    let amount = (title.innerHTML.length - 50)/4;
    title.style.fontSize = `${20 - amount}px`;
  }
  eventBox.appendChild(title);
  document.body.appendChild(eventBox);
  //textFit(title);

  // play animation
  setTimeout(() => {
    document.getElementById('eventbox').style.opacity = 0;
    setTimeout(()=>{
      document.body.removeChild(document.getElementById('eventbox'));
      running = false;
    },1000);
  }, 6000)
}

setInterval(async function (){
  if (jobQueue.length === 0 || running) return;
  play(jobQueue[0]);
  jobQueue.shift();
}, 1000);

/* setTimeout(()=>{
  console.log('testing');
  newGacha({username: 'Jack Test'});
}, 2000) */

// TMI MESSAGE

client.connect();
client.on('message', (channel, tags, message, self) => newGacha(tags));