# KMC Deployment Guide — AWS Ubuntu + GitHub Actions CI + Jenkins CD + Docker

> Complete step-by-step guide. Follow each phase in order. Do NOT skip any step.

---

## Architecture Overview

```mermaid
graph LR
    DEV["👨‍💻 Developer"] -->|git push| GH["GitHub Repository"]
    GH -->|Webhook trigger| GA["GitHub Actions CI"]
    GA -->|Lint, Test, Docker Check| GA
    GA -->|✅ Pass| GH
    GH -->|Webhook trigger| JK["Jenkins Server"]
    JK -->|SSH + rsync| AWS["AWS EC2 Ubuntu"]
    AWS -->|docker compose up| DC["Docker Containers"]
    DC -->|15 Services + Frontend + Nginx + Redis + RabbitMQ| PROD["🌐 Production"]
```

**Flow**: Developer pushes code → GitHub Actions runs CI checks → Jenkins picks up the change → builds & deploys to AWS via SSH → Docker Compose runs all services.

---

## Phase 1: AWS EC2 Instance Setup

### Step 1.1 — Launch an EC2 Instance

1. Log into the **AWS Management Console** → navigate to **EC2** → click **Launch Instance**.
2. Configure the instance:

   | Setting | Value |
   |---------|-------|
   | **Name** | `kmc-production` |
   | **AMI** | Ubuntu Server 22.04 LTS (HVM), SSD Volume Type |
   | **Instance Type** | `t3.large` (2 vCPUs, 8 GB RAM) — minimum for 15 microservices |
   | **Key Pair** | Create new → Name: `kmc-deploy-key` → Type: RSA → Format: `.pem` → **Download and save it safely** |
   | **Storage** | 40 GB gp3 (SSD) minimum |

3. Click **Launch Instance**.

> [!IMPORTANT]
> **Save the `.pem` file securely.** You will need it for SSH access and Jenkins credentials. If you lose it, you cannot recover it.

### Step 1.2 — Configure Security Group (Firewall)

Go to **EC2 → Security Groups** → select the security group attached to your instance → **Edit Inbound Rules**:

| Type | Protocol | Port Range | Source | Purpose |
|------|----------|------------|--------|---------|
| SSH | TCP | 22 | Your IP / Jenkins IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | TCP | 8080 | Your IP | Jenkins UI (only if Jenkins runs on this same server) |
| Custom TCP | TCP | 15672 | Your IP only | RabbitMQ Management UI (optional, restrict access) |

> [!WARNING]
> **Never open port 22 to `0.0.0.0/0`** in production. Restrict it to your IP and the Jenkins server IP only.

### Step 1.3 — Allocate an Elastic IP

1. Go to **EC2 → Elastic IPs** → click **Allocate Elastic IP Address**.
2. Select the allocated IP → **Actions → Associate Elastic IP Address**.
3. Choose your `kmc-production` instance → click **Associate**.

Write down this IP. Example: `3.110.45.200`. This is your `AWS_EC2_HOST`.

---

## Phase 2: Connect to EC2 & Install Prerequisites

### Step 2.1 — SSH into the Instance

```bash
# From your local Mac terminal
chmod 400 ~/Downloads/kmc-deploy-key.pem
ssh -i ~/Downloads/kmc-deploy-key.pem ubuntu@3.110.45.200
```

> [!TIP]
> Replace `3.110.45.200` with your actual Elastic IP throughout this guide.

### Step 2.2 — Update the System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### Step 2.3 — Install Docker

```bash
# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add ubuntu user to docker group (so you don't need sudo for docker commands)
sudo usermod -aG docker ubuntu

# Apply group change immediately (or logout and login again)
newgrp docker

# Verify installation
docker --version
docker compose version
```

**Expected output:**
```
Docker version 27.x.x, build xxxxxxx
Docker Compose version v2.x.x
```

### Step 2.4 — Install Node.js 18

```bash
# Install Node.js 18 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # Should print v18.x.x
npm --version    # Should print 10.x.x or 9.x.x
```

### Step 2.5 — Create the Deployment Directory

```bash
sudo mkdir -p /opt/kmc
sudo chown -R ubuntu:ubuntu /opt/kmc
```

---

## Phase 3: Install Jenkins

> [!NOTE]
> You can install Jenkins either on the **same EC2 instance** or on a **separate dedicated Jenkins server**. This guide installs it on the same instance for simplicity.

### Step 3.1 — Install Java 17 (Jenkins Requirement)

```bash
sudo apt install -y openjdk-17-jdk

# Verify
java -version
```

