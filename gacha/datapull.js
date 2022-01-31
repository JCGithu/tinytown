const fs = require ('fs');

let finalData = {};

async function run(){

  let i = 1;

  let compile = await fs.readdir('./houseData/', (err, files) => {
    files.forEach(async (file) => {
      if (file.indexOf('.json') < 0) return;
      fs.readFile(`./houseData/${file}`, (err, data) => {
        let district = JSON.parse(data);
        Object.keys(district).forEach((e) =>{
          if (district[e].data) {
            finalData[e] = district[e];
            finalData[e].id = i;
            ++i;
          }
        });
        fs.writeFileSync('./gacha/finalData.json', JSON.stringify(finalData, null, 2) , 'utf-8');
      });
    });
  }); 
}

run();
