function getCocktails(){

	var cocktailsArray = [];
	
	cocktailsArray.push({
	price: "$11",
	name: "Manhattan",
	description: "rye whisky, sweet vermouth, bitters"
	});
	
	cocktailsArray.push({
	price: "$9",
	name: "Dark & Stormy",
	description: "black rum, ginger beer, lime"
	});
	
	cocktailsArray.push({
	price: "$11",
	name: "Old Cuban",
	description: "aged rum, lime juice, bitters, champagne"
	});
	
	cocktailsArray.push({
	price: "$11",
	name: "Negroni",
	description: "gin, vermouth rosso, campari"
	});
	
	cocktailsArray.push({
	price: "$9",
	name: "Bloody Mary",
	description: "tomato juice, vodka, tabasco, bacon bits"
	});
	
	cocktailsArray.push({
	price: "$12",
	name: "Green & Amber",
	description: "vodka, single-malt scotch, green tea"
	});
	
	cocktailsArray.push({
	price: "$9",
	name: "White Russian",
	description: "vodka, tia maria, heavy cream"
	});

    return cocktailsArray;
}

function getWine(){

	var wineArray = [];
	
	wineArray.push({
	price: "$12",
	name: "Sauvignon Blanc",
	description: "cloudy bay, new zealand, 2012"
	});
	
	wineArray.push({
	price: "$13",
	name: "Pinot Grigio",
	description: "corte della torre, veneto, 2012"
	});
	
	wineArray.push({
	price: "$13",
	name: "Chardonnay",
	description: "gavilan, monterey, 2012"
	});
	
	wineArray.push({
	price: "$14",
	name: "Pinot Noir",
	description: "heron, napa, 2011"
	});
	
	wineArray.push({
	price: "$12",
	name: "Cabernet Sauvignon",
	description: "slingshot, napa, 2010"
	});
	
	wineArray.push({
	price: "$22",
	name: "Pianrosso",
	description: "brunello di montacino, toscana, 2003"
	});
	
	wineArray.push({
	price: "$14",
	name: "Prosecco",
	description: "bortolotti, brut, veneto, 2010"
	});

	
    return wineArray;
}

function getBeer(){

	var beerArray = [];
	
	beerArray.push({
	price: "$7",
	name: "Lagunitas",
	description: "ipa, california"
	});
	
	beerArray.push({
	price: "$8",
	name: "21st Amendment",
	description: "back in black ipa, san francisco"
	});
	
	beerArray.push({
	price: "$8",
	name: "Breakside",
	description: "wanderlust ipa, oregon"
	});
	
	beerArray.push({
	price: "$11",
	name: "Hill Farmstead",
	description: "edward apa, vermont"
	});
	
	beerArray.push({
	price: "$15",
	name: "Alchemist",
	description: "heady topper, vermont"
	});
	
	beerArray.push({
	price: "$8",
	name: "Hofbrau",
	description: "dunkel, munich"
	});
	
	beerArray.push({
	price: "$12",
	name: "Delirium Tremens",
	description: "golden ale, belgium"
	});
	

    return beerArray;
}