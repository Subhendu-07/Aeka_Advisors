# Weekend Getaway Ranker - Development Journey

This document outlines the 12-phase development journey for the **Weekend Getaway Ranker** project.

> **Note**: The current directory (`d:\Job Applications\Aeka Advsors - 2025\Assessment\weekend-getaway-ranker`) is treated as the **Base Directory** for this project. All paths are relative to this root.

## 🗺️ Phase 1: Discovery & Requirements Analysis

**Goal**: Understand the problem statement and define the scope.

* **Step 1.1**: Analyze `goal.md` to identify key deliverables.
  * *Deliverable*: Understanding of Input (Source City) -> Output (Ranked Destinations).
* **Step 1.2**: Define successful ranking criteria.
  * *Criteria*: Distance, Rating, Popularity (Reviews).
* **Step 1.3**: Identify technology stack constraints.
  * *Stack*: Python, Pandas, Streamlit.

## 🏗️ Phase 2: Project Architecture & Design

**Goal**: Design the system structure and file organization.

* **Step 2.1**: Define the directory structure within the base directory (`data`, `src`, `app`).
* **Step 2.2**: Design the module interaction flow.
  * `src/ranker.py` gets data from `data/` -> processes it -> `app/main.py` displays it.
* **Step 2.3**: maintain `implementation_plan.md` and this `blueprint.md` as living documents.

## 📊 Phase 3: Data Strategy & Engineering

**Goal**: Secure and prepare the data for the ranker.

* **Step 3.1**: Define the CSV Schema.
  * *Updated Schema*: `Place_Name` (Name), `City`, `State`, `Rating`, `Reviews` (in Lakhs), `Type`, `Significance`, `Entrance Fee`, `Best Time`.
* **Step 3.2**: Create/Ingest Dataset (`data/travel_destinations.csv`).
  * Use real-world data provided by the user.
* **Step 3.3**: Implement a Data Loader in Python.
  * Use Pandas to read the CSV, handle missing values, and map column names.

## 🧠 Phase 4: Algorithmic Core Development

**Goal**: Build the intelligence behind the ranking.

* **Step 4.1**: Implement `DistanceCalculator`.
  * Use Haversine formula calculation.
* **Step 4.2**: Implement `Normalizer`.
  * Normalize Ratings (0-5), Reviews (Log scale), and Distance (Inverse) to a 0-1 scale.
* **Step 4.3**: Create the `Ranker` Class.
  * Combine normalized scores with weights (e.g., Rating: 0.4, Distance: 0.3, Popularity: 0.3).

## 🔧 Phase 5: Backend API & Utilities

**Goal**: Create reusable helper functions and modules.

* **Step 5.1**: Create `src/utils.py` for generic helpers.
* **Step 5.2**: Clean up the `Ranker` API for frontend consumption.
  * Function signature: `rank_destinations(source_city, weights...) -> DataFrame`.

## 🖥️ Phase 6: Basic Frontend Development (Streamlit)

**Goal**: Get a working UI up and running.

* **Step 6.1**: Initialize `app/main.py`.
* **Step 6.2**: Add specific Source City Selection Dropdown.
* **Step 6.3**: Display a basic Data Table of results.

## 🎨 Phase 7: UI/UX Implementation (Theme & Quality)

**Goal**: Make the app beautiful and user-friendly ("Wow" factor).

* **Step 7.1**: Implement a custom **Streamlit Theme** (Colors, Fonts).
* **Step 7.2**: Replace the basic table with **Rich Cards**.
  * Show visuals, match scores, and key metrics.
* **Step 7.3**: Add interactive elements (Sliders for Dynamic Weights).

## 🔌 Phase 8: Integration & Wiring

**Goal**: Connect the backend logic to the frontend UI seamlessly.

* **Step 8.1**: Integrate `Ranker` class into `app/main.py`.
* **Step 8.2**: Ensure real-time updates when filters or source cities change.
* **Step 8.3**: Handle edge cases (e.g., missing data points).

## ✅ Phase 9: Quality Assurance & Testing

**Goal**: Verify correctness and robustness.

* **Step 9.1**: Unit Test the `Ranker` logic (Is a 5-star place ranking higher than a 3-star place at the same distance?).
* **Step 9.2**: Manual UI Testing ("Monkey Testing" the Streamlit app).
* **Step 9.3**: Verify performance.

## 🚀 Phase 10: Final Polish & Packaging

**Goal**: Prepare the project for submission/handover.

* **Step 10.1**: Create `requirements.txt` and `pyproject.toml`.
* **Step 10.2**: Finalize `README.md` with "How to Run" instructions (supports both `uv` and `pip`).
* **Step 10.3**: Create a `project_walkthrough.md`.
* **Step 10.4**: Git cleanup.

## 🔄 Phase 11: Schema Refactoring (Real-World Data Adoption)

**Goal**: Adapt the system to the provided real-world dataset.

* **Step 11.1**: Create `src/city_coords.py` to handle missing coordinates for major Indian cities.
* **Step 11.2**: Update `load_data` in `ranker.py` to map new fields (`Name -> Place_Name`, `Number of reviews in lakhs -> Reviews`).
* **Step 11.3**: Enrich dataset with Latitude/Longitude via lookup.
* **Step 11.4**: Update Unit Tests to respect the new schema.

## 💎 Phase 12: UX Improvements & Modernization

**Goal**: Enhance usability and modernize the interface.

* **Step 12.1**: Implement **Hierarchical Selection** (State -> City) in the Sidebar.
  * Added `get_source_cities_grouped_by_state` to `ranker.py`.
* **Step 12.2**: **Redesign Destination Cards**.
  * Move from custom HTML/CSS to native Streamlit components (`st.container`, `st.metric`) for cleaner maintainability.
  * Improve information hierarchy (Logistics vs Quality metrics).
* **Step 12.3**: Fix Caching issues to ensure live code updates reflect immediately.

## 💻 Phase 13: CLI Implementation

**Goal**: Provide a terminal-based interface for quick interaction.

* **Step 13.1**: Create `main.py` in the root directory.
* **Step 13.2**: Implement interactive prompts for State, City, and Preferences.
* **Step 13.3**: Display formatted results (tables) in the console.

## 🧠 Phase 14: Core Logic Refinement

**Goal**: Improve ranking accuracy and robustness.

* **Step 14.1**: Switch from "Inverse normalization" to "Exponential Decay" (`k=400`) for distance scoring.
  * *Reason*: Better penalization of long distances.
* **Step 14.2**: Implement **Preference Normalization**.
  * Ensure user weights (e.g., 4, 3, 3) are normalized to sum to 1.0 internaly, keeping "Match %" ≤ 100%.

## 🚧 Phase 15: Feasibility Constraints

**Goal**: Ensure recommendations are physically realistic for a weekend.

* **Step 15.1**: Implement a **Hard Filter** for Distance (Max 500km).
  * *Reason*: >500km is feasible for a 2-day trip; >1000km is not.

## 🎚️ Phase 16: Usability Scaling

**Goal**: Make input controls more user-friendly.

* **Step 16.1**: Update input scale from `0.0-1.0` (Float) to `1-10` (Integer-friendly).
* **Step 16.2**: Apply this scale to both Streamlit Sliders and CLI Prompts.

---

## 👨‍💻 Author

Subhendu Mandal

> ❤️ I believe in building impact, not just writing code.
> *💚 Backend Sage signing off..*
