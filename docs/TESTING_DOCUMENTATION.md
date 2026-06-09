# SOFTWARE TESTING DOCUMENTATION
## MovieSphere – Movie Store Web Application

---

## 1. Introduction

### 1.1 Project Overview
**MovieSphere** is a premium, full-stack Movie Store web application developed using **React**, **Node.js**, **Express**, and **MongoDB**. The application allows users to browse movies, search by keywords, filter by genre, add movies to a checkout watchlist cart, and place purchase orders. The administration module supports robust catalogue and movie management functionalities.

### 1.2 Objective of Testing
The objective of testing was to verify:
* **Functional correctness** of the application features.
* **UI behavior** and end-to-end user workflows.
* **API reliability** and response stability.
* **Performance** under concurrent load and high stress.
* **System stability** during normal and administrative user operations.

### 1.3 Testing Tools Used
| Tool | Purpose |
| :--- | :--- |
| **Cypress** | End-to-End (E2E) Testing |
| **Selenium WebDriver (Java Maven)** | Browser UI Automation Testing |
| **Apache JMeter** | Performance & API Load/Stress Testing |

---

## 2. Application Architecture

![Figure 1: Application Architecture](../docs/images/architecture.png)
*Figure 1: Application Architecture*

<br/>

![Figure 2: MovieSphere Application Interface](../docs/images/interface.png)
*Figure 2: MovieSphere Application Interface*

---

## 3. Testing Environment

| Component | Details |
| :--- | :--- |
| **Frontend** | React (Vite) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Browser** | Google Chrome |
| **OS** | macOS / Windows |
| **Testing Frameworks** | Cypress, Selenium, Apache JMeter |

---

## 4. Cypress Testing (E2E)

### 4.1 Overview
Cypress was used for End-to-End testing of frontend workflows, user interactivity, and backend API integration. All tests use explicit assertions (e.g. `cy.get().should()`) to ensure DOM state consistency and reliability.

#### Test Case CY-01: Movie Catalog Search
* **Objective:** Verify that users can search movies and obtain correct filtered results in the catalogue catalogue grid.
* **Test Steps:**
  1. Open the MovieSphere home page.
  2. Enter "Dune" in the search bar.
  3. Assert that only "Dune: Part Two" remains visible and other movies are hidden.
* **Expected Result:** Search input dynamically filters the grid to display only matching title cards.
* **Actual Result:** Catalogue successfully filtered.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 1: Movie Catalog Search Results]**
> *(Replace this block with the screenshot of Cypress executing CY-01)*

---

#### Test Case CY-02: Genre Tag Filtering
* **Objective:** Verify that clicking genre tags displays only matching category movies.
* **Test Steps:**
  1. Open the MovieSphere home page.
  2. Click on the "Action" genre tag.
  3. Assert that only action movies (e.g. "The Dark Knight") are shown and other genres are hidden.
* **Expected Result:** Only movies containing the "Action" genre are displayed in the catalog.
* **Actual Result:** Genre filtering behaved as expected.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 2: Genre Tag Filtering Results]**
> *(Replace this block with the screenshot of Cypress executing CY-02)*

---

#### Test Case CY-03: Movie Details Modal View & Dismissal
* **Objective:** Verify that clicking a movie poster opens the details modal with correct metadata, and closes successfully.
* **Test Steps:**
  1. Open the MovieSphere home page.
  2. Click the poster wrapper of the first movie (Inception).
  3. Assert that the movie details modal `dialog#movie-details-dialog` is visible.
  4. Assert the modal contains the title "Inception" and correct genre details.
  5. Click the close button `#close-details-modal`.
  6. Assert the modal is no longer visible.
* **Expected Result:** Modal should render detailed movie info on click and successfully hide on dismissal.
* **Actual Result:** Modal opened and dismissed correctly.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 3: Movie Details Modal Validation]**
> *(Replace this block with the screenshot of Cypress executing CY-03)*

---

#### Test Case CY-04: Watchlist Quantity Management
* **Objective:** Verify that users can increment and decrement movie quantities in the watchlist drawer with corresponding price updates.
* **Test Steps:**
  1. Open the MovieSphere home page.
  2. Add the first movie (Inception, ₹199) to the watchlist.
  3. Assert the watchlist drawer opens and shows initial quantity "1" and total price "₹199".
  4. Click the "+" button to increment quantity.
  5. Assert quantity updates to "2" and total price updates to "₹398".
  6. Click the "-" button to decrement quantity.
  7. Assert quantity updates to "1" and total price reverts to "₹199".
* **Expected Result:** Quantity values and total pricing updates reactively upon drawer button clicks.
* **Actual Result:** Quantities and pricing updated correctly.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 4: Watchlist Quantity Increment & Decrement]**
> *(Replace this block with the screenshot of Cypress executing CY-04)*

---

