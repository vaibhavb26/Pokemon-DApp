const PokemonDApp = artifacts.require('./PokemonDApp.sol');
const assert = require('assert');


let contractInstance


contract('PokemonDApp', (accounts)=>{

	beforeEach(async () => {
		contractInstance = await PokemonDApp.deployed()
	})
    it('Check if pokemon is getting added', async() => {     
		var cnt = await contractInstance.pokemonCount();
		assert.equal(cnt, 2, 'pokemon is not registered');
	})
	it('Check if player can catch pokemon', async() => {     
		await contractInstance.catchPokemon(1, {from: accounts[1]});
		var cnt = await contractInstance.getArrayLength({from: accounts[1]});
		assert.equal(cnt, 1, 'pokemon not catched');
		await contractInstance.catchPokemon(1, {from: accounts[1]});
		var cnt = await contractInstance.getArrayLength({from: accounts[1]});
		assert.equal(cnt, 1	, 'pokemon not catched');
	})
})