from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Comment, User, Video


router = APIRouter(
    prefix="/videos",
    tags=["Comentarios"]
)


class CommentCreate(BaseModel):
    content: str
    user_id: int


# POST /videos/{video_id}/comments
@router.post("/{video_id}/comments")
def create_comment(
    video_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    # Comprobar que existe el video
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    # Comprobar que existe el usuario
    user = db.query(User).filter(User.id == comment.user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    new_comment = Comment(
        content=comment.content,
        user_id=comment.user_id,
        video_id=video_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {
        "mensaje": "Comentario creado correctamente",
        "id": new_comment.id,
        "content": new_comment.content,
        "user_id": new_comment.user_id,
        "user_name": user.name,
        "video_id": new_comment.video_id,
        "created_at": new_comment.created_at
    }


# GET /videos/{video_id}/comments
@router.get("/{video_id}/comments")
def get_comments(
    video_id: int,
    db: Session = Depends(get_db)
):
    # Comprobar que existe el video
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    comments = (
        db.query(Comment)
        .filter(Comment.video_id == video_id)
        .all()
    )

    resultado = []

    for comment in comments:
        resultado.append({
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "user_name": comment.user.name,
            "video_id": comment.video_id,
            "created_at": comment.created_at
        })

    return resultado