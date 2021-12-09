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

// Event Listeners

cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchBtnEl.addEventListener("click", pastSearchHandler);