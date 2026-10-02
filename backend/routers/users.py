from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt

from database import get_db
from models import User


router = APIRouter(
    prefix="/users",
    tags=["Usuarios"]
)


# Datos para registrar un usuario
class UserCreate(BaseModel):
    name: str
    email: str
    password: str


# Datos para iniciar sesión
class LoginData(BaseModel):
    email: str
    password: str


# POST /users
@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    # Comprobar si el correo ya existe
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    # Encriptar contraseña
    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=password_hash
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "mensaje": "Usuario creado correctamente",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }


# POST /users/login
@router.post("/login")
def login(user: LoginData, db: Session = Depends(get_db)):

    # Buscar usuario por correo
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos"
        )

    # Comprobar contraseña
    password_correct = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user.password_hash.encode("utf-8")
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos"
        )

    return {
        "mensaje": "Inicio de sesión correcto",
        "id": existing_user.id,
        "name": existing_user.name,
        "email": existing_user.email
    }


# GET /users/{id}
@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }