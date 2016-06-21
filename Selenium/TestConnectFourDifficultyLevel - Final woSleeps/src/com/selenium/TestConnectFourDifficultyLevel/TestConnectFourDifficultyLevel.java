package com.selenium.TestConnectFourDifficultyLevel;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;

import static org.junit.Assert.*;
import org.junit.Test;

public class TestConnectFourDifficultyLevel {

	public static final String PATH_TO_CONNECTFOUR = "//*[@id=\"work\"]/div/div[2]/div[3]/p/a";
	public static WebDriver driver;
	public static String windowHandleHardGame;
	public static String windowHandleEasyGame;
	public static String windowHandleCurrent;
	public static String winningPlayer;
	
	public static String simpleVsAdvancedAI() throws InterruptedException {
		
		//Start a new webdriver
		driver = new FirefoxDriver();
		
		//Setup the test by creating 2 new games
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		setupTest(driver);
		
		//Run test by alternating plays between the two games
		driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
		runTest(driver);
		
		//Return 
		return winningPlayer;
	}

	/*
	 * 
	 * Setup and Run Game 
	 * 
	 */
	public static void switchWindows(){
		if(windowHandleCurrent == windowHandleHardGame){
			windowHandleCurrent = windowHandleEasyGame;
		}else{
			windowHandleCurrent = windowHandleHardGame;
		}
		driver.switchTo().window(windowHandleCurrent);
	}
	
	public static void setupTest(WebDriver driver) throws InterruptedException {
		//Setup window size
		driver.manage().window().setSize(new Dimension(1000, 600));
	    
		//Navigate to the home page of the github site
	    driver.get("http://wendydyar.github.io/");
	    //Setup Home Handle
	    String windowHandleHome = driver.getWindowHandle();
	    //Scroll to view link
	    
	    executeJavascript(driver, "window.scrollBy(0, 500);");
	    
	    
		//Setup element to click in order to start a new game
		WebElement eConnectFourLink = driver.findElement(By.xpath(PATH_TO_CONNECTFOUR));
				
		//Start New Games
		eConnectFourLink.click();
		eConnectFourLink.click();
		
		//Close homepage
		driver.close();
		
		//Get the handles for the 2 new games
		Set<String> handles = driver.getWindowHandles();
		windowHandleEasyGame = (String) handles.toArray()[0];
		windowHandleHardGame = (String) handles.toArray()[1];
		
		
		//Resize and position
		driver.switchTo().window(windowHandleEasyGame);
		driver.manage().window().setPosition(new Point(0,0));
		driver.manage().window().setSize(new Dimension(700, 800));
		driver.switchTo().window(windowHandleHardGame);
		driver.manage().window().setPosition(new Point(700,0));
		driver.manage().window().setSize(new Dimension(700, 800));
		
		
		//Wait for pages to load
		driver.switchTo().window(windowHandleHardGame);
		boolean pageIsLoaded = false;
		while(!pageIsLoaded){
			//Check for an element that should be there, if it exists change page status to pageIsLoaded = true
			if(driver.findElement(By.id("interactionColumnContainer")).isDisplayed()){
				pageIsLoaded = true;
			}
		}
		
		//Setup Game for Easy Level (user plays first)
		driver.switchTo().window(windowHandleEasyGame);
		driver.findElement(By.id("closeButton")).click();
		String scriptEasyGameLevel = "var oNewOptions = {              \n" +
                                    "    bIsSinglePlayer: true,        \n" +
                                    "    nDifficultyLevel: 6,          \n" +
                                    "    bStartWithSecondPlayer: false \n" +
                                    "};                                \n" +
                                    "window.__oGameManager.handleStartNewGame(oNewOptions);";
        executeJavascript(driver, scriptEasyGameLevel);      
		
		//Setup Game for Hard Level (AI plays first)
		driver.switchTo().window(windowHandleHardGame);
		driver.findElement(By.id("closeButton")).click();
		String scriptHardGameLevel = "var oNewOptions = {              \n" +
                                    "    bIsSinglePlayer: true,        \n" +
                                    "    nDifficultyLevel: 10,         \n" +
                                    "    bStartWithSecondPlayer: true  \n" +
                                    "};                                \n" +
                                    "window.__oGameManager.handleStartNewGame(oNewOptions);";
        executeJavascript(driver, scriptHardGameLevel);      
	}
	
