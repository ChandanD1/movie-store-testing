pipeline {
    agent any

    environment {
        // Enforce port 8080 and port 5173 matching configurations
        PORT = '8080'
        MONGODB_URI = 'mongodb://127.0.0.1:27017/movie-store'
        CI = 'true'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Setup') {
            steps {
                echo 'Installing Node.js dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                }
                dir('tests/cypress') {
                    sh 'npm install'
                }

                echo 'Building Java Maven Selenium project...'
                dir('tests/selenium/java-maven') {
                    sh 'mvn clean compile'
                }
            }
        }

        stage('Seed Database') {
            steps {
                echo 'Resetting MongoDB and seeding store catalog...'
                dir('backend') {
                    sh 'npm run seed'
                }
            }
        }

        stage('Start Application') {
            steps {
                echo 'Starting backend & frontend servers in background...'
                dir('backend') {
                    // Start backend, redirect logs, run in background
                    sh 'nohup npm start > backend.log 2>&1 &'
                }
                dir('frontend') {
                    // Start frontend, redirect logs, run in background
                    sh 'nohup npm run dev > frontend.log 2>&1 &'
                }

                echo 'Waiting for services to become healthy...'
                // Health checks with timeouts
                sh 'timeout 30 sh -c "until curl -s http://localhost:8080/api/movies >/dev/null; do sleep 2; done"'
                sh 'timeout 30 sh -c "until curl -s http://localhost:5173 >/dev/null; do sleep 2; done"'
                echo 'Application servers are up and healthy!'
            }
        }

        stage('Run Cypress E2E Tests') {
            steps {
                echo 'Running Cypress E2E test suite...'
                dir('tests/cypress') {
                    // Bypasses macOS Node CLI wrapper issues by running the bypass runner
                    sh 'npm run cypress:run:bypass'
                }
            }
        }

        stage('Run Selenium Web Tests') {
            steps {
                echo 'Running Selenium Java Maven TestNG suite...'
                dir('tests/selenium/java-maven') {
                    sh 'mvn test'
                }
            }
        }
    }

    post {
        always {
            echo 'Performing pipeline cleanup...'
            // Force terminate background servers to release ports
            sh 'pkill -f "node server.js" || true'
            sh 'pkill -f "vite" || true'

            echo 'Archiving test reports and results...'
            // Archive TestNG surefire XML reports
            junit allowEmptyResults: true, testResults: 'tests/selenium/java-maven/target/surefire-reports/**/*.xml'
            
            // Archive Cypress screenshots and videos if generated
            archiveArtifacts artifacts: 'tests/cypress/cypress/screenshots/**, tests/cypress/cypress/videos/**', allowEmptyArchive: true
        }
    }
}
