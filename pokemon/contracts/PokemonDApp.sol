pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract Pokemon {
    struct pokemon {
        uint id;
        uint value;
        string name;
    }
    mapping (uint => pokemon) pokemons;
    uint pokemonCount = 0;
    // pokemons[0] = pokemon(0,1,"Squirtle"); 
    // pokemons[1] = pokemon(1,1,"Charmander");
    function addPokemon(string _name) private {
        pokemonCount ++;
        pokemons[pokemonCount] = pokemon(pokemonCount, 1, _name);
        
    }
    constructor() public {
        addPokemon("Pikachu");
        addPokemon("Bulbasaur");
    }
    int playerCount = 0;
    mapping (address  => pokemon[]) pokemonMap;
    mapping (int => address) playermap;
    mapping (address => bool) registered;
    function register() {
        require(registered[msg.sender]!=true,"user already registered");
        playerCount++;
        playermap[playerCount] = msg.sender;
        pokemonMap[msg.sender].push(pokemons[random(uint(2))+1]);
        registered[msg.sender] = true;
    }
    
    function getPokemons() returns(pokemon[]) {
        return pokemonMap[msg.sender];
    }
    
    function random(uint num) returns(uint) {
        return uint256(keccak256(block.timestamp, block.difficulty))%num;
    }
    
    
    
}