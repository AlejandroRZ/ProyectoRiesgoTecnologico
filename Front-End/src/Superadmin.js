import React from 'react';
import './Superadmin.css';
import { useNavigate } from 'react-router-dom';
import CRUDAdmin from './CRUDAdmin';
import Login from './Login';

function Superadmin() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    if (localStorage.getItem('tipo_usuario') !== 'superadmin') {
        return('No tienes permisos para ver esta página.')
    }

    return (
        <div className='SuperAdmin'>
            <h1>¡Hola, superadministrador!</h1>
            <CRUDAdmin />
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default Superadmin;