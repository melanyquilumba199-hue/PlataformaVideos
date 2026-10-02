import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  obtenerVideo,
  obtenerComentarios,
  crearComentario,
} from "../services/api";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  const [comentario, setComentario] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarVideo();
    cargarComentarios();
  }, [id]);

  async function cargarVideo() {
    try {
      const datos = await obtenerVideo(id);
      setVideo(datos);
    } catch (error) {
      setError(error.message);
    }
  }

  async function cargarComentarios() {
    try {
      const datos = await obtenerComentarios(id);
      setComentarios(datos);
    } catch (error) {
      console.log(error);
    }
  }

  async function publicarComentario(e) {
    e.preventDefault();

    setMensaje("");

    if (!comentario.trim()) {
      setMensaje("Escribe un comentario.");
      return;
    }

    // Obtener usuario que inició sesión
    const usuarioGuardado = localStorage.getItem("user");

    if (!usuarioGuardado) {
      setMensaje("Debes iniciar sesión para comentar.");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    try {
      const nuevoComentario = await crearComentario(id, {
        content: comentario,
        user_id: usuario.id,
      });

      setComentarios((comentariosActuales) => [
        ...comentariosActuales,
        nuevoComentario,
      ]);

      setComentario("");

      setMensaje(
        "Comentario publicado correctamente."
      );

    } catch (error) {
      setMensaje(error.message);
    }
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <Link to="/home">
          ← Volver
        </Link>
      </div>
    );
  }

  if (!video) {
    return <p>Cargando video...</p>;
  }

  return (
    <div>

      <Link to="/home">
        ← Volver
      </Link>

      <h1>{video.title}</h1>

      <p>{video.description}</p>

      <p>
        Vistas: {video.views}
      </p>

      <p>
        Usuario: {video.user_id}
      </p>

      <h2>Video</h2>

      <video
        controls
        width="800"
        src={video.video_url}
      >
        Tu navegador no puede reproducir este video.
      </video>

      <h2>Comentarios</h2>

      <form onSubmit={publicarComentario}>

        <textarea
          value={comentario}
          onChange={(e) =>
            setComentario(e.target.value)
          }
          placeholder="Escribe un comentario..."
          rows="4"
          cols="50"
        />

        <br />

        <button type="submit">
          Publicar comentario
        </button>

      </form>

      {mensaje && (
        <p>
          {mensaje}
        </p>
      )}

      <hr />

      {comentarios.length === 0 ? (
        <p>
          No hay comentarios todavía.
        </p>
      ) : (
        comentarios.map((comentario) => (
          <div key={comentario.id}>

            <p>
              <strong>
                {comentario.user_name}
              </strong>
            </p>

            <p>
              {comentario.content}
            </p>

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default VideoPlayer;