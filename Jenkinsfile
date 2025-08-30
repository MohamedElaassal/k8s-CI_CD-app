pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "mohamedelaassal/lzz_repo"
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig')
        SONARQUBE_TOKEN = credentials('sonar1')
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'jen-git', url: 'https://github.com/MohamedElaassal/k8s-CI_CD-app.git'
                //here you go to genererate a github token (settings -->Developer Settings --> Personal Access token)
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                sh '''
                    # Install Node.js using NodeSource repository
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                    
                    # Run npm commands
                    npm install
                    npm test
                '''
            }
        }
        
        stage('Code Quality Analysis') {
            steps {
                sh '''
                    # Install SonarQube Scanner
                    wget -O sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
                    unzip -o sonar-scanner.zip
                    mv sonar-scanner-4.8.0.2856-linux sonar-scanner
                    export PATH=$PATH:$(pwd)/sonar-scanner/bin
                '''
                
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ./sonar-scanner/bin/sonar-scanner \
                        -Dsonar.projectKey=k8s-cicd-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=https://95d9558001ba.ngrok-free.app/ \
                        -Dsonar.login=${SONARQUBE_TOKEN}
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'jen-dockerhub') {
                        docker.image("${DOCKER_IMAGE}:latest").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig(credentialsId: 'kubeconfig') {
                        sh 'kubectl apply -f k8s/deployment.yaml'
                        sh 'kubectl apply -f k8s/service.yaml'
                    }
                }
            }
        }
    }
}