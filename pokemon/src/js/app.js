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

  render: function() {
    var inst;
    $("#loader").hide();
    $("#content").show();
    // loader.hide();
    // content.show();
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $("accountAddress").html("Your Account: " + account);
      }
    });
    App.contracts.PokemonDApp.deployed().then(function(instance) {
      inst = instance;
      return inst.pokemonCount();
    }).then(function(pokemonCount) {
      var all_pokemons = $("#all_pokemons");
      all_pokemons.empty();

      for(var i = 1; i <= pokemonCount; i++) {
        inst.pokemons(i).then(function(pokemon) {
          var id = pokemon[0];
          var name = pokemon[1];
          var level = pokemon[2];

          var temp = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + level + "</td></tr>";
          all_pokemons.append(temp);
          console.log(name);
        });
      }
      $("#loader").hide();
      $("#content").show();
      // loader.hide();
      // content.show();
    }).catch(function(error) {
      console.warn(error);
    });

  }
  // bindEvents: function() {
  //   $(document).on('click', '.btn-adopt', App.handleAdopt);
  // },

  // markAdopted: function(adopters, account) {
  //   /*
  //    * Replace me...
  //    */
  // },

  // handleAdopt: function(event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   /*
  //    * Replace me...
  //    */
  // }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
