// Fetch weather data from OpenWeatherMap using city name and API key
const API_KEY = "1d1229efda85d17f522e4bf18fa49c3c";
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const weatherDetails = document.getElementById('weather-details');
const placeholder = document.getElementById('placeholder');
const cityName = document.getElementById('city-name');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');



//  ****************** events ************************

searchButton.addEventListener("click", ()=>{
    const city = cityInput.value.trim();
    if(city === ''){
        errorText.textContent = "Please enter a city name.";
        errorEl.classList.remove('hidden');
        return;
    }
    errorEl.classList.add('hidden');
     placeholder.classList.add('hidden');      
    weatherDetails.classList.add('hidden');    
    loadingEl.classList.remove('hidden');      
    fetchWeather(city);                        

});
async function fetchWeather(city) {
    // Step 1: Get coordinates for the city/town
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    
    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        // If no location is found, throw an error
        if (geoData.length === 0) {
            throw new Error('Location not found. Please check the spelling.');
        }

        const { lat, lon, name } = geoData[0];

        // Step 2: Fetch weather using the coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (weatherResponse.status === 404) {
            throw new Error('Weather data not found for this location.');
        }
        
        const data = await weatherResponse.json();
        // Use the 'name' from geocoding, as it's more accurate for small towns
        data.name = name; 
        updateUI(data);

    } catch (error) {
        console.error('Weather fetch error:', error);
        errorText.textContent = error.message || 'Something went wrong. Please try again.';
        errorEl.classList.remove('hidden');
    } finally {
        loadingEl.classList.add('hidden');
    }
}



// ********************** update UI function *******************

function updateUI(data){
    cityName.textContent = data.name;
    temp.textContent = Math.round(data.main.temp);
    feelsLike.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;
    pressure.textContent = data.main.pressure;
    weatherDesc.textContent = data.weather[0].description;
    const condition = data.weather[0].main;
    weatherIcon.className = getIconClass(condition);
    weatherDetails.classList.remove('hidden');
}


function getIconClass(condition){
    const icons ={
        Clear: 'fas fa-sun text-5xl text-amber-400',
        Clouds: 'fas fa-cloud text-5xl text-slate-400',
        Rain: 'fas fa-cloud-rain text-5xl text-sky-500',
        Drizzle: 'fas fa-cloud-rain text-5xl text-sky-400',
        Thunderstorm: 'fas fa-bolt text-5xl text-yellow-500',
        Snow: 'fas fa-snowflake text-5xl text-cyan-300',
        Mist: 'fas fa-smog text-5xl text-gray-400',
        Haze: 'fas fa-smog text-5xl text-orange-300',
        Smoke: 'fas fa-smog text-5xl text-gray-500',
        Dust: 'fas fa-smog text-5xl text-yellow-600',
        Fog: 'fas fa-smog text-5xl text-gray-400',
        Sand: 'fas fa-smog text-5xl text-amber-600',
        Ash: 'fas fa-smog text-5xl text-gray-700',
        Squall: 'fas fa-wind text-5xl text-teal-400',
        Tornado: 'fas fa-tornado text-5xl text-red-500',
    }
    return icons[condition] || 'fas fa-cloud-sun text-5xl text-sky-400';
}