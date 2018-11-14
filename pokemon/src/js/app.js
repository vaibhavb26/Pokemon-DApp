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
		  return App.check();

	});
  },

  render: async function() {
	var loader = $("#loader");
	var content = $("#content");
	var show1 = $("#show1");
	var show2 = $("#show2");
	var show3 = $("#show3");
	loader.show();
	content.hide();
	show1.hide();
	show2.hide();
	show3.hide();


	try{
		  var inst  = await  App.contracts.PokemonDApp.deployed();
		
			await $("#register").hide();
			$("#idpok").empty();
			$("#idpok1").empty();
			$("#idpok2").empty();
			var p = await inst.getOwnCount({from:App.account});
			for(var i=0;i<p;i++){
				var pokemon = await inst.getOwnPok(i,{from:App.account});
				
				var id = pokemon[0];
				var name = pokemon[2];
				var level = pokemon[1];
				var temp = "<div class = 'card' ><img src= /images/"  + id + level + ".jpeg alt="+id+level+" style='width:40%'><h2>" + name + "</h2><p>Level:" + level + "</p><p><button onclick=App.trade("+id+")>Trade</button></p><p><input type='text' size='25' ' id ='cost"+id+"'></p></div>";
				$("#idpok").append(temp);
  				
			}

			var q = await inst.getPokemonCount();
			for(i=1;i<=q;i++)
			{
				var val=1;
				for(j = 0; j<p;j++)
				{
					var pokemon = await inst.getOwnPok(j,{from:App.account});
					var id = pokemon[0];
					if(id==i)
					{
						val=0;
						break;
					}
				}
				var s = Math.floor(Math.random() * 100);

				if(val && s%2==1 )
				{
					var pokemon = await inst.getPok(i,{from:App.account});
					var id = pokemon[0];
					var name = pokemon[2];
					var level = pokemon[1];
					var temp = "<div class = 'card' ><img src= /images/"  + id + level + ".jpeg alt="+id+level+" style='width:40%'><h2>" + name + "</h2><p>Level:" + level + "</p><p><button onclick=App.catching("+id+")>Catch</button></p></div>";
					$("#idpok1").append(temp);				
				}
			}

			var r= await inst.getPokTradeCount();
			for(var i=0;i<r;i++)
			{
				var pokemon = await inst.getPokTrade(i);
				var id = pokemon[0];
				var name = pokemon[2];
				var level = pokemon[1];
				var cost  = pokemon[3];
				var temp = "<div class = 'card' ><img src= /images/"  + id + level + ".jpeg alt="+id+level+" style='width:40%'><h2>" + name + "</h2><p>Level:" + level + "</p><p><h2>price: "+cost+"</h2></p><p><button onclick=App.buy("+i+")>Buy</button></p></div>";
				$("#idpok2").append(temp);					
			}
			
		  
		// }
		loader.hide();
		content.show();
		show1.show();
		show2.show();
		show3.show();



	}
	catch(err){
	  console.log(err);
	}
  },

  catching: async function(i){
  	console.log("clicked");
	var inst = await App.contracts.PokemonDApp.deployed();
	try{
	  await inst.catching(i,{from:App.account});
	  alert('Successfully catched');
	  return App.render();
	}
	catch(err){
		console.log(err);
		alert('Not able to catch');
		return App.render();
		// return App.render();
		} 
	},
  

  trade: async function(i){
  		console.log('clicked');
  		var inst = await App.contracts.PokemonDApp.deployed();
  		try{

  			var cost = $("#cost"+i).val();
  			console.log(cost);
  			await inst.trade(i,cost,{from:App.account});
	  		alert('Successfully traded');
	  		return App.render();
  		}		

		catch(err){
			console.log(err);
			alert('Not able to trade');
			return App.render();
		// return App.render();
		} 				
  },
  buy: async function(i){
  		console.log('clicked');
  		var inst = await App.contracts.PokemonDApp.deployed();
  		try{
  			await inst.buy(i,{from:App.account});
	  		alert('Successfully bought');
	  		return App.render();
  		}		

		catch(err){
			console.log(err);
			alert('Not able to buy');
			return App.render();
		// return App.render();
		}  
	},
  register: async function() {
	console.log('clicked');
	var loader = $("#loader");
	var content = $("#content");
	loader.show();
	content.hide();
	var inst = await App.contracts.PokemonDApp.deployed();
	try{
	  await inst.register({from:App.account,value: web3.toWei(0.0000000000000001,'ether')});
	  alert('Successfully registered');
	  return App.render();
	}
	catch(err){
		console.log(err);
		alert('Insufficient funds');
		return App.check();
		// return App.render();
		} 
	},
	
	wallet: async function(){
		console.log('clicked');
		try{

		var inst = await App.contracts.PokemonDApp.deployed();
		console.log('clicked');
		var p  =await inst.getmoney({from:App.account});
	  	console.log(p);
	  	alert("Balance:"+p);

	  	return App.render();
		}
		catch(err){
			alert('No pending returns');
			return App.render();
		}
	},
  check: async function(){
	var loader = $("#loader");
	var content = $("#content");
	var show1 = $("#show1");
	var show2 = $("#show2");
	var show3 = $("#show3");
	loader.show();
	content.hide();
	show1.hide();
	show2.hide();
	show3.hide();

	content.hide();
	await web3.eth.getCoinbase(function(err, account) {
	  if(err === null) {
		App.account = account;
		acc = account;
		$("#accountAddress").html("Your Account: " + account);
	  }
	});
	try{
		var inst = await App.contracts.PokemonDApp.deployed();
		var p = 1;
		console.log(p);
		var p = await inst.getregist({from : App.account});
		console.log(p);
		if(p===true)
			return App.render();
		else
		{
		  content.show();
		  loader.hide();
		  show1.hide();
			show2.hide();
			show3.hide();


		}
	}
	catch(err){
		console.log(err);
	}
  }

};




$(function() {
  $(window).load(function() {
	App.init();
  });
});
