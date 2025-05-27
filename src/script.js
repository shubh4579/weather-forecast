const apiKey = "e6c85ac6cdb1a42e662e3894c1756b91";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".live-location");

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
        console.log(data);
        exactFunc(data);
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
  } else {
    var data = await response.json();
    console.log(data);
    exactFunc(data);
  }
}
function exactFunc(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

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
  const iconImg = getWeatherImage(data.weather[0].main);
  document.querySelector(".weather-image").src = iconImg;
  document.querySelector(".weather").classList.remove("hidden");
  document.querySelector(".error-msg").classList.add("hidden");
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
