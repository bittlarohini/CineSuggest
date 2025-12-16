from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import random
import time

app = Flask(__name__)
CORS(app)

# Load movie data
def load_movie_data():
    try:
        with open('movies_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# Fun quotes for different moods
MOOD_QUOTES = {
    "happy": [
        "🎬 Feeling happy? These movies will double your joy!",
        "😄 Smile more! Here are movies to keep that grin going!",
        "🌟 Happiness is watching a great movie with popcorn!",
        "🎉 Let's celebrate your good mood with awesome movies!",
        "✨ Happy mood + Good movie = Perfect day!"
    ],
    "sad": [
        "🍿 These movies understand your feelings... and popcorn helps too!",
        "😢 Sad moments make movies more meaningful. Here are some gems!",
        "🌈 Every cloud has a silver lining... and these movies have great stories!",
        "🎬 Even sad stories can make you feel better. Trust us!",
        "💫 Sad today, smiling tomorrow - start with these movies!"
    ],
    "romantic": [
        "❤️ Love is in the air... and on your screen!",
        "💑 Get ready for some heart-fluttering moments!",
        "🌹 Romance + Movies = Perfect Combination!",
        "💕 These movies will make you believe in love again!",
        "💘 Love stories that will make your heart skip a beat!"
    ],
    "angry": [
        "🔥 Let off steam with these high-energy movies!",
        "💪 Transform anger into action movie excitement!",
        "🎬 These movies pack more punch than your anger!",
        "⚡ Channel that energy into movie marathon mode!",
        "💥 Action-packed movies to match your fiery mood!"
    ],
    "relaxed": [
        "😌 Perfect movies for your chill mood!",
        "🍃 Sit back, relax, and enjoy these calming stories",
        "🌅 These movies are as soothing as a sunset!",
        "🎬 Relaxation mode activated with these films!",
        "🧘‍♀️ Chill vibes and great movies - perfect combo!"
    ],
    "excited": [
        "🎉 Get ready for an adrenaline rush!",
        "🚀 Excited? These movies will launch your excitement to space!",
        "⚡ High-voltage entertainment coming your way!",
        "🎬 Buckle up for an exciting movie ride!",
        "🏎️ Fasten your seatbelt for thrill-a-minute movies!"
    ],
    "motivational": [
        "💪 Get inspired! These movies will fuel your motivation!",
        "🌟 Dream big! These stories will push you forward!",
        "🚀 Ready to conquer the world? Start with these movies!",
        "🎬 Get your dose of inspiration right here!",
        "🔥 Movies that will light a fire in your soul!"
    ],
    "adventurous": [
        "🗺️ Adventure awaits in every frame!",
        "🌍 Explore new worlds without leaving your couch!",
        "🎬 Get ready for the adventure of a lifetime!",
        "⚔️ Sword-fighting, treasure hunting, and more!",
        "🏔️ Adventure calls! Answer with these movies!"
    ]
}

# Funny quotes for random display
FUNNY_QUOTES = [
    "🎬 Movies: Because staring at walls is so 1990s!",
    "🍿 Popcorn + Movie = Life solved!",
    "😴 Who needs sleep when you have movies?",
    "🤔 Can't decide what to watch? That's why we're here!",
    "🎥 One movie a day keeps boredom away!",
    "💫 Your next favorite movie is just a click away!",
    "🌟 Movie magic at your fingertips!",
    "🤣 Laughter guaranteed or your popcorn back!",
    "🧠 Smart people watch good movies. You're smart!",
    "🎉 Every mood deserves a movie match!"
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/moods')
def get_moods():
    data = load_movie_data()
    moods = list(data.keys())
    return jsonify({"moods": moods})

@app.route('/api/movies/<mood>')
def get_movies_by_mood(mood):
    time.sleep(0.5)  # Simulate loading for better UX
    data = load_movie_data()
    movies = data.get(mood.lower(), [])
    quote = random.choice(MOOD_QUOTES.get(mood.lower(), ["Great movies for your mood!"]))
    
    return jsonify({
        "mood": mood,
        "movies": movies,
        "count": len(movies),
        "quote": quote
    })

@app.route('/api/all-movies')
def get_all_movies():
    data = load_movie_data()
    all_movies = []
    for mood, movies in data.items():
        for movie in movies:
            movie['mood'] = mood
            all_movies.append(movie)
    
    # Add some random delay for realistic loading
    time.sleep(0.3)
    return jsonify({"movies": all_movies})

@app.route('/api/search')
def search_movies():
    query = request.args.get('q', '').lower()
    data = load_movie_data()
    results = []
    
    for mood, movies in data.items():
        for movie in movies:
            if (query in movie['title'].lower() or 
                query in ' '.join(movie['genre']).lower() or
                query in movie['language'].lower()):
                movie['mood'] = mood
                results.append(movie)
    
    quotes = [
        f"Found {len(results)} gems for '{query}'!",
        f"Your search '{query}' revealed {len(results)} treasures!",
        f"Discover {len(results)} amazing movies for '{query}'!",
        f"Voila! {len(results)} perfect matches for '{query}'!"
    ] if results else ["No movies found. Try another search!", "Oops! No matches found. Try different keywords!"]
    
    return jsonify({
        "results": results,
        "count": len(results),
        "quote": random.choice(quotes)
    })

@app.route('/api/funny-quote')
def get_funny_quote():
    return jsonify({"quote": random.choice(FUNNY_QUOTES)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)