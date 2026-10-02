import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerVideos } from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarVideos();
  }, []);

  const cargarVideos = async () => {
    try {
      const datos = await obtenerVideos();
      setVideos(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <header>
        <h1>Plataforma de Videos</h1>

        <nav>
          <button onClick={() => navigate("/home")}>
            Inicio
          </button>

          <button onClick={() => navigate("/profile")}>
            Mi perfil
          </button>

          <button onClick={() => navigate("/create-video")}>
            Publicar video
          </button>

          <button onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main>
        <h2>Videos</h2>

        {usuario && <p>Bienvenida, {usuario.name}</p>}

        {cargando ? (
          <p>Cargando videos...</p>
        ) : videos.length === 0 ? (
          <p>No hay videos disponibles todavía.</p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div className="video-card" key={video.id}>
                
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                ) : (
                  <div className="thumbnail-placeholder">
                    Sin miniatura
                  </div>
                )}

                <h3>{video.title}</h3>

                <p>{video.description}</p>

                <p>
                  <strong>Vistas:</strong> {video.views}
                </p>

                <button
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  Ver video
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;