import React from 'react';
import './Superadmin.css';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Button } from 'reactstrap';
import CRUDAdmin from './CRUDAdmin';
import Login from './Login';
import UserMenu from './UserMenu';
import DancingCat from './DancingCat';

function Superadmin() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const handleVolver = () => {
        navigate(-1); // Volver a la vista anterior
    };
    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    if (localStorage.getItem('tipo_usuario') !== 'superadmin') {
        return (
            <div>
              <DancingCat />
              <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
                No tienes permisos para ver esta página
              </p>
              <FormGroup className="text-center">
            <button color="primary" onClick={handleVolver}>
              Volver
            </button>
          </FormGroup>
            </div>
        );
    }

    return (
        <div className='SuperAdmin'>
            <h1>¡Hola, superadministrador!</h1>
            <UserMenu handleLogout={handleLogout}/>
            <CRUDAdmin />
        </div>
    );

    
}

export default Superadmin;