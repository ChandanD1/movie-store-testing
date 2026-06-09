describe('MovieSphere Checkout, Cart, and Admin Flow Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // CY-04: Watchlist Quantity Management
  it('should update movie quantities in the watchlist drawer', () => {
    // 1. Wait for catalog to load
    cy.get('.movie-card').should('have.length.at.least', 3);

    // 2. Add Inception (first movie) to watchlist
    cy.get('.movie-card').first().within(() => {
      cy.get('.movie-title').should('contain', 'Inception');
      cy.get('button.btn-primary').click();
    });

    // 3. Assert cart drawer is open and shows correct initial state
    cy.get('#cart-sidebar').should('have.class', 'open');
    cy.get('.cart-item').should('have.length', 1);
    cy.get('[id^=qty-val-]').first().should('have.text', '1');
    cy.get('#cart-total-value').should('contain', '₹199');

    // 4. Increment quantity using the "+" button
    cy.get('.qty-btn').contains('+').click();
    cy.get('[id^=qty-val-]').first().should('have.text', '2');
    cy.get('#cart-total-value').should('contain', '₹398');

    // 5. Decrement quantity using the "-" button
    cy.get('.qty-btn').contains('-').click();
    cy.get('[id^=qty-val-]').first().should('have.text', '1');
    cy.get('#cart-total-value').should('contain', '₹199');
  });

  // CY-05: User Login & Watchlist Checkout
  it('should authenticate user and complete watchlist checkout', () => {
    // Wait for the app to hydrate
    cy.get('.movie-card').should('have.length.at.least', 3);

    // 1. Open the login dialog
    cy.get('#login-btn').click();
    cy.get('dialog#login-dialog').should('be.visible');

    // 2. Input standard credentials and submit
    cy.get('#login-email').type('user@example.com');
    cy.get('#login-password').type('password');
    cy.get('#login-submit-btn').click();

    // 3. Confirm authentication header updates
    cy.get('#user-profile-nav').should('be.visible');
    cy.get('#user-profile-nav').should('contain', 'Hi, Standard User');
    cy.get('#login-btn').should('not.exist');

    // 4. Add Inception to watchlist
    cy.get('.movie-card').first().within(() => {
      cy.get('.movie-title').should('contain', 'Inception');
      cy.get('button.btn-primary').click();
    });

    // 5. Assert the watchlist drawer slides out and contains Inception
    cy.get('#cart-sidebar').should('have.class', 'open');
    cy.get('.cart-item').should('have.length', 1);
    cy.get('#cart-total-value').should('contain', '₹199');

    // 6. Complete watchlist addition
    cy.get('#checkout-email').should('have.value', 'user@example.com');
    cy.get('#checkout-submit-btn').click();

    // 7. Verify order submission feedback from the API
    cy.get('#checkout-success-msg').should('be.visible');
    cy.get('#checkout-success-msg').should('contain', 'Order placed successfully');

    // 8. Wait for the watchlist to close and verify it's cleared
    cy.wait(3500); // Wait for the success timeout redirection
    cy.get('#cart-sidebar').should('not.have.class', 'open');

    // Open watchlist again to assert it is empty
    cy.get('#cart-btn').click();
    cy.get('#empty-cart-msg').should('be.visible').and('contain', 'Your watchlist is empty');
  });

  // CY-06: Admin Toggle & Control Panel View
  it('should toggle and verify admin dashboard view', () => {
    // 1. Open login dialog
    cy.get('#login-btn').click();
    cy.get('dialog#login-dialog').should('be.visible');

    // 2. Input admin credentials and submit
    cy.get('#login-email').type('admin@example.com');
    cy.get('#login-password').type('admin123');
    cy.get('#login-submit-btn').click();

    // 3. Verify admin logged in
    cy.get('#user-profile-nav').should('be.visible');
    cy.get('#user-profile-nav').should('contain', 'Hi, Admin User');

    // 4. Toggle admin panel view
    cy.get('#admin-view-toggle').should('be.visible').and('contain', 'Admin Panel').click();

    // 5. Assert admin dashboard loads
    cy.get('.admin-container').should('be.visible');
    cy.get('.admin-header h1').should('contain', 'Admin Control Center');

    // 6. Navigate to Manage Catalog tab
    cy.get('#admin-tab-movies').click();
    cy.get('#admin-movies-table').should('be.visible');

    // 7. Toggle back to Shop View
    cy.get('#admin-view-toggle').click();
    cy.get('.admin-container').should('not.exist');
    cy.get('.movie-card').should('have.length.at.least', 3);

    // 8. Logout and verify state
    cy.get('#logout-btn').click();
    cy.get('#user-profile-nav').should('not.exist');
    cy.get('#admin-view-toggle').should('not.exist');
    cy.get('#login-btn').should('be.visible');
  });
});
