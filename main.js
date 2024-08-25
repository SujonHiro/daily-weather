const search = document.querySelector(".weather-searchform");
const weatherBody = document.querySelector(".weather-body");
const searchBtn = document.querySelector(".search-btn");
const errorBox = document.querySelector(".error");
const loading = document.querySelector(".loading");
const showWeather = document.querySelector(".show-weather");
const weatherForcastBody = document.querySelector(".weather-forcast-body");
const api = {
  base_api: "http://api.weatherapi.com/v1/",
  key: "b064254d243b43b8962100827242508",
};

searchBtn.addEventListener("click", fetchGetWeatherData);

//Sunday, August 25, 2024 at 6:11 PM
function getday(dataString) {
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


  return `${day}, ${getMonth} ${date}, ${year}`;
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
    console.log(error);
    loading.style.display = "none";
  }
}

function displayWeather(weatherData) {
  //console.log(weatherData);

  const weatherCity = document.querySelector(".weather-city");
  const weatherDateTime = document.querySelector(".weather-datetime");
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherTemperature = document.querySelector(".weather-temperature");
  const weatherForecastTypeText = document.querySelector(
    ".weather-forecast-text"
  );

  const weatherRealFeel = document.querySelector(".weather-realfeel");
  const weatherHumidity = document.querySelector(".weather-humidity");
  const weatherWind = document.querySelector(".weather-wind");
  const weatherPressure = document.querySelector(".weather-pressure");

  const icon = `https:${weatherData.current.condition.icon}`;

  weatherCity.innerHTML = `${weatherData.location.name} , ${weatherData.location.country}`;
  weatherDateTime.innerHTML = getday(weatherData.current.last_updated);
  weatherTemperature.innerHTML = `${weatherData.current.temp_c}&#176 C`;
  weatherIcon.innerHTML = `<img src=${icon} alt=${weatherData.current.condition.text}>`;
  weatherForecastTypeText.innerHTML = `<h4>${weatherData.current.condition.text}</h4>`;
  weatherRealFeel.innerHTML = `${weatherData.current.feelslike_c}&#176 C`;
  weatherHumidity.innerHTML = `${weatherData.current.humidity}%`;
  weatherWind.innerHTML = `${weatherData.current.windchill_c} m/s`;
  weatherPressure.innerHTML = `${weatherData.current.pressure_mb.toFixed()} hPa`;
  search.value = "";
  futureForcast(weatherData);
}

function getOnlyday(dataString) {
    const d = new Date(dataString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[d.getDay()];
    //console.log(day);
    
    return day;
  }


function futureForcast(weatherData) {
  weatherForcastBody.innerHTML = weatherData.forecast.forecastday
    .map((item) =>
      `<div class="weather-forcast">
        <p>${getOnlyday(item.date)}</p>
        <div><img src=${item.day.condition.icon}></div>
        <p>min: ${item.day.mintemp_c}&#176 C</p>
        <p>max: ${item.day.maxtemp_c}&#176 C</p>


        </div>`
    ).join("");
}
