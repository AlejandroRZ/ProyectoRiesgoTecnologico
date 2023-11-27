import React from 'react';
import './Participante.css';
import { useNavigate } from 'react-router-dom';

function Participante() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="Participante">
            <h1>¡Bienvenido Participante!</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default Participante;