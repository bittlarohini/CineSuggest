// Mood data with icons
const moods = [
    { id: 'happy', name: 'Happy', icon: 'fas fa-laugh-beam', color: '#ff6b35' },
    { id: 'sad', name: 'Sad', icon: 'fas fa-sad-tear', color: '#4cc9f0' },
    { id: 'romantic', name: 'Romantic', icon: 'fas fa-heart', color: '#ff0054' },
    { id: 'angry', name: 'Angry', icon: 'fas fa-angry', color: '#ff6b35' },
    { id: 'relaxed', name: 'Relaxed', icon: 'fas fa-spa', color: '#9d4edd' },
    { id: 'excited', name: 'Excited', icon: 'fas fa-star', color: '#ff6b35' },
    { id: 'motivational', name: 'Motivational', icon: 'fas fa-rocket', color: '#4cc9f0' },
    { id: 'adventurous', name: 'Adventurous', icon: 'fas fa-mountain', color: '#9d4edd' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMoodButtons();
    loadAllMovies();
    setupEventListeners();
    loadRandomQuote();
    showWelcomeToast();
});

// Show welcome toast
function showWelcomeToast() {
    const welcomeQuotes = [
        "🎬 Welcome to CineSuggest! Your perfect movie match awaits!",
        "🍿 Grab some popcorn! Your movie journey starts here!",
        "🌟 Discover amazing Telugu & Hindi movies based on your mood!",
        "🎉 Let's find your next favorite movie together!"
    ];
    
    setTimeout(() => {
        showToast(welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)]);
    }, 1000);
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Load mood buttons
function loadMoodButtons() {
    const moodButtonsContainer = document.getElementById('moodButtons');
    if (!moodButtonsContainer) return;
    
    moodButtonsContainer.innerHTML = '';
    
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = 'mood-btn';
        button.innerHTML = `
            <i class="${mood.icon} mood-icon" style="color: ${mood.color}"></i>
            <span>${mood.name}</span>
        `;
        button.addEventListener('click', () => getMoviesByMood(mood.id, mood.name));
        moodButtonsContainer.appendChild(button);
    });
}

// Load random funny quote
async function loadRandomQuote() {
    try {
        const response = await fetch('/api/funny-quote');
        const data = await response.json();
        document.getElementById('funnyQuote').innerHTML = `
            <i class="fas fa-quote-left text-orange"></i>
            ${data.quote}
            <i class="fas fa-quote-right text-blue"></i>
        `;
    } catch (error) {
        // Use local quotes if API fails
        const localQuotes = [
            "🎬 Movies: Because staring at walls is so 1990s!",
            "🍿 Popcorn + Movie = Life solved!",
            "😴 Who needs sleep when you have movies?"
        ];
        const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        document.getElementById('funnyQuote').innerHTML = `
            <i class="fas fa-quote-left text-orange"></i>
            ${randomQuote}
            <i class="fas fa-quote-right text-blue"></i>
        `;
    }
}

