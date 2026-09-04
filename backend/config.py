import os
from pathlib import Path
from dotenv import load_dotenv

# Search for env files in backend dir and project root dir
_backend_dir = Path(__file__).resolve().parent
for _p in [_backend_dir / ".env", _backend_dir / "env", _backend_dir.parent / ".env", _backend_dir.parent / "env"]:
    if _p.is_file():
        load_dotenv(dotenv_path=_p)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "resq_lanka_db")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]
