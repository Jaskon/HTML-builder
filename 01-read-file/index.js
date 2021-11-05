const path = require('path');
const fs = require('fs');

const filePath = path.resolve('./01-read-file/text.txt');
const stream = fs.createReadStream(filePath);

stream.addListener('data', data => process.stdout.write(data));
stream.addListener('end', () => {
  process.stdout.write('\n');
  stream.close();
});
