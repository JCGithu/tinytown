let body = document.querySelector('body');
let town = document.getElementById('town');

let townSize = town.getBoundingClientRect();
let gridW = townSize.width / 20;
let gridH = townSize.height / 20;
let zoomed = false;

function sizeReset(){
    if ((townSize.top + (innerWidth * 0.60)) >= innerHeight){
        let amount = innerHeight - townSize.top;
        town.style.width = `${amount * 1.66}px`; 
        console.log(`${amount}px`)
        town.style.height = `${amount}px`;
    } else {
        let amount = innerWidth / 1.78;
        town.style.height = `${amount}px`;
        town.style.width = `${innerWidth}px`;
    }
    
    townSize = town.getBoundingClientRect();
    
    gridW = townSize.width / 20;
    gridH = townSize.height / 20;
}

sizeReset();

//factBox Generate
let factBox = document.getElementById('factBox');
let factBanner = factBox.querySelector('div');
let factTitle = factBanner.querySelector('h2');
let factOwner = document.getElementById('owner');
let factNotes = document.getElementById('notes');
let blurry = document.getElementById('blur');

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

var allColors = [];
for (var i in tinycolor.names) {
    allColors.push(i);
}

class House {
    constructor({x, y, z, id, img, title, date, owner, notes, col1, col2, scale, data}){
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
        this.data = data;
        this.zoom = false;
    };

    init(){
        if (!this.col1){
            this.col1 = 'b38046', this.col2 = 'faf28a';
        }
        if (tinycolor.readability(this.col1, this.col2) < 1.5){
            if (tinycolor(this.col1).getLuminance() <= 0.95) {
                this.col1 = tinycolor(this.col1).darken(10).toHexString();
            }
        }

        let img = document.createElement('img');
        img.src = `./houseData/images/${this.img}`;
        img.classList.add('townItem');
        img.style.bottom = `${this.y * gridH}px`;
        img.style.left = `${this.x * gridW}px`;
        if (!this.scale) this.scale = 1;
        img.style.width = `${this.scale * gridW}px`;
        img.style.height = `${this.scale * gridW}px`;
        img.style.zIndex = this.z;

        img.addEventListener('mouseenter', event => {
            if(!this.data) return;
            if(zoomed) return;
            factBox.style.opacity = 1;
            factBox.style.top= `${event.clientY}px`;
            factBox.style.left= `${event.clientX}px`;
            if (!this.zoom) img.style.transform = "scale(1.1)";
            img.style.zIndex = 20;
            if (this.title) factTitle.innerHTML = this.title;
            if (this.owner) factOwner.innerHTML = this.owner;
            if (this.notes) factNotes.innerHTML = this.notes;
            if (!this.notes) factNotes.innerHTML = null;
            factBanner.style.backgroundColor = tinycolor(this.col1).setAlpha(0.8).toHexString();
            factBox.style.backgroundColor = tinycolor(this.col2).setAlpha(0.8).toRgbString();
            if (tinycolor(this.col1).getLuminance() <= 0.95){
                factBanner.style.color = tinycolor(this.col2).toHexString();

            } else {
                factBanner.style.color = tinycolor(this.col2).darken(30).toHexString();
            }
            factOwner.style.color = tinycolor(this.col1).toHexString();
            factOwner.style.backgroundColor = tinycolor(this.col1).darken(20).setAlpha(0.1).toRgbString();
            factNotes.style.color = tinycolor(this.col1).toHexString();

            let pos = factBox.getBoundingClientRect();
            if ((pos.height + pos.top)>= innerHeight){
                factBox.style.top = `${innerHeight - pos.height}px`;
            }
            pos = factBox.getBoundingClientRect();
            if ((pos.width + pos.left)>= innerWidth){
                factBox.style.left = `${innerWidth - pos.width}px`;
            }
        });

        img.addEventListener('mouseleave', event => {
            if(!this.data) return;
            if(zoomed) return;
            factBox.style.opacity = 0;
            img.style.transform = "scale(1)";
            if(!this.zoom) img.style.zIndex = this.z;
        })

        img.addEventListener('click', event => {
            if(!this.data) return;
            if(!this.zoom){
                if (zoomed) return;
                img.style.width = `${townSize.height}px`;
                img.style.height = `${townSize.height}px`;
                img.style.bottom = `0px`;
                img.style.left = `${(townSize.width - townSize.height)/2}px`;
                img.style.zIndex = 20;
                this.zoom = true;
                let imPos = img.getBoundingClientRect();
                factBox.style.opacity = 1;
                factBox.style.top= `1rem`;
                factBox.style.left= `1rem`;
                factBox.style.fontSize = '3rem';
                factTitle.style.fontSize = '1.5rem';
                zoomed = true;
                blurry.style.opacity = 0.7;
            } else {
                img.style.width = `${this.scale * gridW}px`;
                img.style.height = `${this.scale * gridW}px`;
                img.style.bottom = `${this.y * gridH}px`;
                img.style.left = `${this.x * gridW}px`;
                img.style.zIndex = this.z;
                this.zoom = false;
                zoomed = false;
                factBox.style.opacity = 0;
                factBox.style.fontSize = '1rem';
                factTitle.style.fontSize = '1rem';
                blurry.style.opacity = 0;
            }
        })
        town.appendChild(img);
    } 
}

let districts = ['mainDistrict', 'raidDistrict', 'marblesDistrict', 'originsDistrict'];
let currentDistrict = 'mainDistrict';

function loadDistrict(district){
    sizeReset();
    console.log(`${district} has loaded!`);
    readTextFile(`./houseData/${district}.json`, function(text){
    var data = JSON.parse(text);
    for (let house in data){
        let input = new House(data[house]);
        input.init();
    }
    currentDistrict = district;
    })
};

loadDistrict(currentDistrict);

districts.forEach(district => {
    let button = document.getElementById(district);
    button.addEventListener('click', () => {
        town.querySelectorAll('*').forEach(n => n.remove());
        loadDistrict(district);
    })
});

window.addEventListener('resize', () => {
    zoomed = false;
    town.querySelectorAll('*').forEach(n => n.remove());
    loadDistrict(currentDistrict)
});

