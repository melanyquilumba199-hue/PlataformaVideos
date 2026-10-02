from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models

from routers import users, videos, comments


# Crear las tablas
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Plataforma de Videos",
    description="API para una plataforma de videos",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Registrar routers
app.include_router(users.router)
app.include_router(videos.router)
app.include_router(comments.router)


@app.get("/")
def inicio():
    return {
        "mensaje": "API de Plataforma de Videos funcionando"
    }


@app.get("/health")
def health():
    return {
        "estado": "OK"
    }