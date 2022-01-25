$(document).ready(function () {
    let searchHistory = [];
    const APIKey = "b212266a3b5800f1c727bf9539b273bb";
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        $(".card-deck").empty();
        $(".lead").empty();
        $(".display-4").empty();
        let location = $('#input').val();
        searchHistory.push(location);
        getWeatherData(location);
        localStorage.setItem('cities', JSON.stringify(searchHistory));
    })
    var getWeatherData = function (location) {
        var currentDay = moment().format('dddd, MMMM Do');
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var temperature = Math.floor(((response.main.temp) - 273.15) * 1.80 + 32)
            var feelsLike = Math.floor(((response.main.feels_like) - 273.15) * 1.80 + 32)
            var humidity = response.main.humidity
            var windspeed = response.wind.speed
            var cityName = response.name;
            var description = response.weather[0].description;
            console.log(description)
            var icon = response.weather[0].icon
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $('#cityName').html(cityName)
            $('#date').append(" " + currentDay);
            $('#temp').append(temperature + "°F"+
            ` <img src='http://openweathermap.org/img/wn/${icon}.png' height='500px' class="img-fluid" alt="Responsive image"> `);
            $('#feelsLike').append(` Feels Like ${feelsLike}°`);
            $('#description').append(description);
            $('.lead').append('<br>Humidity: ' + humidity + "%");
            $('.lead').append('<br>Windspeed: ' + windspeed + "mph");
            getFiveDayForecast(lat, lon);
        })

    }
    var getFiveDayForecast = function (lat, lon) {
        var queryURL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
            for (var i = 1; i < 6; i++) {
                var nextDay = moment().add(i, 'days').format('ddd');
                var cardIcon = response.daily[i].weather[0].icon;
                var cardMin = Math.floor(((response.daily[i].temp.min) - 273.15) * 1.80 + 32);
                var cardMax = Math.floor(((response.daily[i].temp.max) - 273.15) * 1.80 + 32);

                $('.card-deck').append(`<div class='card'>
             <div class='card-body'>
                 <h6 class='card-title'>${nextDay}</h6>
                 <p class='card-text'id ="card${i}"> ${cardMin}°F | ${cardMax}°F <img src='http://openweathermap.org/img/wn/${cardIcon}.png' class="img-fluid" alt="Responsive image"></p>
             </div>`);
            }
        });
    };
    var search = function () {
        var searched = JSON.parse(localStorage.getItem("cities"));
        console.log(searched)
        if (searched !== null) {
            searchHistory = searched;
            for (var i = 0; i < searched.length; i++) {
                $('.list-group').append(`<li class='list-group-item btn' id='button' value='${searched[i]}'>${searched[i]}</li>`);
            }
        }
        if (searchHistory !== null) {
            var lastLocation = searchHistory[searchHistory.length - 1]
            getWeatherData(lastLocation);
        }
    }
    search();
    $(document).on('click', '#button', function () {
        $(".card-deck").empty();
        $(".lead").empty();
        $(".display-4").empty();
        newLocation = $(this).attr("value");
        getWeatherData(newLocation);
    });

});