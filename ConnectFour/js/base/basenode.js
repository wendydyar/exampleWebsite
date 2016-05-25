define(['jshelper'], function(jshelper){
	
	/**
	 * The following are options required for the BaseNode class.
	 * @typedef {Object} BaseNodeOptions 
	 * @memberof module:base/basenode
	 * @property {Object} [oParentNode] The parent node of the new node that is being created.
	 * @property {Object} [oModel] The model object that represents the current state. 
	 * @property {Object} [oMove] The move that was made in order to create the state that is represented by this model. 
	 * 
	 */
	
	/**
	 * @class BaseNode class is used for exploring and branching nodes in the AI.
	 * @constructor 
	 * @memberof module:base/basenode
	 * @param {module:base/basenode.BaseNodeOptions} oOptions The config options for creating a new node.
	 */
	function BaseNode(oOptions){
        //Unpackage options
		this.oParentNode = oOptions.oParentNodeNode;
		this.oModel = oOptions.oModel;
		this.oMove = oOptions.oMove;
		
		//Define variables
		this.sHash;
		this.aPath = [];
		this.bChildrenAreExpanded = false;
		this.aChildren = [];
		this.nHeuristicValue = null;
		
		
		//Model & Hash Identifier
		this.getModel = function(){
			return this.oModel;
		}
		this.generateHashFromModel = function(){
			//Generate a Hash for this Node which is tailored from Model-specific information
			//Example: this.sHash = this.oModel.getName();
			throw new Error("The child class must implement its own generateHashFromModel() method.");
		}
		this.getHash = function(){
			if(!this.sHash){
				this.generateHashFromModel();
			}
			return this.sHash;
		}
		
		//Move
		this.getMove = function(){
			return this.oMove;
		}
		
		//Parent & Children
		this.getParent = function(){
			return this.oParentNode;
		}
		this.addParent = function(oParentNodeToAdd){
			this.oParentNode = oParentNodeToAdd;
		}
		this.addChildren = function(aChildrenToAdd){
			for(var i=0; i< aChildrenToAdd.length; i++){
				this.aChildren.push(aChildrenToAdd[i]);
				aChildrenToAdd[i].addParent(this);
				aChildrenToAdd[i].setPath();
			}
			//Since a child was added, children have been initialized
			this.setExpandedToTrue();
		}
		this.addChild = function(oChild){
			//Add new child to the array of children
			this.aChildren.push(oChild);
			
			//Link new child to it's parent and update it's path
			oChild.addParent(this);
			oChild.setPath();
			
			//Since a child was added, children have been initialized
			this.setExpandedToTrue();
		}
		this.getChildren = function(){
			return this.aChildren;
		}
		this.setExpandedToTrue = function(){
			this.bChildrenAreExpanded = true;
		}
		this.childrenAreExpanded = function(){
			return this.bChildrenAreExpanded;
		}
	
		this.getPath = function(){
			this.printPath();
			return this.aPath;
		}
		this.setPath = function(){
			this.aPath = (this.oParentNode.getPath()).concat(this);
			this.printPath();
		}
		this.printPath = function(){
			var sPrintPath = "";
			for(var i=0; i<this.aPath.length; i++){
				sPrintPath += this.aPath[i].getHash();
			}
		}
		this.getDepth = function(){
			return this.aPath.length;
		}
		this.setHeuristicValue = function(nValue){
			this.nHeuristicValue = nValue;
		}
		this.getHeuristicValue = function(){
			return this.nHeuristicValue;
		}
	
		this.sortChildren = function(fSortingFunction){
			this.aChildren = (this.aChildren).sort(fSortingFunction);
			return this.aChildren;
		}
	}//end constructor
	
	var basenode = {
		BaseNode: BaseNode
	}
	
	return basenode;
});