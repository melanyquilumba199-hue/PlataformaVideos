import { Link } from "react-router-dom";

function Auth() {
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

      <label>Nombre</label>
      <br />
      <input type="text" placeholder="Nombre" />

      <br />
      <br />

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

      <button>Registrarse</button>
    </div>
  );
}

export default Auth;