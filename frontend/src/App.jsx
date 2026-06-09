import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // 1. Load persisted session & fetch catalog
  useEffect(() => {
    const savedUser = localStorage.getItem('movieStoreUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchMovies();
  }, []);

  // 2. Fetch movies list from backend
  const fetchMovies = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('http://localhost:8080/api/movies');
      if (!res.ok) {
        throw new Error('Failed to fetch movies from API');
      }
      const data = await res.json();
      setMovies(data);
      setFilteredMovies(data);

      // Extract unique genres
      const uniqueGenres = ['All', ...new Set(data.map(m => m.genre))];
      setGenres(uniqueGenres);
    } catch (err) {
      console.error(err);
      setFetchError('Failed to load movies. Make sure the backend server on port 8080 is running.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Client-side search and genre filtering
  useEffect(() => {
    let result = movies;

    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(result);
  }, [searchQuery, selectedGenre, movies]);

  // 4. Cart Handlers
  const handleAddToCart = (movie) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item._id === movie._id);
      if (existing) {
        return prevItems.map(item => 
          item._id === movie._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...movie, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(item => item._id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item._id === id ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // 5. Auth Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('movieStoreUser', JSON.stringify(userData));
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminView(false);
    localStorage.removeItem('movieStoreUser');
  };

  return (
    <div className="app-container">
      <Navbar 
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
        onLogout={handleLogout}
        cartCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {isAdminView && user && user.isAdmin ? (
        <AdminDashboard 
          user={user} 
          movies={movies} 
          onRefreshMovies={fetchMovies} 
        />
      ) : (
        <>
          {searchQuery === '' && selectedGenre === 'All' ? (
            <>
              {/* MovieSphere Hero Billboard */}
              {movies.length > 0 && (() => {
                const billboardMovie = movies.find(m => m.title === "RRR" || m.title === "Jawan") || movies[0];
                return (
                  <div 
                    className="hero-billboard" 
                    style={{ 
                      backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0.1), rgba(20, 20, 20, 0.95)), url(${billboardMovie.posterUrl})` 
                    }}
                  >
                    <div className="hero-billboard-content">
                      <span className="hero-trending-badge">★ POPULAR ON MOVIESPHERE</span>
                      <h1 className="hero-title">{billboardMovie.title}</h1>
                      <p className="hero-desc">{billboardMovie.description}</p>
                      <div className="hero-meta-row">
                        <span className="hero-meta-badge">{billboardMovie.genre}</span>
                        <span className="hero-meta-badge">{billboardMovie.releaseYear}</span>
                        <span className="hero-meta-badge">★ {billboardMovie.rating}</span>
                      </div>
                      <div className="hero-buttons">
                        {billboardMovie.countInStock > 0 ? (
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleAddToCart(billboardMovie)}
                            id="hero-rent-btn"
                          >
                            Watch Now for ₹{billboardMovie.price}
                          </button>
                        ) : (
                          <button className="btn btn-secondary" disabled>
                            Out of Stock
                          </button>
                        )}
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setSelectedMovie(billboardMovie)}
                          id="hero-details-btn"
                        >
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Main store filters */}
              <div className="filters-section">
                <div className="genres-list" id="genre-filters">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      className={`genre-tag ${selectedGenre === genre ? 'active' : ''}`}
                      onClick={() => setSelectedGenre(genre)}
                      id={`genre-tag-${genre.toLowerCase()}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* MovieSphere Carousel Rows */}
              <div className="netflix-rows">
                {/* Row 1: Trending Now */}
                <div className="netflix-row">
                  <h2 className="netflix-row-title">Trending Now</h2>
                  <div className="netflix-row-slider">
                    {movies.map(movie => (
                      <div className="netflix-row-item" key={movie._id}>
                        <MovieCard 
                          movie={movie} 
                          onOpenDetails={setSelectedMovie}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2: Bollywood Blockbusters */}
                <div className="netflix-row">
                  <h2 className="netflix-row-title">Bollywood Hits</h2>
                  <div className="netflix-row-slider">
                    {movies.filter(m => ["Jawan", "Dangal", "3 Idiots"].includes(m.title)).map(movie => (
                      <div className="netflix-row-item" key={movie._id}>
                        <MovieCard 
                          movie={movie} 
                          onOpenDetails={setSelectedMovie}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 3: South Indian Blockbusters */}
                <div className="netflix-row">
                  <h2 className="netflix-row-title">South Indian Action & Drama</h2>
                  <div className="netflix-row-slider">
                    {movies.filter(m => ["RRR", "Baahubali: The Beginning", "K.G.F: Chapter 2", "Pushpa: The Rise"].includes(m.title)).map(movie => (
                      <div className="netflix-row-item" key={movie._id}>
                        <MovieCard 
                          movie={movie} 
                          onOpenDetails={setSelectedMovie}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Main store filters */}
              <div className="filters-section">
                <div className="genres-list" id="genre-filters">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      className={`genre-tag ${selectedGenre === genre ? 'active' : ''}`}
                      onClick={() => setSelectedGenre(genre)}
                      id={`genre-tag-${genre.toLowerCase()}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Store movie list (Active during Search or Genre Filters) */}
              <div className="movie-grid-container">
                <h2 className="search-results-heading" style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>
                  {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGenre} Movies`}
                </h2>
                {loading ? (
                  <h3 style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    Loading our catalog...
                  </h3>
                ) : fetchError ? (
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p className="auth-error" style={{ fontSize: '1.2rem', marginBottom: '1rem' }} id="backend-connection-error">
                      {fetchError}
                    </p>
                    <button className="btn btn-primary" onClick={fetchMovies}>Retry Connection</button>
                  </div>
                ) : filteredMovies.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }} id="no-movies-found">
                    No movies found matching your criteria.
                  </p>
                ) : (
                  <div className="movie-grid" id="movie-grid">
                    {filteredMovies.map(movie => (
                      <MovieCard 
                        key={movie._id} 
                        movie={movie} 
                        onOpenDetails={setSelectedMovie}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Modals & Slideouts */}
      <MovieDetailsModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
        user={user}
        onCheckoutSuccess={fetchMovies}
      />

      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <footer className="footer">
        <p>&copy; 2026 MovieSphere. Built using React, Express, MongoDB, and styled with glassmorphism.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Tested with Selenium, JMeter & Cypress
        </p>
      </footer>
    </div>
  );
}

export default App;
