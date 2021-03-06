const { override } = require('customize-cra');

const findWebpackPlugin = (plugins, pluginName) =>
  plugins.find(plugin => plugin.constructor.name === pluginName);

const overrideProcessEnv = value => config => {
  const fs = require('fs')
  console.log('Before process.env.BRANCH', process.env.BRANCH);
  fs.writeFileSync('./.env', `SOCKET_URL=${process.env.SOCKET_URL}\nBRANCH=${process.env.BRANCH}`);
    //   require('dotenv').config();  
  const Dotenv = require('dotenv-webpack');
  const dotenv = new Dotenv();
  console.log('After process.env.BRANCH', process.env.BRANCH);
  const definitions = dotenv.definitions;
  const newProcessEnv= Object.keys(definitions).reduce((acc, cur) => {
    let newObject = {};
    let newKey = cur.split('.')[2];
    newObject[newKey] = definitions[cur];
    acc = {...acc, ...newObject };
    return acc;
  }, {});

  console.log('newProcessEnv', newProcessEnv);

  //console.log('fromDotenv', fromDotenv);

  const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin');
  const processEnv = plugin.definitions['process.env'] || {};
  

  plugin.definitions['process.env'] = {
    ...processEnv,
    ...newProcessEnv,
    ...value,
  };

  return config;
};

module.exports = override(
  overrideProcessEnv({
    VERSION: JSON.stringify(require('./package.json').version),
  })
);