define([], function(){
	
	function Move(sMoveId){
		var _sMoveId = sMoveId;
		
		this.getId = function(){
			return _sMoveId;
		}
		this.printMoveId = function(){
			console.log("Move Id = " + _sMoveId);
		}	
	}
	
	var move = {
		Move: Move
	}
	return move;
	
});