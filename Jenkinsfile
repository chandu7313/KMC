// ============================================================
// Kissan Mithar Consultancy — Continuous Delivery Pipeline
// ============================================================
// Declarative Jenkins pipeline for deploying the KMC 
// microservices stack to AWS Ubuntu via SSH.
// ============================================================

pipeline {
    agent any

    // ─── Parameters ────────────────────────────────
    parameters {
        booleanParam(
            name: 'DEPLOY_TO_AWS',
            defaultValue: true,
            description: 'Deploy to AWS EC2 after a successful build (main branch only)'
        )
        string(
            name: 'AWS_EC2_HOST',
            defaultValue: '65.1.198.122',
            description: 'Public IP or hostname of the target AWS Ubuntu EC2 instance'
        )
        string(
            name: 'AWS_EC2_USER',
            defaultValue: 'ubuntu',
            description: 'SSH username on the target EC2 instance'
        )
        string(
            name: 'AWS_SSH_CREDENTIALS_ID',
            defaultValue: 'kmc-aws-ssh-key',
            description: 'Jenkins credentials ID for the SSH private key'
        )
        string(
            name: 'DEPLOY_DIR',
            defaultValue: '/home/ubuntu/kissan',
            description: 'Absolute path on the remote server where the project is deployed'
        )
    }

    // ─── Environment ───────────────────────────────
    environment {
        NODE_VERSION = '20'
    }

    // ─── Options ───────────────────────────────────
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // ─── Stages ────────────────────────────────────
    stages {

        // ── Stage 1: Checkout ──────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "✅ Checked out branch: ${GIT_BRANCH}"'
            }
        }

        // ── Stage 2: Install & Test Backend ────────
        stage('Install & Test Backend') {
            steps {
                dir('microservices') {
                    sh '''
                        echo "📦 Installing workspace dependencies..."
                        npm ci

                        echo "🧪 Running unit tests across workspaces..."
                        npm test --workspaces --if-present
                    '''
                }
            }
        }

        // ── Stage 3: Deploy to AWS ─────────────────
        stage('Deploy to AWS') {
            when {
                allOf {
                    expression { return (env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main' || env.GIT_BRANCH == 'main' || !env.GIT_BRANCH) }
                    expression { return params.DEPLOY_TO_AWS }
                    expression { return params.AWS_EC2_HOST?.trim() }
                }
            }
            steps {
                script {
                    def remoteHost = "${params.AWS_EC2_USER}@${params.AWS_EC2_HOST}"
                    def deployDir  = params.DEPLOY_DIR

                    sshagent(credentials: [params.AWS_SSH_CREDENTIALS_ID]) {

                        // Ensure directory exists and pull latest code
                        sh """
                            echo "🚀 Updating code on ${remoteHost}:${deployDir}..."
                            ssh -o StrictHostKeyChecking=no ${remoteHost} '
                                if [ ! -d "${deployDir}/.git" ]; then
                                    echo "Cloning repository..."
                                    git clone https://github.com/chandu7313/KMC.git ${deployDir}
                                    cd ${deployDir}
                                else
                                    cd ${deployDir}
                                    echo "Pulling latest changes..."
                                    git fetch origin main
                                    git reset --hard origin/main
                                fi
                            '
                        """

                        // Upload the .env file from Jenkins secret
                        withCredentials([file(credentialsId: 'kmc-env-file', variable: 'ENV_FILE')]) {
                            sh """
                                echo "🔐 Uploading .env file..."
                                scp -o StrictHostKeyChecking=no \
                                    \$ENV_FILE \
                                    ${remoteHost}:${deployDir}/microservices/.env
                            """
                        }

                        // Build containers and start services
                        sh """
                            echo "🏗️  Deploying on ${remoteHost}..."
                            ssh -o StrictHostKeyChecking=no ${remoteHost} '
                                cd ${deployDir}/microservices

                                echo "⬇️  Stopping current containers..."
                                docker compose -f docker-compose.prod.yml down --remove-orphans || true

                                echo "🏗️  Building and starting production containers..."
                                docker compose -f docker-compose.prod.yml up -d --build

                                echo "🧹 Pruning unused Docker resources..."
                                docker system prune -f --volumes 2>/dev/null || true

                                echo "📋 Running containers:"
                                docker compose -f docker-compose.prod.yml ps
                            '
                        """
                    }
                }
            }
        }

        // ── Stage 4: Post-Deployment Health Check ──
        stage('Health Check') {
            when {
                allOf {
                    expression { return (env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main' || env.GIT_BRANCH == 'main' || !env.GIT_BRANCH) }
                    expression { return params.DEPLOY_TO_AWS }
                    expression { return params.AWS_EC2_HOST?.trim() }
                }
            }
            steps {
                script {
                    def remoteHost = "${params.AWS_EC2_USER}@${params.AWS_EC2_HOST}"
                    def deployDir  = params.DEPLOY_DIR

                    // Wait for services to become healthy
                    sh 'echo "⏳ Waiting 30 seconds for services to initialize..."'
                    sleep(time: 30, unit: 'SECONDS')

                    sshagent(credentials: [params.AWS_SSH_CREDENTIALS_ID]) {
                        sh """
                            echo "🏥 Running health checks on ${params.AWS_EC2_HOST}..."
                            ssh -o StrictHostKeyChecking=no ${remoteHost} '
                                echo "── Gateway (Nginx) ──"
                                curl -sf -o /dev/null -w "HTTP %{http_code} — %{time_total}s\\n" \
                                    http://localhost/ || echo "❌ Gateway unreachable"

                                echo ""
                                echo "── Auth Service Health ──"
                                curl -sf -o /dev/null -w "HTTP %{http_code} — %{time_total}s\\n" \
                                    http://localhost/api/auth/health || echo "❌ Auth service unhealthy"

                                echo ""
                                echo "── Container Status ──"
                                docker compose -f ${deployDir}/microservices/docker-compose.prod.yml ps \
                                    --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
                            '
                        """
                    }
                }
            }
        }
    }

    // ─── Post Actions ──────────────────────────────
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the stage logs above for details.'
        }
        always {
            cleanWs(cleanWhenNotBuilt: false)
        }
    }
}
