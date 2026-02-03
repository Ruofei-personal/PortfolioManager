# Portfolio Manager

Full-stack demo for tracking a personal portfolio with login, holdings management, and a visual allocation chart.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Notes

- Data is stored in a local SQLite database (`portfolio.db`) through SQLAlchemy ORM.
- Sessions are stored server-side in SQLite with a 7-day TTL.
- Holding names are normalized and treated as case-insensitive per user to avoid duplicate tickers.
- Portfolio filters are cached in the browser for quick reloads.
