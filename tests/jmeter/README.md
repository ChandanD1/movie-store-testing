# Apache JMeter Load & Stress Testing for MovieSphere

This directory contains Apache JMeter configurations and guidelines to run performance benchmarks on the MovieSphere REST API.

## 🚀 Setup and Requirements

1. **JMeter Installation**:
   - **macOS**: `brew install jmeter`
   - **Other Platforms**: Download binaries from [jmeter.apache.org](https://jmeter.apache.org/download_jmeter.cgi) and add `bin/` to your environment variables `PATH`.
2. **Backend Server**: Ensure your Express server is running on **`http://localhost:8080`**.
3. **Database**: Make sure local MongoDB is running and seeded (`npm run seed` in the backend folder).

---

## 📁 Testing Plan (`movie_store_load_test.jmx`)

The single consolidated test plan contains two thread groups targeting API routes:

### 1. Browse Movies Load Test (`GET /api/movies`)
* **Simulation**: 20 concurrent threads (users) ramping up over 5 seconds.
* **Loop**: Each user triggers 2 requests.
* **Assertions**: Asserts response code is `200` and response header content type contains `application/json`.

### 2. Purchase Orders Stress Test (`POST /api/orders`)
* **Simulation**: 50 concurrent threads ramping up over 10 seconds.
* **Payload**: JSON purchase order with user email and cart item array.
* **Assertions**: Asserts response code is `201` (Created).

---

## 🏃 Running the Tests

### Method A: Graphical GUI Mode (Recommended for Visual Learning)
1. Open your terminal and start JMeter visually:
   ```bash
   jmeter
   ```
2. In the graphical window, click **File** > **Open** and choose `/Users/chandan_dhumale/Desktop/movie-store/tests/jmeter/movie_store_load_test.jmx`.
3. Select any thread group, right-click, and add a visual logger: **Add** > **Listener** > **View Results Tree**.
4. Click the green "Start" (play arrow) icon on the top toolbar.
5. Watch the requests turn green (success) or red (failure) in real-time, and check individual request/response headers in the View Results Tree.

### Method B: Non-GUI Command Line Mode (Generates HTML Report Dashboard)
1. Navigate to the JMeter folder:
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/tests/jmeter
   ```
2. Clear any old test logs and folders to avoid write errors:
   ```bash
   rm -f results.jtl && rm -rf report
   ```
3. Execute the test and generate a comprehensive HTML report:
   ```bash
   jmeter -n -t movie_store_load_test.jmx -l results.jtl -e -o report
   ```
4. Open the generated report dashboard in your browser:
   ```bash
   open report/index.html
   ```
