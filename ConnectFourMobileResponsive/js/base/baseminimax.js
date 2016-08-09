define([], function(){

    function BaseMinimax(auxiliaryModule){
        
		this.auxiliaryModule = auxiliaryModule;
        
		/*
		 * Keep track of the number of operations done to arrive at solution
		 */
		var _nOperations = 0;
		this.addToNumberOfOperations = function(){
			_nOperations++;
		}
		this.getNumberOfOperations = function(){
			return _nOperations;
		}
		
		/*
         * This Minimax algorithm function is overiding the base class's function becuase it contains some game specific logic
         * Use MiniMax (with Alpha Beta) to search nodes and their children node, compare their heuristic values,
         * and make the optimal selections based on the player (min or max).
         * Alpha Beta eliminates evaluating the rest of the children's heuristics if it already determines that the parent branch is less desirable than the parent's siblings.
         * Record the optimal next node for the parent node to choose.
         * Record the final projected node if all optimal moves were fully played out.
         */
        this.getMinimaxOptimalResult = function(oParentNode, nDesiredSearchDepth, nBenchmarkHeuristic, bSortChildren){
        
            var oInitialResults = {};
            var oNewResults = {};
            var oResults = {};
            
            if ((oParentNode.getDepth() < nDesiredSearchDepth) && (this.auxiliaryModule.shouldContinueBranching(oParentNode))) {
                //Branch to children
                var children = oParentNode.getChildren();
                
                 //Sort children
                 if (bSortChildren) {
                     //Calculate a temporary heuristic for the children in order to sort and therefore explore the children with the most favorable heuristics first.
                     for (var i = 0; i < children.length; i++) {
                         children[i].__nHeuristicAtCurrentLevel = this.getHeuristicValue(children[i], nDesiredSearchDepth);
                     }
                     
                     var bIsMaximizer = (oParentNode.getDepth() % 2 == 0);
                     children = oParentNode.sortChildren(function(a, b){
                         if (bIsMaximizer) {
                             return (b.__nHeuristicAtCurrentLevel - a.__nHeuristicAtCurrentLevel)
                         }
                         else {
                             return (a.__nHeuristicAtCurrentLevel - b.__nHeuristicAtCurrentLevel)
                         }
                     });
                 }
                 
                //Process the first child to obtain minimax results.
                oInitialResults = this.getMinimaxOptimalResult(children[0], nDesiredSearchDepth, null, bSortChildren);
                oResults = {
                    oNextNode: children[0],
                    oFinalNode: oInitialResults.oFinalNode,
                    nHeuristicValue: oInitialResults.nHeuristicValue,
                    nNumberOfOperations: this.getNumberOfOperations()
                };
                
                
                //Compare Initial Results to Benchmark
                //Compare initial results of child node to benchmark, if applicable, for oParentNode's sister node (which was handed down from oParentNode's parent) 
                //This helps determine early pruning for the rest of the children node here 
                if ((nBenchmarkHeuristic != null) && (this.isNewValueBetterThanCurrent(oParentNode, nBenchmarkHeuristic, oInitialResults.nHeuristicValue))) {
                    //No need to conitnue searching through the rest of the children, return this result
                    return oResults;
                }
                
                
                for (var i = 1; i < children.length; i++) {
                    
                    //Process each child to obtain minimax results.
                    //First, call the minimax algorithm for children[i].
                    //Take into account that the current optimal heuristic value is stored in oResults and will passed in the arguments as the benchmark value for comparison for this child.
                    oNewResults = this.getMinimaxOptimalResult(children[i], nDesiredSearchDepth, oResults.nHeuristicValue, bSortChildren);
                    
                    //Compare Results to Benchmark
                    //Compare the new heuristic result of this child to nBenchmarkHeuristic, if applicable, for oParentNode's sister node 
                    if ((nBenchmarkHeuristic != null) && (this.isNewValueBetterThanCurrent(oParentNode, nBenchmarkHeuristic, oNewResults.nHeuristicValue))) {
                        //No need to continue searching through children
                        //If this value is better for the parent, then it's not better for the parent's parent (the opponent) which provided the benchmark value.
                        //Therefore, the parent's parent (the opponent) will never choose this parent node because it is better off with the benchmark value.
                        //Return. However, we already know that the parent's parent (opponent) will never choose this parent in their path.
                        oResults = oNewResults;
                        return oResults;
                    }
                    
                    
                    //Compare Results to the Previous Optimal Results
                    if (this.isNewValueBetterThanCurrent(oParentNode, oResults.nHeuristicValue, oNewResults.nHeuristicValue)) {
                        //Update oResults to reflect that this node is the current optimal choice
                        oResults = {
                            oNextNode: children[i],
                            oFinalNode: oNewResults.oFinalNode,
                            nHeuristicValue: oNewResults.nHeuristicValue,
                            nNumberOfOperations: this.getNumberOfOperations()
                        };
                    }
                }//end loop through children
            }
            else {
                //Reached the final specified search depth
                oResults = {
                    oNextNode: null,
                    oFinalNode: oParentNode,
                    nHeuristicValue: this.getHeuristicValue(oParentNode, nDesiredSearchDepth),
                    nNumberOfOperations: this.getNumberOfOperations()
                };
            }
            
            return oResults;
        }//end algorithm
		
		
	/*
	 * Additional Functions
	 * heuristic calculations && comparison of heuristic values for specified nodes
	 */
	this.getHeuristicValue = function(oParentNode, nDesiredSearchDepth){
		//Bookkeeping: keep track of the number of times a heuristic was calculated
        this.addToNumberOfOperations();
        //console.log("Calculated a heuristic value! Total number of operations so far: " + this.getNumberOfOperations());
		
		//Calculate the heuristic value using the auxiliary module
        nHeuristicValue = this.auxiliaryModule.calculateHeuristicValue(oParentNode, nDesiredSearchDepth);
		return nHeuristicValue;
	}
	
   	
    //Compare and choose best heuristic value for a given node, a current value, and a new value
    this.isNewValueBetterThanCurrent = function(oNode, nCurrentValue, nNewValue){
        var nDepth = oNode.getDepth();
        //If the depth is an even number, your goal is to maximize the heuristic.
        if (Math.round(nDepth % 2) == 0) {
            if (nNewValue > nCurrentValue) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            //Your depth is an odd number.
            //Your goal is to minimize the heuristic. 
            if (nNewValue < nCurrentValue) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    }//end constructor
	
    var baseminimax = {
        BaseMinimax: BaseMinimax
    }
    return baseminimax;
    
});
