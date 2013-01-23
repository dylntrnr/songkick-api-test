$(document).ready(function () {


	var search = function () {
		$("#container").html("");
		$("#hidden").removeClass("hide");
		var city = $("#term").val();
		var artist = $("#term2").val();
		var number = $("#term3").val();

		if(artist && city) {
			getWebsitesOfArtistForCity(city, artist);
		} else if(artist && !city) {
			getArtistIDAndCallGigo(artist);
		} else if(city) {
			if(number) {
				getWebsites(city, number);

			} else {

				getWebsites(city);
			}
			
		} else {
			alert("Please enter a city like: san diego or artist like: larusso");
		}

	};

	var getArtistIDAndCallGigo = function (artist) {
		var artistId;
		$.getJSON("http://api.songkick.com/api/3.0/search/artists.json?query=" + artist + "&page=1&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				artistId = data.resultsPage.results.artist[0].id;
				
				getArtistGigographyAndCallVenueInfo(artistId);
			});


	};

	

	var getWebsites = function  (city, pageNumber) {

		if(!pageNumber) {
			$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=1&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
					var arrayOfObjects = data.resultsPage.results.venue;
					var numberOfPages = Math.floor(data.resultsPage.totalEntries / data.resultsPage.perPage);
					for (var i = arrayOfObjects.length - 1; i >= 0; i--) {
						if(arrayOfObjects[i].website) {
							$("#container").append("<div><a target='_blank' href=" + $.trim(arrayOfObjects[i].website) + ">" + arrayOfObjects[i].website + "</a></div>");
						}

					}
				getWebsites(city, numberOfPages);
			});
		} else if (pageNumber > 1) {
			$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=" + pageNumber + "&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
					var arrayOfObjects = data.resultsPage.results.venue;
					for (var i = arrayOfObjects.length - 1; i >= 0; i--) {
						if(arrayOfObjects[i].website) {
							$("#container").append("<div><a target='_blank' href=" + $.trim(arrayOfObjects[i].website) + ">" + arrayOfObjects[i].website + "</a></div>");
						}

					}
				getWebsites(city, (pageNumber - 1));
			});
		} else{
			console.log("ended recursive loop");

			$("#hidden").addClass("hide");
		}

	};

	var	getArtistGigographyAndCallVenueInfo = function (artistId) {
		$.getJSON("http://api.songkick.com/api/3.0/artists/" + artistId + "/gigography.json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

			if(data.resultsPage.results.event) {
				for (var i = 0; i < data.resultsPage.results.event.length; i++) {
				fromIdGetVenueInfo(data.resultsPage.results.event[i].venue.id);
				}
			} else {
				console.log("nothing was returned");
			}

		});

	};



	var fromIdGetVenueInfo = function (venueId) {
		if(venueId) {
			$.getJSON("http://api.songkick.com/api/3.0/venues/" + venueId + ".json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

				var venueObject = data.resultsPage.results.venue;
				if(venueObject.website) {
					$("#container").append("<div><a target='_blank' href=" + $.trim(venueObject.website) + ">" + venueObject.website + "</a></div>");
				}
				if(venueObject.description) {
						$("#container").append("<div><strong>" + venueObject.description + "</strong></div>");
					}

			});
		} else {
			console.log("Returned null");
		}


		$("#hidden").addClass("hide");

	};

	// Code to get venues of a city  for a band
	
	var getArtistIDAndCallGig = function (city, artist) {
		var artistId;
		$.getJSON("http://api.songkick.com/api/3.0/search/artists.json?query=" + artist + "&page=1&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				artistId = data.resultsPage.results.artist[0].id;
				
				getArtistGigographyAndCallVenue(city, artistId);
				
			});


	};
	
	var	getArtistGigographyAndCallVenue = function (city, artistId) {
		$.getJSON("http://api.songkick.com/api/3.0/artists/" + artistId + "/gigography.json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

			if(data.resultsPage.results.event) {
				for (var i = 0; i < data.resultsPage.results.event.length; i++) {
				fromIdGetVenueIn(city, data.resultsPage.results.event[i].venue.id);
				
				}
			} else {
				console.log("nothing was returned");
			}

		});

	};

	var fromIdGetVenueIn = function (city, venueId) {
		if(venueId) {
			$.getJSON("http://api.songkick.com/api/3.0/venues/" + venueId + ".json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

				var venueObject = data.resultsPage.results.venue;
				if(venueObject.city.displayName.toLowerCase() === city) {
					$("#container").append("<div><a target='_blank' href=" + $.trim(venueObject.website) + ">" + venueObject.website + "</a></div>");
				}
				

			});
		} else {
			console.log("Returned null");
		}


		$("#hidden").addClass("hide");

	};


	// End of code to get venues of a city for a band

	var getWebsitesOfArtistForCity = function (city, artist) {
		// alert("Having a city and band name doesn't work quite yet. choose one or the other");
		getArtistIDAndCallGig(city, artist);
	};

	$("#search").on("click", search);
	$('#term').keyup(function(event){
		if(event.keyCode == 13){
			search();
		}
	});
	$('#term2').keyup(function(event){
		if(event.keyCode == 13){
			search();
		}
	});
});