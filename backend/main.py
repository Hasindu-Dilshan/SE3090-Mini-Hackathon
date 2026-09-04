from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from database import db_manager
from seed import seed_database
from routers import gauges, shelters, sos, triage

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db_manager.connect()
    seed_database()
    yield
    # Shutdown
    if db_manager.client:
        db_manager.client.close()

app = FastAPI(
    title='ResQ Lanka Disaster Response & Flood Dispatch API',
    description='Backend API for real-time flood monitoring, shelter directory, and AI distress triage across Sri Lanka.',
    version='1.0.0',
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Allow all for development & hackathon demo ease
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Register routers
app.include_router(gauges.router)
app.include_router(shelters.router)
app.include_router(sos.router)
app.include_router(triage.router)

@app.get('/')
def root():
    return {
        'service': 'ResQ Lanka Disaster Response API',
        'status': 'OPERATIONAL',
        'mongoConnected': db_manager.is_connected_to_mongo,
        'docsUrl': '/docs'
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
