from app import app

from routes.simulation import router as simulationRouter


app.include_router(simulationRouter)