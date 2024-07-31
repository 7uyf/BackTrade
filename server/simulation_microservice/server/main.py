
from server.app import App
from server.routes.simulation import Router


App.include_router(Router)