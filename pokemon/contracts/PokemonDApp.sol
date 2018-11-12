pragma solidity ^0.4.24;

contract PokemonDApp {
    struct Pokemon {
        uint id;
        string name;
        uint level;
    }
    struct owned_pokemons {
        uint[] id;
    }
    mapping(uint => Pokemon) public pokemons;
    mapping(address => owned_pokemons) players;
    uint public pokemonCount = 0;
    function addPokemon(string _name) private {
        pokemonCount ++;
        pokemons[pokemonCount] = Pokemon(pokemonCount, _name, 1);
        
    }
    constructor() public {
        addPokemon("Pikachu");
        addPokemon("Bulbasaur");
    }
    function getArrayLength() public view returns(uint) {
        return players[msg.sender].id.length;
    }
    function catchPokemon(uint _id) public {
        uint len = players[msg.sender].id.length;
        bool flag = false;
        for(uint i = 0; i < len; i++) {
            if(players[msg.sender].id[i] == _id) {
                flag = true;
                break;
            }
        }
        if(flag == false) {
            players[msg.sender].id.push(_id);
        }
    }
}