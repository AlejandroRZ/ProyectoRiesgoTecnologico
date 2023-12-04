import React from 'react';
import './Administrador.css';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Button } from 'reactstrap';
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
            <h1>¡Hola, administrador!</h1>
            <CRUDTorneo />
            <FormGroup className="mb-3 text-center">
                <Button color="primary" onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </FormGroup>
        </div>
    );
}

export default Administrador;