#### Test Case CY-05: User Login & Watchlist Checkout Flow
* **Objective:** Verify complete user authentication and checkout order submission.
* **Test Steps:**
  1. Open login modal, enter user credentials (`user@example.com` / `password`), and submit.
  2. Assert user greeting profile appears in the navbar.
  3. Add a movie to the watchlist.
  4. Fill out the checkout email input field (pre-filled) and click the "Add to Watchlist" checkout submit button.
  5. Verify successful order creation success banner and watchlist clear state.
* **Expected Result:** Order is processed successfully, database updates, and cart clears upon checkout.
* **Actual Result:** Checkout completed successfully and database records were created.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 5: User Login & Watchlist Checkout Success]**
> *(Replace this block with the screenshot of Cypress executing CY-05)*

---

#### Test Case CY-06: Admin Toggle & Dashboard Control Panel View
* **Objective:** Verify administrative user toggle navigation to the admin control panel.
* **Test Steps:**
  1. Log in using admin credentials (`admin@example.com` / `admin123`).
  2. Assert the "Admin Panel" toggle button is visible.
  3. Click "Admin Panel" and assert the admin control dashboard panel loaded.
  4. Click the "Manage Catalog" tab to verify catalog grid visibility.
  5. Click "Shop View" to return to the catalog, then log out.
* **Expected Result:** Admin dashboard is restricted to admins and toggles views correctly.
* **Actual Result:** View toggling worked and restricted panel access as expected.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 6: Admin Dashboard Toggle Verification]**
> *(Replace this block with the screenshot of Cypress executing CY-06)*

---

## 5. Selenium Testing (Java Maven)

### 5.1 Overview
Selenium WebDriver was configured within a Java Maven environment using TestNG to execute browser automation. The execution pauses briefly at each step to allow real-time observation.

#### Test Case SEL-01: Login Validation Testing (Invalid Credentials)
* **Objective:** Verify login validation feedback under invalid user details.
* **Test Steps:**
  1. Click "Login" in the navigation bar.
  2. Input invalid credentials (`baduser@example.com` / `wrong_pass`) and submit.
  3. Assert that the red validation error banner appears with "Invalid email or password".
* **Expected Result:** Login fails and presents clear validation warnings to the user.
* **Actual Result:** Validation warning was shown correctly.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 7: Invalid Login Error Banner]**
> *(Replace this block with the screenshot of Selenium executing SEL-01)*

---

#### Test Case SEL-02: Admin Movie Creation Flow
* **Objective:** Verify that an administrator can publish a new movie to the store.
* **Test Steps:**
  1. Log in as an administrator (`admin@example.com` / `admin123`).
  2. Toggle to "Admin Panel" and navigate to the "Manage Catalog" tab.
  3. Fill out the movie creation form and click "Publish Movie".
  4. Assert the success banner displays "added successfully".
  5. Toggle back to "Shop View", search the new movie title, and assert its card is visible in the shop catalog.
* **Expected Result:** Admin published movie should save to database and display publicly in the store.
* **Actual Result:** Movie successfully created and verified in public view.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 8: Admin Movie Creation Form & Success]**
> *(Replace this block with the screenshot of Selenium executing SEL-02)*

---

#### Test Case SEL-03: Catalog Search & Details Modal View
* **Objective:** Verify catalog search and details modal functionality in Selenium.
* **Test Steps:**
  1. Verify the brand logo contains "MovieSphere".
  2. Input "Dune" in the search input field.
  3. Assert that only the matching movie is shown in the catalog.
  4. Click the movie poster to open the details dialog.
  5. Assert the details modal is visible and verify details (title, genre).
  6. Click the close modal button and assert the dialog disappears.
* **Expected Result:** Search filters catalog dynamically; clicking poster opens the correct details modal.
* **Actual Result:** Search and details dialog performed correctly.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 9: Movie Catalog Search & Details Modal View]**
> *(Replace this block with the screenshot of Selenium executing SEL-03)*

---

#### Test Case SEL-04: Watchlist Quantity Adjustment
* **Objective:** Verify quantity modifications update totals in Selenium.
* **Test Steps:**
  1. Click the "Watch Now" button for the first movie (Inception).
  2. Assert the watchlist drawer is open and contains Inception, initial qty = 1, price = ₹199.
  3. Click the "+" button to increment quantity.
  4. Assert quantity is 2 and total price is ₹398.
  5. Click the "-" button to decrement quantity.
  6. Assert quantity is 1 and total price is ₹199.
* **Expected Result:** Watchlist drawer opens on item add, and reacts correctly to quantity increment/decrement.
* **Actual Result:** Drawer quantity and total updates performed successfully.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 10: Watchlist Quantity Adjustment Verification]**
> *(Replace this block with the screenshot of Selenium executing SEL-04)*

---

#### Test Case SEL-05: Successful User Login & Logout Session
* **Objective:** Verify standard user login session state changes and logout.
* **Test Steps:**
  1. Click "Login", input standard credentials (`user@example.com` / `password`), and submit.
  2. Assert navbar profile text contains "Hi, Standard User".
  3. Click the "Logout" button.
  4. Assert navbar profile text disappears and "Login" button returns.
