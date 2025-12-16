import json
import os
from typing import List, Dict, Optional

class MovieRecommender:
    def __init__(self, data_file: str = "movies_data.json"):
        """
        Initialize the movie recommender with data from JSON file
        
        Args:
            data_file: Path to the JSON file containing movie data
        """
        self.data_file = data_file
        self.movie_data = self.load_movie_data()
        self.available_moods = list(self.movie_data.keys()) if self.movie_data else []
    
    def load_movie_data(self) -> Dict:
        """
        Load movie data from JSON file
        
        Returns:
            Dictionary containing movie data by mood
        """
        try:
            # Check if file exists
            if not os.path.exists(self.data_file):
                print(f"Error: File '{self.data_file}' not found.")
                return {}
            
            # Load JSON data
            with open(self.data_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            # Validate data structure
            if not isinstance(data, dict):
                print("Error: Invalid data format in JSON file.")
                return {}
            
            return data
            
        except json.JSONDecodeError:
            print(f"Error: '{self.data_file}' contains invalid JSON.")
            return {}
        except Exception as e:
            print(f"Error loading movie data: {e}")
            return {}
    
    def get_moods(self) -> List[str]:
        """
        Get list of available moods
        
        Returns:
            List of mood strings
        """
        return self.available_moods
    
    def recommend_movies(self, mood: str) -> List[Dict]:
        """
        Get movie recommendations for a specific mood
        
        Args:
            mood: The mood to get recommendations for
            
        Returns:
            List of movie dictionaries matching the mood
        """
        # Normalize mood input (lowercase, strip whitespace)
        mood = mood.lower().strip()
        
        # Check if mood exists in data
        if mood not in self.movie_data:
            # Try to find similar moods (simple fuzzy matching)
            similar_moods = [m for m in self.available_moods if mood in m or m in mood]
            
            if similar_moods:
                print(f"Mood '{mood}' not found. Did you mean '{similar_moods[0]}'?")
                # Use the first similar mood found
                mood = similar_moods[0]
            else:
                print(f"Mood '{mood}' not found. Available moods: {', '.join(self.available_moods)}")
                return []
        
        return self.movie_data.get(mood, [])
    
    def display_recommendations(self, mood: str, movies: List[Dict]):
        """
        Display movie recommendations in a formatted way
        
        Args:
            mood: The mood for which recommendations are being shown
            movies: List of movie dictionaries
        """
        if not movies:
            print(f"\nNo movies found for mood: {mood}")
            return
        
        print(f"\n{'='*60}")
        print(f"MOVIE RECOMMENDATIONS FOR '{mood.upper()}' MOOD")
        print(f"{'='*60}")
        
        for i, movie in enumerate(movies, 1):
            print(f"\n{i}. {movie['title']} ({movie['year']})")
            print(f"   Language: {movie['language']}")
            print(f"   Genre: {', '.join(movie['genre'])}")
            print(f"   Poster URL: {movie['poster']}")
        
        print(f"\nTotal recommendations: {len(movies)}")
        print(f"{'='*60}")
    
    def get_random_movie(self, mood: Optional[str] = None) -> Optional[Dict]:
        """
        Get a random movie recommendation
        
        Args:
            mood: Optional specific mood, otherwise random from all moods
            
        Returns:
            A random movie dictionary or None if no movies found
        """
        import random
        
        if not self.movie_data:
            return None
        
        if mood:
            movies = self.recommend_movies(mood)
            if movies:
                return random.choice(movies)
            return None
        
        # Get random mood
        random_mood = random.choice(self.available_moods)
        movies = self.movie_data[random_mood]
        return random.choice(movies) if movies else None


# Example usage function (for testing)
def example_usage():
    """Example of how to use the MovieRecommender class"""
    recommender = MovieRecommender()
    
    # Get available moods
    moods = recommender.get_moods()
    print(f"Available moods: {', '.join(moods)}")
    
    # Get recommendations for a specific mood
    test_mood = "happy"
    recommendations = recommender.recommend_movies(test_mood)
    recommender.display_recommendations(test_mood, recommendations)
    
    # Get a random movie
    random_movie = recommender.get_random_movie()
    if random_movie:
        print(f"\nRandom movie pick: {random_movie['title']} ({random_movie['year']})")


if __name__ == "__main__":
    # This allows testing the recommender directly
    example_usage()