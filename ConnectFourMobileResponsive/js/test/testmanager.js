define(['test/aifactory'], function(aifactory){

    function TestManager(){
    
        //Local Variables
        var self = this;
        var _oAIFactory;
        
        
        var _initialize = function(){
            _oAIFactory = new aifactory.AIFactory();
        }
        
		this.runTest = function(){
			return _oAIFactory.runTest();
		}
				
        //Initialize
        _initialize();
    }
    
    var testmanager = {
        TestManager: TestManager
    }
    return testmanager;
});
