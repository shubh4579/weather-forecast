const apiKey = "e6c85ac6cdb1a42e662e3894c1756b91";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".live-location");
const forecastBox = document.querySelector(".forecast");

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        exactFunc(data);
        getForecast(data.name);
      },
      (error) => {
        alert("location access denied or unavailable");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status === 404) {
    document.querySelector(".error-msg").classList.remove("hidden");
    document.querySelector(".weather").classList.add("hidden");
    document.querySelector(".forecast").classList.add("hidden");
    document.querySelector(".forecast-heading").classList.add("hidden");
  } else {
    var data = await response.json();
    exactFunc(data);
    getForecast(city);
  }
}
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
                    <img src="../images/humidity.png" alt="humidity" class="w-5 h-5">
                    <p class="text-sm ">${weatherItem.main.humidity}%</p>
                </div>
                <p class="text-xs  mb-2">Humidity</p>

                <div class="flex items-center gap-2 mb-1">
                    <img src="../images/wind-speed.png" alt="wind" class="w-5 h-5">
                    <p class="text-sm ">${weatherItem.wind.speed} Km/h</p>
                </div>
                <p class="text-xs ">Wind Speed</p>
            </div>`;
};
async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  const uniqueForcastdays = [];
  const fiveDaysForecast = data.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForcastdays.includes(forecastDate)) {
      return uniqueForcastdays.push(forecastDate);
    }
  });
  forecastBox.innerHTML = "";
  console.log(fiveDaysForecast);
  fiveDaysForecast.slice(1, 6).forEach((weatherItem) => {
    forecastBox.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
  });
}

function getWeatherImage(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      return "../images/sun.png";
    case "Clouds":
      return "../images/cloudy.png";
    case "Rain":
      return "../images/rain.png";
    case "Drizzle":
      return "../images/lighting.png";
    case "Thunderstorm":
      return "../images/thunderstorm.png";
    case "Snow":
      return "../images/snow.png";
    case "Mist":
    case "Haze":
    case "Fog":
      return "../images/foggy.png";
    case "Dust":
    case "Sand":
    case "Ash":
      return "../images/dust.png";
    default:
      return "../images/default.png";
  }
}

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

searchBtn.addEventListener("click", () => {
  const searchBoxTrimmedValue = searchBox.value.trim();
  if (searchBoxTrimmedValue === "") {
    alert("Enter the City Name");
    return;
  }
  checkWeather(searchBoxTrimmedValue);
});
locationBtn.addEventListener("click", () => {
  getCurrentLocation();
});
