import { useState } from "react";
import { Link } from "react-router-dom";
import { registrarUsuario } from "../services/api";

function Auth() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function manejarRegistro(e) {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      const usuario = await registrarUsuario({
        name: nombre,
        email: correo,
        password: contrasena,
      });

      setMensaje("Usuario registrado correctamente");

      console.log("Usuario creado:", usuario);

      setNombre("");
      setCorreo("");
      setContrasena("");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>Plataforma de Videos</h1>

      <h2>Iniciar sesión</h2>

      <label>Correo</label>
      <br />
      <input type="email" placeholder="Correo" />

      <br />
      <br />

      <label>Contraseña</label>
      <br />
      <input type="password" placeholder="Contraseña" />

      <br />
      <br />

      <Link to="/login">
        <button>Iniciar sesión</button>
      </Link>

      <hr />

      <h2>Crear una cuenta</h2>

      <form onSubmit={manejarRegistro}>
        <label>Nombre</label>
        <br />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Correo</label>
        <br />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Contraseña</label>
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      {error && <p>{error}</p>}
    </div>
  );
}

export default Auth;
