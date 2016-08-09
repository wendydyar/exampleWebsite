define(['jshelper'], function(jshelper){

        /*
         *    GAME DIMENSIONS  (Global Variables)
         */
        nGameDimensionX = 7;
        nGameDimensionY = 5;
        oGameContainer = document.getElementById("gameContainer");
        oHeader = document.getElementById("header");
		
        nRoundPrecision = 2;
		nGameContainerWidth = jshelper.roundPrecisely(oGameContainer.offsetWidth, nRoundPrecision);
        nGameContainerHeight = jshelper.roundPrecisely(oGameContainer.offsetHeight, nRoundPrecision);
        nGameContainerLeft = $(oGameContainer).offset().left;
        nGameContainerTop = $(oGameContainer).offset().top;
        nGameColumnWidth = jshelper.roundPrecisely(nGameContainerWidth / nGameDimensionX, nRoundPrecision);
        nGameColumnVerticalGamePieceSpace = jshelper.roundPrecisely(nGameContainerHeight / nGameDimensionY, nRoundPrecision);
        nHeaderHeight = oHeader.offsetHeight;
        nGamePieceDimension = jshelper.roundPrecisely(0.90 * nGameColumnVerticalGamePieceSpace, nRoundPrecision);

    function GameViewer(oOptions){
    
        //Unpack options
        var _oGameModel = oOptions.gameModel;
        var handleStartNewGame = oOptions.handleStartNewGame;
        var handleStartNewMove = oOptions.handleStartNewMove;
        var handleMouseMove = oOptions.handleMouseMove;
        var handleEndNewMove = oOptions.handleEndNewMove;
        var getDifficultyLevel = oOptions.getDifficultyLevel;
        
        //Local variables
		var self = this;
		var bGameIsRendered = false;
		var _oCurrentGamePiece;
        var _aGamePiecesInPlay = [];
		var _bFloatingGamePiece;
		var _nCurrentColumnId;
        var _eShield;
		var _nGameContainerLeft;
        
        this.renderInitialGame = function(){
            _buildBoardHTML();
            _renderBoardSVG();
			_renderHighlighterForDropPosition();
			_initializeSlider();
            _setShield();
			bGameIsRendered = true;
        }
        
        var _buildBoardHTML = function(){
            //var oGameContainer = document.getElementById("gameContainer");
			var oGameContainer = document.getElementById("interactionColumnContainer");
            for (var i = 0; i < nGameDimensionX; i++) {
                var oColumn = document.createElement("div");
                oColumn.className = "gameBoardColumn";
                oColumn.id = i;
                $(oColumn).css({
					"width": "14%"
                });
                oGameContainer.appendChild(oColumn);
            }
        }
        var _renderBoardSVG = function(){
            //Set viewBox for SVG to match the Game Container
            var svg = document.getElementById("svg");
            svg.setAttribute("viewBox", "0 0 " + nGameContainerWidth + " " + nGameContainerHeight);
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            
            //Draw full game with cutouts for the gamePiece spaces
            //Only use 80% of the gamePiece's radius because the decorative borders takes up 20%
            nRadius = 0.80 * (nGamePieceDimension / 2);
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
                    nY0 = j * nGameColumnVerticalGamePieceSpace;
                    nCenterY = (j + 0.5) * nGameColumnVerticalGamePieceSpace;
                    //Move to starting location which is the center of each playing space
                    sPath += "M" + nCenterX + " " + nCenterY + " ";
                    sPathCircles += "M" + nCenterX + " " + nCenterY + " ";
                    //Create the circle. Relative the the centered position,
                    //move to the top of the circle and begin creating a large arc.
                    sPath += "m0 " + (-nRadius) + "a " + nRadius + " " + nRadius + " 0 1 0 " + ndx + " " + ndy + " z";
                    sPathCircles += "m0 " + (-nRadius) + "a " + nRadius + " " + nRadius + " 0 1 0 " + ndx + " " + ndy + " z";
                    
                    //For the left outline, start at the bottom left corner
                    sPathOutline += "M" + nX0 + " " + (nY0 + nGameColumnVerticalGamePieceSpace) + " ";
                    //Left Line
                    sPathOutline += "l 0 " + (-nGameColumnVerticalGamePieceSpace) + " l 1 0 l 0 " + nGameColumnVerticalGamePieceSpace + " z ";
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
            circles.setAttribute("stroke-width", "2");
            circles.setAttribute("fill", "transparent");
            
            //Game Board Border (left, bottom, & right))
            var border = document.getElementById("border");
            border.setAttribute("d", sPathBorder);
            border.setAttribute("stroke", "rgb(1,7,74)"); //navy
            border.setAttribute("stroke-width", "4");
            border.setAttribute("fill", "transparent");
        }
		
		var _renderHighlighterForDropPosition = function(){
		
			var eDropHighlighterContainer = document.getElementById("dropHighlighterContainer");
			var eDropHighlighterCircle;
			
			var nDiameter = Math.round(0.85*nGamePieceDimension);
			var nX0;
			var nY0;
			
			//For each column, find the center
			for (var i = 0; i < nGameDimensionX; i++) {
				//Left position of the div
				var nColumnWidthPercent = jshelper.roundPrecisely(100/nGameDimensionX, nRoundPrecision);  
				var nXPercent = i*nColumnWidthPercent + nColumnWidthPercent/2;
				
				//For each row in that col, find the center.
				for (var j = 0; j < nGameDimensionY; j++) {
					eDropHighlighterCircle = document.createElement("div");
                    eDropHighlighterCircle.className = "dropHighlighterCircle";
                    eDropHighlighterCircle.id = "dropHighlighterCircle-" + i + "-" + j;
                    
					var nColumnHeightPercent = jshelper.roundPrecisely(100/nGameDimensionY, nRoundPrecision); //100% / 5 columns 
					var nYPercent = j*nColumnHeightPercent + nColumnHeightPercent/2;
					$(eDropHighlighterCircle).css({
						"position": "absolute",
						"left": nXPercent + "%",
						"bottom": nYPercent + "%", //First, move to the center of the colum
						"transform": "translateX(-50%)translateY(50%)" //Then readjust using half this div
						
                    });				
                    eDropHighlighterContainer.appendChild(eDropHighlighterCircle);
				}				
			}
		}
	
        var _setShield = function(){
            //Shield is a transparent cover over the page that
            //is used to active/deactivate user interaction with the entire page
            _eShield = document.getElementById("shield");
        }
		
		var _initializeSlider = function(){
			var initialValue = (getDifficultyLevel() != undefined)? getDifficultyLevel() : 3;
			$( "#slider" ).slider({
                value: initialValue,
                min: 6,
                max: 10,
                step: 2,
                slide: function( event, ui ) {
                    console.log("Slider was moved to amount: " + ui.value);
                }
            });
		}
		
        this.getAllGameBoardColumns = function(){
            return document.getElementsByClassName("gameBoardColumn");
        }
		
		this.cleanUpGameBoardColumns = function(){
			var childNodes = this.getAllGameBoardColumns();
            for (var i = childNodes.length - 1; i >= 0; i--) {
                var childNode = childNodes[i];
                childNode.parentNode.removeChild(childNode);
            }
		}
		
		this.cleanUpHighlighters = function(){
			var eContainer = document.getElementById("dropHighlighterContainer");
			$(eContainer).empty();
		}
        
        this.registerEventListeners = function(){
            var allGameBoardColumns = this.getAllGameBoardColumns();
			//_this, that, self
            var self = this;
            //Settings
            $('#settingsButton').on("click", this.openSettings);
            //Exit Settings
			$('#closeButton').on("click", function(){
				self.exitSettings();
				//Put the slider back to the last applied value for difficulty level, 
				//otherwise it remains at the last position it was moved to even thought the user did not click "play" to accept it.
				$('#slider').slider({ 
				    value: (getDifficultyLevel() != undefined)? getDifficultyLevel() : 3
				}); 
			});
            //Reset Game
            $('#newGame').on("click", function(){
				var bIsSinglePlayer = document.getElementById('singlePlayerOption').checked;
				if(bIsSinglePlayer){
					var nDifficultyLevel = $( "#slider" ).slider( "value" );
				}else{
					var nDifficultyLevel = null;
				}
				var oOptions = {
					bIsSinglePlayer: bIsSinglePlayer,
					nDifficultyLevel: nDifficultyLevel
				};
				//Start new game with the selected options
				handleStartNewGame(oOptions);
				//Close the settings dialog
                self.exitSettings();	
			});
            
            //For each game board column, add an event listener to know when the mouse has been released
            for (var i = 0; i < allGameBoardColumns.length; i++) {
                $(allGameBoardColumns[i]).on("mousedown", function(event){
					//On mouse down, always update the reference point of the left side of the game container
					//in case the user has resized the window. This will allow the gamepiece to follow along on mouse move.
                    _nGameContainerLeft = $(oGameContainer).offset().left;
					
			        //Handle mouse down
                    handleStartNewMove(parseInt(event.target.id));
                });
                
                $(allGameBoardColumns[i]).on("mousemove", function(event){
                    handleMouseMove(parseInt(event.target.id));
					
                });
            }
            
            //Have the floating gamepiece follow the mouse until it is placed in a slot
            //Only applicable for movements in the #interactionColumnContainer div which holds the game board html
            $('#interactionColumnContainer').on('mousemove', function(event){
                if (self.getBooleanIsFloatingGamePiece()) {
                    // Follow the mouse
					var nCurrentGamePieceDim = (self.getCurrentGamePiece()).getElement().offsetWidth;
                    $((self.getCurrentGamePiece()).getElement()).css({
                        left: (event.pageX - _nGameContainerLeft + 6 - nCurrentGamePieceDim / 2), /* add 6px for gameContainer margin */
                        top: "0px",
				        transform: "translateY(-100%)"
                    });
                }
            });//end mousemove
            $('#gamePageContainer').on('mouseup', function(event){
                //Check if we are in the authorized place to drop a gamepiece
                if (event.target.className.includes("gameBoardColumn")) {
                    //The mouse was released over once of the game board columns
                    //This is the end of a move. The handler will take care of dropping a gamepiece.
					handleEndNewMove();
                }
                else {
                    //The mouse was released in an area where a gamepiece cannot be dropped
                    self.handleDeleteFloatingGamePiece();
                }
            });//end mouseup
        }//end register event listeners
        
		this.deregisterEventListeners = function(){
            var allGameBoardColumns = this.getAllGameBoardColumns();
            var self = this;
            //Settings
            $('#settingsButton').off();
            //Exit Settings
            $('#closeButton').off();
            //Reset Game
            $('#newGame').off();
            
            //GameBoard Column Listeners
			//For each game board column, remove event listeners
            for (var i = 0; i < allGameBoardColumns.length; i++) {
                $(allGameBoardColumns[i]).off();
            }
            //Game Board Container Listener
			$('#gamePageContainer').off();
			
			//Centerbody Listener
            //Remove centerbody listener which is used to have the gamepiece follow the mouse
            $('#interactionColumnContainer').off();
			
        }//end de-register event listeners
		
        this.getBooleanIsFloatingGamePiece = function(){
            return _bFloatingGamePiece;
        }
        this.setBooleanIsFloatingGamePiece = function(bFloating){
            _bFloatingGamePiece = bFloating;
        }
		this.handleDeleteFloatingGamePiece = function(){
            if (this.getBooleanIsFloatingGamePiece()) {
                this.getCurrentGamePiece().deleteGamePiece();
                this.setBooleanIsFloatingGamePiece(false);
            }
        }
		this.getCurrentGamePiece = function(){
            return _oCurrentGamePiece;
        }
        this.setCurrentGamePiece = function(oGamePiece){
            _oCurrentGamePiece = oGamePiece;
        }
		this.getGamePiecesInPlay = function(){
            return _aGamePiecesInPlay;
        }
        this.addGamePieceInPlay = function(oGamePiece){
            _aGamePiecesInPlay.push(oGamePiece);
        }
		this.getLastGamePiecePlayed = function(){
			return _aGamePiecesInPlay[_aGamePiecesInPlay.length - 1];
		}
		this.emptyGamePiecesInPlay = function(){
			//Delete the game piece instance
			for(var i=0; i<_aGamePiecesInPlay.length; i++){
				delete (_aGamePiecesInPlay[i]);
			}
			//Reset the array
			_aGamePiecesInPlay = [];
		}
		this.removeHighlight = function(nColumnId){
			var sId = '#dropHighlighterCircle-' + nColumnId + '-' + _oGameModel.oOpenPositions[nColumnId]
		    $(sId).removeClass("openDropPosition");
		}
		this.addHighlight = function(nColumnId){
			if (_oGameModel.oOpenPositions[nColumnId] != undefined) {
                var sId = '#dropHighlighterCircle-' + nColumnId + '-' + _oGameModel.oOpenPositions[nColumnId]
                $(sId).addClass("openDropPosition");
            }
		}
		this.setCurrentColumnId = function(nColumnId){
			
			//Remove the class from the previously highlighted column
			this.removeHighlight(_nCurrentColumnId);
			
			if(nColumnId != null){
				_nCurrentColumnId = nColumnId;
				
				//Add the class to highlight the current column, if there is an open position to drop to in that column                
                this.addHighlight(nColumnId);
			}	
		}
		this.getCurrentColumnId = function(nColumnId){
			return _nCurrentColumnId;
		}
        this.openSettings = function(){
            $(document.getElementById("settingsPageContainer")).css({
                "display": "block"
            });
        }
        this.exitSettings = function(){
            $(document.getElementById("settingsPageContainer")).css({
                "display": "none"
            });
        }
        
        this.raiseShield = function(){
            $(_eShield).css({
                "display": "block"
            });
        }
        this.lowerShield = function(){
            $(_eShield).css({
                "display": "none"
            });
        }
        
        this.updateScoreBoard = function(){
            //Update ScoreBoard shown in the view to select active player
            _oGameModel.getScoreBoard().highlightActivePlayer();
            //Update scores
            _oGameModel.getScoreBoard().updateScores();
        }
		
		this.cleanUpScoreBoard = function(){
			_oGameModel.getScoreBoard().eraseScoreBoardDOMElements();
		}
		
		this.setupViewerForNewRound = function(fCallback){
			//Raise shield to prevent user interaction
			this.raiseShield();
			//Set global counter to zero
            jshelper.resetCounter();
			//Delete the existing game pieces
			this.animateDeleteAllGamePiecesInPlay(function(){
				//When the animation is complete, highlight the active player to show who is next
				self.updateScoreBoard();
				//All animations are complete. Lower the shield to resume user interaction.
                //self.lowerShield();
				//Invoke the callback function
				fCallback();
			});
		}
		
		this.setupViewerForNewGame = function(fCallback, oOptions){
			//Set up a new round
			self.setupViewerForNewRound(function(){
				//New Callback Function:
				//Remove DOM elements for scoreboard
			    self.cleanUpScoreBoard();
				//Remove DOM elements for game columns
				self.cleanUpGameBoardColumns();
				//Remove DOM elements for highlighters
				self.cleanUpHighlighters();
			    //De-register event listeners
			    self.deregisterEventListeners();
			    //Invoke Callback
				fCallback(oOptions);
			});
		}
        
        this.animateMove = function(oMove, fCallback){
        
		    //Raise shield to prevent user interaction during the animation
			//this.raiseShield();
		
            var nCurrentColumnCenter = ((0.5 * nGameColumnWidth) + (oMove.getColumn() * nGameColumnWidth)) + 6 - nGamePieceDimension / 2; /* add 6px for gameContainer margin */
            var nDistanceFromBottom = 0.5 * nGameColumnVerticalGamePieceSpace + oMove.getRow() * nGameColumnVerticalGamePieceSpace + nGamePieceDimension / 2;
            var nDistanceFromTop = nHeaderHeight + nGameContainerHeight - nDistanceFromBottom;
            
			//Percentages
			/*
			var nColumnWidthPercent = jshelper.roundPrecisely(100/nGameDimensionX, nRoundPrecision);  
			var nXPercent = oMove.getColumn()*nColumnWidthPercent + nColumnWidthPercent/2;
			var nColumnHeightPercent = jshelper.roundPrecisely(100/nGameDimensionY, nRoundPrecision); //100% / 5 columns 
			var nYPercent = oMove.getRow()*nColumnHeightPercent + nColumnHeightPercent/2;
		    	
			//Subtract the diameter of the gamepiece (which we know is 90% of the columns width, to exactly center
			//the gamepiece in the game column)
			var nGamePieceDimPercent = 0.90 * nColumnWidthPercent;
			var nYPercentRemainder = 100 - nYPercent;// - nColumnWidthPercent + 0.5*(nColumnWidthPercent-nGamePieceDimPercent);
			var nXGamePiecePercent = nXPercent - nGamePieceDimPercent/2;
			var nYGamePiecePercent = nYPercentRemainder - nGamePieceDimPercent/2;
				*/
				
			/* Percentages with rounding */
			var nColumnWidthPercent = jshelper.roundPrecisely(100/nGameDimensionX, nRoundPrecision);  
			var nXPercent = oMove.getColumn()*nColumnWidthPercent + nColumnWidthPercent/2;
			var nColumnHeightPercent = jshelper.roundPrecisely(100/nGameDimensionY, nRoundPrecision); //100% / 5 columns 
			var nYPercent = oMove.getRow()*nColumnHeightPercent + nColumnHeightPercent/2;
		    	
			//Subtract the diameter of the gamepiece (which we know is 90% of the columns width, to exactly center
			//the gamepiece in the game column)
			var nGamePieceDimPercent = 0.90 * nColumnWidthPercent;
			var nYPercentRemainder = 100 - nYPercent;// - nColumnWidthPercent + 0.5*(nColumnWidthPercent-nGamePieceDimPercent);
			var nXGamePiecePercent = jshelper.roundPrecisely(nXPercent - nGamePieceDimPercent/2, nRoundPrecision);
			var nYGamePiecePercent = jshelper.roundPrecisely(nYPercentRemainder - nGamePieceDimPercent/2 - 3, nRoundPrecision);
				
				
			//Place gamepiece in final position and animate the drop
            var dropTime = 350 * nDistanceFromTop / nGameContainerHeight;
            $((self.getCurrentGamePiece()).getElement()).animate({
				left: nXGamePiecePercent + "%",
                top: nYGamePiecePercent + "%"
            }, dropTime, "easeInCubic", function(){
                $(this).css({
                    "animation": "bounce 0.4s both",
                    "-webkit-animation": "bounce 0.4s both",
                    "-moz-animation": "bounce 0.4s both",
                    "-o-animation": "bounce 0.4s both"
                });
            });
			
			/*
            //Place gamepiece in final position and animate the drop
            var dropTime = 350 * nDistanceFromTop / nGameContainerHeight;
            $((self.getCurrentGamePiece()).getElement()).animate({
                left: Math.round(nCurrentColumnCenter),
                top: Math.round(nDistanceFromTop)
            }, dropTime, "easeInCubic", function(){
                $(this).css({
                    "animation": "bounce 0.4s both",
                    "-webkit-animation": "bounce 0.4s both",
                    "-moz-animation": "bounce 0.4s both",
                    "-o-animation": "bounce 0.4s both"
                });
            });
			*/
			$((self.getCurrentGamePiece()).getElement()).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				//Animation is complete. There is no longer a floating game piece.
				self.setBooleanIsFloatingGamePiece(false);
				//Invoke callback
				fCallback();
			});
        }
        
        this.animateWinningGamePieces = function(aRoundResults, fCallback){
            var bRoundHasWinner = aRoundResults[0];
            var aWinningGamePieces = aRoundResults[1];
            var nRoundScore = aRoundResults[2];
            			
            var nGamePiecesAnimated = 0;
            
            var animationsDone = function(){
                nGamePiecesAnimated += 1;
                console.log(nGamePiecesAnimated);
                if (nGamePiecesAnimated == aWinningGamePieces.length) {
                    //All animations are complete. Return to game manager.
                    fCallback();
                }
            }
			
            for (var n = 0; n < aWinningGamePieces.length; n++) {
                var sTopGamePieceSelector = '#' + aWinningGamePieces[n].getId() + ' > .topGamePiece';
				this.animatePulse(sTopGamePieceSelector, animationsDone);
				
            } 
        }
		
		this.animatePulse = function(sTopGamePieceSelector, animationsDone){
			$(sTopGamePieceSelector).animate({opacity: 1.0}, 500, function(){
					 $(sTopGamePieceSelector).animate({opacity: 0.2}, 500, function(){
						 $(sTopGamePieceSelector).animate({opacity: 1.0}, 500, function(){
							animationsDone();
						})})});
		}
		
        this.deleteAllGamePieceElementsInDOM = function(){
            $('#gamePieceContainer').empty();
        }
	
        this.animateDeleteAllGamePiecesInPlay = function(fCallback){
        
            //Animate the gamepiece's exit
            var aGamePiecesInPlay = self.getGamePiecesInPlay();
            var nGamePieces = aGamePiecesInPlay.length;
            
            if (nGamePieces == 0) {
                //There are no game pieces on the gameboard to animate
                fCallback();
            }
            else {
                //Animate the game pieces 
                var nGamePiecesAnimated = 0;
                for (var i = 0; i < nGamePieces; i++) {
                
                    $(aGamePiecesInPlay[i].getElement()).css({
                        "animation-name": "rotateOut",
                        "-webkit-animation-name": "rotateOut"
                    });
                    
                    $(aGamePiecesInPlay[i].getElement()).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    
                        nGamePiecesAnimated += 1;
                        if (nGamePiecesAnimated == nGamePieces) {
                            //Remove all gamepieces from the DOM and the array
                            self.deleteAllGamePieceElementsInDOM();
                            self.emptyGamePiecesInPlay();
                            
                            //Reset the global counter
                            jshelper.resetCounter();
                            
                            //Return to game manager
                            fCallback();
                            /*
                            //All animations are complete. Lower the shield to resume user interaction.
                            self.lowerShield();*/
                        }
                    });
                }
            }
        }
        
		/*
         * Render the initial game board
         */
		if(!bGameIsRendered){
			 this.renderInitialGame();
		}
        this.registerEventListeners();
        this.updateScoreBoard();
        
    }//end constructor
    var gameviewer = {
        GameViewer: GameViewer
    }
    
    return gameviewer;
    
});
