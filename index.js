$(document).ready(function() {
	$('.loading').hide();
	$('.forecast').hide();

	$('.zip-search').keydown(function(e) {
		if(e.which == 13){
			var zipcode = $(this).val();
			var url 		= "http://api.wunderground.com/api/2d6a45f2391a5b29/forecast/q/" + zipcode + ".json";
			$('.loading').show();
			$('.forecast').empty().hide();
			$.ajax({
				url: url,
				success: function(forecast) {
					if(forecast.response.error==undefined){
						$('.loading').hide();
						$('.forecast').show();
						var threeDayForecast 	= extractForecast(forecast);
						dayOne 								= simplifyDetails(threeDayForecast[0]);
						dayTwo 								= simplifyDetails(threeDayForecast[1]);
						dayThree 							= simplifyDetails(threeDayForecast[2]);
						replaceInfo(dayOne, "dayOne");
						replaceInfo(dayTwo, "dayTwo");
						replaceInfo(dayThree, "dayThree");
					} else {
						var errorMessage = forecast.response.error.description;
						$('.loading').hide();
						$('.forecast').show();
						printError(errorMessage);
					}}})}});});

extractForecast = function(forecast) {
	// Drills down into forecast, removes first element (current day)
	forecastArray = forecast.forecast.simpleforecast.forecastday;
	forecastArray.shift();
	return forecastArray;
};

simplifyDetails = function(detailOverload) {
	// Cuts out some of the chaff the API returns and gives us just what we need
	var dayInfo 						= {};
	dayInfo.date 						= detailOverload.date.monthname + " " + detailOverload.date.day;
	dayInfo.conditions 			= detailOverload.conditions;
	dayInfo.high 						= detailOverload.high.fahrenheit;
	dayInfo.low 						= detailOverload.low.fahrenheit;
	dayInfo.weatherIconURL 	= detailOverload.icon_url;
	dayInfo.windSpeed 			= detailOverload.maxwind.mph;
	return dayInfo;
};

replaceInfo = function(oneDayForecast, id) {
	$(".forecast").append(
		"<div class='col-xs-12 col-sm-4'> <div class='weather-card' id="+id +"> <h4>" + oneDayForecast.date + "</h4> <img src=" + oneDayForecast.weatherIconURL + "> <p>" + oneDayForecast.conditions + "</p> <p>High: " + oneDayForecast.high + "<p> <p>Low: " + oneDayForecast.low + "</p> <p>Wind: " + oneDayForecast.windSpeed + " MPH</p> </div> </div>"
	);
};

printError = function(errorMessage) {
	$(".forecast").empty();
	$(".forecast").append("<p>" + errorMessage + ".</p>")
}