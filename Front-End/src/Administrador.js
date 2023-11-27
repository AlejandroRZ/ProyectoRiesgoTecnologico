import React from 'react';
import './Administrador.css';
import { useNavigate } from 'react-router-dom';
import CRUDTorneo from './CRUDTorneo';
import Login from './Login';

function Administrador() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    if (localStorage.getItem('tipo_usuario') !== 'administrador') {
        return('No tienes permisos para ver esta página.')
    }

    return (
        <div className='Administrador'>
            <h1>¡Bienvenido Administrador!</h1>
            <CRUDTorneo />
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default Administrador;