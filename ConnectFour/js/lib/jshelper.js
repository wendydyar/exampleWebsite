define([], function(){
	
	/*
	 * Inheritance
	 */
	var extend = function(subClass, baseClass){
		
		function Inheritance(){};
		
		//Make a copy of the baseclass prototype
		Inheritance.prototype = baseClass.prototype;
		
		//Set the subClass' prototype to the same as the baseCalss's prototype
		subClass.prototype = new Inheritance();
		//Reset the subClass's constructor to itself
		subClass.prototype.constructor = subClass;
		
		subClass.baseConstructor = baseClass;
		subClass.superClass = baseClass.prototype;
		
	}
	
	/*
	 * Callback
	 */
	var createCallback = function(thisContext, functionToApply){
		return function(){
			return functionToApply.apply(thisContext, arguments);
		}
	}
	
	/*
	 * Variable Types
	 */
	var isString = function(sString){
		return (typeof(sString) == "string");
	}
	
	var isNumber = function(nNumber){
		return (typeof(nNumber) == "number");
	}
	
	var isObject = function(oObject){
		return (typeof(oObject) == "object");
	}
	
	/*
	 * Counter
	 */
	var count = (function(){
        var nCounter = 0;
        var oCounter = {
            plusOne: function(){
                nCounter++;
                return nCounter;
            },
            reset: function(){
                nCounter = 0;
            }
        };
        return oCounter;
    })();
	
    //Access to counter functions in the above closure
    var fGetNewIdNumber = count.plusOne;
    var fResetCounter = count.reset;
	
	
	/*
	 * Round a number to a certain number of decimal places
	 */
	var roundPrecisely = function(nNumber, nDecimalPlaces){
		return Math.round(nNumber * Math.pow(10,nDecimalPlaces))/Math.pow(10, nDecimalPlaces)
	}
	
	
	var jshelper = {
		extend: extend,
		isString: isString,
		isNumber: isNumber, 
		isObject: isObject,
		getNewIdNumber: fGetNewIdNumber,
		resetCounter: fResetCounter,
		roundPrecisely: roundPrecisely
	}
	return jshelper;
	
});