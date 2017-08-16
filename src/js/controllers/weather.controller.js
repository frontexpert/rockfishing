rockFishing.controllers.controller('WeatherController', function ($scope, $ionicHistory, $state, currentPosition, WeatherService) {
	var vm = $scope;

	vm.weatherRegion = null;
	vm.toggleSelected = toggleSelected;
	vm.backToHome = backToHome;
	vm.goToWeatherAlert = goToWeatherAlert;
    vm.goToWeatherSearch = goToWeatherSearch;
    
	WeatherService.getWeather(currentPosition.latitude, currentPosition.longitude).then(setMyWeather);

	function setMyWeather(result) {
		if (result.data.status == "success") {
			vm.weatherRegion = result.data.response.weather_regions[0];
			if(vm.weatherRegion != null){
				// add dummy weather alert if empty for demo purposes
				if(vm.weatherRegion.weather_alerts.length < 1){
					//getDummyWeatherAlerts();
				}
                
				var index, len;
				for (index = 0, len = vm.weatherRegion.all_forecasts.length; index < len; ++index) {
					var currentForecast = vm.weatherRegion.all_forecasts[index];
                    
                    // add dateTitle
                    var dateSplit = currentForecast.datestart.split("-");
                    var yyyy = parseInt(dateSplit[0], 10);
                    var mm = parseInt(dateSplit[1], 10);
                    var dd = parseInt(dateSplit[2], 10);
                    currentForecast.dateTitle = getDateName(yyyy, mm, dd);
                    
					// add temperature
					currentForecast.temperature = getTemperature(currentForecast.max_t_prec);
					// add weather summary
					currentForecast.weather_summary = getSummary(currentForecast.weather_code);
					// add tides property
					currentForecast.tides = getTides(currentForecast.datestart);
					// add waves property
					currentForecast.waves = getWaveHeights(currentForecast.datestart);
					// add selected property
					if(index == 0){
						currentForecast.selected = true;
					} else {
						currentForecast.selected = false;
					}
				}
                
                // add current region to cache
                WeatherService.setCurrentRegion(vm.weatherRegion);
			}
		}
	}

    function goToWeatherAlert(){
        $state.go('weather-alerts');
    }

    function goToWeatherSearch(){
        $state.go('weather-search');
    }

	function getDummyWeatherAlerts(){
        console.log("adding dummy weather alert");
		if(vm.weatherRegion != null){
			var alert1 = {
				warning_title:"Strong Wind Warning",
        		aac:"NSW_MW006",
        		warning_summary:"",
       			id:"89224",
        		warning_areas:"Macquarie Coast",
                time_start: "2015-12-22 00:00:00",
                time_end: "2015-12-23 00:00:00"
			}
			
			var alert2 = {
				warning_title:"Strong Wind Warning for Tuesday for Macquarie Coast",
        		aac:"NSW_MW006",
        		warning_summary:"",
       			id:"89036",
        		warning_areas:"",
                time_start: "2015-12-22 00:00:00",
                time_end: "2015-12-23 00:00:00"
			}
			
			vm.weatherRegion.weather_alerts.push(alert1);
			vm.weatherRegion.weather_alerts.push(alert2);
		}
	}

	function getTemperature(temperature){
		// rounded down temperature
		return temperature.split('.')[0];
	}

	function getSummary(weatherCode) {
		if (weatherCode == 1) {
			return 'Sunny';
		} else if (weatherCode == 2) {
			return 'Clear';
		} else if (weatherCode == 3) {
			return 'Partly Cloudy';
		} else if (weatherCode == 4) {
			return 'Cloudy';
		} else if (weatherCode == 6) {
			return 'Hazy';
		} else if (weatherCode == 8) {
			return 'Light Rain';
		} else if (weatherCode == 9) {
			return 'Windy';
		} else if (weatherCode == 10) {
			return 'Fog';
		} else if (weatherCode == 11) {
			return 'Showers';
		} else if (weatherCode == 12) {
			return 'Rain';
		} else if (weatherCode == 13) {
			return 'Dusty';
		} else if (weatherCode == 14) {
			return 'Frost';
		} else if (weatherCode == 15) {
			return 'Snow';
		} else if (weatherCode == 16) {
			return 'Stormy';
		} else if (weatherCode == 17) {
			return 'Light Showers';
		} else {
			return 'Unknown';
		}
	}

	function getTides(dateString) {
		var tides = [];
		if (vm.weatherRegion != null && vm.weatherRegion.tides.length > 0) {
			var index, len;
			for (index = 0, len = vm.weatherRegion.tides.length; index < len; ++index) {
				var tide = vm.weatherRegion.tides[index];
				if (tide.datetime.indexOf(dateString) > -1) {
					// removing last char to display only 1 number behind comma
					var height = tide.height.slice(0, -1) + 'M';
					var time = to12HrTime(tide.datetime.slice(-8));
					var state = tide.state.toUpperCase();
					tides.push({
						height: height,
						time: time,
						state: state
					});
				}
			}
		}

		return tides;
	}

	function getWaveHeights(dateString) {
		var waves = [];
		if (vm.weatherRegion != null && vm.weatherRegion.waveheights.length > 0) {
			var index, len;
			for (index = 0, len = vm.weatherRegion.waveheights.length; index < len; ++index) {
				var wave = vm.weatherRegion.waveheights[index];
				if (wave.datetime.indexOf(dateString) > -1) {
					var height = wave.height + "M";
					var time = to12HrTime(wave.datetime.slice(-8));
					waves.push({
						height: height,
						time: time
					});
				}
			}
		}
		return waves;
	}

	function to12HrTime(time) {
		//get all 0 which is not followed by 0, and remove it
		time = time.replace(/^0(?!0)/, '');

		var timeArray = time.split(':');
		var ampm = 'am';
		if (timeArray[0] >= 12) {
			ampm = 'pm';
		}
		if (timeArray[0] > 12) {
			timeArray[0] = timeArray[0] - 12;
		}

		return timeArray[0] + ':' + timeArray[1] + ampm;
	}

	function toggleSelected(index) {
		vm.weatherRegion.all_forecasts[index].selected = !vm.weatherRegion.all_forecasts[index].selected;
	}
	
    function getDateName(yyyy, mm, dd) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        var dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        var dateJS = new Date(yyyy, mm -1, dd);
        var dayName = dayNames[dateJS.getDay()];
        var monthName = monthNames[dateJS.getMonth()];
        var fullDate = dayName + ", " + dd + " " + monthName + " " + yyyy;
        return fullDate;
    }
    
	function backToHome() {
		$state.go('home');
	}
});