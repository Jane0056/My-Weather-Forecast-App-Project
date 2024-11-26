// Function to update weather details
function weatherDetail(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity-details");
  let windSpeedElement = document.querySelector("#speed-details");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  // Fetch data from the API response
  let temperature = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let iconUrl = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  let date = new Date();

  // Update elements with API data
  cityElement.innerHTML = cityName;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = `${humidity}%`;
  windSpeedElement.innerHTML = `${windSpeed} km/h`;
  temperatureElement.innerHTML = `${temperature}°C`;
  iconElement.innerHTML = `<img src="${iconUrl}" alt="${description}" class="weather-icon" />`;

  // Call forecast function
  getForecast(cityName);
}

// Function to format the date and time
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

// Function to fetch weather details for a city
function searchCity(city) {
  let apiKey = "0c0fc4d0af9a25bbb3ad3644ab6e153c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then(weatherDetail)
    .catch((error) => console.error("Error fetching weather data:", error));
}

// Function to handle form submission
function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  searchCity(searchInputElement.value.trim());
}

// Function to format day for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Function to get the weather forecast
function getForecast(city) {
  let apiKey = "0c0fc4d0af9a25bbb3ad3644ab6e153c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios(apiUrl)
    .then(displayForecast)
    .catch((error) => console.error("Error fetching forecast data:", error));
}

// Function to display the weather forecast
function displayForecast(response) {
  let forecastHtml = "";
  let forecastList = response.data.list;

  forecastList.forEach(function (forecastItem, index) {
    if (index % 8 === 0) {
      // Use only one forecast item per day (every 24 hours)
      forecastHtml += `
       <div class="weather-forecast-day">

        <div class="weather-forecast-date">${formatDay(forecastItem.dt)}</div>
        <img src="http://openweathermap.org/img/wn/${
          forecastItem.weather[0].icon
        }@2x.png" alt="${
        forecastItem.weather[0].description
      }" class="weather-forecast-icon" />

      <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(forecastItem.main.temp_max)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            forecastItem.main.temp_min
          )}º</div>
        </div>
      </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

// Add event listener to the search form
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", search);

// Fetch default city weather on page load
searchCity("Berlin");
