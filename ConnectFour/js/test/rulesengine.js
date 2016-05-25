define(['test/move', 'test/testmodel'], function(move, testmodel){
	
	var getValidMoves = function(oModel){
		var sName = oModel.getName();
		switch (sName) {
			case "a":
			    //b and c are flipped in order of addition as children. Same map but flipped! Gives same answer. 
				return [new move.Move("c"), new move.Move("b")];
				break;
			case "b":
				return [new move.Move("d"), new move.Move("e")];
				break;
			case "c":
				return [];
				break;
			case "d":
				return [new move.Move("f"), new move.Move("g")];
				break;
			case "e":
				return [new move.Move("h"), new move.Move("i")];
				break;
			case "f":
				return [new move.Move("j"), new move.Move("k")];
				break;
			case "g":
				return [new move.Move("l"), new move.Move("m")];
				break;
			case "h":
				return [new move.Move("n"), new move.Move("o")];
				break;
			case "i":
				return [new move.Move("p"), new move.Move("q")];
				break;
			case "j":
				return [];
				break;
			case "k":
				return [];
				break;
			case "l":
				return [];
				break;
			case "m":
				return [];
				break;
			case "n":
				return [];
				break;
			case "o":
				return [];
				break;
			case "p":
				return [];
				break;
			case "q":
				return [];
				break;
			default:
				return [];
		}
	}
	
	var applyMoveToModel = function(oModel, oMove){
		
		var oModelOptions = {
			sName: oMove.getId()
		}
		
		return new testmodel.TestModel(oModelOptions);
	}
	
	var rulesengine = {
		getValidMoves: getValidMoves,
		applyMoveToModel: applyMoveToModel
	}
	return rulesengine;	
});