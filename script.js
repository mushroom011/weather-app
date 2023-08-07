const API_KEY = "d5c08c53fba74e669fb145913233107";
const BASE_URL = "http://api.weatherapi.com/v1";

const getForecast = async (location) => {
  try {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=3`);
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

const processJsonData = ({ current, forecast, location }) => {
  const {
    condition,
    feelslike_c,
    last_updated,
    temp_c,
    humidity,
    wind_kph,
  } = current;
  return {
    locationName: location.name,
    forecastDays: forecast.forecastday,
    currentWeather: {
      condition,
      feelslike_c,
      last_updated,
      temp_c,
      humidity,
      wind_kph,
    },
  };
};

const showLocation = (locationName) => {
  const locationContainer = document.querySelector("#location");
  locationContainer.textContent = locationName;
};

const showCurrentWeather = ({
  condition,
  feelslike_c,
  last_updated,
  temp_c,
  humidity,
  wind_kph,
}) => {
  const conditionContainer = document.querySelector("#condition");
  const conditionIconContainer = document.querySelector("#conditionIcon");
  const tempContainer = document.querySelector("#temp");
  const feelslikeContainer = document.querySelector("#feelslike");
  const updatedContainer = document.querySelector("#updated");
  const humidityContainer = document.querySelector("#humidity");
  const windContainer = document.querySelector("#wind");

  conditionContainer.textContent = condition.text;
  conditionIconContainer.src = condition.icon;
  conditionIconContainer.alt = condition.text;
  tempContainer.textContent = `${temp_c}°C`;
  feelslikeContainer.textContent = `Feels like: ${feelslike_c}°C`;
  updatedContainer.textContent = `Updated: ${last_updated}`;
  humidityContainer.textContent = `Humidity: ${humidity}%`;
  windContainer.textContent = `Wind: ${wind_kph}kph`;
};

const showForecast = (forecastDays) => {
  const forecastContainer = document.querySelector("#forecast");
 
  const forecast = forecastDays.map(({ day, date }) => {
    const { condition, avgtemp_c } = day;
    const card = document.createElement("div");
    const dateP = document.createElement("p");
    const conditionP = document.createElement("p");
    const conditionIcon = document.createElement("img");
    const avgtempP = document.createElement("p");

    card.classList.add("forecast-weather", "card");
    dateP.classList.add('date');
    dateP.textContent = date;
    conditionP.textContent = condition.text;
    conditionIcon.src = condition.icon;
    conditionIcon.alt = condition.text;
    avgtempP.textContent = `${avgtemp_c}°C`;
    card.append(dateP, conditionIcon, avgtempP, conditionP);
    return card;
  });

  forecastContainer.replaceChildren(...forecast);
};

const addDataToDom = ({ locationName, forecastDays, currentWeather }) => {
  showLocation(locationName);
  showCurrentWeather(currentWeather);
  showForecast(forecastDays);
};

const locationFormHandler = (e) => {
  e.preventDefault();
  const locationForm = document.querySelector('#locationForm');
  const locationInput = document.querySelector('#locationInput');
  const location = locationInput.value;

  getForecast(location).then(processJsonData).then(addDataToDom);
  locationForm.reset();
}

const locationForm = document.querySelector('#locationForm');
locationForm.addEventListener('submit', locationFormHandler);

getForecast('new york').then(processJsonData).then(addDataToDom);

