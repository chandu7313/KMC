// ============================================================
// Kissan Mithar Consultancy — Continuous Delivery Pipeline
// ============================================================
// Declarative Jenkins pipeline for building, testing, and
// deploying the KMC microservices stack to AWS Ubuntu via SSH.
//
// Prerequisites on Jenkins controller:
//   - Docker & Docker Compose installed on the build agent
//   - "SSH Agent" plugin installed
//   - Credentials configured:
//       • SSH private key  → ID matches AWS_SSH_CREDENTIALS_ID
//       • .env secrets     → ID "kmc-env-file" (Secret file)
//   - Node.js 18 available (via NodeJS plugin or pre-installed)
//
// Prerequisites on AWS EC2 target:
//   - Docker & Docker Compose installed
//   - SSH access for the Jenkins user
//   - Project directory at /opt/kmc (configurable via DEPLOY_DIR)
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
            defaultValue: '',
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
            defaultValue: '/opt/kmc',
            description: 'Absolute path on the remote server where the project is deployed'
        )
    }

    // ─── Environment ───────────────────────────────
    environment {
        COMPOSE_FILE    = 'docker-compose.prod.yml'
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
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

        // ── Stage 3: Build & Lint Frontend ─────────
        stage('Build Frontend') {
            steps {
                dir('microservices/frontend/web') {
                    sh '''
                        echo "📦 Installing frontend dependencies..."
                        npm ci

                        echo "🔍 Linting frontend code..."
                        npm run lint

                        echo "🏗️  Building production bundle..."
                        VITE_BACKEND_URL=https://kissanmithar.com \
                        VITE_APP_ENV=production \
                        npm run build
                    '''
                }
            }
        }

        // ── Stage 4: Build Docker Images ───────────
        stage('Build Docker Images') {
            steps {
                dir('microservices') {
                    sh '''
                        echo "🐳 Building production Docker images..."
                        docker compose -f ${COMPOSE_FILE} build --parallel

                        echo "📋 Built images:"
                        docker images --filter "reference=microservices-*" --format "  {{.Repository}}:{{.Tag}} ({{.Size}})"
                    '''
                }
            }
        }

        // ── Stage 5: Deploy to AWS ─────────────────
        stage('Deploy to AWS') {
            when {
                allOf {
                    branch 'main'
                    expression { return params.DEPLOY_TO_AWS }
                    expression { return params.AWS_EC2_HOST?.trim() }
                }
            }
            steps {
                script {
                    def remoteHost = "${params.AWS_EC2_USER}@${params.AWS_EC2_HOST}"
                    def deployDir  = params.DEPLOY_DIR

                    sshagent(credentials: [params.AWS_SSH_CREDENTIALS_ID]) {

                        // Ensure the deployment directory exists
                        sh """
                            ssh -o StrictHostKeyChecking=no ${remoteHost} '
                                mkdir -p ${deployDir}/microservices
                            '
                        """

                        // Sync project files to the remote server
                        sh """
                            echo "📤 Syncing project files to ${remoteHost}:${deployDir}..."
                            rsync -avz --delete \
                                --exclude 'node_modules' \
                                --exclude '.git' \
                                --exclude 'logs' \
                                --exclude '.DS_Store' \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/docker-compose.prod.yml \
                                microservices/docker-compose.yml \
                                microservices/Dockerfile.template \
                                microservices/Makefile \
                                microservices/package.json \
                                microservices/package-lock.json \
                                ${remoteHost}:${deployDir}/microservices/
                        """

                        // Sync service source code, shared packages, nginx, and rabbitmq configs
                        sh """
                            rsync -avz --delete \
                                --exclude 'node_modules' \
                                --exclude '.DS_Store' \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/services/ \
                                ${remoteHost}:${deployDir}/microservices/services/

                            rsync -avz --delete \
                                --exclude 'node_modules' \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/packages/ \
                                ${remoteHost}:${deployDir}/microservices/packages/

                            rsync -avz --delete \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/nginx/ \
                                ${remoteHost}:${deployDir}/microservices/nginx/

                            rsync -avz --delete \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/rabbitmq/ \
                                ${remoteHost}:${deployDir}/microservices/rabbitmq/

                            rsync -avz --delete \
                                --exclude 'node_modules' \
                                --exclude '.DS_Store' \
                                -e 'ssh -o StrictHostKeyChecking=no' \
                                microservices/frontend/ \
                                ${remoteHost}:${deployDir}/microservices/frontend/
                        """

                        // Upload the .env file from Jenkins secret
                        withCredentials([file(credentialsId: 'kmc-env-file', variable: 'ENV_FILE')]) {
                            sh """
                                scp -o StrictHostKeyChecking=no \
                                    \$ENV_FILE \
                                    ${remoteHost}:${deployDir}/microservices/.env
                            """
                        }

                        // Stop old containers, rebuild, and start fresh
                        sh """
                            echo "🚀 Deploying on ${remoteHost}..."
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

        // ── Stage 6: Post-Deployment Health Check ──
        stage('Health Check') {
            when {
                allOf {
                    branch 'main'
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
            // Clean up workspace to save disk on the Jenkins agent
            cleanWs(cleanWhenNotBuilt: false)
        }
    }
}
