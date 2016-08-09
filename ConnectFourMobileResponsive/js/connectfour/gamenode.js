define(['jshelper', 'base/basenode'], function(jshelper, basenode){
	
	/**
	 * The following are options required for the GameNode class. 
	 * @typedef {Object} GameNodeOptions 
	 * @memberof module:connectfour/gamenode 
	 * @extends module:base/basenode#BaseNodeOptions
	 * @property {Object} [oParentNode] The parent node of the new node that is being created.
	 * @property {Object} [oModel] The model object that represents the current state. 
	 * @property {Object} [oMove] The move that was made in order to create the state that is represented by this model. 
	 * 
	 */
	
	/**
	 * @class GameNode class is used for exploring and branching nodes in the AI.
	 * @constructor 
	 * @memberof module:connectfour/gamenode 
	 * @param {module:connectfour/gamenode.GameNodeOptions} oOptions The config options for creating a new node.
	 */
	function GameNode(oOptions){
		
		//Call Base Constructor
		GameNode.baseConstructor.call(this, oOptions);
		
		this.generateHashFromModel = function(){
			//The hash used here is a string created to represent the occupation of gamepieces on the gameboard
			var aGameBoard = this.getModel().getGameBoard();
			var sHashString = "";
			//For every column inthe gameboard
			for(var i=0; i<aGameBoard.length; i++){
				var aGameBoardColumn = aGameBoard[i];
				//For every row in that column
				for(var j=0; j<nGameDimensionY; j++){
					if(aGameBoard[i][j] == null){
						//x represents no gamepiece in that gameboard location
						sHashString += "x";
					}else{
						//One represents an existing gamepiece in that gameboard location
						sHashString += this.getModel().getGameBoard()[i][j].getPlayerId();
					}
				}
			}
			this.sHash = sHashString;
		}

	}//end constructor
	
	//Extend from Base Class
	jshelper.extend(GameNode, basenode.BaseNode);
	
	var gamenode = {
		GameNode: GameNode
	}
	
	return gamenode;
	
})