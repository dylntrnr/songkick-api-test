$(document).ready(function () {


	var search = function () {
		$("div").html("");
		var city = $("#term").val();
		var artist = $("#term2").val();

		if(artist) {
			getArtistID(artist);
		}
		
		if(city) {
			getWebsites(city);
			
		} else {
			alert("Please enter a city like: san diego");
		}

	};

	var getArtistID = function (artist) {
		$.getJSON("http://api.songkick.com/api/3.0/search/artists.json?query=" + artist + "&page=1&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				var artistId = data.resultsPage.results.artist[0].id;
				
				getArtistGigography(artistId);
			});

	};

	var getWebsites = function  (city) {
		$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=1&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				var arrayOfObjects = data.resultsPage.results.venue;
				for (var i = arrayOfObjects.length - 1; i >= 0; i--) {
					if(arrayOfObjects[i].website) {
						$("#container").append("<div><a target='_blank' href=" + $.trim(arrayOfObjects[i].website) + ">" + arrayOfObjects[i].website + "</a></div>");
					}
				}
			});
	};

	var	getArtistGigography = function (artistId) {
		$.getJSON("http://api.songkick.com/api/3.0/artists/" + artistId + "/gigography.json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				console.log(data);
				
			});
	};

	$("#search").on("click", search);
});