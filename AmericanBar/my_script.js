$(document).ready(function(){

	/*
	 * Fill drinks section
	 */
	var cocktails = getCocktails();
	var wine = getWine();
	var beer = getBeer();
	var allDrinks = [cocktails, wine, beer];

	for(var j=0; j<allDrinks.length; j++){
		// Each column represents a specific type of drink
		// therefore, they are filled one at a time
		var columnID = $('.drinks').find("#column" + (j+1));
		//var columnID = "#column" + (j+1);
		var currentDrink = allDrinks[j];
		var len = allDrinks[j].length;

		for(var i=0; i < len; i++){
		var name = currentDrink[i].name;
		var description = currentDrink[i].description;
		var price = currentDrink[i].price;
		var addHTML = '<div class="item">'
					+ '<div class="drinkTitle">' + name + '</div>'
					+ '<div class="drinkPrice">' + price + '</div>'
					+ '<div class="drinkDescription"><p>' + description + '</p></div>'
					+ '</div>';
		$(columnID).append(addHTML);
		console.log("drinks ColumnID  ----------- " + JSON.stringify(columnID));

	}//end for-i
	}//end for-j

	/*
	 * Fill menu section
	 * This section has a slightly different strategy than the drinks.
	 * Food items are categorized as starters, sandwiches, and mains.
	 * Within each category, the columns are filled evenly. For instance, instead
	 * of putting all starters into the same column, starters will be distributed
	 * among the columns such that items are placed in column 0, then 1, then 2,
	 * then 0, 1, 2 and so on until all food items are printed.
	 */


	var starters = getStarters();
	var sandwiches = getSandwiches();
	var mains = getMains();
	var foodArrays = [starters, sandwiches, mains];
	var foodIDs = ['#starters', '#sandwiches', '#mains'];

	//For each type of food
	for(k=0; k<foodIDs.length; k++){
		var currentID = foodIDs[k];
		console.log("current ID is  " + currentID);
		var currentArray = foodArrays[k];
		//Start filling all menu items
		for(var i=0; i<currentArray.length; i++){

			//Get menu item information
			var name = currentArray[i].name;
			var description = currentArray[i].description;
			var price = currentArray[i].price;
			var addHTML = '<div class="item">'
						+ '<div class="foodTitle">' + name + '</div>'
						+ '<div class="foodPrice">' + price + '</div>'
						+ '<div class="foodDescription"><p>' + description + '</p></div>'
						+ '</div>';

			//Fill the 3 columns evenly with the menu selection
			var currentColumn = $(currentID).find("#column" + ((i%3)+1));

			//Add new html to the selected column
			currentColumn.append(addHTML);

		}// end for-i
	}// end for-k

    /*
	* Smooth Scrolling
	*/
	$("a").on('click', function(event) {
	  // Make sure this.hash has a value before overriding default behavior
	  if (this.hash !== "") {
	    // Prevent default anchor click behavior
	    event.preventDefault();

	    // Store hash
	    var hash = this.hash;

	    // Using jQuery's animate() method to add smooth page scroll
	    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
	    $('html, body').animate({scrollTop: $(hash).offset().top}, 800, function(){

	        // Add hash (#) to URL when done scrolling (default click behavior)
	        window.location.hash = hash;
	    });
	  } // End if
	});//End click listener



	/*
	 * Animate the slider using the side arrows
	 */
	var counter = 0;
    var numSlides = $('.innerwrap > div').length;

    var handlePreviousSlide = function(){
		if (counter > 0) {
            counter--;
            var advance = counter * (100 / numSlides);
            $('.inner').animate({
                left: "-" + advance + "%"
            }, 400, "easeInOutQuart");
        }
	}

    var handleNextSlide = function(){
		if (counter < (numSlides - 1)) {
            counter++;
            var advance = counter * (100 / numSlides);
            $('.inner').animate({
                left: "-" + advance + "%"
            }, 400, "easeInOutQuart");
        }
	}

    $('#next').click(handleNextSlide);
    $('#prev').click(handlePreviousSlide);


	/*
	 * Swipe
	 */
    document.getElementById('foodSlideshow').addEventListener('touchstart', handleTouchStart, false);
    document.getElementById('foodSlideshow').addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt){
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt){
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
		console.log("xDiff = " + xDiff);
		console.log("yDiff = " + yDiff);

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 5) {
                /* swipe left */
				handleNextSlide();
            }
            else {
				if (xDiff < 5){
					/* swipe right */
				    handlePreviousSlide();
				}
            }
        }
        else {
            if (yDiff > 0) {
                /* up swipe */
            }
            else {
                /* down swipe */
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };


});
