import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import "./Login.css";
import DancingCat from './DancingCat';

// Componente principal para el formulario de inicio de sesión.
// Permite a los usuarios autenticarse, redirigir a diferentes rutas según su rol y gestionar errores de validación.
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Función que valida los datos ingresados en el formulario.
  // Comprueba si el correo tiene un formato válido y si la contraseña cumple los requisitos mínimos.
  const datosValidos = () => {
    let errors = {};
    let isValid = true;

    if (!email) {
      isValid = false;
      errors["email"] = "Por favor ingresa tu correo.";
    } else {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        isValid = false;
        errors["email"] = "Correo inválido.";
      }
    }

    if (!password) {
      isValid = false;
      errors["password"] = "Por favor ingresa tu contraseña.";
    } else if (password.length < 8) {
      isValid = false;
      errors["password"] = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(errors);
    return isValid;
  }

  // Función asincrónica para manejar el inicio de sesión.
  // Realiza una solicitud al servidor para autenticar al usuario y redirige según el tipo de usuario.
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!datosValidos()) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.error === 'Ese correo no existe') {
        alert('Correo no existente');
      } else if (data.error === 'Contraseña incorrecta') {
        alert('Contraseña incorrecta');
      } else if (data.error === 'Ninguno') {
        localStorage.setItem('tipo_usuario', data.tipo_usuario);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('apellido', data.apellido);
        localStorage.setItem('email', data.email);
        localStorage.setItem('noCuenta', data.noCuenta);

        if (data.tipo_usuario === 'participante') navigate('/participante');
        else if (data.tipo_usuario === 'superadmin') navigate('/superadmin');
        else if (data.tipo_usuario === 'administrador') navigate('/administrador');
      }
    } catch (error) {
      console.error(error);
      alert('Error en el servidor, intenta más tarde');
    }
  };

   // Funciiones para redirigir al usuario a las páginas adecuadas.
  const handleRegistrar = () => navigate('/registrar');
  const handleVolver = () => navigate(-1);

  //Render del componente principal.
  if (localStorage.getItem('tipo_usuario')) {
    return (
      <div>
        <DancingCat />
        <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
          Ya tienes una sesión iniciada
        </p>
        <FormGroup className="text-center">
          <Button style={{ width: '200px' }} color="primary" onClick={handleVolver}>
            Volver
          </Button>
        </FormGroup>
      </div>
    );
  }

  return (
    <div className="Login">
      <div className="left-container">
        {/* Puedes agregar contenido aquí si es necesario */}
      </div>
      <div className="right-container">
        <h1>Bienvenido</h1>
        <form>
          <FormGroup>
            <Label for="email">Dirección de email:</Label>
            <Input
              type="email"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="alert alert-danger">{errors.email}</div>}
          </FormGroup>

          <FormGroup>
            <Label for="password">Contraseña:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="alert alert-danger">{errors.password}</div>}
          </FormGroup>

          <nav>
            <ul>
              <li>
                <button onClick={handleLogin}>Iniciar sesión</button>
              </li>
              <li>
                <button onClick={handleRegistrar}>Registrar nuevo usuario</button>
              </li>
            </ul>
          </nav>
        </form>
      </div>
    </div>
  );
}

export default Login;
