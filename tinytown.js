let ds = ['body', 'town', 'townContainer', 'menu', 'factBox', 'factOwner', 'factNotes', 'blurry'];
for (let def in ds){
    eval(`let ${def[ds]} = document.getElementById('${def[ds]}')`)
}

let townSize = town.getBoundingClientRect();
let menuSize = menu.getBoundingClientRect();

let gridW = townSize.width / 20;
let gridH = townSize.height / 20;
let zoomed = false;

//FactBox Generate
let factBanner = factBox.querySelector('div');
let factTitle = factBanner.querySelector('h2');

let fireArray = ['Fire01.svg', 'Fire04.svg', 'Fire05.svg'];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sizeReset(){
    townContainer.style.height = `${innerHeight - menuSize.bottom}px`;
    const ratio = 1.257;
    town.style.height = `${innerWidth / ratio}px`;
    town.style.width = `${innerWidth}px`;
    if ((townSize.top + (innerWidth * (1/ratio))) >= innerHeight){
        town.style.width = `${(innerHeight - townSize.top) * ratio}px`; 
        town.style.height = `${innerHeight - townSize.top}px`;
    }
    townSize = town.getBoundingClientRect();
    gridW = townSize.width / 20;
    gridH = townSize.height / 20;
}

sizeReset();

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
    if ((pos.width + pos.left)>= innerWidth){
        target.style.left = `${innerWidth - pos.width}px`;
    }
}

function cropEffect(cropImg, cropHouse, cropScale, cropDefaultStyle){
    readTextFile(`./houseData/images/${cropImg}`, (text) => {
        let findings = text.match(/(viewBox="[\d\.\s]+")/g)[0].match(/[\d\.\s]+/g)[0].split(' ');
        cropHouse.style.width = `${(cropScale * (findings[2]/findings[3])) * gridW}px`;
        cropDefaultStyle.width = cropHouse.style.width;
    })
}

class House {
    constructor(houseData){
        this.left = houseData.left;
        this.right = houseData.right;
        this.y = houseData.y
        this.z = houseData.z || 0
        this.title = houseData.title || 'TBC';
        this.owner = houseData.owner || 'TBC';
        this.date = houseData.date || undefined;
        this.img = houseData.img;
        this.notes = houseData.notes;
        this.col1 = tinycolor(houseData.col1 || 'b38046').toHexString();
        this.col2 = tinycolor(houseData.col2 || 'faf28a').toHexString();
        this.col3 = tinycolor(houseData.col1 || 'b38046').analogous();
        this.scale = houseData.scale || 1;
        this.data = houseData.data;
        this.crop = houseData.crop;
        this.zoom = false;
        this.houseBox = undefined;
        this.house = undefined;
        this.fire = undefined;
        this.defaultStyle = {
            bottom: `${this.y * gridH}px`,
            width: `${this.scale * gridW}px`,
            height: `${this.scale * gridW}px`,
            zIndex: this.z
        };
    };

    init(){        
        if (this.left !== undefined) this.defaultStyle.left = `${this.left * gridW}px`;
        if (this.right !== undefined) this.defaultStyle.right = `${this.right * gridW}px`;

        this.houseBox = document.createElement('section');
        this.houseBox.classList.add('house');
        this.house = document.createElement('img');
        this.house.src = `./houseData/images/${this.img}`;
        this.house.classList.add('house');

        Object.assign(this.house.style, this.defaultStyle);
        if (this.crop) cropEffect(this.img, this.house, this.scale, this.defaultStyle);
        if (onMobile){
            this.house.addEventListener('click', (event) => {
                console.log('mobile click logged');
                this.click();
            })
        }
        town.appendChild(this.house);
    }

    decorInit(){
        if (this.left !== undefined) this.defaultStyle.left = `${this.left * gridW}px`;
        if (this.right !== undefined) this.defaultStyle.right = `${this.right * gridW}px`;
        this.house = document.createElement('img');
        this.house.src = `./houseData/images/${this.img}`;
        this.house.classList.add('decoration');
        Object.assign(this.house.style, this.defaultStyle);
        if (this.crop) cropEffect(this.img, this.house, this.scale, this.defaultStyle);
        town.appendChild(this.house);
    }

