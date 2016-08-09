requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        connectfour: '../connectfour',
		base: '../base'
    }
});

// Start the main app logic.
requirejs(['connectfour/gamemanager'],
function   (            gamemanager) {
    
	//START!
	var oGameManager = new gamemanager.GameManager();
	oGameManager.startGame();
	
	//Expose Game Manager to window for Selenium testing
	window.__oGameManager = oGameManager;
});