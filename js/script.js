$(document).ready(function () {


	$("#search").on("click", function () {
		$("div").html("");
		var city = $("#term").val();
		
		if(city) {
			for (var j = 1; j <= 10; j++) {

				$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=" + j +"&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
					var arrayOfObjects = data.resultsPage.results.venue;
					for (var i = arrayOfObjects.length - 1; i >= 0; i--) {
						if(arrayOfObjects[i].website) {
							$("#container").append("<div>" + arrayOfObjects[i].website + "</div>");
						}
					}
				});
			}
		} else {
			alert("Please enter a city like: san diego")
		}

	});

});