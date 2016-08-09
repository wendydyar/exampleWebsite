define([], function(){
	
	
    /*
     *  SCORE BOARD: Displays scores for each player at the bottom of the screen
     */
    function ScoreBoard(player0, player1){

        var _oPlayer0 = player0;
        var _oPlayer1 = player1;
        var _oScoreField0;
        var _oScoreField1;
        var _oPlayerNameField0;
        var _oPlayerNameField1;

        _createScoreBoardForPlayer = function(oParent, oPlayer, sAlignment){

            //Create a root element to append 3 different sections for the chip image, player name, and score value
            var root = document.createElement("div");
            root.className = "scoreBoardPlayer";
            root.id = "scoreBoardPlayer" + oPlayer.getId();

            //Wrapper
            var wrapper = document.createElement("div");
            wrapper.className = "scoreBoardPlayerWrapper";

            //Player Chip
            var displayPlayerChip = document.createElement("div");
            displayPlayerChip.className = "displayPlayerChip " + sAlignment;
            $(displayPlayerChip).css({'backgroundImage' : oPlayer.getStyle()});

            //Player Name
            var displayPlayerNameContainer = document.createElement("div");
            var displayPlayerName = document.createElement("div");
            displayPlayerNameContainer.className = "displayPlayerNameContainer";
            displayPlayerName.className = "displayPlayerName " + sAlignment + " smoothBorderTransition";
            displayPlayerName.innerHTML = oPlayer.getName();
            displayPlayerNameContainer.appendChild(displayPlayerName);

            //Player Score
            var displayPlayerScore = document.createElement("div");
            displayPlayerScore.innerHTML = oPlayer.getPoints();
            displayPlayerScore.className = "displayPlayerScore";
            var displayPlayerScoreContainer = document.createElement("div");
            displayPlayerScoreContainer.className = "displayPlayerScoreContainer " + sAlignment;
            displayPlayerScoreContainer.appendChild(displayPlayerScore);

            wrapper.appendChild(displayPlayerChip);
            wrapper.appendChild(displayPlayerNameContainer);
            wrapper.appendChild(displayPlayerScoreContainer);

            root.appendChild(wrapper);
            oParent.appendChild(root);

            //Return the element that represent the score field so it can be used for updates
            return [displayPlayerScore, displayPlayerName];
        }

        _insertSeparator = function(oParent){
            var separatorContainer = document.createElement("div");
            separatorContainer.id = "scoreSeparatorContainer";
            var separator = document.createElement("div");
            separator.id = "scoreSeparator";
            separator.innerHTML = "-";
            separatorContainer.appendChild(separator);

            oParent.appendChild(separatorContainer);
        }

        _renderScoreBoard = function(){
            var parent = document.getElementById("scoreBoard");
            var oFields0 = _createScoreBoardForPlayer(parent, _oPlayer0, "left");
            _insertSeparator(parent);
            var oFields1 = _createScoreBoardForPlayer(parent, _oPlayer1, "right");

            _oScoreField0 = oFields0[0];
            _oPlayerNameField0 = oFields0[1];
            _oScoreField1 = oFields1[0];
            _oPlayerNameField1 = oFields1[1];
        }
		
		this.eraseScoreBoardDOMElements = function(){
			var parent = document.getElementById("scoreBoard");
			$(parent).empty();
		}

        this.updateScores = function(){
            //Update the score board to reflect new points
            _oScoreField0.innerHTML = _oPlayer0.getPoints();
            _oScoreField1.innerHTML = _oPlayer1.getPoints();
        }

        this.zeroScores = function(){
            _oPlayer0.setPoints(0);
            _oPlayer1.setPoints(0);
            this.updateScores();
        }

        this.highlightActivePlayer = function(){
            if(_oPlayer0.isActive() == true){
                $(_oPlayerNameField1).removeClass("selected");
                $(_oPlayerNameField0).addClass("selected");
            }else{
                $(_oPlayerNameField0).removeClass("selected");
                $(_oPlayerNameField1).addClass("selected");
            }
        }

        //Upon creating an instance of ScoreBoard, render it:
        _renderScoreBoard();
    }

    var scoreboard = {
		ScoreBoard: ScoreBoard
	}
	return scoreboard;
	
});