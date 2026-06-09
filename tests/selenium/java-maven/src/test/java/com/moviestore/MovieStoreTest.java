package com.moviestore;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

// TestNG annotations (matches pom.xml dependency)
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import static org.testng.Assert.*;

// WebDriverManager
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

public class MovieStoreTest {

    private WebDriver driver;
    private WebDriverWait wait;

    // ── Helper: pause execution so you can watch each step ────────────────────
    private void pause(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @BeforeMethod
    public void setUp() {
        // Auto-download and configure ChromeDriver
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        String headless = System.getenv("HEADLESS");
        if ("true".equalsIgnoreCase(headless)) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1280,800");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        System.out.println("\n>>> Opening Movie Store at http://localhost:5173 ...");
        driver.get("http://localhost:5173");
        pause(2000); // Let the page fully render before starting
    }

    @AfterMethod
    public void tearDown() {
        pause(2500); // Keep browser open a moment so you can see the final result
        if (driver != null) {
            driver.quit();
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 1: Invalid Login
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testInvalidLoginFlow() {

        System.out.println("\n========================================");
        System.out.println("[TEST 1] Invalid Login Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 – Click the Login button in the Navbar
        System.out.println("[Step 1] Clicking 'Login' button in the navbar...");
        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("login-btn")));
        loginBtn.click();
        pause(1500); // Watch the modal animate into view

        // Step 2 – Wait for the Login modal to appear
        System.out.println("[Step 2] Waiting for login modal to appear...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-dialog")));
        pause(1000);

        // Step 3 – Type a wrong email address
        System.out.println("[Step 3] Typing wrong email: baduser@example.com");
        driver.findElement(By.id("login-email")).sendKeys("baduser@example.com");
        pause(800);

        // Step 4 – Type a wrong password
        System.out.println("[Step 4] Typing wrong password...");
        driver.findElement(By.id("login-password")).sendKeys("wrong_pass");
        pause(1000);

        // Step 5 – Click the Submit / Login button
        System.out.println("[Step 5] Clicking Submit...");
        driver.findElement(By.id("login-submit-btn")).click();
        pause(2000); // Wait for the error response from the server

        // Step 6 – Assert the error message appears on screen
        System.out.println("[Step 6] Looking for error message on screen...");
        WebElement errorMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-error-msg")));
        pause(2000); // Let you read the red error message on screen

        assertTrue(errorMsg.getText().contains("Invalid email or password"),
                   "Expected error message was not shown!");

        System.out.println("[TEST 1] ✅ PASSED – Error message shown correctly.\n");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 2: Admin Adds a New Movie
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testAdminAddMovieFlow() {

        System.out.println("\n========================================");
        System.out.println("[TEST 2] Admin Add Movie Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 – Click Login
        System.out.println("[Step 1] Clicking 'Login' button...");
        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("login-btn")));
        loginBtn.click();
        pause(1500);

        // Step 2 – Wait for modal
        System.out.println("[Step 2] Waiting for login modal...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-dialog")));
        pause(1000);

        // Step 3 – Enter admin email
        System.out.println("[Step 3] Typing admin email: admin@example.com");
        driver.findElement(By.id("login-email")).sendKeys("admin@example.com");
        pause(700);

        // Step 4 – Enter admin password
        System.out.println("[Step 4] Typing admin password...");
        driver.findElement(By.id("login-password")).sendKeys("admin123");
        pause(1000);

        // Step 5 – Submit the form
        System.out.println("[Step 5] Clicking Submit...");
        driver.findElement(By.id("login-submit-btn")).click();
        pause(1500);

        // Step 6 – Wait for the modal to close (login successful)
        System.out.println("[Step 6] Waiting for login to complete (modal should disappear)...");
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("login-dialog")));
        pause(1500);

        // Step 7 – Click the Admin Panel toggle
        System.out.println("[Step 7] Clicking 'Admin Panel' toggle...");
        WebElement adminToggle = wait.until(ExpectedConditions.elementToBeClickable(By.id("admin-view-toggle")));
        adminToggle.click();
        pause(1500);

        // Step 8 – Wait for the Admin Control Center heading
        System.out.println("[Step 8] Waiting for Admin Control Center to load...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[contains(text(), 'Admin Control Center')]")));
        pause(1500);

        // Step 9 – Click the "Manage Catalog" tab
        System.out.println("[Step 9] Clicking 'Manage Catalog' tab...");
        driver.findElement(By.id("admin-tab-movies")).click();
        pause(1500);

        // Step 10 – Fill in the new movie form, field by field
        String movieTitle = "Test Movie Java " + System.currentTimeMillis();

        System.out.println("[Step 10] Entering Movie Title: " + movieTitle);
        driver.findElement(By.id("new-title")).sendKeys(movieTitle);
        pause(700);

        System.out.println("[Step 10] Entering Genre: Drama");
        driver.findElement(By.id("new-genre")).sendKeys("Drama");
        pause(600);

        System.out.println("[Step 10] Entering Year: 2026");
        driver.findElement(By.id("new-year")).sendKeys("2026");
        pause(600);

        System.out.println("[Step 10] Entering Price: 9.99");
        driver.findElement(By.id("new-price")).sendKeys("9.99");
        pause(600);

        System.out.println("[Step 10] Entering Stock: 5");
        driver.findElement(By.id("new-stock")).sendKeys("5");
        pause(600);

        System.out.println("[Step 10] Entering Description...");
        driver.findElement(By.id("new-desc")).sendKeys("A test description added dynamically by Java Selenium WebDriver.");
        pause(1200);

        // Step 11 – Click Publish
        System.out.println("[Step 11] Clicking 'Publish' button...");
        driver.findElement(By.id("add-movie-submit")).click();
        pause(2500); // Wait for the backend API to save the movie

        // Step 12 – Assert success banner
        System.out.println("[Step 12] Checking for success message...");
        WebElement successAlert = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-success-msg")));
        pause(2000); // Read the green success message on screen

        assertTrue(successAlert.getText().contains("added successfully"),
                   "Expected success message was not shown!");

        // Step 13 – Switch back to Shop View
        System.out.println("[Step 13] Switching back to Shop view...");
        adminToggle.click();
        pause(1500);

        // Step 14 – Search for the new movie
        System.out.println("[Step 14] Searching for the new movie: " + movieTitle);
        WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("movie-search-input")));
        searchInput.sendKeys(movieTitle);
        pause(1500); // Watch the search filter happen in real time

        // Step 15 – Verify the movie card is in the store
        System.out.println("[Step 15] Verifying new movie is displayed in the store...");
        WebElement movieGrid = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("movie-grid")));
        pause(2000); // Look at the movie card on screen

        assertTrue(movieGrid.getText().contains(movieTitle),
                   "New movie was not found in the store!");

        System.out.println("[TEST 2] ✅ PASSED – New movie added and visible in the store.\n");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 3: Catalog Search & Details Modal View
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testSearchAndDetailsModalFlow() {
        System.out.println("\n========================================");
        System.out.println("[TEST 3] Search and Details Modal Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 - Verify logo branding exists
        System.out.println("[Step 1] Verifying logo branding...");
        WebElement logo = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("brand-logo")));
        assertTrue(logo.getText().toLowerCase().contains("moviesphere"));
        pause(1000);

        // Step 2 - Search for movie title "Dune"
        System.out.println("[Step 2] Searching for 'Dune'...");
        WebElement searchInput = driver.findElement(By.id("movie-search-input"));
        searchInput.sendKeys("Dune");
        pause(1500); // Wait for filtering animation

        // Step 3 - Assert grid displays Dune: Part Two
        System.out.println("[Step 3] Verifying search results...");
        WebElement movieGrid = driver.findElement(By.id("movie-grid"));
        assertTrue(movieGrid.getText().contains("Dune: Part Two"));
        assertFalse(movieGrid.getText().contains("Inception")); // Inception should be hidden
        pause(1000);

        // Step 4 - Click on poster wrapper of Dune: Part Two to open modal
        System.out.println("[Step 4] Clicking movie poster to open details modal...");
        WebElement firstPoster = wait.until(ExpectedConditions.elementToBeClickable(By.className("movie-poster-wrapper")));
        firstPoster.click();
        pause(1500);

        // Step 5 - Assert movie details modal is visible
        System.out.println("[Step 5] Asserting movie details dialog visibility and content...");
        WebElement detailsDialog = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("movie-details-dialog")));
        WebElement dialogTitle = driver.findElement(By.id("dialog-title"));
        assertTrue(dialogTitle.getText().contains("Dune: Part Two"));
        assertTrue(detailsDialog.getText().contains("Genre: Sci-Fi"));
        pause(1500);

        // Step 6 - Close details modal
        System.out.println("[Step 6] Closing details modal...");
        driver.findElement(By.id("close-details-modal")).click();
        pause(1500);

        // Step 7 - Assert details modal is hidden
        System.out.println("[Step 7] Verifying modal is closed...");
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("movie-details-dialog")));
        pause(1000);

        System.out.println("[TEST 3] ✅ PASSED – Catalog search and details modal verified.\n");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 4: Watchlist Quantity Management
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testWatchlistQuantityUpdateFlow() {
        System.out.println("\n========================================");
        System.out.println("[TEST 4] Watchlist Quantity Update Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 - Wait for catalog to load and click Watch Now for Inception
        System.out.println("[Step 1] Clicking 'Watch Now' button for Inception...");
        WebElement rentBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(@class, 'movie-card')][descendant::h3[contains(text(), 'Inception')]]//button[contains(text(), 'Watch Now')]")));
        rentBtn.click();
        pause(1500);

        // Step 2 - Verify cart drawer is open and contains Inception
        System.out.println("[Step 2] Verifying watchlist sidebar is open...");
        WebElement cartSidebar = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cart-sidebar")));
        assertTrue(cartSidebar.getAttribute("class").contains("open"), "Watchlist drawer is not open!");
        
        WebElement qtyVal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(@id, 'qty-val-')]")));
        assertEquals(qtyVal.getText().trim(), "1");

        WebElement totalVal = driver.findElement(By.id("cart-total-value"));
        assertTrue(totalVal.getText().contains("199"));
        pause(1000);

        // Step 3 - Click "+" button to increment quantity
        System.out.println("[Step 3] Incrementing quantity...");
        WebElement incBtn = driver.findElement(By.xpath("//button[contains(@class, 'qty-btn') and contains(text(), '+')]"));
        incBtn.click();
        pause(1500);

        // Step 4 - Verify quantity is 2 and total price is ₹398
        System.out.println("[Step 4] Verifying quantity incremented...");
        assertEquals(qtyVal.getText().trim(), "2");
        assertTrue(totalVal.getText().contains("398"));
        pause(1000);

        // Step 5 - Click "-" button to decrement quantity
        System.out.println("[Step 5] Decrementing quantity...");
        WebElement decBtn = driver.findElement(By.xpath("//button[contains(@class, 'qty-btn') and contains(text(), '-')]"));
        decBtn.click();
        pause(1500);

        // Step 6 - Verify quantity is 1 and total price is ₹199
        System.out.println("[Step 6] Verifying quantity decremented...");
        assertEquals(qtyVal.getText().trim(), "1");
        assertTrue(totalVal.getText().contains("199"));
        pause(1000);

        System.out.println("[TEST 4] ✅ PASSED – Watchlist quantity updates verified.\n");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 5: User Login & Logout Session
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testUserLoginLogoutFlow() {
        System.out.println("\n========================================");
        System.out.println("[TEST 5] User Login & Logout Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 - Open login modal
        System.out.println("[Step 1] Clicking 'Login' button...");
        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("login-btn")));
        loginBtn.click();
        pause(1500);

        // Step 2 - Wait for modal to load
        System.out.println("[Step 2] Waiting for login modal...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-dialog")));
        pause(1000);

        // Step 3 - Enter valid standard credentials
        System.out.println("[Step 3] Entering standard user credentials...");
        driver.findElement(By.id("login-email")).sendKeys("user@example.com");
        pause(500);
        driver.findElement(By.id("login-password")).sendKeys("password");
        pause(1000);

        // Step 4 - Click login submit
        System.out.println("[Step 4] Submitting login...");
        driver.findElement(By.id("login-submit-btn")).click();
        pause(1500);

        // Step 5 - Verify user navbar updates
        System.out.println("[Step 5] Checking for user navbar greeting...");
        WebElement profileNav = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("user-profile-nav")));
        assertTrue(profileNav.getText().contains("Hi, Standard User"));
        pause(1500);

        // Step 6 - Click logout
        System.out.println("[Step 6] Clicking 'Logout' button...");
        driver.findElement(By.id("logout-btn")).click();
        pause(1500);

        // Step 7 - Verify navbar returns to Login
        System.out.println("[Step 7] Verifying logged out state...");
        WebElement loginBtnAfter = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-btn")));
        assertTrue(loginBtnAfter.isDisplayed());
        pause(1000);

        System.out.println("[TEST 5] ✅ PASSED – User login and logout session verified.\n");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 6: Admin Delete Movie
    // ══════════════════════════════════════════════════════════════════════════
    @Test
    public void testAdminDeleteMovieFlow() {
        System.out.println("\n========================================");
        System.out.println("[TEST 6] Admin Delete Movie Flow");
        System.out.println("========================================");
        pause(1000);

        // Step 1 - Log in as Admin
        System.out.println("[Step 1] Clicking 'Login' button...");
        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("login-btn")));
        loginBtn.click();
        pause(1500);

        System.out.println("[Step 2] Entering admin credentials...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-dialog")));
        driver.findElement(By.id("login-email")).sendKeys("admin@example.com");
        driver.findElement(By.id("login-password")).sendKeys("admin123");
        driver.findElement(By.id("login-submit-btn")).click();
        pause(1500);

        // Step 2 - Toggle Admin Panel
        System.out.println("[Step 3] Clicking 'Admin Panel' toggle...");
        WebElement adminToggle = wait.until(ExpectedConditions.elementToBeClickable(By.id("admin-view-toggle")));
        adminToggle.click();
        pause(1500);

        // Step 3 - Open Manage Catalog tab
        System.out.println("[Step 4] Opening 'Manage Catalog' tab...");
        WebElement catalogTab = wait.until(ExpectedConditions.elementToBeClickable(By.id("admin-tab-movies")));
        catalogTab.click();
        pause(1500);

        // Step 4 - Create a dummy movie to delete
        String movieTitleToDelete = "Delete Me " + System.currentTimeMillis();
        System.out.println("[Step 5] Creating dummy movie: " + movieTitleToDelete);
        driver.findElement(By.id("new-title")).sendKeys(movieTitleToDelete);
        driver.findElement(By.id("new-genre")).sendKeys("Action");
        driver.findElement(By.id("new-year")).sendKeys("2020");
        driver.findElement(By.id("new-price")).sendKeys("99");
        driver.findElement(By.id("new-stock")).sendKeys("1");
        driver.findElement(By.id("new-desc")).sendKeys("This is a temporary movie created to verify deletion functionality.");
        pause(1000);
        driver.findElement(By.id("add-movie-submit")).click();
        pause(2000);

        // Verify creation success
        WebElement successAlert = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-success-msg")));
        assertTrue(successAlert.getText().contains("added successfully"));
        pause(1500);

        // Step 5 - Find delete button in table and click it
        System.out.println("[Step 6] Locating and clicking 'Delete' button for: " + movieTitleToDelete);
        WebElement deleteBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//table[@id='admin-movies-table']//tr[td[contains(text(), '" + movieTitleToDelete + "')]]//button[contains(text(), 'Delete')]")));
        deleteBtn.click();
        pause(1500);

        // Step 6 - Handle the browser confirmation alert dialog
        System.out.println("[Step 7] Accepting browser confirm dialog...");
        driver.switchTo().alert().accept();
        pause(2000);

        // Step 7 - Verify success banner shows deletion success
        System.out.println("[Step 8] Checking for deletion success message...");
        WebElement deletionSuccess = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-success-msg")));
        assertTrue(deletionSuccess.getText().contains("Movie deleted successfully"));
        pause(2000);

        System.out.println("[TEST 6] ✅ PASSED – Admin delete movie flow verified.\n");
    }
}
