import pandas as pd
import numpy as np
from pathlib import Path

from src.utils import (
    haversine_distance,
    normalize_series,
    normalize_log_series,
    normalize_exponential_decay,
)
from src.city_coords import CITY_COORDS


class WeekendGetawayRanker:
    """
    Ranking engine for Weekend Getaway recommendations.
    """

    SOURCE_CITIES = CITY_COORDS

    def __init__(self):
        """
        Initialize ranker and load dataset (DEPLOY SAFE).
        """
        base_dir = Path(__file__).resolve().parent.parent
        self.data_path = base_dir / "data" / "travel_destinations.csv"
        self.df = self._load_data()

    # ------------------------------------------------------------------
    # Data Loading & Cleaning
    # ------------------------------------------------------------------
    def _load_data(self) -> pd.DataFrame:
        if not self.data_path.exists():
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")

        df = pd.read_csv(self.data_path)

        # ---- Standardized Columns ----
        df["Place_Name"] = df["Name"]
        df["Rating"] = pd.to_numeric(
            df["Google review rating"], errors="coerce"
        ).fillna(0)

        # Convert reviews from lakhs → absolute number
        def clean_reviews(val):
            try:
                return float(val) * 100_000
            except Exception:
                return 0.0

        df["Reviews"] = df["Number of google review in lakhs"].apply(clean_reviews)

        # ---- Add Coordinates if Missing ----
        if "Latitude" not in df.columns:
            df["Latitude"] = df["City"].map(
                lambda city: CITY_COORDS.get(city, (0, 0))[0]
            )

        if "Longitude" not in df.columns:
            df["Longitude"] = df["City"].map(
                lambda city: CITY_COORDS.get(city, (0, 0))[1]
            )

        # Remove invalid geo rows
        df = df[(df["Latitude"] != 0) & (df["Longitude"] != 0)]

        return df.reset_index(drop=True)

    # ------------------------------------------------------------------
    # Source City Helpers
    # ------------------------------------------------------------------
    def get_source_cities(self) -> list[str]:
        """Return sorted list of supported source cities."""
        return sorted(self.SOURCE_CITIES.keys())

    def get_source_cities_grouped_by_state(self) -> dict:
        """
        Group source cities by state using dataset mapping.
        """
        grouped = {}

        if {"City", "State"}.issubset(self.df.columns):
            city_state_map = (
                self.df[["City", "State"]]
                .drop_duplicates()
                .set_index("City")["State"]
                .to_dict()
            )
        else:
            city_state_map = {}

        for city in self.SOURCE_CITIES:
            state = city_state_map.get(city, "Other")

            # Manual normalization
            if city == "New Delhi" and state == "Other":
                state = "Delhi"

            grouped.setdefault(state, []).append(city)

        return {state: sorted(cities) for state, cities in sorted(grouped.items())}

    # ------------------------------------------------------------------
    # Ranking Logic
    # ------------------------------------------------------------------
    def rank_destinations(
        self,
        source_city: str,
        weight_rating: float = 0.4,
        weight_popularity: float = 0.3,
        weight_distance: float = 0.3,
        top_n: int = 12,
    ) -> pd.DataFrame:
        """
        Rank destinations based on ratings, popularity, and distance.
        """

        source_lat, source_lon = self.SOURCE_CITIES.get(
            source_city, (28.6139, 77.2090)  # Default: Delhi
        )

        ranked_df = self.df.copy()

        # ---- Distance Calculation ----
        ranked_df["Distance_km"] = ranked_df.apply(
            lambda row: haversine_distance(
                source_lat, source_lon, row["Latitude"], row["Longitude"]
            ),
            axis=1,
        )

        # Weekend feasibility constraint
        ranked_df = ranked_df[ranked_df["Distance_km"] <= 500].copy()

        # ---- Normalization ----
        ranked_df["Norm_Rating"] = normalize_series(ranked_df["Rating"])
        ranked_df["Norm_Popularity"] = normalize_log_series(ranked_df["Reviews"])
        ranked_df["Norm_Distance"] = normalize_exponential_decay(
            ranked_df["Distance_km"], k=400
        )

        # ---- Weight Normalization ----
        total_weight = weight_rating + weight_popularity + weight_distance
        if total_weight <= 0:
            weight_rating = weight_popularity = weight_distance = 1 / 3
        else:
            weight_rating /= total_weight
            weight_popularity /= total_weight
            weight_distance /= total_weight

        # ---- Final Score ----
        ranked_df["Score"] = (
            weight_rating * ranked_df["Norm_Rating"]
            + weight_popularity * ranked_df["Norm_Popularity"]
            + weight_distance * ranked_df["Norm_Distance"]
        )

        ranked_df = ranked_df.sort_values("Score", ascending=False).head(top_n)

        return ranked_df.reset_index(drop=True)
