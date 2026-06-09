import React from 'react';

const Navbar = ({ 
  user, 
  onOpenLogin, 
  onLogout, 
  cartCount, 
  onOpenCart, 
  isAdminView, 
  setIsAdminView, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <nav className="navbar">
      <div className="brand" onClick={() => setIsAdminView(false)} id="brand-logo">
        MovieSphere
      </div>

      {!isAdminView && (
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search movies..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="movie-search-input"
          />
        </div>
      )}

      <div className="nav-actions">
        {user && user.isAdmin && (
          <button 
            className={`btn ${isAdminView ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsAdminView(!isAdminView)}
            id="admin-view-toggle"
          >
            {isAdminView ? 'Shop View' : 'Admin Panel'}
          </button>
        )}

        {!isAdminView && (
          <button 
            className="btn btn-outline" 
            onClick={onOpenCart}
            id="cart-btn"
            style={{ position: 'relative' }}
          >
            � Watchlist ({cartCount})
          </button>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} id="user-profile-nav">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Hi, {user.name}
            </span>
            <button className="btn btn-secondary" onClick={onLogout} id="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenLogin} id="login-btn">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
