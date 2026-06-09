import React, { useEffect, useRef } from 'react';

const MovieDetailsModal = ({ movie, onClose, onAddToCart }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (movie) {
      if (!dialog.open) {
        dialog.showModal();
      }

      // Safari and older browser fallback for backdrop click (light-dismiss)
      const handleBackdropClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      };

      dialog.addEventListener('click', handleBackdropClick);

      // Listen for browser close event (like Esc key)
      const handleClose = () => {
        onClose();
      };
      dialog.addEventListener('close', handleClose);

      return () => {
        dialog.removeEventListener('click', handleBackdropClick);
        dialog.removeEventListener('close', handleClose);
        if (dialog.open) {
          dialog.close();
        }
      };
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [movie, onClose]);

  return (
    <dialog ref={dialogRef} closedby="any" aria-labelledby="dialog-title" id="movie-details-dialog">
      {movie && (
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="dialog-title" style={{ fontSize: '1.4rem' }}>{movie.title}</h2>
            <button className="modal-close-btn" onClick={() => dialogRef.current.close()} id="close-details-modal">
              &times;
            </button>
          </div>
          <div className="movie-details-grid">
            <div>
              <img src={movie.posterUrl} alt={movie.title} className="details-poster" />
            </div>
            <div className="details-info">
              <div className="details-meta">
                <span>Genre: {movie.genre}</span>
                <span>Year: {movie.releaseYear}</span>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>★ {movie.rating}/5</span>
                <span>Stock: {movie.countInStock} left</span>
              </div>
              
              <p className="details-desc">{movie.description}</p>

              {movie.trailerUrl && (
                <div className="video-container" style={{ margin: '1rem 0', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    src={movie.trailerUrl} 
                    title={`${movie.title} Trailer`} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="details-price-section">
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{movie.price}</span>
                {movie.countInStock > 0 ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      onAddToCart(movie);
                      dialogRef.current.close();
                    }}
                    id={`modal-rent-btn-${movie._id}`}
                  >
                    Rent Now
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default MovieDetailsModal;
