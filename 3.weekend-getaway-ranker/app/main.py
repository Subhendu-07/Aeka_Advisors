import streamlit as st
import sys
import os

# Add root directory to path to allow imports from src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.ranker import WeekendGetawayRanker

# Page Config
st.set_page_config(
    page_title="Weekend Getaway Ranker", 
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Minimal CSS just for specific alignment if needed, otherwise native
st.markdown("""
<style>
    .centered-title {
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h1 class='centered-title' style='color:#facc15'>🚗 Weekend Getaway Ranker</h1>", unsafe_allow_html=True)
st.markdown("<h3 class='centered-title'>Discover your perfect weekend escape based on Real Data.</h3>", unsafe_allow_html=True)
st.divider()

# Initialize Ranker
@st.cache_resource
def get_ranker_v2():
    return WeekendGetawayRanker()

try:
    ranker = get_ranker_v2()
    
    # --- Sidebar ---
    with st.sidebar:
        st.markdown("<h2 style='text-align: center; font-size: 1.5em;'>Select Location</h2>", unsafe_allow_html=True)
        
        # Hierarchical Selection
        grouped_cities = ranker.get_source_cities_grouped_by_state()
        all_states = list(grouped_cities.keys())
        
        # Try to find default state for New Delhi
        default_state_ix = 0
        if "West Bengal" in all_states:
            default_state_ix = all_states.index("West Bengal")
        elif "New Delhi" in all_states: # Unlikely as it's a city
            pass
            
        selected_state = st.selectbox("📍 Select State", all_states, index=default_state_ix)
        
        # Filter cities by state
        available_cities = grouped_cities.get(selected_state, [])
        
        # Default city selection
        default_city_ix = 0
        if selected_state == "West Bengal" and "Kolkata" in available_cities:
            default_city_ix = available_cities.index("Kolkata")
            
        selected_source = st.selectbox("🏙️ Select City", available_cities, index=default_city_ix)
        
        st.divider()
        st.markdown("<h2 style='text-align: center; font-size: 1.5em;'>Your Preferences</h2>", unsafe_allow_html=True)
        w_rating = st.slider("Rating Preference", 1.0, 10.0, 4.0, 0.5)
        w_dist = st.slider("Distance Preference", 1.0, 10.0, 3.0, 0.5)
        w_pop = st.slider("Popularity Preference", 1.0, 10.0, 3.0, 0.5)
        
        st.divider()
        st.caption("Developed by Sami")

    # --- Main Content ---
    if selected_source:
        ranked_df = ranker.rank_destinations(
            selected_source, 
            weight_rating=w_rating, 
            weight_distance=w_dist, 
            weight_popularity=w_pop,
            top_n=15
        )

        st.markdown(
            f"""
            <h3 style="color:#e9d5ff;">
                🏆 Top Recommendations from {selected_source}
            </h3>
            """,
            unsafe_allow_html=True
        )
        st.caption(f"Showing best matches based on your preferences.")
        
        # Display as Native Streamlit Containers
        for idx, row in ranked_df.iterrows():
            with st.container(border=True):
                # --- Header Section: Title & Score ---
                c1, c2, c3 = st.columns([5, 1, 1])
                with c1:
                    # Title with place rank
                    st.markdown(
                        f"""
                        <h3 style="
                            color:#22d3ee;
                        ">
                            {idx + 1}. {row['Place_Name']}
                        </h3>
                        """,
                        unsafe_allow_html=True
                    )

                    # Subtitle: Location and Type
                    st.markdown(f"📍 **{row['City']}, {row['State']}**")
                    st.markdown(f" 🏷️ {row['Type']} &nbsp;•&nbsp; {row['Significance']}")
                    st.markdown(f" 🏗️ {row['Establishment Year']}")
                with c2:
                    st.markdown(f"""
                        <div style="text-align: center; border: 2px solid PINK; border-radius: 8px; padding: 5px;">
                            <span style="font-size: 1.5em; font-weight: bold; color: PINK;">{row['Rating']}/5</span><br>
                            <span style="font-size: 0.8em;">Rating</span>
                        </div>
                    """, unsafe_allow_html=True)
                
                with c3:
                    # Prominent Score Display
                    score_pct = int(row['Score'] * 100)
                    st.markdown(f"""
                        <div style="text-align: center; border: 2px solid #00d26a; border-radius: 8px; padding: 5px;">
                            <span style="font-size: 1.5em; font-weight: bold; color: #00d26a;">{score_pct}%</span><br>
                            <span style="font-size: 0.8em;">Match</span>
                        </div>
                    """, unsafe_allow_html=True)

                st.divider()

                # --- Core Metrics Section ---
                # Group 1: Logistics (Distance, Time, Best Season)
                # Group 2: Quality/Cost (Rating, Reviews, Fee)
                
                m1, m2, m3, m4 = st.columns(4)
                
                with m1:
                    st.metric("🚗 Distance", f"{int(row['Distance_km'])} km", help="Straight-line distance")
                
                with m2:
                    visit_time = row.get('time needed to visit in hrs', 'N/A')
                    st.metric("⏱️ Visit Duration", f"{visit_time} hrs")
                    
                with m3:
                    best_time = row.get('Best Time to visit', 'All Year')
                    st.metric("📅 Best Time of Day", best_time)

                with m4:
                    fee = row.get('Entrance Fee in INR', 0)
                    if fee == 0:
                        fee = 'Free'
                    else:
                        fee = f"₹{fee}"
                    st.metric("💸 Entry", fee)

                # --- Secondary Details section ---
                st.markdown("") # Spacer

        # Raw Data Expander
        st.divider()
        with st.expander("📊 View Detailed Data Table"):
            st.dataframe(ranked_df)

except Exception as e:
    st.error(f"Application Error: {e}")
