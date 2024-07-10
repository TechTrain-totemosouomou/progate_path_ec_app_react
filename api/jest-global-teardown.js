const {teardown: teardownDevServer} = require("jest-dev-server");

module.exports = async function globalTeardown(globalConfig) {
  await teardownDevServer(globalThis.servers);
};
