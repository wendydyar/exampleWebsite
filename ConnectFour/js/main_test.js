requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        test: '../test',
		base: '../base'
    }
});

// Start the main app logic.
requirejs(['jquery', 'test/testmanager'],
function   ($,             testmanager) {
    //jQuery and test/testmanager, etc... modules are all loaded and can be used here now.

	//Test Manager
	var oTestManager = new testmanager.TestManager();
	
	//Get next optimal move for built-in example
	var oMove = oTestManager.runTest();
	console.log("\n\nThe optimal move is => " + oMove.getId());
});