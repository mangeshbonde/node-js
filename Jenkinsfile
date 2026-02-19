pipeline {
    agent any

    environment {
        APP_NAME = "node-todo-app"
        APP_PORT = "3000"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Install Node.js') {
            steps {
                sh '''
                sudo apt update -y
                sudo apt install -y curl

                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt install -y nodejs

                node -v
                npm -v
                '''
            }
        }

        stage('Install PM2') {
            steps {
                sh '''
                sudo npm install -g pm2
                pm2 -v
                '''
            }
        }

        stage('Stop Old Application') {
            steps {
                sh '''
                pm2 delete ${APP_NAME} || true
                '''
            }
        }

        stage('Start Application') {
            steps {
                sh '''
                pm2 start server.js --name ${APP_NAME}
                pm2 save
                pm2 startup systemd -u jenkins --hp /var/lib/jenkins
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                pm2 list
                curl http://localhost:${APP_PORT} || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
