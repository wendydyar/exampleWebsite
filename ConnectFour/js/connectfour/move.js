define([], function(){
	
	/**
	 * A Move holds the indices of the game piece's position on the game board.
	 * 
	 * @param {Object} nColumn The index of the column on the game board that represent the final move position.
	 * @param {Object} nRow The index of the row on the game board that represent the final move position.
	 */
	function Move(nColumn, nRow){
		
		var _nColumn = nColumn;
		var _nRow = nRow;
		
		this.setColumn = function(nNewColumn){
			_nColumn = nNewColumn;
		}
		this.getColumn = function(){
			return _nColumn;
		}
		this.setRow = function(nNewRow){
			_nRow = nNewRow;
		}
		this.getRow = function(){
			return _nRow;
		}
	}
	
	var move = {
		Move: Move
	}
	return move;
})