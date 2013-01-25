$(document).ready(function () {

	Parse.initialize("HnvAxdeWqP9ixgKMmYWOK3u2CLSud28sojjqF17Z", "qcYcwk1KuUx3EDbjr3jDBbsNT6eYH3JeZLNhCalG");

	var VenuesObject = Parse.Object.extend("VenuesObject");
	var venuesObject = new VenuesObject();

	var search = function (pageNumber) {
		$("#container").html("");
		var city = $("#term").val();
		var artist = $("#term2").val();

		if(!pageNumber) {
			if(artist && city) {
				getWebsitesOfArtistForCity(city, artist);
				$("#hidden").removeClass("hide");
			} else if(artist && !city) {
				getArtistIDAndCallGigo(artist);
				$("#hidden").removeClass("hide");
			} else if(city) {
				getWebsites(city);
				$("#hidden").removeClass("hide");
				
			} else {
				alert("Please enter a city like: san diego or artist like: larusso");
			}
		} else {
			if(artist && city) {
				getWebsitesOfArtistForCity(city, artist);
				$("#hidden").removeClass("hide");
			} else if(artist && !city) {
				getArtistIDAndCallGigo(artist);
				$("#hidden").removeClass("hide");
			} else if(city) {
				getWebsites(city, pageNumber);
				$("#hidden").removeClass("hide");
				
			} else {
				alert("Please enter a city like: san diego or artist like: larusso");
			}
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
		$("#pageBtn").removeClass("hide");
		var template = $("#testTpl").html();

		if(!pageNumber) {
			pageNumber = 1;
		}


		
		$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=" + pageNumber + "&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				var arrayOfObjects = data.resultsPage.results.venue;
				var numberOfPages = Math.floor(data.resultsPage.totalEntries / data.resultsPage.perPage);
				var html = Mustache.to_html(template, data.resultsPage.results);
				$("#container").html(html);

				$("#hidden").addClass("hide");
		});
	
		

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
		
		var template = $("#testTpl").html();

		if(venueId) {
			$.getJSON("http://api.songkick.com/api/3.0/venues/" + venueId + ".json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

				var html = Mustache.to_html(template, data.resultsPage.results);
				$("#container").append(html);
				
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
		var template = $("#testTpl").html();
		if(venueId) {
			$.getJSON("http://api.songkick.com/api/3.0/venues/" + venueId + ".json?apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){

				if(data.resultsPage.results.venue.city.displayName.toLowerCase() === city) {
					
					var html = Mustache.to_html(template, data.resultsPage.results);
					$("#container").append(html);
				}
				
				// venuesObject.save("website", venueObject.website);

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

	var counter = 2;
	$("#pageBtn").on("click", function(event) {
		search(counter);
		counter += 1;
	});

	
});