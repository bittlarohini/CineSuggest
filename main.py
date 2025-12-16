#!/usr/bin/env python3
"""
Mood-Based Movie Recommender System
A simple command-line tool to recommend movies based on your mood
"""

import sys
from recommender import MovieRecommender

def display_welcome():
    """Display welcome message and instructions"""
    print("\n" + "="*60)
    print("WELCOME TO MOOD-BASED MOVIE RECOMMENDER")
    print("="*60)
    print("\nFind the perfect movie for your current mood!")
    print("Simply enter how you're feeling, and we'll suggest")
    print("movies that match your mood perfectly.\n")

def display_mood_options(recommender):
    """Display available mood options"""
    moods = recommender.get_moods()
    print("Available moods to choose from:")
    print("-" * 40)
    
    # Display moods in columns for better readability
    for i, mood in enumerate(moods, 1):
        print(f"{i:2}. {mood:<15}", end="")
        if i % 4 == 0:
            print()
    
    if len(moods) % 4 != 0:
        print()
    
    print("-" * 40)
    print(f"\nTotal moods available: {len(moods)}\n")

def get_user_mood(recommender):
    """Get mood input from user with validation"""
    while True:
        try:
            print("You can either:")
            print("1. Enter a mood from the list above")
            print("2. Type 'random' for a random movie suggestion")
            print("3. Type 'exit' to quit the program")
            
            user_input = input("\nHow are you feeling today? ").strip().lower()
            
            if user_input == 'exit':
                return None
            elif user_input == 'random':
                return 'random'
            elif user_input in recommender.get_moods():
                return user_input
            else:
                print(f"\n⚠️  Mood '{user_input}' not found in our database.")
                print("Please choose from the available moods or try 'random'.\n")
                
        except KeyboardInterrupt:
            print("\n\nGoodbye! Hope you find a great movie!")
            sys.exit(0)
        except Exception as e:
            print(f"An error occurred: {e}")
            continue

def main():
    """Main function to run the movie recommender"""
    # Initialize the recommender
    recommender = MovieRecommender()
    
    # Check if data was loaded successfully
    if not recommender.get_moods():
        print("Failed to load movie data. Please check if 'movies_data.json' exists.")
        return
    
    display_welcome()
    
    while True:
        try:
            # Display mood options
            display_mood_options(recommender)
            
            # Get user input
            user_mood = get_user_mood(recommender)
            
            if user_mood is None:
                print("\nThank you for using Mood Movie Recommender! Goodbye!\n")
                break
            elif user_mood == 'random':
                # Get a random movie
                random_movie = recommender.get_random_movie()
                if random_movie:
                    print(f"\n🎬 RANDOM MOVIE PICK FOR YOU!")
                    print(f"{'='*50}")
                    print(f"Title: {random_movie['title']} ({random_movie['year']})")
                    print(f"Language: {random_movie['language']}")
                    print(f"Genre: {', '.join(random_movie['genre'])}")
                    print(f"Poster URL: {random_movie['poster']}")
                    print(f"{'='*50}\n")
                else:
                    print("Sorry, could not find a random movie.\n")
            else:
                # Get recommendations for the selected mood
                recommendations = recommender.recommend_movies(user_mood)
                recommender.display_recommendations(user_mood, recommendations)
            
            # Ask if user wants to continue
            if user_mood != 'random':  # Don't ask after random pick
                continue_choice = input("\nWould you like to search for another mood? (yes/no): ").strip().lower()
                if continue_choice not in ['yes', 'y']:
                    print("\nThank you for using Mood Movie Recommender! Enjoy your movie! 🎬\n")
                    break
                print("\n" + "="*60 + "\n")
                
        except KeyboardInterrupt:
            print("\n\nGoodbye! Hope you find a great movie!")
            break
        except Exception as e:
            print(f"\nAn unexpected error occurred: {e}")
            print("Please try again.\n")
            continue

if __name__ == "__main__":
    main()