**Expected output:** `openjdk version "17.x.x"`

### Step 3.2 — Install Jenkins

```bash
# Add Jenkins GPG key and repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Verify Jenkins is running
sudo systemctl status jenkins
```

**Expected output:** `Active: active (running)`

### Step 3.3 — Add Jenkins User to Docker Group

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

> [!IMPORTANT]
> This is **critical**. Without this, Jenkins cannot run `docker` or `docker compose` commands.

### Step 3.4 — Get the Initial Admin Password

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy this password. You will need it in the next step.

---

## Phase 4: Configure Jenkins (Web UI)

### Step 4.1 — Access Jenkins UI

1. Open your browser and go to:
   ```
   http://3.110.45.200:8080
   ```
2. Paste the **initial admin password** from Step 3.4.
3. Click **Install suggested plugins** → wait for installation to complete.
4. Create your **Admin User**:

   | Field | Value |
   |-------|-------|
   | Username | `admin` |
   | Password | `<your-strong-password>` |
   | Full Name | `KMC Admin` |
   | Email | `admin@kissanmithar.com` |

5. Set the **Jenkins URL** to: `http://3.110.45.200:8080/`
6. Click **Save and Finish** → **Start using Jenkins**.

### Step 4.2 — Install Required Jenkins Plugins

1. Go to **Manage Jenkins → Plugins → Available plugins**.
2. Search for and install each of these plugins:

   | Plugin | Purpose |
   |--------|---------|
   | **SSH Agent** | SSH into EC2 for deployment |
   | **Pipeline** | Run Jenkinsfile pipelines |
   | **Git** | Clone GitHub repositories |
   | **GitHub Integration** | Webhook triggers from GitHub |
   | **NodeJS** | Provide Node.js in build steps |
   | **Docker Pipeline** | Docker support in pipelines |
   | **Credentials Binding** | Inject secrets securely |
   | **Blue Ocean** | Modern pipeline visualization (optional but recommended) |

3. Click **Install without restart** → check **Restart Jenkins when installation is complete**.

### Step 4.3 — Configure Node.js Tool

1. Go to **Manage Jenkins → Tools**.
2. Scroll to **NodeJS installations** → click **Add NodeJS**.
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `Node-18` |
   | Install automatically | ✅ Checked |
   | Version | `NodeJS 18.x.x` (latest 18.x) |

4. Click **Save**.

### Step 4.4 — Add SSH Credentials (for EC2 Access)

> [!IMPORTANT]
> If Jenkins is on the **same** EC2 instance, you still need SSH credentials so the pipeline can SSH to `localhost` or use local commands. If Jenkins is on a **separate** server, this is how it connects to the production EC2.

1. Go to **Manage Jenkins → Credentials → System → Global credentials** → **Add Credentials**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Kind | **SSH Username with private key** |
   | ID | `kmc-aws-ssh-key` |
   | Description | `KMC AWS EC2 SSH Key` |
   | Username | `ubuntu` |
   | Private Key | **Enter directly** → paste the entire contents of your `kmc-deploy-key.pem` file |

   To get the PEM contents from your Mac:
   ```bash
   cat ~/Downloads/kmc-deploy-key.pem
   ```
   Copy everything from `-----BEGIN RSA PRIVATE KEY-----` to `-----END RSA PRIVATE KEY-----` (inclusive).

3. Click **Create**.

### Step 4.5 — Add the .env File as a Secret

1. Go to **Manage Jenkins → Credentials → System → Global credentials** → **Add Credentials**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Kind | **Secret file** |
   | ID | `kmc-env-file` |
   | Description | `KMC Production .env file` |
   | File | Upload your production `.env` file |

