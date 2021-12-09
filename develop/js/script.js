var cities [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl=document.querySelector("#searched-city");
var fcstTitle=document.querySelector("#fcst");
var fcstContainerEl=document.querySelector("#five-day-fcst");
var pastSearchBtnEl=document.querySelector("#past-search-btns")

var formSubmitHandler = function(event) {
    var city = cityInputEl.ariaValueMax.trim();
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
    pastSearchBtnEl(city);
}