# MovieSphere Test Automation Suites – Code & Logic Explanation

This document provides a detailed breakdown of the test code and logic implemented across all three automation platforms: **Selenium WebDriver (Java)**, **Cypress E2E (JavaScript)**, and **Apache JMeter (API Performance)**.

---

## 1. Selenium WebDriver (Java TestNG)
**File location:** [MovieStoreTest.java](file:///Users/chandan_dhumale/Desktop/movie-store/tests/selenium/java-maven/src/test/java/com/moviestore/MovieStoreTest.java)

The Selenium suite uses **TestNG** for execution lifecycle and assertions, **WebDriverManager** to handle driver downloads, and **WebDriverWait** for explicit wait conditions to prevent UI timing issues.

### 1.1 Suite Setup & Configuration
```java
@BeforeMethod
public void setUp() {
    WebDriverManager.chromedriver().setup(); // Autodetects and downloads compatible ChromeDriver
    ChromeOptions options = new ChromeOptions();
    // Configure sandbox and headless flags
    options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--window-size=1280,800");
    driver = new ChromeDriver(options);
    wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // Explicit wait threshold (10 seconds)
    driver.get("http://localhost:5173");
}
```

### 1.2 Test Cases Logic

#### SEL-01: Invalid Login Validation Flow
* **Logic:** Clicks the login button, waits for the `<dialog>` modal to animate into view, enters invalid credentials, submits the form, and asserts that the validation warning alert with ID `#login-error-msg` displays the text `"Invalid email or password"`.

#### SEL-02: Admin Movie Creation Flow
* **Logic:** Logs in with admin credentials (`admin@example.com`/`admin123`), clicks the "Admin Panel" view toggle, selects the "Manage Catalog" tab, fills in the creation form, submits it, asserts the green success banner contains `"added successfully"`, toggles back to "Shop View", searches for the new title, and asserts that its card is displayed on the storefront.

#### SEL-03: Catalog Search & Details Modal Flow
* **Logic:** Verifies branding logo text, inputs `"Dune"` into the search bar, asserts that the catalog grid filters to only display "Dune: Part Two", clicks its poster wrapper, verifies the details modal dialog (`#movie-details-dialog`) opens containing details like `"Genre: Sci-Fi"`, clicks close, and asserts the modal becomes invisible.

#### SEL-04: Watchlist Quantity Adjustment
* **Logic:** Clicks "Watch Now" on "Inception" to add it to the cart, asserts the sidebar drawer receives the class `.open`, validates that the initial quantity is `"1"` and pricing is `₹199`, clicks the `+` button, verifies the quantity increments to `"2"` and total price updates to `₹398`, clicks `-`, and verifies they revert to initial states.

#### SEL-05: User Login & Logout Flow
* **Logic:** Validates standard user login session state. Submits correct user credentials, asserts the navigation profile shows `"Hi, Standard User"`, clicks "Logout", and asserts the greeting disappears and the "Login" button returns.

#### SEL-06: Admin Movie Deletion Flow
* **Logic:** Logs in as admin, toggles to the admin catalog table, publishes a temporary movie, clicks the "Delete" button matching that movie's row, switches to the native browser alert context using `driver.switchTo().alert().accept()` to accept the confirm dialog, and asserts that the success banner displays `"Movie deleted successfully"`.

---

## 2. Cypress E2E Tests (JavaScript)
Cypress E2E tests drive the browser natively and run fully automated assertions directly against DOM states.

### 2.1 Catalog Search, Filter & Modal Flow
**File location:** [search_filter_and_modal_view_flow.cy.js](file:///Users/chandan_dhumale/Desktop/movie-store/tests/cypress/cypress/e2e/search_filter_and_modal_view_flow.cy.js)

*   **CY-01: Movie Catalog Search**
    *   *Code:* `cy.get('#movie-search-input').type('Dune');`
    *   *Logic:* Asserts that the catalog grid (`.movie-card`) filters dynamically from a list of items to exactly 1 matching item containing `"Dune: Part Two"`.
*   **CY-02: Genre Tag Filtering**
    *   *Code:* `cy.get('#genre-tag-action').click();`
    *   *Logic:* Asserts that clicking the Action tag displays "The Dark Knight" and hides "Inception" (which is Sci-Fi).
*   **CY-03: Movie Details Modal View & Dismiss**
    *   *Code:* `cy.get('.movie-poster-wrapper').first().click();`
    *   *Logic:* Clicks the first poster, asserts the HTML5 `<dialog>` element `dialog#movie-details-dialog` is visible, checks the metadata details, clicks `#close-details-modal`, and asserts it is hidden.

### 2.2 Purchase & Admin Flow
**File location:** [purchase_and_admin_flow.cy.js](file:///Users/chandan_dhumale/Desktop/movie-store/tests/cypress/cypress/e2e/purchase_and_admin_flow.cy.js)

*   **CY-04: Watchlist Quantity Management**
    *   *Code:* `cy.get('.qty-btn').contains('+').click();`
    *   *Logic:* Adds "Inception" (₹199) to the cart, verifies the drawer receives the class `.open`, clicks `+` and `-` quantity buttons, and asserts that the quantity text and the `#cart-total-value` update reactively.
*   **CY-05: User Login & Watchlist Checkout Flow**
    *   *Code:* `cy.get('#checkout-submit-btn').click();`
    *   *Logic:* Automates user login, adds a movie to the cart, clicks checkout (with email pre-filled), asserts the API success message `Order placed successfully` is displayed, waits for the success redirection timer, and asserts the cart closes and is cleared.
*   **CY-06: Admin Toggle & Dashboard Control Panel View**
    *   *Code:* `cy.get('#admin-view-toggle').click();`
    *   *Logic:* Logs in as admin, clicks the toggle button, asserts that the admin container (`.admin-container`) loads containing the control center, navigates tabs, toggles back to Shop view, and logs out to clean up session states.

---

## 3. Apache JMeter API Performance Tests
**File location:** [movie_store_load_test.jmx](file:///Users/chandan_dhumale/Desktop/movie-store/tests/jmeter/movie_store_load_test.jmx)

JMeter tests the API directly (bypassing the frontend rendering engine entirely) to measure concurrency, throughput, and server load capacity.

### 3.1 Test Cases & Thread Configurations

1.  **Browse Movies Load Test (JM-01)**
    *   *Endpoint:* `GET /api/movies` (Fetches movie list).
    *   *Load:* 20 concurrent users, 5-second ramp-up, loop count: 2.
    *   *Assertions:* Response code must be `200` and the response headers must contain `application/json`.
2.  **Place Orders Stress Test (JM-02)**
    *   *Endpoint:* `POST /api/orders` (Submits a checkout order).
    *   *Load:* 50 concurrent users, 10-second ramp-up, loop count: 1.
    *   *Payload:* JSON body containing user email, total price, and items.
    *   *Assertions:* Response code must be `201` (Created).
3.  **User Authentication Load Test (JM-03)**
    *   *Endpoint:* `POST /api/auth/login` (Authenticates user).
    *   *Load:* 10 concurrent users, 2-second ramp-up, loop count: 1.
    *   *Payload:* `{ "email": "user@example.com", "password": "password" }`.
    *   *Assertions:* Response code must be `200`.
4.  **Fetch Movie Details Load Test (JM-04)**
    *   *Endpoint:* `GET /api/movies/66503c00d11019688bc8a9b1` (Gets details of Inception by its MongoDB ID).
    *   *Load:* 15 concurrent users, 3-second ramp-up, loop count: 1.
    *   *Assertions:* Response code must be `200`.
5.  **Admin Fetch Orders Load Test (JM-05)**
    *   *Endpoint:* `GET /api/orders` (Gets a list of all placed orders).
    *   *Load:* 5 concurrent users, 1-second ramp-up, loop count: 1.
    *   *Headers:* `Authorization: mock-jwt-admin-token-12345` (Admin token required by middleware).
    *   *Assertions:* Response code must be `200`.
6.  **Admin Add Movie Load Test (JM-06)**
    *   *Endpoint:* `POST /api/movies` (Publishes a new movie).
    *   *Load:* 5 concurrent users, 1-second ramp-up, loop count: 1.
    *   *Payload:* JSON body containing movie title, description, price, stock, and release year.
    *   *Headers:* `Authorization: mock-jwt-admin-token-12345` (Admin token required by middleware).
    *   *Assertions:* Response code must be `201` (Created).
