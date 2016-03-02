'use strict';

const fs = require('fs');
var iconv = require('iconv-lite');

const argv = process.argv.slice(2);

if (argv.length < 4) {
    console.log('usage: node fileconv.js [inputFile] [inputEncode] [outputFile] [outputEncode]');
    process.exit(0);
}

const inputfile = argv[0];
const inputencode = argv[1];
const outputfile = argv[2];
const outputencode = argv[3];

fs.readFile(inputfile, (err, data)=>{
    if (err) {
        console.error(err);
    } else {
        let str = iconv.decode(data, inputencode);
        let outStr = iconv.encode(str, outputencode);
        fs.writeFile(outputfile, outStr, (err)=>{
            if (err) {
                console.error(err);
            }
        });
    }
});
// let content = fs.readFileSync(inputfile, inputencode);
// fs.writeFileSync(outputfile, content, outputencode);
