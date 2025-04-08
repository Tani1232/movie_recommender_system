import React, { useState } from 'react';
import './Movie.css';

function Movie() {
  const [movie, setMovie] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    setError('');
    setRecommendations([]);

    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie }),
    });

    if (response.ok) {
      const data = await response.json();
      setRecommendations(data.recommendations);
    } else {
      const err = await response.json();
      setError(err.error || 'Something went wrong');
    }
  };

  return (
    <div className="container">
      <h1 className="Movie">Movie Recommender System</h1>
      <p className='Q'>Enter the movie you like:</p>
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="Type a movie name..."
      />
      <button onClick={handleRecommend}>Get Recommendations</button>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>You are recommended to watch these movies -</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index} className='linked'>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Movie;
