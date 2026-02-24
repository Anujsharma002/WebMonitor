# EC2 Deployment Guide with Nginx - WebMonitor

This guide provides step-by-step instructions to deploy WebMonitor on AWS EC2 using a production-ready **Nginx reverse proxy** setup.

## 1. Prepare your EC2 Instance

1. **OS**: Ubuntu 22.04 LTS.
2. **Security Group**:
   - **SSH (22)**: Allow from your IP.
   - **HTTP (80)**: Allow from anywhere.

## 2. Server Setup (Docker)

Connect to your EC2 and run:

```bash
# Update and Install Docker
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt-get install -y docker-compose-v2
exit # Log out to apply permissions
```

## 3. Deployment Steps

1. **Clone & Setup**:
   ```bash
   git clone https://github.com/Anujsharma002/WebMonitor.git
   cd WebMonitor
   nano .env # Add GROQ_API_KEY=your_key
   ```

2. **Nginx Configuration**:
   The project is pre-configured with `nginx/default.conf` and a multi-container `docker-compose.yml`.

3. **Deploy**:
   ```bash
   docker compose up -d --build
   ```

## 4. Why this setup is "Perfect"?

- **Nginx as Reverse Proxy**: Handles static file serving for the React frontend and proxies API requests to the FastAPI backend.
- **Port 80**: Your app is accessible directly at `http://your-ec2-ip` (standard HTTP port).
- **Separation of Concerns**: Frontend and Backend run in separate containers, making scaling and debugging easier.
- **Production Build**: The React app is compiled into a static build for maximum performance.

## 5. Accessing the Application

- **App**: `http://your-ec2-public-ip`
- **Backend Health**: `http://your-ec2-public-ip/status`

---

### Pro-Tip: SSL with Certbot
To add HTTPS (recommended for production):
1. Point a domain (e.g., `monitor.anuj.com`) to your EC2 IP.
2. Install Certbot on EC2: `sudo apt-get install certbot python3-certbot-nginx`.
3. Run: `sudo certbot --nginx -d yourdomain.com`.
