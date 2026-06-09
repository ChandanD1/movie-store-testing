# JMeter Test Documentation

## Overview
This document provides comprehensive documentation for the Apache JMeter performance tests implemented for the MovieSphere application. JMeter is used for load testing and performance testing to verify the application's behavior under various load conditions.

## Test Environment Setup

### Prerequisites
- Java Runtime Environment (JRE) 8 or higher
- Apache JMeter (latest version)
- MongoDB running on localhost:27017
- Movie Store backend server running on http://localhost:5000

### Installation Steps

1. **Download and Install JMeter:**
   - Visit: https://jmeter.apache.org/download_jmeter.cgi
   - Download the latest binary zip file
   - Extract to a location of your choice (e.g., `/Applications/JMeter` on macOS)

2. **Verify Java Installation:**
   ```bash
   java -version
   ```
   If Java is not installed, download from https://www.java.com/download/

3. **Start JMeter:**
   - **macOS/Linux:**
     ```bash
     cd /path/to/jmeter/bin
     ./jmeter
     ```
   - **Windows:**
     ```bash
     cd C:\path\to\jmeter\bin
     jmeter.bat
     ```

4. **Start the Application:**
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/backend
   npm install
   npm start
   ```

## Test Plan 1: Load Test for GET /api/movies

### Test Objective
Verify that the MovieSphere API can handle concurrent read requests without performance degradation. This test simulates multiple users simultaneously browsing the catalog.

### Test Configuration

#### Thread Group Settings
- **Number of Threads (Users):** 10
- **Ramp-Up Period (seconds):** 5
- **Loop Count:** 100
- **Total Requests:** 1,000 (10 users × 100 loops)

#### HTTP Request Settings
- **Server Name or IP:** localhost
- **Port Number:** 5000
- **Protocol:** http
- **Path:** /api/movies
- **Method:** GET

#### Expected Results
- All requests should return 200 OK status
- Average response time should be under 1000ms
- Error rate should be 0%
- Throughput should be consistent

### Step-by-Step Test Plan Creation

#### Step 1: Create Test Plan
1. Open JMeter
2. File → New (or Ctrl+N)
3. Save as: `get-movies-load-test.jmx`

#### Step 2: Add Thread Group
1. Right-click on Test Plan → Add → Threads (Users) → Thread Group
2. Configure Thread Group:
   - Name: "Movie Readers"
   - Number of Threads: 10
   - Ramp-Up Period: 5
   - Loop Count: 100

#### Step 3: Add HTTP Request
1. Right-click on Thread Group → Add → Sampler → HTTP Request
2. Configure HTTP Request:
   - Name: "Get All Movies"
   - Server Name or IP: localhost
   - Port Number: 5000
   - Protocol: http
   - Method: GET
   - Path: /api/movies

#### Step 4: Add HTTP Header Manager (Optional)
1. Right-click on HTTP Request → Add → Config Element → HTTP Header Manager
2. Add header (if authentication is required):
   - Name: Authorization
   - Value: Bearer YOUR_TOKEN_HERE

#### Step 5: Add Listeners for Results
1. **View Results Tree:**
   - Right-click on Thread Group → Add → Listener → View Results Tree
   - This shows individual request/response details

2. **Summary Report:**
   - Right-click on Thread Group → Add → Listener → Summary Report
   - This shows aggregate statistics

3. **Aggregate Report:**
   - Right-click on Thread Group → Add → Listener → Aggregate Report
   - This shows detailed performance metrics

#### Step 6: Save and Run
1. Save the test plan
2. Click the green "Start" button (or Ctrl+R)
3. Monitor results in the listeners

### Test Execution Flow

1. **Initialization Phase (0-5 seconds)**
   - JMeter starts 10 virtual users
   - Users are added gradually (2 per second)
   - Each user begins making requests

2. **Load Phase (5-505 seconds)**
   - All 10 users are active
   - Each user makes 100 requests
   - Total of 1,000 requests sent
   - Response times monitored

3. **Completion Phase**
   - All users complete their loops
   - Test finishes
   - Results aggregated

### Performance Metrics to Monitor

#### Key Metrics
- **Throughput:** Requests per second
- **Response Time:** Average, Min, Max, 90th percentile
- **Error Rate:** Percentage of failed requests
- **Latency:** Time to first byte

#### Success Criteria
- ✅ 0% error rate
- ✅ Average response time < 1000ms
- ✅ 90th percentile < 1500ms
- ✅ Consistent throughput (no significant drops)

### Test Data Used
- No request body required for GET requests
- Tests against existing movie data in database
- Ensure database has sample data before running

### Pass/Fail Criteria
- **Pass:** All requests successful (200 status), response times within acceptable limits, no errors
- **Fail:** Any request fails (non-200 status), response times exceed thresholds, high error rate

### Troubleshooting

#### Common Issues

1. **Connection Refused**
   - Ensure backend server is running
   - Check port 5000 is not blocked
   - Verify MongoDB is running

2. **High Response Times**
   - Check database performance
   - Verify server has sufficient resources
   - Check for network issues

3. **Memory Errors**
   - Reduce thread count
   - Increase JVM heap size in jmeter.bat
   - Add `-Xmx2g` to JVM arguments

---

## Test Plan 2: Stress Test for POST /api/movies

### Test Objective
Verify that the API can handle concurrent write requests without errors or significant performance degradation. This test simulates multiple users simultaneously adding movies to the database.

### Test Configuration

#### Thread Group Settings
- **Number of Threads (Users):** 20
- **Ramp-Up Period (seconds):** 10
- **Loop Count:** 50
- **Total Requests:** 1,000 (20 users × 50 loops)

#### HTTP Request Settings
- **Server Name or IP:** localhost
- **Port Number:** 5000
- **Protocol:** http
- **Path:** /api/movies
- **Method:** POST

#### Request Body Data
```json
{
  "title": "JMeter Test Movie ${__counter(FALSE,)}",
  "genre": "Action",
  "year": 2024,
  "rating": 8.5,
  "price": 12.99,
  "description": "Test movie from JMeter"
}
```

#### HTTP Headers
- Content-Type: application/json
- Authorization: Bearer YOUR_TOKEN_HERE (if authentication required)

#### Expected Results
- Most requests should return 201 Created
- Response time should be reasonable (< 2000ms)
- Error rate should be minimal (< 5%)
- Database should handle concurrent writes

### Step-by-Step Test Plan Creation

#### Step 1: Create Test Plan
1. Open JMeter
2. File → New (or Ctrl+N)
3. Save as: `post-movies-stress-test.jmx`

#### Step 2: Add Thread Group
1. Right-click on Test Plan → Add → Threads (Users) → Thread Group
2. Configure Thread Group:
   - Name: "Movie Creators"
   - Number of Threads: 20
   - Ramp-Up Period: 10
   - Loop Count: 50

#### Step 3: Add HTTP Request
1. Right-click on Thread Group → Add → Sampler → HTTP Request
2. Configure HTTP Request:
   - Name: "Create Movie"
   - Server Name or IP: localhost
   - Port Number: 5000
   - Protocol: http
   - Method: POST
   - Path: /api/movies

#### Step 4: Add HTTP Header Manager
1. Right-click on HTTP Request → Add → Config Element → HTTP Header Manager
2. Add headers:
   - Name: Content-Type
   - Value: application/json
   - Name: Authorization
   - Value: Bearer YOUR_TOKEN_HERE

#### Step 5: Add Request Body
1. In HTTP Request, go to "Body Data" tab
2. Paste JSON body:
   ```json
   {
     "title": "JMeter Test Movie ${__counter(FALSE,)}",
     "genre": "Action",
     "year": 2024,
     "rating": 8.5,
     "price": 12.99,
     "description": "Test movie from JMeter"
   }
   ```
3. The `${__counter(FALSE,)}` function creates unique titles for each request

#### Step 6: Add Listeners
1. **View Results Tree**
2. **Summary Report**
3. **Aggregate Report**
4. **Response Times Over Time** (for visualization)

#### Step 7: Save and Run
1. Save the test plan
2. Click the green "Start" button
3. Monitor results

### Test Execution Flow

1. **Initialization Phase (0-10 seconds)**
   - JMeter starts 20 virtual users
   - Users added gradually (2 per second)
   - Each user begins making POST requests

2. **Stress Phase (10-510 seconds)**
   - All 20 users active
   - Each user makes 50 POST requests
   - Total of 1,000 movie creation attempts
   - Database handles concurrent writes

3. **Completion Phase**
   - All users complete loops
   - Test finishes
   - Results analyzed

### Performance Metrics to Monitor

#### Key Metrics
- **Throughput:** Successful creations per second
- **Response Time:** Average, Min, Max for POST requests
- **Error Rate:** Percentage of failed creations
- **Database Performance:** Write latency

#### Success Criteria
- ✅ Error rate < 5%
- ✅ Average response time < 2000ms
- ✅ 90th percentile < 3000ms
- ✅ No database connection errors

### Test Data Used
- Unique movie titles using counter function
- Consistent genre, year, rating, price
- Each request creates a new movie in database

### Pass/Fail Criteria
- **Pass:** Most requests successful (201 status), response times acceptable, minimal errors
- **Fail:** High error rate (>5%), response times excessive, database errors

### Cleanup After Test
After running the stress test, clean up test data:
```bash
# Connect to MongoDB
mongosh

