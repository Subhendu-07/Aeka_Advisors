import math
import numpy as np

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees).
    """
    # Convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

def normalize_series(series):
    """
    Min-Max normalization of a pandas series to 0-1 range.
    """
    min_val = series.min()
    max_val = series.max()
    
    if max_val == min_val:
        return series.apply(lambda x: 1.0) # Avoid division by zero
        
    return (series - min_val) / (max_val - min_val)

def normalize_log_series(series):
    """
    Log transformation followed by Min-Max normalization.
    Good for skewed data like review counts.
    """
    # Add 1 to avoid log(0)
    log_series = np.log1p(series)
    return normalize_series(log_series)

def normalize_inverse_series(series):
    """
    Inverse normalization (lower is better becomes higher score).
    distance -> 1 / (distance + epsilon) then normalize
    """
    epsilon = 1e-5
    inv_series = 1 / (series + epsilon)
    return normalize_series(inv_series)

def normalize_exponential_decay(series, k=400):
    """
    Normalize using exponential decay.
    Score = exp(-distance / k)
    
    k is the decay constant (distance where score drops to ~0.37).
    e.g. k=400 means:
    0 km -> 1.0
    400 km -> 0.37
    800 km -> 0.13
    2000 km -> 0.006
    """
    # Simply apply the formula element-wise
    return np.exp(-series / k)
