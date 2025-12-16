// DOM Elements
const moodInput = document.getElementById('moodInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const moodButtons = document.getElementById('moodButtons');
const resultsSection = document.getElementById('resultsSection');
const moviesContainer = document.getElementById('moviesContainer');
const noResults = document.getElementById('noResults');
const loadingSpinner = document.getElementById('loadingSpinner');
const backBtn = document.getElementById('backBtn');
const resultsTitle = document.getElementById('resultsTitle');
const currentMood = document.getElementById('currentMood');
const movieCount = document.getElementById('movieCount');

// Available moods (will be loaded from API)
let availableMoods = [];

// Initialize the application
async function initApp() {
    showLoading();
    
    try {
        // Load available moods
        const response = await fetch('/api/moods');
        const data = await response.json();
        
        if (data.success) {
            availableMoods = data.moods;
            populateMoodButtons();
        }
    } catch (error) {
        console.error('Error loading moods:', error);
    } finally {
        hideLoading();
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Populate mood buttons
function populateMoodButtons() {
    moodButtons.innerHTML = '';
    
    availableMoods.forEach(mood => {
        const button = document.createElement('button');
        button.className = 'mood-btn';
        button.textContent = mood;
        button.addEventListener('click', () => {
            moodInput.value = mood;
            searchMovies();
        });
        moodButtons.appendChild(button);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', searchMovies);
    
    // Enter key in input field
    moodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    // Random button click
    randomBtn.addEventListener('click', getRandomMovie);
    
    // Back button click
    backBtn.addEventListener('click', () => {
        resultsSection.style.display = 'none';
        moodInput.value = '';
    });
}

// Search for movies based on mood
async function searchMovies() {
    const mood = moodInput.value.trim().toLowerCase();
    
    if (!mood) {
        alert('Please enter a mood!');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.mood, data.movies, data.is_random);
        } else {
            showError(data.error);
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        showError('Failed to connect to server');
    } finally {
        hideLoading();
    }
}

// Get a random movie
async function getRandomMovie() {
    showLoading();
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood: 'random' })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.mood, data.movies, true);
        } else {
            showError(data.error);
        }
    } catch (error) {
        console.error('Error getting random movie:', error);
        showError('Failed to connect to server');
    } finally {
        hideLoading();
    }
}

// Display movies in the UI
function displayMovies(mood, movies, isRandom = false) {
    // Hide mood selection, show results
    resultsSection.style.display = 'block';
    
    // Update title and mood
    if (isRandom) {
        resultsTitle.textContent = 'Random Movie Pick!';
        currentMood.textContent = `Random (${mood})`;
    } else {
        resultsTitle.textContent = 'Movie Recommendations';
        currentMood.textContent = mood;
    }
    
    // Update movie count
    movieCount.textContent = `${movies.length} movie${movies.length !== 1 ? 's' : ''}`;
    
    // Clear previous movies
    moviesContainer.innerHTML = '';
    noResults.style.display = 'none';
    
    if (movies.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    // Create movie cards
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const poster = movie.poster || 'https://via.placeholder.com/300x200/1a1a2e/90e0ef?text=No+Poster';
    
    card.innerHTML = `
        <img src="${poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x200/1a1a2e/90e0ef?text=Poster+Not+Found'">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title} <span class="movie-year">(${movie.year})</span></h3>
            <div class="movie-details">
                <div class="movie-detail">
                    <i class="fas fa-language"></i>
                    <span>${movie.language}</span>
                </div>
                <div class="movie-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Released: ${movie.year}</span>
                </div>
            </div>
            <div class="movie-genres">
                ${movie.genre.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Show error message
function showError(message) {
    moviesContainer.innerHTML = '';
    noResults.innerHTML = `
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
        <button class="btn-primary" onclick="searchMovies()" style="margin-top: 20px;">
            <i class="fas fa-redo"></i> Try Again
        </button>
    `;
    noResults.style.display = 'block';
    resultsSection.style.display = 'block';
}

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', initApp);