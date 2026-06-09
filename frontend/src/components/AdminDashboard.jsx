import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, movies, onRefreshMovies }) => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | movies
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields for adding movie
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [genre, setGenre] = useState('');
  const [countInStock, setCountInStock] = useState('10');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/orders', {
        headers: {
          'Authorization': user.token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to load orders.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const movieData = {
      title,
      description,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
      price: parseFloat(price),
      rating: parseFloat(rating) || 4.5,
      releaseYear: parseInt(releaseYear),
      genre,
      countInStock: parseInt(countInStock)
    };

    try {
      const res = await fetch('http://localhost:8080/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        body: JSON.stringify(movieData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Movie "${data.title}" added successfully!`);
        // Reset form
        setTitle('');
        setDescription('');
        setPosterUrl('');
        setPrice('');
        setRating('');
        setReleaseYear('');
        setGenre('');
        setCountInStock('10');
        onRefreshMovies();
      } else {
        setError(data.message || 'Failed to add movie.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': user.token
        }
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Movie deleted successfully.');
        onRefreshMovies();
      } else {
        setError(data.message || 'Failed to delete movie.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Control Center</h1>
        <span style={{ background: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem' }}>
          Role: System Administrator
        </span>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          id="admin-tab-orders"
        >
          Customer Orders
        </button>
        <button 
          className={`admin-tab ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
          id="admin-tab-movies"
        >
          Manage Catalog
        </button>
      </div>

      {success && <div className="success-message" id="admin-success-msg">{success}</div>}
      {error && <div className="auth-error" id="admin-error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

      {activeTab === 'orders' ? (
        <div className="table-wrapper">
          <table id="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Placed</th>
                <th>Total Paid</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No orders found in the database.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{order._id}</td>
                    <td>{order.userEmail}</td>
                    <td>
                      {order.items.map(item => (
                        <div key={item.movieId} style={{ fontSize: '0.85rem' }}>
                          • {item.title} ({item.quantity}x)
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                      ₹{order.totalAmount}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-grid">
          {/* Movie inventory list */}
          <div className="table-wrapper">
            <table id="admin-movies-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie._id}>
                    <td style={{ fontWeight: 'bold' }}>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>₹{movie.price}</td>
                    <td>{movie.countInStock}</td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleDeleteMovie(movie._id)}
                        id={`delete-movie-${movie._id}`}
                        style={{ padding: '0.3rem 0.6rem', color: '#ff4a4a', borderColor: '#ff4a4a' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add movie form */}
          <div className="glass-panel admin-form-panel">
            <h3>Add New Release</h3>
            <form onSubmit={handleAddMovie} id="add-movie-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-title">Movie Title</label>
                <input 
                  type="text" 
                  id="new-title" 
                  className="form-control"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-genre">Genre</label>
                <input 
                  type="text" 
                  id="new-genre" 
                  className="form-control"
                  placeholder="e.g. Sci-Fi, Action"
                  value={genre} 
                  onChange={(e) => setGenre(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-year">Release Year</label>
                <input 
                  type="number" 
                  id="new-year" 
                  className="form-control"
                  placeholder="e.g. 2024"
                  value={releaseYear} 
                  onChange={(e) => setReleaseYear(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-price">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="new-price" 
                  className="form-control"
                  placeholder="e.g. 9.99"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-stock">Stock Count</label>
                <input 
                  type="number" 
                  id="new-stock" 
                  className="form-control"
                  value={countInStock} 
                  onChange={(e) => setCountInStock(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="new-poster">Poster URL</label>
                <input 
                  type="url" 
                  id="new-poster" 
                  className="form-control"
                  placeholder="Leave blank for placeholder"
                  value={posterUrl} 
                  onChange={(e) => setPosterUrl(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="new-desc">Description</label>
                <textarea 
                  id="new-desc" 
                  className="form-control"
                  style={{ minHeight: '80px', fontFamily: 'inherit' }}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="add-movie-submit">
                Publish Movie
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
