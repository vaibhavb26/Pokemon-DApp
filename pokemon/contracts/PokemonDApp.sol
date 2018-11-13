pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract PokemonDApp {
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
        addPokemon("Charmander");
        addPokemon("Bulbasaur");
        addPokemon("xyz");
    
    }
    int playerCount = 0;
    mapping (address  => pokemon[]) pokemonMap;
    mapping (int => address) playermap;
    mapping (address => bool) registered;
    function register() public returns(uint){
        require(registered[msg.sender]!=true,"user already registered");
        playerCount++;
        playermap[playerCount] = msg.sender;
        pokemonMap[msg.sender].push(pokemons[random(uint(3))+1]);
        registered[msg.sender] = true;
        return 1;
    }
    
    function getPokemons() public view returns(uint[]) {
        uint[] temp;
        for(uint i=0;i<pokemonMap[msg.sender].length;i++) {
            temp.push(pokemonMap[msg.sender][i].id);
        }
        //return (pokemonMap[addr].id,pokemonMap[addr].value,pokemonMap[addr].name);
        return temp;
    }
    
    function random(uint num) public view returns(uint) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%num;
    }
    
    
    
}