import React from 'react';
import './Administrador.css';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Button } from 'reactstrap';
import CRUDStand from './CRUDStand';
import Login from './Login';
import DancingCat from './DancingCat';
import UserMenu from './UserMenu';

// Componente de React que representa la vista del Administrador.
function Administrador() {
  // Hook de React Router para manejar la navegación entre vistas.
  const navigate = useNavigate();

  // Función para cerrar sesión.
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Volver a la vista anterior
  const handleVolver = () => {
    navigate(-1); 
  };

  // Si no hay un tipo de usuario almacenado en localStorage, muestra el componente Login.
  if (!localStorage.getItem('tipo_usuario')) {
    return <Login />;
  }

  // Si el tipo de usuario no es "administrador", muestra un mensaje de error y un botón para volver.
  if (localStorage.getItem('tipo_usuario') !== 'administrador') {
    return (
      <div className="Administrador">
        {/* El gato está fuera del contenedor */}
        <DancingCat />
        <p className="no-permisos">
          No tienes permisos para ver esta página
        </p>
        <FormGroup className="text-center">
          <button
            className="volver-button"
            onClick={handleVolver}>
            Volver
          </button>
        </FormGroup>
      </div>
    );
  }

  // Si el usuario es un administrador, muestra la interfaz correspondiente.
  return (
    <div className="Administrador">
      <div className="container">
        <h1>¡Hola, administrador!</h1>
        <UserMenu handleLogout={handleLogout} />
        <CRUDStand />
      </div>
    </div>
  );
}

export default Administrador;
