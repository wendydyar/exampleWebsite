define(['connectfour/aifactory', 'connectfour/gamemodel', 'connectfour/gameviewer', 'connectfour/rulesengine', 'connectfour/gamepiece', 'connectfour/scoreboard', 'connectfour/player', 'connectfour/move'], function(aifactory, gamemodel, gameviewer, rulesengine, gamepiece, scoreboard, player, move){


    /*
     *   CONSTANTS  -  TODO: Make these accessible in the main script
     */
    var STYLE_CLASSIC_PLAYER0 = 'url("./style/imagesCF/method-draw-yellow-border-rounded.svg")';
    var STYLE_CLASSIC_PLAYER1 = 'url("./style/imagesCF/method-draw-red-border-rounded.svg")';
    var STYLE_CLASSIC_PLAYER0_WIN = 'url("./style/imagesCF/star.svg")';
    var STYLE_CLASSIC_PLAYER1_WIN = 'url("./style/imagesCF/star.svg")';
    var NAME_PLAYER0 = "Player 1";
	var NAME_PLAYER1 = "Player 2";
	var NAME_PLAYERAI = "Computer";
	var ID_PLAYER0 = "0";
	var ID_PLAYER1 = "1";
	var ID_PLAYERAI = "2";
    
    /*
     *  GAME MANAGER
     */
    function GameManager(){
    
	    //Local Variables
		var self = this;
		var _oAIFactory;
		var _nDifficultyLevel;
        var _oGameModel;
        var _oGameViewer;
		var _oPlayer0;
        var _oPlayer1;
		
		//Create Players
		_oPlayer0 = new player.Player(NAME_PLAYER0, ID_PLAYER0, STYLE_CLASSIC_PLAYER0, STYLE_CLASSIC_PLAYER0_WIN);
		_oPlayer1 = new player.Player(NAME_PLAYER1, ID_PLAYER1, STYLE_CLASSIC_PLAYER1, STYLE_CLASSIC_PLAYER1_WIN);
		_oPlayerAI = new player.Player(NAME_PLAYERAI, ID_PLAYERAI, STYLE_CLASSIC_PLAYER1, STYLE_CLASSIC_PLAYER1_WIN);
		
        var _initializeComponents = function(oOptions){
			
			
            //Create Game Model
			var oModelOptions = {};
			
            if (oOptions) {
				//Single Player vs. Multiplayer Option
                if (oOptions.bIsSinglePlayer) {
                    //Play the AI
					//Create an AIFactory
			        _oAIFactory = new aifactory.AIFactory();
					//The AI is always the second player in the players array because it is always the maximizer
					//in the heuristicsengine.js calculations
					oModelOptions['players'] = [_oPlayer0, _oPlayerAI];
					_nDifficultyLevel = oOptions.nDifficultyLevel;  
                }
                else {
                    //Multiplayer game
                    oModelOptions['players'] = [_oPlayer0, _oPlayer1];
                }
				//StartingPlayer
				if(oOptions.bStartWithSecondPlayer){
					oModelOptions['startingPlayer'] = oModelOptions['players'][1];
				}else{
					oModelOptions['startingPlayer'] = oModelOptions['players'][0];
				}
            }
            else {
                //Default
				//Single player (play against AI)
				//AIFactory
			    _oAIFactory = new aifactory.AIFactory();
			    oModelOptions['players'] = [_oPlayer0, _oPlayerAI]; 
				//Default difficulty level (medium)
				_nDifficultyLevel = 8;
				//Starting Player
				oModelOptions['startingPlayer'] = oModelOptions['players'][0];
            }
			
			//Setup Scoreboard
			oModelOptions['scoreBoard'] = new scoreboard.ScoreBoard(oModelOptions['players'][0], oModelOptions['players'][1]);
			
			//Create the game model
            _oGameModel = new gamemodel.GameModel(oModelOptions);
            
            //Create Game Viewer
            var oViewerOptions = {
                gameModel: _oGameModel,
                handleStartNewGame: self.handleStartNewGame,
                handleStartNewMove: handleStartNewMove, 
				handleMouseMove: handleMouseMove,   
				handleEndNewMove: handleEndNewMove,
				getDifficultyLevel: getDifficultyLevel
            }
            _oGameViewer = new gameviewer.GameViewer(oViewerOptions);
			_oGameViewer.lowerShield();
			
			//Optional: If the starting player is changed to be the AI, perform the play for the AI
			if(oModelOptions['startingPlayer'] == oModelOptions['players'][1]){
				_performPlayForAI();
			}
        }
		
        this.handleStartNewGame = function(oOptions){
			//Update the Model
			_updateModelToClearGamePieces();
			//Zero Scores
			_oGameModel.getScoreBoard().zeroScores();
			//Setup the Viewer for a new game and then start game
			_oGameViewer.setupViewerForNewGame(self.startGame, oOptions);
        }
		
		/**
		 * Used to start a new move based on a mouse down event. 
		 * It is also used directly by the AI to initiate the start of a new move.
		 * 
		 * @param {Object} nColumnId Optional argument. Used by the AI to specify the column for which to start a move.
		 */
		var handleStartNewMove = function(nColumnId){
			if(_oGameModel.getCurrentPlayer().getName() != "Computer"){
				//If the player is not the computer/AI, the update columnId and highlight/unhighlight available drop positions
				//If the player is the computer/AI, this update and highlight function is skippped because we do not neecd to draw attentions to the AI's moves
				//The highlight is intended for the user only.
				_oGameViewer.setCurrentColumnId(nColumnId);
			}
			
            if (_oGameViewer.getBooleanIsFloatingGamePiece()) {
                //A GamePiece has already been created, do not created another one
            }
            else {
                //Create a new gamepiece
				if(event){
					//If the gamepiece was created by a user's action, pass the event along to the gamepiece creation
					_oGameViewer.setCurrentGamePiece(new gamepiece.GamePiece(_oGameModel.getCurrentPlayer().getId(), _oGameModel.getCurrentPlayer().getStyle(), _oGameModel.getCurrentPlayer().getWinStyle(), event, nColumnId));
				}else{
					_oGameViewer.setCurrentGamePiece(new gamepiece.GamePiece(_oGameModel.getCurrentPlayer().getId(), _oGameModel.getCurrentPlayer().getStyle(), _oGameModel.getCurrentPlayer().getWinStyle(), null, nColumnId));
				}
                
                _oGameViewer.setBooleanIsFloatingGamePiece(true);
            }
        }
		
		var handleMouseMove = function(nColumnId){
			_oGameViewer.setCurrentColumnId(nColumnId);
		}
		
		var handleEndNewMove = function(){
			
			//Raise shield to prevent user interaction
			_oGameViewer.raiseShield();
				
			//Check if there is a floating game piece that can be dropped in that game column.
            if (_oGameViewer.getBooleanIsFloatingGamePiece()) {
				
				//Get the next move
				var oMove = rulesengine.getValidMove(_oGameModel, _oGameViewer.getCurrentColumnId());
				
				//Check that a valid move exists
				if(oMove != null) {
					//The move is valid. Continue with drop. 
					dropGamePiece(oMove);
				}
				else {
					//No valid move exists. The game piece may not be placed. It will be deleted and the player can try another move.
					_oGameViewer.handleDeleteFloatingGamePiece();
					//Lower shield to resume user interaction
			        _oGameViewer.lowerShield();
					return;
				}				
            }else{
				//Lower shield to resume user interaction
			    _oGameViewer.lowerShield();
			}
        }
		
		var getDifficultyLevel = function(){
			return _nDifficultyLevel;
		}
		
		dropGamePiece = function(oMove){
			//Get the Game Piece.
					var oGamePiece = _oGameViewer.getCurrentGamePiece();
					//Update game model state.  
					_oGameModel.updateModelStateFromNewMove(oMove, oGamePiece);
					//Update the Game Piece Id to reflect it's placement on the game board
					oGamePiece.updateId(oMove.getColumn(), oMove.getRow());
					//Update viewer to keep track of the game piece played.
                    _oGameViewer.addGamePieceInPlay(oGamePiece);
					//Animate the move
					_oGameViewer.animateMove(oMove, function(){
						//Update highlighted position in the gameviewer
						_oGameViewer.removeHighlight(oMove.getColumn());
						//Get next open drop position in this column
						var oOpenMove = rulesengine.getValidMove(_oGameModel, oMove.getColumn());
						//Update open drop positions in the model
						_oGameModel.oOpenPositions[oMove.getColumn()] = oOpenMove? oOpenMove.getRow() : null;
						_handleTurnComplete();
					});
		}
		
		var _updateModelToClearGamePieces = function(){						
			//Clean up game board array
            _oGameModel.clearGameBoard();
			_oGameModel.resetOpenPositions();
		}
		
        var _updatePlayers = function(){
			rulesengine.switchPlayers(_oGameModel, _oGameViewer);
			
			
        }
    	
		var _performPlayForAI = function(){
			//Raise the shield to prevent user interaction during the AI's turn
			_oGameViewer.raiseShield();
			
			//Set the search depth.
			//For faster performance, the search depth is tapered such that you work up to the value of the difficulty level.
			//This allows us to use lower search depths in the beginning of the game when there are many equivalent options.
			var nSearchDepth = _nDifficultyLevel;
			if(_oGameModel.getNumberOfMovesPlayed() < 10){
				nSearchDepth = 4;
			}else{
				if(_oGameModel.getNumberOfMovesPlayed() < 20){
				    nSearchDepth = 6;
			    }else{
					nSearchDepth = _nDifficultyLevel;
				}
			}
			
			//Get the next best move from AIFactory
			var _oMove = _oAIFactory.getNextMove(_oGameModel, nSearchDepth, true);
			
			//Visualize the play
			handleStartNewMove(_oMove.getColumn());
			dropGamePiece(_oMove);
		}
		
        var _handleTurnComplete = function(){
			var aRoundResults = rulesengine.checkWinner(_oGameModel);
            var bRoundHasWinner = aRoundResults[0];
            
            if (bRoundHasWinner) {
                (_oGameModel.getCurrentPlayer()).addPoints(aRoundResults[2]);
                (_oGameModel.getScoreBoard()).updateScores();
                _oGameViewer.animateWinningGamePieces(aRoundResults, _handleNewRound);
            }
            else {
                var bGameBoardIsFilled = (_oGameViewer.getGamePiecesInPlay().length == nGameDimensionX * nGameDimensionY) ? true : false;
                if (bGameBoardIsFilled) {
                    //Remove all game pieces and start a new round
                    _handleNewRound();
                }
                else {
                    //Update Player
                    _updatePlayers();
                    
                    //If the player is now the AI, call the AI to play
                    if (_oGameModel.getCurrentPlayer().getId() == ID_PLAYERAI) {
                        _performPlayForAI();
                    }
                    else {
                        //Lower shield to resume user interaction
                        _oGameViewer.lowerShield();
                    }
                }
            }
			/*
            if (bRoundHasWinner) {	
			    (_oGameModel.getCurrentPlayer()).addPoints(aRoundResults[2]);
                (_oGameModel.getScoreBoard()).updateScores();
				_oGameViewer.animateWinningGamePieces(aRoundResults, _handleNewRound);
            }
            else {
				//Update Player
			    _updatePlayers();
				
				//If the player is now the AI, call the AI to play
			    if(_oGameModel.getCurrentPlayer().getId() == ID_PLAYERAI){
				    _performPlayForAI();
			    }else{
					//Lower shield to resume user interaction
			        _oGameViewer.lowerShield();
				}
            }*/
        }
		
		var _handleNewRound = function(){
			
			//Update Model so that the gameboard array is empty
			_updateModelToClearGamePieces();
			//Update players for the new round 
            _updatePlayers();
            //Update Viewer for new round
			_oGameViewer.setupViewerForNewRound(function(){
				
			    //Highlight active player
			    //_oGameViewer.updateScoreBoard();
			    //If the player is now the AI, call the AI to play
			    if(_oGameModel.getCurrentPlayer().getId() == ID_PLAYERAI){
			        _performPlayForAI();
			    }else{
					//Lower shield to resume user interaction
			        _oGameViewer.lowerShield();
				}
			})
        }
				
        //Game Managers starts game and attaches event listeners
        this.startGame = function(oOptions){
            _initializeComponents(oOptions);
        }
    }
    
    var gamemanager = {
        GameManager: GameManager
    }
    return gamemanager;
});
