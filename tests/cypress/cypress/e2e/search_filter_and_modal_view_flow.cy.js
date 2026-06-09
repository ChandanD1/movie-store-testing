describe('MovieSphere Catalog Search, Filter, and Details Tests', () => {
  beforeEach(() => {
    // Visit the frontend home page
    cy.visit('/');
  });

  // CY-01: Movie Catalog Search
  it('should load the catalog and filter by search query', () => {
    // 1. Verify that the title and branding exist
    cy.get('#brand-logo').should('contain', 'MovieSphere');

    // 2. Assert that the grid displays seeded movie items
    cy.get('.movie-card').should('have.length.at.least', 3);

    // 3. Search for a specific movie: "Dune"
    cy.get('#movie-search-input').type('Dune');

    // 4. Verify that only "Dune: Part Two" remains and others are gone
    cy.get('.movie-card').should('have.length', 1);
    cy.get('.movie-title').first().should('contain', 'Dune: Part Two');
  });

  // CY-02: Genre Tag Filtering
  it('should filter movies by genre tags', () => {
    // Click on the Action genre button
    cy.get('#genre-tag-action').click();

    // Verify only action movies (like The Dark Knight) are shown
    cy.get('.movie-card').should('contain', 'The Dark Knight');
    cy.get('.movie-card').should('not.contain', 'Inception'); // Inception is Sci-Fi
  });

  // CY-03: Movie Details Modal View & Dismiss
  it('should open and close the movie details modal', () => {
    // 1. Assert that the grid displays seeded movie items
    cy.get('.movie-card').should('have.length.at.least', 3);

    // 2. Click the poster wrapper of the first movie (Inception) to open details
    cy.get('.movie-poster-wrapper').first().click();

    // 3. Assert modal is visible and shows correct data
    cy.get('dialog#movie-details-dialog').should('be.visible');
    cy.get('#dialog-title').should('contain', 'Inception');
    cy.get('dialog#movie-details-dialog').should('contain', 'Genre: Sci-Fi');

    // 4. Dismiss modal using the close button
    cy.get('#close-details-modal').click();

    // 5. Assert modal is no longer open
    cy.get('dialog#movie-details-dialog').should('not.be.visible');
  });
});
