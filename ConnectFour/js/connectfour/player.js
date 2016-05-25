define([], function(){
	
	
    /*
     *    PLAYER
     */
    function Player(myName, myId, myStyle, myWinStyle){

        var _sName = myName;
        var _nId = myId;
        var _sStyle = myStyle;
        var _sWinStyle = myWinStyle;
        var _nPoints = 0;
        var _bActive = false;

        this.getName = function(){
            return _sName;
        }
        this.setName = function(name){
            _sName = name;
        }
        this.getId = function(){
            return _nId;
        }
        this.getStyle = function(){
            return _sStyle;
        }
        this.getWinStyle = function(){
            return _sWinStyle;
        }
        this.getPoints = function(){
            return _nPoints;
        }
        this.setPoints = function(nP){
            _nPoints = nP;
        }
        this.addPoints = function(nP){
            //nP is the number of points to add to the current score
            _nPoints += nP;
        }
        this.enableActivity = function(){
            _bActive = true;
        }
        this.disableActivity = function(){
            _bActive = false;
        }
        this.isActive = function(){
            return _bActive;
        }
    }

    var player = {
		Player: Player
	}
	return player;
});