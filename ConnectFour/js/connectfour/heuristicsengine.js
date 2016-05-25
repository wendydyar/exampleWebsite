define(['connectfour/rulesengine'], function(rulesengine){
	
	function HeuristicsEngine(){
		//constructor
	}
	
	
	var getWinHeuristic = function(oModel, nDesiredSearchDepth, nDepth){
		
		//First, check if there is a winner. This will return the highest heuristic.
		var nHeuristic = null;
		var nHeuristicConstant = 10000;
        var oOpponent = oModel.getCurrentPlayer();
        var oPlayerOfLastMove = (oModel.getPlayers()[0] == oOpponent) ? oModel.getPlayers()[1] : oModel.getPlayers()[0];
        var bModelHasWinner = rulesengine.checkWinner(oModel, oPlayerOfLastMove)[0];
		
        if (bModelHasWinner){    
            if (oPlayerOfLastMove == oModel.getPlayers()[0]) {
                //This player is the minimizer.
                //For this player, a good heuristic means getting a highly negative number.
				//nHeuristicConstant represents the heuristic value assigned to a win. 
				//Weigh the value of the winning heuristic by search depth.
			    //This value winning earlier in the game more strongly than winning later in the game.
				if((nDepth != undefined) && (nDesiredSearchDepth != undefined)){
					nHeuristic = -nHeuristicConstant * Math.round((1 - nDepth/(nDesiredSearchDepth+1))*100)/100;
				}else{
					nHeuristic = -nHeuristicConstant;
				}
            }
            else {
                //This player is the maximizer.
                //For this player, a good heuristic means getting a highly positive number.
                if((nDepth != undefined) && (nDesiredSearchDepth != undefined)){
					//note: nDesiredSearchDepth has a +1 added to it because otherwise when you reach the final search depth of nDepth=nDesiredSearchDepth
					//the factor becomes 1 - nDepth/nDesiredSearchDepth = 1 - 1 = 0 and the heuristic result becomes 0, as opposed to having a high win heuristic
					nHeuristic = nHeuristicConstant * Math.round((1 - nDepth/(nDesiredSearchDepth+1))*100)/100;
				}else{
					nHeuristic = nHeuristicConstant;
				}
            }
        }
		return nHeuristic;
	}
	
	var calculateHeuristicValue = function(oModel, nDesiredSearchDepth, nDepth){
		
		//Check Winner
		//Check the model for a win. If it represents a win, return heuristic results. 
		var nWinHeuristic = getWinHeuristic(oModel, nDesiredSearchDepth, nDepth);
		if(nWinHeuristic != null){
			return nWinHeuristic;
		}
		
		//Winner was not found.
		//Continue with heuristic calculations for the model.
		var nHeuristic = calculateHeuristicUsingSequences(oModel, nDesiredSearchDepth, nDepth);
		return nHeuristic;
	}
	
	var calculateHeuristicUsingSequences = function(oModel, nDesiredSearchDepth, nDepth){
		
		var nHeuristic = null;
		var oSequences = null;
	
		//Create Sequences
		//Sequences are windows of 4 grouped items across the entire board, starting from a leading edge
		//Directions: left-to-right, top-to-bottom, bottomleft-to-topright, bottomright-to-topleft
		oSequences = createSequences(oModel);
		
	    //Process Sequences
		//Sort by sequences that have the most number of gamepieces in it. 
		//Remove sequences that use the same empty spaces.
		oSequences = processSequences(oModel, oSequences);
		
		//Categorize Sequences
		//4-in-a-row, 3-in-a-row, 2-in-a-row
		//The first player is the minimizer and the second player is the maximizer.
		var nFirstPlayerId = oModel.getPlayers()[0].getId();
		var nSecondPlayerId = oModel.getPlayers()[1].getId();
		
        //Continue and check the gamepiece sequences of 4 in a row, 3 in a row, and 2 in a row		
        var oFourInARow = {};
        oFourInARow[nFirstPlayerId] = 0;
        oFourInARow[nSecondPlayerId] = 0;
        
        var oThreeInARow = {};
        oThreeInARow[nFirstPlayerId] = 0;
        oThreeInARow[nSecondPlayerId] = 0;
        
        var oTwoInARow = {};
        oTwoInARow[nFirstPlayerId] = 0;
        oTwoInARow[nSecondPlayerId] = 0;
        
        for (var i = 0; i < 2; i++) {
            var nPlayerId = oModel.getPlayers()[i].getId();
            for (var j = 0; j < oSequences[nPlayerId].length; j++) {
                //For each sequence in the sequences that this player has
                if (oSequences[nPlayerId][j].aFilledSpaces.length == 2) {
                    oTwoInARow[nPlayerId]++;
                }
                else {
                    if (oSequences[nPlayerId][j].aFilledSpaces.length == 3) {
                        oThreeInARow[nPlayerId]++;
                    }
                    else {
                        if (oSequences[nPlayerId][j].aFilledSpaces.length == 4) {
                            oFourInARow[nPlayerId]++;
                        }
                    }
                }
            }
        }
        
		//Calculate the heuristic by weighing the sequences
        nHeuristic = 1000 * (oFourInARow[nSecondPlayerId] - oFourInARow[nFirstPlayerId]) + 250 * (oThreeInARow[nSecondPlayerId] - oThreeInARow[nFirstPlayerId]) + 50 * (oTwoInARow[nSecondPlayerId] - oTwoInARow[nFirstPlayerId]);
        
        //Correction Factor 
		//In the early stages of the game, this corrections factor is used to give higher importance to locations
		//near the center of the gameboard. This guides the minimax algorithm in the beginning of the game when many options are equivalent.
		//The correction factor is determined by giving a weight to each column (weighing the center columns highest and the edge columsn lowest)
		//and multiplying by the number of gamepieces in each column byt their respective weight.
        if (oModel.getNumberOfMovesPlayed() < 8) {
        
            //If there are only a few gamepieces on the board,use a weighting function to
            //weigh the center of the board more heavily than the edges of the board
            var oGameBoard = oModel.getGameBoard();
            var nCenter = Math.round(nGameDimensionX / 2);
            var nCorrectionFactor = {};
            nCorrectionFactor[nFirstPlayerId] = 0;
            nCorrectionFactor[nSecondPlayerId] = 0;
            for (var i = 0; i < nGameDimensionX; i++) {
                //In each row in column i, count the number of gamepieces present for each player
                var oGamePiecesInCurrentColumn = {};
                oGamePiecesInCurrentColumn[nFirstPlayerId] = 0;
                oGamePiecesInCurrentColumn[nSecondPlayerId] = 0;
                for (var j = 0; j < oGameBoard[i].length; j++) {
                    if (oGameBoard[i][j].getPlayerId() == nFirstPlayerId) {
                        oGamePiecesInCurrentColumn[nFirstPlayerId]++;
                    }
                    else {
                        oGamePiecesInCurrentColumn[nSecondPlayerId]++;
                    }
                }
                //Calculate a weight based on the column number.
                //Columns closer to the center of the board yields a more favorable heuristic
                var nDistanceFromCenter = Math.abs((i + 1) - nCenter);
                var nWeight = 4 - nDistanceFromCenter;
                nCorrectionFactor[nFirstPlayerId] += nWeight * oGamePiecesInCurrentColumn[nFirstPlayerId];
                nCorrectionFactor[nSecondPlayerId] += nWeight * oGamePiecesInCurrentColumn[nSecondPlayerId];
            }
            nHeuristic += Math.round(((nCorrectionFactor[nSecondPlayerId] - nCorrectionFactor[nFirstPlayerId]) / (nCorrectionFactor[nSecondPlayerId] + nCorrectionFactor[nFirstPlayerId])) * 100) / 100;
        }
		return nHeuristic;
	}

    var countEmptySpaces = function(oItem){
        return oItem.aEmptySpaces.length;
    }
	
	var createSequences = function(oModel){
		
		var oValidSequence;
		var oValidSequences = {};
		for(var i=0; i<oModel.getPlayers().length; i++){
			var nPlayerId = oModel.getPlayers()[i].getId();
			oValidSequences[nPlayerId] = [];
		}
		
		var sStringRepresentation = "";
		var aGameBoard = oModel.getGameBoard();
		
		//First, search the gameboard in all 4 directions starting from leading edges
	    //Convention: (i,j) is (column, row)
	
		//(Direction 1: Sweep left-to-right from row 0 to row n) 
		//Initialize String Representation of a Sequence (left-to-right starting from the bottom of the board to the top)
		//For rows bottom to top (j is the row number)
		for(var j=0; j<nGameDimensionY; j++){
			//Starting String
		    sStringRepresentation = createString(aGameBoard[0][j]) + createString(aGameBoard[1][j]) + createString(aGameBoard[2][j]) + createString(aGameBoard[3][j]);
	        updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, 0, j, 1, 0);
					
			//Sweep left-to-right, while updating the sequence
			for(var i=1; i<(nGameDimensionX-3); i++){
				//Keep the last 3 characters in the string representation and add a 4th to sweep through all the sequences of 4.
				sStringRepresentation = sStringRepresentation.slice(-3) + createString(aGameBoard[i+3][j]);
				updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, i, j, 1, 0);
			}
		}
		
		
		//(Direction 2: Sweep bottom to top for column 0 to column n)
		//For columns 0 to n (i is column number)
		for(var i=0; i<nGameDimensionX; i++){
			//Starting String
		    sStringRepresentation = createString(aGameBoard[i][0]) + createString(aGameBoard[i][1]) + createString(aGameBoard[i][2]) + createString(aGameBoard[i][3]);
	        updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, i, 0, 0, 1);
			
			//Sweep bottom-to-top, while updating the sequence
			for(var j=1; j<(nGameDimensionY-3); j++){
				//Keep the last 3 characters in the string representation and add a 4th to sweep through all the sequences of 4.
				sStringRepresentation = sStringRepresentation.slice(-3) + createString(aGameBoard[i][j+3]);
				updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, i, j, 0, 1);
			}
		}
		
		
		//(Direction 3: Diagonal bottom-left to top-right)
		//3a: Left Leading Edge of the gameboard
		//Start at the left leading edge of the board, for starting points from bottom to top along that edge, sweep diagonally to the top-right
		for(var j=0; j<(nGameDimensionY-3); j++){
			//Outer loop sweeps bottom to top.
			//Sweep left-to-right, while updating the sequence
			for(var i=1; i<(nGameDimensionX-3); i++){
				//Final position of the search window
				var xf = i+3;
				var yf = j+3;
				//Confirm that the end of the search window for the diagonal is still within the bounds of the game
				if((xf < nGameDimensionX) && (yf < nGameDimensionY)){
					sStringRepresentation = createString(aGameBoard[i][j]) + createString(aGameBoard[i+1][j+1]) + createString(aGameBoard[i+2][j+2]) + createString(aGameBoard[i+3][j+3]);
				    updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, i, j, 1, 1);
				}
			}
		}
		
		//(Direction 4: Diagonal top-left to bottom-right)
		//4a: Left Leading Edge of the gameboard
		//Start at the left leading edge of the board, for starting points from bottom to top along that edge, sweep diagonally to the bottom-right
		for(var j=3; j<(nGameDimensionY); j++){			
			//Outer loop sweeps bottom to top.
			//Sweep left-to-right, while updating the sequence
			for(var i=1; i<(nGameDimensionX-3); i++){
				//Final position of the search window
				var xf = i+3;
				var yf = j-3;
				//Confirm that the end of the search window for the diagonal is still within the bounds of the game
				if((xf < nGameDimensionX) && (yf > 0)){
					sStringRepresentation = createString(aGameBoard[i][j]) + createString(aGameBoard[i+1][j-1]) + createString(aGameBoard[i+2][j-2]) + createString(aGameBoard[i+3][j-3]);
				    updateValidSequences(aGameBoard, oValidSequences, sStringRepresentation, i, j, 1, -1);
				}
			}
		}
	    
			
		return oValidSequences;
	}
	
	
	var updateValidSequences = function(aGameBoard, oValidSequences, sStringRepresentation, x0, y0, dx, dy){
		
		//First, convert the string to a sequence
		var aFilledSpaces = [];
		var aEmptySpaces = [];
		
		var bSamePlayer = true;
		var bPlayerFoundInSequence = false;
		var nLastPlayerId;
		 
		for(var i=0; i<sStringRepresentation.length; i++){
			if(sStringRepresentation.charAt(i) == 'x'){
				//This character represents an empty space on the board
				aEmptySpaces.push((x0+i*dx).toString() + (y0+i*dy).toString());
				
			}else{
				//This character in the string represents that a player is present at that location
				if(!bPlayerFoundInSequence){
					//This is the first player encoutnered in the sequence
					bPlayerFoundInSequence = true;
					nLastPlayerId = sStringRepresentation[i];
					aFilledSpaces.push(aGameBoard[x0+i*dx][y0+i*dy]);
				}else{
					//There is a player in the sequence already. Check if this playeris the same.
					if(sStringRepresentation[i] == nLastPlayerId){
						//Same player as before. Save the gamepiece at that location.
						aFilledSpaces.push(aGameBoard[x0+i*dx][y0+i*dy]);                   
					}else{
						//Different player. The sequence has mixed players. It should be discarded.
						bSamePlayer =  false;
						break;
					}
				}
			}
		}
		
		//If a valid sequence was found, add it to the array of sequences for that player
		if(bSamePlayer & (aEmptySpaces.length < 4)){
			var oValidSequence = {
				aFilledSpaces: aFilledSpaces,
			    aEmptySpaces: aEmptySpaces
		    }
			oValidSequences[nLastPlayerId].push(oValidSequence);
		}	
	}
	
	var createString = function(aGamePiece){
		if(aGamePiece){
			return aGamePiece.getPlayerId();
		}else{
		    //Otherwise, there is no gamepiece. This is an empty spot. Empty spots will be marked as "x". 
		    return "x";
		}
	}
	
	
	//Process sequences to sort and filter out duplicates
    var processSequences = function(oModel, oSequences){
		var aGameBoard = oModel.getGameBoard();
		var oPlayers = oModel.getPlayers();
		
		//Sort by number of filled positions in each sequence
		for(var i=0; i<oPlayers.length; i++){
			var nPlayerId = oPlayers[i].getId();
			oSequences[nPlayerId].sort(function(a, b){
				return countEmptySpaces(a) - countEmptySpaces(b);
			});
		}
			
		//Eliminate sequences that use the same empty spaces
		var oMapOfEmptySpaces = {};
        var hasNewEmptySpace = function(oSequence){
            for (var i = 0; i < oSequence.aEmptySpaces.length; i++) {
                if (oMapOfEmptySpaces[oSequence.aEmptySpaces[i]]) {
                    //This empty space is already in the map. It is not new. Return false.
                    return false;
                }else{
					oMapOfEmptySpaces[oSequence.aEmptySpaces[i]] = true;
				}
            }
            return true;
        }
		
		//For each player, get the player's array of sequences
		for(var i=0; i<oPlayers.length; i++){
			var nPlayerId = oPlayers[i].getId();
			var aPlayerSequences = oSequences[nPlayerId];
			
			//Filter out duplicate empty spaces
			aPlayerSequences = aPlayerSequences.filter(hasNewEmptySpace);
			oSequences[nPlayerId] = aPlayerSequences;
		}
		return oSequences;
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