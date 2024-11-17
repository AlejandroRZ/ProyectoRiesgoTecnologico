import React from 'react';
import './Administrador.css';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Button } from 'reactstrap';
import CRUDStand from './CRUDStand';
import Login from './Login';
import DancingCat from './DancingCat';
import UserMenu from './UserMenu';

function Administrador() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleVolver = () => {
    navigate(-1); // Volver a la vista anterior
  };

  if (!localStorage.getItem('tipo_usuario')) {
    return <Login />;
  }

  if (localStorage.getItem('tipo_usuario') !== 'administrador') {
    return (
      <div className="Administrador">
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
