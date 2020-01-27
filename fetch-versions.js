const fs = require('fs');
const http = require('http');
const { promisify } = require('util');

http.get[promisify.custom] = function getAsync(options) {
  return new Promise((resolve, reject) => {
    http
      .get(options, response => {
        response.end = new Promise(resolve => response.on('end', resolve));
        resolve(response);
      })
      .on('error', reject);
  });
};

const get = promisify(http.get);

(async function main() {
  const response = await get(
    'http://registry.npmjs.org/@vaadin/vaadin-shrinkwrap'
  );
  let body = '';
  response.on('data', chunk => (body += chunk));
  await response.end;
  // console.log(body);
  fs.writeFileSync('versions.json', body);
})();
