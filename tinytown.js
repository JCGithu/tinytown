let gridW = innerWidth / 20;
let gridH = innerHeight / 20;

let body = document.querySelector('body');
let town = document.getElementById('town');

//Factbox Generate
let factbox = document.getElementById('factbox');
let factBanner = factbox.querySelector('div');
let factTitle = factBanner.querySelector('h2');
let factOwner = document.getElementById('owner');
let factNotes = document.getElementById('notes');

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

class House {
    constructor({x, y, z, id, img, title, date, owner, notes, col1, col2, scale}){
        this.x = x
        this.y = y
        this.z = z
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.date = date;
        this.img = img;
        this.notes = notes;
        this.col1 = col1;
        this.col2 = col2;
        this.scale = scale;
    };

    init(){
        console.log(this.title);
        let img = document.createElement('img');
        img.src = `./houseData/images/${this.img}`;
        img.classList.add('house');
        img.style.bottom = `${this.y * gridH}px`;
        img.style.left = `${this.x * gridW}px`;
        if (!this.scale) this.scale = 1;
        img.style.width = `${this.scale * gridW}px`;
        img.style.height = `${this.scale * gridW}px`;
        img.style.zIndex = this.z;

        img.addEventListener('mouseenter', event => {
            factbox.style.opacity = 1;
            factbox.style.top= `${event.clientY}px`;
            factbox.style.left= `${event.clientX}px`;
            if (this.title) factTitle.innerHTML = this.title;
            if (this.owner) factOwner.innerHTML = this.owner;
            if (this.notes) factNotes.innerHTML = this.notes;
            if (!this.notes) factNotes.innerHTML = null;
            if (!this.col1){
                this.col1 = '#b38046';
                this.col2 = '#b38046';
            }
            factBanner.style.backgroundColor = `${this.col1}CC`;
            factbox.style.backgroundColor = `${this.col2}AA`;
        });

        img.addEventListener('mouseleave', event => {
            factbox.style.opacity = 0;
        })
        town.appendChild(img);
    } 
}

function loadDistrict(district){
    console.log(district);
    readTextFile(`./houseData/${district}.json`, function(text){
    var data = JSON.parse(text);
    for (let house in data){
        let input = new House(data[house]);
        input.init();
    }
    })
};

loadDistrict('mainDistrict');

// Wipes the town
let button = document.getElementById('delete');

button.addEventListener('click', () => {
    town.querySelectorAll('*').forEach(n => n.remove());
    loadDistrict('raidDistrict');
})
