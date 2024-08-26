// DOM Elements
const search = document.querySelector(".weather-searchform");
const weatherBody = document.querySelector(".weather-body");
const searchBtn = document.querySelector(".search-btn");
const errorBox = document.querySelector(".error");
const loading = document.querySelector(".loading");
const showWeather = document.querySelector(".show-weather");
const weatherForcastBody = document.querySelector(".weather-forcast-body");
const weatherSearch = document.querySelector(".weather-search");
const weatherType = document.querySelector(".weather-type");

// Temperature Unit Buttons
const celciusBtn = weatherType.children[0];
const fahrenheitBtn = weatherType.children[1];

// API Configuration
const api = {
  base_api: "https://api.weatherapi.com/v1/",
  key: "b064254d243b43b8962100827242508",
};

// Temperature Unit State
let isCelsius = true;

// Helper Functions
function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function updateTemperatureDisplay() {
  const weatherTemperature = document.querySelector(".weather-temperature");
  const weatherRealFeel = document.querySelector(".weather-realfeel");
  const weatherWind = document.querySelector(".weather-wind");

  if (currentWeatherData) {
    const temp = isCelsius ? currentWeatherData.current.temp_c : toFahrenheit(currentWeatherData.current.temp_c);
    const realFeel = isCelsius ? currentWeatherData.current.feelslike_c : toFahrenheit(currentWeatherData.current.feelslike_c);
    const wind = isCelsius ? currentWeatherData.current.windchill_c : toFahrenheit(currentWeatherData.current.windchill_f);

    weatherTemperature.innerHTML = `${temp.toFixed(1)}&#176 ${isCelsius ? "C" : "F"}`;
    weatherRealFeel.innerHTML = `${realFeel.toFixed(1)}&#176 ${isCelsius ? "C" : "F"}`;
    weatherWind.innerHTML = `${wind.toFixed(1)} m/s`;
  }
}

function convertToAMPM(timeString) {
  let [hour, minute] = timeString.split(":");
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function Customgetday(dataString, getOnlyDay = false) {
  const d = new Date(dataString);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return getOnlyDay ? day : `${day}, ${month} ${date}, ${year}`;
}

// Display Functions
function displayWeather(weatherData) {
  currentWeatherData = weatherData;

  const splitTime = weatherData.location.localtime.split(" ")[1];
  const formattedTime = convertToAMPM(splitTime);

  const weatherCity = document.querySelector(".weather-city");
  const weatherDateTime = document.querySelector(".weather-datetime");
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherForecastTypeText = document.querySelector(".weather-forecast-text");
  const weatherHumidity = document.querySelector(".weather-humidity");
  const weatherPressure = document.querySelector(".weather-pressure");

  const icon = `https:${weatherData.current.condition.icon}`;

  weatherCity.innerHTML = `${weatherData.location.name}, ${weatherData.location.country}`;
  weatherDateTime.innerHTML = `${Customgetday(weatherData.location.localtime)} at ${formattedTime}`;
  weatherIcon.innerHTML = `<img src=${icon} alt=${weatherData.current.condition.text}>`;
  weatherForecastTypeText.innerHTML = `<h4>${weatherData.current.condition.text}</h4>`;
  weatherHumidity.innerHTML = `${weatherData.current.humidity}%`;
  weatherPressure.innerHTML = `${weatherData.current.pressure_mb.toFixed()} hPa`;

  updateTemperatureDisplay();
  futureForcast(weatherData);

  search.value = "";
}

function futureForcast(weatherData) {
  weatherForcastBody.innerHTML = weatherData.forecast.forecastday
    .map(item =>
      `<div class="weather-forcast">
        <p>${Customgetday(item.date, true)}</p>
        <div><img src=${item.day.condition.icon}></div>
        <p>min: ${isCelsius ? item.day.mintemp_c : toFahrenheit(item.day.mintemp_c).toFixed(1)}&#176 ${isCelsius ? "C" : "F"}</p>
        <p>max: ${isCelsius ? item.day.maxtemp_c : toFahrenheit(item.day.maxtemp_c).toFixed(1)}&#176 ${isCelsius ? "C" : "F"}</p>
      </div>`
    )
    .join("");
}

// Event Listeners
weatherSearch.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchGetWeatherData();
  search.value = "";
});

searchBtn.addEventListener("click", fetchGetWeatherData);

celciusBtn.addEventListener("click", () => {
  isCelsius = true;
  updateTemperatureDisplay();
});

fahrenheitBtn.addEventListener("click", () => {
  isCelsius = false;
  updateTemperatureDisplay();
});

// Fetch Weather Data
async function fetchGetWeatherData() {
  errorBox.innerHTML = "";
  if (!search.value.trim()) {
    loading.style.display = "block";
    errorBox.innerHTML = "City Name must be provided.";
    loading.style.display = "none";
    return;
  }

  loading.style.display = "block";
  try {
    const response = await fetch(`${api.base_api}forecast.json?key=${api.key}&q=${search.value}&days=7`, { method: "GET" });
    const result = await response.json();

    if (result) {
      displayWeather(result);
      showWeather.style.display = "block";
    }

    loading.style.display = "none";
  } catch (error) {
    errorBox.innerHTML = "Input Valid City Name";
    search.value = "";
    loading.style.display = "none";
  }
}
