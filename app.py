from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load the data and model
data = pd.read_csv('imdb.csv')
vectors = pickle.load(open('vectors.pkl', 'rb'))

# Calculate similarity matrix
similarity = cosine_similarity(vectors)

# Preprocess movie names for case-insensitive matching
data['movie_name_lower'] = data['movie_name'].str.lower()

@app.route('/recommend', methods=['POST'])
def recommend():
    req_data = request.get_json()
    movie = req_data.get('movie', '').strip().lower()

    if movie not in data['movie_name_lower'].values:
        return jsonify({'error': 'Movie not found'}), 404

    movie_index = data[data['movie_name_lower'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended = [data.iloc[i[0]].movie_name for i in movies_list]

    return jsonify({'recommendations': recommended})

if __name__ == '__main__':
    app.run(debug=True)
