# Apache JMeter Load Testing Instructions

This folder contains a JMeter Test Plan (`movie_store_load_test.jmx`) designed to evaluate the throughput, responsiveness, and stability of the MovieSphere Express API.

---

## 1. Installation

### On macOS (using Homebrew)
If you have Homebrew installed, run:
```bash
brew install jmeter
```

### Manual Installation (All Platforms)
1. Download the binaries from the official Apache JMeter website: [jmeter.apache.org/download_jmeter.cgi](https://jmeter.apache.org/download_jmeter.cgi).
2. Extract the downloaded zip/tar.gz.
3. Add the `bin/` directory of the extracted folder to your system environment variables `PATH`.

---

## 2. Test Configuration

The Test Plan `movie_store_load_test.jmx` configures two concurrent thread groups targeting our backend at `http://localhost:8080`:

### Test Case 1: Browse Movies Load Test
- **Target**: `GET /api/movies`
- **Simulation**: 20 concurrent users.
- **Ramp-up Time**: 5 seconds (simulates a natural user entrance rate).
- **Execution Loop**: Each user makes 2 consecutive calls.
- **Assertions**: Validates HTTP status code is `200` and `Content-Type` header is `application/json`.

### Test Case 2: Place Orders Stress Test
- **Target**: `POST /api/orders`
- **Simulation**: 50 concurrent users.
- **Ramp-up Time**: 10 seconds.
- **Execution Loop**: Each user makes 1 order request.
- **Headers**: Injects `Content-Type: application/json` headers.
- **Assertions**: Validates HTTP status code is `201` (Created).

---

## 3. Running the Test

### Method A: Command-Line (CLI Mode) - Highly Recommended
Running JMeter in command-line mode ensures maximum performance and accuracy without the memory footprint of the GUI:

1. Navigate to the JMeter folder:
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/tests/jmeter
   ```

2. Clear any previous test run outputs (JMeter will throw an error if the output report directory is not empty, and will append data to `results.jtl` rather than overwriting it):
   ```bash
   rm -f results.jtl && rm -rf report
   ```

3. Run the load test and generate a visual HTML report dashboard:
   ```bash
   jmeter -n -t movie_store_load_test.jmx -l results.jtl -e -o report
   ```
   *Parameters:*
   - `-n`: Run in non-GUI (CLI) mode.
   - `-t`: Path to the input `.jmx` test plan.
   - `-l`: Path to output raw test results (`.jtl` format).
   - `-e`: Generate report dashboard on completion.
   - `-o`: Path to directory where the HTML dashboard report will be written.

3. Open the output HTML dashboard in your browser:
   ```bash
   open report/index.html
   ```

### Method B: Graphical Interface (GUI Mode)
1. Launch JMeter in GUI mode:
   ```bash
   jmeter
   ```
2. In the menu, go to **File** > **Open** and select `movie_store_load_test.jmx`.
3. In the left panel hierarchy, select **Summary Report** or add a **View Results Tree** listener (**Add** > **Listener** > **View Results Tree**).
4. Click the green play icon (Start) at the top tool bar to run the simulation.
5. Review real-time response logs, throughput metrics, and success percentages.
