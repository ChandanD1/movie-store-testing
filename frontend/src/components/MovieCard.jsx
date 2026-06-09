import React from 'react';

const MovieCard = ({ movie, onOpenDetails, onAddToCart }) => {
  return (
    <div className="movie-card glass-panel" id={`movie-card-${movie._id}`}>
      <div className="movie-poster-wrapper" onClick={() => onOpenDetails(movie)} id={`movie-poster-click-${movie._id}`}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-rating-badge">
          ★ {movie.rating}
        </div>
      </div>
      <div className="movie-info">
        <div className="movie-genre">{movie.genre}</div>
        <h3 className="movie-title" onClick={() => onOpenDetails(movie)} style={{ cursor: 'pointer' }}>
          {movie.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Released: {movie.releaseYear}
        </p>
        <div className="movie-footer">
          <span className="movie-price">₹{movie.price}</span>
          {movie.countInStock > 0 ? (
            <button 
              className="btn btn-primary" 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(movie);
              }}
              id={`add-to-cart-${movie._id}`}
            >
              Watch Now
            </button>
          ) : (
            <button className="btn btn-secondary" disabled id={`out-of-stock-${movie._id}`}>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
