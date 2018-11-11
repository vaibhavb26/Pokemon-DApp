var PokemonDApp = artifacts.require("./PokemonDApp.sol");

module.exports = function(deployer) {
  deployer.deploy(PokemonDApp);
};