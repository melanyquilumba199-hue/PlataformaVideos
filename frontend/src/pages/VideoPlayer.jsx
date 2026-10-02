import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerVideo,
  obtenerComentarios,
  crearComentario,
} from "../services/api";

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargando, setCargando] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarVideo();
    cargarComentarios();
  }, [id]);

  const cargarVideo = async () => {
    try {
      const datos = await obtenerVideo(id);
      setVideo(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const datos = await obtenerComentarios(id);
      setComentarios(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();

    if (!nuevoComentario.trim()) {
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    try {
      await crearComentario(id, {
        content: nuevoComentario,
        user_id: usuario.id,
      });

      setNuevoComentario("");

      await cargarComentarios();

    } catch (error) {
      alert(error.message);
    }
  };

  if (cargando) {
    return <p>Cargando video...</p>;
  }

  if (!video) {
    return <p>No se encontró el video.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/home")}>
        ← Volver
      </button>

      <h1>{video.title}</h1>

      <p>{video.description}</p>

      <p>
        Vistas: {video.views}
      </p>

      <p>
        Usuario: {video.user_id}
      </p>

      <h2>Video</h2>

      <iframe
        width="800"
        height="450"
        src={video.video_url
          .replace(
            "https://youtu.be/",
            "https://www.youtube.com/embed/"
          )
          .split("?")[0]}
        title={video.title}
        allowFullScreen
      ></iframe>

      <h2>Comentarios</h2>

      <form onSubmit={enviarComentario}>
        <input
          type="text"
          placeholder="Escribe un comentario"
          value={nuevoComentario}
          onChange={(e) =>
            setNuevoComentario(e.target.value)
          }
        />

        <button type="submit">
          Comentar
        </button>
      </form>

      <br />

      {comentarios.length === 0 ? (
        <p>No hay comentarios todavía.</p>
      ) : (
        <div>
          {comentarios.map((comentario) => (
            <div key={comentario.id}>
              <p>
                <strong>Usuario {comentario.user_id}:</strong>{" "}
                {comentario.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;