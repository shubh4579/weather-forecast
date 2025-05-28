// API Configuration
const apiKey = "e6c85ac6cdb1a42e662e3894c1756b91";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
//DOM Element Selection
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".live-location");
const forecastBox = document.querySelector(".forecast");
//get current location function that uses api which is taking latitude and longitude of users
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        //fetch api using latitude and longitude
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        // Display Weather data
        exactFunc(data);
        getForecast(data.name);
        updateSearchHistory(data.name);
      },
      (error) => {
        alert("location access denied or unavailable");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
//update search history fiunction  in dropdown
function updateSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  //remove duplicate city name and add new city to top
  history = history.filter((item) => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  //limit to 5 search history
  if (history.length > 5) history.pop();
  //save to local storage
  localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
  //update dropdown
  SearchDropdown();
}
//Display recent search
function SearchDropdown() {
  const dropdown = document.querySelector(".search-history");
  const history =
    JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  //if no search history is there then dropdown will hidden
  if (history.length === 0) {
    dropdown.classList.add("hidden");
    return;
  }
  dropdown.classList.remove("hidden");
  dropdown.innerHTML = "";

  //Add each city as option

  history.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    dropdown.appendChild(option);
  });
}

// Featch and display weather data

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  //diplay error message when invalid city
  if (response.status === 404) {
    document.querySelector(".error-msg").classList.remove("hidden");
    document.querySelector(".weather").classList.add("hidden");
    document.querySelector(".forecast").classList.add("hidden");
    document.querySelector(".forecast-heading").classList.add("hidden");
  } else {
    var data = await response.json();
    exactFunc(data);
    getForecast(city);
    updateSearchHistory(city);
  }
}

//Create Forecast Card HTML
const createWeatherCard = (weatherItem) => {
  return `<div class="bg-purple-700 rounded-2xl p-4 flex flex-col items-center text-center">
                <p class="text-sm  mb-2">${weatherItem.dt_txt.split(" ")[0]}</p>

                <img src=${getWeatherImage(
                  weatherItem.weather[0].main
                )} alt="sun" class="w-12 h-12 mb-2">

                <h1 class="text-2xl font-semibold mb-2">${Math.round(
                  weatherItem.main.temp
                )}°C</h1>

                <div class="flex items-center gap-2 mb-1">
                    <img src="./images/humidity.png" alt="humidity" class="w-5 h-5">
                    <p class="text-sm ">${weatherItem.main.humidity}%</p>
                </div>
                <p class="text-xs  mb-2">Humidity</p>

                <div class="flex items-center gap-2 mb-1">
                    <img src="./images/wind-speed.png" alt="wind" class="w-5 h-5">
                    <p class="text-sm ">${weatherItem.wind.speed} Km/h</p>
                </div>
                <p class="text-xs ">Wind Speed</p>
            </div>`;
};

//Fetch 5 days weather forecast
async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  //Extract one forecast per day and added in empty array
  const uniqueForcastdays = [];
  const fiveDaysForecast = data.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForcastdays.includes(forecastDate)) {
      return uniqueForcastdays.push(forecastDate);
    }
  });
  //Clear old forecast and display new one
  forecastBox.innerHTML = "";
  console.log(fiveDaysForecast);
  fiveDaysForecast.slice(1, 6).forEach((weatherItem) => {
    forecastBox.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
  });
}
//As per weather condition diplay icon
function getWeatherImage(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      return "./images/sun.png";
    case "Clouds":
      return "./images/cloudy.png";
    case "Rain":
      return "./images/rain.png";
    case "Drizzle":
      return "./images/lighting.png";
    case "Thunderstorm":
      return "./images/thunderstorm.png";
    case "Snow":
      return "./images/snow.png";
    case "Mist":
    case "Haze":
    case "Fog":
      return "./images/foggy.png";
    case "Dust":
    case "Sand":
    case "Ash":
      return "./images/dust.png";
    default:
      return "./images/default.png";
  }
}
//update ui with api data
function exactFunc(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

  const iconImg = getWeatherImage(data.weather[0].main);
  document.querySelector(".weather-image").src = iconImg;
  document.querySelector(".weather").classList.remove("hidden");
  document.querySelector(".error-msg").classList.add("hidden");
  document.querySelector(".forecast").classList.remove("hidden");
  document.querySelector(".forecast-heading").classList.remove("hidden");
  document.querySelector(".forecast-heading").textContent =
    "Next 5-Days Weather Forecast: " + data.name;
}
//Search button Event Listener
searchBtn.addEventListener("click", () => {
  const searchBoxTrimmedValue = searchBox.value.trim().toUpperCase();
  //empty search box then trigger alert message
  if (searchBoxTrimmedValue === "") {
    alert("Enter the City Name");
    return;
  }
  checkWeather(searchBoxTrimmedValue);
});
//Live location button click
locationBtn.addEventListener("click", () => {
  getCurrentLocation();
});
// Dropdown Selection
document.querySelector(".search-history").addEventListener("change", (e) => {
  const selectedCity = e.target.value;
  // A valid city was selected
  if (selectedCity && selectedCity !== "Recent Searches") {
    //call checkweather function to display weather using dropdown
    checkWeather(selectedCity);
  }
});
//Enable the Enter button functionality
searchBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

//call dropdown
SearchDropdown();
