define(['connectfour/move', 'connectfour/gamepiece'], function(move, gamepiece){
	
	/*
     * RULES ENGINE for GAME
     */
    function RulesEngine(){
		
    }
	
	var checkWinner = function(oModel, oPlayer) {

            //If this is a new game with no moves applied, there cannot be a winner yet
			if(oModel.getLastMovePlayed() == undefined){
				//Return
                //1. Boolean for whether or not there was a winner
                //2. Array of gamePieces that made the winning play(s)
                //3. The score accumulated for the round
                return [false, null, null];
			}

            //Consecutive pieces represents the number of same player pieces in a row (including the last piece played)
			var oGameBoard = oModel.getGameBoard();
			var aPosition = oModel.getLastPosition;
			
			//Set the player for whom to check for a winner 
			oPlayer = (oPlayer == undefined)? oModel.getCurrentPlayer() : oPlayer;
			var nPlayerId = oPlayer.getId();
						
            var consecutivePieces;
            var counter;
            var bCheckingRight;
            var bCheckingLeft;
            var roundScore = 0;
            var tempGamePieces = [];
            var winningGamePieces = [];
            var x = oModel.getLastMovePlayed().getColumn();
            var y = oModel.getLastMovePlayed().getRow();

            /*
             * Vertical
             * Check the vertical up/down direction for 4 consecutive pieces from the same player
             * The last piece played in on the top so it's only necessary to search below it
             * Include your last played piece as 1 consecutive, now need to find 3 more to complete 4 in a row
             */
            consecutivePieces = 1;
            for (var i = (y - 1); i >= 0; i--) {
                if ((oGameBoard[x][i]).getPlayerId() == nPlayerId) {
                    consecutivePieces++;
                    tempGamePieces.push(oGameBoard[x][i]);
                    if (consecutivePieces >= 4) {
                        /*alert("Winner!");*/
                        roundScore += 1;
                        //Add your current gamePiece to the set of all winning gamePieces
                        winningGamePieces = winningGamePieces.concat([oGameBoard[x][y]]);
                        //Add all the other ships that connect with it to make 4 in a row
                        winningGamePieces = winningGamePieces.concat(tempGamePieces);
                        break;
                    }
                } else {
                    break;
                }
            }

            /*
             * Diagonal (top-right/bottom-left)
             * Check diagonal direction top-right/bottom-left
             * Include your last played piece as 1 consecutive, now need to find 3 more to complete 4 in a row
             * Reset temp pieces so they can be filled with potential winning pieces
             */
            consecutivePieces = 1;
            tempGamePieces = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {
                
                if (bCheckingRight) {
                    //Make sure the index exists as an occupied space on the board in order to check it
                    if ((x + counter < nGameDimensionX) && (y + counter < oGameBoard[x + counter].length)) {
                        if (oGameBoard[x + counter][y + counter].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x + counter][y + counter]);
                        }
                        else {
                            bCheckingRight = false;
                        }
                    }
                    else {
                        bCheckingRight = false;
                    }
                }
                if (bCheckingLeft) {
                    if ((x - counter >= 0) && (y - counter >= 0) && (y - counter < oGameBoard[x - counter].length)) {
                        if (oGameBoard[x - counter][y - counter].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x - counter][y - counter]);
                        }
                        else {
                            bCheckingLeft = false;
                        }
                    }
                    else {
                        bCheckingLeft = false;
                    }
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Diagonal!");*/
                    roundScore += 1;
                    winningGamePieces = winningGamePieces.concat([oGameBoard[x][y]]);
                    winningGamePieces = winningGamePieces.concat(tempGamePieces);
                    break;
                }
            }

            /*
             * Diagonal (bottom-right/top-left)
             */
            consecutivePieces = 1;
            tempGamePieces = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {
                
                if (bCheckingRight) {
                    //Make sure the index exists as an occupied space on the board in order to check it
                    if ((x + counter < nGameDimensionX) && (y - counter >= 0) && (y - counter < oGameBoard[x + counter].length)) {
                        if (oGameBoard[x + counter][y - counter].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x + counter][y - counter]);
                        }
                        else {
                            bCheckingRight = false;
                        }
                    }
                    else {
                        bCheckingRight = false;
                    }
                }
                if (bCheckingLeft) {
                    if ((x - counter >= 0) && (y + counter < oGameBoard[x - counter].length)) {
                        if (oGameBoard[x - counter][y + counter].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x - counter][y + counter]);
                        }
                        else {
                            bCheckingLeft = false;
                        }
                    }
                    else {
                        bCheckingLeft = false;
                    }
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Diagonal!");*/
                    roundScore += 1;
                    winningGamePieces = winningGamePieces.concat([oGameBoard[x][y]]);
                    winningGamePieces = winningGamePieces.concat(tempGamePieces);
                    break;
                }
            }

            /*
             * Horizontal (right/left)
             */
            consecutivePieces = 1;
            tempGamePieces = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {
                
                if (bCheckingRight) {
                    //Make sure the index exists as an occupied space on the board in order to check it
                    if ((x + counter < nGameDimensionX) && (y < oGameBoard[x + counter].length)) {
                        if (oGameBoard[x + counter][y].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x + counter][y]);
                        }
                        else {
                            bCheckingRight = false;
                        }
                    }
                    else {
                        bCheckingRight = false;
                    }
                }
                if (bCheckingLeft) {
                    if ((x - counter >= 0) && (y < oGameBoard[x - counter].length)) {
                        if (oGameBoard[x - counter][y].getPlayerId() == nPlayerId) {
                            consecutivePieces++;
                            tempGamePieces.push(oGameBoard[x - counter][y]);
                        }
                        else {
                            bCheckingLeft = false;
                        }
                    }
                    else {
                        bCheckingLeft = false;
                    }
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Horizontal!");*/
                    roundScore += 1;
                    winningGamePieces = winningGamePieces.concat([oGameBoard[x][y]]);
                    winningGamePieces = winningGamePieces.concat(tempGamePieces);
                    break;
                }
            }

            //Return winner information:
            //1. Boolean for whether or not there was a winner
            //2. Array of gamePieces that made the winning play(s)
            //3. The score accumulated for the round
            if (roundScore == 0) {
                //There was no win
                return [false, null, null];
            } else {
                //There was a win
                return [true, winningGamePieces, roundScore];
            }
        }
		
	
    var getNextPlayer = function(oGameModel){
		//Next Player (this is a two player game which simply alternates players every turn)
		var oPlayers = oGameModel.getPlayers();
            if (oGameModel.getCurrentPlayer() == oPlayers[0]) {
                return oPlayers[1];
            }
            else {
                return oPlayers[0];
            }
	}	
	
	var switchPlayers = function(oGameModel, oGameViewer){
		//Get the next player according to the rules engine
		var oNextPlayer = getNextPlayer(oGameModel);
		
		//Update the Model
		oGameModel.setCurrentPlayer(oNextPlayer);
		
		//Update the Viewer
		oGameViewer.updateScoreBoard();
	}	
	
	var isColumnFilled = function(oGameModel, nColumnId){
		var nStackSize = oGameModel.getGameBoard()[nColumnId].length;
        if (nStackSize == nGameDimensionY) {
			//The game column is already filled to it's maximum dimension, no new gamepieces may be placed there.
			return true;
		}else{
			return false;
		}
	} 
	
	var getValidMove = function(oGameModel, nColumnId){
		var nStackSize = oGameModel.getGameBoard()[nColumnId].length;
        if (nStackSize == nGameDimensionY) {
			//The game column is already filled to it's maximum dimension, no new gamepieces may be placed there.
			return null;
		}else{
			return new move.Move(nColumnId, nStackSize);
		}
	}
	
	var getValidMoves = function(oGameModel){
		var aValidMoves = [];
		var aGameBoard = oGameModel.getGameBoard();
		//For each column in the game board, check if there is a valid move
		for(var i=0; i<aGameBoard.length; i++){
			
			var oMove = getValidMove(oGameModel, i);
			if(oMove != null){
				aValidMoves.push(oMove);
			}
		}
		
		//Return valid moves, or if none weree found return null
		if(aValidMoves.length > 0){
			return aValidMoves;
		}else{
			return null;
		}
	}
	
	var applyMoveToModel = function(oGameModel, oMove){
		
		var oNewModel = oGameModel.clone();
		oNewModel.updateModelStateFromNewMove(oMove, new gamepiece.GamePiece(oGameModel.getCurrentPlayer().getId(), null, null, null));
		oNewModel.setCurrentPlayer(getNextPlayer(oNewModel));
		return oNewModel;
		
	}
	
	var rulesengine = {
		RulesEngine: RulesEngine,
		checkWinner: checkWinner,
		getNextPlayer: getNextPlayer,
		switchPlayers: switchPlayers,
		isColumnFilled: isColumnFilled,
		getValidMove: getValidMove,
		getValidMoves: getValidMoves,
		applyMoveToModel: applyMoveToModel
	}
	return rulesengine;

});