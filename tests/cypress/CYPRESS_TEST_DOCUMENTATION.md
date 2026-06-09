# Cypress Test Documentation

## Overview
This document provides comprehensive documentation for the Cypress E2E tests implemented for the MovieSphere application. Cypress is used for end-to-end testing to verify the application's API functionality and user flows.

## Test Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running on localhost:27017
- MovieSphere backend server running on http://localhost:5000
- Chrome browser (Cypress default)

### Installation Steps

1. **Navigate to Cypress test directory:**
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/tests/cypress
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/backend
   npm install
   npm start
   ```

4. **Run Cypress tests:**
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/tests/cypress
   npm test
   ```

   This will open the Cypress Test Runner where you can select and run tests.

5. **Run tests in headless mode (CI/CD):**
   ```bash
   npx cypress run
   ```

## Test Case 1: Create and Retrieve Movie

### Test Objective
Verify that the API can successfully create a new movie and then retrieve it by ID.

### Test Steps

1. **Setup Test Data**
   - Define a new movie object with all required fields:
     ```javascript
     const newMovie = {
       title: 'Test Movie',
       genre: 'Action',
       year: 2024,
       rating: 8.5,
       price: 12.99,
       description: 'A test movie for Cypress'
     };
     ```

2. **Create Movie via POST Request**
   - Send POST request to `/api/movies`
   - Include movie data in request body
   - Set Content-Type header to application/json
   - Wait for response

3. **Verify Creation Response**
   - Assert response status is 201 (Created)
   - Assert response body contains `_id` field
   - Assert response body `title` matches input
   - Store the returned `_id` for retrieval test

4. **Retrieve Movie via GET Request**
   - Send GET request to `/api/movies/:id` using the stored ID
   - Wait for response

5. **Verify Retrieval Response**
   - Assert response status is 200 (OK)
   - Assert response body `title` matches input
   - Assert response body `genre` matches input
   - Verify all fields are present and correct

### Expected Results
- POST request returns 201 status code
- Response includes generated MongoDB `_id`
- GET request returns 200 status code
- Retrieved movie data matches the created movie data
- No errors during the process

### Test Code Implementation

```javascript
describe('Movie Store API Tests', () => {
  const apiUrl = 'http://localhost:5000/api/movies';
  let movieId;

  // Test Case 1: Create and Retrieve Movie
  it('should create a new movie and retrieve it', () => {
    const newMovie = {
      title: 'Test Movie',
      genre: 'Action',
      year: 2024,
      rating: 8.5,
      price: 12.99,
      description: 'A test movie for Cypress'
    };

    // Create movie
    cy.request('POST', apiUrl, newMovie).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.title).to.equal(newMovie.title);
      movieId = response.body._id;

      // Retrieve the created movie
      cy.request('GET', `${apiUrl}/${movieId}`).then((getResponse) => {
        expect(getResponse.status).to.equal(200);
        expect(getResponse.body.title).to.equal(newMovie.title);
        expect(getResponse.body.genre).to.equal(newMovie.genre);
      });
    });
  });
});
```

### Test Data Used
- Title: "Test Movie"
- Genre: "Action"
- Year: 2024
- Rating: 8.5
- Price: 12.99
- Description: "A test movie for Cypress"

### Pass/Fail Criteria
- **Pass:** Movie created successfully with 201 status, retrieved successfully with 200 status, all data matches
- **Fail:** Any status code mismatch, missing fields, or data mismatch

### API Endpoints Tested
- `POST /api/movies` - Create new movie
- `GET /api/movies/:id` - Get movie by ID

---

## Test Case 2: Update and Delete Movie

### Test Objective
Verify that the API can successfully update an existing movie and then delete it.

### Test Steps

1. **Create Test Movie**
   - Send POST request to `/api/movies` with initial data:
     ```javascript
     {
       title: 'Movie to Update',
       genre: 'Drama',
       year: 2023,
       rating: 7.5,
       price: 10.99
     }
     ```
   - Store the returned `_id`

2. **Update Movie via PUT Request**
   - Define updated movie data:
     ```javascript
     const updatedMovie = {
       title: 'Updated Test Movie',
       genre: 'Comedy',
       year: 2025,
       rating: 9.0,
       price: 14.99,
       description: 'Updated test movie'
     };
     ```
   - Send PUT request to `/api/movies/:id`
   - Include updated data in request body

3. **Verify Update Response**
   - Assert response status is 200 (OK)
   - Assert response body `title` matches updated title
   - Assert response body `genre` matches updated genre
   - Verify all fields are updated correctly

4. **Delete Movie via DELETE Request**
   - Send DELETE request to `/api/movies/:id`
   - Wait for response

5. **Verify Delete Response**
   - Assert response status is 200 (OK)
   - Assert response body contains success message
   - Verify message: "Movie deleted successfully"

6. **Verify Deletion**
   - Send GET request to `/api/movies/:id` for deleted movie
   - Assert response status is 404 (Not Found)
   - Confirm movie no longer exists

### Expected Results
- PUT request returns 200 status code
- Movie data is updated with new values
- DELETE request returns 200 status code
- Success message is returned
- Subsequent GET request returns 404 status
- Movie is permanently removed from database

### Test Code Implementation

