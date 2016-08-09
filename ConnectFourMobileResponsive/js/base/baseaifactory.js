define(['jshelper'], function(jshelper){
	
	function BaseAIFactory(){
		
		/**
		 * @typedef {Object} HeuristicsEngineInterface
		 * @memberof module:base/baseaifactory
		 * @property {Function} calculateHeuristicValue() Calculates the heuristic value for a given module.
		 */
		
		this.expandedNodes = {};
		this.oMinimaxAlgorithm;
		
		//AI Next Move
		this.getNextMove = function(oModel, nDesiredSearchDepth, bSortChildren){
			
			//NodeOptions
			var oParentNodeOptions = {
				oParentNode: null,
				oModel: oModel,
				oMove: null
			}
			var oNodeClass = this.getNodeClass();
			var oParentNode = new oNodeClass(oParentNodeOptions);
			
			//Every time we ask the AI for a next move, we create a new instance of the Minimax algorithm because it resets statistics and specifies an auxiliary module.
			var oMinimaxClass = this.getMinimaxClass();
			this.oMinimaxAlgorithm = new oMinimaxClass(this);
			
			//Reset the expanded nodes
			this.expandedNodes = {};
			this.expandedNodes[oParentNode.getHash()] = oParentNode;
			
			//Call the algorithm's optimization function
			//Debug
			window.__startTime = (new Date()).getTime();
			var aResults = this.oMinimaxAlgorithm.getMinimaxOptimalResult(oParentNode, nDesiredSearchDepth, null, bSortChildren);
			var oNextMove = aResults.oNextNode.getMove();
	        var oFinalMove = aResults.oFinalNode.getMove();
	        var nFinalHeuristic = aResults.nHeuristicValue; 
	        var nNumberOperations = aResults.nNumberOfOperations;
	        console.log("Debug: Number of heuristic operations/calculations: " + nNumberOperations + " Time Elapsed: " + ((new Date()).getTime() - window.__startTime));
	        //Return the optimal move
	        return oNextMove;
		}
				
		this.hasNodeBeenExpanded = function(oNode){
			var sHash = oNode.getHash();
			
			if(this.expandedNodes[sHash] == null){
				//The node has not been expanded yet.
				return false;
			}else{
				//The node has been expanded already.
				return true;
			}
		}
		
		//Find next children for a given node that results in unique branching paths to explore
		this.getUniqueChildrenForNode = function(oNode){
		
			//Create Children Array
			var aChildren = [];
			//Get Next Moves
			var aValidMoves = this.getRulesEngine().getValidMoves(oNode.getModel());
			
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
		
		this.expandNode = function(oNode){
		
			//Find next children for a given node that results in unique branching paths to explore
			var aChildren = this.getUniqueChildrenForNode(oNode);
			
			//Add the next possible children to the node
			for (var j = 0; j < aChildren.length; j++) {
				oNode.addChild(aChildren[j]);
				this.expandedNodes[aChildren[j].getHash()] = aChildren[j];
			}
			
			//Set the node's expanded status
			oNode.setExpandedToTrue();
		}
		
		this.shouldContinueBranching = function(oNode){
			//If the children have been initialized for this node, check the contents of its children array.
			if (oNode.childrenAreExpanded()) {
				if (((oNode.getChildren()).length != 0)) {
					//There are children in the children array. 
					//We can continue to branch.
					return true;
				}
				else {
					//Children array is empty.
					//No children exist to expand. 
					return false;
				}
			}
			else {
				//Possible children for branching have not been initialized
				this.expandNode(oNode);
				//Now that children are initialized, check again for the contents of the children array.
				return this.shouldContinueBranching(oNode);
			}
		}
		
		this.calculateHeuristicValue = function(oNode){
			return this.getHeuristicsEngine().calculateHeuristicValue(oNode.getModel());
		}
		
		//Access to Classes
		this.getRulesEngine = function(){
			//Mandatory accessor. Must be overwritten by the child class. Should return a Rules Engine object.
			throw new Error("The child class must override the accessor method in the base class for getRulesEngine()");
		}
		/**
		 * This function retrieves the heuristics engine module in use.
		 * @return {module:base/baseaifactory#HeuristicsEngineInterface} The heuristics engine along with helper functions described by the interface.
		 */
		this.getHeuristicsEngine = function(){
			//Mandatory accessor. Must be overwritten by the child class. Should return a Heuristics Engine object.
			throw new Error("The child class must override the accessor method in the base class for getHeuristicsEngine()");
		}
		
		this.getNodeClass = function(){
			//Mandatory accessor. Must be overwritten by the child class. Should return a Node Class/Constructor.
			throw new Error("The child class must override the accessor method in the base class for getNodeClass()");
		}
		
		this.getMinimaxClass = function(){
			//Mandatory accessor. Must be overwritten by the child class. Should return a Minimax algoritm Class/Constructor.
			throw new Error("The child class must override the accessor method in the base class for getMinimaxClass()");
		}
		
	}
	
	var baseaifactory = {
		BaseAIFactory: BaseAIFactory
	}
	return baseaifactory;
})