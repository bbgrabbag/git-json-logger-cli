const fs = require('fs');
const path = require('path');

fs.readdir(path.resolve(__dirname, '.git'), (err, files) => {
    console.log(files)
    fs.readFile(path.resolve(__dirname, '.git', 'description'),'utf-8', (err, file) => {
        console.log(file)
    })
})