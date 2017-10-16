'use strict';

const CodeGen = require('swagger-js-codegen').CodeGen;
const fs = require('fs');
const request = require('request');
const yamljs = require('yamljs');

const req = request.defaults({
  headers: {
    'User-Agent': 'cachet-node'
  },
  json: true
});

req('https://api.github.com/repos/MatWisz/cachet-swagger/releases/latest', (err, data, body) => {
  const version = body.name;
  req('https://raw.githubusercontent.com/MatWisz/cachet-swagger/' + version + '/swagger.yaml', (err, data, body) => {
    const swagger = yamljs.parse(body);
    const api = CodeGen.getNodeCode({ className: 'Cachet', swagger: swagger });

    fs.writeFileSync('index.js', api);
  });
});
