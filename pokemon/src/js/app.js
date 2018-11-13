App = {
  web3Provider: null,
  contracts: {},
  account : '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(web3.currentProvider);      
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("PokemonDApp.json", function(pokemon) {
      App.contracts.PokemonDApp = TruffleContract(pokemon);
      App.contracts.PokemonDApp.setProvider(App.web3Provider);
      return App.render();

    });
  },

  render: async function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },
  register: async function() {
    console.log('clicked');
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    var inst = await App.contracts.PokemonDApp.deployed();
    try{
      await inst.register({from:App.account});
      var pokemons = await inst.getPokemons({from:App.account});
      var all_pokemons = $("#all_pokemons");
      all_pokemons.empty();
      var name = ['Charmander','Squirtle','Bulbasaur'];
      var level = [1,2,3];
      for(var i=0;i<pokemons.length;i++) {
        var id = pokemons[i];
        console.log(id);
          var temp = "<tr><td>" + name[id] + "</td><td>" + level[id] + "</td></tr>";
          all_pokemons.append(temp);
      }
      loader.hide();
      content.show();
      alert('Successfully Registered');

    }
    catch(err) {
      console.log(err);
    }

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
