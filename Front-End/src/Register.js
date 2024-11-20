import React, { useState } from 'react';
import './Register.css';
import './Login.js'
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';
import DancingCat from './DancingCat';

function Register() {
  const [noCuenta, setNoCuenta] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const navigate = useNavigate();

  const datosValidos = () => {
    let errors = {};
    let isValid = true;

    // Validación del número de cuenta
    if (!noCuenta) {
      isValid = false;
      errors["noCuenta"] = "Por favor ingresa tu número de cuenta.";
    }else if (noCuenta.length !== 9 || noCuenta < 0 || noCuenta % 1 !== 0) {
      isValid = false;
      errors["noCuenta"] = "Formato de no. de cuenta no válido.";
    }

    // Validación del nombre
    if (!nombre) {
      isValid = false;
      errors["nombre"] = "Por favor ingresa tu nombre.";
    }

    // Validación del apellido
    if (!apellido) {
      isValid = false;
      errors["apellido"] = "Por favor ingresa tu apellido.";
    }

    // Validación del correo
    if (!correo) {
      isValid = false;
      errors["correo"] = "Por favor ingresa tu correo.";
    } else {
      if (typeof correo !== "undefined") {
        let lastAtPos = correo.lastIndexOf('@');
        let lastDotPos = correo.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && correo.indexOf('@@') === -1 && lastDotPos > 2 && (correo.length - lastDotPos) > 2)) {
          isValid = false;
          errors["correo"] = "Correo inválido.";
        }
      }
    }

    // Validación de la contraseña
    if (!contrasena) {
      isValid = false;
      errors["contrasena"] = "Por favor ingresa tu contraseña.";
    } else if (contrasena.length < 8) {
      isValid = false;
      errors["contrasena"] = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(errors);
    return isValid;
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!datosValidos()) {
      return;
    }
    // Aquí puedes enviar los datos al servidor para el registro
    const datosRegistro = {
      noCuenta, 
      nombre,
      apellido,
      correo,
      password: contrasena,
      noStand: null
    };

    console.log('Datos de registro:', datosRegistro);
    // Luego, puedes realizar una solicitud al servidor para manejar el registro.
    try {
      // Realizar una solicitud al servidor para manejar el registro.
      const res = await fetch(`http://127.0.0.1:5000/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      });
  
      const data = await res.json();
      console.log(data);
      // Verificar si el registro fue exitoso
      if (data.message === 'Registro exitoso') {        
        localStorage.setItem('noCuenta', noCuenta); 
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('email', correo);
        localStorage.setItem('contrasena', contrasena);           
        
        openWelcomeModal();
        // Redirigir a la vista EditProfile
        
      } else if (data.error === 'Error, correo asociado a otra cuenta.') {
        setErrors({ correo: data.error });
      } else if (data.error === 'Error, número de cuenta asociado a otro usuario.') {
        setErrors({ noCuenta: data.error });
      } else if (data.error) {
        // Mostrar el error en el modal
        setErrorMessage(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        // Error de conexión rechazada (servidor no disponible)
        console.error('Error: El servidor no está disponible');
        // Mostrar el error en el modal
        setErrorMessage('Error: El servidor no está disponible, intenta más tarde');
        setIsErrorModalOpen(true);
      } else {
        // Otro tipo de error
        console.error('Error al enviar datos al servidor:', error);
        // Mostrar el error en el modal
        setErrorMessage('Error en el servidor, intenta más tarde');
        setIsErrorModalOpen(true);
      }
    }
  }; 
  
  const openWelcomeModal = () => {
    setWelcomeModalOpen(true);
    // Configura el temporizador para cerrar el modal después de 3.5 segundos
    setTimeout(() => {
      setWelcomeModalOpen(false);
      // Realiza la navegación hacia la vista de editar perfil
      localStorage.setItem('tipo_usuario', 'participante');           
      navigate('/editarPerfil'); // Asegúrate de cambiar la ruta según tu configuración      
    }, 3500);
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleClick = () => {
    navigate('/'); // Navegar hacia atrás
  };

  const handleVolver = () => {
    navigate(-1); // Volver a la vista anterior
  };
  
  if (localStorage.getItem('tipo_usuario')) {
    return (
      <div>
        <DancingCat />
        <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
          Para registrar un nuevo usuario, debes cerrar sesión primero
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
    <div className="registro">
      <h1>Registro</h1>
      <form onSubmit={handleRegistro}>
      <FormGroup>
          <Label for="noCuenta">No. de cuenta:</Label>
          <Input
            type="number"
            id="noCuenta"
            name="noCuenta"
            value={noCuenta}
            onChange={(e) => setNoCuenta(e.target.value)}
            required
          />
          {errors.noCuenta && <div className="alert alert-danger">{errors.noCuenta}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="nombre">Nombre:</Label>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          {errors.nombre && <div className="alert alert-danger">{errors.nombre}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="apellido">Apellido:</Label>
          <Input
            type="text"
            id="apellido"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          {errors.apellido && <div className="alert alert-danger">{errors.apellido}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="correo">Correo:</Label>
          <Input
            type="email"
            id="correo"
            name="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          {errors.correo && <div className="alert alert-danger">{errors.correo}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="contrasena">Contraseña:</Label>
          <Input
            type="password"
            id="contrasena"
            name="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          {errors.contrasena && <div className="alert alert-danger">{errors.contrasena}</div>}
        </FormGroup>

        <ul>
          <li>
            <Button color="primary" onClick={handleRegistro}>
              Registrar
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={handleClick}>
              Volver al inicio
            </Button>
          </li>
        </ul>
      </form>

      <Modal isOpen={welcomeModalOpen} toggle={() => setWelcomeModalOpen(false)}>
        <ModalHeader toggle={() => setWelcomeModalOpen(false)}>¡Bienvenido!</ModalHeader>
          <ModalBody>
            <p>El registro fue exitoso, te damos la bienvenida. Por favor, espera ...</p>
          </ModalBody>
      </Modal>

      {isErrorModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;