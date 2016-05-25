define([], function(){
	
	/**
	 * The general description. 
	 * @typedef {Object} TestModelOptions 
	 * @memberof module:test/testmodel
	 * @extends module:base/basemodel#BaseModelOptions
	 * @property {String} [sName] The name property of the model object that represents the current state. 
	 * 
	 */
	
	/**
	 * @class Description of class.
	 * @constructor 
	 * @memberof module:test/testnode
	 * @param {module:test/testnode.TestNodeOptions} oOptions The config options for creating a new node.
	 */
	
	function TestModel(oOptions){
		var _sName = oOptions.sName;
		
		this.getName = function(){
			return _sName;
		}
		
	}
	
	
	var testmodel = {
		TestModel: TestModel
	}
	return testmodel;
});