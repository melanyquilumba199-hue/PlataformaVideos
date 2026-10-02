import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateVideo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("user"));

  const publicarVideo = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión");
      navigate("/");
      return;
    }

    if (!video) {
      alert("Selecciona un video .mp4");
      return;
    }

    try {
      const formulario = new FormData();

      formulario.append("title", title);
      formulario.append("description", description);
      formulario.append("video", video);

      if (thumbnail) {
        formulario.append("thumbnail", thumbnail);
      }

      formulario.append("user_id", usuario.id);

      // Por ahora solo comprobamos que los datos estén preparados.
      console.log("Video:", video);
      console.log("Miniatura:", thumbnail);
      console.log("Título:", title);
      console.log("Descripción:", description);
      console.log("Usuario:", usuario.id);

      alert("El archivo está listo para enviarse a FastAPI");

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/home")}>
        ← Volver
      </button>

      <h1>Publicar video</h1>

      <form onSubmit={publicarVideo}>
        <label>Título</label>
        <br />

        <input
          type="text"
          placeholder="Título del video"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Descripción</label>
        <br />

        <textarea
          placeholder="Descripción del video"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Video (.mp4)</label>
        <br />

        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />

        <br />
        <br />

        <label>Miniatura</label>
        <br />

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <br />
        <br />

        <button type="submit">
          Preparar video
        </button>
      </form>
    </div>
  );
}

export default CreateVideo;