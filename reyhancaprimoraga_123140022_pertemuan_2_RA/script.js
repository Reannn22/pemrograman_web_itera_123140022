// API Configuration using ES6 constants
const API_KEY = '5c0b99dadca54d4abce63418252510';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Weather icon mapping using enhanced object literals
const weatherIconMap = {
    'Light drizzle': 'cloud-drizzle.svg',
    'Moderate rain': 'cloud-rain.svg',
    'Patchy rain nearby': 'cloud-rain-wind.svg',
    'Partly cloudy': 'cloud-sun.svg',
    'Overcast': 'cloudy.svg',
    'Clear': 'cloud-sun.svg',
    'Light rain': 'cloud-drizzle.svg',
    'Heavy rain': 'cloud-rain.svg',
    'Mist': 'cloud-fog.svg',
    'Thunderstorm': 'cloud-lightning.svg',
    'Snow': 'cloud-snow.svg',
    'default': 'cloud.svg'
};

// Arrow function for getting weather icon
const getWeatherIcon = condition => {
    const { text } = typeof condition === 'object' ? condition : { text: condition };
    return `assets/icon/${weatherIconMap[text] || weatherIconMap['default']}`;
};

// Modern Class implementation with async/await
class WeatherApp {
    #settings;
    #searchDebounceTimer;
    #isLoading;
    #favorites;  // Add favorites storage

    constructor() {
        this.#settings = this.getSettings();
        this.#favorites = this.getFavorites();  // Initialize favorites
        this.setupEventListeners();
        this.initializeApp();
        this.displayFavorites();
        this.updateURLParams();
        this.#searchDebounceTimer = null;
        this.#isLoading = false;
    }

