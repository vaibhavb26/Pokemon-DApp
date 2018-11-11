pragma solidity ^0.4.24;

contract PokemonDApp {
    struct Pokemon {
        uint id;
        string name;
        uint level;
    }
    mapping(uint => Pokemon) public pokemons;
    uint public pokemonCount = 0;
    function addPokemon(string _name) private {
        pokemonCount ++;
        pokemons[pokemonCount] = Pokemon(pokemonCount, _name, 1);
        
    }
    constructor() public {
        addPokemon("Pikachu");
        addPokemon("Bulbasaur");
    }
}