// Get movies by mood
async function getMoviesByMood(mood, moodName) {
    try {
        // Show loading
        const container = document.getElementById('recommendationsContainer');
        const loading = document.getElementById('loadingAnimation');
        
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
        
        if (loading) {
            loading.style.display = 'block';
        }
        
        // Show recommendations section
        document.getElementById('recommendations').style.display = 'block';
        document.getElementById('moodTitle').innerHTML = `
            <i class="fas fa-star text-orange"></i>
            <span class="text-white">${moodName}</span>
            <span class="text-purple"> Movies</span>
        `;
        
        // Show funny toast
        const moodToasts = {
            happy: "😄 Get ready for some happy vibes!",
            sad: "😢 Perfect movies for emotional moments!",
            romantic: "❤️ Love is in the air!",
            angry: "🔥 Let's channel that energy!",
            relaxed: "😌 Time to relax and enjoy!",
            excited: "🎉 Exciting times ahead!",
            motivational: "💪 Get inspired!",
            adventurous: "🗺️ Adventure awaits!"
        };
        
        showToast(moodToasts[mood] || "Great movies coming your way!");
        
        // Scroll to recommendations
        setTimeout(() => {
            document.getElementById('recommendations').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
        
        // Fetch movies
        const response = await fetch(`/api/movies/${mood}`);
        const data = await response.json();
        
        if (loading) loading.style.display = 'none';
        if (container) {
            container.style.display = 'grid';
            displayMovies(data.movies, container);
        }
        
        // Update results info
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${data.count} movies found`;
        }
        
        // Update mood quote
        const moodQuote = document.getElementById('moodQuote');
        if (moodQuote) {
            moodQuote.textContent = data.quote;
        }
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showToast("Oops! Couldn't load movies. Please try again.", 'error');
        
        const container = document.getElementById('recommendationsContainer');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-exclamation-triangle text-red" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p class="text-white">Error loading movies. Please try again!</p>
                    <button onclick="location.reload()" class="search-btn" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Reload Page
                    </button>
                </div>
            `;
        }
    }
}

// Load all movies
async function loadAllMovies() {
    try {
        const container = document.getElementById('allMoviesContainer');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p class="loading-text text-purple">Loading awesome movies...</p></div>';
        
        const response = await fetch('/api/all-movies');
        const data = await response.json();
        
        displayMovies(data.movies, container);
        
    } catch (error) {
        console.error('Error loading all movies:', error);
        const container = document.getElementById('allMoviesContainer');
        if (container) {
            container.innerHTML = '<p class="text-white" style="grid-column: 1/-1; text-align: center;">Error loading movies. Please refresh the page.</p>';
        }
    }
}

// Display movies in a grid
function displayMovies(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-film text-purple" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p class="text-white">No movies found. Try another search!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    movies.forEach((movie, index) => {
        const movieCard = createMovieCard(movie, index);
        container.appendChild(movieCard);
        
        // Add staggered animation
        setTimeout(() => {
            movieCard.style.opacity = '1';
            movieCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Create movie card element
function createMovieCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.transitionDelay = `${index * 0.05}s`;
    
    // Handle image error
    const handleImageError = (img) => {
        img.onerror = null;
        img.src = 'https://via.placeholder.com/400x600/1f1d2b/4cc9f0?text=No+Poster+Available';
        img.alt = 'Poster not available';
    };
    
    card.innerHTML = `
        <img src="${movie.poster}" 
             alt="${movie.title}" 
             class="movie-poster"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/1f1d2b/4cc9f0?text=Movie+Poster';">
        <div class="movie-info">
            <h3 class="movie-title text-white">${movie.title}</h3>
            <div class="movie-meta">
                <span class="text-orange">${movie.year}</span>
                <span class="text-blue">${movie.language}</span>
            </div>
            <div class="movie-genre">
                ${movie.genre.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
            ${movie.mood ? `<div class="movie-mood">${movie.mood.charAt(0).toUpperCase() + movie.mood.slice(1)}</div>` : ''}
        </div>
    `;
    
    // Add click effect
    card.addEventListener('click', () => {
        showToast(`🎬 Added "${movie.title}" to your watchlist!`, 'success');
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    });
    
    return card;
}

// Search movies
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        showToast("🔍 Please enter something to search!", 'info');
        return;
    }
    
    try {
        // Show loading
        const container = document.getElementById('recommendationsContainer');
        const loading = document.getElementById('loadingAnimation');
        
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
        
        if (loading) {
            loading.style.display = 'block';
        }
        
        // Show recommendations section
        document.getElementById('recommendations').style.display = 'block';
        document.getElementById('moodTitle').innerHTML = `
            <i class="fas fa-search text-blue"></i>
            <span class="text-white">Search Results</span>
        `;
        
        // Scroll to results
        setTimeout(() => {
            document.getElementById('recommendations').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
        
        // Fetch search results
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (loading) loading.style.display = 'none';
        if (container) {
            container.style.display = 'grid';
            displayMovies(data.results, container);
        }
        
        // Update results info
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${data.count} movies found for "${query}"`;
        }
        
        // Update mood quote
        const moodQuote = document.getElementById('moodQuote');
        if (moodQuote) {
            moodQuote.textContent = data.quote;
        }
        
        // Show search toast
        if (data.count > 0) {
            showToast(`🎉 Found ${data.count} movies for "${query}"!`, 'success');
        } else {
            showToast(`😕 No movies found for "${query}". Try different keywords!`, 'info');
        }
        
    } catch (error) {
        console.error('Error searching movies:', error);
        showToast("Oops! Search failed. Please try again.", 'error');
    }
}

// Shuffle movies
function shuffleMovies() {
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;
    
    const movies = Array.from(container.children);
    if (movies.length <= 1) return;
    
    // Fisher-Yates shuffle
    for (let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.appendChild(movies[j]);
    }
    
    showToast("🔀 Movies shuffled!", 'info');
    
    // Add animation to all cards
    movies.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.02}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchMovies);
    }
    
    // Search input enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchMovies();
        });
    }
    
    // Back to moods button
    const backToMoods = document.getElementById('backToMoods');
    if (backToMoods) {
        backToMoods.addEventListener('click', () => {
            document.getElementById('recommendations').style.display = 'none';
            if (searchInput) searchInput.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast("👈 Back to mood selection!", 'info');
        });
    }
    
    // Shuffle button
    const shuffleBtn = document.getElementById('shuffleMovies');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleMovies);
    }
    
    // Refresh quote button
    const refreshQuote = document.getElementById('refreshQuote');
    if (refreshQuote) {
        refreshQuote.addEventListener('click', loadRandomQuote);
    }
    
    // Fun quote button
    const funQuoteBtn = document.getElementById('funQuoteBtn');
    if (funQuoteBtn) {
        funQuoteBtn.addEventListener('click', () => {
            loadRandomQuote();
            showToast("✨ Here's a fresh funny quote!", 'info');
        });
    }
    
    // Feedback button
    const feedbackBtn = document.getElementById('feedbackBtn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            showToast("💬 Thanks for your feedback! We appreciate it!", 'success');
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterMovies(filter);
        });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortMovies(this.value);
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Logo click handler
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast("🎬 Welcome back to MoodMovies!", 'info');
        });
    }
}

// Filter movies by language
function filterMovies(filter) {
    const container = document.getElementById('allMoviesContainer');
    const movies = Array.from(container.children);
    
    movies.forEach(movie => {
        const language = movie.querySelector('.text-blue').textContent.toLowerCase();
        const shouldShow = filter === 'all' || 
                         (filter === 'telugu' && language === 'telugu') ||
                         (filter === 'hindi' && language === 'hindi') ||
                         (filter === 'other' && !['telugu', 'hindi'].includes(language));
        
        movie.style.display = shouldShow ? 'block' : 'none';
    });
    
    showToast(`Filtered by: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`, 'info');
}

// Sort movies
function sortMovies(sortBy) {
    const container = document.getElementById('allMoviesContainer');
    const movies = Array.from(container.children);
    
    movies.sort((a, b) => {
        const aTitle = a.querySelector('.movie-title').textContent;
        const bTitle = b.querySelector('.movie-title').textContent;
        const aYear = parseInt(a.querySelector('.text-orange').textContent);
        const bYear = parseInt(b.querySelector('.text-orange').textContent);
        
        switch(sortBy) {
            case 'year-desc':
                return bYear - aYear;
            case 'year-asc':
                return aYear - bYear;
            case 'title-asc':
                return aTitle.localeCompare(bTitle);
            case 'title-desc':
                return bTitle.localeCompare(aTitle);
            default:
                return 0;
        }
    });
    
    // Reorder in DOM
    movies.forEach(movie => container.appendChild(movie));
    
    showToast(`Sorted!`, 'info');
}