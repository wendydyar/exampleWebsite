/**
 * Created by matht_000 on 2/11/2016.
 */
function playGame() {


    /*
     *   CONSTANTS
     */
     const STYLE_CLASSIC_PLAYER0 = 'url("./imagesCF/method-draw-yellow-border-rounded.svg")';
     const STYLE_CLASSIC_PLAYER1 = 'url("./imagesCF/method-draw-red-border-rounded.svg")';
     const STYLE_CLASSIC_PLAYER0_WIN = 'url("./imagesCF/star.svg")';
     const STYLE_CLASSIC_PLAYER1_WIN = 'url("./imagesCF/star.svg")';

    /*
     *    GAME DIMENSIONS
     */
    var nGameDimensionX = 7;
    var nGameDimensionY = 5;
    var oGameContainer = document.getElementById("gameContainer");
    var oHeader = document.getElementById("header");
    var nGameContainerWidth = oGameContainer.offsetWidth;
    var nGameContainerHeight = oGameContainer.offsetHeight;
    var nGameContainerLeft = $(oGameContainer).offset().left;
    var nGameContainerTop = $(oGameContainer).offset().top;
    var nGameColumnWidth = nGameContainerWidth / nGameDimensionX;
    var nGameColumnVerticalChipSpace = nGameContainerHeight / nGameDimensionY;
    var nHeaderHeight = oHeader.offsetHeight;
    var nGamePieceDimension = 0.90 * nGameColumnVerticalChipSpace;

    /*
     *   COUNTER
     */
    var count = (function(){
        var nCounter = 0;
        var oCounter = {
            plusOne: function(){
                nCounter++;
                return nCounter;
            },
            reset: function(){
                nCounter = 0;
            }
        };
        return oCounter;
    })();
    //Access to counter functions in the above closure
    var fGetNewIdNumber = count.plusOne;
    var fResetCounter = count.reset;

    /*
     *   GAME
     */
    function Game() {

        var _oGameBoard = null;

        var _initGameBoard = function () {
            var oGameBoard = new Array(nGameDimensionX);
            //Fill each column in the board with an empty array to represent the vertical spaces
            for (var i = 0; i < oGameBoard.length; i++) {
                oGameBoard[i] = new Array();
            }
            _oGameBoard = oGameBoard;
        }

        var _buildBoardHTML = function () {
            var oGameContainer = document.getElementById("gameContainer");
            for (var i = 0; i < nGameDimensionX; i++) {
                var oColumn = document.createElement("div");
                oColumn.className = "gameBoardColumn";
                oColumn.id = i;
                $(oColumn).css({"width": 100 / nGameDimensionX + "%"});
                oGameContainer.appendChild(oColumn);
            }
        }

        var _renderBoardSVG = function () {
            //Set viewBox for SVG to match the Game Container
            var svg = document.getElementById("svg");
            svg.setAttribute("viewBox", "0 0 " + nGameContainerWidth + " " + nGameContainerHeight);
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");

            //Draw full game with cutouts for the chip spaces
            //Only use 80% of the chip's radius because the decorative borders takes up 20%
            nRadius = 0.80*(nGamePieceDimension / 2);
            var ndx = 0.01;
            var ndy = 0.00;
            var nCenterX;
            var nCenterY;
            var nX0;
            var nY0;
            var oDrawing = document.getElementById("drawing");
            var sPath = "";
            var sPathOutline = "";
            var sPathCircles = "";
            var sPathBorder = "";
            //Path for Drawings. First, define the bounding rectangle.
            sPath = "M0 0 L" + nGameContainerWidth + " 0 L" + nGameContainerWidth + " " + nGameContainerHeight + "L0 " + nGameContainerHeight + " Z";

            sPathBorder = "M0 0 l0 " + nGameContainerHeight + " l " + nGameContainerWidth + "   0 l0 " + (-nGameContainerHeight);

            //For each column, find the center
            for (var i = 0; i < nGameDimensionX; i++) {
                //The center is found by taking the left position of the
                //column plus half the column width.
                nX0 = i * nGameColumnWidth;
                nCenterX = (i + 0.5) * nGameColumnWidth;
                //For each row in that col, find the center.
                for (var j = 0; j < nGameDimensionY; j++) {
                    nY0 = j * nGameColumnVerticalChipSpace;
                    nCenterY = (j + 0.5) * nGameColumnVerticalChipSpace;
                    //Move to starting location which is the center of each playing space
                    sPath += "M" + nCenterX + " " + nCenterY + " ";
                    sPathCircles += "M" + nCenterX + " " + nCenterY + " ";
                    //Create the circle. Relative the the centered position,
                    //move to the top of the circle and begin creating a large arc.
                    sPath += "m0 " + (-nRadius) + "a " + nRadius + " " + nRadius + " 0 1 0 " + ndx + " " + ndy + " z";
                    sPathCircles += "m0 " + (-nRadius) + "a " + nRadius + " " + nRadius + " 0 1 0 " + ndx + " " + ndy + " z";

                    //For the left outline, start at the bottom left corner
                    sPathOutline += "M" + nX0 + " " + (nY0 + nGameColumnVerticalChipSpace) + " ";
                    //Left Line
                    sPathOutline += "l 0 " + (-nGameColumnVerticalChipSpace) + " l 1 0 l 0 " + nGameColumnVerticalChipSpace + " z ";
                    //Bottom Line
                    sPathOutline += "l " + nGameColumnWidth + " 0 l0 -1 l" + (-nGameColumnWidth) + " 0 z ";
                }//end for
            }//end for
            //Full game layout drawing
            oDrawing.setAttribute("d", sPath);
            oDrawing.setAttribute("fill", "url(#svg_fill_gradient_linear)");
            /*oDrawing.setAttribute("fill", "rgb(2,16,168)"); //blue*/
            //oDrawing.setAttribute("stroke", "rgb(1,7,74)"); //navy
            oDrawing.setAttribute("stroke-width", "4");

            //Outlines that define all horizontal/vertical lines in the grid of game cells
            var outline = document.getElementById("outline");
            outline.setAttribute("d", sPathOutline);
            outline.setAttribute("stroke", "rgb(1,7,74)"); //navy
            outline.setAttribute("stroke-width", "0.5");

            //Circle Borders
            var circles = document.getElementById("circles");
            circles.setAttribute("d", sPathCircles);
            circles.setAttribute("stroke", "rgb(1,7,74)"); //navy
            circles.setAttribute("stroke-width", "4");
            circles.setAttribute("fill", "transparent");

            //Game Board Border (left, bottom, & right))
            var border = document.getElementById("border");
            border.setAttribute("d", sPathBorder);
            border.setAttribute("stroke", "rgb(1,7,74)"); //navy
            border.setAttribute("stroke-width", "4");
            border.setAttribute("fill", "transparent");
        }

        this.getGameBoard = function () {
            return _oGameBoard
        };

        this.getAllGameBoardColumns = function(){
            return document.getElementsByClassName("gameBoardColumn");
        }
        this.clearGameBoard = function(){
            for (var i = 0; i < _oGameBoard.length; i++) {
                _oGameBoard[i] = new Array();
            }
        }

        //Initialize the Game Board
        _initGameBoard();
        _buildBoardHTML();
        _renderBoardSVG();

    }//end Game constructor


    /*
     *    PLAYER
     */
    function Player(myName, myId, myStyle, myWinStyle){

        var _sName = myName;
        var _nId = myId;
        var _sStyle = myStyle;
        var _sWinStyle = myWinStyle;
        var _nPoints = 0;
        var _bActive = false;

        this.getName = function(){
            return _sName;
        }
        this.setName = function(name){
            _sName = name;
        }
        this.getId = function(){
            return _nId;
        }
        this.getStyle = function(){
            return _sStyle;
        }
        this.getWinStyle = function(){
            return _sWinStyle;
        }
        this.getPoints = function(){
            return _nPoints;
        }
        this.setPoints = function(nP){
            _nPoints = nP;
        }
        this.addPoints = function(nP){
            //nP is the number of points to add to the current score
            _nPoints += nP;
        }
        this.enableActivity = function(){
            _bActive = true;
        }
        this.disableActivity = function(){
            _bActive = false;
        }
        this.isActive = function(){
            return _bActive;
        }
    }

    /*
     *    CHIP
     */
    function Chip(sStyle, sWinStyle, event){

        var _nChipId;
        var _oChipElement;
        var _sChipStyle = sStyle;
        var _sWinStyle = sWinStyle;
        var _sChipClass = "gamePiece";

        _setInitialChipId = function(){
            _nChipId = "chip" + fGetNewIdNumber();
        }
        this.updateChipId = function(x, y){
            _oChipElement.id = ("chip" + x + "-" + y);
            _nChipId = ("chip" + x + "-" + y);
        }
        _getChipId = function(){
            return _nChipId;
        }
        _setChipStyle = function(sStyle){
            _sChipStyle = sStyle;
        }
        _createChip = function(){

            _setInitialChipId();
            _setChipStyle(sStyle);

            var chip = document.createElement("div");
            chip.className = _sChipClass;
            chip.id = _nChipId;
            $(chip).css({width: nGamePieceDimension, height: nGamePieceDimension});
            $(chip).css({zIndex: 5});

            //Each chip contains 2 parts: a bottom chip and a top chip
            //The bottom chip the basic player's chip with that player's style
            //The top chip is transparent and only appears for a winning play to show special styles
            var bottomChip = document.createElement("div");
            bottomChip.className = "bottomChip";
            $(bottomChip).css({'backgroundImage' : _sChipStyle});
            chip.appendChild(bottomChip);

            var topChip = document.createElement("div");
            topChip.className = "topChip";
            $(topChip).css({'backgroundImage' : _sWinStyle});
            chip.appendChild(topChip);

            document.getElementById("chipContainer").appendChild(chip);
            //Place the chip in the exact center of a column.
            //The left position we are giving is with respect to the chip's parent element.
            //Therefore, when we take pageX we have to subtract the distance to where the left edge of the container begins.
            $(chip).css({
                left: (event.pageX - nGameContainerLeft + 6 - nGamePieceDimension/2), /* subtract 6px for gameContainer margin */
                top: "20px"
            });

            _oChipElement = chip;
        }

        this.updateChipStyle = function(sStyle){
            _sChipStyle = sStyle;
            _oChipElement.className = this._sChipStyle;
        }

        this.getChipElement = function(){
            return document.getElementById(_nChipId);
        }
        this.deleteChip = function(){
            $(this.getChipElement()).remove();
        }

        //Create the chip
        _createChip();
    }

    Chip.getChipElementAtLocation = function(x,y){
        return document.getElementById("chip" + x + "-" + y);
    };

    Chip.deleteAllChipElementsInDOM = function(){
        $('#chipContainer').empty();
    }

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

    /*
     * GAME ENGINE
     */
    function GameEngine(){

        this.checkWinner = function(oScoreBoard, oGameBoard, oPosition, oPlayer) {

            //Consecutive pieces represents the number of same player pieces in a row (including the last piece played)
            var nPlayerId = oPlayer.getId();
            var consecutivePieces;
            var counter;
            var bCheckingRight;
            var bCheckingLeft;
            var roundScore = 0;
            var tempChips = [];
            var winningChips = [];
            var x = oPosition[0];
            var y = oPosition[1];

            /*
             * Vertical
             * Check the vertical up/down direction for 4 consecutive pieces from the same player
             * The last piece played in on the top so it's only necessary to search below it
             * Include your last played piece as 1 consecutive, now need to find 3 more to complete 4 in a row
             */
            consecutivePieces = 1;
            for (var i = (y - 1); i >= 0; i--) {
                if ((oGameBoard[x][i]).getId() == nPlayerId) {
                    consecutivePieces++;
                    tempChips.push(Chip.getChipElementAtLocation(x, i));
                    if (consecutivePieces >= 4) {
                        /*alert("Winner!");*/
                        roundScore += 1;
                        //Add your current chip to the set of all winning chips
                        winningChips = winningChips.concat([Chip.getChipElementAtLocation(x, y)]);
                        //Add all the other ships that connect with it to make 4 in a row
                        winningChips = winningChips.concat(tempChips);
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
            tempChips = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {

                //Make sure the index exists as an occupied space on the board in order to check it
                if ((x + counter < nGameDimensionX) && (y + counter < oGameBoard[x + counter].length)) {
                    if (oGameBoard[x + counter][y + counter].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x + counter, y + counter));
                    } else {
                        bCheckingRight = false;
                        break;
                    }
                } else {
                    bCheckingRight = false;
                }
                if ((x - counter >= 0) && (y - counter >= 0) && (y - counter < oGameBoard[x - counter].length)) {
                    if (oGameBoard[x - counter][y - counter].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x - counter, y - counter));
                    } else {
                        bCheckingLeft = false;
                        break;
                    }
                } else {
                    bCheckingLeft = false;
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Diagonal!");*/
                    roundScore += 1;
                    winningChips = winningChips.concat([Chip.getChipElementAtLocation(x, y)]);
                    winningChips = winningChips.concat(tempChips);
                    break;
                }
            }

            /*
             * Diagonal (bottom-right/top-left)
             */
            consecutivePieces = 1;
            tempChips = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {

                //Make sure the index exists as an occupied space on the board in order to check it
                if ((x + counter < nGameDimensionX) && (y - counter >= 0) && (y - counter < oGameBoard[x + counter].length)) {
                    if (oGameBoard[x + counter][y - counter].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x + counter, y - counter));
                    } else {
                        bCheckingRight = false;
                        break;
                    }
                } else {
                    bCheckingRight = false;
                }
                if ((x - counter >= 0) && (y + counter < oGameBoard[x - counter].length)) {
                    if (oGameBoard[x - counter][y + counter].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x - counter, y + counter));
                    } else {
                        bCheckingLeft = false;
                        break;
                    }
                } else {
                    bCheckingLeft = false;
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Diagonal!");*/
                    roundScore += 1;
                    winningChips = winningChips.concat([Chip.getChipElementAtLocation(x, y)]);
                    winningChips = winningChips.concat(tempChips);
                    break;
                }
            }

            /*
             * Horizontal (right/left)
             */
            consecutivePieces = 1;
            tempChips = [];
            counter = 1;
            bCheckingRight = true;
            bCheckingLeft = true;
            while (bCheckingRight || bCheckingLeft) {

                //Make sure the index exists as an occupied space on the board in order to check it
                if ((x + counter < nGameDimensionX) && (y < oGameBoard[x + counter].length)) {
                    if (oGameBoard[x + counter][y].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x + counter, y));
                    } else {
                        bCheckingRight = false;
                        break;
                    }
                } else {
                    bCheckingRight = false;
                }
                if ((x - counter >= 0) && (y < oGameBoard[x - counter].length)) {
                    if (oGameBoard[x - counter][y].getId() == nPlayerId) {
                        consecutivePieces++;
                        tempChips.push(Chip.getChipElementAtLocation(x - counter, y));
                    } else {
                        bCheckingLeft = false;
                        break;
                    }
                } else {
                    bCheckingLeft = false;
                }
                counter++;
                if (consecutivePieces >= 4) {
                    /*alert("Winner Horizontal!");*/
                    roundScore += 1;
                    winningChips = winningChips.concat([Chip.getChipElementAtLocation(x, y)]);
                    winningChips = winningChips.concat(tempChips);
                    break;
                }
            }

            //Return winner information:
            //1. Boolean for whether or not there was a winner
            //2. Array of chips that made the winning play(s)
            //3. The score accumulated for the round
            if (roundScore == 0) {
                //There was no win
                return [false, null, null];
            } else {
                //There was a win
                return [true, winningChips, roundScore];
            }
        }
    }

    /*
     *  GAME MANAGER
     */
    function GameManager(){

        var _oGame;
        var _oGameEngine;
        var _oPlayer0;
        var _oPlayer1;
        var _oCurrentPlayer;
        var _oScoreBoard;
        var _oCurrentChip;
        var _aChipsInPlay = [];
        var _bFloatingChip;
        var _nCurrentColumnId;
        var _nCurrentColumnCenter;
        var _eShield;

        _startGame = function(){
            _oGame = new Game();
            _oGameEngine = new GameEngine();
            _oPlayer0 = new Player("Player 1", 0, STYLE_CLASSIC_PLAYER0, STYLE_CLASSIC_PLAYER0_WIN);
            _oPlayer1 = new Player("Player 2", 1, STYLE_CLASSIC_PLAYER1, STYLE_CLASSIC_PLAYER1_WIN);
            _oCurrentPlayer = _oPlayer0;
            _oScoreBoard = new ScoreBoard(_oPlayer0, _oPlayer1);
            //Save the shield, which is used to active/deactivate interaction with the entire page
            _eShield = document.getElementById("shield");
            //Select starting player
            _oPlayer0.enableActivity();
            _oScoreBoard.highlightActivePlayer();
        }

        _attachEventListeners = function(){
            var allGameBoardColumns = _oGame.getAllGameBoardColumns();

            //Settings
            $('#settingsButton').on("click", _openSettings);
            //Exit Settings
            $('#closeButton').on("click", _exitSettings);
            //Reset Game
            $('#newGame').on("click", _startNewGame);

            //For each game board column, add an event listener to know when the mouse has been released
            for (var i = 0; i < allGameBoardColumns.length; i++) {
                $(allGameBoardColumns[i]).on("mousedown", function (event) {
                    if(_bFloatingChip){
                        //A Chip has already been created, do not created another one
                    }else{
                        //Create a game chip
                        _oCurrentChip = new Chip(_oCurrentPlayer.getStyle(), _oCurrentPlayer.getWinStyle(), event);
                        _bFloatingChip = true;
                    }
                });

                $(allGameBoardColumns[i]).on("mousemove", function (event) {
                    _nCurrentColumnId = parseInt(event.target.id);
                });
            }

            //Have the floating chip follow the mouse until it is placed in a slot
            //Only applicable for movements in the #centerBody div which holds the game board html
            $('#centerBody').on('mousemove', function (event) {
                if (_bFloatingChip) {
                    // Follow the mouse
                    $(_oCurrentChip.getChipElement()).css({left: (event.pageX - nGameContainerLeft + 6 - nGamePieceDimension/2), /* add 6px for gameContainer margin */
                        top: "20px"});
                }
            });//end mousemove

            $(document).on('mouseup', function(event){
                //Check if we are in the authorized place to drop a chip
                if(event.target.className.includes("gameBoardColumn")){
                    //The mouse was released over once of the game board columns
                    //Drop the chip
                    _dropFloatingChip();
                }else{
                    //The mouse was released in an area where a chip cannot be dropped
                    _deleteFloatingChip();
                }
            });//end mouseup
        }//end event listeners

        _switchPlayers = function(){
            if(_oCurrentPlayer == _oPlayer0){
                _oCurrentPlayer = _oPlayer1;
                _oPlayer1.enableActivity();
                _oPlayer0.disableActivity();
            }else{
                _oCurrentPlayer = _oPlayer0;
                _oPlayer0.enableActivity();
                _oPlayer1.disableActivity();
            }
            _oScoreBoard.highlightActivePlayer();
        }

        _openSettings = function(){
            $(document.getElementById("settingsPageContainer")).css({"display" : "block"});
        }
        _exitSettings = function(){
            $(document.getElementById("settingsPageContainer")).css({"display" : "none"});
        }

        _raiseShield = function(){
            $(_eShield).css({"display" : "block"});
        }
        _lowerShield = function(){
            $(_eShield).css({"display" : "none"});
        }

        _dropFloatingChip = function(){
            if (_bFloatingChip) {
                // Check if there is sufficient space to drop the chip
                var nStackSize = _oGame.getGameBoard()[_nCurrentColumnId].length;
                if(nStackSize == nGameDimensionY){
                    //The game column is already filled to it's maximum dimension, no new chips may be placed there
                    _deleteFloatingChip();
                    return;
                }

                //Drop the Chip
                //Raise the shield to prevent user interaction while dropping the chip
                _raiseShield();
                _nCurrentColumnCenter = ((0.5 * nGameColumnWidth) + (_nCurrentColumnId * nGameColumnWidth)) + 6 - nGamePieceDimension / 2; /* add 6px for gameContainer margin */
                var nDistanceFromBottom = 0.5 * nGameColumnVerticalChipSpace + nStackSize * nGameColumnVerticalChipSpace + nGamePieceDimension / 2;
                var nDistanceFromTop = nHeaderHeight + nGameContainerHeight - nDistanceFromBottom;
                var lastPlayPosition = [_nCurrentColumnId,nStackSize];

                //Update game array
                _oGame.getGameBoard()[_nCurrentColumnId].push(_oCurrentPlayer);

                /*
                //Place chip in final position and animate the drop
                $(_oCurrentChip.getChipElement()).css({
                    left: _nCurrentColumnCenter,
                    top: nDistanceFromTop,
                    "-webkit-animation" : "bounce 0.4s both"
                });
                */
                //Place chip in final position and animate the drop
                var dropTime = 350 * nDistanceFromTop/nGameContainerHeight;
                $(_oCurrentChip.getChipElement()).animate({left: _nCurrentColumnCenter, top: nDistanceFromTop}, dropTime, "easeInCubic", function(){
                    $(this).css({"animation" : "bounce 0.4s both",
                        "-webkit-animation" : "bounce 0.4s both",
                        "-moz-animation" : "bounce 0.4s both",
                        "-o-animation" : "bounce 0.4s both"});
                });

                //Update the chip's id with a position so it is more informative
                _oCurrentChip.updateChipId(lastPlayPosition[0], lastPlayPosition[1]);
                _aChipsInPlay.push(_oCurrentChip);
                _bFloatingChip = false;

                //Check for a winner
                var aRoundResults = _oGameEngine.checkWinner(_oScoreBoard, _oGame.getGameBoard(), lastPlayPosition, _oCurrentPlayer);

                //Wait for bounce animation to finish (which takes 0.8s/800ms) before handling the round results
                setTimeout(function(){ _handleRoundResults(aRoundResults); }, 400);
            }
        }

        _deleteFloatingChip = function(){
            if(_bFloatingChip){
                _oCurrentChip.deleteChip();
                _bFloatingChip = false;
            }
        }

        _handleRoundResults = function(aRoundResults) {
            var bRoundHasWinner = aRoundResults[0];
            var aWinningChips = aRoundResults[1];
            var nRoundScore = aRoundResults[2];
            if (bRoundHasWinner) {
                var nChipsAnimated = 0;
                for (var n = 0; n < aWinningChips.length; n++) {

                    var sTopChipSelector = '#' + aWinningChips[n].id + ' > .topChip';
                    $(sTopChipSelector).animate({opacity: 1.0}, 500).animate({opacity: 0.2}, 500).animate({opacity: 1.0}, 500);
                    $(sTopChipSelector).promise().done(function () {
                        nChipsAnimated += 1;
                        if (nChipsAnimated == aWinningChips.length) {
                            //All animations are complete. Update the score and switch players.
                            _oCurrentPlayer.addPoints(nRoundScore);
                            _oScoreBoard.updateScores();
                            _newRound();
                        }
                    });
                }
            }
            else
            {
                    _switchPlayers();
            }

            //Resume Play
            _lowerShield();

        }

        _deleteAllChipsInPlay = function(){

            //Animate the chip's exit
            var nChips = _aChipsInPlay.length;
            var nChipsAnimated = 0;
            for(var i=0; i<nChips; i++) {

                $(_aChipsInPlay[i].getChipElement()).css({"animation-name" : "rotateOut", "-webkit-animation-name" : "rotateOut"});

                $(_aChipsInPlay[i].getChipElement()).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    delete(_aChipsInPlay[i]);
                    nChipsAnimated += 1;
                    if (nChipsAnimated == nChips) {
                        //All animations are complete. Remove chip elements from the DOM and reset array.
                        //Remove all chips from the DOM
                        Chip.deleteAllChipElementsInDOM();
                        _aChipsInPlay = [];
                        //Set global counter to zero
                        fResetCounter();
                        //Clean up game board array
                        _oGame.clearGameBoard();
                        //Switch Players
                        _switchPlayers();
                        //Finally, lower the shield to allow game play to resume
                        _lowerShield();
                    }
                });
            }
        }

        _startNewGame = function(){
            //Reset player's scores
            _oScoreBoard.zeroScores();
            //Delete Chips
            _deleteAllChipsInPlay();
            //Close the settings dialog
            _exitSettings();
        }

        _newRound = function(){
            //Delete Chips
            _deleteAllChipsInPlay();
        }

        //Game Managers starts game and attaches event listeners
        this.startGame = function(){
            _startGame();
            _attachEventListeners();
        }
    }

  /*
   *    START!
   */
    var oGameManager = new GameManager();
    oGameManager.startGame();



}//end playGame