    // Getter for settings using property accessor
    get settings() {
        return { ...this.#settings };
    }

    getSettings() {
        return JSON.parse(localStorage.getItem('weatherSettings')) || {
            unit: 'C',
            theme: 'light'
        };
    }

    saveSettings() {
        localStorage.setItem('weatherSettings', JSON.stringify(this.#settings));
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Temperature unit toggle
        document.getElementById('unitToggle').addEventListener('click', () => this.toggleUnit());
        
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Add autocomplete event listeners
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => this.handleSearchInput());
        searchInput.addEventListener('blur', () => {
            // Small delay to allow click on suggestion
            setTimeout(() => {
                document.getElementById('suggestions').classList.remove('show');
            }, 200);
        });
    }

    updateURLParams() {
        const url = new URL(window.location);
        url.searchParams.set('theme', this.#settings.theme);
        url.searchParams.set('unit', this.#settings.unit);
        // Add city parameter if we have current weather data
        const cityElement = document.querySelector('#currentWeather h2');
        if (cityElement) {
            const cityName = cityElement.textContent.split(',')[0];
            url.searchParams.set('city', cityName);
        }
        window.history.pushState({}, '', url);
    }

    toggleTheme() {
        this.#settings.theme = this.#settings.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', this.#settings.theme === 'dark');
        const isDark = this.#settings.theme === 'dark';
        localStorage.setItem('weatherDashboardTheme', isDark ? 'dark' : 'light');
        document.getElementById('themeIcon').src = isDark ? 'assets/icon/sun.svg' : 'assets/icon/moon.svg';
        this.saveSettings();
        this.updateURLParams();
    }

    toggleUnit() {
        this.#settings.unit = this.#settings.unit === 'C' ? 'F' : 'C';
        document.getElementById('unitText').textContent = `°${this.#settings.unit}`;
        this.saveSettings();
        // Get current city and refresh weather
        const cityElement = document.querySelector('#currentWeather h2');
        if (cityElement) {
            const cityName = cityElement.textContent.split(',')[0];
            this.fetchWeather(cityName);
        }
    }

    async handleSearch() {
        const input = document.getElementById('searchInput');
        const city = input.value.trim();
        if (city) {
            await this.fetchWeather(city);
            input.value = '';
        }
    }

    handleSearchInput() {
        const input = document.getElementById('searchInput');
        const query = input.value.trim();

        // Update URL with search query
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('search', query);
        } else {
            url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url);

        // Clear previous timer
        if (this.#searchDebounceTimer) {
            clearTimeout(this.#searchDebounceTimer);
        }

        // Don't search for empty or short queries
        if (query.length < 2) {
            document.getElementById('suggestions').classList.remove('show');
            return;
        }

        // Debounce API calls
        this.#searchDebounceTimer = setTimeout(() => {
            this.fetchSearchSuggestions(query);
        }, 300);
    }

    async fetchSearchSuggestions(query) {
        try {
            const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${query}`);
            const data = await response.json();
            
            const suggestionsContainer = document.getElementById('suggestions');
            
            if (data.length > 0) {
                const suggestions = data.map(item => {
                    const city = item.name;
                    const country = item.country;
                    const url = new URL(window.location.href);
                    url.searchParams.set('theme', this.#settings.theme);
                    url.searchParams.set('unit', this.#settings.unit);
                    url.searchParams.set('city', city);
                    url.searchParams.set('search', `${city}, ${country}`);

                    return `
                        <a href="#" 
                           class="suggestion-item block dark:text-white" 
                           data-city="${city}"
                           data-country="${country}">
                            ${city}, ${country}
                        </a>
                    `;
                }).join('');
                
                suggestionsContainer.innerHTML = suggestions;
                suggestionsContainer.classList.add('show');

                // Add click event listeners to each suggestion
                suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const city = e.target.getAttribute('data-city');
                        this.fetchWeather(city);
                        document.getElementById('suggestions').classList.remove('show');
                        document.getElementById('searchInput').value = `${city}, ${e.target.getAttribute('data-country')}`;
                    });
                });
            } else {
                suggestionsContainer.classList.remove('show');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    showLoading() {
        this.#isLoading = true;
        const weatherContainer = document.getElementById('currentWeather');
        const forecastContainer = document.getElementById('forecast');
        
        // Clone and show weather skeleton
        const weatherSkeleton = document.getElementById('weatherSkeleton').content.cloneNode(true);
        weatherContainer.innerHTML = '';
        weatherContainer.appendChild(weatherSkeleton);

        // Clone and show forecast skeleton
        const forecastSkeleton = document.getElementById('forecastSkeleton').content.cloneNode(true);
        forecastContainer.innerHTML = '';
        forecastContainer.appendChild(forecastSkeleton);
    }

    hideLoading() {
        this.#isLoading = false;
    }

    // Using async/await for API calls
    async fetchWeather(city) {
        try {
            this.showLoading();
            const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);
            
            await this.displayWeather(data);
            await this.fetchForecast(city);
            this.updateURLParams();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    showError(message) {
        const toast = document.getElementById('errorToast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    async initializeApp() {
        document.documentElement.classList.toggle('dark', this.#settings.theme === 'dark');
        document.getElementById('themeIcon').src = this.#settings.theme === 'dark' ? 'assets/icon/sun.svg' : 'assets/icon/moon.svg';
        document.getElementById('unitText').textContent = `°${this.#settings.unit}`;
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const cityParam = urlParams.get('city');
        const searchParam = urlParams.get('search');
        
        if (searchParam) {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = searchParam;
            this.handleSearchInput();
        }
        
        try {
            if (cityParam) {
                await this.fetchWeather(cityParam);
            } else {
                await this.getCurrentLocation();
            }
        } catch (error) {
            await this.fetchWeather('Jakarta');
        }
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `${BASE_URL}/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Cache-Control': 'no-cache'
                                }
                            }
                        );
                        
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(data.error?.message || 'Failed to fetch location data');
                        }
                        
                        await this.displayWeather(data);
                        await this.fetchForecast(`${latitude},${longitude}`);
                        resolve(data);
                    } catch (error) {
                        console.error('Location API Error:', error);
                        reject(error);
                    } finally {
                        this.hideLoading();
                    }
                },
                (error) => {
                    this.hideLoading();
                    reject(new Error('Location access denied'));
                }
            );
        });
    }

    // Add getFavorites method
    getFavorites() {
        try {
            const favorites = localStorage.getItem('weatherFavorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error reading favorites:', error);
            return [];
        }
    }

    // Add isFavorite method
    isFavorite(cityName) {
        return this.#favorites.some(fav => fav.location === cityName);
    }

    // Update addToFavorites method
    addToFavorites(city) {
        if (!this.#favorites.some(fav => fav.location === city.location)) {
            this.#favorites.push({
                ...city,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('weatherFavorites', JSON.stringify(this.#favorites));
            return true;
        }
        return false;
    }

    // Update removeFromFavorite method
    removeFromFavorite(cityName) {
        this.#favorites = this.#favorites.filter(city => city.location !== cityName);
        localStorage.setItem('weatherFavorites', JSON.stringify(this.#favorites));
    }

    async fetchForecast(city) {
        try {
            const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no`);
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            this.displayForecast(data.forecast.forecastday);
        } catch (error) {
            this.showError(`Failed to fetch forecast: ${error.message}`);
        }
    }

    // Using destructuring and template literals
    displayWeather(data) {
        const { current, location } = data;
        const weatherContainer = document.getElementById('currentWeather');
        const temp = this.#settings.unit === 'F' ? Math.round((current.temp_c * 9/5) + 32) : Math.round(current.temp_c);
        
        const cityData = {
            location: location.name,
            country: location.country,
            temp: current.temp_c,
            condition: current.condition,
            humidity: current.humidity,
            wind_kph: current.wind_kph,
            last_updated: location.localtime,
            feelslike_c: current.feelslike_c,
            uv: current.uv
        };

        // Update template to match skeleton dimensions
        weatherContainer.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 dark:bg-gray-800 p-6 rounded-lg gap-4">
                <div>
                    <h2 class="text-2xl font-bold dark:text-white">${location.name}, ${location.country}</h2>
                    <p class="text-base text-gray-600 dark:text-gray-400">
                        ${new Date(location.localtime).toLocaleDateString()}
                    </p>
                </div>
                <button id="favBtn" class="p-2">
                    <img src="assets/icon/${this.isFavorite(location.name) ? 'star-fill.svg' : 'star.svg'}" 
                        class="favorite-icon ${this.isFavorite(location.name) ? 'active' : ''}" 
                        alt="favorite" width="24" height="24">
                </button>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-4 mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <img src="${getWeatherIcon(current.condition.text)}" alt="${current.condition.text}" class="w-16 sm:w-20 h-16 sm:h-20">
                <div class="text-center sm:text-left">
                    <p class="text-3xl sm:text-4xl font-bold dark:text-white">${temp}°${this.#settings.unit}</p>
                    <p class="text-base sm:text-lg capitalize dark:text-gray-300">${current.condition.text}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Humidity</p>
                    <p class="text-lg sm:text-xl font-bold dark:text-white">${current.humidity}%</p>
                </div>
                <div class="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Wind Speed</p>
                    <p class="text-lg sm:text-xl font-bold dark:text-white">${current.wind_kph} km/h</p>
                </div>
            </div>
        `;

        // Update favorite button click handler
        document.getElementById('favBtn').addEventListener('click', () => {
            const starIcon = document.querySelector('#favBtn .favorite-icon');
            if (this.isFavorite(location.name)) {
                this.removeFromFavorite(location.name);
                starIcon.src = 'assets/icon/star.svg';
                starIcon.classList.remove('active');
            } else {
                this.addToFavorites(cityData);
                starIcon.src = 'assets/icon/star-fill.svg';
                starIcon.classList.add('active');
            }
            this.displayFavorites();
        });
    }

    // Using array methods and higher-order functions
    displayFavorites() {
        const favoritesContainer = document.getElementById('favorites');
        const favorites = this.getFavorites();

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="col-span-full text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-gray-600 dark:text-gray-400">No favorite cities yet</p>
                </div>
            `;
            return;
        }

        const favoritesHTML = favorites
            .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .map(({ location, country, temp, condition, humidity, wind_kph }) => `
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold text-lg dark:text-white">${location}, ${country}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${condition.text}</p>
                        </div>
                        <button onclick="app.removeFromFavorite('${location}')" class="p-2">
                            <img src="assets/icon/star-fill.svg" class="favorite-icon" alt="favorite" width="24" height="24">
                        </button>
                    </div>
                    <div class="flex items-center gap-4">
                        <img src="${getWeatherIcon(condition)}" alt="${condition.text}" class="w-16 h-16">
                        <div>
                            <p class="text-2xl font-bold dark:text-white">${this.formatTemp(temp)}</p>
                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <div class="text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">Humidity:</span>
                                    <span class="dark:text-white">${humidity}%</span>
                                </div>
                                <div class="text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">Wind:</span>
                                    <span class="dark:text-white">${wind_kph} km/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            .join('');

        favoritesContainer.innerHTML = favoritesHTML;

        // Add click handlers for favorite cities
        favoritesContainer.querySelectorAll('.bg-gray-50').forEach((element, index) => {
            element.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const city = favorites[index];
                    this.fetchWeather(city.location);
                }
            });
        });
    }

    displayForecast(forecast) {
        const forecastContainer = document.getElementById('forecast');
        if (!forecastContainer) return;

        forecastContainer.innerHTML = forecast.map(day => {
            const temp = this.#settings.unit === 'F' ? 
                Math.round((day.day.avgtemp_c * 9/5) + 32) : 
                Math.round(day.day.avgtemp_c);
            
            return `
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                    <p class="text-lg font-semibold dark:text-gray-200 mb-3">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <img src="${getWeatherIcon(day.day.condition.text)}" 
                         alt="${day.day.condition.text}" 
                         class="w-16 h-16 mx-auto my-4 transition-transform hover:scale-110">
                    <p class="text-2xl font-bold dark:text-white mb-2">${temp}°${this.#settings.unit}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300 capitalize">${day.day.condition.text}</p>
                </div>
            `;
        }).join('');
    }

    formatTemp(temp) {
        const converted = this.#settings.unit === 'F' ? (temp * 9/5) + 32 : temp;
        return `${Math.round(converted)}°${this.#settings.unit}`;
    }
}

// Initialize app using ES6 modules pattern
export default new WeatherApp();

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function updateThemeIcon(isDark) {
    themeIcon.src = isDark ? 'assets/icon/sun.svg' : 'assets/icon/moon.svg';
}

// Update icon on initial load
updateThemeIcon(document.documentElement.classList.contains('dark'));

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('weatherDashboardTheme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});