3. Create your production `.env` file on your Mac first:

   ```bash
   # Copy the example and fill in real production values
   cp microservices/.env.example /tmp/kmc-production.env
   ```

   Then edit `/tmp/kmc-production.env` with your **real production values**:

   ```env
   # ─── App ────────────────────────────────
   NODE_ENV=production
   LOG_LEVEL=info

   # ─── Security ───────────────────────────
   JWT_SECRET=<generate-a-64-char-random-string>
   JWT_REFRESH_SECRET=<generate-another-64-char-random-string>
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12

   # ─── Redis ──────────────────────────────
   REDIS_URL=redis://redis:6379
   REDIS_PASSWORD=<strong-redis-password>

   # ─── RabbitMQ ───────────────────────────
   RABBITMQ_URL=amqp://admin:<rabbitmq-password>@rabbitmq:5672/kissan
   RABBITMQ_USER=admin
   RABBITMQ_PASS=<strong-rabbitmq-password>

   # ─── Supabase ───────────────────────────
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

   # ─── MongoDB ────────────────────────────
   MONGODB_URI=<your-mongodb-connection-string>

   # ─── Cloudinary ─────────────────────────
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>

   # ─── Razorpay ───────────────────────────
   RAZORPAY_KEY_ID=<your-live-key>
   RAZORPAY_KEY_SECRET=<your-live-secret>

   # ─── AI APIs ────────────────────────────
   GEMINI_API_KEY=<your-gemini-key>
   PLANT_ID_API_KEY=<your-plant-id-key>

   # ─── SMS ────────────────────────────────
   ENABLE_SMS=true
   FAST2SMS_API_KEY=<your-fast2sms-key>

   # ─── Email ──────────────────────────────
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-app-password>
   ADMIN_EMAIL=admin@kissanmithar.com
   ADMIN_PHONE=+91XXXXXXXXXX

   # ─── Market Data ────────────────────────
   DATA_GOV_API_KEY=<your-data-gov-key>

   # ─── Frontend ───────────────────────────
   REACT_APP_API_URL=http://localhost
   REACT_APP_SHOW_DEV_LOGIN=false
   REACT_APP_ENV=production
   ```

   > [!CAUTION]
   > Generate strong random strings for `JWT_SECRET`, `JWT_REFRESH_SECRET`, `REDIS_PASSWORD`, and `RABBITMQ_PASS`. Use:
   > ```bash
   > openssl rand -hex 32
   > ```

4. Upload this file and click **Create**.

---

## Phase 5: Set Up GitHub Integration

### Step 5.1 — Create a GitHub Personal Access Token

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Configure:

   | Field | Value |
   |-------|-------|
   | Note | `Jenkins CI/CD` |
   | Expiration | 90 days (or No expiration for convenience) |
   | Scopes | ✅ `repo` (full), ✅ `admin:repo_hook` |

