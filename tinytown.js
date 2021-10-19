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

function sizeReset(){
    townContainer.style.height = `${innerHeight - menuSize.bottom}px`;
    let ratio = 1.257;
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
        this.col1 = houseData.col1 || 'b38046';
        this.col2 = houseData.col2 || 'faf28a';
        this.scale = houseData.scale || 1;
        this.data = houseData.data;
        this.crop = houseData.crop;
        this.zoom = false;
    };

    init(){
        let colourScale = tinycolor(this.col1).analogous();
        this.col1 = tinycolor(this.col1).toHexString();
        this.col2 = tinycolor(this.col2).toHexString();

        let imgDefaultStyle = {
            bottom: `${this.y * gridH}px`,
            width: `${this.scale * gridW}px`,
            height: `${this.scale * gridW}px`,
            zIndex: this.z
        }

        let factDefaultStyle = {
            opacity: 1,
            backgroundColor: this.col2
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
            factOwner.style.color = this.col2;
            factBox.style.backgroundColor = this.col2
            factOwner.style.backgroundColor = colourScale[2].toHexString();
            factNotes.style.color = this.col1;
            onScreenCheck(factBox);
        });

        img.addEventListener('mouseleave', () => {
            if(!this.data || zoomed) return;
            factBox.style.opacity = 0;
            img.style.transform = "scale(1)";
            if(!this.zoom) img.style.zIndex = this.z;
        })

        img.addEventListener('click', () => {
            if(!this.data) return;
            if(!this.zoom){
                if (zoomed) return;
                img.classList.add('zoomedImage');
                factBox.classList.add('factZoom');
                img.style.width = `${townSize.height}px`;
                img.style.height = `${townSize.height}px`;
                img.style.left = `${(townSize.width - townSize.height)/2}px`;
                this.zoom = true, zoomed = true;
                blurry.style.backgroundColor = tinycolor(this.col1).darken().toHexString();
                blurry.classList.add('blurryOn');
            } else {
                Object.assign(img.style, imgDefaultStyle);
                this.zoom = false, zoomed = false;
                img.classList.remove('zoomedImage');
                factBox.classList.remove('factZoom');
                blurry.classList.remove('blurryOn');
            }
        })
        town.appendChild(img);
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

