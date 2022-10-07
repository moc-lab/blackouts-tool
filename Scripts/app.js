/* custom scripts go here */

(function()
{

	// initialization function. Made it asynchronous so the text files can be loaded asynchronously
	async function Start()
	{
		// sending this message on the console just to know that this file has been loaded correctly and it's executing JavaScript
		console.log("App started...");

		// asynchronous function that loads a text file and returns the content as a string
		async function loadPostalCodes(fileLocation) {
			let response = await fetch(fileLocation);
			if( response.status != 200 ) {
				throw new Error("Couldn't fetch the file: " + fileLocation);
			}
			let retrievedString = await response.text();
			return retrievedString;
		}

		// load the zip codes from the source files
		console.log("Starting to load postal codes...");
		let fileName = "./Content/canadiens.csv";
		let text_data = await loadPostalCodes(fileName);
		let codesCanadiens = text_data.split('\n').map(elem => elem.trim()); // splits the text into array elements and trims each one of the elements
		fileName = "./Content/jets.csv";
		text_data = await loadPostalCodes(fileName);
		let codesJets = text_data.split('\n').map(elem => elem.trim()); // splits the text into array elements and trims each one of the elements
		fileName = "./Content/leafs.csv";
		text_data = await loadPostalCodes(fileName);
		let codesLeafs = text_data.split('\n').map(elem => elem.trim()); // splits the text into array elements and trims each one of the elements
		fileName = "./Content/senators.csv";
		text_data = await loadPostalCodes(fileName);
		let codesSenators = text_data.split('\n').map(elem => elem.trim()); // splits the text into array elements and trims each one of the elements

		console.log("Finished loading postal codes.");

		// get a reference to the HTML element with id=checkButton
		let checkButton = document.getElementById("checkButton");

		// add a callback function to the button when it's clicked
		checkButton.addEventListener("click", () => {
			// the functionality of the button goes here

			console.log("Check button was clicked!"); // checking that the click is being processed here

			// get a reference to the HTML element with id=result
			let result = document.getElementById("result");

			// get a reference to the HTML element with id=team
			let team = document.getElementById("team").value;

			// get a reference to the HTML element with id=zipCode and change it to uppercase
			let zipCode = document.getElementById("zipCode").value.toUpperCase();

			// function that checks if a zip code is valid or not
			let validZipCode = function(zipCode) {
				let regex = new RegExp(/^[A-Z]\d[A-Z]$/i);
				if (regex.test(zipCode))
					return true;  // returns true only when the zipCode complies with the regular expression
				else
					return false;
			};

			// check if the user entered the 3 characters of the zip code
			if (zipCode.length < 3) {
				result.className = "alert alert-danger";
				result.innerHTML = "<p>Please enter the first 3 characters of the postal code.</p>";
			}
			//check if zip code is not present in any Database
			else if ((validZipCode(zipCode) ===  true) && (codesLeafs.includes(zipCode) === false && codesCanadiens.includes(zipCode) === false && codesJets.includes(zipCode) === false && codesSenators.includes(zipCode) === false)){
				result.className = "alert alert-danger";
				result.innerHTML = "<p> The postal code: <b>" + zipCode + "</b> is not present in the Database</p>"
			}
			else {
				if ( validZipCode(zipCode) ) {
					messageTxt = "<p>For the postal code: <b>" + zipCode + "</b></p><p>The <b>" + team + "</b> games are ";
					messageBlack = "<b>Why is the " + team + " game blacked out on TSN in my area?</b><br><br> As TSN owns regional broadcast rights to a package of Winnipeg Jets, Toronto Maple Leafs, Ottawa Senators, and Montreal Canadiens games, we can only broadcast games in the teams’ respective broadcast regions as determined by the NHL."
					messageTxt3 = "If the customer is still not able to view this game;<br>- Get the customer's public ip address (http:whatismyip.com)<br>- Make sure the 'My IP Location' matches the postal code<br>- If ip location does not match, ask customer to check with their ISP provider<br>- Check with the customer's provider if the registered postal code is correct<br>- Escalate to L2 stating time and date of the game<br>- For L2 agents, check in Axis if the correct blackout contraints is applied to this particular game";
					// check the blackout constraint according to the selected team
					switch( team ) {
						case "leafs":
							if ( codesLeafs.includes(zipCode)) {
								result.className = "alert alert-warning";
								messageTxt += "blacked out in your region.</p>";
								messageTxt += messageBlack;
							} else {
								result.className = "alert alert-success";
								messageTxt += "NOT blacked out in your region.</p>";
								messageTxt += messageTxt3
							}
							break;
						case "canadiens":
							if ( codesCanadiens.includes(zipCode)) {
								result.className = "alert alert-warning";
								messageTxt += "blacked out in your region.</p>";
								messageTxt += messageBlack;
							} else {
								result.className = "alert alert-success";
								messageTxt += "NOT blacked out in your region.</p>";
							}
							break;
						case "senators":
							if ( codesSenators.includes(zipCode)) {
								result.className = "alert alert-warning";
								messageTxt += "blacked out in your region.</p>";
								messageTxt += messageBlack;
							} else {
								result.className = "alert alert-success";
								messageTxt += "NOT blacked out in your region.</p>";
							}
							break;
						case "jets":
							if ( codesJets.includes(zipCode)) {
								result.className = "alert alert-warning";
								messageTxt += "blacked out in your region.</p>";
								messageTxt += messageBlack
							} else {
								result.className = "alert alert-success";
								messageTxt += "NOT blacked out in your region.</p>";
							}
							break;
					}
					result.innerHTML = messageTxt;
				}
				else {
					result.className = "alert alert-danger";
					result.innerHTML = "<p>The postal code <b>" + zipCode + "</b> is not valid.</p>";
				}
			}
		});
			
		
	} // end of Start()

	// event listener, when the window has finished loading, it calls the Start function
	window.addEventListener("load", Start)

})();
