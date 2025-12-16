"""
Mood Movie Recommender - Flask Web Application
Run with: python app.py
"""

from flask import Flask, render_template, request, jsonify
import json
import os
import random

app = Flask(__name__)

# Load movie data
def load_movies():
    try:
        with open('movies_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading movies: {e}")
        return {}

# Global variables
MOVIES = load_movies()
MOODS = list(MOVIES.keys())

@app.route('/')
def home():
    """Home page"""
    return render_template('index.html', moods=MOODS)

@app.route('/api/moods')
def get_moods():
    """API: Get all available moods"""
    return jsonify({
        'success': True,
        'moods': MOODS,
        'count': len(MOODS)
    })

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """API: Get movie recommendations"""
    try:
        data = request.get_json()
        mood = data.get('mood', '').lower().strip()
        
        if not mood:
            return jsonify({
                'success': False,
                'error': 'Please provide a mood'
            }), 400
        
        # Handle random mood
        if mood == 'random':
            random_mood = random.choice(MOODS)
            movies = MOVIES.get(random_mood, [])
            if movies:
                random_movie = random.choice(movies)
                return jsonify({
                    'success': True,
                    'mood': random_mood,
                    'movies': [random_movie],
                    'count': 1,
                    'is_random': True
                })
        
        # Check if mood exists
        if mood not in MOVIES:
            # Try to find similar mood
            similar = [m for m in MOODS if mood in m or m in mood]
            if similar:
                mood = similar[0]
            else:
                return jsonify({
                    'success': False,
                    'error': f'Mood "{mood}" not found',
                    'available_moods': MOODS
                }), 404
        
        # Get movies for the mood
        movies = MOVIES.get(mood, [])
        return jsonify({
            'success': True,
            'mood': mood,
            'movies': movies,
            'count': len(movies),
            'is_random': False
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Create a simple test route
@app.route('/test')
def test():
    return jsonify({
        'message': 'API is working!',
        'available_moods': MOODS,
        'total_moods': len(MOODS)
    })

if __name__ == '__main__':
    # Create templates folder if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    # Create static folder if it doesn't exist
    if not os.path.exists('static'):
        os.makedirs('static')
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)