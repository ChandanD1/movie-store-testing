# 📺 MovieSphere - Video Streaming Application

A premium, modern **MovieSphere** web application styled with modern dark theme. This project demonstrates a full-stack JavaScript architecture integrating a React frontend, an Express/Node.js backend, a MongoDB database, and a comprehensive Quality Assurance testing suite with **Cypress**, **Selenium**, and **JMeter**.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (styled with glassmorphic tokens, CSS variables, and modern hover scale transitions).
- **Backend**: Express, Node.js, Mongoose (MongoDB ODM), Cors, Morgan logger.
- **Database**: local MongoDB (`movie-store` database).
- **Automation Testing**:
  - **Cypress**: E2E frontend verification.
  - **Selenium WebDriver**: Browser integration testing.
  - **Apache JMeter**: Performance and API load/stress testing.

---

## 📁 Project Structure

```
movie-store/
├── backend/                  # Express REST API
│   ├── config/               # Database connection scripts
│   ├── models/               # Mongoose Schemas (Movie, Order)
│   ├── routes/               # API Router Handlers (Auth, Movies, Orders)
│   └── scripts/              # DB seeding script
├── frontend/                 # React Single Page App (Vite)
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, MovieCard, Modals, Drawer)
│   │   ├── App.jsx           # Main state manager & routing
│   │   └── App.css           # Styling system & Glassmorphic variables
│   └── index.html
├── tests/                    # Testing Suites
│   ├── cypress/              # Cypress E2E Tests
│   ├── selenium/             # Selenium WebDriver Mocha tests
│   └── jmeter/               # JMeter JMX Performance Plans
└── README.md                 # Project Documentation (This file)
```

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18 or higher) & **npm**
- **MongoDB** (running locally on default port `27017`)
- **Google Chrome** (for Selenium and Cypress runs)

---

### Step 1: Start MongoDB
Ensure that your local MongoDB server is running. If you are using MongoDB Compass, connect to:
`mongodb://localhost:27017/`

---

### Step 2: Set Up and Run the Backend

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. The dependencies are already installed. Seed the database with high-quality initial movie data:
   ```bash
   npm run seed
   ```
   *This wipes previous data in the `movie-store` database and inserts 6 movies with descriptions, prices, genres, and cover images.*

3. Start the API server:
   ```bash
   npm start
   ```
   The backend server will launch and listen on: **`http://localhost:8080`**

---

### Step 3: Set Up and Run the Frontend

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to: **`http://localhost:5173`**
   *You should see the movie library with animated posters, search capabilities, genre filters, movie details, and an interactive shopping cart!*

---

## 🔐 Demo Credentials

To test user and admin-level access:
- **Standard User**:
  - Email: `user@example.com`
  - Password: `password`
- **Administrator**:
  - Email: `admin@example.com`
  - Password: `admin123`

---

## 📡 Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticates user.
  - **Body**: `{ "email": "user@example.com", "password": "password" }`
  - **Response**: Returns token, name, email, and `isAdmin` flag.

### Movies
- `GET /api/movies` - Lists all movies. Supports query filters `?search=dune` and `?genre=Sci-Fi`.
- `GET /api/movies/:id` - Fetches details of a single movie.
- `POST /api/movies` - Adds a new movie release (**Admin Authorization Required**).
  - **Headers**: `Authorization: mock-jwt-admin-token-12345`
  - **Body**: `{ "title": "...", "genre": "...", "price": 9.99, ... }`
- `DELETE /api/movies/:id` - Removes a movie (**Admin Authorization Required**).
  - **Headers**: `Authorization: mock-jwt-admin-token-12345`

### Orders
- `POST /api/orders` - Places a new purchase order, decreasing movie stock.
  - **Body**: `{ "userEmail": "...", "items": [...], "totalAmount": 19.98 }`
- `GET /api/orders` - Retrieves audit list of all customer orders (**Admin Authorization Required**).
  - **Headers**: `Authorization: mock-jwt-admin-token-12345`

