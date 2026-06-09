import React, { useState } from 'react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onClearCart, user, onCheckoutSuccess }) => {
  const [email, setEmail] = useState(user ? user.email : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Update local state when user prop changes
  React.useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    const orderData = {
      userEmail: email,
      items: cartItems.map(item => ({
        movieId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(`Order placed successfully! Order ID: ${data._id}`);
        setTimeout(() => {
          onClearCart();
          onCheckoutSuccess();
          setSuccessMsg('');
          onClose();
        }, 3000);
      } else {
        setError(data.message || 'Something went wrong processing your checkout.');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Is it running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        id="cart-overlay"
      ></div>
      
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} id="cart-sidebar">
        <div className="cart-header">
          <h2>My Watchlist</h2>
          <button className="modal-close-btn" onClick={onClose} id="close-cart-btn">
            &times;
          </button>
        </div>

        <div className="cart-items">
          {successMsg && (
            <div className="success-message" id="checkout-success-msg">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="auth-error" id="checkout-error-msg" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }} id="empty-cart-msg">
              Your watchlist is empty.
            </p>
          ) : (
            cartItems.map(item => (
              <div className="cart-item" key={item._id} id={`cart-item-${item._id}`}>
                <img src={item.posterUrl} alt={item.title} className="cart-item-poster" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-item-qty">
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQty(item._id, item.quantity - 1)}
                      id={`dec-qty-${item._id}`}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center' }} id={`qty-val-${item._id}`}>{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQty(item._id, item.quantity + 1)}
                      id={`inc-qty-${item._id}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && !successMsg && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span id="cart-total-value">₹{totalAmount}</span>
            </div>

            <form onSubmit={handleCheckout} className="form-group" style={{ gap: '0.8rem' }}>
              <div className="form-group">
                <label htmlFor="checkout-email">Billing Email</label>
                <input 
                  type="email" 
                  id="checkout-email" 
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={isSubmitting}
                id="checkout-submit-btn"
              >
                {isSubmitting ? 'Processing...' : 'Add to Watchlist'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