4. Click **Generate token** → **copy the token immediately** (you won't see it again).

### Step 5.2 — Add GitHub Token to Jenkins

1. Go to **Manage Jenkins → Credentials → System → Global credentials** → **Add Credentials**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Kind | **Secret text** |
   | ID | `github-token` |
   | Description | `GitHub PAT for KMC` |
   | Secret | Paste your GitHub token |

3. Click **Create**.

### Step 5.3 — Configure GitHub Server in Jenkins

1. Go to **Manage Jenkins → System**.
2. Scroll to **GitHub** section → click **Add GitHub Server**.
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `GitHub` |
   | API URL | `https://api.github.com` |
   | Credentials | Select `github-token` |

4. Click **Test connection** — should show `Credentials verified for user chandu7313`.
5. Check ✅ **Manage hooks**.
6. Click **Save**.

### Step 5.4 — Set Up GitHub Webhook

1. Go to your GitHub repository: `https://github.com/chandu7313/KMC`.
2. Go to **Settings → Webhooks → Add webhook**.
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Payload URL | `http://3.110.45.200:8080/github-webhook/` |
   | Content type | `application/json` |
   | Secret | (leave blank or set a secret) |
   | Events | **Just the push event** |
   | Active | ✅ Checked |

4. Click **Add webhook**.

> [!NOTE]
> The trailing `/` in the Payload URL is **required**. Without it, the webhook will fail.

---

## Phase 6: Create the Jenkins Pipeline Job

### Step 6.1 — Create the Pipeline

1. Go to Jenkins Dashboard → **New Item**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Item name | `KMC-Deploy` |
   | Type | **Pipeline** |

3. Click **OK**.

### Step 6.2 — Configure the Pipeline

On the configuration page:

**General section:**
- ✅ Check **GitHub project**
  - Project URL: `https://github.com/chandu7313/KMC/`

**Build Triggers section:**
- ✅ Check **GitHub hook trigger for GITScm polling**

**Pipeline section:**

| Field | Value |
|-------|-------|
| Definition | **Pipeline script from SCM** |
| SCM | **Git** |
| Repository URL | `https://github.com/chandu7313/KMC.git` |
| Credentials | Select `github-token` |
| Branch Specifier | `*/main` |
| Script Path | `Jenkinsfile` |

Click **Save**.

### Step 6.3 — Set Build Parameters

After saving, click **Build with Parameters** on the left menu.

The first build will fail because Jenkins hasn't loaded the parameters yet. This is normal. After the first run, the parameters will appear:

| Parameter | Value |
|-----------|-------|
| `DEPLOY_TO_AWS` | ✅ true |
| `AWS_EC2_HOST` | `3.110.45.200` (your Elastic IP) |
| `AWS_EC2_USER` | `ubuntu` |
| `AWS_SSH_CREDENTIALS_ID` | `kmc-aws-ssh-key` |
| `DEPLOY_DIR` | `/opt/kmc` |

> [!TIP]
> If Jenkins is on the **same** EC2 instance as your deployment target, set `AWS_EC2_HOST` to `localhost` or `127.0.0.1`.

---

## Phase 7: First Manual Deployment (Verify Everything Works)

Before relying on Jenkins, let's do a manual deployment on EC2 to make sure the infrastructure works.

### Step 7.1 — Clone the Repository on EC2

```bash
# SSH into EC2
ssh -i ~/Downloads/kmc-deploy-key.pem ubuntu@3.110.45.200

# Clone the repo
cd /opt/kmc
git clone https://github.com/chandu7313/KMC.git .
```

> If already cloned:
> ```bash
> cd /opt/kmc && git pull origin main
> ```

### Step 7.2 — Create the Production .env File

```bash
cd /opt/kmc/microservices
cp .env.example .env
nano .env
```

Fill in all the production values (same values you uploaded to Jenkins in Step 4.5).

### Step 7.3 — Build and Start All Services

```bash
cd /opt/kmc/microservices

# Build all production Docker images (this will take 5–15 minutes on first run)
docker compose -f docker-compose.prod.yml build

# Start all containers in detached mode
docker compose -f docker-compose.prod.yml up -d
```

### Step 7.4 — Verify All Containers Are Running

```bash
docker compose -f docker-compose.prod.yml ps
```

**Expected:** All 15 services + frontend + nginx + redis + rabbitmq should show `Up` status.

### Step 7.5 — Verify the Application

```bash
# Test the Nginx gateway
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost/

# Test auth service health
curl -s http://localhost/api/auth/health

# Test from your browser
# Open: http://3.110.45.200
```

### Step 7.6 — Check Logs if Something Is Wrong

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f auth-service
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f frontend
```

---

## Phase 8: Trigger the Full CI/CD Pipeline

### Step 8.1 — Push Your Code to GitHub

From your local Mac terminal:

```bash
cd "/Volumes/My Files/Projects/KMC"

# Stage all changes
git add -A

# Commit
git commit -m "feat: add CI/CD pipelines with GitHub Actions and Jenkins"

# Push to main
git push origin main
```

### Step 8.2 — Watch GitHub Actions CI Run

1. Go to `https://github.com/chandu7313/KMC/actions`.
2. You should see a **CI Pipeline** workflow running.
3. Click on it to see the three parallel jobs:
   - 🎨 **Frontend Lint & Build** — runs `npm run lint` and `npm run build`
   - 🧪 **Backend Tests** — runs `npm test --workspaces`
   - 🐳 **Docker Build Check** — validates compose config and smoke-builds key images
4. Wait for all jobs to pass (green checkmarks ✅).

### Step 8.3 — Watch Jenkins CD Run

1. Go to `http://3.110.45.200:8080`.
2. Navigate to the `KMC-Deploy` pipeline.
3. The GitHub webhook should have triggered a build automatically.
4. Click on the running build to see the console output.
5. Watch each stage execute:

   ```
   ✅ Checkout
   ✅ Install & Test Backend
   ✅ Build Frontend
   ✅ Build Docker Images
   ✅ Deploy to AWS
   ✅ Health Check
   ```

6. Once completed, verify the application is live at `http://3.110.45.200`.

---

## Phase 9: Domain & SSL Setup (Production)

### Step 9.1 — Point Your Domain to EC2

1. Go to your domain registrar (GoDaddy, Namecheap, Route53, etc.).
2. Add/update DNS records:

   | Type | Name | Value |
   |------|------|-------|
   | A | `@` | `3.110.45.200` |
   | A | `www` | `3.110.45.200` |

3. Wait for DNS propagation (5–30 minutes).

### Step 9.2 — Install Certbot for SSL

SSH into EC2:

```bash
sudo apt install -y certbot

# Stop Nginx container temporarily to free port 80
cd /opt/kmc/microservices
docker compose -f docker-compose.prod.yml stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d kissanmithar.com -d www.kissanmithar.com

# Copy certificates to Nginx SSL directory
sudo cp /etc/letsencrypt/live/kissanmithar.com/fullchain.pem /opt/kmc/microservices/nginx/ssl/
sudo cp /etc/letsencrypt/live/kissanmithar.com/privkey.pem /opt/kmc/microservices/nginx/ssl/
sudo chown -R ubuntu:ubuntu /opt/kmc/microservices/nginx/ssl/

# Restart Nginx
docker compose -f docker-compose.prod.yml start nginx
```

### Step 9.3 — Auto-Renew SSL Certificate

```bash
# Add cron job for auto-renewal
sudo crontab -e
```

Add this line:
```
0 3 1 */2 * certbot renew --pre-hook "cd /opt/kmc/microservices && docker compose -f docker-compose.prod.yml stop nginx" --post-hook "cp /etc/letsencrypt/live/kissanmithar.com/fullchain.pem /opt/kmc/microservices/nginx/ssl/ && cp /etc/letsencrypt/live/kissanmithar.com/privkey.pem /opt/kmc/microservices/nginx/ssl/ && cd /opt/kmc/microservices && docker compose -f docker-compose.prod.yml start nginx"
```

---

## Phase 10: Post-Deployment Operations

### 10.1 — Useful Docker Commands on EC2

```bash
# Check running containers
docker compose -f docker-compose.prod.yml ps

# View real-time logs
docker compose -f docker-compose.prod.yml logs -f

# View logs for a specific service
docker compose -f docker-compose.prod.yml logs -f auth-service

# Restart a single service
docker compose -f docker-compose.prod.yml restart auth-service

# Rebuild and restart a single service
docker compose -f docker-compose.prod.yml up -d --build auth-service

# Stop all containers
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ deletes data)
docker compose -f docker-compose.prod.yml down -v

# Clean up unused Docker resources
docker system prune -f
docker image prune -a -f
```

### 10.2 — Monitor Disk Usage

```bash
# Check overall disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up if running low
docker system prune -a -f --volumes
```

### 10.3 — Set Up Log Rotation

```bash
# Create Docker daemon config for log rotation
sudo nano /etc/docker/daemon.json
```

Paste:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  }
}
```

```bash
sudo systemctl restart docker
```

---

## Quick Reference Cheat Sheet

| Task | Command / Location |
|------|-------------------|
| **SSH into EC2** | `ssh -i kmc-deploy-key.pem ubuntu@3.110.45.200` |
| **View GitHub CI** | `https://github.com/chandu7313/KMC/actions` |
| **View Jenkins CD** | `http://3.110.45.200:8080` |
| **Deploy directory** | `/opt/kmc/microservices` |
| **Compose file** | `docker-compose.prod.yml` |
| **Start services** | `docker compose -f docker-compose.prod.yml up -d` |
| **Stop services** | `docker compose -f docker-compose.prod.yml down` |
| **View all logs** | `docker compose -f docker-compose.prod.yml logs -f` |
| **Rebuild everything** | `docker compose -f docker-compose.prod.yml up -d --build` |
| **Jenkins Credentials** | Manage Jenkins → Credentials → Global |
| **Trigger re-deploy** | Push to `main` branch or click "Build with Parameters" in Jenkins |

