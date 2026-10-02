from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import shutil

from database import get_db
from models import Video, User


router = APIRouter(
    prefix="/videos",
    tags=["Videos"]
)


# ==========================================
# CONFIGURACIÓN DE ARCHIVOS
# ==========================================

CARPETA_VIDEOS = "uploads/videos"
CARPETA_MINIATURAS = "uploads/thumbnails"

os.makedirs(CARPETA_VIDEOS, exist_ok=True)
os.makedirs(CARPETA_MINIATURAS, exist_ok=True)


# ==========================================
# DATOS PARA ACTUALIZAR UN VIDEO
# ==========================================

class VideoUpdate(BaseModel):
    title: str
    description: str | None = None
    thumbnail_url: str | None = None


# ==========================================
# POST /videos/
# CREAR VIDEO CON ARCHIVO .MP4
# ==========================================

@router.post("/")
async def create_video(
    title: str = Form(...),
    description: str | None = Form(None),
    user_id: int = Form(...),
    video: UploadFile = File(...),
    thumbnail: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):

    # Comprobar que el usuario existe
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Comprobar que sea un MP4
    if video.content_type != "video/mp4":
        raise HTTPException(
            status_code=400,
            detail="El video debe ser un archivo .mp4"
        )

    # Nombre del archivo de video
    nombre_video = video.filename

    ruta_video = os.path.join(
        CARPETA_VIDEOS,
        nombre_video
    )

    # Guardar video
    with open(ruta_video, "wb") as archivo:
        shutil.copyfileobj(video.file, archivo)

    # ==========================================
    # GUARDAR MINIATURA
    # ==========================================

    ruta_miniatura = None

    if thumbnail:

        if thumbnail.content_type not in [
            "image/jpeg",
            "image/png"
        ]:
            raise HTTPException(
                status_code=400,
                detail="La miniatura debe ser JPG o PNG"
            )

        nombre_miniatura = thumbnail.filename

        ruta_miniatura = os.path.join(
            CARPETA_MINIATURAS,
            nombre_miniatura
        )

        with open(ruta_miniatura, "wb") as archivo:
            shutil.copyfileobj(
                thumbnail.file,
                archivo
            )

    # ==========================================
    # GUARDAR EN BASE DE DATOS
    # ==========================================

    new_video = Video(
        title=title,
        description=description,
        video_url=ruta_video,
        thumbnail_url=ruta_miniatura,
        user_id=user_id
    )

    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return {
        "mensaje": "Video creado correctamente",
        "id": new_video.id,
        "title": new_video.title,
        "description": new_video.description,
        "video_url": new_video.video_url,
        "thumbnail_url": new_video.thumbnail_url,
        "views": new_video.views,
        "user_id": new_video.user_id
    }


# ==========================================
# GET /videos/
# ==========================================

@router.get("/")
def get_videos(db: Session = Depends(get_db)):

    videos = db.query(Video).all()

    resultado = []

    for video in videos:
        resultado.append({
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "views": video.views,
            "user_id": video.user_id,
            "user_name": video.user.name
        })

    return resultado


# ==========================================
# GET /videos/{id}
# ==========================================

@router.get("/{video_id}")
def get_video(
    video_id: int,
    db: Session = Depends(get_db)
):

    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    # Aumentar vistas
    video.views += 1

    db.commit()
    db.refresh(video)

    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "video_url": video.video_url,
        "thumbnail_url": video.thumbnail_url,
        "views": video.views,
        "user_id": video.user_id,
        "user_name": video.user.name
    }


# ==========================================
# PUT /videos/{id}
# ==========================================

@router.put("/{video_id}")
def update_video(
    video_id: int,
    video_data: VideoUpdate,
    db: Session = Depends(get_db)
):

    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    video.title = video_data.title
    video.description = video_data.description
    video.thumbnail_url = video_data.thumbnail_url

    db.commit()
    db.refresh(video)

    return {
        "mensaje": "Video actualizado correctamente",
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "thumbnail_url": video.thumbnail_url
    }


# ==========================================
# DELETE /videos/{id}
# ==========================================

@router.delete("/{video_id}")
def delete_video(
    video_id: int,
    db: Session = Depends(get_db)
):

    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    db.delete(video)
    db.commit()

    return {
        "mensaje": "Video eliminado correctamente"
    }