* **Expected Result:** User authentication updates nav state; logging out cleans the session.
* **Actual Result:** Login and logout states verified successfully.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 11: Successful User Login & Logout Navbar Transition]**
> *(Replace this block with the screenshot of Selenium executing SEL-05)*

---

#### Test Case SEL-06: Admin Movie Deletion Flow
* **Objective:** Verify that an administrator can delete a movie from the catalog.
* **Test Steps:**
  1. Log in as an administrator.
  2. Toggle to "Admin Panel" and open "Manage Catalog".
  3. Publish a temporary dummy movie.
  4. Locate the dummy movie's row in the catalog table and click "Delete".
  5. Accept the browser confirmation alert dialog.
  6. Assert the success banner displays "Movie deleted successfully".
* **Expected Result:** Admin deletion removes the movie from the catalog table, prompting a confirmation dialog beforehand.
* **Actual Result:** Movie was successfully published, deleted, and verified removed.
* **Status:** ✅ Pass

*Screenshot Placeholder:*
> **[Screenshot 12: Admin Movie Deletion Table & Dialog]**
> *(Replace this block with the screenshot of Selenium executing SEL-06)*

---

## 6. JMeter Performance Testing

### 6.1 Overview
Apache JMeter was used for load and stress testing of the application's REST API endpoints. We configured 6 separate Thread Groups to verify API response codes and JSON outputs under concurrent traffic.

#### Test Case JM-01: Browse Movies Catalog API (`GET /api/movies`)
* **Objective:** Verify movie fetch performance under concurrent catalog page loads.
* **Configuration:** 20 users, 5s ramp-up, loops: 2.
* **Expected Status:** `200 OK` (with JSON content-type header).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 13: GET /api/movies - Thread Group Config]**
> **[Screenshot 14: GET /api/movies - Summary Report]**

---

#### Test Case JM-02: Place Checkout Order API (`POST /api/orders`)
* **Objective:** Stress test checkout order placement under concurrent checkout submissions.
* **Configuration:** 50 users, 10s ramp-up, loops: 1.
* **Expected Status:** `201 Created` (with valid order payload).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 15: POST /api/orders - Header and Post Config]**
> **[Screenshot 16: POST /api/orders - Aggregate Report / stress results]**

---

#### Test Case JM-03: User Login API (`POST /api/auth/login`)
* **Objective:** Test backend auth API validation performance under concurrent logins.
* **Configuration:** 10 users, 2s ramp-up, loops: 1.
* **Expected Status:** `200 OK` (returning user session mock JWT).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 17: POST /api/auth/login - Thread Group Config]**
> **[Screenshot 18: POST /api/auth/login - Response Assertions 200]**

---

#### Test Case JM-04: Fetch Movie Details API (`GET /api/movies/:id`)
* **Objective:** Verify details API performance under concurrent individual movie clicks.
* **Configuration:** 15 users, 3s ramp-up, loops: 1.
* **Expected Status:** `200 OK` (returning movie object matching ID).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 19: GET /api/movies/:id - Thread Group Config]**
> **[Screenshot 20: GET /api/movies/:id - Response Assertions 200]**

---

#### Test Case JM-05: Admin Retrieve All Orders API (`GET /api/orders`)
* **Objective:** Verify admin retrieve order book performance.
* **Configuration:** 5 users, 1s ramp-up, loops: 1.
* **Headers:** `Authorization: mock-jwt-admin-token-12345`
* **Expected Status:** `200 OK` (returning array of customer orders).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 21: GET /api/orders - Admin Authorization Config]**
> **[Screenshot 22: GET /api/orders - Response Assertions 200]**

---

#### Test Case JM-06: Admin Add New Movie API (`POST /api/movies`)
* **Objective:** Verify movie publish API performance under concurrent additions.
* **Configuration:** 5 users, 1s ramp-up, loops: 1.
* **Headers:** `Authorization: mock-jwt-admin-token-12345`
* **Expected Status:** `201 Created` (returning created movie object).
* **Status:** ✅ Pass

*Screenshot Placeholders:*
> **[Screenshot 23: POST /api/movies - Admin Creation Payload]**
> **[Screenshot 24: POST /api/movies - Response Assertions 201]**

---

## 7. Test Summary Report

| Testing Type | Test Cases | Passed | Failed |
| :--- | :---: | :---: | :---: |
| **Cypress (E2E)** | 6 | 6 | 0 |
| **Selenium (Java Maven)** | 6 | 6 | 0 |
| **JMeter (API Load)** | 6 | 6 | 0 |

---

## 8. Challenges Faced
1. **Synchronization issues** during UI automation (mitigated by using explicit WebDriver wait conditions).
2. **Managing concurrent API requests** during stress testing.
3. **Browser timing issues** in Selenium.
4. **Database consistency** during repeated test execution.

---

## 9. Conclusion
The MovieSphere application was successfully tested using Cypress, Selenium WebDriver, and Apache JMeter. Functional, UI, and performance testing verified that the application behaves correctly under normal and concurrent user operations. All implemented test cases passed successfully, demonstrating application stability and reliability.
