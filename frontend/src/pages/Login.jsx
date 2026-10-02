import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [modoRegistro, setModoRegistro] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (modoRegistro) {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/users/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: nombre,
              email: email,
              password: password,
            }),
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          alert(datos.detail || "Error al registrarse");
          return;
        }

        alert("Usuario registrado correctamente");

        setModoRegistro(false);
        setNombre("");
        setEmail("");
        setPassword("");

      } catch (error) {
        alert("No se pudo conectar con FastAPI");
      }

    } else {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          alert(datos.detail || "Correo o contraseña incorrectos");
          return;
        }

        alert(`Bienvenida ${datos.name}`);

        localStorage.setItem("user", JSON.stringify(datos));

        // Ir a la página principal
        navigate("/home");

      } catch (error) {
        alert("No se pudo conectar con FastAPI");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Plataforma de Videos</h1>

        <h2>
          {modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <form onSubmit={manejarSubmit}>

          {modoRegistro && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {modoRegistro ? "Registrarse" : "Iniciar sesión"}
          </button>

        </form>

        <button
          className="secondary-button"
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro
            ? "Ya tengo una cuenta"
            : "Crear una cuenta"}
        </button>

      </div>
    </div>
  );
}

export default Login;