```javascript
// Test Case 2: Update and Delete Movie
it('should update a movie and then delete it', () => {
  const updatedMovie = {
    title: 'Updated Test Movie',
    genre: 'Comedy',
    year: 2025,
    rating: 9.0,
    price: 14.99,
    description: 'Updated test movie'
  };

  // First create a movie to update
  cy.request('POST', apiUrl, {
    title: 'Movie to Update',
    genre: 'Drama',
    year: 2023,
    rating: 7.5,
    price: 10.99
  }).then((createResponse) => {
    const testMovieId = createResponse.body._id;

    // Update the movie
    cy.request('PUT', `${apiUrl}/${testMovieId}`, updatedMovie).then((updateResponse) => {
      expect(updateResponse.status).to.equal(200);
      expect(updateResponse.body.title).to.equal(updatedMovie.title);
      expect(updateResponse.body.genre).to.equal(updatedMovie.genre);

      // Delete the movie
      cy.request('DELETE', `${apiUrl}/${testMovieId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal('Movie deleted successfully');

        // Verify deletion
        cy.request({
          method: 'GET',
          url: `${apiUrl}/${testMovieId}`,
          failOnStatusCode: false
        }).then((verifyResponse) => {
          expect(verifyResponse.status).to.equal(404);
        });
      });
    });
  });
});
```

### Test Data Used
**Initial Movie:**
- Title: "Movie to Update"
- Genre: "Drama"
- Year: 2023
- Rating: 7.5
- Price: 10.99

**Updated Movie:**
- Title: "Updated Test Movie"
- Genre: "Comedy"
- Year: 2025
- Rating: 9.0
- Price: 14.99
- Description: "Updated test movie"

### Pass/Fail Criteria
- **Pass:** Movie updated successfully with 200 status, deleted successfully with 200 status, verification returns 404
- **Fail:** Any status code mismatch, data not updated, or deletion verification fails

### API Endpoints Tested
- `POST /api/movies` - Create initial movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `GET /api/movies/:id` - Verify deletion

---

## Test Execution Flow

### Complete Test Suite Execution

1. **Setup Phase**
   - Start MongoDB service
   - Start the backend server
   - Verify server is running on port 5000
   - Open Cypress Test Runner

2. **Test Execution Phase**
   - Select test file: `movie-api.cy.js`
   - Run Test Case 1 (Create and Retrieve)
   - Verify Test Case 1 results in Test Runner
   - Run Test Case 2 (Update and Delete)
   - Verify Test Case 2 results in Test Runner

3. **Cleanup Phase**
   - Tests automatically clean up by deleting test data
   - Close Cypress Test Runner
   - Stop server (optional)

### Running Tests in Cypress Test Runner

1. **Interactive Mode:**
   ```bash
   npm test
   ```
   - Opens Cypress Test Runner GUI
   - Click on test file to run
   - Watch tests execute in real-time
   - View detailed logs and screenshots

2. **Headless Mode:**
   ```bash
   npx cypress run
   ```
   - Runs tests without GUI
   - Suitable for CI/CD pipelines
   - Generates test reports

### Running Individual Tests

To run a specific test case, modify the test file to use `.only()`:

```javascript
it.only('should create a new movie and retrieve it', () => {
  // Test code
});
```

## Cypress Configuration

### cypress.config.js

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
});
```

### Configuration Options
- `baseUrl`: Base URL for all API requests
- `supportFile`: Disabled for simplicity
- `specPattern`: Pattern to find test files

## Troubleshooting

### Common Issues and Solutions

1. **Server not responding**
   - Solution: Ensure backend server is running on port 5000
   - Check MongoDB is running
   - Verify no firewall blocking the connection

2. **CORS errors**
   - Solution: Ensure CORS is enabled in backend
   - Check CORS configuration in server.js

3. **Test timeout**
   - Solution: Increase timeout in cypress.config.js
   - Check if server is slow to respond

4. **Database connection errors**
   - Solution: Verify MongoDB is running
   - Check connection string in .env file
   - Ensure database exists

5. **Authentication errors (if enabled)**
   - Solution: Tests currently use public endpoints
   - If auth is required, add login steps before API calls

## Test Maintenance

### When to Update Tests

- When API endpoints change
- When request/response structure changes
- When authentication requirements change
- When validation rules change

### Best Practices

1. **Use descriptive test names:** Clearly indicate what is being tested
2. **Clean up test data:** Delete created test data to avoid interference
3. **Use environment variables:** Store URLs and credentials in config
4. **Add assertions:** Verify all important aspects of the response
5. **Document changes:** Update this documentation when tests change

## Test Coverage

### Currently Covered
- ✅ Create movie via API
- ✅ Retrieve movie by ID via API
- ✅ Update movie via API
- ✅ Delete movie via API

### Future Test Cases (Optional Enhancements)
- Get all movies via API
- Validation tests (missing required fields)
- Error handling tests (invalid data)
- Authentication tests (login/register via API)
- Pagination tests
- Search/filter tests
- Rate limiting tests

## Cypress Features Used

### cy.request()
- Used for making HTTP requests to API endpoints
- Supports GET, POST, PUT, DELETE methods
- Automatic JSON parsing of responses

### Assertions
- `expect().to.equal()` - Exact value matching
- `expect().to.have.property()` - Check property existence
- Chai assertions for readable test code

### Test Organization
- `describe()` - Groups related tests
- `it()` - Defines individual test cases
- Nested callbacks for sequential operations

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Cypress Tests
on: [push]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: cypress-io/github-action@v4
        with:
          start: npm start
          wait-on: 'http://localhost:5000'
```

## Performance Considerations

- Tests run quickly (typically < 5 seconds total)
- No browser overhead for API tests
- Direct HTTP requests are efficient
- Suitable for frequent execution in CI/CD

## Conclusion

These Cypress tests provide automated verification of the Movie Store application's API functionality. They ensure that the REST API endpoints work correctly for creating, retrieving, updating, and deleting movies. The tests are fast, reliable, and easy to maintain, making them ideal for continuous integration and development workflows.

For questions or issues with the Cypress tests, refer to the main project README or contact the development team.