    hover(event){
        if(!this.data || zoomed) return;
        factBox.style.opacity = 1;
        factBox.style.top= `${event.clientY}px`;
        factBox.style.left= `${event.clientX}px`;
        if (!this.zoom) this.house.style.transform = "scale(1.1)";
        this.house.style.zIndex = 20;
        factTitle.innerHTML = this.title;
        factOwner.innerHTML = this.owner;
        factNotes.innerHTML = this.notes;
        factBanner.style.backgroundColor = this.col1;
        factBanner.style.color = this.col2;
        factOwner.style.color = this.col2;
        factBox.style.backgroundColor = this.col2
        factOwner.style.backgroundColor = this.col3[2].toHexString();
        factNotes.style.color = this.col1;
        onScreenCheck(factBox);
        if (!this.fire && !onMobile) this.fireGen();
        document.body.onkeyup = (e) => {
            if(e.code === 'Space'){
                console.log('space')
                this.fire.style.visibility = 'visible';
                if (this.fire.style.transform === 'scale(0)') {
                    this.fire.style.transform = `scale(1)`;
                    return;
                }
                this.fire.style.transform = `scale(0)`;
            }
        }
    }

    fireGen(){
        console.log('Fire generated');
        this.fire = document.createElement('img');
        this.fire.classList.add('fire');
        this.fire.style.transform = `scale(0)`;
        this.fire.style.width = `${this.scale * gridW * 0.35}px`;
        if (this.left !== undefined) this.fire.style.left = `${this.left * gridW + getRandomInt((this.scale * gridW)*0.5)}px`;
        if (this.right !== undefined) this.fire.style.right = `${this.right * gridW + getRandomInt((this.scale * gridW)*0.5)}px`;
        this.fire.style.bottom = `${(this.y * gridH) + (this.scale * gridW * 0.4) + getRandomInt(this.scale * gridW * 0.1)}px`;
        this.fire.src = `./houseData/images/${fireArray[getRandomInt(fireArray.length)]}`;
        town.appendChild(this.fire);
    }

    unhover(){
        if(!this.data || zoomed) return;
        factBox.style.opacity = 0;
        this.house.style.transform = "scale(1)";
        if(!this.zoom) this.house.style.zIndex = this.z;
    }

    click(){
        console.log('clicked');
        if(!this.data) return;
        if(!this.zoom){
            if (zoomed) return;
            this.house.classList.add('zoomedImage');
            factBox.classList.add('factZoom');
            this.house.style.width = `${townSize.height}px`;
            this.house.style.height = `${townSize.height}px`;
            this.house.style.left = `${(townSize.width - townSize.height)/2}px`;
            this.zoom = true, zoomed = true;
            blurry.style.backgroundColor = tinycolor(this.col1).darken().toHexString();
            blurry.classList.add('blurryOn');
            return;
        }
        Object.assign(this.house.style, this.defaultStyle);
        this.zoom = false, zoomed = false;
        this.house.classList.remove('zoomedImage');
        factBox.classList.remove('factZoom');
        factBox.style.opacity = 0;
        blurry.classList.remove('blurryOn');
    }
}

let districts = ['mainDistrict', 'raidDistrict', 'lurkDistrict', 'marblesDistrict', 'originsDistrict'];
let currentDistrict = 'mainDistrict';

function loadDistrict(district){
    sizeReset();
    console.log(`${district} has loaded!`);
    readTextFile(`./houseData/${district}.json`, function(text){
        var data = JSON.parse(text);
        for (let house in data){
            let input = new House(data[house]);
            if (!data[house].data){
                input.decorInit();
                continue;
            }
            input.init();
            input.house.addEventListener('mouseenter', (event) => input.hover(event));
            input.house.addEventListener('mouseleave', (event) => input.unhover(event));
            if (!onMobile) input.house.addEventListener('click', (event) => input.click(event));
        }
        currentDistrict = district;
    })
};

let preview; 
function previewLoad(district){
    let pre = document.createElement('img');
    pre.id='preview';
    pre.src =  `./previews/${district}.png`;
    town.prepend(pre);
    preview = document.getElementById('preview');
}

previewLoad(currentDistrict);
loadDistrict(currentDistrict);

districts.forEach(district => {
    let button = document.getElementById(district);
    button.addEventListener('click', () => {
        town.querySelectorAll('*').forEach(n => n.remove());
        previewLoad(district);
        loadDistrict(district);
    })
});

window.addEventListener('resize', () => {
    if (zoomed){
        this.zoom = false, zoomed = false;
        factBox.classList.remove('factZoom');
        factBox.style.opacity = 0; 
        blurry.classList.remove('blurryOn');
    }
    town.querySelectorAll('*').forEach(n => n.remove());
    loadDistrict(currentDistrict)
});

document.body.onkeyup = (e) => {
    if(e.keyCode === 188){
        if (preview.style.visibility === 'visible'){
            preview.style.visibility = 'hidden'
            return;
        };
        preview.style.visibility = 'visible';
    }
}
//preview.style.visibility = 'visible';