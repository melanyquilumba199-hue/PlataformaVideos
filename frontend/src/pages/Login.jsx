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
      // ================================
      // REGISTRO
      // ================================

      try {
        const respuesta = await fetch(
          "http://174.129.85.233:8000/users/",
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
      // ================================
      // LOGIN
      // ================================

      try {
        const respuesta = await fetch(
          "http://174.129.85.233:8000/users/login",
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
          alert(
            datos.detail ||
            "Correo o contraseña incorrectos"
          );

          return;
        }

        // Guardar usuario
        localStorage.setItem(
          "user",
          JSON.stringify(datos)
        );

        alert(`Bienvenida ${datos.name}`);

        // Ir a Home
        navigate("/home");

      } catch (error) {
        alert("No se pudo conectar con FastAPI");
      }
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>
          Plataforma de Videos
        </h1>

        <h2>
          {modoRegistro
            ? "Crear cuenta"
            : "Iniciar sesión"}
        </h2>

        <form onSubmit={manejarSubmit}>

          {/* NOMBRE */}

          {modoRegistro && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              required
            />
          )}

          {/* CORREO */}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          {/* CONTRASEÑA */}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {/* BOTÓN */}

          <button type="submit">
            {modoRegistro
              ? "Registrarse"
              : "Iniciar sesión"}
          </button>

        </form>

        {/* CAMBIAR ENTRE LOGIN Y REGISTRO */}

        <button
          className="secondary-button"
          onClick={() =>
            setModoRegistro(!modoRegistro)
          }
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