# Jenkins CI/CD Integration & GitHub SCM Guide
## MovieSphere – Movie Store E2E Testing Automation

---

## 1. Introduction
This guide explains how to host your test suites on GitHub inside the repository **`movie-store-testing`**, and configure **Jenkins Freestyle Jobs** for both **Selenium (Java Maven)** and **Cypress (E2E)**.

By using separate Freestyle Jobs, we can cleanly configure individual Git triggers, build steps (Maven goals vs Node shell commands), and post-build actions for each test suite.

---

## 2. GitHub SCM Upload & Push

To let Jenkins retrieve and run your tests automatically, your code must be hosted on GitHub under the repository name `movie-store-testing`.

### 2.1 Git Repository Verification
Your local directory is already initialized with Git and configured with a `.gitignore` to avoid uploading dependencies (like `node_modules` or Maven compilation targets).
To check the status:
1.  Open your terminal in `/Users/chandan_dhumale/Desktop/movie-store`.
2.  Run:
    ```bash
    git status
    ```

### 2.2 GitHub Upload Steps
1.  Go to [github.com](https://github.com/) and create a new **public** repository named **`movie-store-testing`** (do not add a README, license, or `.gitignore` in the GitHub UI).
2.  Run the following commands in your local terminal:
    ```bash
    git add .
    git commit -m "Configure E2E test suites and Jenkins Freestyle CI/CD integration"
    git branch -m main
    git remote add origin https://github.com/YOUR_GITHUB_USERNAME/movie-store-testing.git
    git push -u origin main
    ```
    *(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*

---

## 3. Prerequisite Jenkins Plugins
Ensure the following plugins are installed and active in your Jenkins dashboard (`Manage Jenkins` > `Plugins` > `Installed plugins`):
*   **Git Plugin** (enables SCM checkouts)
*   **Maven Integration Plugin** (adds native support for Freestyle Maven configurations)
*   **TestNG Results Plugin** (required to parse TestNG XML report files)

---

## 4. Job 1: Selenium Web Tests (Freestyle Project)
This job is specifically configured to build the Java Maven project and parse the TestNG results.

### 4.1 Create the Job
1.  On the Jenkins homepage, click **New Item**.
2.  Enter `MovieSphere-Selenium-Tests`, select **Freestyle project**, and click **OK**.

### 4.2 Source Code Management (SCM)
1.  In the **Source Code Management** section, select **Git**.
2.  Set **Repository URL** to:
    `https://github.com/YOUR_GITHUB_USERNAME/movie-store-testing.git`
3.  Set **Branches to build** to `*/main`.

### 4.3 Build Triggers
Configure how you want code changes to trigger the tests:
*   **Option A: GitHub hook trigger for GITScm polling** (Recommended for automatic runs):
    *   Check this box. (Requires configuring a webhook pointing to `http://your-jenkins-ip:8080/github-webhook/` inside your GitHub repository settings).
*   **Option B: Poll SCM** (Recommended if Jenkins is local/behind a firewall):
    *   Check **Poll SCM** and enter the following schedule:
        ```text
        H/15 * * * *
        ```
        *(This tells Jenkins to check GitHub for changes every 15 minutes).*

### 4.4 Build Steps (Maven Configuration)
1.  Scroll down to the **Build Steps** section.
2.  Click **Add build step** and select **Invoke top-level Maven targets**.
3.  Select your Maven installation from the dropdown.
4.  In the **Goals** field, enter:
    ```bash
    clean test
    ```
5.  Click the **Advanced...** button to expand options.
6.  In the **POM** field, specify the path to your Selenium Maven configuration:
    ```text
    tests/selenium/java-maven/pom.xml
    ```
    *(This directs Maven to compile and execute only the tests within the Selenium subfolder).*

### 4.5 Post-build Actions
1.  Go to the **Post-build Actions** section.
2.  Click **Add post-build action** and choose **Publish TestNG Results**.
3.  Set **TestNG XML report pattern** to:
    ```text
    tests/selenium/java-maven/target/surefire-reports/testng-results.xml
    ```
    *(This parses the TestNG XML reports and generates native TestNG results graphs in your Jenkins dashboard).*
4.  Click **Save**.

---

## 5. Job 2: Cypress E2E Tests (Freestyle Project)
This job is configured to install Node dependencies, start the application, run E2E specs, and archive Cypress reports.

### 5.1 Create the Job
1.  Click **New Item**.
2.  Enter `MovieSphere-Cypress-Tests`, select **Freestyle project**, and click **OK**.

### 5.2 Source Code Management (SCM)
1.  Select **Git**.
2.  Set **Repository URL** to:
    `https://github.com/YOUR_GITHUB_USERNAME/movie-store-testing.git`
3.  Set **Branches to build** to `*/main`.

### 5.3 Build Triggers
*   Check **Poll SCM** or **GitHub hook trigger** using the same settings as Job 1.
*   *(Optional)* If you want Cypress to run immediately after Selenium finishes, check **Build after other projects are built** under build triggers, and enter `MovieSphere-Selenium-Tests` in the project field.

### 5.4 Build Steps (Execute Shell)
1.  Scroll down to the **Build Steps** section.
2.  Click **Add build step** and select **Execute shell**.
3.  Add the script to install dependencies, boot the backend & frontend in the background, run tests, and clean up processes:
    ```bash
    #!/bin/bash
    echo "=== Step 1: Installing Dependencies ==="
    cd tests/cypress
    npm install
    
    echo "=== Step 2: Seeding MongoDB & Starting Services ==="
    # Seed DB to refresh movie stock count to 1000
    cd ../../backend
    npm install
    npm run seed
    
    # Start backend in the background
    nohup npm start > backend.log 2>&1 &
    
    # Start frontend in the background
    cd ../frontend
    npm install
    nohup npm run dev > frontend.log 2>&1 &
    
    # Wait for services to be healthy
    echo "Waiting for backend..."
    for i in {1..15}; do
        if curl -s http://localhost:8080/api/movies >/dev/null; then
            echo "Backend is up!"
            break
        fi
        sleep 2
    done
    
    echo "Waiting for frontend..."
    for i in {1..15}; do
        if curl -s http://localhost:5173 >/dev/null; then
            echo "Frontend is up!"
            break
        fi
        sleep 2
    done
    
    echo "=== Step 3: Executing Cypress E2E Tests ==="
    cd ../tests/cypress
    # Runs the direct binary bypass script to prevent macOS wrapper freezes
    npm run cypress:run:bypass
    
    EXIT_CODE=$?
    
    echo "=== Step 4: Pipeline Cleanup ==="
    # Kill background node servers to free ports for the next run
    pkill -f "node server.js" || true
    pkill -f "vite" || true
    
    exit $EXIT_CODE
    ```

### 5.5 Post-build Actions
1.  Go to the **Post-build Actions** section.
2.  Click **Add post-build action** and choose **Archive the artifacts**.
3.  Set **Files to archive** to:
    ```text
    tests/cypress/cypress/screenshots/**, tests/cypress/cypress/videos/**
    ```
    *(This archives screenshots/videos of any failing test runs so you can debug directly from Jenkins).*
4.  Click **Save**.

---

## 6. Verification and Run
1.  Push a code commit to GitHub.
2.  Open Jenkins and verify that both jobs trigger, execute successfully, and publish their respective test report graphs and archived artifacts!
