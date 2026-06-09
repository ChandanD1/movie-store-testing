# Java Maven Selenium Test Suite

This directory contains the standard Java Maven structure representing the Selenium WebDriver tests.

## 📁 Directory Structure
```
java-maven/
├── pom.xml                 # Maven Project Object Model (Dependencies)
├── README.md               # This instructions file
└── src/
    └── test/
        └── java/
            └── com/
                └── moviestore/
                    └── MovieStoreTest.java  # Selenium WebDriver Test Spec
```

## 🛠️ Prerequisites
Make sure you have:
1. **Java Development Kit (JDK 11 or JDK 17)** installed on your machine.
2. **Apache Maven** installed. (On Mac, you can install it using Homebrew: `brew install maven`).
3. Google Chrome installed.

---

## 🚀 Running the Tests via Maven

1. Navigate to the Maven folder in your terminal:
   ```bash
   cd /Users/chandan_dhumale/Desktop/movie-store/tests/selenium/java-maven
   ```

2. Run the tests visually (Chrome will open automatically, run the actions, and close):
   ```bash
   mvn test
   ```

3. Run the tests in headless mode (no browser window opens, useful for CI/CD):
   ```bash
   HEADLESS=true mvn test
   ```

---

## 💻 Importing into IDE (Eclipse / IntelliJ IDEA)

### IntelliJ IDEA
1. Open IntelliJ IDEA.
2. Select **Open** or **Import**.
3. Choose the `pom.xml` file inside this directory (`/Users/chandan_dhumale/Desktop/movie-store/tests/selenium/java-maven/pom.xml`).
4. Click **Open as Project**. IntelliJ will automatically pull all dependencies (Selenium, JUnit, and WebDriverManager).
5. Open `MovieStoreTest.java`, right-click inside the file, and select **Run 'MovieStoreTest'**.

### Eclipse IDE
1. Open Eclipse.
2. Go to **File** > **Import...**
3. Select **Maven** > **Existing Maven Projects** and click **Next**.
4. Browse to this directory (`/Users/chandan_dhumale/Desktop/movie-store/tests/selenium/java-maven`) as the Root Directory.
5. Make sure the checkbox for `pom.xml` is selected, and click **Finish**.
6. Right-click the project, select **Run As** > **JUnit Test**.
