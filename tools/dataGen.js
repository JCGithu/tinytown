let num = 100
let print = '';

while (num < 126){
    print = print + `"Unnamed ${num}": {
        "col1": "f6e292",
        "col2": "fdb3a3",
        "left": 15,
        "y": 8,
        "z": 1,
        "img": "unnamed_${num}.svg",
        "title": "TBC",
        "owner": "TBC",
        "notes": "",
        "scale": 1.8,
        "data": true
    },`
    num++;
}
console.log(print);