fs = require('fs');

fs.readFile('build/asset-manifest.json', (err, data) => {
  if (err) {
    throw err;
  }

  manifest = JSON.parse(data);

  if (!fs.existsSync('dist')) { fs.mkdirSync('dist', 0o744); }

  const reader = fs.createReadStream(`build/${manifest['main.js']}`);
  const writer = fs.createWriteStream('dist/ghostbook.js');

  reader.on('error', (err) => { throw err });
  reader.on('close', () => { writer.close() });
  writer.on('error', (err) => { throw err });

  reader.pipe(writer);
});
