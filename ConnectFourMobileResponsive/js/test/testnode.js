define(['jshelper', 'base/basenode'], function(jshelper, basenode){
	
	/**
	 * The following are options required for the TestNode class. 
	 * @typedef {Object} TestNodeOptions 
	 * @memberof module:test/testnode 
	 * @extends module:base/basenode#BaseNodeOptions
	 * @property {Object} [oParentNode] The parent node of the new node that is being created.
	 * @property {Object} [oModel] The model object that represents the current state. 
	 * @property {Object} [oMove] The move that was made in order to create the state that is represented by this model. 
	 * 
	 */
	
	/**
	 * @class TestNode class is used for exploring and branching nodes in the AI.
	 * @constructor 
	 * @memberof module:test/testnode
	 * @param {module:test/testnode.TestNodeOptions} oOptions The config options for creating a new node.
	 */
	function TestNode(oOptions){
		
		//Call Base Constructor
		TestNode.baseConstructor.call(this, oOptions);
		
		this.generateHashFromModel = function(){
			//For a test node, the Model name is the same as the hash
			this.sHash = this.oModel.getName();
		}
			
	}//end constructor
	
	//Extend from Base Class
	jshelper.extend(TestNode, basenode.BaseNode);
	
	var testnode = {
		TestNode: TestNode
	}
	
	return testnode;
	
})