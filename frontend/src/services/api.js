const API_URL = "http://127.0.0.1:8000";

// =========================
// USUARIOS
// =========================

export async function registrarUsuario(usuario) {
  const respuesta = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail || "No se pudo registrar el usuario"
    );
  }

  return datos;
}


export async function iniciarSesion(datos) {
  const respuesta = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.detail || "Correo o contraseña incorrectos"
    );
  }

  return resultado;
}


// =========================
// VIDEOS
// =========================

export async function obtenerVideos() {
  const respuesta = await fetch(`${API_URL}/videos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los videos");
  }

  return await respuesta.json();
}


export async function obtenerVideo(id) {
  const respuesta = await fetch(
    `${API_URL}/videos/${id}`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el video");
  }

  return await respuesta.json();
}


// =========================
// COMENTARIOS
// =========================

export async function obtenerComentarios(videoId) {
  const respuesta = await fetch(
    `${API_URL}/videos/${videoId}/comments`
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron obtener los comentarios"
    );
  }

  return await respuesta.json();
}


export async function crearComentario(videoId, comentario) {
  const respuesta = await fetch(
    `${API_URL}/videos/${videoId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comentario),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail || "No se pudo crear el comentario"
    );
  }

  return datos;
}