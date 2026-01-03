"""
Weekend Getaway Ranker - CLI Interface
Run this script to interact with the ranking engine directly from your terminal.

Usage:
    uv run main.py
    # OR
    python main.py
"""

import sys
import pandas as pd
from src.ranker import WeekendGetawayRanker

def print_header():
    print("="*60)
    print("🚗  WEEKEND GETAWAY RANKER - CLI  🚗")
    print("="*60)

def get_user_selection(options: list, label: str):
    """Generic helper to let user select from a list of options."""
    print(f"\nAvailable {label}s:")
    for idx, opt in enumerate(options):
        print(f"[{idx + 1}] {opt}")
    
    while True:
        try:
            choice = input(f"\nSelect {label} (1-{len(options)}): ").strip()
            idx = int(choice) - 1
            if 0 <= idx < len(options):
                return options[idx]
            print("Invalid selection. Try again.")
        except ValueError:
            print("Please enter a number.")

def main():
    print_header()
    print("Loading data...")
    
    try:
        ranker = WeekendGetawayRanker()
    except Exception as e:
        print(f"Error loading ranker: {e}")
        return

    # 1. State Selection
    grouped_cities = ranker.get_source_cities_grouped_by_state()
    states = list(grouped_cities.keys())
    
    # Try to sort for better UX
    states.sort()
    
    selected_state = get_user_selection(states, "State")
    
    # 2. City Selection
    cities = grouped_cities.get(selected_state, [])
    cities.sort()
    
    selected_city = get_user_selection(cities, "City")
    
    print(f"\n📍 Source Selected: {selected_city}, {selected_state}")

    # 3. Preferences (Optional)
    print("\n------------------------------")
    print("⚙️  Ranking Preferences")
    print("Default: Rating (3), Distance (7), Popularity (3)")
    change_weights = input("Would you like to customize preferences? (y/N): ").strip().lower()
    
    w_rating, w_dist, w_pop = 2.5, 7.5, 2.5
    
    if change_weights == 'y':
        try:
            w_rating = float(input("Rating Preference (1 - 10): "))
            w_dist = float(input("Distance Preference (1 - 10): "))
            w_pop = float(input("Popularity Preference (1 - 10): "))
        except ValueError:
            print("Invalid input. Using defaults.")
            w_rating, w_dist, w_pop = 2.5, 7.5, 2.5

    # 4. Rank
    print("\n🔍 Ranking destinations...")
    results = ranker.rank_destinations(
        source_city=selected_city,
        weight_rating=w_rating,
        weight_distance=w_dist,
        weight_popularity=w_pop,
        top_n=15
    )
    
    # 5. Display Results
    print("\n" + "="*60)
    print(f"🏆 TOP 15 RECOMMENDATIONS FROM {selected_city.upper()}")
    print("="*60)
    
    # Clean up for display
    display_cols = ['Place_Name', 'City', 'Score', 'Distance_km', 'Rating', 'Type']
    
    # Format Score as percentage
    results['Score_Pct'] = (results['Score'] * 100).astype(int).astype(str) + '%'
    
    # Format Distance
    results['Dist_Fmt'] = results['Distance_km'].astype(int).astype(str) + ' km'
    
    final_view = results[['Place_Name', 'City', 'Score_Pct', 'Dist_Fmt', 'Rating', 'Type']]
    final_view.columns = ['Destination', 'Location', 'Match', 'Distance', 'Rating', 'Type']
    
    # Use pandas to_string for nice table
    print(final_view.to_string(index=False))
    print("\nDone. Happy Travels! 🚗")

if __name__ == "__main__":
    main()
