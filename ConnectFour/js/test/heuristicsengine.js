define([], function(){
	
	function HeuristicsEngine(){
		//constructor
	}
	
	var calculateHeuristicValue = function(oModel){
		var sName = oModel.getName();
		switch (sName) {
			case "a":
				return 7;
				break;
			case "b":
				return 7;
				break;
			case "c":
				return 2;
				break;
			case "d":
				return 7;
				break;
			case "e":
				return 8;
				break;
			case "f":
				return 7;
				break;
			case "g":
				return 3;
				break;
			case "h":
				return 8;
				break;
			case "i":
				return 2;
				break;
			case "j":
				return 8;
				break;
			case "k":
				return 7;
				break;
			case "l":
				return 3;
				break;
			case "m":
				return 9;
				break;
			case "n":
				return 9;
				break;
			case "o":
				return 8;
				break;
			case "p":
				return 2;
				break;
			case "q":
				return 4;
				break;
			default:
				return null;
		}
	}
	
	
	/**
	 * @extends {module:base/baseaifactory#HeuristicsEngineInterface}
	 */
	var heuristicsengine = {
		HeuristicsEngine: HeuristicsEngine,
		calculateHeuristicValue: calculateHeuristicValue
	}
	return heuristicsengine;
});