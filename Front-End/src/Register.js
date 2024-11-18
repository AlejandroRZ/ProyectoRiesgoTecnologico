import React, { useState } from 'react';
import './Register.css';
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

    if (!noCuenta) {
      isValid = false;
      errors["noCuenta"] = "Por favor ingresa tu número de cuenta.";
    } else if (noCuenta.length !== 9 || noCuenta < 0 || noCuenta % 1 !== 0) {
      isValid = false;
      errors["noCuenta"] = "Formato de no. de cuenta no válido.";
    }

    if (!nombre) {
      isValid = false;
      errors["nombre"] = "Por favor ingresa tu nombre.";
    }

    if (!apellido) {
      isValid = false;
      errors["apellido"] = "Por favor ingresa tu apellido.";
    }

    if (!correo) {
      isValid = false;
      errors["correo"] = "Por favor ingresa tu correo.";
    } else {
      let lastAtPos = correo.lastIndexOf('@');
      let lastDotPos = correo.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && correo.indexOf('@@') === -1 && lastDotPos > 2 && (correo.length - lastDotPos) > 2)) {
        isValid = false;
        errors["correo"] = "Correo inválido.";
      }
    }

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

    const datosRegistro = {
      noCuenta,
      nombre,
      apellido,
      correo,
      password: contrasena,
    };

    try {
      const res = await fetch(`http://127.0.0.1:5000/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      });

      const data = await res.json();
      if (data.message === 'Registro exitoso') {
        localStorage.setItem('noCuenta', noCuenta);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('email', correo);
        localStorage.setItem('contrasena', contrasena);

        openWelcomeModal();
      } else if (data.error) {
        setErrors({ [data.field]: data.error });
        setErrorMessage(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage('Error en el servidor, intenta más tarde');
      setIsErrorModalOpen(true);
    }
  };

  const openWelcomeModal = () => {
    setWelcomeModalOpen(true);
    setTimeout(() => {
      setWelcomeModalOpen(false);
      localStorage.setItem('tipo_usuario', 'participante');
      navigate('/editarPerfil');
    }, 3500);
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  if (localStorage.getItem('tipo_usuario')) {
    return (
      <div>
        <DancingCat />
        <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
          Para registrar un nuevo usuario, debes cerrar sesión primero.
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
    <div className="registro-page">
      <div className="registro">
        <h1>Registro</h1>
        <form onSubmit={handleRegistro}>
          <FormGroup>
            <Label for="noCuenta">No. de cuenta:</Label>
            <Input
              type="number"
              id="noCuenta"
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
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            {errors.contrasena && <div className="alert alert-danger">{errors.contrasena}</div>}
          </FormGroup>

          <Button color="primary" type="submit" style={{ marginRight: '10px' }}>
            Registrar
          </Button>
          <Button color="secondary" type="button" onClick={handleVolver}>
            Volver
          </Button>
        </form>

        <Modal isOpen={welcomeModalOpen} toggle={() => setWelcomeModalOpen(false)}>
          <ModalHeader toggle={() => setWelcomeModalOpen(false)}>¡Bienvenido!</ModalHeader>
          <ModalBody>El registro fue exitoso. Por favor, espera...</ModalBody>
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
    </div>
  );
}

export default Register;
