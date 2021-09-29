let body = document.querySelector('body');
let town = document.getElementById('town');
let townContainer = document.getElementById('townContainer');
let menu = document.getElementById('menu');

let townSize = town.getBoundingClientRect();
let menuSize = menu.getBoundingClientRect();

let gridW = townSize.width / 20;
let gridH = townSize.height / 20;
let zoomed = false;

function sizeReset(){
    //let townContainerSize = townContainer.getBoundingClientRect();
    townContainer.style.height = `${innerHeight - menuSize.bottom}px`;
    let ratio = 1.257;
    if ((townSize.top + (innerWidth * (1/ratio))) >= innerHeight){
        let amount = innerHeight - townSize.top;
        town.style.width = `${amount * ratio}px`; 
        town.style.height = `${amount}px`;
    } else {
        let amount = innerWidth / ratio;
        town.style.height = `${amount}px`;
        town.style.width = `${innerWidth}px`;
    }
    townSize = town.getBoundingClientRect();
    if (townSize.width < innerWidth){
        console.log('biggun');
    }
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

/* let hide = document.getElementById('hide');

hide.addEventListener('click', () => {
    console.log('clicked');
    menu.style.transform = `translateY(-${menuSize.bottom}px)`;
    townContainer.style.transform = `translateY(-${menuSize.bottom}px)`;
    menuSize = menu.getBoundingClientRect();
    sizeReset();
}); */

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

function onScreenCheck(target){
    let pos = target.getBoundingClientRect();
    if ((pos.height + pos.top)>= innerHeight){
        target.style.top = `${innerHeight - pos.height}px`;
    }
    pos = target.getBoundingClientRect();
    if ((pos.width + pos.left)>= innerWidth){
        target.style.left = `${innerWidth - pos.width}px`;
    }
}

var allColors = [];
for (var i in tinycolor.names) {
    allColors.push(i);
}

class House {
    constructor({left, right, y, z, id, img, title, date, owner, notes, col1, col2, scale, data, crop}){
        this.left = left;
        this.right = right;
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
        this.crop = crop;
    };

    init(){
        if (!this.col1){
            this.col1 = 'b38046', this.col2 = 'faf28a';
        }
        let colourScale = tinycolor(this.col1).analogous();
        this.col1 = tinycolor(this.col1).toHexString();
        this.col2 = tinycolor(this.col2).toHexString();
        if (!this.scale) this.scale = 1;
        let imgDefaultStyle = {
            bottom: `${this.y * gridH}px`,
            width: `${this.scale * gridW}px`,
            height: `${this.scale * gridW}px`,
            zIndex: this.z
        }
        if (this.left !== undefined) imgDefaultStyle.left = `${this.left * gridW}px`;
        if (this.right !== undefined) imgDefaultStyle.right = `${this.right * gridW}px`;
        let img = document.createElement('img');
        img.src = `./houseData/images/${this.img}`;
        img.classList.add('townItem');
        Object.assign(img.style, imgDefaultStyle);

        if (this.crop){
            readTextFile(`./houseData/images/${this.img}`, (text) => {
                let findings = text.match(/(?<=viewBox\=\"0.0.)([\d\.\s]+)/g)[0].split(' ');
                imgDefaultStyle.width = `${(this.scale * (findings[0]/findings[1])) * gridW}px`
                Object.assign(img.style, imgDefaultStyle);
            })
        }

        img.addEventListener('mouseenter', event => {
            if(!this.data || zoomed) return;
            factBox.style.opacity = 1;
            factBox.style.top= `${event.clientY}px`;
            factBox.style.left= `${event.clientX}px`;
            if (!this.zoom) img.style.transform = "scale(1.1)";
            img.style.zIndex = 20;
            factTitle.innerHTML = this.title;
            factOwner.innerHTML = this.owner;
            factNotes.innerHTML = this.notes;
            factBanner.style.backgroundColor = this.col1;
            factBanner.style.color = this.col2;
            //factBox.style.backgroundColor = tinycolor(this.col2).setAlpha(0.8).toRgbString();
            factOwner.style.color = this.col2;
            //factOwner.style.backgroundColor = tinycolor(this.col1).darken(20).setAlpha(0.1).toRgbString();
            factBox.style.backgroundColor = this.col2
            factOwner.style.backgroundColor = colourScale[2].toHexString();
            factNotes.style.color = this.col1;
            onScreenCheck(factBox);
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
                img.style.bottom = `1rem`;
                img.style.left = `${(townSize.width - townSize.height)/2}px`;
                img.style.zIndex = 20;
                this.zoom = true;
                factBox.style.opacity = 1;
                factBox.style.top= `1rem`;
                factBox.style.left= `1rem`;
                factBox.style.width = `20rem`;
                factOwner.style.fontSize = '1.5rem';
                factTitle.style.fontSize = '2rem';
                factNotes.style.fontSize = '1rem';
                img.style.transform = "scale(1)";
                zoomed = true;
                blurry.style.backgroundColor = tinycolor(this.col1).darken().toHexString();
                blurry.style.opacity = 0.4;
                if ((innerHeight/ innerWidth) >= 1.6){
                    factBox.style.width = `${innerWidth*0.95}px`;
                    factBox.style.left = `${innerWidth*0.025}px`;
                    blurry.style.opacity = 0.8;
                }
            } else {
                Object.assign(img.style, imgDefaultStyle);
                this.zoom = false;
                zoomed = false;
                factBox.style.opacity = 0;
                factBox.style.width = `13rem`;
                factBox.style.fontSize = '1rem';
                factTitle.style.fontSize = '1rem';
                factOwner.style.fontSize = '1rem';
                factNotes.style.fontSize = '0.8rem';
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

