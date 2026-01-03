import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from src.preprocess import preprocess_text

def predict_song(snippet, vectorizer, lyric_vectors, dataframe):
    cleaned = preprocess_text(snippet)
    snippet_vector = vectorizer.transform([cleaned])

    similarities = cosine_similarity(snippet_vector, lyric_vectors)
    best_index = np.argmax(similarities)
    best_score = similarities[0][best_index]

    return {
        "song": dataframe.iloc[best_index]['song'],
        "artist": dataframe.iloc[best_index]['artist'],
        "confidence": best_score
    }
