pipeline {
    agent any
    
    tools {
        nodejs 'NodeJs'
       // 'hudson.plugins.sonar.SonarRunnerInstallation' 'Sonar'
    }
    
    environment {
        DOCKER_IMAGE = "mohamedelaassal/lzz_repo"
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig')
       // SONARQUBE_TOKEN = credentials('sonar1')
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'jen-git', url: 'https://github.com/MohamedElaassal/k8s-CI_CD-app.git'
                //generate a github token (settings -->Developer Settings --> Personal Access token)
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                bat 'npm install'
                bat 'npm test'
                //for linux use sh instead of bat
            }
        }
        
        // stage('Code Quality Analysis') {
        //     steps {
        //         withSonarQubeEnv('sonarqube') {
        //             sh """
        //                 sonar-scanner \
        //                 -Dsonar.projectKey=k8s-cicd-app \
        //                 -Dsonar.sources=. \
        //                 -Dsonar.host.url=https://95d9558001ba.ngrok-free.app/ \
        //                 -Dsonar.login=${SONARQUBE_TOKEN}
        //             """
        //         }
        //     }
        // }
        
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
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        bat 'kubectl apply -f k8s/deploy.yaml'
                        bat 'kubectl apply -f k8s/service.yaml'
                        //for linux use sh instead of bat
                    }
                }
            }
        }
    }
}