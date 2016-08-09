define(['jshelper', 'base/baseminimax'], function(jshelper, baseminimax){

    function Minimax(auxiliaryModule){
        
		//Call Base Constructor
		Minimax.baseConstructor.call(this, auxiliaryModule);
		
		
    }//end constructor
	
	//Extend from Base Class
	jshelper.extend(Minimax, baseminimax.BaseMinimax);
	
    var minimax = {
        Minimax: Minimax
    }
    return minimax;
    
});
