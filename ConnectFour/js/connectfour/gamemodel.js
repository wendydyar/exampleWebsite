define([], function(){


    /*
     *   Game Model
     */
    function GameModel(oOptions){
    
        //Unpack options
        var _oPlayer0 = oOptions.players[0];
        var _oPlayer1 = oOptions.players[1];
        var _oStartingPlayer = oOptions.startingPlayer;
        var _oScoreBoard = oOptions.scoreBoard;
        
        //Initialize local variables
        var _oGameBoard = null;
		var _oCurrentPlayer;
		var _aMovesPlayed = [];
		
		//Open positions on the gameboard
		//stored as column: row
		this.oOpenPositions = {
		   "0": 0,
		   "1": 0,
		   "2": 0,
		   "3": 0,
		   "4": 0,
		   "5": 0,
		   "6": 0
		};
		
		this.updateModelStateFromNewMove = function(oMove, oGamePiece){
			this.updateGameBoard(oMove, oGamePiece);
			this.addMovesPlayed(oMove);
		}
        
        this.initGameBoard = function(){
            var oGameBoard = new Array(nGameDimensionX);
            //Fill each column in the board with an empty array to represent the vertical spaces
            for (var i = 0; i < oGameBoard.length; i++) {
                oGameBoard[i] = new Array();
            }
            _oGameBoard = oGameBoard;
        }
        
        this.getGameBoard = function(){
            return _oGameBoard;
        }
        
		this.setGameBoard = function(oGameBoard){
			_oGameBoard = oGameBoard;
		}
		
		this.updateGameBoard = function(oMove, oGamePiece){
			//Update the game board to include a player's game piece in the location specified by the move.
			_oGameBoard[oMove.getColumn()].push(oGamePiece);
		}
		
        this.clearGameBoard = function(){
            for (var i = 0; i < _oGameBoard.length; i++) {
                _oGameBoard[i] = new Array();
            }
			this.clearMovesPlayed();
        }
		
		this.clone = function(){
			var oOptions = {
				players: [_oPlayer0, _oPlayer1],
				startingPlayer: _oCurrentPlayer,
				scoreBoard: _oScoreBoard
			};
			var oClone = new this.constructor(oOptions);
			oClone.initGameBoard();
			
			for(var i=0; i<_oGameBoard.length; i++){
				for(var j=0; j<_oGameBoard[i].length; j++){
					oClone.getGameBoard()[i][j] = _oGameBoard[i][j];
				}
			} 
			
			for(var i=0; i<this.getNumberOfMovesPlayed(); i++){
				oClone.addMovesPlayed(this.getMovesPlayed()[i]);
			}
	
			return oClone;
		}
		
		this.resetOpenPositions = function(){
            this.oOpenPositions = {
                "0": 0,
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
                "6": 0
            };
		}
		
		this.setMovesPlayed = function(aMoves){
			_aMovesPlayed = aMoves;
		}
		
		this.getMovesPlayed = function(){
			return _aMovesPlayed;
		}
		
		this.getNumberOfMovesPlayed = function(){
			return _aMovesPlayed.length;
		}
		
		this.getLastMovePlayed = function(){
			return _aMovesPlayed[_aMovesPlayed.length - 1];
		}
		
		this.addMovesPlayed = function(oMove){
			_aMovesPlayed.push(oMove);
		}
		
		this.clearMovesPlayed = function(){
			_aMovesPlayed = [];
		}
        
        var _setPlayerActivity = function(oPlayer){
			//Remove active status from all players
            _oPlayer0.disableActivity();
            _oPlayer1.disableActivity();
            //Only set active status for the specified player
            oPlayer.enableActivity();
		}
        this.getCurrentPlayer = function(){
            return _oCurrentPlayer;
        }
        this.setCurrentPlayer = function(oPlayer){
            //Update current player
            _oCurrentPlayer = oPlayer;
			//Set that player's activity to enabled
			_setPlayerActivity(oPlayer);
        }
		this.getPlayers = function(){
			return [_oPlayer0, _oPlayer1];
		}
        this.getScoreBoard = function(){
            return _oScoreBoard;
        }
		
        /*
         * Initialize
         */
		//Initialize the game board to an empty array
        this.initGameBoard();
		//Set the current player to the player that is starting
        this.setCurrentPlayer(_oStartingPlayer);
        
        
    }//end constructor
    var gamemodel = {
        GameModel: GameModel
    }
    return gamemodel;
    
});
