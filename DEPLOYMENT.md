# EC2 Deployment Guide with Nginx - WebMonitor

This guide provides step-by-step instructions to deploy WebMonitor on AWS EC2 using a production-ready **Nginx reverse proxy** setup.

## 1. Prepare your EC2 Instance

1. **OS**: Amazon Linux 2023 or Amazon Linux 2 (Recommended).
2. **Security Group**:
   - **SSH (22)**: Allow from your IP.
   - **HTTP (80)**: Allow from anywhere.

## 2. Server Setup (Docker on Amazon Linux)

Connect to your EC2 and run:

```bash
# Update and Install Docker
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Install Docker Compose (v2)
sudo dnf install -y docker-compose-plugin

# IMPORTANT: Amazon Linux t2.micro has only 1GB RAM. 
# Build may fail without swap space. Let's add 2GB Swap:
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

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
