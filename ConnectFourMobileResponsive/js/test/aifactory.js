define(['jshelper', 'base/baseaifactory', 'test/testmodel', 'test/testnode', 'test/rulesengine', 'test/heuristicsengine', 'test/minimax'], function(jshelper, baseaifactory, testmodel, testnode, rulesengine, heuristicsengine, minimax){
	
	function AIFactory(){

        //Call Base Constructor
		AIFactory.baseConstructor.call(this);
		
		//Get the AI's Next Move (Example Case, Root Node A)
		this.runTest = function(){
			
			//Test Model
			var oTestModelOptions = {
				sName: "a"
			}
			var oTestModel = new testmodel.TestModel(oTestModelOptions);
			
			//Call the algorithm
			var nDesiredSearchDepth = 4;
			return this.getNextMove(oTestModel, nDesiredSearchDepth, true);
		}
		
		//Access to Classes
		this.getRulesEngine = function(){
			return rulesengine;
		}
		this.getHeuristicsEngine = function(){
			return heuristicsengine;
		}
		this.getNodeClass = function(){
			return testnode.TestNode;
		}
		this.getMinimaxClass = function(){
			return minimax.Minimax;
		}
	}
	
	//Extend from Base Class
	jshelper.extend(AIFactory, baseaifactory.BaseAIFactory);
	
	var aifactory = {
		AIFactory: AIFactory
	}
	return aifactory;
});