package com.selenium.TestConnectFourDifficultyLevel;

import static org.junit.Assert.*;

import org.junit.Test;

public class TestConnectFourDifficultyLevelTestJUnit {

	@Test
	public void testSimpleVsAdvancedAI() throws InterruptedException {
		String winningPlayer = TestConnectFourDifficultyLevel.simpleVsAdvancedAI();
		assertEquals("Error: The expected winning player is the Computer.", winningPlayer, "Computer");
	}
}