---

## 🧪 Testing Suites & Run Guidelines

### 1. Cypress E2E Tests

Cypress tests the application end-to-end inside Chrome, simulating human clicks and checking text elements.

#### Test Cases Implemented:
1. **Search, Filter & Modal View Flow (`search_filter_and_modal_view_flow.cy.js`)**:
   - `CY-01`: Movie Catalog Search (types "Dune" to search).
   - `CY-02`: Genre Tag Filtering (clicks "Action" tag).
   - `CY-03`: Movie Details Modal View & Dismiss (clicks poster and closes dialog).
2. **Purchase & Admin Flow (`purchase_and_admin_flow.cy.js`)**:
   - `CY-04`: Watchlist Quantity Management (adds movie to cart, increments/decrements quantity).
   - `CY-05`: User Login & Watchlist Checkout (authenticates user, submits checkout, verifies order is placed).
   - `CY-06`: Admin Toggle & Control Panel View (authenticates admin, toggles to admin view, checks manage catalog tab).

#### How to Run Cypress:
1. Open a terminal and navigate to the Cypress folder:
   ```bash
   cd tests/cypress
   ```
2. Make sure the backend and frontend servers are both running.
3. Run the E2E tests (bypasses the macOS CLI wrapper hang issue):
   ```bash
   npm run cypress:run:bypass
   ```

---

### 2. Selenium WebDriver Tests

Selenium WebDriver runs automated Mocha test suites, driving Google Chrome through WebDriver APIs.

#### Test Cases Implemented:
1. **Login Validation (`login_test.js`)**:
   - **Scenario A (Invalid Credentials)**: Clicks login, types incorrect inputs, submits, and asserts the DOM displays the validation warning: `"Invalid email or password"`.
   - **Scenario B (Valid Credentials)**: Submits correct inputs, asserts the modal closes, and validates the navigation menu displays the matching username.
2. **Admin Catalog Management (`admin_test.js`)**:
   - Authenticates as Administrator.
   - Opens the Admin Dashboard panel.
   - Navigates to "Manage Catalog" and fills out the "Add Movie" form.
   - Submits the form, and asserts the successful write confirmation: `"added successfully"`.
   - Switches back to "Shop View" and searches for the new movie, asserting that it is dynamically rendered on the public storefront.

#### How to Run Selenium:
1. Open a terminal and navigate to the Selenium folder:
   ```bash
   cd tests/selenium
   ```
2. Make sure the backend and frontend servers are both running.
3. Run the automated tests:
   ```bash
   npm test
   ```
   *The tests run in Chrome's headless mode (`--headless=new`) for maximum speed and compatibility.*

---

### 3. Apache JMeter Performance Tests

JMeter plans analyze response rates and stress tolerance for our REST API endpoints.

#### Test Cases Implemented:
1. **Browse Movies Load Test**:
   - Simulates **20 concurrent users** entering the store at a ramp-up rate of 5 seconds.
   - Each thread performs 2 requests to `GET /api/movies`.
   - Asserts HTTP response status code is `200` and the headers return `application/json`.
2. **Checkout API Stress Test**:
   - Simulates **50 concurrent checkouts** ramping up over 10 seconds.
   - Each thread sends a `POST /api/orders` body payload containing checkout items and customer email.
   - Asserts HTTP response status is `201` (Created).

#### How to Run JMeter:
1. Open a terminal and navigate to the JMeter folder:
   ```bash
   cd tests/jmeter
   ```
2. Install JMeter if you haven't (e.g. `brew install jmeter`).
3. Run the test plan in CLI mode to generate an HTML dashboard report:
   ```bash
   jmeter -n -t movie_store_load_test.jmx -l results.jtl -e -o report
   ```
4. Open the generated report to view response time graphs, error rates, and latency statistics:
   ```bash
   open report/index.html
   ```
   *(For full configuration details, see `tests/jmeter/JMETER_INSTRUCTIONS.md`)*
