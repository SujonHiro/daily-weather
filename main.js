const search = document.querySelector(".weather-searchform");
const weatherBody = document.querySelector(".weather-body");
const searchBtn = document.querySelector(".search-btn");
const errorBox = document.querySelector(".error");
const loading = document.querySelector(".loading");
const showWeather = document.querySelector(".show-weather");
const weatherForcastBody = document.querySelector(".weather-forcast-body");
const weatherSearch = document.querySelector(".weather-search");
const weatherType = document.querySelector(".weather-type");

const api = {
  base_api: "http://api.weatherapi.com/v1/",
  key: "b064254d243b43b8962100827242508",
};

const celciusBtn = weatherType.children[0];


const fahrenheitBtn = weatherType.children[1];

currentTempData = null;
isCelsius = true;

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function updateTemperatureDisplay() {
  const weatherTemperature = document.querySelector(".weather-temperature");
  const weatherRealFeel = document.querySelector(".weather-realfeel");

  if (currentWeatherData) {
    const temp = isCelsius
      ? currentWeatherData.current.temp_c
      : toFahrenheit(currentWeatherData.current.temp_c);
    const realFeel = isCelsius
      ? currentWeatherData.current.feelslike_c
      : toFahrenheit(currentWeatherData.current.feelslike_c);

    weatherTemperature.innerHTML = `${temp.toFixed(1)}&#176 ${
      isCelsius ? "C" : "F"
    }`;
    weatherRealFeel.innerHTML = `${realFeel.toFixed(1)}&#176 ${
      isCelsius ? "C" : "F"
    }`;
  }
}

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
//Sunday, August 25, 2024 at 6:11 PM
function Customgetday(dataString, getOnlyDay = false) {
  const d = new Date(dataString);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Novemeber",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let getMonth = months[d.getMonth()];
  let year = d.getFullYear();

  if (getOnlyDay) {
    return day;
  } else {
    return `${day}, ${getMonth} ${date}, ${year} `;
  }
}

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
    const response = await fetch(
      `${api.base_api}forecast.json?key=${api.key}&q=${search.value}&days=7`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    //console.log(result);

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
function convertToAMPM(timeString) {
  let [hour, minute] = timeString.split(":");
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function displayWeather(weatherData) {
  currentWeatherData = weatherData;

  let splitTime = weatherData.location.localtime.split(" ")[1];
  let formattedTime = convertToAMPM(splitTime);

  const weatherCity = document.querySelector(".weather-city");
  const weatherDateTime = document.querySelector(".weather-datetime");
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherForecastTypeText = document.querySelector(
    ".weather-forecast-text"
  );

  const weatherHumidity = document.querySelector(".weather-humidity");
  const weatherWind = document.querySelector(".weather-wind");
  const weatherPressure = document.querySelector(".weather-pressure");

  const icon = `https:${weatherData.current.condition.icon}`;

  weatherCity.innerHTML = `${weatherData.location.name} , ${weatherData.location.country}`;
  weatherDateTime.innerHTML = `${Customgetday(
    weatherData.location.localtime
  )} at ${formattedTime}`;
  weatherIcon.innerHTML = `<img src=${icon} alt=${weatherData.current.condition.text}>`;
  weatherForecastTypeText.innerHTML = `<h4>${weatherData.current.condition.text}</h4>`;

  weatherHumidity.innerHTML = `${weatherData.current.humidity}%`;
  weatherWind.innerHTML = `${weatherData.current.windchill_c} m/s`;
  weatherPressure.innerHTML = `${weatherData.current.pressure_mb.toFixed()} hPa`;
  updateTemperatureDisplay();
  futureForcast(weatherData);

  search.value = "";
}

function futureForcast(weatherData) {
  weatherForcastBody.innerHTML = weatherData.forecast.forecastday
    .map(
      (item) =>
        `<div class="weather-forcast">
        <p>${Customgetday(item.date, true)}</p>
        <div><img src=${item.day.condition.icon}></div>
        <p>min: ${
          isCelsius
            ? item.day.mintemp_c
            : toFahrenheit(item.day.mintemp_c).toFixed(1)
        }&#176 ${isCelsius ? "C" : "F"}</p>
        <p>max: ${
          isCelsius
            ? item.day.maxtemp_c
            : toFahrenheit(item.day.maxtemp_c).toFixed(1)
        }&#176 ${isCelsius ? "C" : "F"}</p>
        </div>`
    )
    .join("");
}
