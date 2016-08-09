define(['jshelper'], function(jshelper){
	
	
    /*
     *    Game Piece 
     */
    function GamePiece(nPlayerId, sStyle, sWinStyle, event, nColumnId){

        var _nId;
        var _oElement;
		var _nPlayerId = nPlayerId;
        var _sStyle = sStyle;
        var _sWinStyle = sWinStyle;
        var _sCSSClassName = "gamePiece";

        var _setInitialId = function(){
            _nId = "gamePiece" + jshelper.getNewIdNumber();
        }
		
		var _setInitialStyle = function(sStyle){
            _sStyle = sStyle;
        }
		
		this.getId = function(){
            return _nId;
        }
        this.updateId = function(x, y){
            _oElement.id = ("gamePiece" + x + "-" + y);
            _nId = ("gamePiece" + x + "-" + y);
        }
		
		this.getPlayerId = function(){
			return _nPlayerId;
		}
		
        this.getStyle = function(){
			return _sStyle;
		}	
		this.updateStyle = function(sStyle){
            _sStyle = sStyle;
            _oElement.className = this._sStyle;
        }
		
        var _createGamePiece = function(nLeftXCoordinate, nWidth){

            _setInitialId();
            _setInitialStyle(sStyle);

            var gamePiece = document.createElement("div");
            gamePiece.className = _sCSSClassName;
            gamePiece.id = _nId;
            /*$(gamePiece).css({width: nGamePieceDimension, height: nGamePieceDimension});*/
            $(gamePiece).css({zIndex: 5});

            //Each gamePiece contains 2 parts: a bottom gamePiece and a top gamePiece
            //The bottom gamePiece the basic player's gamePiece with that player's style
            //The top gamePiece is transparent and only appears for a winning play to show special styles
            var bottomGamePiece = document.createElement("div");
            bottomGamePiece.className = "bottomGamePiece";
            $(bottomGamePiece).css({'backgroundImage' : _sStyle});
            gamePiece.appendChild(bottomGamePiece);

            var topGamePiece = document.createElement("div");
            topGamePiece.className = "topGamePiece";
            $(topGamePiece).css({'backgroundImage' : _sWinStyle});
            gamePiece.appendChild(topGamePiece);

            document.getElementById("gamePieceContainer").appendChild(gamePiece);
			
            //Place the gamePiece in the exact center of a column.
            //The left position we are giving is with respect to the gamePiece's parent element.
            //Therefore, when we take pageX we have to subtract the distance to where the left edge of the container begins.
            $(gamePiece).css({
                left: (nLeftXCoordinate + nWidth/2 + 6 - nGamePieceDimension/2), /* add 6px for gameContainer margin */
                top: "0px",
				transform: "translateY(-100%)"
            });

            _oElement = gamePiece;
        }
        
        this.getElement = function(){
            return document.getElementById(_nId);
        }
        this.deleteGamePiece = function(){
            $(this.getElement()).remove();
        }

        //Create GamePiece
		if(event){
			//There was an event.
			//Check its type. The code is written in this way because directly asking for the 
			//type of an event which is null throws an error. At this point we know the event is not null.
            if(event.type == "mousedown"){
				//There was a mousedown event by the user.
				//Create the gamepiece based on information from the user's interaction (mousedown event).
                _createGamePiece(event.target.offsetLeft, event.target.offsetWidth);
			}else{
				if(nColumnId != null) {
					//There was an event, but not one caused by the user. 
				    //Create the gamepiece on command based on game column information. 
                    var elColumn = document.getElementById(nColumnId);
                    _createGamePiece(elColumn.offsetLeft, elColumn.offsetWidth);
                }
			}	
		}else{
			//There was no event.
			//Create the gamepiece on command with a given column id number for determining initial x-coordinate position.
			if(nColumnId != null) {
                var elColumn = document.getElementById(nColumnId);
                _createGamePiece(elColumn.offsetLeft, elColumn.offsetWidth);
            }
		}
    }

    var getGamePieceElementAtLocation = function(x,y){
        return document.getElementById("gamePiece" + x + "-" + y);
    };

    var deleteAllGamePieceElementsInDOM = function(){
        $('#gamePieceContainer').empty();
    }
	
    var gamepiece = {
		GamePiece: GamePiece, 
		getGamePieceElementAtLocation: getGamePieceElementAtLocation,
		deleteAllGamePieceElementsInDOM: deleteAllGamePieceElementsInDOM
	}
	return gamepiece;
});