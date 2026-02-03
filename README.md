# Portfolio Manager

Full-stack demo for tracking a personal portfolio with login, holdings management, and a visual allocation chart.

## Run locally

```bash
uv sync
uv run -- uvicorn app.main:app --reload --port 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment (production)

The application is a FastAPI server that serves both the API and the static UI from the same process. The production setup below uses a dedicated virtual environment, `gunicorn` with `uvicorn` workers, and `systemd` + `nginx` for process management and reverse proxying.

### Prerequisites

- Python 3.10+
- A Linux host with `systemd`
- (Optional but recommended) `nginx` for TLS termination and reverse proxying

### 1. Prepare the server

```bash
sudo useradd --system --create-home --shell /bin/bash portfolio
sudo mkdir -p /opt/portfolio-manager
sudo chown -R portfolio:portfolio /opt/portfolio-manager
```

### 2. Deploy the code

```bash
sudo -u portfolio git clone <your-repo-url> /opt/portfolio-manager
cd /opt/portfolio-manager
```

### 3. Install dependencies with uv

```bash
sudo -u portfolio uv venv /opt/portfolio-manager/.venv
sudo -u portfolio /opt/portfolio-manager/.venv/bin/uv sync
sudo -u portfolio /opt/portfolio-manager/.venv/bin/uv pip install gunicorn
```

### 4. Start with gunicorn (recommended)

Run the app on an internal port (e.g., `8000`) and let `nginx` handle public traffic.

```bash
sudo -u portfolio /opt/portfolio-manager/.venv/bin/uv run -- gunicorn \
  -k uvicorn.workers.UvicornWorker \
  -w 2 \
  -b 127.0.0.1:8000 \
  app.main:app
```

### 5. Configure systemd

Create `/etc/systemd/system/portfolio-manager.service`:

```ini
[Unit]
Description=Portfolio Manager API
After=network.target

[Service]
Type=simple
User=portfolio
Group=portfolio
WorkingDirectory=/opt/portfolio-manager
Environment="PYTHONUNBUFFERED=1"
ExecStart=/opt/portfolio-manager/.venv/bin/uv run -- gunicorn \
  -k uvicorn.workers.UvicornWorker \
  -w 2 \
  -b 127.0.0.1:8000 \
  app.main:app
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-manager
sudo systemctl status portfolio-manager
```

### 6. Configure nginx

Create `/etc/nginx/sites-available/portfolio-manager`:

```nginx
server {
    listen 80;
    server_name your-domain.example;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and reload:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio-manager /etc/nginx/sites-enabled/portfolio-manager
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Data persistence and backups

- The SQLite database is stored at `portfolio.db` in the repository root. Ensure the `portfolio` user has read/write access.
- Back up the database regularly:

```bash
sudo -u portfolio sqlite3 /opt/portfolio-manager/portfolio.db ".backup /opt/portfolio-manager/backups/portfolio-$(date +%F).db"
```

### 8. Health check

Use `/healthz` to verify the service is up:

```bash
curl http://127.0.0.1:8000/healthz
```

## Notes

- Data is stored in a local SQLite database (`portfolio.db`) through SQLAlchemy ORM.
- Sessions are stored server-side in SQLite with a 7-day TTL.
- Holding names are normalized and treated as case-insensitive per user to avoid duplicate tickers.
- Portfolio filters are cached in the browser for quick reloads.
