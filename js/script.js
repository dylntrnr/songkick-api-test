$(document).ready(function () {

	Parse.initialize("HnvAxdeWqP9ixgKMmYWOK3u2CLSud28sojjqF17Z", "qcYcwk1KuUx3EDbjr3jDBbsNT6eYH3JeZLNhCalG");

	var VenuesObject = Parse.Object.extend("VenuesObject");
	var venuesObject = new VenuesObject();

	var search = function () {
		$("#container").html("");
		$("#hidden").removeClass("hide");
		var city = $("#term").val();
		var artist = $("#term2").val();

		if(artist && city) {
			getWebsitesOfArtistForCity(city, artist);
		} else if(artist && !city) {
			getArtistIDAndCallGigo(artist);
		} else if(city) {
			getWebsites(city);
			
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

		var template = $("#testTpl").html();
		$("#page").html(pageNumber);

		if(!pageNumber) {
			pageNumber = 1;
		}


		
		$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + city + "&page=" + pageNumber + "&apikey=vDtvjogcJwz6gi6J&jsoncallback=?", function(data){
				var arrayOfObjects = data.resultsPage.results.venue;
				var numberOfPages = Math.floor(data.resultsPage.totalEntries / data.resultsPage.perPage);
				var html = Mustache.to_html(template, data.resultsPage.results);
				$("#container").html(html);

		});
	
		$("#hidden").addClass("hide");
		

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
				
				venuesObject.save("website", venueObject.website);

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