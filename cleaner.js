const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

let ws = fs.createWriteStream('./fixedPhotos.csv');


fs.createReadStream('./photos.csv').pipe (
  parse({
    header:true,
    delimiter: ',',
    from_line: 1,
    quote: ''
  }).on('data', (record) => {
    record[2] = record[2].replace('"', '') //record[2] without ""
    record[3] = record[3].replace('"', '') //record[3] without ""
    ws.write(`${record[0]},${record[1]},"${record[2]}","${record[3]}"`)
  }).on('end', ()=> {
    console.log('finished')
  })
)