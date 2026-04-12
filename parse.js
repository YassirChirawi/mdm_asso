const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:\\Users\\Yassir Chirawi\\Downloads\\Main_dans_la_main_FINAL.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('C:\\Users\\Yassir Chirawi\\.gemini\\antigravity\\scratch\\mdm-asso\\pdf_content.txt', data.text);
    console.log('Done extracting length: ' + data.text.length);
}).catch(console.error);
