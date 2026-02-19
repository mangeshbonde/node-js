pipeline {
    agent any

    environment {
        APP_NAME = "todo-app"
    }

    stages {

        stage('Install Git If Missing') {
            steps {
                sh '''
                if ! command -v git >/dev/null 2>&1; then
                    sudo apt update
                    sudo apt install -y git
                fi
                '''
            }
        }

        stage('Install NodeJS If Missing') {
            steps {
                sh '''
                if ! command -v node >/dev/null 2>&1; then
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt install -y nodejs
                fi
                '''
            }
        }

        stage('Install PM2 If Missing') {
            steps {
                sh '''
                if ! command -v pm2 >/dev/null 2>&1; then
                    sudo npm install -g pm2
                fi
                '''
            }
        }

        stage('Stop Old App') {
            steps {
                sh '''
                pm2 delete $APP_NAME || true
                '''
            }
        }

        stage('Start App') {
            steps {
                sh '''
                pm2 start server.js --name $APP_NAME
                pm2 save
                '''
            }
        }

        stage('Verify Running') {
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
