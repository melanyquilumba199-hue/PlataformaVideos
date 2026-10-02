import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateVideo() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [video, setVideo] = useState(null);
  const [miniatura, setMiniatura] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function publicarVideo(e) {
    e.preventDefault();

    setMensaje("");

    const usuarioGuardado = localStorage.getItem("user");

    if (!usuarioGuardado) {
      setMensaje("Debes iniciar sesión para publicar un video.");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (!video) {
      setMensaje("Selecciona un video.");
      return;
    }

    const formulario = new FormData();

    formulario.append("title", titulo);
    formulario.append("description", descripcion);
    formulario.append("user_id", usuario.id);
    formulario.append("video", video);

    if (miniatura) {
      formulario.append("thumbnail", miniatura);
    }

    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://174.129.85.233:8000/videos/",
        {
          method: "POST",
          body: formulario,
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          datos.detail || "No se pudo publicar el video."
        );
        return;
      }

      setMensaje("Video publicado correctamente.");

      setTitulo("");
      setDescripcion("");
      setVideo(null);
      setMiniatura(null);

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      setMensaje("No se pudo conectar con FastAPI.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h1>Publicar video</h1>

      <form onSubmit={publicarVideo}>

        <div>
          <label>Título</label>
          <br />

          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del video"
            required
          />
        </div>

        <br />

        <div>
          <label>Descripción</label>
          <br />

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del video"
            rows="5"
          />
        </div>

        <br />

        <div>
          <label>Video</label>
          <br />

          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
        </div>

        <br />

        <div>
          <label>Miniatura</label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMiniatura(e.target.files[0])}
          />
        </div>

        <br />

        <button type="submit" disabled={cargando}>
          {cargando ? "Publicando..." : "Publicar video"}
        </button>

      </form>

      {mensaje && (
        <p>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default CreateVideo;