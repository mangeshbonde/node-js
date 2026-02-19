pipeline {
    agent any

    environment {
        APP_NAME = "todo-app"
    }

    stages {

        stage('Install NodeJS') {
            steps {
                sh '''
                echo "Installing NodeJS..."
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get update
                sudo apt-get install -y nodejs
                '''
            }
        }

        stage('Install PM2') {
            steps {
                sh '''
                echo "Installing PM2..."
                sudo npm install -g pm2
                '''
            }
        }

        stage('Stop Previous App') {
            steps {
                sh '''
                pm2 delete $APP_NAME || true
                '''
            }
        }

        stage('Start Application') {
            steps {
                sh '''
                pm2 start server.js --name $APP_NAME
                pm2 save
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                sleep 3
                pm2 list
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}
