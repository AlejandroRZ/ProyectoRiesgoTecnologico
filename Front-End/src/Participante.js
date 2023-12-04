import React from 'react';
import './Participante.css';
import { useNavigate } from 'react-router-dom';
import VistaTorneos from './VistaTorneos';
import Login from './Login';

function Participante() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    if (localStorage.getItem('tipo_usuario') !== 'participante') {
        return('No tienes permisos para ver esta página.')
    }

    return (
        <div className="Participante">
            <h1>¡Hola, participante!</h1>
            Estos son los torneos disponibles:
            <VistaTorneos />
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default Participante;