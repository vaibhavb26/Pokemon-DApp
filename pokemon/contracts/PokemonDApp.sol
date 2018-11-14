pragma solidity ^0.4.17;
// pragma experimental ABIEncoderV2;

contract PokemonDApp {
    struct pokemon {
        uint id;
        uint level;
        string name;
    }

    struct tradepok{
        uint id;
        address account;
        uint cost;
        // uint cost;        
    }
    mapping (uint => tradepok) public tradepoks;
    uint public tradepokcount;
    mapping (uint => pokemon) public pokemons;
    uint public pokemonCount ;
    // pokemons[0] = pokemon(0,1,"Squirtle"); 
    // pokemons[1] = pokemon(1,1,"Charmander");
    
    uint playerCount ;
    function addPokemon(string _name) private {
        pokemonCount ++;
        pokemons[pokemonCount] = pokemon(pokemonCount, 1, _name);
        
    }
    mapping(address => mapping (uint => uint)) ownpokemon;
    mapping(address => uint) pokecount;
    constructor() public {
        tradepokcount = 0;
        playerCount = 0;
        pokemonCount =0;
        addPokemon("Pikachu");
        addPokemon("Bulbasaur");
        addPokemon("Charmander");
        addPokemon("Squirtle");
    
    }

    mapping (address  => pokemon[]) pokemonMap;
    mapping (uint => address) playermap;
    mapping (address => bool) registered;
    mapping(address => uint) pendingReturns;
    function register() public payable {
        require(registered[msg.sender]!=true,"user already registered");
        pokemon storage p = pokemons[playerCount%4+1];
        playerCount++;
        pokecount[msg.sender]=0;
        playermap[playerCount] = msg.sender;
        ownpokemon[msg.sender][pokecount[msg.sender]] = (p.id);
        pokecount[msg.sender]++;
        registered[msg.sender] = true;
        pendingReturns[msg.sender]=msg.value;
    }

    function catching(uint i) public{
        require(registered[msg.sender]==true,"user not registered");
        pokemon storage p = pokemons[i];
        ownpokemon[msg.sender][pokecount[msg.sender]] = (p.id);
        pokecount[msg.sender]++;
    }

    function trade(uint id,uint cost) public{
        require(registered[msg.sender]==true,"user not registered");
        uint p  = pokecount[msg.sender];
        uint i = 0;
        for(i=0;i<p;i++)
        {
            if(ownpokemon[msg.sender][i]==id)
            {
                for(uint j=i;j<p-1;j++)
                {
                    ownpokemon[msg.sender][j]=ownpokemon[msg.sender][j+1];
                }
                break;
            }
        }
        delete ownpokemon[msg.sender][p-1];
        pokecount[msg.sender]--;
        tradepoks[tradepokcount] = tradepok({id:id,account:msg.sender,cost:cost}); 
        tradepokcount++;
    }

    function buy(uint t) public payable{
        require(registered[msg.sender]==true,"user not registered");
        
        uint id  = tradepoks[t].id;
        
        uint cost  = tradepoks[t].cost;
        
        require(pendingReturns[msg.sender]>=cost,"Insufficient balance");
        address addr = tradepoks[t].account;
        for(uint i=t;i<tradepokcount-1;i++)
        {
            tradepoks[i]=tradepoks[i+1];
        }
        delete tradepoks[tradepokcount-1];
        tradepokcount--;
        ownpokemon[msg.sender][pokecount[msg.sender]] = id;
        pendingReturns[msg.sender]-=cost;
        pendingReturns[addr]+=cost;
        pokecount[msg.sender]++;
    }
    function getPokTradeCount() public view returns(uint)
    {
        return tradepokcount;
    }
    function getPokTrade(uint i) public view returns(uint, uint , string,uint)
    {
        return (pokemons[tradepoks[i].id].id,pokemons[tradepoks[i].id].level,pokemons[tradepoks[i].id].name,tradepoks[i].cost);
    }

    function getPok(uint i) public view returns(uint,uint,string){
        return (pokemons[i].id,pokemons[i].level,pokemons[i].name);
    }
    function getOwnCount() public view returns(uint){
        return pokecount[msg.sender];
    }
    function getPokemonCount() public view returns (uint ){
        return pokemonCount;
    }
    function getOwnPok(uint i) public view returns(uint ,uint ,string ){
        return (pokemons[ownpokemon[msg.sender][i]].id,pokemons[ownpokemon[msg.sender][i]].level,pokemons[ownpokemon[msg.sender][i]].name);
    }  
    function getregist() public view returns (bool){
        return registered[msg.sender];
    }
    function random(uint num) returns(uint) {
        return uint256(keccak256(block.timestamp, block.difficulty))%num;
    }
    function getmoney() public view returns (uint){
        return pendingReturns[msg.sender];
    }
    
    function withdraw() 
    public
    payable
    {
        require(pendingReturns[msg.sender]>0,"No pending returns");
        uint Balance = pendingReturns[msg.sender];       
        (msg.sender).transfer(Balance);
        pendingReturns[msg.sender]=0;
    }
}