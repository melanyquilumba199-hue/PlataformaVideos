import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerVideos } from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [editando, setEditando] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarVideos();
  }, []);

  const cargarVideos = async () => {
    try {
      const datos = await obtenerVideos();

      if (usuario) {
        const misVideos = datos.filter(
          (video) => video.user_id === usuario.id
        );

        setVideos(misVideos);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const comenzarEdicion = (video) => {
    setEditando(video.id);
    setTitle(video.title);
    setDescription(video.description || "");
    setVideoUrl(video.video_url);
    setThumbnailUrl(video.thumbnail_url || "");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
  };

  const actualizarVideo = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        `http://174.129.85.233:8000/videos/${editando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(
          datos.detail || "No se pudo actualizar el video"
        );
        return;
      }

      alert("Video actualizado correctamente");

      cancelarEdicion();
      cargarVideos();

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con FastAPI");
    }
  };

  const eliminarVideo = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este video?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://174.129.85.233:8000/videos/${id}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(
          datos.detail || "No se pudo eliminar el video"
        );
        return;
      }

      alert("Video eliminado correctamente");

      cargarVideos();

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con FastAPI");
    }
  };

  if (!usuario) {
    return (
      <div>
        <h1>No has iniciado sesión</h1>

        <button onClick={() => navigate("/")}>
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate("/home")}>
        ← Volver al inicio
      </button>

      <h1>Mi perfil</h1>

      <h2>Información del usuario</h2>

      <p>
        <strong>Nombre:</strong> {usuario.name}
      </p>

      <p>
        <strong>Correo:</strong> {usuario.email}
      </p>

      <h2>Mis videos</h2>

      {videos.length === 0 ? (
        <p>No has publicado videos todavía.</p>
      ) : (
        <div>
          {videos.map((video) => (
            <div key={video.id}>

              {editando === video.id ? (
                <form onSubmit={actualizarVideo}>

                  <h3>Editar video</h3>

                  <label>Título</label>
                  <br />

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    required
                  />

                  <br />
                  <br />

                  <label>Descripción</label>
                  <br />

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows="5"
                    required
                  />

                  <br />
                  <br />

                  <label>URL del video</label>
                  <br />

                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) =>
                      setVideoUrl(e.target.value)
                    }
                    required
                  />

                  <br />
                  <br />

                  <label>URL de la miniatura</label>
                  <br />

                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) =>
                      setThumbnailUrl(e.target.value)
                    }
                  />

                  <br />
                  <br />

                  <button type="submit">
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>

                </form>
              ) : (
                <div>

                  <h3>{video.title}</h3>

                  <p>
                    {video.description}
                  </p>

                  <p>
                    <strong>Vistas:</strong>{" "}
                    {video.views}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/video/${video.id}`)
                    }
                  >
                    Ver video
                  </button>

                  <button
                    onClick={() =>
                      comenzarEdicion(video)
                    }
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarVideo(video.id)
                    }
                  >
                    Eliminar
                  </button>

                </div>
              )}

              <hr />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;