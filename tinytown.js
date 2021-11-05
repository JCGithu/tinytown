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

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

let onMobile = window.mobileAndTabletCheck();

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
        this.col1 = tinycolor(houseData.col1).toHexString() || 'b38046';
        this.col2 = tinycolor(houseData.col2).toHexString() || 'faf28a';
        this.col3 = tinycolor(houseData.col1).analogous() || tinycolor('b38046').analogous();
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
    
        if (onMobile){
            this.house = document.createElement('embed');
            this.house.src = `./houseData/images/${this.img}`;
        } else {
            this.house = document.createElement('img');
            this.house.src = `./houseData/images/${this.img}`;
        }
        this.house.classList.add('townItem');
        Object.assign(this.house.style, this.defaultStyle);

        if (this.crop){
            readTextFile(`./houseData/images/${this.img}`, (text) => {
                let findings = text.match(/(?<=viewBox\=\"0.0.)([\d\.\s]+)/g)[0].split(' ');
                this.house.style.width = `${(this.scale * (findings[0]/findings[1])) * gridW}px`;
                this.defaultStyle.width = this.house.style.width;
            })
        }
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
        if (!this.fire) this.fireGen();
        document.body.onkeyup = (e) => {
            if(e.keyCode == 32){
                this.fire.style.visibility = 'visible';
                if (this.fire.style.transform === 'scale(0)') {
                    console.log('change');
                    this.fire.style.transform = `scale(1)`;
                    return;
                }
                this.fire.style.transform = `scale(0)`;
            }
        }
    }

    fireGen(){
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
        console.log('ZOOM!');
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
            input.init();
            input.house.addEventListener('mouseenter', (event) => input.hover(event));
            input.house.addEventListener('mouseleave', (event) => input.unhover(event));
            input.house.addEventListener('click', (event) => input.click(event));
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