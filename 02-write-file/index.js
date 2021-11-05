const path = require('path');
const fs = require('fs');

const filePath = path.resolve('./02-write-file/text.txt');
const inStream = process.stdin;
const outStream = fs.createWriteStream(filePath);


function finishProcess(outStream) {
  console.log('Thank you, bye!');
  outStream.close();
  process.exit();
}


inStream.addListener('data', data => {
  if (data.toString().trim() === 'exit') {
    finishProcess(outStream);
  }
  outStream.write(data);
});

process.addListener('SIGINT', () => {
  finishProcess(outStream);
});


console.log('Enter text to write into file (multiline; write \'exit\' to finish):');
