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
  eventBox.id = 'eventBox';
  let title = document.createElement('h1');
  title.innerHTML = `${data.redeemer}, you won ${data.owner != 'TBC' ? data.owner + "'s" : "a"} tiny home! ${data.title != 'TBC' ? "It's called " + data.title : ''}`;
  eventBox.appendChild(title);
  // load image
  let img = document.createElement('img');
  img.src = `../houseData/images/${data.img}`;
  eventBox.appendChild(img);
  document.body.appendChild(eventBox);

  // play animation
  setTimeout(() => {
    document.body.removeChild(document.getElementById('eventBox'));
    running = false;
  }, 7000)
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