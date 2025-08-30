pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "mohamedelaassal/lzz_repo"
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig-id')
        SONARQUBE_TOKEN = credentials('sonarqube-token')
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
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Code Quality Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=k8s-cicd-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://<sonarqube-server-url> \
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
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials-id') {
                        docker.image(DOCKER_IMAGE).push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig(credentialsId: KUBECONFIG_CREDENTIALS) {
                        sh 'kubectl apply -f k8s/deployment.yaml'
                        sh 'kubectl apply -f k8s/service.yaml'
                    }
                }
            }
        }
    }
}