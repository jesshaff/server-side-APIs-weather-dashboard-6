var cities [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl=document.querySelector("#searched-city");
var fcstTitle=document.querySelector("#fcst");
var fcstContainerEl=document.querySelector("#five-day-fcst");
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
    var apiURL = 'api.openweathermap.org/data/2.5/weather?q=${city name}&units=imperial&appid=${API key}'

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};