	public static void runTest(WebDriver driver) throws InterruptedException {
		
		//AI started the game.
		//Get the last move played by the AI and use it as a guide to play in the "Easy" game.
		driver.switchTo().window(windowHandleHardGame);
		windowHandleCurrent = windowHandleHardGame;
		int lastMoveColumn = getColumnFromLastMove(driver);
		int numGamePiecesOnBoard = getNumberOfGamePieces(driver);
		
		//Play, alternating both windows, until the game is won
		boolean winnerExists = false;
		while(!winnerExists){
			switchWindows();
			numGamePiecesOnBoard = getNumberOfGamePieces(driver);
			performPlayInColumn(driver, lastMoveColumn);
			winnerExists = processPlayResults(driver, numGamePiecesOnBoard);
			lastMoveColumn = getColumnFromLastMove(driver);			
		}
	}
	
	
	/*
	 * 
	 * Helper Functions (execute Javascript commands)
	 * 
	 */
	public static void executeJavascript(WebDriver driver, String script){
		if(driver instanceof JavascriptExecutor){
			((JavascriptExecutor) driver).executeScript(script);
		}
	}
	
	public static int getColumnFromLastMove(WebDriver driver){
		Object response = ((JavascriptExecutor) driver).executeAsyncScript(
			       "var callback = arguments[arguments.length - 1];" +
			       "var nColumnId = window.__oGameManager.getGameModel().getLastMovePlayed().getColumn();" +
			       "callback(nColumnId)");

		long columnLong = (long) response;
		int columnId = (int) columnLong;
		return columnId;
	}
	
	public static int getNumberOfGamePieces(WebDriver driver){
		Object response = ((JavascriptExecutor) driver).executeAsyncScript(
			       "var callback = arguments[arguments.length - 1];" +
			       "var num = window.__oGameManager.getGameModel().getNumberOfMovesPlayed();" +
			       "callback(num)");
			       
		int numGamePieces = (int) ((long) response);
		return numGamePieces;
	}
	
	public static String getCurrentPlayerName(WebDriver driver){
		Object response = ((JavascriptExecutor) driver).executeAsyncScript(
			       "var callback = arguments[arguments.length - 1];" +
			       "var sPlayer = window.__oGameManager.getGameModel().getCurrentPlayer().getName();" +
			       "callback(sPlayer)");
			   
		String playerName = (String) response;
		return playerName;
	}
	
	public static boolean checkWinner(WebDriver driver){
		Object response = ((JavascriptExecutor) driver).executeAsyncScript(
				   "var callback = arguments[arguments.length - 1];             \n" +
			       "var oGameModel = window.__oGameManager.getGameModel();      \n" +
                   "var oRulesEngine = window.__oGameManager.getRulesEngine();  \n" +
                   "window.__oGameManager.checkWinner = function(){             \n" +  
                   "return oRulesEngine.checkWinner(oGameModel)[0];             \n" +
                   "};                                                          \n" +
			       "var returnedValue = window.__oGameManager.checkWinner();    \n" +
			       "callback(returnedValue)");
		boolean winnerFound = (boolean) response; 
		return winnerFound;
	}
	
	/*
	 * 
	 * Play Action Functions
	 * 
	 */
	public static void performPlayInColumn(WebDriver driver, int nColumnId){
		//Find the interaction column element for this columnId
		WebElement el = driver.findElement(By.id(nColumnId + ""));
		
		//Move mouse over to the element and click to release a gamepiece
		Actions builder = new Actions(driver);
		builder.moveToElement(el).click().perform();
	}
	
	public static boolean processPlayResults(WebDriver driver, int numGamePiecesOnBoard){
		boolean winnerExists = false;
		
		//Wait for the Player's move to be complete
		boolean playerMoveComplete = false;
		while(!playerMoveComplete){
			if(getNumberOfGamePieces(driver) == (numGamePiecesOnBoard + 1)){
				playerMoveComplete = true;
			}
		}
		//Check Results for Player
		if(checkWinner(driver) == true){
			winnerExists = true;
			winningPlayer = getCurrentPlayerName(driver);
		}
		
		//Wait for the AI's move to be complete
		boolean aiCounterMoveComplete = false;
		while(!aiCounterMoveComplete){
			if(getNumberOfGamePieces(driver) == (numGamePiecesOnBoard + 2)){
				aiCounterMoveComplete = true;
			}
		}
		//Check Results for AI
		if(checkWinner(driver) == true){
			//Game Winner!
			winnerExists = true;
			winningPlayer = getCurrentPlayerName(driver);	
		}
		return winnerExists;
	}
}
