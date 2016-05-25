define(['jshelper', 'base/baseminimax', 'connectfour/rulesengine'], function(jshelper, baseminimax, rulesengine){

    function Minimax(auxiliaryModule){
        
		//Call Base Constructor
		Minimax.baseConstructor.call(this, auxiliaryModule);
        
		
        
        /*
         * Code for Minimax withour Alpha-Beta Pruning
         */
		/*
        this.getMinimaxOptimalResult = function(oParentNode, nDesiredSearchDepth, nHeuristicToBeat){
        
            var nHeuristicValue;
            var nNewHeuristicValue;
            var bIsNewValueBetter;
            var oNextNode;
            var oFinalProjectedNode;
            var aMiniMaxResults;
            
            
            
            if (oParentNode.getDepth() < nDesiredSearchDepth) {
                if (this.auxiliaryModule.shouldContinueBranching(oParentNode)) {
                
                    var children = oParentNode.getChildren();
                    console.log("Parent: " + oParentNode.getModel().getName() + " Child: " + children[0].getModel().getName());
                    aMiniMaxResults = this.getMinimaxOptimalResult(children[0], nDesiredSearchDepth, null);
                    nHeuristicValue = aMiniMaxResults.nHeuristicValue;
                    oNextNode = children[0];
                    oFinalProjectedNode = aMiniMaxResults.oFinalNode;
                    
                    for (var i = 1; i < children.length; i++) {
                    
                        console.log("Parent: " + oParentNode.getModel().getName() + " Child: " + children[i].getModel().getName());
                        
                        //Get heuristic for node at children[i], taking into account that we already have a previous heuristic value for comparison
                        aMiniMaxResults = this.getMinimaxOptimalResult(children[i], nDesiredSearchDepth, nHeuristicValue);
                        nNewHeuristicValue = aMiniMaxResults.nHeuristicValue;
                        
                        //Compare heuristic values
                        if (this.isNewValueBetterThanCurrent(oParentNode, nHeuristicValue, nNewHeuristicValue)) {
                            nHeuristicValue = nNewHeuristicValue;
                            oNextNode = children[i];
                            oFinalProjectedNode = aMiniMaxResults.oFinalNode;
                        }
                        
                        
                    }//end loop through children
                }
                else {
                    //No more children left that we can branch to
                    oFinalProjectedNode = oParentNode;
                    nHeuristicValue = this.getHeuristicValue(oParentNode);
                }
            }
            else {
                //Reached the final specified search depth
                oFinalProjectedNode = oParentNode;
                nHeuristicValue = this.getHeuristicValue(oParentNode);
            }
            
            var oResults = {
                oNextNode: oNextNode,
                oFinalNode: oFinalProjectedNode,
                nHeuristicValue: nHeuristicValue,
                nNumberOfOperations: this.getNumberOfOperations()
            };
            
            
            return oResults;
            
        }//end algorithm
		*/
		
    }//end constructor
	
	//Extend from Base Class
	jshelper.extend(Minimax, baseminimax.BaseMinimax);
	
    var minimax = {
        Minimax: Minimax
    }
    return minimax;
});
