from sklearn.feature_extraction.text import TfidfVectorizer

def create_vectorizer(corpus):
    vectorizer = TfidfVectorizer(
        max_features=15000,
        ngram_range=(1, 2),   
        min_df=2
    )
    vectors = vectorizer.fit_transform(corpus)
    return vectorizer, vectors
