var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl=document.querySelector("#searched-city");
var fcstTitle=document.querySelector("#fcst");
var fcstContainerEl=document.querySelector("#five-day-container");
var pastSearchBtnEl=document.querySelector("#past-search-btns")

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city!");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Weather data API & API Key 
var getCityWeather = function(city) {
    var apiKey = "a7313793ab38e20ed2769bb38348d413"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity) {
    // clear previous content
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    console.log(weather);

    // Data element
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("dddd, MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // Image Element
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    // Temperature data Element
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    // Humidity data Element
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    // Wind data Element
    var windEl = document.createElement("span");
    windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windEl.classList = "list-group-item"

    // append to containers 

    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
}

var getUvIndex = function(lat,lon) {
    var apiKey = "a7313793ab38e20ed2769bb38348d413"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data)
            console.log(data)
        });
    });
    console.log(lat);
    console.log(lon);
}

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexVal = document.createElement("span")
    uvIndexVal.textContent = index.value

    if(index.value <=2) {
        uvIndexVal.classList = "favorable"
    }
    else if(index.value >2 && index.value<=8) {
        uvIndexVal.classList = "moderate"
    }
    else if(index.value >8) {
        uvIndexVal.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexVal);

    // append to current weather
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function(city) {
    var apiKey = "a7313793ab38e20ed2769bb38348d413"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            display5Day(data);
        })
    })
}

var display5Day = function(weather) {
    fcstContainerEl.textContent = ""
    fcstTitle.textContent = "5-Day Forecast:";

    var fcst = weather.list;
        for(var i=5; i < fcst.length; i=i+8) {
            var dailyFcst = fcst[i];

            var fcstEl = document.createElement("div");
            fcstEl.classList = "card bg-primary text-light m2";

            // Create date element 
            var fcstDate = document.createElement("h5")
            fcstDate.textContent = moment.unix(dailyFcst.dt).format("MMM D, YYYY");
            fcstDate.classList = "card-header text-center"
            fcstEl.appendChild(fcstDate);

            // Create image element
            var weatherIcon = document.createElement("img")
            weatherIcon.classList = "card-body text-center";
            weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyFcst.weather[0].icon}@2x.png`);

            fcstEl.appendChild(weatherIcon);

            // Create temp span
            var fcstTempEl = document.createElement("span");
            fcstTempEl.classList = "card-body text-center";
            fcstTempEl.textContent = dailyFcst.main.temp + " °F";

            fcstEl.appendChild(fcstTempEl);

            var fcstHumEl = document.createElement("span");
            fcstHumEl.classList = "card-body text-center";
            fcstHumEl.textContent = dailyFcst.main.humidity + " %";

            fcstEl.appendChild(fcstHumEl);

            fcstContainerEl.appendChild(fcstEl);
        }
}

var pastSearch = function(pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-dark border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtnEl.prepend(pastSearchEl);
}

var pastSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        get5Day(city);
    }
}

// Event Listeners
cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchBtnEl.addEventListener("click", pastSearchHandler);