# Switch to movie-store database
use movie-store

# Delete test movies
db.movies.deleteMany({title: /JMeter Test Movie/})

# Exit
exit
```

### Troubleshooting

#### Common Issues

1. **Duplicate Key Errors**
   - Ensure counter function is working
   - Check if title uniqueness is enforced
   - Use random data instead of counter

2. **Authentication Failures**
   - Ensure valid token is provided
   - Check token expiration
   - Verify auth middleware is correctly configured

3. **Database Write Errors**
   - Check MongoDB connection limits
   - Verify database has sufficient disk space
   - Check for index constraints

4. **Memory Issues**
   - Reduce thread count
   - Increase JVM heap size
   - Run test in smaller batches

---

## Running JMeter Tests

### GUI Mode (Interactive)

1. **Start JMeter:**
   ```bash
   cd /path/to/jmeter/bin
   ./jmeter
   ```

2. **Open Test Plan:**
   - File → Open
   - Select `.jmx` file

3. **Run Test:**
   - Click green "Start" button
   - Monitor results in listeners

4. **Save Results:**
   - Right-click on listener → Save Table Data
   - Save as CSV for analysis

### Command Line Mode (Non-Interactive)

1. **Run Test:**
   ```bash
   cd /path/to/jmeter/bin
   ./jmeter -n -t /path/to/test-plan.jmx -l results.jtl -e -o /path/to/report/
   ```

   Flags:
   - `-n`: Non-GUI mode
   - `-t`: Test plan file
   - `-l`: Log file path
   - `-e`: Generate report after test
   - `-o`: Output folder for report

2. **View Report:**
   - Open `index.html` in the output folder

### Distributed Testing (Multiple Machines)

For large-scale testing, use multiple JMeter instances:

1. **Setup Master-Slave Configuration:**
   - Configure `jmeter.properties` on all machines
   - Start remote servers on slave machines
   - Run test from master machine

2. **Run Distributed Test:**
   ```bash
   jmeter -n -t test-plan.jmx -R slave1,slave2,slave3
   ```

## Test Results Analysis

### Summary Report Metrics

- **Label:** Test case name
- **Samples:** Number of requests
- **Average:** Mean response time
- **Min:** Minimum response time
- **Max:** Maximum response time
- **Std. Dev:** Standard deviation
- **Error %:** Percentage of errors
- **Throughput:** Requests per second
- **KB/sec:** Data transferred per second

### Aggregate Report Metrics

- **90% Line:** 90th percentile response time
- **95% Line:** 95th percentile response time
- **99% Line:** 99th percentile response time
- **Sent:** Bytes sent
- **Received:** Bytes received

### Interpreting Results

#### Good Performance
- Error rate: 0-1%
- Average response time: < 1000ms
- 90th percentile: < 1500ms
- Consistent throughput

#### Acceptable Performance
- Error rate: 1-5%
- Average response time: 1000-2000ms
- 90th percentile: 1500-3000ms
- Minor throughput variations

#### Poor Performance
- Error rate: > 5%
- Average response time: > 2000ms
- 90th percentile: > 3000ms
- Significant throughput drops

## Performance Optimization Tips

### Backend Optimization

1. **Database Indexing:**
   ```javascript
   // Add indexes to improve query performance
   db.movies.createIndex({ title: 1 });
   db.movies.createIndex({ genre: 1 });
   ```

2. **Connection Pooling:**
   - Configure MongoDB connection pool size
   - Adjust based on expected load

3. **Caching:**
   - Implement Redis for frequently accessed data
   - Cache GET requests for popular movies

4. **Pagination:**
   - Implement pagination for large datasets
   - Limit response size

### JMeter Optimization

1. **Reduce Overhead:**
   - Disable "View Results Tree" in production runs
   - Use only necessary listeners
   - Save results to file instead of displaying

2. **Adjust JVM Settings:**
   ```
   HEAP="-Xms1g -Xmx2g -XX:MaxMetaspaceSize=256m"
   ```

3. **Use Non-GUI Mode:**
   - Always use non-GUI mode for actual tests
   - GUI mode adds significant overhead

## Test Maintenance

### When to Update Tests

- When API endpoints change
- When request/response structure changes
- When authentication requirements change
- When performance requirements change

### Best Practices

1. **Version Control:** Keep test plans in git
2. **Document Changes:** Update this documentation
3. **Regular Testing:** Run tests regularly
4. **Baseline Comparison:** Compare results over time
5. **Environment Consistency:** Use consistent test environments

## Test Coverage

### Currently Covered
- ✅ Load testing for GET /api/movies
- ✅ Stress testing for POST /api/movies

### Future Test Cases (Optional Enhancements)
- Load testing for PUT /api/movies/:id
- Load testing for DELETE /api/movies/:id
- Mixed workload test (GET + POST + PUT + DELETE)
- Authentication endpoint load testing
- Database query performance testing
- Long-running stability test (soak test)
- Spike test (sudden load increase)

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: JMeter Performance Tests
on: [push]
jobs:
  jmeter:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup JMeter
        run: |
          wget https://downloads.apache.org//jmeter/binaries/apache-jmeter-5.6.tgz
          tar -xzf apache-jmeter-5.6.tgz
      - name: Start Application
        run: |
          cd backend
          npm install
          npm start &
      - name: Run JMeter Tests
        run: |
          apache-jmeter-5.6/bin/jmeter -n -t tests/jmeter/get-movies-load-test.jmx -l results.jtl
      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: jmeter-results
          path: results.jtl
```

## Conclusion

These JMeter tests provide comprehensive performance testing for the Movie Store application. They verify that the API can handle concurrent users for both read and write operations without significant performance degradation. Regular execution of these tests helps identify performance bottlenecks and ensures the application meets performance requirements.

For questions or issues with the JMeter tests, refer to the main project README or contact the development team.