---

## Troubleshooting

### "Permission denied" when running Docker commands
```bash
sudo usermod -aG docker $USER
newgrp docker
# If Jenkins: sudo usermod -aG docker jenkins && sudo systemctl restart jenkins
```

### Jenkins build fails at "Deploy to AWS" stage
- Verify the SSH credential ID matches: `kmc-aws-ssh-key`
- Verify the EC2 security group allows SSH from the Jenkins server IP
- Test SSH manually: `ssh -i kmc-deploy-key.pem ubuntu@3.110.45.200`

### Containers keep restarting
```bash
# Check which container is failing
docker compose -f docker-compose.prod.yml ps

# Check its logs
docker compose -f docker-compose.prod.yml logs <service-name>

# Common causes:
# - Missing environment variable in .env
# - Database connection string is wrong
# - Port conflict
```

### "port is already allocated" error
```bash
# Find what's using the port
sudo lsof -i :80
# Kill it or stop the conflicting service
sudo kill <PID>
```

### GitHub webhook not triggering Jenkins
1. Check the webhook delivery log: GitHub → Settings → Webhooks → Recent Deliveries
2. Ensure the Payload URL ends with `/`: `http://3.110.45.200:8080/github-webhook/`
3. Ensure port 8080 is open in the EC2 security group
4. Check Jenkins logs: `sudo journalctl -u jenkins -f`

### Out of disk space
```bash
docker system prune -a -f --volumes
sudo journalctl --vacuum-size=100M
```
