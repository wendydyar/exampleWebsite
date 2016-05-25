define(['jshelper', 'base/baseaifactory', 'connectfour/gamemodel', 'connectfour/gamenode', 'connectfour/rulesengine', 'connectfour/heuristicsengine', 'connectfour/minimax'], function(jshelper, baseaifactory, gamemodel, gamenode, rulesengine, heuristicsengine, minimax){
	
	function AIFactory(){

        //Call Base Constructor
		AIFactory.baseConstructor.call(this);
		
		//Access to Classes
		this.getRulesEngine = function(){
			return rulesengine;
		}
		this.getHeuristicsEngine = function(){
			return heuristicsengine;
		}
		this.getNodeClass = function(){
			return gamenode.GameNode;
		}
		this.getMinimaxClass = function(){
			return minimax.Minimax;
		}
		
		this.calculateHeuristicValue = function(oNode, nDesiredSearchDepth){
			return this.getHeuristicsEngine().calculateHeuristicValue(oNode.getModel(), nDesiredSearchDepth, oNode.getDepth());
		}
		
		//Find next children for a given node that results in unique branching paths to explore
		this.getUniqueChildrenForNode = function(oNode){
		    
			//If this node represents a win in the game, then do not continue to look at children.
			//The opponent is the next player (which is already set as the node's current player because it is set up to play next). 
			var oNextPlayer =  oNode.getModel().getCurrentPlayer();
			var oLastPlayer = (oNode.getModel().getPlayers()[0] == oNextPlayer)? oNode.getModel().getPlayers()[1] : oNode.getModel().getPlayers()[0];
			var bNodeWinsGame = rulesengine.checkWinner(oNode.getModel(), oLastPlayer)[0];
			if(bNodeWinsGame){
				return [];
			}
			
			//Create Children Array
			var aChildren = [];
			//Get Next Moves
			var aValidMoves = this.getRulesEngine().getValidMoves(oNode.getModel());
			
			
			//If there are less than 4 game pieces on the gameboard, play in the center
			if(oNode.getModel().getNumberOfMovesPlayed() < 2){
				console.log("There have been less than 2 moves played. AI will play in the center. Number of moves played until now = " + oNode.getModel().getNumberOfMovesPlayed());
				oCenterMove = aValidMoves[3];
				aValidMoves = [];
				aValidMoves.push(oCenterMove);
			}
				
			if(aValidMoves == null){
				//There are no more options for moves and therefore no more children for this node
				return aChildren; 
			}
			
			//For each move in aNextPossibleMoves generate a Node representing the new state assuming that move has been made.
			//If the Node represented by this new state has not yet been expanded, it is unique. Add it to the array of next nodes for branching. 
			for (var i = 0; i < aValidMoves.length; i++) {
				
				//Get a Model to represent the new state that results from the move being applied
				var oChildModel = this.getRulesEngine().applyMoveToModel(oNode.getModel(), aValidMoves[i]);
				
				//Node
				var oNodeOptions = {
					oParentNode: oNode,
					oModel: oChildModel,
					oMove: aValidMoves[i]
				}
				var oNodeClass = this.getNodeClass();
				var oChildNode = new oNodeClass(oNodeOptions);
				
				if (!this.hasNodeBeenExpanded(oChildNode)) {
					//This node has not yet been expanded. It is unique and should therefore be added to the list of next models to explore.
					aChildren.push(oChildNode);
				}
				else {
					//TODO: check if this works
					delete (oChildNode);
					delete (oChildModel);
				}
			}
			return aChildren;
		}
		
	}
	
	//Extend from Base Class
	jshelper.extend(AIFactory, baseaifactory.BaseAIFactory);
	
	var aifactory = {
		AIFactory: AIFactory
	}
	return aifactory;
});